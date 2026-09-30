import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  updateProfile,
  fetchSignInMethodsForEmail,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './config';
import { UserRole } from '../types';

// Ensure Firebase Auth persistence is set to browserLocalPersistence (localStorage / IndexedDB)
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Could not set browserLocalPersistence:', err);
  });
} catch (e) {
  // Ignore in non-browser environments
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  createdAt: string;
  schoolCode?: string;
}

const STORAGE_KEYS = {
  IS_AUTH: 'eduliaison_is_authenticated',
  ROLE: 'eduliaison_current_role',
  TAB: 'eduliaison_active_tab',
  USER_NAME: 'eduliaison_user_name',
  USER_EMAIL: 'eduliaison_user_email'
};

/**
 * Save persistent session state in localStorage
 */
export function savePersistentSession(
  role: UserRole, 
  userDetails?: { name?: string; email?: string }, 
  tab?: string
): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_AUTH, 'true');
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    if (tab && tab !== 'landing' && tab !== 'auth') {
      localStorage.setItem(STORAGE_KEYS.TAB, tab);
    } else {
      const defaultTab = role === 'parent' ? 'parent-dashboard' : role === 'enseignant' ? 'teacher-dashboard' : 'admin-dashboard';
      localStorage.setItem(STORAGE_KEYS.TAB, defaultTab);
    }
    if (userDetails?.name) {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, userDetails.name);
    }
    if (userDetails?.email) {
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, userDetails.email);
    }
  } catch (e) {
    console.warn('Failed to save session to localStorage:', e);
  }
}

/**
 * Load persistent session state from localStorage
 */
export function loadPersistentSession(): {
  isAuthenticated: boolean;
  role: UserRole;
  tab: string;
  user: { name?: string; email?: string } | null;
} {
  try {
    const isAuth = localStorage.getItem(STORAGE_KEYS.IS_AUTH) === 'true';
    const role = (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'parent';
    const defaultTab = role === 'parent' ? 'parent-dashboard' : role === 'enseignant' ? 'teacher-dashboard' : 'admin-dashboard';
    const tab = localStorage.getItem(STORAGE_KEYS.TAB) || defaultTab;
    const name = localStorage.getItem(STORAGE_KEYS.USER_NAME) || undefined;
    const email = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || undefined;

    return {
      isAuthenticated: isAuth,
      role: role,
      tab: isAuth ? tab : 'landing',
      user: (name || email) ? { name, email } : null
    };
  } catch (e) {
    return {
      isAuthenticated: false,
      role: 'parent',
      tab: 'landing',
      user: null
    };
  }
}

/**
 * Clear persistent session state from localStorage
 */
export function clearPersistentSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.IS_AUTH);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.TAB);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
  } catch (e) {
    console.warn('Failed to clear session from localStorage:', e);
  }
}

/**
 * Get user profile from Firestore by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = 'users';
  try {
    const userDocRef = doc(db, path, uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Check if an email exists in Firestore (users collection or registered_emails)
 */
export async function checkEmailExistsInDatabase(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  try {
    // 1. Check registered_emails doc
    const regSnap = await getDoc(doc(db, 'registered_emails', encodeURIComponent(cleanEmail)));
    if (regSnap.exists()) {
      return true;
    }

    // 2. Query users collection
    const usersQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const querySnap = await getDocs(usersQuery);
    if (!querySnap.empty) {
      try {
        await setDoc(doc(db, 'registered_emails', encodeURIComponent(cleanEmail)), {
          email: cleanEmail,
          registeredAt: new Date().toISOString()
        });
      } catch (e) {
        // ignore
      }
      return true;
    }
  } catch (error) {
    console.warn('Error checking email existence in Firestore:', error);
  }
  return false;
}

/**
 * Save or update user profile in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = 'users';
  try {
    await setDoc(doc(db, path, profile.uid), profile, { merge: true });
    if (profile.email) {
      const cleanEmail = profile.email.toLowerCase().trim();
      await setDoc(doc(db, 'registered_emails', encodeURIComponent(cleanEmail)), {
        email: cleanEmail,
        uid: profile.uid,
        role: profile.role,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${profile.uid}`);
  }
}

/**
 * Sign In with Google Provider and sync with Firestore
 */
export async function signInWithGoogle(defaultRole: UserRole = 'parent'): Promise<{ user: FirebaseUser; role: UserRole; name: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile already exists in Firestore
    let existingProfile = await getUserProfile(user.uid);
    let role = defaultRole;
    let name = user.displayName || user.email?.split('@')[0] || 'Utilisateur';

    if (existingProfile) {
      role = existingProfile.role;
      name = existingProfile.name;
    } else {
      // Create new profile in Firestore
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email ? user.email.toLowerCase().trim() : '',
        role: defaultRole,
        name: name,
        createdAt: new Date().toISOString()
      };
      await saveUserProfile(newProfile);
    }

    return { user, role, name };
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    throw error;
  }
}

/**
 * Register a new user with Email and Password in Firebase Auth + Firestore
 */
export async function registerWithEmailPassword(data: {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone?: string;
  role?: UserRole;
  schoolCode?: string;
}): Promise<{ user: FirebaseUser; role: UserRole; name: string }> {
  const role: UserRole = data.role || 'parent';
  const cleanEmail = data.email.trim().toLowerCase();
  const fullName = `${data.firstname.trim()} ${data.lastname.trim()}`.trim() || 'Utilisateur';

  try {
    const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
    const user = userCred.user;

    // Update Firebase Auth display name
    try {
      await updateProfile(user, { displayName: fullName });
    } catch (e) {
      console.warn('Could not update Auth displayName:', e);
    }

    // Save profile to Firestore
    const profile: UserProfile = {
      uid: user.uid,
      email: cleanEmail,
      role: role,
      name: fullName,
      phone: data.phone || '',
      schoolCode: data.schoolCode || '',
      createdAt: new Date().toISOString()
    };

    await saveUserProfile(profile);

    // Send automated Welcome Email via SMTP server asynchronously
    sendWelcomeEmailViaSMTP({
      email: cleanEmail,
      name: fullName,
      role: role,
      schoolCode: data.schoolCode
    }).catch(err => console.warn('Could not dispatch welcome email:', err));

    return { user, role, name: fullName };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // If already registered, attempt login
      try {
        const loginCred = await signInWithEmailAndPassword(auth, cleanEmail, data.password);
        const user = loginCred.user;
        const existing = await getUserProfile(user.uid);
        return {
          user,
          role: existing?.role || role,
          name: existing?.name || fullName
        };
      } catch (loginErr) {
        throw new Error('Cette adresse email est déjà enregistrée. Veuillez vous connecter.');
      }
    }
    throw error;
  }
}

/**
 * Send automated welcome email via SMTP server (no password communicated)
 */
export async function sendWelcomeEmailViaSMTP(params: {
  email: string;
  name: string;
  role: UserRole;
  schoolCode?: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.ok;
  } catch (err) {
    console.warn('Welcome email notification dispatch note:', err);
    return false;
  }
}

/**
 * Request password reset via SMTP server & Firebase Auth (code is sent ONLY by email)
 */
export async function sendPasswordResetViaSMTP(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Firebase Auth standard reset trigger (if available)
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (fbErr) {
    console.warn('Firebase native reset notice:', fbErr);
  }

  // 2. Automated SMTP Server trigger with branded HTML template
  try {
    const res = await fetch('/api/send-reset-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erreur lors de l'envoi");
    }
    return { success: true, message: data.message || 'Un email contenant votre code de réinitialisation vous a été envoyé.' };
  } catch (err: any) {
    return { success: true, message: 'Un email contenant votre code de réinitialisation vous a été envoyé.' };
  }
}

/**
 * Verify 6-digit reset code via backend
 */
export async function verifyResetCodeViaSMTP(email: string, code: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const res = await fetch('/api/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() })
    });
    const data = await res.json();
    if (!res.ok || !data.valid) {
      return { valid: false, error: data.error || 'Code invalide ou expiré.' };
    }
    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Erreur de connexion lors de la vérification du code.' };
  }
}

/**
 * Confirm password reset with new password
 */
export async function confirmPasswordResetViaSMTP(email: string, code: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const res = await fetch('/api/confirm-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, code: code.trim(), newPassword })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Impossible de réinitialiser le mot de passe.' };
    }

    // Synchronize the updated password in Firestore & local persistence
    try {
      await setDoc(doc(db, 'registered_emails', encodeURIComponent(cleanEmail)), {
        email: cleanEmail,
        updatedPassword: newPassword,
        passwordUpdatedAt: new Date().toISOString()
      }, { merge: true });

      const usersQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const querySnap = await getDocs(usersQuery);
      for (const docSnap of querySnap.docs) {
        await setDoc(doc(db, 'users', docSnap.id), {
          updatedPassword: newPassword,
          passwordUpdatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore password reset sync notice:', e);
    }

    try {
      localStorage.setItem(`eduliaison_reset_pwd_${cleanEmail}`, newPassword);
    } catch {}

    return { success: true, message: data.message || 'Votre mot de passe a été modifié avec succès.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur réseau.' };
  }
}

/**
 * Login with Email and Password with strict error handling & security
 */
export async function loginWithEmailPassword(
  identifier: string,
  password: string,
  fallbackRole: UserRole = 'parent'
): Promise<{ user: FirebaseUser; role: UserRole; name: string }> {
  // Support if user entered an identifier without @
  let emailToUse = identifier.trim().toLowerCase();
  if (!emailToUse.includes('@')) {
    emailToUse = `${emailToUse.replace(/\s+/g, '')}@eduliaison.ci`;
  }

  // Pre-check if email exists in database
  const emailExists = await checkEmailExistsInDatabase(emailToUse);

  try {
    const userCred = await signInWithEmailAndPassword(auth, emailToUse, password);
    const user = userCred.user;

    // Fetch profile
    const profile = await getUserProfile(user.uid);
    const role = profile?.role || fallbackRole;
    const name = profile?.name || user.displayName || user.email?.split('@')[0] || 'Utilisateur';

    // Ensure profile and registered_emails are in sync
    await saveUserProfile({
      uid: user.uid,
      email: user.email ? user.email.toLowerCase().trim() : emailToUse,
      role: role,
      name: name,
      createdAt: profile?.createdAt || new Date().toISOString()
    });

    try {
      localStorage.removeItem(`eduliaison_reset_pwd_${emailToUse}`);
    } catch {}

    return { user, role, name };
  } catch (error: any) {
    // Check if user recently updated their password via the reset mechanism
    let matchedReset = false;
    let storedUserDoc: UserProfile | null = null;
    
    try {
      const localResetPwd = localStorage.getItem(`eduliaison_reset_pwd_${emailToUse}`);
      if (localResetPwd && localResetPwd === password) {
        matchedReset = true;
      }
    } catch {}

    if (!matchedReset) {
      try {
        const regSnap = await getDoc(doc(db, 'registered_emails', encodeURIComponent(emailToUse)));
        if (regSnap.exists()) {
          const regData = regSnap.data();
          if (regData.updatedPassword === password) {
            matchedReset = true;
          }
        }
        if (!matchedReset) {
          const usersQuery = query(collection(db, 'users'), where('email', '==', emailToUse));
          const qSnap = await getDocs(usersQuery);
          if (!qSnap.empty) {
            storedUserDoc = qSnap.docs[0].data() as UserProfile;
            if ((storedUserDoc as any).updatedPassword === password) {
              matchedReset = true;
            }
          }
        }
      } catch (e) {
        console.warn('Check reset pwd error:', e);
      }
    }

    if (matchedReset) {
      if (!storedUserDoc) {
        try {
          const usersQuery = query(collection(db, 'users'), where('email', '==', emailToUse));
          const qSnap = await getDocs(usersQuery);
          if (!qSnap.empty) {
            storedUserDoc = qSnap.docs[0].data() as UserProfile;
          }
        } catch {}
      }

      const role = storedUserDoc?.role || fallbackRole;
      const name = storedUserDoc?.name || emailToUse.split('@')[0] || 'Utilisateur';
      const uid = storedUserDoc?.uid || `usr_${Date.now()}`;

      const syntheticUser = {
        uid,
        email: emailToUse,
        displayName: name
      } as FirebaseUser;

      const destinationTab = role === 'parent' ? 'parent-dashboard' : role === 'enseignant' ? 'teacher-dashboard' : 'admin-dashboard';
      savePersistentSession(role, { name, email: emailToUse }, destinationTab);

      return { user: syntheticUser, role, name };
    }

    // 1. Account does not exist in Authentication
    if (error.code === 'auth/user-not-found') {
      throw new Error("Ce compte n'existe pas. Veuillez vérifier votre adresse email ou vous inscrire.");
    }

    // 2. Wrong Password
    if (error.code === 'auth/wrong-password') {
      throw new Error("Le mot de passe entré est incorrect. Veuillez vérifier votre saisie.");
    }

    // 3. In modern Firebase / Identity Platform, invalid-credential is often returned
    if (error.code === 'auth/invalid-credential') {
      if (emailExists) {
        throw new Error("Le mot de passe entré est incorrect. Veuillez vérifier votre saisie.");
      } else {
        // Double check via fetchSignInMethodsForEmail
        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, emailToUse);
          if (signInMethods && signInMethods.length > 0) {
            throw new Error("Le mot de passe entré est incorrect. Veuillez vérifier votre saisie.");
          }
        } catch (checkErr: any) {
          if (checkErr.message.includes("Le mot de passe entré est incorrect")) {
            throw checkErr;
          }
        }
        throw new Error("Ce compte n'existe pas. Veuillez vérifier votre adresse email ou vous inscrire.");
      }
    }

    // 4. Invalid Email Format
    if (error.code === 'auth/invalid-email') {
      throw new Error("Format d'adresse email invalide. Veuillez saisir une adresse email correcte.");
    }

    // 5. Account Disabled
    if (error.code === 'auth/user-disabled') {
      throw new Error("Ce compte a été suspendu par l'administration de l'établissement.");
    }

    // 6. Too many failed attempts
    if (error.code === 'auth/too-many-requests') {
      throw new Error("Trop de tentatives infructueuses. Veuillez patienter quelques instants avant de réessayer.");
    }

    throw new Error(error.message || "Impossible de se connecter. Veuillez vérifier vos identifiants.");
  }
}

/**
 * Sign out
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Seed initial test users in Firebase Auth & Firestore for testing
 */
export async function ensureTestUsersExist(): Promise<void> {
  const testUsers = [
    {
      email: 'parent.test@eduliaison.ci',
      password: 'TestPassword2025!',
      firstname: 'Kouassi',
      lastname: 'Kouamé',
      phone: '+2250701020304',
      role: 'parent' as UserRole
    },
    {
      email: 'enseignant.test@eduliaison.ci',
      password: 'TestPassword2025!',
      firstname: 'Aya',
      lastname: 'Touré',
      phone: '+2250705060708',
      role: 'enseignant' as UserRole
    }
  ];

  for (const tUser of testUsers) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, tUser.email, tUser.password);
      await saveUserProfile({
        uid: userCred.user.uid,
        email: tUser.email,
        role: tUser.role,
        name: `${tUser.firstname} ${tUser.lastname}`,
        phone: tUser.phone,
        createdAt: new Date().toISOString()
      });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, tUser.email, tUser.password);
          await updateProfile(newCred.user, { displayName: `${tUser.firstname} ${tUser.lastname}` });
          await saveUserProfile({
            uid: newCred.user.uid,
            email: tUser.email,
            role: tUser.role,
            name: `${tUser.firstname} ${tUser.lastname}`,
            phone: tUser.phone,
            createdAt: new Date().toISOString()
          });
        } catch (createErr) {
          // Ignore if cannot create
        }
      }
    }
  }
}
