import React, { useState } from 'react';
import { Student } from '../../types';

interface ParentTimelineProps {
  activeStudent: Student;
  onNavigateTab: (tab: string) => void;
}

export const ParentTimeline: React.FC<ParentTimelineProps> = ({
  activeStudent,
  onNavigateTab
}) => {
  const [filter, setFilter] = useState<'all' | 'eval' | 'signature' | 'pedagogie' | 'vie-scolaire' | 'ecole'>('all');
  const [period, setPeriod] = useState('t2');
  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [baremeOpen, setBaremeOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [officialLedgerGenerating, setOfficialLedgerGenerating] = useState(false);
  const [officialLedgerDownloaded, setOfficialLedgerDownloaded] = useState(false);

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
    }, 900);
  };

  const handleExportPdf = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 2500);
    }, 1000);
  };

  const handleDownloadLedger = () => {
    setOfficialLedgerGenerating(true);
    setTimeout(() => {
      setOfficialLedgerGenerating(false);
      setOfficialLedgerDownloaded(true);
      setTimeout(() => setOfficialLedgerDownloaded(false), 2500);
    }, 1000);
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Context & Header Zone */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#464555] font-semibold mb-1">
              <span onClick={() => onNavigateTab('parent-dashboard')} className="hover:text-[#3525cd] transition-colors cursor-pointer">
                Espace Parents
              </span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#3525cd] font-semibold">Carnet de Liaison & Événements</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">Timeline & Événements</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-pulse"></span>
                {activeStudent.firstName} {activeStudent.lastName} • {activeStudent.class} (2024–2025)
              </span>
            </div>
          </div>

          {/* Quick Selector / Date Period */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-[#eaedff]">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[#3525cd] text-[18px] ml-2">calendar_month</span>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent pl-2 pr-7 py-1.5 text-[#131b2e] text-xs font-bold focus:outline-none cursor-pointer appearance-none"
              >
                <option value="current-week">Semaine en cours</option>
                <option value="t2">Trimestre 2 (En cours)</option>
                <option value="all">Tout le carnet annuel</option>
              </select>
              <span className="material-symbols-outlined text-[#464555] text-[16px] pointer-events-none -ml-5">expand_more</span>
            </div>
            <button 
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#3525cd]">
                {pdfGenerating ? 'progress_activity' : pdfDownloaded ? 'check' : 'download'}
              </span>
              <span className="hidden sm:inline">
                {pdfGenerating ? 'Génération...' : pdfDownloaded ? 'Téléchargé !' : 'Export PDF'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button 
            onClick={() => setFilter('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-[#3525cd] text-white' 
                : 'bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_timeline</span>
            <span>Tous les flux</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'all' ? 'bg-[#4f46e5] text-white' : 'bg-[#eaedff] text-[#464555]'}`}>14</span>
          </button>

          <button 
            onClick={() => setFilter('eval')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
              filter === 'eval' 
                ? 'bg-[#3525cd] text-white' 
                : 'bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#3525cd]">assignment_turned_in</span>
            <span>Notes & Devoirs</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'eval' ? 'bg-[#4f46e5] text-white' : 'bg-[#eaedff] text-[#464555]'}`}>5</span>
          </button>

          <button 
            onClick={() => setFilter('signature')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
              filter === 'signature' 
                ? 'bg-[#3525cd] text-white' 
                : 'bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#ae3115]">draw</span>
            <span>Signatures en attente</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#ffdad2] text-[#ae3115] font-bold text-[10px]">
              {isSigned ? '0' : '1'}
            </span>
          </button>

          <button 
            onClick={() => setFilter('pedagogie')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
              filter === 'pedagogie' 
                ? 'bg-[#3525cd] text-white' 
                : 'bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#005338]">psychology_alt</span>
            <span>Observations Profs</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'pedagogie' ? 'bg-[#4f46e5] text-white' : 'bg-[#eaedff] text-[#464555]'}`}>3</span>
          </button>

          <button 
            onClick={() => setFilter('vie-scolaire')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
              filter === 'vie-scolaire' 
                ? 'bg-[#3525cd] text-white' 
                : 'bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#464555]">schedule</span>
            <span>Vie Scolaire & Retards</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'vie-scolaire' ? 'bg-[#4f46e5] text-white' : 'bg-[#eaedff] text-[#464555]'}`}>2</span>
          </button>

          <button 
            onClick={() => setFilter('ecole')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap transition-all cursor-pointer ${
              filter === 'ecole' 
                ? 'bg-[#3525cd] text-white' 
                : 'bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#4f46e5]">campaign</span>
            <span>Événements École</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'ecole' ? 'bg-[#4f46e5] text-white' : 'bg-[#eaedff] text-[#464555]'}`}>4</span>
          </button>
        </div>

        {/* MAIN GRID CONTAINER: Left Timeline (8 cols) / Right Aside (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Urgent Notification + Vertical Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Urgent Signature Card (Carnet de Liaison Action Required) */}
            {(filter === 'all' || filter === 'signature') && (
              <div className="relative overflow-hidden rounded-xl bg-white shadow-md p-5 md:p-6 transition-all duration-300 border border-[#eaedff]">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${isSigned ? 'bg-[#005338]' : 'bg-[#fd6a49]'}`}></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ffdad2] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#ae3115] text-[26px]">contract_edit</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] text-[11px] font-bold uppercase tracking-wide">
                          Action Requise • Signature Parentale
                        </span>
                        <span className="text-xs text-[#464555]">Échéance : 15 Mars 2025</span>
                      </div>
                      <h2 className="text-base sm:text-lg text-[#131b2e] font-semibold">
                        Circulaire Direction : Session d'Examens Blancs BEPC
                      </h2>
                      <p className="text-xs sm:text-sm text-[#464555] mt-1">
                        Prise de connaissance obligatoire du calendrier des épreuves orales et écrites prévues du 24 au 28 Mars. Votre visa électronique vaut confirmation d'inscription.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#464555]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[#005338]">check_circle</span> Réf: CIR-DIR-2025-084
                        </span>
                        <span>•</span>
                        <span>Émis par : M. Touré (Proviseur Adjoint)</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-stretch md:items-end gap-2 pl-2">
                    {!isSigned ? (
                      <button 
                        onClick={handleSign}
                        disabled={isSigning}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#fd6a49] hover:bg-[#ae3115] text-white font-semibold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isSigning ? 'refresh' : 'fingerprint'}
                        </span>
                        <span>{isSigning ? 'Signature en cours...' : 'Viser & Signer'}</span>
                      </button>
                    ) : (
                      <span className="text-[#005338] text-xs flex items-center gap-1 font-bold bg-[#6ffbbe] px-3 py-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-[16px]">verified</span> Validé électroniquement
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE ENTRIES GROUPED BY DAY */}
            <div className="flex flex-col gap-6">
              {/* DAY 1: AUJOURD'HUI */}
              {(filter === 'all' || filter === 'eval') && (
                <div className="timeline-day-group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#3525cd] ring-4 ring-[#3525cd]/20"></div>
                    <h2 className="text-base sm:text-lg text-[#131b2e] font-bold">Aujourd'hui — Mercredi 12 Mars 2025</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-semibold">2 Événements</span>
                  </div>
                  <div className="relative pl-6 ml-1.5 space-y-4">
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#dae2fd]"></div>

                    {/* Card 1: Note reçue Mathématiques */}
                    <div className="timeline-card relative p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-[#eaedff]">
                      <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#3525cd] ring-4 ring-white"></div>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#3525cd]/10 text-[#3525cd] text-xs font-bold uppercase">Note • Mathématiques</span>
                            <span className="text-xs text-[#464555]">10:15</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> Rang : 3ème / 42
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
                          <div className="space-y-1">
                            <h3 className="text-base font-semibold text-[#131b2e]">Devoir Surveillé N°3 — Géométrie Vectorielle</h3>
                            <p className="text-xs sm:text-sm text-[#464555]">
                              Évaluation sommative de mi-trimestre. Excellent raisonnement sur les démonstrations de colinéarité.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[#464555] text-xs">
                              <span>Coeff: <strong>3</strong></span>
                              <span>•</span>
                              <span>Moyenne de classe: <strong>12.4 / 20</strong></span>
                              <span>•</span>
                              <span>Note max: <strong>19.0 / 20</strong></span>
                            </div>
                          </div>

                          {/* Grade capsule visual badge */}
                          <div className="shrink-0 flex md:flex-col items-center justify-center p-3 rounded-xl bg-[#f2f3ff] min-w-[130px] text-center border border-[#eaedff]">
                            <span className="text-2xl font-bold text-[#3525cd] leading-none">17<span className="text-base text-[#464555] font-normal">/20</span></span>
                            <div className="w-full bg-[#e2e7ff] h-2 rounded-full mt-2 overflow-hidden">
                              <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-[11px] text-[#005338] mt-1 font-semibold">Mention Très Bien</span>
                          </div>
                        </div>

                        {/* Collapsible Scale info */}
                        <div className="pt-2 mt-2 border-t border-[#f2f3ff]">
                          <button 
                            onClick={() => setBaremeOpen(!baremeOpen)}
                            className="flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">rule</span>
                            <span>Consulter le barème & annotations de l'épreuve</span>
                            <span className={`material-symbols-outlined text-[16px] transition-transform ${baremeOpen ? 'rotate-180' : ''}`}>expand_more</span>
                          </button>
                          {baremeOpen && (
                            <div className="mt-3 p-3 rounded-lg bg-[#f2f3ff] text-xs text-[#131b2e] border border-[#eaedff]">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="p-2 rounded bg-white border border-[#eaedff]">
                                  <span className="font-semibold block text-[#131b2e]">Partie A (Calculs):</span>
                                  <span className="text-[#005338] font-bold">5.5 / 6.0</span> • Parfait
                                </div>
                                <div className="p-2 rounded bg-white border border-[#eaedff]">
                                  <span className="font-semibold block text-[#131b2e]">Partie B (Repérage):</span>
                                  <span className="text-[#005338] font-bold">6.5 / 7.0</span> • 1 faute d'indice
                                </div>
                                <div className="p-2 rounded bg-white border border-[#eaedff]">
                                  <span className="font-semibold block text-[#131b2e]">Partie C (Problème):</span>
                                  <span className="text-[#005338] font-bold">5.0 / 7.0</span> • Démarche solide
                                </div>
                              </div>
                              <p className="mt-2 text-[#464555] italic">« Copie très propre et structurée. Continuer à soigner la rigueur de rédaction des théorèmes. » — M. Diop</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Contrôle annoncé SVT */}
                    <div className="timeline-card relative p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-[#eaedff]">
                      <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#4d44e3] ring-4 ring-white"></div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-bold uppercase">Annonce Devoir • SVT</span>
                            <span className="text-xs text-[#464555]">08:30</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad2] text-[#3d0600] text-xs flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[14px]">event</span> Prévu Vendredi 14 Mars
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#131b2e]">Évaluation de SVT — Chapitre : Génétique Humaine</h3>
                          <p className="text-xs sm:text-sm text-[#464555] mt-1">
                            Devoir sur table d'1 heure portant sur les arbres généalogiques et la transmission des allèles. Réviser les exercices 3 à 7 du polycopié.
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[#464555]">
                            <span className="flex items-center gap-1 text-[#3525cd] font-semibold">
                              <span className="material-symbols-outlined text-[16px]">attachment</span> Fiche_Revision_Genetique_3A.pdf (1.2 Mo)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DAY 2: HIER */}
              {(filter === 'all' || filter === 'pedagogie' || filter === 'ecole') && (
                <div className="timeline-day-group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#d2d9f4] ring-4 ring-[#dae2fd]"></div>
                    <h2 className="text-base sm:text-lg text-[#131b2e] font-bold">Hier — Mardi 11 Mars 2025</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">2 Événements</span>
                  </div>
                  <div className="relative pl-6 ml-1.5 space-y-4">
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#dae2fd]"></div>

                    {/* Card 3: Observation Professeur */}
                    {(filter === 'all' || filter === 'pedagogie') && (
                      <div className="timeline-card relative p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-[#eaedff]">
                        <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#005338] ring-4 ring-white"></div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold uppercase">Carnet • Félicitations</span>
                              <span className="text-xs text-[#464555]">14:00</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-[#005338]">done_all</span> Lu par le parent
                            </span>
                          </div>
                          <div className="flex items-start gap-4 mt-1">
                            <div className="w-10 h-10 rounded-full bg-[#6ffbbe] flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[#005338] text-[20px]">person_celebrate</span>
                            </div>
                            <div>
                              <div className="flex items-baseline gap-2">
                                <h3 className="text-base font-semibold text-[#131b2e]">Observation Pédagogique — Français</h3>
                                <span className="text-xs text-[#464555]">Mme Aya Touré (Professeur Principal)</span>
                              </div>
                              <blockquote className="text-xs sm:text-sm text-[#131b2e] italic mt-1.5 p-3 rounded-lg bg-[#f2f3ff]/70 border border-[#eaedff]">
                                « Excellente prise de parole et argumentation remarquable sur l'œuvre au programme ce mardi lors du débat thématique. Une maturité exemplaire qui dynamise toute la classe. Continue ainsi ! »
                              </blockquote>
                              <div className="flex items-center gap-2 mt-2">
                                <button 
                                  onClick={() => onNavigateTab('parent-messaging')}
                                  className="px-3 py-1 rounded-md bg-[#eaedff] hover:bg-[#e2e7ff] text-[#3525cd] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px]">reply</span> Répondre à l'enseignante
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card 4: Circulaire générale École */}
                    {(filter === 'all' || filter === 'ecole') && (
                      <div className="timeline-card relative p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-[#eaedff]">
                        <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#4f46e5] ring-4 ring-white"></div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#3323cc] text-xs font-bold uppercase">Information Institutionnelle</span>
                              <span className="text-xs text-[#464555]">11:30</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs">Circulaire N°42</span>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#131b2e]">Organisation des Journées Pédagogiques du 27 Mars</h3>
                            <p className="text-xs sm:text-sm text-[#464555] mt-1">
                              Les cours seront suspendus pour l'ensemble des élèves le jeudi 27 mars toute la journée afin de permettre le séminaire académique des enseignants du second cycle. Reprise normale le vendredi 28 à 07h30.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DAY 3: LUNDI 10 MARS */}
              {(filter === 'all' || filter === 'vie-scolaire') && (
                <div className="timeline-day-group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#d2d9f4] ring-4 ring-[#dae2fd]"></div>
                    <h2 className="text-base sm:text-lg text-[#131b2e] font-bold">Lundi 10 Mars 2025</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">1 Événement</span>
                  </div>
                  <div className="relative pl-6 ml-1.5 space-y-4">
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#dae2fd]"></div>

                    {/* Card 5: Retard Matinal Justifié */}
                    <div className="timeline-card relative p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-[#eaedff]">
                      <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#ffb4a3] ring-4 ring-white"></div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] text-xs font-bold uppercase">Vie Scolaire • Ponctualité</span>
                            <span className="text-xs text-[#464555]">07:45</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check</span> Justifié par Parent
                          </span>
                        </div>
                        <div className="flex items-start gap-4 mt-1">
                          <div className="w-10 h-10 rounded-full bg-[#ffdad2] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#ae3115] text-[20px]">timer</span>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-[#131b2e]">Retard en 1ère Heure (15 minutes)</h3>
                            <p className="text-xs sm:text-sm text-[#464555] mt-1">
                              Motif : Embouteillages majeurs signalés sur le Boulevard Lagunaire. Billet d'entrée en cours de Mathématiques visé par le surveillant général M. Bakary Koné.
                            </p>
                            <div className="mt-2 text-[#464555] text-xs flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-[#005338]">verified_user</span>
                              <span>Dossier vie scolaire : En règle (0 sanction active)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DAY 4: VENDREDI 7 MARS */}
              {(filter === 'all' || filter === 'ecole') && (
                <div className="timeline-day-group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#d2d9f4] ring-4 ring-[#dae2fd]"></div>
                    <h2 className="text-base sm:text-lg text-[#131b2e] font-bold">Vendredi 7 Mars 2025</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">1 Événement</span>
                  </div>
                  <div className="relative pl-6 ml-1.5 space-y-4">
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#dae2fd]"></div>

                    {/* Card 6: Convocation Réunion Parents-Profs */}
                    <div className="timeline-card relative p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-[#eaedff]">
                      <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#3525cd] ring-4 ring-white"></div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#0f0069] text-xs font-bold uppercase">Rencontre • Échange</span>
                            <span className="text-xs text-[#464555]">15:00</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">event_available</span> Présence Confirmée
                          </span>
                        </div>
                        <div className="flex items-start gap-4 mt-1">
                          <div className="w-10 h-10 rounded-full bg-[#3525cd]/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#3525cd] text-[20px]">groups</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-[#131b2e]">Réunion Parents-Professeurs de Mi-Parcours (T2)</h3>
                            <p className="text-xs sm:text-sm text-[#464555] mt-1">
                              Entretien individuel de 15 minutes avec l'équipe pédagogique pour faire le point sur les choix d'orientation post-3ème et la préparation au BEPC.
                            </p>
                            <div className="mt-3 p-3 rounded-lg bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]">
                              <span className="text-xs text-[#131b2e]">Créneau réservé : <strong>Samedi 22 Mars à 09h45</strong> (Salle 104)</span>
                              <button 
                                onClick={() => onNavigateTab('parent-messaging')}
                                className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bilan & Quick Actions Aside (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Student Quick Profile Card */}
            <div className="rounded-xl bg-white p-4 shadow-sm border border-[#eaedff]">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-inner bg-[#eaedff]">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-071ksXT5fJpWEK9flwnSt-2QchKh1w16k7zQ7IKq9DxhcrzXIcEJN3pRqCUoCgZ5VsEp4jgVAi2bF3flnE2F0El9nbvbP57IDJ35CsdokIi2SXDdeALebKqvXoLV5-YoaFhVPtR2bOqmAXQ5Io6fr6Xns8wO8KzHt1DHfovV7TXpG-ZMXxVGnqmpe1TAd-zXNJvz4tUgw6wartgGf0lngH6AlrQCGHY7D0WqT-cHP9sJDcp3GCyTg" 
                    alt="Awa Kouamé" 
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e] leading-tight">Awa Kouamé</h3>
                  <p className="text-xs text-[#464555]">Classe de 3ème A • N° Matricule: 2021-9884</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#6ffbbe] text-[#002113] text-xs font-bold">
                      Moy. Générale : 15.8/20
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Carnet Activity Summary Card */}
            <div className="rounded-xl bg-white p-5 shadow-sm border border-[#eaedff]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#131b2e]">Bilan Carnet du Mois</h3>
                <span className="text-xs text-[#464555]">Mars 2025</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center my-3">
                <div className="p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-2xl font-bold text-[#3525cd] block leading-none">14</span>
                  <span className="text-[11px] text-[#464555] mt-1 block">Événements</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-2xl font-bold text-[#ae3115] block leading-none">
                    {isSigned ? '0' : '1'}
                  </span>
                  <span className="text-[11px] text-[#464555] mt-1 block">À signer</span>
                </div>
                <div className="p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="text-2xl font-bold text-[#005338] block leading-none">0</span>
                  <span className="text-[11px] text-[#464555] mt-1 block">Sanctions</span>
                </div>
              </div>

              {/* Micro attendance rate bar */}
              <div className="mt-4 pt-3 border-t border-[#f2f3ff] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#131b2e] font-medium">Taux d'assiduité scolaire</span>
                  <span className="font-bold text-[#005338]">98.5%</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#005338] h-full rounded-full" style={{ width: '98.5%' }}></div>
                </div>
                <span className="text-[11px] text-[#464555] block">1 seul retard justifié ce trimestre</span>
              </div>
            </div>

            {/* Upcoming Key Dates / Agenda widget */}
            <div className="rounded-xl bg-white p-5 shadow-sm border border-[#eaedff]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#131b2e]">Dates Clés & Agenda</h3>
                <button 
                  onClick={() => onNavigateTab('parent-dashboard')}
                  className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                >
                  Calendrier
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-10 h-10 rounded-lg bg-[#e2dfff] text-[#0f0069] flex flex-col items-center justify-center shrink-0 font-bold">
                    <span className="text-[10px] leading-tight uppercase">Mar</span>
                    <span className="text-base leading-tight">14</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#131b2e] font-semibold block">Devoir Sommatif SVT</span>
                    <span className="text-xs text-[#464555]">08h30 - 09h30 • Coeff 2</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-10 h-10 rounded-lg bg-[#ffdad2] text-[#3d0600] flex flex-col items-center justify-center shrink-0 font-bold">
                    <span className="text-[10px] leading-tight uppercase">Mar</span>
                    <span className="text-base leading-tight">24</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#131b2e] font-semibold block">Examens Blancs Régionaux (BEPC)</span>
                    <span className="text-xs text-[#464555]">Du 24 au 28 Mars • Convocation requise</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-10 h-10 rounded-lg bg-[#eaedff] text-[#131b2e] flex flex-col items-center justify-center shrink-0 font-bold">
                    <span className="text-[10px] leading-tight uppercase">Avr</span>
                    <span className="text-base leading-tight">11</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#131b2e] font-semibold block">Départ en Vacances de Pâques</span>
                    <span className="text-xs text-[#464555]">Fin des cours à 12h00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Endorsement & Download Box */}
            <div className="rounded-xl bg-[#e2e7ff]/60 p-5 shadow-sm border border-[#dae2fd]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#3525cd] text-[28px]">verified</span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">Carnet Conforme Ministère</h4>
                  <p className="text-xs text-[#464555] mt-1">
                    Toutes les signatures électroniques enregistrées sur EduLiaison font foi légale auprès de la direction d'établissement et de l'inspection académique.
                  </p>
                  <button 
                    onClick={handleDownloadLedger}
                    className="mt-3 w-full py-2 px-3 rounded-lg bg-white hover:bg-[#f2f3ff] text-[#3525cd] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer border border-[#eaedff]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {officialLedgerGenerating ? 'progress_activity' : officialLedgerDownloaded ? 'check' : 'picture_as_pdf'}
                    </span>
                    <span>
                      {officialLedgerGenerating ? 'Génération...' : officialLedgerDownloaded ? 'Téléchargé !' : 'Télécharger le relevé de liaison officiel'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
