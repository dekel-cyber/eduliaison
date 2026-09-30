import React, { useState } from 'react';

export const TeacherScheduleLogbook: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<'3A' | '3B' | '4C' | '6A'>('3A');
  const [viewMode, setViewMode] = useState<'semaine' | 'mois'>('semaine');
  const [activeDay, setActiveDay] = useState<'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN'>('MER');
  const [meetingConfirmed, setMeetingConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDuplicate = () => {
    showToast("Séance dupliquée avec succès pour la classe de 3ème B !");
  };

  const handleBroadcast = () => {
    showToast("Rappel du Devoir N°3 diffusé par SMS & WhatsApp aux 42 familles.");
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header Section with Breadcrumb & Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#464555] text-xs font-bold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1 text-[#3525cd]">
                <span className="material-symbols-outlined text-[16px]">school</span> Collège Moderne de Cocody
              </span>
              <span className="text-[#c7c4d8]">•</span>
              <span>Trimestre 2</span>
              <span className="text-[#c7c4d8]">•</span>
              <span className="text-[#005338] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005338] animate-pulse"></span> Synchronisation en ligne
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
              Cahier de Textes & Emploi du Temps
            </h1>
            <p className="text-xs sm:text-sm text-[#464555] max-w-2xl">
              Programmation pédagogique, séances de cours et devoirs assignés • Année 2024–2025
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="bg-[#eaedff] rounded-xl p-1 flex items-center shadow-xs">
              <button 
                onClick={() => setViewMode('semaine')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'semaine' ? 'bg-white text-[#131b2e] shadow-xs' : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
                <span>Semaine</span>
              </button>
              <button 
                onClick={() => setViewMode('mois')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'mois' ? 'bg-white text-[#131b2e] shadow-xs' : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                <span>Mois</span>
              </button>
            </div>
            <button 
              onClick={() => showToast("Impression du cahier de textes officiel pour le Censeur...")}
              className="px-4 py-2 rounded-xl bg-white text-[#131b2e] hover:bg-[#f2f3ff] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#464555]">print</span>
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button 
              onClick={() => showToast("Formulaire de création d'une nouvelle séance pédagogique ouvert.")}
              className="px-4 py-2 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Nouvelle séance / Devoir</span>
            </button>
          </div>
        </div>

        {/* Class & Subject Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button 
            onClick={() => setSelectedClass('3A')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 cursor-pointer transition-all ${
              selectedClass === '3A' ? 'bg-[#3525cd] text-white' : 'bg-white hover:bg-[#f2f3ff] text-[#464555] border border-[#eaedff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#6ffbbe]"></span>
            <span>3ème A (Français)</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedClass === '3A' ? 'bg-white/20 text-white' : 'bg-[#e2dfff] text-[#3525cd]'
            }`}>Principale</span>
          </button>

          <button 
            onClick={() => setSelectedClass('3B')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 cursor-pointer transition-all ${
              selectedClass === '3B' ? 'bg-[#3525cd] text-white' : 'bg-white hover:bg-[#f2f3ff] text-[#464555] border border-[#eaedff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#c7c4d8]"></span>
            <span>3ème B (Français)</span>
            <span className="text-[11px] text-[#777587]">34 él.</span>
          </button>

          <button 
            onClick={() => setSelectedClass('4C')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 cursor-pointer transition-all ${
              selectedClass === '4C' ? 'bg-[#3525cd] text-white' : 'bg-white hover:bg-[#f2f3ff] text-[#464555] border border-[#eaedff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#c7c4d8]"></span>
            <span>4ème C (Français)</span>
            <span className="text-[11px] text-[#777587]">38 él.</span>
          </button>

          <button 
            onClick={() => setSelectedClass('6A')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 cursor-pointer transition-all ${
              selectedClass === '6A' ? 'bg-[#3525cd] text-white' : 'bg-white hover:bg-[#f2f3ff] text-[#464555] border border-[#eaedff]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#c7c4d8]"></span>
            <span>6ème A (Français)</span>
            <span className="text-[11px] text-[#777587]">40 él.</span>
          </button>

          <button 
            onClick={() => showToast("Filtres d'affichage appliqués.")}
            className="px-3 py-1.5 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#464555] text-xs font-semibold flex items-center gap-1 shrink-0 ml-auto transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Filtrer les vues</span>
          </button>
        </div>

        {/* Main Content 2-Column Grid (65% / 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Cahier de textes & Séquences (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* ACTIVE SESSION CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#3525cd]/5 blur-2xl pointer-events-none"></div>
              
              {/* Top Session Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ae3115] animate-ping"></span> EN COURS AUJOURD'HUI
                  </span>
                  <span className="text-xs text-[#464555] font-semibold">10h00 — 12h00</span>
                  <span className="text-[#c7c4d8]">•</span>
                  <span className="text-xs text-[#131b2e] font-bold">Salle 14 (Bâtiment B)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#3525cd] text-xs font-bold">
                    Séquence 4 • Séance 2/6
                  </span>
                </div>
              </div>

              {/* Session Main Info */}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg sm:text-xl font-bold text-[#131b2e] tracking-tight">
                  Étude stylistique : <span className="text-[#3525cd] italic">Les Soleils des Indépendances</span> d'Ahmadou Kourouma
                </h2>
                <p className="text-xs sm:text-sm text-[#464555] leading-relaxed">
                  <strong className="font-semibold text-[#131b2e]">Notions abordées :</strong> Figure de style (métaphore filée, anaphore), ironie narrative, et contextualisation socio-politique des indépendances post-coloniales ouest-africaines. Analyse du monologue de Fama.
                </p>
              </div>

              {/* Pedagogy & Compliance Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Visa Censeur */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-8 h-8 rounded-full bg-[#6ffbbe] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#002113] text-[18px]">verified</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#131b2e] truncate">Visé par la Direction des Études</span>
                    <span className="text-[11px] text-[#464555] truncate">Censeur : M. Touré (Hier à 17:40)</span>
                  </div>
                </div>

                {/* WhatsApp Sync */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-8 h-8 rounded-full bg-[#006e4b] flex items-center justify-center shrink-0 text-white">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#131b2e] truncate">Synchronisé Carnet WhatsApp</span>
                    <span className="text-[11px] text-[#005338] font-semibold truncate">98% des parents notifiés (41/42)</span>
                  </div>
                </div>
              </div>

              {/* Attached Documents & Resources */}
              <div className="flex flex-col gap-2 pt-1 border-t border-[#f2f3ff]">
                <span className="text-[11px] uppercase tracking-wider text-[#777587] font-bold">Supports & Ressources numériques</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div 
                    onClick={() => showToast("Téléchargement : Fiche_Extrait_Chapitre3.pdf...")}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer group border border-[#eaedff]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[#ae3115] text-[22px]">picture_as_pdf</span>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#3525cd] transition-colors truncate">Fiche_Extrait_Chapitre3.pdf</span>
                        <span className="text-[11px] text-[#464555]">1.2 Mo • Document d'étude</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#464555] group-hover:text-[#3525cd] text-[18px]">download</span>
                  </div>

                  <div 
                    onClick={() => showToast("Téléchargement : Support_Diaporama_Kourouma.pdf...")}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors cursor-pointer group border border-[#eaedff]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[#3525cd] text-[22px]">slideshow</span>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#3525cd] transition-colors truncate">Support_Diaporama_Kourouma.pdf</span>
                        <span className="text-[11px] text-[#464555]">3.4 Mo • Présentation multimédia</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#464555] group-hover:text-[#3525cd] text-[18px]">download</span>
                  </div>
                </div>
              </div>

              {/* Homework Assigned Highlight Box */}
              <div className="rounded-xl bg-[#eaedff]/70 p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between border border-[#dae2fd]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ae3115] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#131b2e]">Travail à faire pour le Vendredi 14 Mars</span>
                      <span className="px-2 py-0.5 rounded bg-[#ffdad2] text-[#3d0600] text-[10px] font-bold">NOTÉ SUR TABLE</span>
                    </div>
                    <p className="text-xs text-[#464555] mt-0.5">
                      "Rédiger le paragraphe d'argumentation et commentaire stylistique (Question 2, page 45 du manuel). Préparer les citations clés."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#777587]">Durée : 45 min</span>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showToast("Modification de la séance ouverte.")}
                    className="px-3 py-1.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#eaedff]"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>Modifier la séance</span>
                  </button>
                  <button 
                    onClick={handleDuplicate}
                    className="px-3 py-1.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#eaedff]"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Dupliquer pour 3ème B</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#005338] font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#005338]">check_circle</span>
                  <span>42 fiches de présence complétées</span>
                </div>
              </div>
            </div>

            {/* TIMELINE: Recent & Upcoming Sessions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[20px]">history_edu</span>
                  <h3 className="text-base font-bold text-[#131b2e]">Historique & Prochaines Séquences (3ème A)</h3>
                </div>
                <button 
                  onClick={() => showToast("Affichage de l'ensemble des séquences du semestre.")}
                  className="text-xs font-bold text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Voir tout le semestre</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Timeline Container */}
              <div className="flex flex-col gap-3">
                {/* Item 1: Terminé */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-8 h-8 rounded-full bg-[#6ffbbe] text-[#002113] flex items-center justify-center text-xs font-bold">
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#464555]">Lundi 10 Mars • 08h00 - 10h00</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#005236] text-[10px] font-bold">TERMINÉ</span>
                        <span className="text-xs text-[#777587]">• Salle 14</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#131b2e] mt-1">
                        Introduction au roman africain contemporain & contextes d'écriture
                      </h4>
                      <p className="text-xs text-[#464555] mt-0.5 line-clamp-1">
                        Présentation des auteurs majeurs du XXe siècle : Chinua Achebe, Ousmane Sembène, Ahmadou Kourouma. Distribution du calendrier de lecture.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-[#005338] font-bold block">Validé & Reçu</span>
                      <span className="text-[11px] text-[#777587]">42/42 élèves</span>
                    </div>
                    <button 
                      onClick={() => showToast("Consultation de la fiche de séance du Lundi 10 Mars...")}
                      className="w-8 h-8 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer border border-[#eaedff]"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Item 2: À Venir */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-8 h-8 rounded-full bg-[#ae3115] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">edit_document</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#ae3115]">Vendredi 14 Mars • 10h00 - 12h00</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#3d0600] text-[10px] font-bold">DEVOIR SURVEILLÉ N°3</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#e2dfff] text-[#3525cd] text-[10px] font-bold">COEFF. 3</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#131b2e] mt-1">
                        Argumentation et dissertation littéraire : Les thèmes du destin et de la modernité
                      </h4>
                      <p className="text-xs text-[#464555] mt-0.5 line-clamp-1">
                        Épreuve individuelle sous surveillance. Sujet distribué en séance. Barème officiel BEPC.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-[#464555] block">Grille de notation</span>
                      <span className="text-xs text-[#3525cd] font-bold">Prête au tirage</span>
                    </div>
                    <button 
                      onClick={() => showToast("Options de gestion du devoir surveillé...")}
                      className="w-8 h-8 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer border border-[#eaedff]"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Item 3: Planifié */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-8 h-8 rounded-full bg-[#eaedff] text-[#131b2e] flex items-center justify-center text-xs font-bold">
                        <span className="material-symbols-outlined text-[18px]">event_note</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#464555]">Lundi 17 Mars • 08h00 - 10h00</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-[10px] font-bold">PLANIFIÉ</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#131b2e] mt-1">
                        Séance de remédiation orthographique, accords complexes et syntaxe
                      </h4>
                      <p className="text-xs text-[#464555] mt-0.5 line-clamp-1">
                        Atelier en sous-groupes de niveau suite aux résultats de l'évaluation diagnostique.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button 
                      onClick={() => showToast("Préparation de la séance de remédiation...")}
                      className="px-3 py-1 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-bold text-[#131b2e] transition-colors flex items-center gap-1 cursor-pointer border border-[#eaedff]"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      <span>Préparer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Didactic Progress & Curriculum Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">Avancement du Programme Annuel — 3ème</h3>
                  <p className="text-xs text-[#464555]">Conformité aux directives pédagogiques nationales (MENA Côte d'Ivoire)</p>
                </div>
                <span className="text-base font-extrabold text-[#3525cd]">68% réalisé</span>
              </div>
              
              {/* Segmented Progress Indicator */}
              <div className="w-full bg-[#eaedff] rounded-full h-3 flex overflow-hidden p-0.5">
                <div className="bg-[#005338] rounded-l-full h-full transition-all" style={{ width: '45%' }} title="Trimestre 1 (Validé)"></div>
                <div className="bg-[#3525cd] h-full transition-all" style={{ width: '23%' }} title="Trimestre 2 (En cours)"></div>
                <div className="bg-[#dae2fd] rounded-r-full h-full" style={{ width: '32%' }} title="Trimestre 3 (Prévu)"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] text-[#777587] uppercase font-bold block">Modules Complétés</span>
                  <span className="text-lg font-bold text-[#131b2e]">14 / 20</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] text-[#777587] uppercase font-bold block">Devoirs Surveillés</span>
                  <span className="text-lg font-bold text-[#ae3115]">3 réalisés</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] text-[#777587] uppercase font-bold block">Fiches Visées</span>
                  <span className="text-lg font-bold text-[#005338]">100% à jour</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-[10px] text-[#777587] uppercase font-bold block">Moyenne Classe</span>
                  <span className="text-lg font-bold text-[#3525cd]">13.8 / 20</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Emploi du Temps Hebdomadaire & Alertes (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Weekly Teacher Hours & Stats Capsule */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#777587] font-bold">Charge Hebdomadaire</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-xs font-bold">22h / sem</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#464555]">
                <span className="material-symbols-outlined text-[16px] text-[#3525cd]">schedule</span>
                <span><strong>18h</strong> de cours en classe</span>
                <span>•</span>
                <span><strong>2h</strong> AP</span>
                <span>•</span>
                <span><strong>2h</strong> permanence</span>
              </div>
            </div>

            {/* Weekly Interactive Timetable Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">Emploi du Temps</h3>
                  <span className="text-xs text-[#777587]">Semaine du 10 au 14 Mars 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => showToast("Semaine précédente")}
                    className="w-7 h-7 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => showToast("Semaine suivante")}
                    className="w-7 h-7 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Day Tabs */}
              <div className="grid grid-cols-5 gap-1 text-center bg-[#f2f3ff] p-1 rounded-xl border border-[#eaedff]">
                {(['LUN', 'MAR', 'MER', 'JEU', 'VEN'] as const).map((day, idx) => {
                  const dayNum = 10 + idx;
                  const isActive = activeDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive ? 'bg-[#3525cd] text-white shadow-xs' : 'text-[#464555] hover:text-[#131b2e]'
                      }`}
                    >
                      <div className="text-[10px] uppercase opacity-80">{day}</div>
                      <div className="text-xs font-bold">{dayNum}</div>
                    </button>
                  );
                })}
              </div>

              {/* Day Slot Cards */}
              <div className="flex flex-col gap-2">
                {/* Slot 1 */}
                <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between opacity-75 border border-[#eaedff]">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-[#777587]"></div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#131b2e]">08h00 - 10h00</span>
                        <span className="text-[10px] text-[#464555] uppercase font-bold">6ème A</span>
                      </div>
                      <span className="text-[11px] text-[#464555]">Grammaire : Les groupes nominaux</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#005338] text-[18px]">check_circle</span>
                </div>

                {/* Slot 2: Active Slot */}
                <div className="p-3.5 rounded-xl bg-[#e2dfff]/40 flex flex-col gap-1 relative overflow-hidden border border-[#c3c0ff]">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3525cd]"></div>
                  <div className="flex items-center justify-between pl-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#3525cd] text-white text-[10px] font-bold animate-pulse">EN COURS</span>
                      <span className="text-xs font-bold text-[#131b2e]">10h00 - 12h00</span>
                    </div>
                    <span className="text-xs font-bold text-[#3525cd]">3ème A</span>
                  </div>
                  <div className="pl-1">
                    <span className="text-xs font-bold text-[#131b2e] block">
                      Français • Salle 14
                    </span>
                    <span className="text-[11px] text-[#464555]">
                      Kourouma : Figures de styles
                    </span>
                  </div>
                </div>

                {/* Slot 3 */}
                <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between hover:bg-[#eaedff] transition-colors cursor-pointer border border-[#eaedff]">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-[#ae3115]"></div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#131b2e]">14h00 - 15h30</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#ffdad2] text-[#ae3115] text-[10px] font-bold">4ème C</span>
                      </div>
                      <span className="text-[11px] text-[#464555]">Orthographe d'usage & dictée</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#777587]">Salle 08</span>
                </div>

                {/* Slot 4 */}
                <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between hover:bg-[#eaedff] transition-colors cursor-pointer border border-[#eaedff]">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-[#005338]"></div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#131b2e]">15h30 - 17h00</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">RÉCEPTION</span>
                      </div>
                      <span className="text-[11px] text-[#464555]">Permanence Parents d'élèves (3ème A)</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#777587]">Bureau PP</span>
                </div>
              </div>

              {/* Color Coding Legend */}
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-[#eaedff] text-[11px] text-[#464555]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#3525cd]"></span> 3ème A</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#ae3115]"></span> 4ème C</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#4d44e3]"></span> 3ème B</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#005338]"></span> Bureau</span>
              </div>
            </div>

            {/* Institutional Alert Box: Pedagogical Council */}
            <div className="rounded-2xl bg-[#ffdad2]/60 p-5 flex flex-col gap-2 border border-[#ffb4a3]">
              <div className="flex items-center gap-2 text-[#ae3115]">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                <span className="text-xs font-bold uppercase tracking-wide">Convocation Pédagogique</span>
              </div>
              <h4 className="text-sm font-bold text-[#131b2e]">
                Conseil pédagogique de français
              </h4>
              <p className="text-xs text-[#464555] leading-relaxed">
                Prévu ce <strong className="text-[#131b2e] font-semibold">Mercredi 19 Mars à 15h30</strong> en Salle des Professeurs. Ordre du jour : Harmonisation des sujets du BEPC blanc régional et suivi du carnet de compétences.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#ffb4a3]/60">
                <span className="text-xs text-[#464555] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span> Animé par M. Censeur
                </span>
                <button 
                  onClick={() => {
                    setMeetingConfirmed(!meetingConfirmed);
                    showToast(meetingConfirmed ? "Présence annulée." : "Présence confirmée au conseil pédagogique !");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    meetingConfirmed ? 'bg-[#005338] text-white' : 'bg-[#ae3115] text-white hover:opacity-90'
                  }`}
                >
                  {meetingConfirmed ? 'Confirmé ✓' : 'Confirmer présence'}
                </button>
              </div>
            </div>

            {/* Direct Parent-Teacher WhatsApp Broadcast Shortcut */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#006e4b] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e]">Diffusion Rapide WhatsApp</h4>
                  <span className="text-[11px] text-[#464555]">Envoi instantané aux parents de 3ème A</span>
                </div>
              </div>
              <div className="p-2.5 px-3 rounded-xl bg-[#f2f3ff] text-xs text-[#464555] flex items-center justify-between border border-[#eaedff]">
                <span className="truncate">Devoir N°3 rappelé aux 42 familles</span>
                <span className="material-symbols-outlined text-[#005338] text-[16px]">done_all</span>
              </div>
              <button 
                onClick={handleBroadcast}
                className="w-full py-2 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#3525cd] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_comment</span>
                <span>Rédiger une note collective</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
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
