import React, { useState } from 'react';

interface TeacherDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigateTab }) => {
  const [callingRoll, setCallingRoll] = useState(false);
  const [rollSuccess, setRollSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickRollcall = () => {
    setCallingRoll(true);
    setTimeout(() => {
      setCallingRoll(false);
      setRollSuccess(true);
      showToast("Appel ouvert pour la classe de 3ème A (Salle 104)");
      setTimeout(() => setRollSuccess(false), 3000);
    }, 700);
  };

  const handleDownloadTool = (name: string) => {
    showToast(`Téléchargement de : ${name}...`);
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* 1. En-tête de bienvenue & Actions rapides */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-[#eaedff] overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiIfUtZvby52eyPm_xeGMMyObSWHcwY4xxqSG7evuCDy1s4d2TZM7aF3VPIhqmrb38NMu40fx081uxcBOapyAJOEoMr2DXnnXQ9pdgDhQpJ2TsNMcOfXwGimvjvMQVPFjhbVswlMg8Jt27yQKslLMNs9tCjOG8tePBHJ1nrvjYK4SPfHRQRRUdHvH2hE5t2YSKlVsGGGrMaazEAESafJ21eoQz_ZnEXJZwoChBJ_IdNXMatSMGGctl4A" 
                alt="Mme Aya Touré" 
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#005338] shadow-xs"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">Bonjour, Mme Aya Touré 👋</h1>
                <span className="px-3 py-0.5 rounded-full bg-[#3525cd]/10 text-[#3525cd] text-xs uppercase tracking-wider font-bold">Session Ouverte</span>
              </div>
              <p className="text-xs sm:text-sm text-[#464555] mt-0.5">
                Professeur Principal <strong className="text-[#131b2e] font-semibold">(3ème A)</strong> • Lettres Modernes & Français
              </p>
              <div className="flex items-center gap-2 text-xs text-[#777587] mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[#464555]">
                  <span className="material-symbols-outlined text-[16px] text-[#3525cd]">school</span> Groupe Scolaire Excellence d'Abidjan
                </span>
                <span className="text-[#c7c4d8]">•</span>
                <span>Année 2024–2025</span>
                <span className="text-[#c7c4d8]">•</span>
                <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#131b2e] font-semibold">Trimestre 2</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={handleQuickRollcall}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3525cd] text-white text-xs font-bold shadow-md hover:bg-[#4f46e5] transition-all active:scale-95 cursor-pointer" 
              id="quick-rollcall-btn"
            >
              <span className={`material-symbols-outlined text-[18px] ${callingRoll ? 'animate-spin' : ''}`}>
                {callingRoll ? 'sync' : rollSuccess ? 'check' : 'how_to_reg'}
              </span>
              <span>{callingRoll ? 'Ouverture...' : rollSuccess ? 'Appel ouvert !' : "Faire l'appel express"}</span>
            </button>
            <button 
              onClick={() => onNavigateTab('teacher-gradebook')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#dae2fd] transition-colors cursor-pointer border border-[#dae2fd]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3525cd]">edit_note</span>
              <span>Saisir des notes</span>
            </button>
            <button 
              onClick={() => onNavigateTab('teacher-liaison')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffdad2] text-[#ae3115] text-xs font-bold hover:bg-[#ffb4a3] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Mot de liaison</span>
            </button>
          </div>
        </section>

        {/* 2. Bandeau "Cours en cours ou prochain cours" */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3525cd]/10 via-white to-[#eaedff] p-5 sm:p-6 shadow-md border border-[#eaedff]">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#3525cd]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#3525cd] text-white shadow-sm min-w-[130px] text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#dad7ff] font-bold">Dans 15 min</span>
                <span className="text-3xl font-extrabold tracking-tight mt-0.5">10:00</span>
                <span className="text-xs text-white/80 font-medium">Salle 104</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fd6a49] text-white text-[10px] font-bold animate-pulse">PROCHAIN COURS</span>
                  <span className="text-base sm:text-lg font-bold text-[#131b2e]">Français — Classe de 3ème A</span>
                  <span className="text-[#777587] text-xs font-semibold">• 42 Élèves inscrits</span>
                </div>
                <div className="flex items-start gap-2 text-[#464555] text-xs sm:text-sm pt-0.5">
                  <span className="material-symbols-outlined text-[18px] text-[#3525cd] shrink-0 mt-0.5">menu_book</span>
                  <p>
                    <strong className="text-[#131b2e] font-semibold">Objectif du jour :</strong> Analyse stylistique de <em>Les Soleils des Indépendances</em> d'A. Kourouma & restitution corrigée du DS N°3.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#777587] pt-1">
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#005338]"></span> Matériel vidéoprojecteur réservé</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#fd6a49]"></span> 2 PAI déclarés (Asthme / Tiers-temps)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => onNavigateTab('teacher-schedule')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-bold shadow-xs hover:bg-[#f2f3ff] transition-colors cursor-pointer border border-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3525cd]">auto_stories</span>
                <span>Cahier de textes séance</span>
              </button>
              <button 
                onClick={handleQuickRollcall}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005338] text-white text-xs font-bold shadow hover:bg-[#006e4b] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Lancer l'appel en 1 clic</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Grille de KPIs Enseignant (4 cartes de métriques) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#777587] font-bold">Cohortes actives</span>
              <div className="w-9 h-9 rounded-xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#131b2e] tracking-tight">4</span>
                <span className="text-sm text-[#777587] font-normal">classes</span>
              </div>
              <p className="text-xs text-[#464555] mt-1">
                <strong>168</strong> élèves (3eA, 3eB, 4eC, 6eA)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f2f3ff] flex items-center gap-1 text-xs text-[#005338] font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>100% livrets pédagogiques configurés</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#777587] font-bold">Évaluations à traiter</span>
              <div className="w-9 h-9 rounded-xl bg-[#ffdad2] text-[#ae3115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#131b2e] tracking-tight">1</span>
                <span className="text-xs font-bold text-[#ae3115]">devoir en cours</span>
              </div>
              <p className="text-xs text-[#464555] mt-1">
                3ème B — Devoir N°2 (12 copies restantes)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-xs">
              <span className="text-[#777587]">Échéance conseil :</span>
              <span className="font-bold text-[#ae3115]">24 Mars 2025</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#777587] font-bold">Assiduité journalière</span>
              <div className="w-9 h-9 rounded-xl bg-[#6ffbbe]/40 text-[#005338] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#005338] tracking-tight">97.8%</span>
                <span className="text-xs text-[#005338] font-bold bg-[#6ffbbe] px-1.5 py-0.5 rounded-full">+0.4%</span>
              </div>
              <p className="text-xs text-[#464555] mt-1">
                3 retards consignés par la Vie Scolaire
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f2f3ff] flex items-center gap-1 text-xs text-[#777587]">
              <span className="material-symbols-outlined text-[16px] text-[#3525cd]">schedule</span>
              <span>Pointage 08h00 clôturé sans incident</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#777587] font-bold">Carnet de Liaison</span>
              <div className="w-9 h-9 rounded-xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#131b2e] tracking-tight">2</span>
                <span className="text-xs font-bold text-[#3525cd]">nouveaux messages</span>
              </div>
              <p className="text-xs text-[#464555] mt-1">
                Famille Kouamé & Famille Traoré
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f2f3ff] flex items-center gap-1 text-xs text-[#ae3115]">
              <span className="w-2 h-2 rounded-full bg-[#fd6a49]"></span>
              <span>1 demande de RDV en attente</span>
            </div>
          </div>
        </section>

        {/* 4. Section Principale 2 Colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= COLONNE GAUCHE (8 COLS) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* A. Emploi du temps de la journée */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#eaedff]">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">Emploi du temps — Mercredi 12 Mars 2025</h2>
                  <p className="text-xs text-[#777587]">4 plages horaires planifiées • Bâtiment Lettres & Arts</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-[#eaedff] text-xs text-[#131b2e] font-semibold">Semaine B</span>
                  <button 
                    onClick={() => onNavigateTab('teacher-schedule')}
                    className="p-1 rounded-lg hover:bg-[#f2f3ff] text-[#777587] hover:text-[#131b2e] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">calendar_view_week</span>
                  </button>
                </div>
              </div>

              {/* Timeline items */}
              <div className="flex flex-col gap-3">
                {/* Item 1: Terminé */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#f2f3ff] transition-colors border border-[#eaedff]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center shrink-0">
                      <div className="text-xs font-bold text-[#131b2e]">08:00</div>
                      <div className="text-[11px] text-[#777587]">10:00</div>
                    </div>
                    <div className="w-1.5 h-10 rounded-full bg-[#005338] shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#131b2e]">Français — 4ème C</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">Terminé</span>
                      </div>
                      <div className="text-xs text-[#777587] mt-0.5">
                        Salle 102 • Dictée préparée & grammaire de phrase
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:pl-4">
                    <span className="text-xs text-[#005338] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span> Appel validé (0 absent)
                    </span>
                  </div>
                </div>

                {/* Item 2: Imminent / En cours */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#3525cd]/5 shadow-xs border border-[#c3c0ff]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center shrink-0">
                      <div className="text-xs font-bold text-[#3525cd]">10:15</div>
                      <div className="text-[11px] text-[#3525cd]/70">12:00</div>
                    </div>
                    <div className="w-1.5 h-10 rounded-full bg-[#3525cd] shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#3525cd]">Français — 3ème A</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#3525cd] text-white text-[10px] font-bold">Imminent</span>
                      </div>
                      <div className="text-xs text-[#464555] mt-0.5">
                        Salle 104 • Littérature francophone (Kourouma)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:pl-4">
                    <button 
                      onClick={handleQuickRollcall}
                      className="px-4 py-1.5 rounded-lg bg-[#3525cd] text-white text-xs font-semibold hover:bg-[#4f46e5] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                      <span>Faire l'appel</span>
                    </button>
                  </div>
                </div>

                {/* Item 3: Après-midi */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white hover:bg-[#f2f3ff] transition-colors border border-[#eaedff]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center shrink-0">
                      <div className="text-xs font-bold text-[#131b2e]">14:00</div>
                      <div className="text-[11px] text-[#777587]">15:30</div>
                    </div>
                    <div className="w-1.5 h-10 rounded-full bg-[#fd6a49] shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#131b2e]">Soutien BEPC — Lettres</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] text-[10px] font-bold">Remédiation</span>
                      </div>
                      <div className="text-xs text-[#777587] mt-0.5">
                        Salle Polyvalente 1 • Méthodologie du sujet de réflexion
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:pl-4">
                    <span className="text-xs text-[#777587]">18 élèves inscrits</span>
                  </div>
                </div>

                {/* Item 4: Permanence */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white hover:bg-[#f2f3ff] transition-colors border border-[#eaedff]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center shrink-0">
                      <div className="text-xs font-bold text-[#131b2e]">16:00</div>
                      <div className="text-[11px] text-[#777587]">17:00</div>
                    </div>
                    <div className="w-1.5 h-10 rounded-full bg-[#c7c4d8] shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#131b2e]">Permanence Pédagogique & RDV Parents</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-[10px] font-semibold">Bureau Professeur</span>
                      </div>
                      <div className="text-xs text-[#777587] mt-0.5">
                        Salle des Professeurs • 2 entretiens planifiés
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:pl-4">
                    <span className="material-symbols-outlined text-[#777587] text-[20px]">event</span>
                  </div>
                </div>
              </div>
            </div>

            {/* B. Gestion rapide des évaluations & Bulletins */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#eaedff]">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">Suivi des Évaluations & Saisie des Notes</h2>
                  <p className="text-xs text-[#777587]">Trimestre 2 • Coefficients officiels appliqués</p>
                </div>
                <button 
                  onClick={() => onNavigateTab('teacher-gradebook')}
                  className="inline-flex items-center gap-1 text-xs text-[#3525cd] font-bold hover:underline cursor-pointer"
                >
                  <span>Voir tout le carnet de notes</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Evaluation Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eval 1 */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#3525cd]/10 text-[#3525cd] text-[10px] font-bold">3ème A</span>
                        <h3 className="text-sm font-bold text-[#131b2e] mt-1">Devoir Surveillé N°3</h3>
                        <p className="text-xs text-[#777587]">Texte argumentatif • Coeff. 3</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">done_all</span> Clôturé
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-1">
                      <div>
                        <span className="text-[11px] text-[#777587]">Moyenne de classe</span>
                        <div className="text-lg font-extrabold text-[#131b2e]">14.8 <span className="text-xs text-[#777587] font-normal">/20</span></div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-[#777587]">Copies saisies</span>
                        <div className="text-xs font-bold text-[#005338]">42 / 42 (100%)</div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#eaedff] h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#005338] h-full rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#eaedff] flex items-center justify-between">
                    <span className="text-[11px] text-[#777587]">Transmis à la Direction</span>
                    <button 
                      onClick={() => onNavigateTab('teacher-gradebook')}
                      className="p-1 rounded text-[#3525cd] hover:bg-[#eaedff] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Consulter le relevé</span>
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Eval 2 */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-[#ffdad2] text-[#ae3115] text-[10px] font-bold">3ème B</span>
                        <h3 className="text-sm font-bold text-[#131b2e] mt-1">Interrogation Écrite Poésie</h3>
                        <p className="text-xs text-[#777587]">Figures de style & versification • Coeff. 1</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">pending</span> En cours
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-1">
                      <div>
                        <span className="text-[11px] text-[#777587]">Moyenne provisoire</span>
                        <div className="text-lg font-extrabold text-[#131b2e]">13.2 <span className="text-xs text-[#777587] font-normal">/20</span></div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-[#777587]">Progression saisie</span>
                        <div className="text-xs font-bold text-[#ae3115]">28 / 40 (70%)</div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#eaedff] h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#fd6a49] h-full rounded-full w-[70%]"></div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#eaedff] flex items-center justify-between">
                    <span className="text-[11px] text-[#ae3115] font-bold">12 copies restantes</span>
                    <button 
                      onClick={() => onNavigateTab('teacher-gradebook')}
                      className="px-3 py-1 rounded-lg bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Continuer la saisie</span>
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* C. Appels & Absences récentes à confirmer */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffdad2] text-[#ae3115] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">person_alert</span>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">Signalements récents & Suivi CPE</h2>
                    <p className="text-xs text-[#777587]">Synchronisation en direct avec la Vie Scolaire (M. Bakary Koné - CPE)</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-[#eaedff] text-[#464555] font-semibold">3 alertes ce matin</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Student 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#f2f3ff] gap-3 border border-[#eaedff]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#eaedff] flex items-center justify-center font-bold text-[#131b2e] text-xs">
                      KB
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131b2e]">Kouassi Boris</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eaedff] text-[#777587] font-bold">3ème A</span>
                      </div>
                      <div className="text-xs text-[#ae3115] font-medium">
                        Absent • 08h00 - 10h00 (Français) • Motif : Non justifié
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => showToast("Historique de Kouassi Boris consulté.")}
                      className="px-3 py-1 rounded-lg bg-white text-[#131b2e] text-xs font-semibold hover:bg-[#eaedff] transition-colors cursor-pointer border border-[#eaedff]"
                    >
                      Voir historique
                    </button>
                    <button 
                      onClick={() => showToast("Relance transmise au bureau de M. Bakary Koné (CPE).")}
                      className="px-3 py-1 rounded-lg bg-[#3525cd]/10 text-[#3525cd] text-xs font-bold hover:bg-[#3525cd]/20 transition-colors cursor-pointer"
                    >
                      Relancer CPE
                    </button>
                  </div>
                </div>

                {/* Student 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#f2f3ff] gap-3 border border-[#eaedff]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#eaedff] flex items-center justify-center font-bold text-[#131b2e] text-xs">
                      DM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131b2e]">Diallo Mariam</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eaedff] text-[#777587] font-bold">3ème A</span>
                      </div>
                      <div className="text-xs text-[#777587]">
                        Retard 15 min • Arrivée 08h15 • Justifié (Embouteillages Boulevard Mitterrand)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-[#005338] font-bold bg-[#6ffbbe] px-2.5 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[16px]">check</span> Validé CPE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= COLONNE DROITE (4 COLS) ================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* D. Messages & Liaison Familles */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[20px]">mark_chat_unread</span>
                  <h2 className="text-base font-bold text-[#131b2e]">Liaison Familles</h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#fd6a49] text-white text-[10px] font-bold">2 nouveaux</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Message 1 */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] relative overflow-hidden border border-[#eaedff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3525cd]"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#3525cd] uppercase">Parent d'Awa Kouamé (3eA)</span>
                    <span className="text-[10px] text-[#777587]">09:12</span>
                  </div>
                  <div className="text-xs font-bold text-[#131b2e] mt-1">M. Koffi Kouamé</div>
                  <p className="text-xs text-[#464555] mt-1 line-clamp-2">
                    "Bonjour Madame Touré, merci pour votre retour d'hier. Je confirme que je serai bien disponible pour notre rendez-vous vendredi à 16h30."
                  </p>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#eaedff]">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#005338] font-bold">
                      <span className="material-symbols-outlined text-[14px]">done</span> Confirmé
                    </span>
                    <button 
                      onClick={() => onNavigateTab('teacher-liaison')}
                      className="text-xs text-[#3525cd] font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Répondre</span>
                      <span className="material-symbols-outlined text-[14px]">reply</span>
                    </button>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] relative overflow-hidden border border-[#eaedff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#005338]"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#005338] uppercase">Parent d'Ibrahim (3eB)</span>
                    <span className="text-[10px] text-[#777587]">Hier 18:40</span>
                  </div>
                  <div className="text-xs font-bold text-[#131b2e] mt-1">Mme Traoré Fatoumata</div>
                  <p className="text-xs text-[#464555] mt-1 line-clamp-2">
                    "Bonjour Professeur, ci-joint l'attestation médicale pour l'absence d'Ibrahim lors du cours de lundi matin."
                  </p>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#eaedff]">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#3525cd] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">attach_file</span> 1 document PDF
                    </span>
                    <button 
                      onClick={() => onNavigateTab('teacher-liaison')}
                      className="text-xs text-[#3525cd] font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Consulter</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>

              <a 
                className="w-full py-2.5 px-4 rounded-xl bg-[#6ffbbe]/30 text-[#005236] hover:bg-[#6ffbbe]/50 transition-colors text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-[#6ffbbe]" 
                href="https://wa.me/" 
                rel="noopener noreferrer" 
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Permanence WhatsApp Enseignants</span>
              </a>
            </div>

            {/* E. Annonces & Vie Pédagogique */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#eaedff]">
                <span className="material-symbols-outlined text-[#ae3115] text-[20px]">campaign</span>
                <h2 className="text-base font-bold text-[#131b2e]">Direction & Pédagogie</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#ae3115] uppercase">Note de service N°44</span>
                    <span className="text-[10px] text-[#777587]">10 Mars</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#131b2e] mt-1">Journées Pédagogiques Régionales</h3>
                  <p className="text-xs text-[#464555] mt-1">
                    Ateliers d'harmonisation des épreuves types BEPC le jeudi 27 Mars. Présence obligatoire de l'équipe de Lettres.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#3525cd] uppercase">Conseils de classe T2</span>
                    <span className="text-[10px] text-[#777587]">Planning</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#131b2e] mt-1">Arrêt des notes : 24 Mars à 18h</h3>
                  <p className="text-xs text-[#464555] mt-1">
                    La délibération pour la 3ème A se tiendra le mardi 25 Mars à 17h00 en salle du conseil.
                  </p>
                </div>
              </div>
            </div>

            {/* F. Outils rapides & Téléchargements */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <h2 className="text-base font-bold text-[#131b2e] pb-2 border-b border-[#eaedff]">Outils Rapides Enseignant</h2>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleDownloadTool("Fiche de présence vierge (PDF)")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-left cursor-pointer border border-[#eaedff]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#3525cd] text-[20px]">picture_as_pdf</span>
                    <span className="text-xs font-bold text-[#131b2e]">Fiche de présence vierge (PDF)</span>
                  </div>
                  <span className="material-symbols-outlined text-[#777587] text-[18px]">download</span>
                </button>

                <button 
                  onClick={() => handleDownloadTool("Export Relevé Trimestriel (.xlsx)")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-left cursor-pointer border border-[#eaedff]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#3525cd] text-[20px]">table_view</span>
                    <span className="text-xs font-bold text-[#131b2e]">Export Relevé Trimestriel (.xlsx)</span>
                  </div>
                  <span className="material-symbols-outlined text-[#777587] text-[18px]">download</span>
                </button>

                <button 
                  onClick={() => onNavigateTab('teacher-liaison')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#ffdad2]/70 hover:bg-[#ffdad2] transition-colors text-left cursor-pointer border border-[#ffb4a3]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#ae3115] text-[20px]">warning</span>
                    <span className="text-xs font-bold text-[#ae3115]">Rapport d'incident disciplinaire</span>
                  </div>
                  <span className="material-symbols-outlined text-[#ae3115] text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#283044] text-[#eef0ff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-[#777587]/30">
            <span className="material-symbols-outlined text-[#6ffbbe] text-[22px]">check_circle</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
