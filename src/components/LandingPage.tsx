import React, { useState } from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'signup', targetRole?: UserRole) => void;
  isAuthenticated?: boolean;
  currentRole?: UserRole;
  userName?: string;
  onGoToDashboard?: (tab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onOpenAuth, 
  isAuthenticated = false, 
  currentRole = 'parent', 
  onGoToDashboard 
}) => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'timeline' | 'grades' | 'attendance' | 'bulletins'>('timeline');

  // Form states for demo modal
  const [demoSchoolName, setDemoSchoolName] = useState('');
  const [demoCity, setDemoCity] = useState('');
  const [demoContactName, setDemoContactName] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoStudentCount, setDemoStudentCount] = useState('450');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setShowDemoModal(false);
      setDemoSchoolName('');
      setDemoCity('');
      setDemoContactName('');
      setDemoPhone('');
    }, 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 3500);
    }
  };

  return (
    <div className="w-full bg-[#faf8ff] font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e] min-h-screen flex flex-col antialiased">
      {/* ========================================== */}
      {/* HEADER EXACT AU CODE FOURNI                */}
      {/* ========================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
        <div className="h-20 w-full px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a 
              className="flex items-center gap-2 cursor-pointer" 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="flex items-center gap-2.5">
                <img 
                  alt="EduLiaison" 
                  className="h-10 w-10 rounded-xl object-cover shadow-xs" 
                  src="/logo.png"
                />
                <div className="flex flex-col">
                  <span className="font-black text-xl text-[#131b2e] leading-tight tracking-tight">
                    Edu<span className="text-[#3525cd]">Liaison</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#777587] tracking-wider uppercase leading-none">
                    Carnet Scolaire Numérique
                  </span>
                </div>
              </div>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <a 
              className="font-semibold text-sm text-[#464555] hover:text-[#3525cd] transition-colors py-2" 
              href="#showcase"
            >
              Fonctionnalités
            </a>

            <div className="relative group py-2">
              <button 
                type="button" 
                className="flex items-center gap-1 font-semibold text-sm text-[#464555] hover:text-[#3525cd] group-hover:text-[#3525cd] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Espaces & Solutions</span>
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
              </button>

              <div className="absolute top-full left-0 w-80 p-3 bg-white rounded-2xl shadow-xl border border-[#eaedff] hidden group-hover:flex flex-col gap-1 transition-all z-50">
                <button 
                  onClick={() => onOpenAuth('login', 'parent')}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f2f3ff] transition-colors text-left w-full cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Espace Parents</span>
                    <span className="text-[11px] text-[#464555]">Suivi en temps réel, bulletins & présences</span>
                  </div>
                </button>

                <button 
                  onClick={() => onOpenAuth('login', 'enseignant')}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f2f3ff] transition-colors text-left w-full cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ffdad2] flex items-center justify-center text-[#ae3115] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">school</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Écoles & Enseignants</span>
                    <span className="text-[11px] text-[#464555]">Appel rapide, saisie de notes & bulletins</span>
                  </div>
                </button>
              </div>
            </div>

            <a 
              className="font-semibold text-sm text-[#464555] hover:text-[#3525cd] transition-colors py-2" 
              href="#temoignages"
            >
              Témoignages
            </a>
            <a 
              className="font-semibold text-sm text-[#464555] hover:text-[#3525cd] transition-colors py-2" 
              href="#tarifs"
            >
              Tarifs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => onGoToDashboard ? onGoToDashboard() : onOpenAuth('login', currentRole)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#4f46e5] text-white font-bold text-xs hover:opacity-95 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
                <span>Accéder au dashboard</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onOpenAuth('signup', 'parent')}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#fd6a49] text-white font-bold text-xs hover:opacity-95 hover:shadow-lg transition-all shadow-[0_4px_14px_rgba(253,106,73,0.3)] cursor-pointer"
                >
                  <span>Démarrer</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button 
                  onClick={() => onOpenAuth('login', 'parent')}
                  className="w-8 h-8 rounded-full bg-[#3525cd] flex items-center justify-center text-white cursor-pointer hover:bg-[#4f46e5] transition-colors"
                  title="Connexion"
                >
                  <span className="material-symbols-outlined text-white text-[18px]">person</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTENT                               */}
      {/* ========================================== */}
      <main className="w-full pt-20 bg-[#faf8ff] flex-1">
        <div className="flex flex-col w-full overflow-hidden">
          
          {/* ========================================== */}
          {/* 1. HERO SECTION                            */}
          {/* ========================================== */}
          <section className="relative w-full px-6 sm:px-8 py-12 lg:py-24 bg-gradient-to-b from-[#faf8ff] via-[#f2f3ff] to-[#faf8ff]">
            {/* Ambient luminous circles */}
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#3525cd]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd6a49]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col items-center">
              {/* High-energy badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-md mb-6 border border-[#eaedff]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006e4b] animate-pulse"></span>
                <span className="text-xs text-[#131b2e] uppercase tracking-wider font-bold">
                  Révolutionnez la communication scolaire en Afrique
                </span>
                <span className="text-xs text-[#3525cd] font-bold ml-1">• +120 Établissements</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-center text-[#131b2e] max-w-4xl tracking-tight leading-tight mb-6">
                Fini les carnets papier égarés. Connectez <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3525cd] to-[#fd6a49]">l'école aux parents</span> en temps réel.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-center text-[#464555] max-w-2xl mb-8 leading-relaxed">
                EduLiaison transforme le carnet de liaison traditionnel en une expérience numérique instantanée. Notes, absences, retards et communications scolaires accessibles à chaque parent, directement sur smartphone.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto">
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#fd6a49] text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span>Demander une démo école gratuite</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <a 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl bg-white/90 backdrop-blur-md shadow-md hover:bg-white text-[#131b2e] font-bold text-sm transition-all border border-[#eaedff]" 
                  href="#showcase"
                >
                  <span className="material-symbols-outlined text-[#3525cd] text-[22px]">play_circle</span>
                  <span>Découvrir la démo Parent</span>
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#464555] text-xs font-semibold mb-12">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006e4b] text-[18px]">check_circle</span> 
                  Déploiement en 48h sans matériel lourd
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006e4b] text-[18px]">check_circle</span> 
                  Compatible SMS & WhatsApp Direct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006e4b] text-[18px]">check_circle</span> 
                  Programmes francophones & bilingues
                </span>
              </div>

              {/* Hero Visual with Interactive Overlays */}
              <div className="relative w-full max-w-5xl rounded-3xl overflow-visible shadow-2xl bg-[#f2f3ff] p-2 sm:p-4 border border-[#eaedff]">
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/9] max-h-[540px]">
                  <img 
                    alt="Famille africaine connectée sur smartphone" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAloiV4GFYr-i78dks8YbCiqUBtRusR9YRe4bV5Ns2tv2ZRgjFkJjSJtuWFeksng0Io5m9_RkKfVMg7tikh5eAlakVd4gNbiqEHRiIe-q6-fPQ5iA590cXEE4S9Q_03XiAD6zfFSElhPMuCsmvB9eVTRBNlwCnL7MNGwV_RZs03a3ucHqsy3mTJVJwUW5PtY7rd2rfmyWVRlQ9avKGhUpyz9GD8ScLy2TNjlKO69e_c"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#283044]/60 via-transparent to-transparent"></div>
                </div>

                {/* Floating Card 1: Nouvelle Note */}
                <div className="absolute -top-6 -left-2 sm:left-6 max-w-xs sm:max-w-sm p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl flex items-start gap-3 transform -rotate-1 hover:rotate-0 transition-transform border border-[#eaedff]">
                  <div className="w-10 h-10 rounded-xl bg-[#6ffbbe] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#005338] text-[22px]">celebration</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#005236] text-[10px] font-bold">18 / 20</span>
                      <span className="text-xs text-[#464555]">Mathématiques</span>
                    </div>
                    <p className="text-xs text-[#131b2e] font-bold">Devoir surveillé n°2</p>
                    <span className="text-[11px] text-[#464555] italic">« Excellent raisonnement » — M. Koné</span>
                  </div>
                </div>

                {/* Floating Card 2: Alerte Présence */}
                <div className="absolute -bottom-6 -right-2 sm:right-6 max-w-xs sm:max-w-sm p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl flex items-start gap-3 transform rotate-1 hover:rotate-0 transition-transform border border-[#eaedff]">
                  <div className="w-10 h-10 rounded-xl bg-[#ffdad2] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#ae3115] text-[22px]">notifications_active</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#640f00] text-[10px] font-bold">Pointage 07h45</span>
                      <span className="text-xs text-[#006e4b] font-semibold">À l'heure</span>
                    </div>
                    <p className="text-xs text-[#131b2e] font-bold">Kouamé Aminata (3ème A)</p>
                    <span className="text-[11px] text-[#464555]">Notification instantanée confirmée</span>
                  </div>
                </div>

                {/* Floating Card 3: Moyenne Trimestrielle */}
                <div className="hidden md:flex absolute top-1/2 -right-8 transform -translate-y-1/2 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl flex-col gap-1 border border-[#eaedff]">
                  <span className="text-[10px] text-[#464555] uppercase tracking-wider font-bold">Moyenne Générale</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#3525cd]">16.4</span>
                    <span className="text-xs text-[#464555]">/ 20</span>
                  </div>
                  <span className="text-[11px] text-[#006e4b] flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +1.2 pts ce trimestre
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 2. THE PROBLEM vs THE SOLUTION             */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-xs text-[#ae3115] font-bold uppercase tracking-widest mb-2">Rupture Technologique</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight max-w-2xl">
                  Pourquoi les écoles d'excellence abandonnent le carnet papier
                </h2>
                <p className="text-xs sm:text-sm text-[#464555] max-w-xl mt-2">
                  Le modèle traditionnel à base de papier freine la relation de confiance et fait perdre des centaines d'heures aux équipes pédagogiques.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The Old Way */}
                <div className="rounded-3xl p-6 sm:p-8 bg-[#eaedff] flex flex-col justify-between shadow-xs border border-[#dae2fd]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs uppercase font-bold mb-6">
                      <span className="material-symbols-outlined text-[16px]">close</span> Le Carnet Papier d'Hier
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#131b2e] mb-4">Un canal opaque, fragile et souvent hors de portée</h3>
                    <ul className="flex flex-col gap-4 text-xs sm:text-sm">
                      <li className="flex items-start gap-3 text-[#464555]">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5">error_outline</span>
                        <span><strong>Carnets déchirés ou perdus :</strong> Plus de 35% des carnets physiques ne parviennent jamais signés aux parents en temps voulu.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#464555]">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5">error_outline</span>
                        <span><strong>Notes dissimulées :</strong> Découverte des difficultés scolaires en fin de trimestre, lorsqu'il est déjà trop tard pour réagir.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#464555]">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5">error_outline</span>
                        <span><strong>Retards & absences fantômes :</strong> Incapacité de joindre immédiatement les parents au moment critique de l'appel du matin.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#464555]">
                        <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5">error_outline</span>
                        <span><strong>Coûts récurrents massifs :</strong> Budgets d'impression, pertes de temps d'encadrement et retards dans la collecte des frais.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 p-4 rounded-2xl bg-[#dae2fd] text-[#131b2e] text-xs flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-[18px]">sentiment_dissatisfied</span>
                    <span>Résultat : Rupture de lien, incompréhensions et charge mentale accrue pour la direction.</span>
                  </div>
                </div>

                {/* The EduLiaison Way */}
                <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#67f4b7] text-[#002113] text-xs uppercase font-bold mb-6">
                      <span className="material-symbols-outlined text-[16px]">verified</span> La Révolution EduLiaison
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Transparence instantanée directement sur smartphone</h3>
                    <ul className="flex flex-col gap-4 text-xs sm:text-sm">
                      <li className="flex items-start gap-3 text-[#dad7ff]">
                        <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] shrink-0 mt-0.5">check_circle</span>
                        <span><strong className="text-white">Zéro intermédiaire :</strong> Chaque note, appréciation ou convocation atterrit directement sur le téléphone du parent.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#dad7ff]">
                        <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] shrink-0 mt-0.5">check_circle</span>
                        <span><strong className="text-white">Alerte immédiate d'absence :</strong> SMS ou notification push émise dès 08h00 en cas de retard constaté à la grille.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#dad7ff]">
                        <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] shrink-0 mt-0.5">check_circle</span>
                        <span><strong className="text-white">Émargement numérique des devoirs :</strong> Les parents consultent l'agenda hebdomadaire et valident le carnet d'un simple toucher.</span>
                      </li>
                      <li className="flex items-start gap-3 text-[#dad7ff]">
                        <span className="material-symbols-outlined text-[#6ffbbe] text-[20px] shrink-0 mt-0.5">check_circle</span>
                        <span><strong className="text-white">Impact financier & écologique :</strong> Économisez 100% du budget d'impression des carnets scolaires annuels.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur text-white text-xs flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">verified_user</span>
                    <span>Résultat : 98% d'implication parentale mesurée et des résultats académiques en hausse de +18%.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 3. KEY VALUE PILLARS                       */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-[#f2f3ff]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-xs text-[#3525cd] font-bold uppercase tracking-widest mb-2">Un Écosystème Harmonieux</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight max-w-2xl">
                  Conçu pour répondre aux défis réels de chaque acteur de la communauté scolaire
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pillar 1: Parents */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-md hover:shadow-xl transition-all flex flex-col justify-between group border border-[#eaedff]">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">family_restroom</span>
                    </div>
                    <span className="text-xs text-[#3525cd] font-bold uppercase tracking-wider">Pour les Parents</span>
                    <h3 className="text-lg font-bold text-[#131b2e] mt-1 mb-3">La sérénité absolue à chaque instant</h3>
                    <p className="text-xs sm:text-sm text-[#464555] mb-6 leading-relaxed">
                      Que vous soyez au bureau, en voyage ou à la maison, suivez le parcours de tous vos enfants inscrits dans l'établissement via une interface intuitive unifiée.
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-[#131b2e] font-medium">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Carnet de liaison signé numériquement</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Bulletins téléchargeables certifiés QR-Code</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Règlements de scolarité via Mobile Money</div>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#f2f3ff] flex items-center justify-between">
                    <span className="text-xs text-[#464555]">Accessibilité mobile 24/7</span>
                    <button 
                      onClick={() => onOpenAuth('login', 'parent')}
                      className="material-symbols-outlined text-[#3525cd] group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      arrow_forward
                    </button>
                  </div>
                </div>

                {/* Pillar 2: Teachers */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-md hover:shadow-xl transition-all flex flex-col justify-between group border border-[#eaedff]">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#ffdad2] flex items-center justify-center text-[#ae3115] mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">school</span>
                    </div>
                    <span className="text-xs text-[#ae3115] font-bold uppercase tracking-wider">Pour les Enseignants</span>
                    <h3 className="text-lg font-bold text-[#131b2e] mt-1 mb-3">Moins d'administration, plus de pédagogie</h3>
                    <p className="text-xs sm:text-sm text-[#464555] mb-6 leading-relaxed">
                      Finies les doubles saisies et les piles de carnets ramassés en classe. Validez les appels et enregistrez les notes d'évaluation en moins de 3 minutes.
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-[#131b2e] font-medium">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Appel rapide de classe en 1 clic</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Saisie vocale des appréciations individuelles</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Mode hors-ligne avec synchronisation automatique</div>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#f2f3ff] flex items-center justify-between">
                    <span className="text-xs text-[#464555]">Temps de gestion divisé par 4</span>
                    <button 
                      onClick={() => onOpenAuth('login', 'enseignant')}
                      className="material-symbols-outlined text-[#ae3115] group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      arrow_forward
                    </button>
                  </div>
                </div>

                {/* Pillar 3: Principals */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-md hover:shadow-xl transition-all flex flex-col justify-between group border border-[#eaedff]">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#dae2fd] flex items-center justify-center text-[#3525cd] mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
                    </div>
                    <span className="text-xs text-[#006e4b] font-bold uppercase tracking-wider">Pour les Directeurs</span>
                    <h3 className="text-lg font-bold text-[#131b2e] mt-1 mb-3">Visibilité totale et prestige d'excellence</h3>
                    <p className="text-xs sm:text-sm text-[#464555] mb-6 leading-relaxed">
                      Pilotez l'ensemble de votre collège ou lycée depuis un tableau de bord analytique clair : assiduité globale, taux de recouvrement et réputation de pointe.
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-[#131b2e] font-medium">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Statistiques de présence en temps réel</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Génération des bulletins officiels en 1 clic</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Canal de diffusion d'urgences par SMS ciblé</div>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#f2f3ff] flex items-center justify-between">
                    <span className="text-xs text-[#464555]">Modernisation garantie</span>
                    <button 
                      onClick={() => onOpenAuth('login', 'direction')}
                      className="material-symbols-outlined text-[#005338] group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      arrow_forward
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 4. INTERACTIVE PRODUCT SHOWCASE            */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-white" id="showcase">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-xs text-[#ae3115] font-bold uppercase tracking-widest mb-2">Démonstration Live</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight max-w-2xl">
                  L'expérience d'un carnet scolaire nouvelle génération
                </h2>
                <p className="text-xs sm:text-sm text-[#464555] max-w-xl mt-2">
                  Une interface épurée, sans friction, pensée pour les écrans de smartphones tout en conservant la rigueur institutionnelle requise.
                </p>
              </div>

              {/* Mockup Window */}
              <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white shadow-2xl overflow-hidden border border-[#eaedff]">
                {/* Mockup Top Bar */}
                <div className="px-6 py-4 bg-[#eaedff] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#fd6a49]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#006e4b]"></div>
                    <span className="text-xs text-[#464555] font-bold ml-2">EduLiaison Mobile App • Espace Famille</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#464555] text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#006e4b]">wifi</span>
                    <span className="font-semibold">Connecté • Synchro active</span>
                  </div>
                </div>

                {/* Student Banner */}
                <div className="p-6 bg-[#f2f3ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eaedff]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3525cd] to-[#fd6a49] flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                      KA
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#131b2e]">Kouamé Aminata</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#005236] text-[10px] font-bold">Inscrite</span>
                      </div>
                      <span className="text-xs text-[#464555]">Classe de 3ème A • Matricule : EDU-2024-884</span>
                      <span className="text-xs text-[#3525cd] font-semibold">Collège Moderne Saint-Viateur (Abidjan)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-[#464555]">Rang de classe</span>
                      <span className="text-lg font-bold text-[#131b2e]">2ème <span className="text-xs text-[#464555] font-normal">/ 42 élèves</span></span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#6ffbbe]/30 flex items-center justify-center text-[#005338]">
                      <span className="material-symbols-outlined text-[28px]">military_tech</span>
                    </div>
                  </div>
                </div>

                {/* Interface Tabs */}
                <div className="flex items-center gap-2 px-6 pt-3 bg-white border-b border-[#eaedff] overflow-x-auto">
                  <button 
                    onClick={() => setActiveShowcaseTab('timeline')}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
                      activeShowcaseTab === 'timeline' 
                        ? 'text-[#3525cd] border-b-2 border-[#3525cd] bg-[#f2f3ff]' 
                        : 'text-[#464555] hover:text-[#131b2e]'
                    }`}
                  >
                    Fil d'Actualités Scolaires
                  </button>
                  <button 
                    onClick={() => setActiveShowcaseTab('grades')}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
                      activeShowcaseTab === 'grades' 
                        ? 'text-[#3525cd] border-b-2 border-[#3525cd] bg-[#f2f3ff]' 
                        : 'text-[#464555] hover:text-[#131b2e]'
                    }`}
                  >
                    Notes & Coefficients
                  </button>
                  <button 
                    onClick={() => setActiveShowcaseTab('attendance')}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
                      activeShowcaseTab === 'attendance' 
                        ? 'text-[#3525cd] border-b-2 border-[#3525cd] bg-[#f2f3ff]' 
                        : 'text-[#464555] hover:text-[#131b2e]'
                    }`}
                  >
                    Assiduité (99.2%)
                  </button>
                  <button 
                    onClick={() => setActiveShowcaseTab('bulletins')}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-t-xl cursor-pointer ${
                      activeShowcaseTab === 'bulletins' 
                        ? 'text-[#3525cd] border-b-2 border-[#3525cd] bg-[#f2f3ff]' 
                        : 'text-[#464555] hover:text-[#131b2e]'
                    }`}
                  >
                    Bulletins Numériques (PDF)
                  </button>
                </div>

                {/* Timeline Events / Showcase Body */}
                <div className="p-6 bg-white flex flex-col gap-4">
                  {/* Event 1: Evaluation Note */}
                  <div className="p-4 rounded-2xl bg-[#f2f3ff] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#eaedff]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6ffbbe] flex items-center justify-center text-[#005338] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#131b2e]">Français : Devoir de Synthèse</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[10px] font-bold text-[#464555]">Coeff. 3</span>
                        </div>
                        <p className="text-xs text-[#464555] mt-0.5">
                          « Remarquable maîtrise stylistique et arguments très bien construits. »
                        </p>
                        <span className="text-[11px] text-[#777587] font-medium mt-1">Mme Diop • Publié aujourd'hui à 11h20</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-[#006e4b]">16.5<span className="text-xs text-[#464555] font-normal">/20</span></span>
                        <span className="text-[10px] text-[#464555]">Moy. classe : 12.2</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#6ffbbe] text-[#002113] text-xs font-bold">Signé</span>
                    </div>
                  </div>

                  {/* Event 2: Official Message */}
                  <div className="p-4 rounded-2xl bg-[#f2f3ff] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#eaedff]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#131b2e]">Communication de la Direction</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold">Important</span>
                        </div>
                        <p className="text-xs text-[#464555] mt-0.5">
                          Réunion d'orientation trimestrielle des classes de 3ème ce vendredi à 17h30 en Salle Polyvalente.
                        </p>
                        <span className="text-[11px] text-[#777587] font-medium mt-1">Secrétariat Général • Hier à 16h45</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => alert("Présence confirmée pour la réunion de vendredi.")}
                      className="px-4 py-2 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all self-end sm:self-center shrink-0 cursor-pointer"
                    >
                      Confirmer ma présence
                    </button>
                  </div>

                  {/* Event 3: Signature Confirmation Pad Mock */}
                  <div className="p-4 rounded-2xl bg-[#faf8ff] shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#eaedff]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ffdad2] flex items-center justify-center text-[#ae3115] shrink-0">
                        <span className="material-symbols-outlined text-[22px]">draw</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#131b2e]">Validation parentale hebdomadaire</span>
                        <span className="text-[11px] text-[#464555]">Semaine 24 certifiée conforme par M. Kouamé (Père)</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6ffbbe] text-[#002113] text-xs font-bold shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                      <span>Endossé par Empreinte Biométrique</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 5. REAL-WORLD IMPACT & NUMBERS             */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-gradient-to-r from-[#131b2e] via-[#283044] to-[#131b2e] text-[#eef0ff]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {/* Stat 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#6ffbbe] mb-3">
                    <span className="material-symbols-outlined text-[28px]">apartment</span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">120+</span>
                  <span className="text-sm font-semibold text-[#c3c0ff] mt-1">Écoles Partenaires</span>
                  <span className="text-[11px] text-[#c7c4d8] mt-0.5">Côte d'Ivoire, Sénégal, Cameroun, RDC, Togo</span>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#ffdad2] mb-3">
                    <span className="material-symbols-outlined text-[28px]">phonelink_ring</span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">98.4%</span>
                  <span className="text-sm font-semibold text-[#ffb4a3] mt-1">Parents Actifs</span>
                  <span className="text-[11px] text-[#c7c4d8] mt-0.5">Consultation régulière dès le premier mois</span>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#6ffbbe] mb-3">
                    <span className="material-symbols-outlined text-[28px]">trending_down</span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">-85%</span>
                  <span className="text-sm font-semibold text-[#6ffbbe] mt-1">Absences Non Signalées</span>
                  <span className="text-[11px] text-[#c7c4d8] mt-0.5">Notification immédiate aux tuteurs</span>
                </div>

                {/* Stat 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#c3c0ff] mb-3">
                    <span className="material-symbols-outlined text-[28px]">network_cell</span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">100%</span>
                  <span className="text-sm font-semibold text-[#c3c0ff] mt-1">Optimisé Bas Débit</span>
                  <span className="text-[11px] text-[#c7c4d8] mt-0.5">Opérationnel en 2G/3G/4G & Offline</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 6. FEATURED SUCCESS STORY & TESTIMONIALS   */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-white" id="temoignages">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-xs text-[#ae3115] font-bold uppercase tracking-widest mb-2">Témoignages du Terrain</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight max-w-2xl">
                  Ce que disent les chefs d'établissement et les parents
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
                {/* Feature classroom image */}
                <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl aspect-[16/10] border border-[#eaedff]">
                  <img 
                    alt="Enseignante africaine utilisant la tablette en classe" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8J1307uhPl3aXQ848RA_fFHU3OU4WNK0npl2AWxi4GVj6dOrqELcoyKj_y7H87zmEWMyW1kKq4SeYHCm3-PgLO3mUfbI6ZDyuDHk5ex8vvPskGIdF1UD_SrbxFLeQRr3PlBtayHsOebD8FWGLds0s3ftnjkAKOwb3z1o6c2Xlsx46Qg0272lqba4MAu-VHGy6kshOCCw5UTp_EkXPxnUC6yrIM5rTVkDx9MWfWDEp"
                  />
                </div>

                {/* Featured quote */}
                <div className="lg:col-span-6 flex flex-col justify-center p-4 lg:p-6">
                  <div className="flex items-center gap-1 text-[#fd6a49] mb-4">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <blockquote className="text-base sm:text-lg text-[#131b2e] italic leading-relaxed mb-6">
                    « En adoptant EduLiaison pour nos 1 200 élèves, nous avons réduit de 90% les conflits liés aux bulletins scolaires et aux retards. Les professeurs saisissent leurs notes en salle des maîtres sur tablette en quelques secondes. Pour la direction, c'est un gain de sérénité inestimable. »
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#e2dfff] flex items-center justify-center text-[#3525cd] font-bold text-base">
                      AS
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#131b2e]">M. Amadou Sow</span>
                      <span className="text-xs text-[#464555]">Proviseur • Complexe Scolaire d'Excellence Les Almadies, Dakar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="p-6 rounded-2xl bg-[#f2f3ff] shadow-xs flex flex-col justify-between border border-[#eaedff]">
                  <p className="text-xs sm:text-sm text-[#464555] italic mb-6 leading-relaxed">
                    « Mon travail m'amène à voyager fréquemment en Afrique de l'Ouest. Avec l'application, je signe le carnet de mes deux garçons depuis mon téléphone et je sais instantanément s'ils sont arrivés en classe le matin. »
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffdad2] flex items-center justify-center text-xs text-[#ae3115] font-bold">FT</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Fatou Traoré</span>
                      <span className="text-[11px] text-[#464555]">Mère d'élève • Abidjan Cocody</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-6 rounded-2xl bg-[#f2f3ff] shadow-xs flex flex-col justify-between border border-[#eaedff]">
                  <p className="text-xs sm:text-sm text-[#464555] italic mb-6 leading-relaxed">
                    « L'intégration avec WhatsApp a été décisive. Même les parents qui ne téléchargent pas d'applications lourdes reçoivent les alertes en direct sans surcoût pour notre établissement. »
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6ffbbe] flex items-center justify-center text-xs text-[#005338] font-bold">PK</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Paul Kengne</span>
                      <span className="text-[11px] text-[#464555]">Directeur des Études • Douala</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-6 rounded-2xl bg-[#f2f3ff] shadow-xs flex flex-col justify-between border border-[#eaedff]">
                  <p className="text-xs sm:text-sm text-[#464555] italic mb-6 leading-relaxed">
                    « La saisie des notes trimestrielles me prenait deux week-ends entiers. Maintenant, en 40 minutes mes appréciations sont validées et les bulletins sont prêts à être imprimés ou envoyés. »
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e2dfff] flex items-center justify-center text-xs text-[#3525cd] font-bold">EB</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Esther Bamba</span>
                      <span className="text-[11px] text-[#464555]">Professeur de SVT • Lomé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 7. PRICING & ADOPTION SECTION              */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-[#f2f3ff]" id="tarifs">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-xs text-[#3525cd] font-bold uppercase tracking-widest mb-2">Tarification Accessible</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight max-w-2xl">
                  Un modèle clair et économique, adapté à chaque établissement
                </h2>
                <p className="text-xs sm:text-sm text-[#464555] max-w-xl mt-2">
                  Zéro investissement matériel lourd. La transition numérique se finance intégralement grâce aux économies de papier.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                {/* Starter Plan */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-md flex flex-col justify-between border border-[#eaedff]">
                  <div>
                    <span className="text-xs text-[#464555] uppercase font-bold tracking-wider">Collège / Primaire Essentiel</span>
                    <div className="mt-2 mb-4 flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">1 500</span>
                      <span className="text-xs text-[#464555] font-semibold">FCFA / élève / an</span>
                    </div>
                    <p className="text-xs text-[#464555] mb-6 leading-relaxed">
                      Idéal pour numériser le carnet de liaison et fluidifier les alertes présences de base.
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-[#131b2e]">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Carnet de liaison numérique</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Relevé d'absences et retards</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Notifications par Push Mobile</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Support technique par email</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDemoModal(true)}
                    className="w-full mt-8 h-12 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-bold text-xs transition-all cursor-pointer" 
                    type="button"
                  >
                    Choisir cette formule
                  </button>
                </div>

                {/* Pro Institution (Popular) */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#3525cd] to-[#4f46e5] text-white shadow-2xl flex flex-col justify-between transform md:-translate-y-4">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-[#fd6a49] text-white text-[10px] uppercase font-bold tracking-wider shadow-md">
                    Le Plus Plébiscité
                  </div>
                  <div>
                    <span className="text-xs text-[#c3c0ff] uppercase font-bold tracking-wider">Institution Complète</span>
                    <div className="mt-2 mb-4 flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">2 800</span>
                      <span className="text-xs text-[#c3c0ff]">FCFA / élève / an</span>
                    </div>
                    <p className="text-xs text-[#dad7ff] mb-6 leading-relaxed">
                      La solution intégrale : bulletins certifiés, suivi financier et SMS illimités.
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-white">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">check_circle</span> Tout le pack Essentiel</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">check_circle</span> Bulletins officiels avec QR de sécurité</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">check_circle</span> Passerelle SMS Directe & WhatsApp</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">check_circle</span> Suivi des paiements Mobile Money</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">check_circle</span> Formation offerte sur site aux professeurs</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDemoModal(true)}
                    className="w-full mt-8 h-12 rounded-xl bg-white text-[#3525cd] font-bold text-xs shadow-lg hover:bg-[#faf8ff] transition-all cursor-pointer" 
                    type="button"
                  >
                    Démarrer le déploiement
                  </button>
                </div>

                {/* Custom Campus */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white shadow-md flex flex-col justify-between border border-[#eaedff]">
                  <div>
                    <span className="text-xs text-[#464555] uppercase font-bold tracking-wider">Réseau & Groupes Scolaires</span>
                    <div className="mt-2 mb-4 flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#131b2e]">Sur-mesure</span>
                    </div>
                    <p className="text-xs text-[#464555] mb-6 leading-relaxed">
                      Pour les réseaux de plus de 2 000 élèves, congrégations et groupes scolaires multi-sites.
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-[#131b2e]">
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Hébergement dédié local</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Intégration comptable ERP & SIGE</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> Responsable de compte dédié</div>
                      <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#006e4b] text-[18px]">check</span> SLA garanti 99.9%</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDemoModal(true)}
                    className="w-full mt-8 h-12 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-bold text-xs transition-all cursor-pointer" 
                    type="button"
                  >
                    Contacter nos conseillers
                  </button>
                </div>
              </div>

              {/* Free setup badge banner */}
              <div className="mt-8 max-w-3xl mx-auto p-4 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left border border-[#eaedff]">
                <div className="w-12 h-12 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#005338] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#131b2e]">Zéro frais d'installation cachés</span>
                  <span className="text-xs text-[#464555]">Formation complète de votre corps enseignant et de l'administration offerte lors du déploiement.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* 8. HIGH CONVERSION BOTTOM CTA BANNER       */}
          {/* ========================================== */}
          <section className="w-full px-6 sm:px-8 py-16 bg-white" id="demo-ecole">
            <div className="max-w-7xl mx-auto">
              <div className="relative w-full rounded-3xl p-8 sm:p-12 lg:p-20 bg-gradient-to-br from-[#3525cd] via-[#4f46e5] to-[#fd6a49] text-white overflow-hidden shadow-2xl">
                {/* Background light swirls */}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#ae3115]/30 blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs uppercase font-bold tracking-widest mb-6">
                    Mise en service rapide en 48 heures
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                    Prêt à moderniser votre établissement et rapprocher vos familles ?
                  </h2>
                  <p className="text-xs sm:text-base text-[#dad7ff] mb-8 leading-relaxed">
                    Rejoignez plus de 120 établissements innovants à travers le continent. Nos experts vous accompagnent pas à pas dans l'intégration de votre école.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
                    <button 
                      onClick={() => setShowDemoModal(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-white text-[#3525cd] font-bold text-xs sm:text-sm shadow-xl hover:bg-[#faf8ff] transition-all cursor-pointer" 
                      type="button"
                    >
                      <span>Prendre rendez-vous pour une démo</span>
                      <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    </button>
                    <a 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl bg-[#6ffbbe] text-[#002113] font-bold text-xs sm:text-sm shadow-md hover:bg-[#4edea3] transition-all" 
                      href="https://wa.me/22507000000" 
                      rel="noopener noreferrer" 
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                      <span>Discuter sur WhatsApp avec un conseiller</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 text-[#dad7ff] text-xs font-semibold">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">done</span> Sans engagement de durée</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">done</span> Import des élèves depuis Excel en 10 min</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">done</span> Accompagnement pédagogique dédié</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ========================================== */}
      {/* FOOTER EXACT AU CODE FOURNI                */}
      {/* ========================================== */}
      <footer className="w-full bg-[#f2f3ff] pt-16 pb-8 border-t border-[#eaedff]">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#eaedff]">
            {/* Col 1: Logo & Vision */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <img 
                  alt="EduLiaison" 
                  className="h-10 w-10 rounded-xl object-cover shadow-xs" 
                  src="/logo.png"
                />
                <div className="flex flex-col">
                  <span className="font-black text-xl text-[#131b2e] leading-tight tracking-tight">
                    Edu<span className="text-[#3525cd]">Liaison</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#777587] tracking-wider uppercase leading-none">
                    Carnet Scolaire Numérique
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#464555] max-w-md leading-relaxed">
                La plateforme intégrée de carnet de liaison, bulletins scolaires biométriques et suivi des frais en temps réel, conçue pour réinventer la réussite éducative à travers le continent africain.
              </p>
              <div className="flex items-center gap-3">
                <a className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#464555] hover:bg-[#4f46e5] hover:text-white transition-all" href="#" title="Portail Global">
                  <span className="material-symbols-outlined text-[18px]">public</span>
                </a>
                <a className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#464555] hover:bg-[#4f46e5] hover:text-white transition-all" href="https://wa.me/" title="WhatsApp Support">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </a>
                <a className="w-9 h-9 rounded-full bg-[#eaedff] flex items-center justify-center text-[#464555] hover:bg-[#4f46e5] hover:text-white transition-all" href="mailto:contact@eduliaison.africa" title="Email Contact">
                  <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-[10px] font-bold">Abidjan</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-[10px] font-bold">Dakar</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-[10px] font-bold">Douala</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-[10px] font-bold">Kinshasa</span>
              </div>
            </div>

            {/* Col 2: Plateforme */}
            <div className="flex flex-col gap-3">
              <span className="text-xs text-[#131b2e] uppercase tracking-wider font-bold">Plateforme</span>
              <nav className="flex flex-col gap-2">
                <a className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors" href="#showcase">Carnet de Liaison</a>
                <a className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors" href="#showcase">Bulletins Numériques</a>
                <a className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors" href="#showcase">Émargement & Présence</a>
                <a className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors" href="#tarifs">Mobile Money & Scolarités</a>
                <a className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors" href="#tarifs">Grilles Tarifaires</a>
              </nav>
            </div>

            {/* Col 3: Établissements */}
            <div className="flex flex-col gap-3">
              <span className="text-xs text-[#131b2e] uppercase tracking-wider font-bold">Établissements</span>
              <nav className="flex flex-col gap-2">
                <button onClick={() => onOpenAuth('login', 'direction')} className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors text-left cursor-pointer">
                  Portail Direction
                </button>
                <button onClick={() => onOpenAuth('login', 'enseignant')} className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors text-left cursor-pointer">
                  Portail Enseignant
                </button>
                <button onClick={() => onOpenAuth('login', 'parent')} className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors text-left cursor-pointer">
                  Application Parents
                </button>
                <button onClick={() => setShowDemoModal(true)} className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors text-left cursor-pointer">
                  Demande de Démonstration
                </button>
                <a className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors" href="#temoignages">
                  Études de Cas
                </a>
              </nav>
            </div>

            {/* Col 4: Newsletter & Contact */}
            <div className="flex flex-col gap-3">
              <span className="text-xs text-[#131b2e] uppercase tracking-wider font-bold">Newsletter & Contact</span>
              <p className="text-xs text-[#464555]">
                Recevez nos analyses sur l'innovation pédagogique et la numérisation des écoles en Afrique.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <input 
                    className="h-10 px-3 rounded-lg bg-white text-[#131b2e] text-xs focus:outline-none flex-1 border border-[#eaedff]" 
                    placeholder="votre.email@ecole.org" 
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button 
                    className="h-10 px-4 rounded-lg bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5] transition-all cursor-pointer" 
                    type="submit"
                  >
                    S'inscrire
                  </button>
                </div>
                {newsletterSuccess && (
                  <span className="text-[11px] text-[#006e4b] font-bold">✓ Merci ! Vous êtes bien inscrit.</span>
                )}
                <span className="text-xs text-[#464555] flex items-center gap-1.5 pt-1">
                  <span className="material-symbols-outlined text-[#006e4b] text-[16px]">support_agent</span>
                  <span>WhatsApp Support: +225 07 00 00 00</span>
                </span>
                <span className="text-xs text-[#464555] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#3525cd] text-[16px]">mail</span>
                  <span>contact@eduliaison.africa</span>
                </span>
              </form>
            </div>
          </div>

          {/* RGPD & Sovereignty bar */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#eaedff] rounded-2xl p-4 my-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#005338] text-[24px]">verified_user</span>
              <div className="flex flex-col">
                <span className="text-xs text-[#131b2e] font-bold">Souveraineté des Données & Conformité RGPD / Protection Locale</span>
                <span className="text-[11px] text-[#464555]">Chiffrement de bout en bout, hébergement souverain certifié conforme aux réglementations nationales de protection des données scolaires.</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#464555] shrink-0">
              <a className="hover:text-[#131b2e]" href="#confidentialite">Confidentialité</a>
              <a className="hover:text-[#131b2e]" href="#mentions">Mentions Légales</a>
              <a className="hover:text-[#131b2e]" href="#securite">Sécurité</a>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-[#777587]">
            © 2025 EduLiaison Technologies SAS. Tous droits réservés. Déployé avec fierté pour l'éducation africaine.
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-[#283044]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-[#e2dfff] text-[#3525cd] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </span>
                <h3 className="text-base font-bold text-[#131b2e]">Demander une démo école</h3>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#464555] hover:bg-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {demoSubmitted ? (
              <div className="p-6 bg-[#6ffbbe]/20 text-[#005338] rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-[#006e4b]">check_circle</span>
                <h4 className="font-bold text-sm">Demande transmise avec succès !</h4>
                <p className="text-xs text-[#464555]">
                  Notre équipe régionale vous contactera sous 24h ouvrées pour déployer l'essai gratuit dans votre établissement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Nom de l'établissement</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Groupe Scolaire Excellence"
                    value={demoSchoolName}
                    onChange={(e) => setDemoSchoolName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:ring-2 focus:ring-[#3525cd]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-[#131b2e] block mb-1">Ville / Pays</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Abidjan, CI"
                      value={demoCity}
                      onChange={(e) => setDemoCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#131b2e] block mb-1">Effectif estimé</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Ex: 450 élèves"
                      value={demoStudentCount}
                      onChange={(e) => setDemoStudentCount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Nom du responsable</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: M. Jean-Claude Bamba (Proviseur)"
                    value={demoContactName}
                    onChange={(e) => setDemoContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:ring-2 focus:ring-[#3525cd]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#131b2e] block mb-1">Téléphone / WhatsApp</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+225 07 00 00 00 00"
                    value={demoPhone}
                    onChange={(e) => setDemoPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-xs text-[#131b2e] outline-none focus:ring-2 focus:ring-[#3525cd]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#fd6a49] text-white font-bold text-xs shadow-md active:scale-98 transition-transform cursor-pointer mt-2"
                >
                  Valider ma demande d'essai 30 jours
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
