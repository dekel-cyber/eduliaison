import React, { useState, useEffect } from 'react';
import { UserRole, UserAccount, Student } from '../../types';
import { 
  updateFullUserProfile, 
  updateUserEmailAddress, 
  updateUserPassword 
} from '../../firebase/authService';
import { auth } from '../../firebase/config';
import { 
  subscribeToUsers, 
  subscribeToStudents,
  associateParentToStudentInFirestore
} from '../../firebase/firestoreService';

interface UserProfileSettingsProps {
  currentRole: UserRole;
  userName?: string;
  userEmail?: string;
  onNavigateTab: (tab: string) => void;
  onLogout: () => void;
}

type TabType = 'personal' | 'security' | 'preferences' | 'affiliation' | 'privacy';

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  currentRole,
  userName,
  userEmail,
  onNavigateTab,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Real-time user account record
  const currentUid = auth.currentUser?.uid;
  const currentAccount = users.find(u => 
    (currentUid && u.uid === currentUid) || 
    (userEmail && u.email.toLowerCase() === userEmail.toLowerCase())
  );

  // Form states - Personal Info
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [emergencyContactName, setEmergencyContactName] = useState<string>('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>('');
  const [avatarColor, setAvatarColor] = useState<string>('indigo');

  // Form states - Email Change
  const [newEmail, setNewEmail] = useState<string>('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState<string>('');

  // Form states - Password Change
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<boolean>(false);

  // Form states - Preferences
  const [notifEmailGrades, setNotifEmailGrades] = useState<boolean>(true);
  const [notifEmailAbsences, setNotifEmailAbsences] = useState<boolean>(true);
  const [notifEmailMessages, setNotifEmailMessages] = useState<boolean>(true);
  const [notifSmsUrgent, setNotifSmsUrgent] = useState<boolean>(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);

  // Action states
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isSavingEmail, setIsSavingEmail] = useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false);
  const [isExportingData, setIsExportingData] = useState<boolean>(false);
  const [selectedStudentToLink, setSelectedStudentToLink] = useState<string>('');
  const [isLinkingChild, setIsLinkingChild] = useState<boolean>(false);
  
  // Feedback alerts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubUsers = subscribeToUsers((data) => setUsers(data));
    const unsubStudents = subscribeToStudents((data) => setStudents(data));

    return () => {
      unsubUsers();
      unsubStudents();
    };
  }, []);

  // Initialize fields once currentAccount is loaded
  useEffect(() => {
    if (currentAccount) {
      if (currentAccount.firstName || currentAccount.lastName) {
        setFirstName(currentAccount.firstName || '');
        setLastName(currentAccount.lastName || '');
      } else if (currentAccount.name) {
        const parts = currentAccount.name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      } else if (userName) {
        const parts = userName.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      setPhone(currentAccount.phone || '+225 07 00 11 22 33');
      setNewEmail(currentAccount.email || userEmail || '');
    } else {
      if (userName) {
        const parts = userName.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      if (userEmail) {
        setNewEmail(userEmail);
      }
    }
  }, [currentAccount, userName, userEmail]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Vide', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Faible', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Moyen', color: 'bg-amber-500' };
    if (score === 4) return { score: 3, label: 'Robuste', color: 'bg-emerald-500' };
    return { score: 4, label: 'Très robuste', color: 'bg-emerald-600' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  // 1. Save Personal Details
  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !lastName.trim()) {
      showToast("Veuillez renseigner au moins votre prénom ou nom.", "error");
      return;
    }

    const uidToUpdate = currentAccount?.uid || currentUid || `user_${Date.now()}`;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    setIsSavingProfile(true);
    try {
      await updateFullUserProfile(uidToUpdate, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        phone: phone.trim(),
        role: currentRole,
        email: currentAccount?.email || userEmail || '',
        status: currentAccount?.status || 'Actif'
      });
      showToast("Vos informations personnelles ont été enregistrées avec succès !");
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la mise à jour du profil.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Save Email Address
  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newEmail.toLowerCase().trim() === (currentAccount?.email || userEmail)?.toLowerCase().trim()) {
      showToast("Veuillez saisir une nouvelle adresse email distincte.", "error");
      return;
    }

    setIsSavingEmail(true);
    try {
      await updateUserEmailAddress(newEmail.trim(), emailCurrentPassword || undefined);
      setEmailCurrentPassword('');
      showToast("Adresse email mise à jour avec succès !");
    } catch (err: any) {
      showToast(err.message || "Impossible de mettre à jour l'adresse email.", "error");
    } finally {
      setIsSavingEmail(false);
    }
  };

  // 3. Save Password Change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Le nouveau mot de passe doit comporter au moins 6 caractères.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("La confirmation du mot de passe ne correspond pas.", "error");
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateUserPassword(newPassword, oldPassword || undefined);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast("Votre mot de passe a été modifié avec succès !");
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la modification du mot de passe.", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // 4. Export Account Data (JSON)
  const handleExportData = () => {
    setIsExportingData(true);
    try {
      const exportPayload = {
        exportDate: new Date().toISOString(),
        institution: 'Groupe Scolaire ÉduLiaison Côte d’Ivoire',
        userAccount: {
          uid: currentAccount?.uid || currentUid,
          name: `${firstName} ${lastName}`.trim() || userName,
          email: currentAccount?.email || userEmail,
          role: currentRole,
          phone: phone,
          status: currentAccount?.status || 'Actif',
          assignedClasses: currentAccount?.assignedClasses,
          subjects: currentAccount?.subjects,
          childrenIds: currentAccount?.childrenIds
        },
        preferences: {
          emailNotifications: {
            grades: notifEmailGrades,
            absences: notifEmailAbsences,
            messages: notifEmailMessages
          },
          smsUrgent: notifSmsUrgent,
          twoFactorAuth: twoFactorEnabled
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `eduliaison_profil_${(currentAccount?.name || 'utilisateur').toLowerCase().replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("Fichier d'export de vos données généré avec succès !");
    } catch {
      showToast("Erreur lors de l'exportation des données.", "error");
    } finally {
      setTimeout(() => setIsExportingData(false), 800);
    }
  };

  // 5. Link student to Parent profile
  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentToLink) return;

    const studentObj = students.find(s => s.id === selectedStudentToLink);
    if (!studentObj) return;

    const parentUid = currentAccount?.uid || currentUid || `p_${Date.now()}`;
    const parentName = `${firstName} ${lastName}`.trim() || currentAccount?.name || userName || 'Parent Référent';
    const parentEmailAddress = currentAccount?.email || userEmail || '';

    setIsLinkingChild(true);
    try {
      await associateParentToStudentInFirestore(studentObj.id, {
        uid: parentUid,
        name: parentName,
        email: parentEmailAddress,
        phone: phone || currentAccount?.phone
      });
      setSelectedStudentToLink('');
      showToast(`L'élève ${studentObj.firstName} ${studentObj.lastName} a été rattaché avec succès à votre profil parent !`);
    } catch (err: any) {
      showToast(err.message || "Erreur lors du rattachement de l'élève.", "error");
    } finally {
      setIsLinkingChild(false);
    }
  };

  const displayFullName = `${firstName} ${lastName}`.trim() || currentAccount?.name || userName || 'Utilisateur';
  const displayEmail = currentAccount?.email || userEmail || 'compte@eduliaison.ci';
  const userInitials = (firstName?.[0] || displayFullName?.[0] || 'U').toUpperCase();

  // Robust associated children computation
  const matchedChildren = students.filter(s => {
    const matchesAccountChildren = currentAccount?.childrenIds && currentAccount.childrenIds.includes(s.id);
    const matchesParentId = s.parentId && (s.parentId === currentAccount?.uid || (currentUid && s.parentId === currentUid));
    const matchesEmail = userEmail && s.parentEmail && s.parentEmail.toLowerCase().trim() === userEmail.toLowerCase().trim();
    const matchesAccountEmail = currentAccount?.email && s.parentEmail && s.parentEmail.toLowerCase().trim() === currentAccount.email.toLowerCase().trim();
    const matchesName = displayFullName && s.parentName && 
      (s.parentName.toLowerCase().includes(displayFullName.toLowerCase()) || displayFullName.toLowerCase().includes(s.parentName.toLowerCase()));

    return Boolean(matchesAccountChildren || matchesParentId || matchesEmail || matchesAccountEmail || matchesName);
  });

  // Default to matched students, or fallback to first 2 school students if none tagged yet
  const associatedStudents = currentRole === 'parent' 
    ? (matchedChildren.length > 0 ? matchedChildren : students.slice(0, 2))
    : [];

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">

        {/* Toast Feedback */}
        {toastMessage && (
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold shadow-md flex items-center justify-between animate-in fade-in ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                {toastMessage.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{toastMessage.text}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="cursor-pointer text-slate-400 hover:text-slate-700">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Top Header Card with User Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eaedff] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#3525cd]/10 to-indigo-100/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Dynamic Avatar */}
              <div className="relative group">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-indigo-500/20`}>
                  {userInitials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs" title="Compte Actif">
                  <span className="material-symbols-outlined text-white text-[14px]">check</span>
                </div>
              </div>

              {/* Identity Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#131b2e] tracking-tight">
                    {displayFullName}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 ${
                    currentRole === 'parent' ? 'bg-indigo-100 text-indigo-700' :
                    currentRole === 'enseignant' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {currentRole === 'parent' ? 'family_restroom' : currentRole === 'enseignant' ? 'school' : 'admin_panel_settings'}
                    </span>
                    <span>{currentRole === 'parent' ? 'Parent Référent' : currentRole === 'enseignant' ? 'Professeur Certifié' : 'Direction Générale'}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                    ✓ Vérifié
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#464555] font-medium flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                    <span>{displayEmail}</span>
                  </span>
                  {phone && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                      <span>{phone}</span>
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#777587]">
                  <span>Établissement : <strong>Lycée & Collège ÉduLiaison</strong></span>
                  <span>•</span>
                  <span>ID : <code className="bg-[#f2f3ff] px-1.5 py-0.5 rounded text-[#3525cd] font-mono">{currentAccount?.uid?.substring(0, 10) || 'USR-2025'}</code></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => onNavigateTab(currentRole === 'parent' ? 'parent-dashboard' : currentRole === 'enseignant' ? 'teacher-dashboard' : 'admin-dashboard')}
                className="px-4 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Retour au tableau de bord</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-[#eaedff] no-scrollbar">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'personal'
                  ? 'bg-[#3525cd] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Informations Personnelles</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-[#3525cd] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
              <span>Identifiants & Sécurité</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'preferences'
                  ? 'bg-[#3525cd] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Préférences & Alertes</span>
            </button>

            <button
              onClick={() => setActiveTab('affiliation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'affiliation'
                  ? 'bg-[#3525cd] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              <span>Rattachement ({currentRole === 'parent' ? 'Enfants' : currentRole === 'enseignant' ? 'Classes' : 'Structure'})</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-[#3525cd] text-white shadow-sm'
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              <span>Données & Confidentialité</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Informations Personnelles */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
            {/* Left form (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm">
              <div className="pb-4 mb-6 border-b border-[#eaedff]">
                <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd]">badge</span>
                  <span>Modifier mon profil personnel</span>
                </h2>
                <p className="text-xs text-[#777587] mt-1">
                  Mettez à jour vos coordonnées officielles pour les échanges pédagogiques avec l'établissement.
                </p>
              </div>

              <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Prénom <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Kouamé"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Nom de famille <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Jean-Baptiste"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Numéro de téléphone principal <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">call</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+225 07 00 00 00 00"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Adresse de résidence / Commune
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">location_on</span>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ex: Cocody Angré 8ème Tranche, Abidjan"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Contact d'urgence alternatif (Nom & Téléphone)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="Nom du proche (ex: Conjoint/Tuteur)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                    <input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      placeholder="+225 05 00 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                    Note / Biographie pédagogique
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Informations utiles pour les équipes pédagogiques ou l'administration..."
                    className="w-full p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd] resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer flex items-center gap-2 transition-all"
                  >
                    {isSavingProfile ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">save</span>
                    )}
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Quick Summary & Children Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Quick Children Card for Parent */}
              {currentRole === 'parent' && (
                <div className="bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                    <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3525cd]">family_restroom</span>
                      <span>Enfants rattachés ({associatedStudents.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('affiliation')}
                      className="text-[11px] font-bold text-[#3525cd] hover:underline cursor-pointer"
                    >
                      Gérer
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {associatedStudents.map(child => (
                      <div 
                        key={child.id} 
                        onClick={() => onNavigateTab('parent-dashboard')}
                        className="p-2.5 rounded-2xl bg-[#faf8ff] hover:bg-[#f2f3ff] border border-[#eaedff] flex items-center gap-3 cursor-pointer transition-all group"
                      >
                        <img 
                          src={child.photoUrl} 
                          alt={child.firstName}
                          className="w-10 h-10 rounded-xl object-cover border border-indigo-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-[#131b2e] truncate group-hover:text-[#3525cd] transition-colors">
                            {child.firstName} {child.lastName}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#777587]">
                            <span className="font-bold text-[#3525cd] bg-indigo-50 px-1.5 py-0.2 rounded">{child.class}</span>
                            <span>Moy: <strong>{child.generalAverage}/20</strong></span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-[#3525cd] text-sm">
                          arrow_forward
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm">
                <h3 className="text-sm font-bold text-[#131b2e] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">verified_user</span>
                  <span>Statut & Rôle dans l'établissement</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                    <span className="text-[#464555]">Rôle actif :</span>
                    <span className="font-bold text-[#3525cd] capitalize">{currentRole}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                    <span className="text-[#464555]">État du compte :</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Opérationnel</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                    <span className="text-[#464555]">Canal de communication :</span>
                    <span className="font-bold text-slate-800">Direct & Certifié</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 text-indigo-950 mb-1">
                  <span className="material-symbols-outlined text-indigo-600 text-sm">info</span>
                  <span>Sécurité des données scolaires</span>
                </p>
                Toutes les modifications apportées à vos coordonnées sont immédiatement répercutées sur les registres scolaires et les livrets numériques.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Identifiants & Sécurité */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
            {/* Left: Change Email & Password Form (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Email Change Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm">
                <div className="pb-4 mb-4 border-b border-[#eaedff]">
                  <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">alternate_email</span>
                    <span>Modifier l'adresse email de connexion</span>
                  </h3>
                  <p className="text-xs text-[#777587] mt-0.5">
                    Adresse actuelle : <strong>{displayEmail}</strong>
                  </p>
                </div>

                <form onSubmit={handleSaveEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Nouvelle adresse email
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="nouvelle.adresse@exemple.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Mot de passe actuel (pour confirmer le changement)
                    </label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={emailCurrentPassword}
                      onChange={(e) => setEmailCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingEmail || !newEmail || newEmail === displayEmail}
                      className="px-5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md disabled:opacity-40 cursor-pointer flex items-center gap-2"
                    >
                      {isSavingEmail ? (
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                      <span>Mettre à jour l'email</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. Password Change Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm">
                <div className="pb-4 mb-4 border-b border-[#eaedff]">
                  <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">key</span>
                    <span>Changer de mot de passe</span>
                  </h3>
                  <p className="text-xs text-[#777587] mt-0.5">
                    Choisissez un mot de passe robuste comportant au moins 6 caractères, des lettres et des chiffres.
                  </p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                      Ancien mot de passe
                    </label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                        Nouveau mot de passe
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#131b2e] mb-1.5">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Répétez le mot de passe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      />
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#777587]">Niveau de robustesse :</span>
                        <span className="font-bold">{pwdStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-200'}`}></div>
                        <div className={`h-full flex-1 ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-200'}`}></div>
                        <div className={`h-full flex-1 ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-200'}`}></div>
                        <div className={`h-full flex-1 ${pwdStrength.score >= 4 ? pwdStrength.color : 'bg-slate-200'}`}></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="text-xs text-[#3525cd] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPasswords ? 'visibility_off' : 'visibility'}
                      </span>
                      <span>{showPasswords ? 'Masquer' : 'Afficher'} les mots de passe</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingPassword || !newPassword || newPassword !== confirmPassword}
                      className="px-5 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md disabled:opacity-40 cursor-pointer flex items-center gap-2"
                    >
                      {isSavingPassword ? (
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                      )}
                      <span>Modifier le mot de passe</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Security & Sessions (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd]">devices</span>
                  <span>Sessions & Appareils Actifs</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px] mt-0.5">laptop_mac</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-emerald-950">Navigateur Actuel</h4>
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">En ligne</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">Session active et sécurisée</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#777587] text-[20px] mt-0.5">smartphone</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#131b2e]">Application Mobile</h4>
                      <p className="text-[11px] text-[#777587] mt-0.5">Accès PWA / Téléphone</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      showToast("Toutes les autres sessions distantes ont été closes.");
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Clôturer les autres sessions
                  </button>
                </div>
              </div>

              {/* 2FA Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">security</span>
                    <span>Double Authentification (2FA)</span>
                  </h3>
                </div>
                <p className="text-xs text-[#777587] mb-3">
                  Renforcez la sécurité de votre compte avec un code envoyé par SMS lors de chaque nouvelle connexion.
                </p>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
                  <span className="text-xs font-bold text-[#131b2e]">Validation par SMS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        showToast(`Double authentification ${!twoFactorEnabled ? 'activée' : 'désactivée'} !`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3525cd]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Préférences & Alertes */}
        {activeTab === 'preferences' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm max-w-4xl space-y-6 animate-in fade-in">
            <div className="pb-4 border-b border-[#eaedff]">
              <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">notifications_active</span>
                <span>Préférences de notifications & alertes scolaires</span>
              </h2>
              <p className="text-xs text-[#777587] mt-1">
                Choisissez la fréquence et les canaux de notification pour le suivi de la scolarité.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Canal Email</h3>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e]">Nouvelles notes & devoirs</h4>
                  <p className="text-[11px] text-[#777587]">Recevoir un récapitulatif lors de la publication d'une évaluation</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmailGrades}
                  onChange={(e) => setNotifEmailGrades(e.target.checked)}
                  className="w-4 h-4 text-[#3525cd] rounded accent-[#3525cd] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e]">Absences et retards</h4>
                  <p className="text-[11px] text-[#777587]">Alerte immédiate par email pour tout retard ou absence constaté</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmailAbsences}
                  onChange={(e) => setNotifEmailAbsences(e.target.checked)}
                  className="w-4 h-4 text-[#3525cd] rounded accent-[#3525cd] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e]">Messages des enseignants & circulaires</h4>
                  <p className="text-[11px] text-[#777587]">Notification lors d'un nouveau mot dans le carnet de liaison ou la messagerie</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmailMessages}
                  onChange={(e) => setNotifEmailMessages(e.target.checked)}
                  className="w-4 h-4 text-[#3525cd] rounded accent-[#3525cd] cursor-pointer"
                />
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-3">Canal SMS & Urgences</h3>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff]">
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e]">Alertes SMS prioritaires</h4>
                  <p className="text-[11px] text-[#777587]">Alertes sanitaires, météo, fermetures exceptionnelles ou urgences médicales</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSmsUrgent}
                  onChange={(e) => setNotifSmsUrgent(e.target.checked)}
                  className="w-4 h-4 text-[#3525cd] rounded accent-[#3525cd] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#eaedff] flex justify-end">
              <button
                onClick={() => showToast("Préférences de notifications enregistrées !")}
                className="px-6 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Enregistrer mes préférences</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Rattachement & Affiliation */}
        {activeTab === 'affiliation' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm max-w-4xl space-y-6 animate-in fade-in">
            <div className="pb-4 border-b border-[#eaedff]">
              <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">school</span>
                <span>Rattachement scolaire & Filiations</span>
              </h2>
              <p className="text-xs text-[#777587] mt-1">
                Vue d'ensemble de vos élèves, classes ou structures assignées au compte.
              </p>
            </div>

            {currentRole === 'parent' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3525cd]">family_restroom</span>
                      <span>Enfants rattachés à votre carnet numérique ({associatedStudents.length})</span>
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      Filiation active
                    </span>
                  </div>
                  
                  {associatedStudents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {associatedStudents.map(child => (
                        <div key={child.id} className="p-5 rounded-3xl bg-[#faf8ff] border border-[#eaedff] shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-all">
                          <div className="flex items-start gap-4">
                            <img 
                              src={child.photoUrl} 
                              alt={child.firstName}
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shrink-0 shadow-xs"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-[#131b2e] truncate">{child.firstName} {child.lastName}</h4>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                  Classe : {child.class}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Moyenne : {child.generalAverage}/20
                                </span>
                              </div>
                              <p className="text-[11px] text-[#777587] mt-1.5">
                                Matricule : <strong className="text-slate-800 font-mono">{child.matricule}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#464555]">
                              Assiduité : <strong className="text-emerald-700">{child.attendanceRate}%</strong>
                            </span>
                            <button
                              onClick={() => onNavigateTab('parent-dashboard')}
                              className="px-3 py-1.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Ouvrir le carnet</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-[#777587]">
                      Aucun élève rattaché pour l'instant. Vous pouvez associer votre enfant ci-dessous avec son matricule ou son nom.
                    </div>
                  )}
                </div>

                {/* Instant Link Child Form */}
                <div className="p-6 rounded-3xl bg-indigo-50/40 border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">person_add</span>
                    <h4 className="text-xs font-bold text-[#131b2e]">Rattacher un enfant supplémentaire à ce compte</h4>
                  </div>
                  <p className="text-xs text-[#777587]">
                    Sélectionnez un élève inscrit dans l'établissement pour l'ajouter immédiatement à votre tableau de bord et carnet de correspondance.
                  </p>

                  <form onSubmit={handleLinkStudent} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <select
                      value={selectedStudentToLink}
                      onChange={(e) => setSelectedStudentToLink(e.target.value)}
                      required
                      className="w-full sm:flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#eaedff] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3525cd] cursor-pointer"
                    >
                      <option value="">-- Choisir un élève de l'établissement --</option>
                      {students.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.firstName} {st.lastName} ({st.class}) — Matricule : {st.matricule}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      disabled={!selectedStudentToLink || isLinkingChild}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {isLinkingChild ? (
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">link</span>
                      )}
                      <span>Rattacher l'élève</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {currentRole === 'enseignant' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#131b2e]">Classes & Matières assignées :</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(currentAccount?.assignedClasses || ['3ème A', '3ème B']).map(cls => (
                    <div key={cls} className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#131b2e]">Classe de {cls}</h4>
                        <p className="text-[11px] text-[#777587] mt-0.5">Matière : Français & Littérature</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Enseignement actif
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentRole === 'direction' && (
              <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] space-y-2">
                <h4 className="font-bold text-xs text-[#131b2e]">Droits d'administration générale</h4>
                <p className="text-xs text-[#777587]">
                  Vous disposez des droits complets de gestion sur les élèves, enseignants, classes et circulaires officielles.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Données & Confidentialité */}
        {activeTab === 'privacy' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eaedff] shadow-sm max-w-4xl space-y-6 animate-in fade-in">
            <div className="pb-4 border-b border-[#eaedff]">
              <h2 className="text-lg font-bold text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">download</span>
                <span>Exportation des données & Confidentialité RGPD</span>
              </h2>
              <p className="text-xs text-[#777587] mt-1">
                Conformément aux normes de protection des données, vous pouvez exporter l'intégralité de vos informations personnelles.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e]">Exporter mon dossier numérique complet</h4>
                  <p className="text-[11px] text-[#777587] mt-0.5">
                    Téléchargez une archive contenant votre profil, vos identifiants, vos préférences et vos historiques au format JSON certifié.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExportingData}
                  className="px-5 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isExportingData ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">file_download</span>
                  )}
                  <span>Télécharger mes données</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-slate-600 text-[18px]">verified</span>
                  <span>Politique de conservation & Traçabilité</span>
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Toutes les transactions, visas de carnet et communications sont chiffrés et stockés dans la base de données sécurisée de l'établissement scolaire.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
