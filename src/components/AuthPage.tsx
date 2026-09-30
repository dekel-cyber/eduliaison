import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  signInWithGoogle,
  sendPasswordResetViaSMTP,
  confirmPasswordResetViaSMTP 
} from '../firebase/authService';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (role: UserRole, userDetails?: { name?: string; email?: string }) => void;
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onCancel
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('parent');

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Forgot Password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify-and-reset' | 'success'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Check URL query parameters for reset link arrival
  React.useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isReset = urlParams.get('reset') === 'true' || urlParams.get('mode') === 'reset' || urlParams.has('resetCode');
      const emailInUrl = urlParams.get('email');
      if (emailInUrl) {
        setForgotEmail(emailInUrl);
      }
      if (isReset || emailInUrl) {
        if (emailInUrl) {
          setForgotStep('verify-and-reset');
        }
        setShowForgotModal(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Login form states
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form states
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+225');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Password strength calculation
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  let strengthScore = 0;
  if (hasLength) strengthScore++;
  if (hasNumber) strengthScore++;
  if (hasUppercase) strengthScore++;

  const getStrengthLabel = () => {
    if (password.length === 0) return { label: 'À saisir', color: 'text-[#777587]' };
    if (strengthScore === 1) return { label: 'Faible', color: 'text-[#ba1a1a]' };
    if (strengthScore === 2) return { label: 'Moyen', color: 'text-[#ae3115]' };
    return { label: 'Robuste', color: 'text-[#005338]' };
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await loginWithEmailPassword(loginId, loginPassword, selectedDemoRole);
      onLoginSuccess(res.role, { name: res.name, email: res.user.email || undefined });
    } catch (err: any) {
      setAuthError(err.message || 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setAuthError("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    if (password.length < 6) {
      setAuthError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await registerWithEmailPassword({
        email,
        password,
        firstname,
        lastname,
        phone: `${countryCode} ${phone}`,
        role: 'parent',
        schoolCode
      });
      setSignupSuccess(true);
      setTimeout(() => {
        onLoginSuccess(res.role, { name: res.name, email: res.user.email || undefined });
      }, 1500);
    } catch (err: any) {
      console.error('Signup error:', err);
      setAuthError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Veuillez renseigner votre adresse email.');
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);
    try {
      await sendPasswordResetViaSMTP(forgotEmail);
      setForgotSuccess(`Un email sécurisé contenant votre code à 6 chiffres et le lien de réinitialisation a été envoyé à ${forgotEmail}.`);
      setForgotStep('verify-and-reset');
    } catch (err: any) {
      setForgotError(err.message || "Impossible d'envoyer l'email de réinitialisation.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotCode) {
      setForgotError('Veuillez renseigner votre email et le code reçu par email.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    try {
      const res = await confirmPasswordResetViaSMTP(forgotEmail, forgotCode, newPassword);
      if (!res.success) {
        setForgotError(res.error || 'Code invalide ou expiré.');
      } else {
        setForgotStep('success');
        setForgotSuccess(res.message || 'Votre mot de passe a été modifié avec succès.');
        setLoginId(forgotEmail);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Erreur lors de la mise à jour du mot de passe.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithGoogle(selectedDemoRole);
      onLoginSuccess(res.role, { name: res.name, email: res.user.email || undefined });
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Erreur lors de la connexion avec Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] min-h-screen flex flex-col justify-between selection:bg-[#e2dfff] selection:text-[#0f0069]">
      {/* HEADER EXACT AU CODE FOURNI */}
      <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
        <div className="h-16 w-full px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
              title="Retour à l'accueil"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3525cd] via-[#4f46e5] to-[#fd6a49] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                E
              </div>
              <span className="text-lg font-bold text-[#131b2e] tracking-tight">
                Edu<span className="text-[#3525cd]">Liaison</span>
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 ml-4 pl-4 border-l border-[#c7c4d8]/30">
              <span className="material-symbols-outlined text-[#005338] text-[18px]">verified_user</span>
              <span className="text-[11px] font-bold text-[#464555] uppercase tracking-wider">Sécurisé SSL 256-bit</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav Pill Toggle between Connexion and Inscription */}
            <nav className="flex items-center gap-1 p-1 bg-[#f2f3ff] rounded-lg">
              <button
                onClick={() => setMode('login')}
                className={`px-4 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#4f46e5] text-white shadow-sm'
                    : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-4 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#4f46e5] text-white shadow-sm'
                    : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                Inscription
              </button>
            </nav>

            <div className="flex items-center gap-2 pl-2 border-l border-[#c7c4d8]/40">
              <button 
                type="button" 
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] transition-colors text-[11px] font-bold text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#464555]">language</span>
                <span>FR</span>
                <span className="material-symbols-outlined text-[14px] text-[#464555]">expand_more</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#3525cd] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. VUE CONNEXION (EXACTEMENT SELON LE CODE HTML FOURNI)   */}
      {/* ========================================================= */}
      {mode === 'login' && (
        <main className="w-full pt-16 bg-[#faf8ff] flex-1 flex flex-col">
          <div className="flex flex-col w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch min-h-[calc(100vh-8.5rem)]">
                
                {/* Côté Gauche : Récit, Image & Preuve Sociale */}
                <div className="lg:col-span-6 flex flex-col justify-between relative rounded-2xl overflow-hidden bg-[#f2f3ff] shadow-sm p-6 sm:p-8 lg:p-10 border border-[#eaedff]">
                  <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#3525cd]/5 blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#fd6a49]/10 blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#3525cd] text-[11px] font-bold uppercase tracking-wider mb-4">
                      <span className="w-2 h-2 rounded-full bg-[#005338] animate-pulse"></span>
                      Espace Sécurisé Familles & Écoles
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#131b2e] tracking-tight leading-tight">
                      Chaque progrès célébré, <br />
                      <span className="text-[#4f46e5]">en direct avec l'école.</span>
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-[#464555] max-w-lg">
                      Accédez au carnet de liaison numérique, suivez les devoirs du soir, validez les autorisations et recevez les notes de vos enfants instantanément.
                    </p>
                  </div>

                  {/* Image Témoignage & Bloc Visuel */}
                  <div className="relative z-10 my-6 rounded-2xl overflow-hidden shadow-md group border border-[#eaedff]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e2e7ff]">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt="Famille africaine connectée sur l'application EduLiaison"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeLYJj2S1lrsvgIyl8xYWuM_j08oCm_6_M2tErhULijrVm0bKEnoBdW5TZQqAxJqJaz4pPx-Cqqwcb_Fr2FYGlUWdah8eDqxD6XBaHYI0g7CIUs3jyC-neW4D3G4LZGTbko-c_6zK227oIu4IdG0mO21PJd2El3Q4Pv-01_xAKpzALh7HSrM15i9wO5j59P62amoeHmXCXhxb98JxbtMTcSGuL_AfPFNas4HgP2jJt0JhHFBGTISK3ZQ"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/90 via-[#131b2e]/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center gap-1 text-[#fd6a49] mb-1.5">
                          <span className="material-symbols-outlined text-[16px]">star</span>
                          <span className="material-symbols-outlined text-[16px]">star</span>
                          <span className="material-symbols-outlined text-[16px]">star</span>
                          <span className="material-symbols-outlined text-[16px]">star</span>
                          <span className="material-symbols-outlined text-[16px]">star</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold italic text-white leading-relaxed">
                          “Grâce aux notifications instantanées, je sais avant même le dîner si Aminata a besoin d'aide en mathématiques. C'est une tranquillité absolue.”
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#dae2fd]">
                          <span>Koffi & Mariam A. — Parents (Abidjan)</span>
                          <span className="px-2 py-0.5 rounded bg-[#006e4b] text-[#67f4b7] text-[10px] font-bold">Certifié</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges d'impact et Réassurance */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-[#eaedff]">
                    <div className="flex flex-col items-center text-center p-1">
                      <span className="text-lg font-black text-[#3525cd]">140+</span>
                      <span className="text-[11px] text-[#464555]">Établissements partenaires</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-1 bg-[#f2f3ff]/60 rounded-xl">
                      <span className="text-lg font-black text-[#005338]">98.4%</span>
                      <span className="text-[11px] text-[#464555]">Taux d'assiduité relevé</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-1">
                      <span className="text-lg font-black text-[#ae3115]">&lt; 3 sec</span>
                      <span className="text-[11px] text-[#464555]">Alertes SMS & WhatsApp</span>
                    </div>
                  </div>
                </div>

                {/* Côté Droit : Formulaire de Connexion */}
                <div className="lg:col-span-6 flex flex-col justify-center bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 relative border border-[#eaedff]">
                  <div className="w-full max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-1 text-[#fd6a49] mb-1 text-xs font-bold">
                        <span className="material-symbols-outlined text-[18px]">lock_open</span>
                        <span>Connexion sécurisée</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
                        Bon retour parmi nous <span className="inline-block animate-bounce">👋</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-[#464555] mt-1">
                        Accédez à vos communications scolaires et dossiers d'élèves.
                      </p>
                    </div>

                    {/* Error Banner */}
                    {authError && (
                      <div className="mb-4 p-3.5 bg-[#ffdad6] border border-[#ffb4a3] text-[#93000a] rounded-xl text-xs font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <span className="flex-1">{authError}</span>
                      </div>
                    )}

                    {/* Formulaire Identifiants */}
                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                      {/* Champ Identifiant / Email */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#131b2e]" htmlFor="login-id">
                            Adresse email ou Téléphone
                          </label>
                          <span className="text-[11px] text-[#464555]">ex: parent@ecole.ci</span>
                        </div>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 flex items-center pointer-events-none text-[#777587]">
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                          </div>
                          <input 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-xs text-[#131b2e] placeholder:text-[#777587] text-xs focus:ring-2 focus:ring-[#3525cd] outline-none transition-all" 
                            id="login-id" 
                            placeholder="nom@domaine.com" 
                            required 
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Champ Mot de Passe */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#131b2e]" htmlFor="password">
                            Mot de passe
                          </label>
                          <button 
                            type="button"
                            className="text-xs text-[#3525cd] hover:underline cursor-pointer bg-transparent border-none p-0 font-semibold"
                            onClick={(e) => { 
                              e.preventDefault(); 
                              setShowForgotModal(true); 
                              setForgotEmail(loginId); 
                              setForgotSuccess(null); 
                              setForgotError(null); 
                            }}
                          >
                            Mot de passe oublié ?
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-xs text-[#131b2e] placeholder:text-[#777587] text-xs focus:ring-2 focus:ring-[#3525cd] outline-none transition-all" 
                            id="password" 
                            placeholder="••••••••••••" 
                            required 
                            type={showPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                          <button 
                            aria-label="Afficher ou masquer le mot de passe" 
                            className="absolute right-3 p-1 text-[#777587] hover:text-[#131b2e] transition-colors cursor-pointer" 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Options: Remember Me */}
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer" 
                            type="checkbox" 
                          />
                          <span className="text-xs text-[#464555]">
                            Se souvenir de moi sur cet appareil
                          </span>
                        </label>
                      </div>

                      {/* Bouton de Connexion Principal */}
                      <button 
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-[#4f46e5] hover:bg-[#3525cd] disabled:opacity-70 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer" 
                        type="submit"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Se connecter à mon espace</span>
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                          </>
                        )}
                      </button>

                      {/* Connexion Google Firebase */}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleGoogleSignIn}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f2f3ff] disabled:opacity-70 text-[#131b2e] text-xs font-bold border border-[#dae2fd] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continuer avec Google (Firebase Auth)</span>
                      </button>
                    </form>

                    {/* Inscription */}
                    <div className="mt-6 pt-4 bg-[#f2f3ff]/60 rounded-xl p-3 text-center border border-[#eaedff]">
                      <p className="text-xs text-[#464555]">
                        Pas encore de compte sur EduLiaison ?
                      </p>
                      <button 
                        onClick={() => setMode('signup')}
                        className="inline-flex items-center gap-1 text-xs text-[#3525cd] hover:text-[#4f46e5] font-bold mt-1 cursor-pointer"
                      >
                        <span>Créer un compte gratuitement</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>

                    {/* Micro Réassurance Technique */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-y-1 gap-x-4 text-center">
                      <div className="flex items-center gap-1 text-[11px] text-[#464555]">
                        <span className="material-symbols-outlined text-[#005338] text-[16px]">verified</span>
                        <span>Chiffrement bout-en-bout</span>
                      </div>
                      <span className="hidden sm:inline text-[#c7c4d8]">•</span>
                      <div className="flex items-center gap-1 text-[11px] text-[#464555]">
                        <span className="material-symbols-outlined text-[#fd6a49] text-[16px]">bolt</span>
                        <span>Mode allégé 2G/3G & WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 2. VUE INSCRIPTION (EXACTEMENT SELON LE CODE HTML FOURNI) */}
      {/* ========================================================= */}
      {mode === 'signup' && (
        <main className="w-full pt-16 bg-[#faf8ff] flex-1 flex flex-col">
          <div className="flex flex-col w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10">
              {/* En-tête contextuel & statut d'intégration */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] text-xs font-bold uppercase tracking-wider">
                    Rentrée Scolaire 2025-2026
                  </span>
                  <span className="text-[#464555] text-xs flex items-center gap-1 hidden sm:flex">
                    <span className="w-2 h-2 rounded-full bg-[#005338] animate-pulse inline-block"></span>
                    Serveurs régionaux actifs (Abidjan, Dakar, Douala, Kinshasa)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#464555]">
                  <span>Étape 1 sur 2 : Création de profil</span>
                </div>
              </div>

              {/* Container Principal Grille Split Screen Asymétrique */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* ================= PANNEAU GAUCHE : REASSURANCE & VISION ================= */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Carte Image & Impact Visuel */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-[#e2e7ff] group border border-[#eaedff]">
                    <div className="aspect-[4/3] w-full relative">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt="Classe africaine moderne et interactive"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC22P1ugrrzm1JlxKvDjwxoE_d_tAheR50HTsXnNdmSerqZM-RCHxxVNw3lDKXavfkwxw8JeZWtKB2SUiq09wywftTi7UNn8eLtUS5LinFDYZdrTFyuJgZkXkvy4Qp1IqYeWvMdN_8hoBwy8JKkvTHSwI0NAhoKpi21G9RdZeCzQnZIjo2opxKGvCtzNFpAnRldQJdPl1q7gWz4JExxLGtuC52rRttb8W0bj7HeRTpYwc-nB46ff8RC1w"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#283044]/90 via-[#283044]/30 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-[#6ffbbe] text-[20px]">stars</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#6ffbbe] font-bold">Excellence Pédagogique</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        Rejoignez la communauté éducative connectée
                      </h2>
                      <p className="text-xs text-white/80">
                        Déjà plus de 420 établissements et 85 000 parents reliés au quotidien sans friction.
                      </p>
                    </div>
                  </div>

                  {/* Arguments & Piliers Clés */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
                    <div className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#4f46e5] text-[20px]">verified</span>
                      <span>Pourquoi choisir EduLiaison ?</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Pilier 1 */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0 text-[#4f46e5]">
                          <span className="material-symbols-outlined text-[20px]">bolt</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#131b2e]">Activation en 2 minutes</p>
                          <p className="text-xs text-[#464555]">Liez vos enfants par un code unique ou explorez l'annuaire scolaire en quelques taps.</p>
                        </div>
                      </div>

                      {/* Pilier 2 */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ffdad2] flex items-center justify-center shrink-0 text-[#ae3115]">
                          <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#131b2e]">Zéro papier égaré</p>
                          <p className="text-xs text-[#464555]">Bulletins officiels, carnets de correspondance et reçus de scolarité archivés à vie.</p>
                        </div>
                      </div>

                      {/* Pilier 3 */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#dae2fd] flex items-center justify-center shrink-0 text-[#005338]">
                          <span className="material-symbols-outlined text-[20px]">signal_cellular_alt</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#131b2e]">Fluide en 3G & Alertes WhatsApp</p>
                          <p className="text-xs text-[#464555]">Optimisé pour la connectivité locale. Recevez l'essentiel par SMS ou messagerie instantanée.</p>
                        </div>
                      </div>
                    </div>

                    {/* Badge Statistique Instantané */}
                    <div className="p-2.5 bg-[#f2f3ff] rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#005338] text-[18px]">verified_user</span>
                        <span className="text-[11px] text-[#464555]">Conformité légale MEN</span>
                      </div>
                      <span className="text-[11px] text-[#3525cd] font-bold">100% Gratuit Parents</span>
                    </div>
                  </div>

                  {/* Témoignage Enseignant Rapide */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                      <img 
                        className="w-full h-full object-cover" 
                        alt="Proviseure adjointe Dakar"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwNcPbW9HqQKCg45nOt4PcyswjK7Iw2XLPrpPXJBJZ4nzvbJVC98GNKoBeDI6bwQ4RsG0AdEr5D1ZZTikePGVJCop8J7sJH5iWfMOp9xnTI22_Bh3VF2DPWH5HvajfpA_LuyxK-09FubQetlR9yCxOfto4IBsLhejx-J35qo3_EeDWHrgfF_PKxclmwKUk738abUx4ar6PihkQHFbsEuqg-gSEYI7CZdhktorjeEGsWP_utCXaP1Ljaw"
                      />
                    </div>
                    <div>
                      <p className="text-xs italic text-[#131b2e]">
                        « Le taux de signature des carnets par les parents est passé de 38% à 96% dès le premier trimestre. »
                      </p>
                      <p className="text-[11px] text-[#777587] mt-0.5">
                        — Mme Diop, Proviseure adjointe (Dakar)
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= PANNEAU DROIT : FORMULAIRE PROGRESSIF ================= */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md border border-[#eaedff] flex flex-col gap-6">
                  {/* En-tête formulaire */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚀</span>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                        Créer votre compte EduLiaison
                      </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-[#464555]">
                      Démarrez dès aujourd'hui l'expérience du carnet scolaire et de la scolarité connectée.
                    </p>
                  </div>

                  {/* Error Banner */}
                  {authError && (
                    <div className="p-3.5 bg-[#ffdad6] border border-[#ffb4a3] text-[#93000a] rounded-xl text-xs font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span className="flex-1">{authError}</span>
                    </div>
                  )}

                  {signupSuccess && (
                    <div className="p-4 bg-[#6ffbbe]/30 text-[#002113] rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      <span>Compte créé dans Firebase Authentication ! Redirection vers votre espace...</span>
                    </div>
                  )}

                  {/* Inscription rapide avec Google */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f2f3ff] disabled:opacity-70 text-[#131b2e] text-xs font-bold border border-[#dae2fd] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>S'inscrire rapidement avec Google</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#eaedff]"></div>
                    <span className="text-[11px] text-[#777587] font-semibold uppercase">ou par formulaire</span>
                    <div className="h-px flex-1 bg-[#eaedff]"></div>
                  </div>

                  <form className="flex flex-col gap-5" id="signup-form" onSubmit={handleSignupSubmit}>
                    
                    {/* ÉTAPE 2 : INFORMATIONS PERSONNELLES */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between pb-1 border-b border-[#f2f3ff]">
                        <label className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#3525cd] text-[18px]">person</span>
                          <span>Informations du compte</span>
                        </label>
                        <span className="text-[11px] text-[#005338] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">lock</span> Chiffrement bout-en-bout
                        </span>
                      </div>

                      {/* Ligne 1 : Prénom et Nom */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 relative">
                          <label className="text-xs font-bold text-[#464555]" htmlFor="firstname">Prénom</label>
                          <div className="relative flex items-center">
                            <input 
                              className="w-full bg-[#f2f3ff] focus:bg-white text-[#131b2e] px-3.5 py-2.5 rounded-xl text-xs border border-[#c7c4d8]/50 placeholder:text-[#777587] transition-all outline-none focus:ring-2 focus:ring-[#3525cd]" 
                              id="firstname" 
                              placeholder="Ex. Aminata" 
                              type="text"
                              required
                              value={firstname}
                              onChange={(e) => setFirstname(e.target.value)}
                            />
                            {firstname.length >= 2 && (
                              <span className="absolute right-3 material-symbols-outlined text-[#005338] text-[18px]">
                                check_circle
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 relative">
                          <label className="text-xs font-bold text-[#464555]" htmlFor="lastname">Nom de famille</label>
                          <div className="relative flex items-center">
                            <input 
                              className="w-full bg-[#f2f3ff] focus:bg-white text-[#131b2e] px-3.5 py-2.5 rounded-xl text-xs border border-[#c7c4d8]/50 placeholder:text-[#777587] transition-all outline-none focus:ring-2 focus:ring-[#3525cd]" 
                              id="lastname" 
                              placeholder="Ex. Traoré" 
                              type="text"
                              required
                              value={lastname}
                              onChange={(e) => setLastname(e.target.value)}
                            />
                            {lastname.length >= 2 && (
                              <span className="absolute right-3 material-symbols-outlined text-[#005338] text-[18px]">
                                check_circle
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ligne 2 : Email et Téléphone Mobile / WhatsApp */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#464555]" htmlFor="email">Adresse email</label>
                            {isEmailValid && (
                              <span className="text-[10px] text-[#005338] font-bold flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">check</span> format valide
                              </span>
                            )}
                          </div>
                          <div className="relative flex items-center">
                            <input 
                              className="w-full bg-[#f2f3ff] focus:bg-white text-[#131b2e] px-3.5 py-2.5 pr-10 rounded-xl text-xs border border-[#c7c4d8]/50 placeholder:text-[#777587] transition-all outline-none focus:ring-2 focus:ring-[#3525cd]" 
                              id="email" 
                              placeholder="nom@domaine.com" 
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute right-3 text-[#777587] text-[18px]">mail</span>
                          </div>
                        </div>

                        {/* Téléphone Mobile & WhatsApp */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#464555]" htmlFor="phone">Mobile / WhatsApp</label>
                            <span className="text-[10px] text-[#fd6a49] font-bold">SMS & Rappels</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Select indicatif pays */}
                            <div className="relative flex items-center shrink-0">
                              <select 
                                className="bg-[#eaedff] text-[#131b2e] text-xs font-bold py-2.5 pl-2.5 pr-6 rounded-xl outline-none cursor-pointer appearance-none border border-[#c7c4d8]/50" 
                                id="country-code"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                              >
                                <option value="+225">🇨🇮 +225</option>
                                <option value="+221">🇸🇳 +221</option>
                                <option value="+237">🇨🇲 +237</option>
                                <option value="+243">🇨🇩 +243</option>
                                <option value="+229">🇧🇯 +229</option>
                                <option value="+226">🇧🇫 +226</option>
                                <option value="+33">🇫🇷 +33</option>
                              </select>
                              <span className="material-symbols-outlined absolute right-1 pointer-events-none text-[16px] text-[#777587]">expand_more</span>
                            </div>

                            {/* Numéro */}
                            <div className="relative flex-1 flex items-center">
                              <input 
                                className="w-full bg-[#f2f3ff] focus:bg-white text-[#131b2e] px-3.5 py-2.5 rounded-xl text-xs border border-[#c7c4d8]/50 placeholder:text-[#777587] transition-all outline-none focus:ring-2 focus:ring-[#3525cd]" 
                                id="phone" 
                                placeholder="07 00 00 00 00" 
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />
                              {phone.length >= 8 && (
                                <span className="absolute right-3 material-symbols-outlined text-[#005338] text-[18px]">
                                  check_circle
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ligne 3 : Mot de Passe & Sécurimètre */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#464555]" htmlFor="signup-password">Mot de passe de protection</label>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-[#777587]">Niveau :</span>
                            <span className={`text-[11px] font-bold ${getStrengthLabel().color}`}>
                              {getStrengthLabel().label}
                            </span>
                          </div>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            className="w-full bg-[#f2f3ff] focus:bg-white text-[#131b2e] px-3.5 py-2.5 pr-10 rounded-xl text-xs border border-[#c7c4d8]/50 placeholder:text-[#777587] transition-all outline-none focus:ring-2 focus:ring-[#3525cd]" 
                            id="signup-password" 
                            placeholder="••••••••••••" 
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button 
                            className="absolute right-3 text-[#777587] hover:text-[#131b2e] cursor-pointer" 
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>

                        {/* Jauge dynamique */}
                        <div className="w-full h-1.5 bg-[#eaedff] rounded-full overflow-hidden flex gap-1 mt-1">
                          <div className={`h-full w-1/3 rounded-full transition-colors duration-300 ${
                            strengthScore >= 1 ? (strengthScore === 1 ? 'bg-[#ba1a1a]' : strengthScore === 2 ? 'bg-[#ae3115]' : 'bg-[#005338]') : 'bg-[#c7c4d8]/40'
                          }`}></div>
                          <div className={`h-full w-1/3 rounded-full transition-colors duration-300 ${
                            strengthScore >= 2 ? (strengthScore === 2 ? 'bg-[#ae3115]' : 'bg-[#005338]') : 'bg-[#c7c4d8]/40'
                          }`}></div>
                          <div className={`h-full w-1/3 rounded-full transition-colors duration-300 ${
                            strengthScore >= 3 ? 'bg-[#005338]' : 'bg-[#c7c4d8]/40'
                          }`}></div>
                        </div>

                        {/* Critères visuels */}
                        <div className="flex flex-wrap items-center gap-4 mt-1">
                          <span className={`flex items-center gap-1 text-[11px] ${hasLength ? 'text-[#005338] font-bold' : 'text-[#777587]'}`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {hasLength ? 'check_circle' : 'circle'}
                            </span> 
                            8+ caractères
                          </span>
                          <span className={`flex items-center gap-1 text-[11px] ${hasNumber ? 'text-[#005338] font-bold' : 'text-[#777587]'}`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {hasNumber ? 'check_circle' : 'circle'}
                            </span> 
                            1 chiffre
                          </span>
                          <span className={`flex items-center gap-1 text-[11px] ${hasUppercase ? 'text-[#005338] font-bold' : 'text-[#777587]'}`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {hasUppercase ? 'check_circle' : 'circle'}
                            </span> 
                            1 majuscule
                          </span>
                        </div>
                      </div>

                      {/* Champ Conditionnel Établissement / Code d'invitation */}
                      <div className="bg-[#f2f3ff] p-4 rounded-2xl flex flex-col gap-1 border border-[#eaedff]">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#131b2e] flex items-center gap-1" htmlFor="school-code">
                            <span className="material-symbols-outlined text-[#3525cd] text-[18px]">school</span>
                            <span>Code d'invitation établissement ou Nom de l'école</span>
                          </label>
                          <span className="text-[10px] text-[#777587] uppercase font-bold">Facultatif</span>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            className="w-full bg-white text-[#131b2e] px-3.5 py-2.5 rounded-xl text-xs border border-[#c7c4d8]/50 placeholder:text-[#777587] outline-none focus:ring-2 focus:ring-[#3525cd]" 
                            id="school-code" 
                            placeholder="Ex: EDU-ABJ-2025 ou Collège Jean Mermoz" 
                            type="text"
                            value={schoolCode}
                            onChange={(e) => setSchoolCode(e.target.value)}
                          />
                        </div>
                        <p className="text-[11px] text-[#464555] flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[16px] text-[#005338]">info</span>
                          <span>Si l'école vous a transmis un code par SMS ou carnet papier, insérez-le pour lier vos dossiers automatiquement.</span>
                        </p>
                      </div>
                    </div>

                    {/* ÉTAPE 3 : CONSENTEMENT ET SOUMISSION */}
                    <div className="flex flex-col gap-4 pt-1">
                      {/* Checkbox Conditions */}
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input 
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-[#3525cd] accent-[#3525cd] focus:ring-0 cursor-pointer" 
                          id="terms" 
                          type="checkbox" 
                          required
                        />
                        <span className="text-xs text-[#464555] leading-relaxed">
                          J'accepte sans réserve les <a className="text-[#3525cd] underline font-bold" href="#">Conditions Générales d'Utilisation</a> d'EduLiaison et j'atteste avoir pris connaissance de la <a className="text-[#3525cd] underline font-bold" href="#">Charte de Protection des Données Éducatives</a> des mineurs.
                        </span>
                      </label>

                      {/* CTA PRINCIPAL */}
                      <button 
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#ae3115] disabled:opacity-70 text-xs font-bold text-white shadow-lg hover:shadow-xl hover:opacity-95 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer" 
                        type="submit"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Finaliser mon inscription gratuite</span>
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                          </>
                        )}
                      </button>

                      {/* Lien de redirection Connexion */}
                      <div className="flex items-center justify-center gap-1.5 text-center text-xs">
                        <span className="text-[#464555]">Vous possédez déjà un compte scolaire ?</span>
                        <button 
                          type="button"
                          onClick={() => setMode('login')}
                          className="font-bold text-[#3525cd] hover:underline cursor-pointer"
                        >
                          Se connecter
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              </div>

              {/* Bannière de Confiance Inférieure */}
              <div className="mt-8 p-6 rounded-2xl bg-[#f2f3ff] flex flex-wrap items-center justify-around gap-6 text-center border border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#3525cd] text-[28px]">lock_reset</span>
                  <div className="text-left">
                    <p className="text-xs text-[#131b2e] uppercase font-bold">Double Facteur (2FA)</p>
                    <p className="text-[11px] text-[#464555]">Validation par code SMS ou WhatsApp</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#005338] text-[28px]">data_check</span>
                  <div className="text-left">
                    <p className="text-xs text-[#131b2e] uppercase font-bold">Données Souveraines</p>
                    <p className="text-[11px] text-[#464555]">Hébergement respectant les normes nationales</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ae3115] text-[28px]">support_agent</span>
                  <div className="text-left">
                    <p className="text-xs text-[#131b2e] uppercase font-bold">Assistance locale 6j/7</p>
                    <p className="text-[11px] text-[#464555]">Support dédié par chat et WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Modal Réinitialisation de Mot de Passe Sécurisée (Code 6 chiffres par email & zéro fuite UI) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#283044]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#e2dfff] text-[#3525cd] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">lock_reset</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">
                    {forgotStep === 'success' ? 'Mot de passe réinitialisé' : forgotStep === 'verify-and-reset' ? 'Nouveau mot de passe' : 'Mot de passe oublié'}
                  </h3>
                  <span className="text-[11px] text-[#777587]">Service de récupération sécurisé</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep('request');
                  setForgotError(null);
                  setForgotSuccess(null);
                }}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#464555] hover:bg-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* ERROR BANNER */}
            {forgotError && (
              <div className="mb-4 p-3 bg-[#ffdad6] text-[#93000a] text-xs font-semibold rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span className="flex-1">{forgotError}</span>
              </div>
            )}

            {/* STEP 1: REQUEST CODE VIA EMAIL */}
            {forgotStep === 'request' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-[#464555] leading-relaxed">
                  Saisissez l'adresse email associée à votre compte EduLiaison. Notre serveur SMTP vous transmettra immédiatement un code de sécurité confidentiel à 6 chiffres et le lien d'accès.
                </p>

                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1">
                    Votre adresse email
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[18px] text-[#777587] absolute left-3 pointer-events-none">mail</span>
                    <input 
                      type="email"
                      required
                      placeholder="nom@domaine.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd] focus:ring-2 focus:ring-[#3525cd] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#f2f3ff] text-[#464555] text-xs font-bold hover:bg-[#eaedff] cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] disabled:opacity-70 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    {forgotLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Envoyer le code</span>
                        <span className="material-symbols-outlined text-[16px]">send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER 6-DIGIT CODE & DEFINE NEW PASSWORD */}
            {forgotStep === 'verify-and-reset' && (
              <form onSubmit={handleConfirmResetSubmit} className="space-y-3.5">
                <div className="p-3 bg-[#e2dfff] text-[#0f0069] rounded-xl text-xs flex items-start gap-2 border border-[#c3c0ff]">
                  <span className="material-symbols-outlined text-[18px] text-[#3525cd] shrink-0 mt-0.5">mark_email_read</span>
                  <div className="leading-snug">
                    Un code de sécurité à 6 chiffres vous a été envoyé par email à <strong>{forgotEmail}</strong>. Veuillez consulter votre boîte de réception.
                  </div>
                </div>

                {/* Email address reminder */}
                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1">
                    Adresse email
                  </label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd] focus:ring-2 focus:ring-[#3525cd] outline-none"
                  />
                </div>

                {/* 6-digit Code Input */}
                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1">
                    Code de confirmation (reçu par email)
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Ex: 849201"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white text-base font-bold text-center tracking-widest text-[#3525cd] border-2 border-[#3525cd] focus:ring-2 focus:ring-[#3525cd] outline-none font-mono"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1">
                    Nouveau mot de passe (min. 6 caractères)
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd] focus:ring-2 focus:ring-[#3525cd] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 text-[#777587] hover:text-[#131b2e] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showNewPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-bold text-[#131b2e] block mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input 
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#dae2fd] focus:ring-2 focus:ring-[#3525cd] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#f2f3ff] text-[#464555] text-xs font-bold hover:bg-[#eaedff] cursor-pointer"
                  >
                    Renvoyer un code
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotCode || newPassword.length < 6}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] disabled:opacity-70 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    {forgotLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Valider le mot de passe</span>
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {forgotStep === 'success' && (
              <div className="space-y-4 text-center">
                <div className="p-4 bg-[#6ffbbe]/20 border border-[#6ffbbe] text-[#005338] rounded-2xl space-y-2">
                  <span className="material-symbols-outlined text-[36px] text-[#006e4b]">verified</span>
                  <h4 className="font-bold text-sm">Mot de passe réinitialisé avec succès !</h4>
                  <p className="text-xs text-[#464555] leading-relaxed">
                    Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter en toute sécurité.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStep('request');
                    setMode('login');
                  }}
                  className="w-full py-3 rounded-xl bg-[#3525cd] text-white text-xs font-bold shadow-md hover:bg-[#4f46e5] cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <span>Se connecter avec mon nouveau mot de passe</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER EXACT AU CODE FOURNI */}
      <footer className="w-full bg-[#f2f3ff] py-6 shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-[#eaedff]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#464555]">
            <span className="material-symbols-outlined text-[#005338] text-[18px]">shield</span>
            <span>Conforme RGPD & Cadre de Protection des Données Personnelles (UA / Afrique)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#464555]">
            <a className="hover:text-[#3525cd] transition-colors" href="#confidentialite" onClick={(e) => { e.preventDefault(); alert("Charte de Confidentialité EduLiaison : Données chiffrées de bout en bout et protégées selon les normes nationales."); }}>Confidentialité</a>
            <a className="hover:text-[#3525cd] transition-colors" href="#cgu" onClick={(e) => { e.preventDefault(); alert("Conditions d'utilisation : Plateforme réservée aux établissements scolaires partenaires, parents et enseignants."); }}>Conditions d'utilisation</a>
            <a className="hover:text-[#3525cd] transition-colors" href="#aide" onClick={(e) => { e.preventDefault(); alert("Centre d'aide : Assistance WhatsApp disponible 6j/7 au +225 07 00 00 00."); }}>Centre d'aide</a>
            <span className="text-[#777587]">© 2025 EduLiaison Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
