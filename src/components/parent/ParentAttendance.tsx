import React, { useState } from 'react';
import { Student } from '../../types';

interface ParentAttendanceProps {
  activeStudent: Student;
  onNavigateTab: (tab: string) => void;
}

export const ParentAttendance: React.FC<ParentAttendanceProps> = ({
  activeStudent,
  onNavigateTab
}) => {
  const [filterType, setFilterType] = useState('all');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [incidentType, setIncidentType] = useState('retard');
  const [incidentDate, setIncidentDate] = useState('2025-03-12');
  const [incidentTime, setIncidentTime] = useState('08:00');
  const [incidentReason, setIncidentReason] = useState('transport');
  const [incidentComment, setIncidentComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingAttestation, setDownloadingAttestation] = useState(false);
  const [attestationDownloaded, setAttestationDownloaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setIncidentComment('');
      setFileName('');
    }, 600);
  };

  const handleDownloadAttestation = () => {
    setDownloadingAttestation(true);
    setTimeout(() => {
      setDownloadingAttestation(false);
      setAttestationDownloaded(true);
      setTimeout(() => setAttestationDownloaded(false), 2500);
    }, 1000);
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Sibling Quick Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#f2f3ff] shadow-xs border border-[#eaedff]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-[#464555] uppercase font-bold tracking-wider">Élève sélectionné :</span>
            {/* Active Student Pill */}
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-xs border border-[#eaedff]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#005338]"></div>
              <span className="text-xs font-bold text-[#131b2e]">{activeStudent.firstName} {activeStudent.lastName}</span>
              <span className="text-[#464555] text-xs font-medium">{activeStudent.class}</span>
              <span className="bg-[#6ffbbe] text-[#005236] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">98,5% Assiduité</span>
            </div>

            {/* Sibling Reminder (David) */}
            <button 
              onClick={() => onNavigateTab('parent-dashboard')}
              className="group flex items-center gap-2 bg-[#eaedff] hover:bg-[#e2e7ff] px-4 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-[#ae3115]"></div>
              <span className="text-xs text-[#131b2e] group-hover:text-[#3525cd] transition-colors font-semibold">David Kouamé (6ème B)</span>
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                1 retard à justifier
              </span>
            </button>
          </div>

          {/* Term Info & Period Filter */}
          <div className="flex items-center gap-1 text-[#464555] text-xs">
            <span className="material-symbols-outlined text-[#3525cd] text-[18px]">calendar_month</span>
            <span>Trimestre 2 (Année 2024–2025)</span>
          </div>
        </div>

        {/* Main Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#3525cd] text-[24px]">verified_user</span>
              <span className="text-[11px] uppercase tracking-wider text-[#3525cd] font-bold">Portail Éducatif Connecté</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">Suivi de l'Assiduité & Ponctualité</h1>
            <p className="text-xs sm:text-sm text-[#464555] mt-1">
              Consultez en temps réel les créneaux de cours d'Awa, déclarez un imprévu et échangez directement avec la Vie Scolaire.
            </p>
          </div>

          {/* Global Status Pill */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-[#eaedff]">
              <div className="w-10 h-10 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#002113]">
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
              </div>
              <div>
                <div className="text-[10px] text-[#464555] uppercase font-bold">Bilan Global Trimestre 2</div>
                <div className="text-sm font-bold text-[#005338] flex items-center gap-1">
                  <span>Assiduité Exemplaire</span>
                  <span className="bg-[#6ffbbe] text-[#002113] text-[10px] px-1.5 py-0.5 rounded-full font-bold">98,5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Assiduité Global Rate */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#464555]">Taux d'assiduité</span>
              <span className="w-8 h-8 rounded-lg bg-[#6ffbbe]/40 flex items-center justify-center text-[#005338]">
                <span className="material-symbols-outlined text-[18px]">percent</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">98.5%</span>
              <span className="text-xs text-[#005338] font-bold flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +0.4%
              </span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#005338] h-full rounded-full" style={{ width: '98.5%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-1.5 text-xs text-[#464555]">
                <span>Suivies : <strong className="text-[#131b2e]">412h</strong></span>
                <span>Total : 418h</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Absences Non Justifiées */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#464555]">Non justifiées</span>
              <span className="w-8 h-8 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#005338]">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">0<span className="text-lg text-[#464555] font-normal">h</span></span>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                Aucune anomalie signalée
              </span>
            </div>
          </div>

          {/* Metric 3: Absences Justifiées */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#464555]">Absences justifiées</span>
              <span className="w-8 h-8 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">6<span className="text-lg text-[#464555] font-normal">h</span></span>
              <span className="text-xs text-[#464555]">sur 1 session</span>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] text-[#3525cd]">task_alt</span>
                Certificat médical validé
              </span>
            </div>
          </div>

          {/* Metric 4: Retards Enregistrés */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#464555]">Retards cumulés</span>
              <span className="w-8 h-8 rounded-lg bg-[#ffdad2] flex items-center justify-center text-[#ae3115]">
                <span className="material-symbols-outlined text-[18px]">alarm</span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e]">2</span>
              <span className="text-xs text-[#464555]">(total 25 min)</span>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad2] text-[#3d0600] text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">done_all</span>
                2 sur 2 validés par la Vie Sco
              </span>
            </div>
          </div>
        </div>

        {/* Content Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Primary Column (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* FAST ACTION BOX: Déclarer une absence ou un retard */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#eaedff] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">send_time_extension</span>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">Déclarer un imprévu ou justificatif</h2>
                    <p className="text-xs text-[#464555]">Notification instantanée envoyée directement à M. Bakary Koné (CPE)</p>
                  </div>
                </div>
                <span className="self-start sm:self-auto bg-[#eaedff] text-[#3525cd] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  Procédure Numérisée
                </span>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Incident Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#131b2e]" htmlFor="nature-incident">Type de signalement</label>
                    <div className="relative">
                      <select 
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value)}
                        className="w-full h-11 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-lg text-xs font-semibold focus:outline-none focus:bg-[#eaedff] appearance-none cursor-pointer border border-[#eaedff]" 
                        id="nature-incident"
                      >
                        <option value="retard">Retard imprévu (Matinée / Après-midi)</option>
                        <option value="absence-jour">Absence de courte durée (≤ 1 jour)</option>
                        <option value="absence-longue">Absence prolongée (&gt; 1 jour)</option>
                        <option value="depart-anticipe">Départ anticipé autorisé</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-3 text-[#464555] pointer-events-none text-[20px]">arrow_drop_down</span>
                    </div>
                  </div>

                  {/* Date & Slot */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#131b2e]" htmlFor="incident-date">Date & Heure estimée</label>
                    <div className="flex items-center gap-2">
                      <input 
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full h-11 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-lg text-xs font-semibold focus:outline-none focus:bg-[#eaedff] border border-[#eaedff]" 
                        id="incident-date" 
                        type="date" 
                      />
                      <input 
                        value={incidentTime}
                        onChange={(e) => setIncidentTime(e.target.value)}
                        className="w-32 h-11 px-2 bg-[#f2f3ff] text-[#131b2e] rounded-lg text-xs font-semibold focus:outline-none focus:bg-[#eaedff] text-center border border-[#eaedff]" 
                        type="time" 
                      />
                    </div>
                  </div>

                  {/* Reason Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#131b2e]" htmlFor="incident-motif">Motif principal</label>
                    <div className="relative">
                      <select 
                        value={incidentReason}
                        onChange={(e) => setIncidentReason(e.target.value)}
                        className="w-full h-11 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-lg text-xs font-semibold focus:outline-none focus:bg-[#eaedff] appearance-none cursor-pointer border border-[#eaedff]" 
                        id="incident-motif"
                      >
                        <option value="transport">Transport / Embouteillages (Pont De Gaulle / VGE)</option>
                        <option value="sante">Santé / Rendez-vous médical</option>
                        <option value="famille">Obligation familiale impérieuse</option>
                        <option value="intemperies">Intempéries / Pluie torrentielle</option>
                        <option value="autre">Autre motif exceptionnel</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-3 text-[#464555] pointer-events-none text-[20px]">arrow_drop_down</span>
                    </div>
                  </div>

                  {/* Attachment Upload */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#131b2e]">Justificatif (PDF, Photo ordonnance)</label>
                    <div className="relative h-11 flex items-center bg-[#f2f3ff] hover:bg-[#eaedff] rounded-lg px-3 cursor-pointer group transition-colors border border-[#eaedff]">
                      <span className="material-symbols-outlined text-[#3525cd] text-[20px] mr-2">upload_file</span>
                      <span className="text-xs text-[#464555] group-hover:text-[#131b2e] truncate">
                        {fileName ? fileName : 'Joindre un justificatif ou photo...'}
                      </span>
                      <input 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        type="file" 
                      />
                    </div>
                  </div>
                </div>

                {/* Context Details */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#131b2e]" htmlFor="commentaire">Précisions pour la Vie Scolaire (Optionnel)</label>
                  <textarea 
                    value={incidentComment}
                    onChange={(e) => setIncidentComment(e.target.value)}
                    className="w-full p-3 bg-[#f2f3ff] text-[#131b2e] rounded-lg text-xs focus:outline-none focus:bg-[#eaedff] placeholder:text-[#464555]/60 resize-none border border-[#eaedff]" 
                    id="commentaire" 
                    placeholder="Ex: Ralentissement majeur sur le Boulevard Lagunaire ce matin suite à un accident. Awa sera déposée vers 08h10..." 
                    rows={2}
                  ></textarea>
                </div>

                {/* Submit Button & Feedback Note */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-[#464555] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#005338]">lock</span>
                    Conforme au protocole scolaire EduLiaison • Signature électronique parentale
                  </span>
                  <button 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] disabled:opacity-60 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer" 
                    type="submit"
                  >
                    {isSubmitting ? (
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    )}
                    <span>Transmettre à la Vie Scolaire</span>
                  </button>
                </div>
              </form>

              {/* Feedback Toast */}
              {formSubmitted && (
                <div className="mt-4 p-4 rounded-xl bg-[#6ffbbe] text-[#002113] flex items-center justify-between gap-3 animate-fade-in border border-[#4edea3]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                    <div>
                      <p className="text-sm font-bold">Signalement pris en compte !</p>
                      <p className="text-xs">Un accusé de réception a été envoyé sur votre messagerie et au bureau du CPE.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="p-1 hover:bg-black/10 rounded-full cursor-pointer" 
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}
            </div>

            {/* TIMELINE & LOG: Registre officiel des incidents */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eaedff]">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">Registre Trimestriel d'Assiduité</h2>
                  <p className="text-xs text-[#464555]">Historique des entrées en classe, retards pointés et absences répertoriées.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#464555] uppercase font-bold">Filtrer :</span>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer border border-[#eaedff]"
                  >
                    <option value="all">Tous les événements (3)</option>
                    <option value="retards">Retards seulement (2)</option>
                    <option value="absences">Absences seulement (1)</option>
                  </select>
                </div>
              </div>

              {/* Entries Flow */}
              <div className="flex flex-col gap-4">
                {/* Item 1: Retard 10 Mars 2025 */}
                {(filterType === 'all' || filterType === 'retards') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#f2f3ff]/50 hover:bg-[#f2f3ff] transition-colors gap-4 border border-[#eaedff]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#ffdad2] text-[#3d0600] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase">10 MAR</span>
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#131b2e]">Retard de 15 minutes</span>
                          <span className="bg-[#6ffbbe] text-[#002113] text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                            Justifié
                          </span>
                          <span className="text-xs text-[#464555]">Arrivée à 07h45 (au lieu de 07h30)</span>
                        </div>
                        <p className="text-xs text-[#464555] mt-1">
                          <strong className="text-[#131b2e]">Motif :</strong> Forte congestion routière sur le Boulevard Lagunaire.
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#464555]">
                          <span className="material-symbols-outlined text-[16px] text-[#3525cd]">badge</span>
                          <span>Enregistré et validé par le CPE : <strong>M. Bakary Koné</strong></span>
                          <span>•</span>
                          <span className="text-[#005338] font-semibold">Billet d'entrée délivré</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-center shrink-0">
                      <button 
                        onClick={() => onNavigateTab('parent-documents')}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#464555] hover:text-[#131b2e] hover:bg-[#e2e7ff] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#eaedff]" 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">description</span>
                        <span>Voir le billet</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Item 2: Absence 20 Février 2025 */}
                {(filterType === 'all' || filterType === 'absences') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#f2f3ff]/50 hover:bg-[#f2f3ff] transition-colors gap-4 border border-[#eaedff]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#e2dfff] text-[#0f0069] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase">20 FÉV</span>
                        <span className="material-symbols-outlined text-[18px]">event_busy</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#131b2e]">Absence de 4 heures (Matinée)</span>
                          <span className="bg-[#6ffbbe] text-[#002113] text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                            Justifié Médical
                          </span>
                          <span className="text-xs text-[#464555]">Cours d'Anglais, SVT et Mathématiques</span>
                        </div>
                        <p className="text-xs text-[#464555] mt-1">
                          <strong className="text-[#131b2e]">Motif :</strong> Consultation médicale d'urgence (Crise dentaire).
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#464555]">
                          <span className="material-symbols-outlined text-[16px] text-[#005338]">check_circle</span>
                          <span>Certificat délivré par le <strong>Dr Kouassi (Clinique Farah)</strong> transmis et archivé</span>
                          <span>•</span>
                          <span className="text-[#3525cd] font-semibold">Devoirs à rattraper notés</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-center shrink-0 flex items-center gap-2">
                      <button 
                        onClick={() => onNavigateTab('parent-documents')}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#464555] hover:text-[#131b2e] hover:bg-[#e2e7ff] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#eaedff]" 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">file_open</span>
                        <span>Certificat PDF</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Item 3: Retard 15 Janvier 2025 */}
                {(filterType === 'all' || filterType === 'retards') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#f2f3ff]/50 hover:bg-[#f2f3ff] transition-colors gap-4 border border-[#eaedff]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#ffdad2] text-[#3d0600] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase">15 JAN</span>
                        <span className="material-symbols-outlined text-[18px]">alarm_on</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#131b2e]">Retard de 10 minutes</span>
                          <span className="bg-[#6ffbbe] text-[#002113] text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                            Justifié
                          </span>
                          <span className="text-xs text-[#464555]">Arrivée à 07h40</span>
                        </div>
                        <p className="text-xs text-[#464555] mt-1">
                          <strong className="text-[#131b2e]">Motif :</strong> Panne mécanique véhicule familial au départ du domicile.
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#464555]">
                          <span className="material-symbols-outlined text-[16px] text-[#005338]">task_alt</span>
                          <span>Dispense acceptée par la Vie Scolaire après mot signé du parent</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-center shrink-0">
                      <span className="text-xs text-[#005338] font-bold flex items-center gap-1 bg-[#6ffbbe] px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-[16px]">done</span>
                        Clôturé
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Notice for Parents */}
              <div className="mt-2 p-4 rounded-xl bg-[#eaedff] flex items-center gap-4 border border-[#dae2fd]">
                <span className="material-symbols-outlined text-[#3525cd] text-[28px] shrink-0">info</span>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-bold text-[#131b2e]">Rattrapage des cours manqués</span>
                  <p className="text-xs text-[#464555]">Lors de son absence du 20 février, les supports de cours de SVT et Mathématiques ont été déposés sur le cahier de texte en ligne par les enseignants respectifs.</p>
                </div>
                <button 
                  onClick={() => onNavigateTab('parent-timeline')}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-white text-[#3525cd] text-xs font-bold hover:bg-[#f2f3ff] shadow-xs transition-all cursor-pointer border border-[#eaedff]"
                >
                  Accéder au cours
                </button>
              </div>
            </div>
          </div>

          {/* Right / Secondary Column (4 Cols): Vie Scolaire Contact & School Regulations */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Direct Contact Card: Vie Scolaire */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center gap-3 pb-3 border-b border-[#eaedff]">
                <div className="w-12 h-12 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-lg">
                  BK
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#3525cd] font-bold">Contact Référent</span>
                  <h3 className="text-base font-bold text-[#131b2e] leading-tight">M. Bakary Koné</h3>
                  <p className="text-xs text-[#464555]">Conseiller Principal d'Éducation (3ème)</p>
                </div>
              </div>

              <div className="space-y-2">
                {/* Direct WhatsApp Help */}
                <a 
                  className="flex items-center justify-between p-3 rounded-xl bg-[#6ffbbe]/30 hover:bg-[#6ffbbe]/50 transition-colors group cursor-pointer border border-[#6ffbbe]" 
                  href="https://wa.me/2250700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005338] text-[20px]">chat</span>
                    <span className="text-xs text-[#005236] font-bold">Permanence WhatsApp Vie Sco</span>
                  </div>
                  <span className="material-symbols-outlined text-[#005338] text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </a>

                {/* Direct School Phone */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#464555] text-[20px]">call</span>
                    <span className="text-xs text-[#131b2e] font-semibold">+225 27 22 40 85 00</span>
                  </div>
                  <span className="text-[11px] text-[#464555]">Poste 104</span>
                </div>

                {/* Reception Hours */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <span className="material-symbols-outlined text-[#464555] text-[20px] shrink-0 mt-0.5">schedule</span>
                  <div className="text-xs text-[#464555]">
                    <strong className="text-[#131b2e]">Horaires d'accueil physique :</strong><br/>
                    Du Lundi au Vendredi : 07h15 – 16h30<br/>
                    Bâtiment Administration • Rez-de-Chaussée
                  </div>
                </div>
              </div>
            </div>

            {/* School Regulations Reminder Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ae3115] text-[22px]">gavel</span>
                <h3 className="text-base font-bold text-[#131b2e]">Règlement des Retards</h3>
              </div>
              <p className="text-xs text-[#464555] leading-relaxed">
                Pour préserver la concentration et la sérénité des apprentissages, l'accès aux salles de classe est strictement régulé.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-6 h-6 rounded-full bg-[#ffdad2] text-[#3d0600] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-[#131b2e]">
                    <strong>Tolérance :</strong> Tout élève arrivant après la sonnerie (07h30 le matin / 13h30 l'après-midi) doit obligatoirement transiter par la Vie Scolaire pour obtenir un bon d'entrée.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-6 h-6 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-[#131b2e]">
                    <strong>Seuil de convocation :</strong> Au-delà de <span className="text-[#ba1a1a] font-bold">3 retards non justifiés</span> au cours d'un même trimestre, une convocation parentale automatique est transmise par SMS et carnet.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                  <div className="w-6 h-6 rounded-full bg-[#6ffbbe] text-[#002113] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs text-[#131b2e]">
                    <strong>Délai de régularisation :</strong> Toute absence doit faire l'objet d'un justificatif écrit ou numérique sous 48 heures maximum.
                  </p>
                </div>
              </div>

              {/* Document Download Button */}
              <button 
                onClick={handleDownloadAttestation}
                className="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#3525cd] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {downloadingAttestation ? 'progress_activity' : attestationDownloaded ? 'check' : 'download'}
                </span>
                <span>
                  {downloadingAttestation ? 'Téléchargement...' : attestationDownloaded ? 'Téléchargé !' : "Télécharger l'Attestation d'Assiduité (PDF)"}
                </span>
              </button>
            </div>

            {/* Weekly Chart Mini-card (Assiduité par matière) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col gap-2">
              <span className="text-[11px] uppercase font-bold text-[#464555]">Présence par Pôle Disciplinaire</span>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#131b2e] font-semibold">Sciences & Mathématiques</span>
                    <span className="text-[#005338] font-bold">100%</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#005338] h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#131b2e] font-semibold">Lettres, Langues & Histoire</span>
                    <span className="text-[#005338] font-bold">98.2%</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#005338] h-full rounded-full" style={{ width: '98.2%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#131b2e] font-semibold">Arts & Éducation Physique (EPS)</span>
                    <span className="text-[#005338] font-bold">97.5%</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#005338] h-full rounded-full" style={{ width: '97.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
