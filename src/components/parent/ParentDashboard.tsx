import React, { useState } from 'react';
import { Student } from '../../types';

interface ParentDashboardProps {
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  activeStudent,
  allStudents,
  onSelectStudent,
  onNavigateTab
}) => {
  const [meetingConfirmed, setMeetingConfirmed] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'pending'>('all');

  const isAwa = activeStudent.id === 'awa';

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Greeting & Child Switcher Bar */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e2e7ff] text-[#3525cd] text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">domain</span>
                  Groupe Scolaire Excellence d'Abidjan
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-semibold">
                  Année 2024-2025 • Trimestre 2
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#131b2e] tracking-tight">
                Bienvenue, M. Koffi Kouamé <span className="inline-block animate-pulse">👋</span>
              </h1>
              <p className="text-sm text-[#464555] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#005338]">verified</span>
                Espace de liaison en temps réel • Mercredi 12 Mars 2025
              </p>
            </div>
            
            {/* Quick School Add Token Action */}
            <button 
              onClick={() => onNavigateTab('parent-documents')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#3525cd] text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#f2f3ff] transition-all border border-[#eaedff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Associer un autre élève (Code École)</span>
            </button>
          </div>

          {/* Sibling Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* Child 1: Awa */}
            <div 
              onClick={() => onSelectStudent('awa')}
              className={`lg:col-span-6 p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group ${
                isAwa 
                  ? 'bg-white shadow-md border-l-4 border-l-[#3525cd]' 
                  : 'bg-[#f2f3ff]/70 hover:bg-white shadow-sm opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      className="w-16 h-16 rounded-xl object-cover shadow-sm" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyCWO6vRgTWSq1hrAfnHXeaak3P2Bcsvus6vJkhDzJ4nif1x5A-o4UN_xlMuu68aPm4NXCzl3opcU_n0TpN0UvPK6i58O5ZaYgVH-R8r-EqK7McDfxf4OVR6uq5INjd31D9XdD4BeX_sS09BFmQt0OrG45L0m5Q_VOqrvhu-2mWMeVkl0VwbSUH8lGaf_DF2gq7_zKnCe3jBB_i6BpcOi12bKcSi4pOyK4e-oRglqY2p4vMpsqHnWzuA" 
                      alt="Awa Kouamé" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#4edea3] ring-2 ring-white"></span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#131b2e]">Awa Kouamé</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isAwa ? 'bg-[#e2dfff] text-[#0f0069]' : 'bg-[#e2e7ff] text-[#464555]'}`}>
                        {isAwa ? 'Active' : 'Basculer'}
                      </span>
                    </div>
                    <span className="text-xs text-[#464555]">Classe : 3ème A • Prépa Brevet (BEPC)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs text-[#005338] font-bold">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span> 15,8 / 20
                      </span>
                      <span className="text-[#c7c4d8] text-[12px]">•</span>
                      <span className="text-xs text-[#464555]">Assiduité 98,5%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#005338]"></span> Tout est en ordre
                  </span>
                  <span className="text-xs text-[#464555]">N° Matricule : 2021-AK44</span>
                </div>
              </div>
            </div>

            {/* Child 2: David */}
            <div 
              onClick={() => onSelectStudent('david')}
              className={`lg:col-span-6 p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group ${
                !isAwa 
                  ? 'bg-white shadow-md border-l-4 border-l-[#3525cd]' 
                  : 'bg-[#f2f3ff]/70 hover:bg-white shadow-sm opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      className="w-16 h-16 rounded-xl object-cover shadow-sm" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-V80tIzB0jhA_ZKof11DFHnkNDpg_Wi57zGrcJHz9Fb0fZxduGf60jzuslhaFT0kVWDX8UiTduEswnl3gNWTrvZmoxPGGP0GxSD3CwlI9-z6W9SSEVM6VvV1XCo3sgM8FGfy0SczRFn-Xqbp7Nai6aRoxHCilngVaSxiNMBDEyUquobENsoRtm4Y6F8ijwywagM1QiRb0UNNCVJri4syh_LnqmVLN90xUuZSe2fBRaooQr_eh93rPAA" 
                      alt="David Kouamé" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#fd6a49] ring-2 ring-white"></span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#131b2e]">David Kouamé</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${!isAwa ? 'bg-[#e2dfff] text-[#0f0069]' : 'bg-[#e2e7ff] text-[#464555]'}`}>
                        {!isAwa ? 'Actif' : 'Basculer'}
                      </span>
                    </div>
                    <span className="text-xs text-[#464555]">Classe : 6ème B • Cycle d'Observation</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs text-[#3525cd] font-bold">
                        <span className="material-symbols-outlined text-[16px]">analytics</span> 14,2 / 20
                      </span>
                      <span className="text-[#c7c4d8] text-[12px]">•</span>
                      <span className="text-xs text-[#ae3115] font-semibold">1 retard non justifié</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffdad2] text-[#3d0600] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#ae3115]"></span> Alerte active
                  </span>
                  <span className="text-xs text-[#464555]">N° Matricule : 2024-DK12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Banner & Immediate School Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Urgent Meeting / Action Banner */}
          <div className="lg:col-span-8 p-5 rounded-2xl bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#4338ca] text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px] text-white">calendar_clock</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-white/80 font-bold">Convocation Obligatoire • 3ème</span>
                <h2 className="text-lg font-bold text-white">Réunion Parents-Professeurs de mi-parcours</h2>
                <p className="text-xs text-white/90 mt-0.5">Vendredi 15 Mars à 16h30 • Salle Polyvalente • Présentation des vœux d'orientation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 z-10 w-full sm:w-auto">
              <button 
                onClick={() => setMeetingConfirmed(!meetingConfirmed)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  meetingConfirmed 
                    ? 'bg-[#6ffbbe] text-[#002113]' 
                    : 'bg-white text-[#3525cd] hover:bg-[#e2e7ff]'
                }`}
              >
                {meetingConfirmed ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Confirmé ✓</span>
                  </>
                ) : (
                  <span>Confirmer présence</span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Micro Broadcasts */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-white shadow-sm border border-[#eaedff] gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#464555] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#ae3115]">flash_on</span> En direct de l'école
              </span>
              <span className="text-xs text-[#464555]">Ce matin</span>
            </div>
            <div className="flex items-start gap-3 pt-1">
              <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-[#3525cd]">edit_square</span>
              </div>
              <p className="text-xs text-[#131b2e] leading-snug">
                <span className="font-semibold text-[#3525cd]">Mathématiques :</span> Note de 17/20 publiée par M. Traoré (Coeff. 3).
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#f2f3ff]">
              <span className="text-xs text-[#005338] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">attach_file</span> Circulaire trimestrielle dispo
              </span>
              <button 
                onClick={() => onNavigateTab('parent-documents')}
                className="text-xs text-[#3525cd] font-bold hover:underline cursor-pointer"
              >
                Consulter
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Row (Awa Kouamé) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: General Average */}
          <div className="p-4 rounded-xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#464555]">Moyenne Trimestre 2</span>
              <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[11px] font-bold">+0.6 pt</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-none">15,8</span>
              <span className="text-lg text-[#464555] font-normal">/ 20</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f2f3ff]">
              <span className="text-[#464555]">Rang : <strong className="text-[#131b2e] font-semibold">3ème / 42</strong></span>
              <span className="text-[#005338] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">stars</span> Tableau d'Honneur
              </span>
            </div>
          </div>

          {/* Metric 2: Attendance & Punctuality */}
          <div className="p-4 rounded-xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#464555]">Assiduité & Présence</span>
              <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[11px] font-bold">Exemplaire</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#005338] leading-none">98,5%</span>
              <span className="text-xs text-[#464555]">de présence</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f2f3ff]">
              <span className="text-[#464555]">Injustifiées : <strong className="text-[#005338]">0</strong></span>
              <span className="text-[#464555]">Retard : <strong className="text-[#131b2e] font-semibold">1 (justifié)</strong></span>
            </div>
          </div>

          {/* Metric 3: Conduct & Observations */}
          <div className="p-4 rounded-xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#464555]">Carnet de Conduite</span>
              <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#3525cd] text-[11px] font-bold">4 Éloges</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-none">0</span>
              <span className="text-sm text-[#464555] font-normal">avertissement</span>
            </div>
            <p className="text-xs text-[#464555] truncate pt-1 border-t border-[#f2f3ff]">
              « Élève très investie et moteur... »
            </p>
          </div>

          {/* Metric 4: Upcoming Tests & Homework */}
          <div className="p-4 rounded-xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#464555]">Devoirs & Contrôles</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#3d0600] text-[11px] font-bold">Cette semaine</span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#ae3115] leading-none">2</span>
              <span className="text-sm text-[#464555] font-normal">échéances</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f2f3ff]">
              <span className="text-[#464555]">Physique (Jeu)</span>
              <span className="text-[#464555]">•</span>
              <span className="text-[#464555]">SVT (Ven)</span>
            </div>
          </div>
        </div>

        {/* Central Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Digital Carnet Timeline & Subject Grades */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* SECTION: Live School Timeline (Digital Liaison Book) */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#eaedff]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
                    <span className="material-symbols-outlined text-[24px]">history_edu</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#131b2e]">Timeline Scolaire en Direct</h3>
                    <p className="text-xs text-[#464555]">Le carnet de liaison dématérialisé et sécurisé d'Awa</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setTimelineFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      timelineFilter === 'all' ? 'bg-[#3525cd] text-white shadow-sm' : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                    }`}
                  >
                    Tous les flux
                  </button>
                  <button 
                    onClick={() => setTimelineFilter('pending')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      timelineFilter === 'pending' ? 'bg-[#3525cd] text-white shadow-sm' : 'bg-[#f2f3ff] text-[#464555] hover:text-[#131b2e]'
                    }`}
                  >
                    Signatures en attente
                  </button>
                </div>
              </div>

              {/* Timeline entries */}
              <div className="flex flex-col gap-4 mt-4 relative">
                {/* Timeline Item 1: Grade Entry */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f2f3ff]/50 relative overflow-hidden border border-[#eaedff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3525cd]"></div>
                  <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">grading</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#131b2e]">Nouvelle note : Mathématiques (17 / 20)</span>
                      <span className="text-xs text-[#464555]">Aujourd'hui, 10:15</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#464555] mt-1">
                      Devoir Surveillé N°3 • Géométrie vectorielle et trigonométrie (Coeff. 3).
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#464555]">
                      <span>Moyenne de classe : <strong className="text-[#131b2e]">12,4 / 20</strong></span>
                      <span>Note la plus haute : <strong className="text-[#005338]">19,0</strong></span>
                      <span className="text-[#3525cd] font-semibold">Enseignant : M. Traoré</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 2: Teacher Remark */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f2f3ff]/50 relative overflow-hidden border border-[#eaedff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#005338]"></div>
                  <div className="w-10 h-10 rounded-xl bg-[#005338] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#131b2e]">Observation Pédagogique • Français</span>
                      <span className="text-xs text-[#464555]">Hier, 14:00</span>
                    </div>
                    <blockquote className="text-xs sm:text-sm text-[#131b2e] italic mt-1 bg-white p-3 rounded-lg border border-[#eaedff]">
                      « Excellente participation orale lors du débat littéraire sur l'œuvre d'Amadou Kourouma. Argumentation claire et structurée, continue ainsi ! »
                    </blockquote>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-[#464555]">Auteur : <strong className="text-[#131b2e]">Mme Touré (Professeur Principal)</strong></span>
                      <span className="inline-flex items-center gap-1 text-[#005338] font-semibold">
                        <span className="material-symbols-outlined text-[16px]">done_all</span> Vu & Notifié
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 3: Punctuality Justification */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f2f3ff]/50 relative overflow-hidden border border-[#eaedff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ae3115]"></div>
                  <div className="w-10 h-10 rounded-xl bg-[#ffdad2] text-[#3d0600] flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#131b2e]">Retard matinal de 15 minutes enregistré</span>
                      <span className="text-xs text-[#464555]">Lundi 10 Mars, 07:45</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#464555] mt-1">
                      Arrivée au portail à 07h45 au lieu de 07h30. Billet d'entrée délivré par la vie scolaire.
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                      <span className="text-xs text-[#464555]">Motif transmis : Embouteillages Bd Lagunaire • SMS parent reçu</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Justifié
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 4: Shared Official Document */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f2f3ff]/50 relative overflow-hidden border border-[#eaedff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#777587]"></div>
                  <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#131b2e] flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#131b2e]">Publication du Calendrier des Épreuves Blanches BEPC</span>
                      <span className="text-xs text-[#464555]">8 Mars 2025</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#464555] mt-1">
                      Consultez le planning officiel de passage des épreuves physiques, orales et écrites du brevet blanc session 2025.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button 
                        onClick={() => onNavigateTab('parent-documents')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span> Télécharger le document PDF (420 Ko)
                      </button>
                      <span className="text-[#464555] text-xs">Signé par le Directeur des Études</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: Subject Progress Matrix (Derniers résultats par matière) */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#eaedff]">
                <div>
                  <h3 className="text-lg font-bold text-[#131b2e]">Derniers Résultats par Matière</h3>
                  <p className="text-xs text-[#464555]">Synthèse trimestrielle détaillée des évaluations continues</p>
                </div>
                <button 
                  onClick={() => onNavigateTab('parent-grades')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                >
                  <span>Voir le relevé de notes complet & bulletins PDF</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              {/* Subject Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Math */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
                        <span className="material-symbols-outlined text-[18px]">calculate</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#131b2e]">Mathématiques</h4>
                        <span className="text-xs text-[#464555]">Coefficient 3</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#3525cd]">17,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Français */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#131b2e]">
                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#131b2e]">Français</h4>
                        <span className="text-xs text-[#464555]">Coefficient 3</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#005338]">15,5</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '77.5%' }}></div>
                  </div>
                </div>

                {/* Physique-Chimie */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3525cd]">
                        <span className="material-symbols-outlined text-[18px]">science</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#131b2e]">Physique - Chimie</h4>
                        <span className="text-xs text-[#464555]">Coefficient 2</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#3525cd]">16,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                {/* SVT */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#6ffbbe] flex items-center justify-center text-[#005338]">
                        <span className="material-symbols-outlined text-[18px]">eco</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#131b2e]">SVT</h4>
                        <span className="text-xs text-[#464555]">Coefficient 2</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#131b2e]">14,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-[#006e4b] h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                {/* Anglais */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ffdad2] flex items-center justify-center text-[#ae3115]">
                        <span className="material-symbols-outlined text-[18px]">language</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#131b2e]">Anglais LV1</h4>
                        <span className="text-xs text-[#464555]">Coefficient 2</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#005338]">16,5</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '82.5%' }}></div>
                  </div>
                </div>

                {/* Histoire-Géo */}
                <div className="p-4 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#131b2e]">
                        <span className="material-symbols-outlined text-[18px]">public</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#131b2e]">Histoire - Géo</h4>
                        <span className="text-xs text-[#464555]">Coefficient 2</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#131b2e]">15,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#dae2fd] rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-[#4f46e5] h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Communications, Circulars & Direct School Contact */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* School Circulars & Official Announcements */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-[#eaedff]">
                <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ae3115] text-[22px]">campaign</span>
                  Circulaires & Annonces
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#464555] text-xs font-semibold">2 Nouvelles</span>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {/* Circular 1 */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#3525cd]">Note de Direction</span>
                    <span className="text-xs text-[#464555]">11 Mars</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#131b2e]">Organisation des journées pédagogiques</h4>
                  <p className="text-xs text-[#464555]">
                    Arrêt des cours le jeudi 27 mars à 12h00 pour harmonisation des conseils de classe et bilans.
                  </p>
                  <button 
                    onClick={() => onNavigateTab('parent-documents')}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-white text-[#3525cd] text-xs font-semibold shadow-xs hover:bg-[#e2dfff] transition-colors cursor-pointer border border-[#eaedff]"
                  >
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> Télécharger la note officielle
                  </button>
                </div>

                {/* Circular 2 */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#ae3115]">Vie Scolaire</span>
                    <span className="text-xs text-[#464555]">09 Mars</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#131b2e]">Tenue réglementaire & Discipline</h4>
                  <p className="text-xs text-[#464555]">
                    Rappel ferme : uniforme repassé, macarons visibles et chaussures fermées exigées pour l'accès aux examens blancs.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct School Contacts & African Context Shortcuts */}
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
              <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-2 pb-4 border-b border-[#eaedff]">
                <span className="material-symbols-outlined text-[#005338] text-[22px]">quick_reference</span>
                Équipe Pédagogique & Vie Scolaire
              </h3>

              {/* Contact 1: CPE */}
              <div className="flex items-center justify-between py-3 border-b border-[#f2f3ff]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#131b2e] font-semibold text-sm">
                    BK
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#131b2e]">M. Bakary Koné</span>
                    <span className="text-xs text-[#464555]">Conseiller Principal d'Éducation (CPE)</span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateTab('parent-messaging')}
                  className="w-9 h-9 rounded-lg bg-[#f2f3ff] hover:bg-[#e2dfff] text-[#3525cd] flex items-center justify-center transition-colors cursor-pointer" 
                  title="Envoyer un mot"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                </button>
              </div>

              {/* Contact 2: Teacher */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#131b2e] font-semibold text-sm">
                    AT
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#131b2e]">Mme Aya Touré</span>
                    <span className="text-xs text-[#464555]">Professeur Principal • Français</span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateTab('parent-messaging')}
                  className="w-9 h-9 rounded-lg bg-[#f2f3ff] hover:bg-[#e2dfff] text-[#3525cd] flex items-center justify-center transition-colors cursor-pointer" 
                  title="Envoyer un mot"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </button>
              </div>

              {/* WhatsApp Direct Hotline Button */}
              <div className="mt-4 p-4 rounded-xl bg-[#005338] text-white flex flex-col gap-2 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#6ffbbe]">chat</span>
                  <span className="text-xs font-bold">Permanence WhatsApp Établissement</span>
                </div>
                <p className="text-xs text-white/90">
                  Signalez une urgence, un retard ou une absence médicale instantanément au secrétariat.
                </p>
                <a 
                  className="mt-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-[#005338] text-xs font-bold shadow-sm hover:bg-[#6ffbbe] transition-colors cursor-pointer" 
                  href="https://wa.me/2250700000000" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Ouvrir WhatsApp Secrétariat</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>

              {/* Tuition / School Fees Quick Status */}
              <div className="mt-4 p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#3525cd]">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Écolage & Frais Scolaires</span>
                    <span className="text-xs text-[#005338] font-semibold">Trimestre 2 : Soldé (À jour)</span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateTab('parent-documents')}
                  className="text-xs text-[#3525cd] font-bold hover:underline cursor-pointer"
                >
                  Reçus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
