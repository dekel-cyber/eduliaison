import React, { useState, useEffect } from 'react';
import { Student, TimelineEvent, AttendanceRecord, SchoolDocument } from '../../types';
import { 
  subscribeToTimelineEvents, 
  subscribeToAttendance, 
  subscribeToSchoolDocuments,
  updateTimelineEventInFirestore 
} from '../../firebase/firestoreService';

interface ParentDashboardProps {
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
  onNavigateTab: (tab: string) => void;
  userName?: string;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  activeStudent,
  allStudents,
  onSelectStudent,
  onNavigateTab,
  userName
}) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [meetingConfirmed, setMeetingConfirmed] = useState(false);
  const [signingEventId, setSigningEventId] = useState<string | null>(null);

  // Subscribe to real-time Firestore data for the active student
  useEffect(() => {
    if (!activeStudent?.id) return;

    const unsubTimeline = subscribeToTimelineEvents(activeStudent.id, (events) => {
      setTimelineEvents(events);
    });

    const unsubAttendance = subscribeToAttendance(activeStudent.id, (records) => {
      setAttendanceRecords(records);
    });

    const unsubDocs = subscribeToSchoolDocuments((docs) => {
      setDocuments(docs);
    });

    return () => {
      unsubTimeline();
      unsubAttendance();
      unsubDocs();
    };
  }, [activeStudent?.id]);

  // Sign a carnet / timeline event in Firestore
  const handleSignEvent = async (eventId: string) => {
    setSigningEventId(eventId);
    try {
      await updateTimelineEventInFirestore(eventId, {
        isSigned: true,
        signedBy: userName || activeStudent?.parentName || 'Parent Référent',
        signedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
      });
    } catch (e) {
      console.warn("Could not sign event:", e);
    } finally {
      setSigningEventId(null);
    }
  };

  // Recent grades from timeline events
  const gradeEvents = timelineEvents.filter(e => e.category === 'eval' || e.score !== undefined);
  const pendingSignatures = timelineEvents.filter(e => e.requiresSignature && !e.isSigned);
  const unjustifiedAbsences = attendanceRecords.filter(r => !r.isJustified);

  const displayName = userName || activeStudent?.parentName || 'Cher Parent d’élève';

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Top Greeting & Child Switcher Bar */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e2e7ff] text-[#3525cd] text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">domain</span>
                  Groupe Scolaire Excellence d'Abidjan
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#6ffbbe]/40 text-[#002113] text-xs font-semibold">
                  Année 2025-2026 • Trimestre 2
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#131b2e] tracking-tight">
                Bienvenue, {displayName} <span className="inline-block animate-pulse">👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#464555] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#005338]">verified</span>
                Espace de liaison certifié • Suivi en temps réel de votre famille
              </p>
            </div>
            
            {/* Quick School Action */}
            <button 
              onClick={() => onNavigateTab('parent-documents')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#3525cd] text-xs sm:text-sm font-bold shadow-sm hover:bg-[#f2f3ff] transition-all border border-[#eaedff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span>Circulaires & Règlements</span>
            </button>
          </div>

          {/* Sibling Selector Cards (Dynamic for all children linked to this parent) */}
          {allStudents && allStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
              {allStudents.map(student => {
                const isActive = student.id === activeStudent?.id;
                return (
                  <div 
                    key={student.id}
                    onClick={() => onSelectStudent(student.id)}
                    className={`${allStudents.length === 1 ? 'lg:col-span-12' : 'lg:col-span-6'} p-4 rounded-2xl transition-all cursor-pointer relative overflow-hidden group ${
                      isActive 
                        ? 'bg-white shadow-md border-2 border-[#3525cd]' 
                        : 'bg-[#f2f3ff]/70 hover:bg-white shadow-xs opacity-85 hover:opacity-100 border border-[#eaedff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <img 
                            className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-[#eaedff]" 
                            src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'} 
                            alt={student.firstName} 
                          />
                          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${isActive ? 'bg-[#006e4b]' : 'bg-[#777587]'}`}></span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-[#131b2e]">{student.firstName} {student.lastName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-[#e2dfff] text-[#3525cd]' : 'bg-[#eaedff] text-[#464555]'}`}>
                              {isActive ? 'Actif' : 'Sélectionner'}
                            </span>
                          </div>
                          <span className="text-xs text-[#464555] font-medium">Classe : <strong>{student.class}</strong> ({student.level})</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-[#3525cd] font-bold">
                              <span className="material-symbols-outlined text-[14px]">analytics</span> {student.generalAverage || 14.5} / 20
                            </span>
                            <span className="text-[#c7c4d8] text-[10px]">•</span>
                            <span className="text-xs text-[#006e4b] font-semibold">Assiduité {student.attendanceRate || 98.5}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe]/30 text-[#005236] text-[10px] font-bold">
                          {student.status || 'En règle'}
                        </span>
                        <span className="text-[10px] text-[#777587] font-mono">Mat: {student.matricule}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white border border-[#eaedff] text-center space-y-3 shadow-xs">
              <span className="material-symbols-outlined text-4xl text-[#3525cd]">family_restroom</span>
              <h3 className="text-base font-bold text-[#131b2e]">Compte Parent Certifié — En attente d'association d'élève</h3>
              <p className="text-xs text-[#777587] max-w-md mx-auto">
                Votre compte est validé. L'administration de l'établissement procède à l'association de votre fiche enfant sur votre profil pour afficher ses notes et son carnet numérique.
              </p>
            </div>
          )}
        </div>

        {activeStudent && (
          <>
            {/* Priority Banner & Urgent Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 p-5 rounded-3xl bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#4338ca] text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
                <div className="flex items-center gap-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px] text-white">calendar_clock</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-white/80 font-bold">Liaison Officielle • {activeStudent.class}</span>
                    <h2 className="text-base sm:text-lg font-bold text-white">Réunion Parents-Professeurs — Suivi de {activeStudent.firstName}</h2>
                    <p className="text-xs text-white/90 mt-0.5">Vendredi 15 Mars à 16h30 • Salle Polyvalente • Bilan académique du Trimestre 2</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 z-10 w-full sm:w-auto">
                  <button 
                    onClick={() => setMeetingConfirmed(!meetingConfirmed)}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      meetingConfirmed 
                        ? 'bg-[#6ffbbe] text-[#002113]' 
                        : 'bg-white text-[#3525cd] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    {meetingConfirmed ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Présence confirmée ✓</span>
                      </>
                    ) : (
                      <span>Confirmer ma présence</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Direct Broadcast */}
              <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#464555] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#ae3115]">flash_on</span> En direct pour {activeStudent.firstName}
                  </span>
                  <span className="text-[10px] text-[#777587] font-semibold">Aujourd'hui</span>
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <div className="w-8 h-8 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-[#3525cd]">notifications_active</span>
                  </div>
                  <p className="text-xs text-[#131b2e] leading-snug">
                    {pendingSignatures.length > 0 ? (
                      <span className="text-[#ae3115] font-semibold">{pendingSignatures.length} document(s) à viser et signer dans le carnet.</span>
                    ) : (
                      <span>Carnet de liaison à jour. Aucun mot en attente de visa.</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#f2f3ff]">
                  <span className="text-xs text-[#005338] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">mail</span> Messagerie directe
                  </span>
                  <button 
                    onClick={() => onNavigateTab('parent-messaging')}
                    className="text-xs text-[#3525cd] font-bold hover:underline cursor-pointer"
                  >
                    Écrire aux profs
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics Mosaic for activeStudent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: General Average */}
              <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#464555]">Moyenne Trimestre 2</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/30 text-[#002113] text-[11px] font-bold">En cours</span>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#3525cd] leading-none">
                    {activeStudent.generalAverage ? activeStudent.generalAverage.toString().replace('.', ',') : '15,8'}
                  </span>
                  <span className="text-lg text-[#464555] font-normal">/ 20</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#f2f3ff]">
                  <span className="text-[#464555]">Rang : <strong className="text-[#131b2e] font-semibold">{activeStudent.rank || 1}e / {activeStudent.totalStudents || 40}</strong></span>
                  <span className="text-[#005338] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">stars</span> {activeStudent.honors || 'Tableau d\'Honneur'}
                  </span>
                </div>
              </div>

              {/* Metric 2: Attendance */}
              <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#464555]">Assiduité & Présence</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe]/30 text-[#002113] text-[11px] font-bold">
                    {activeStudent.attendanceRate && activeStudent.attendanceRate >= 95 ? 'Exemplaire' : 'À surveiller'}
                  </span>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#005338] leading-none">
                    {activeStudent.attendanceRate || 98.5}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#f2f3ff]">
                  <span className="text-[#464555]">Absences injustifiées : <strong className={unjustifiedAbsences.length > 0 ? 'text-[#ba1a1a]' : 'text-[#005338]'}>{unjustifiedAbsences.length}</strong></span>
                  <button onClick={() => onNavigateTab('parent-attendance')} className="text-[#3525cd] font-bold hover:underline cursor-pointer">
                    Détails
                  </button>
                </div>
              </div>

              {/* Metric 3: Digital Carnet & Signatures */}
              <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#464555]">Carnet & Visas</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${pendingSignatures.length > 0 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6ffbbe]/30 text-[#005236]'}`}>
                    {pendingSignatures.length > 0 ? `${pendingSignatures.length} à signer` : 'À jour'}
                  </span>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-none">
                    {timelineEvents.length}
                  </span>
                  <span className="text-xs text-[#464555]">événements enregistrés</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#f2f3ff]">
                  <span className="text-[#464555]">Liaison pédagogique</span>
                  <button onClick={() => onNavigateTab('parent-timeline')} className="text-[#3525cd] font-bold hover:underline cursor-pointer">
                    Ouvrir carnet
                  </button>
                </div>
              </div>

              {/* Metric 4: Documents & Bulletins */}
              <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#464555]">Documents Scolaires</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-[11px] font-bold">Certifiés</span>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#3525cd] leading-none">
                    {documents.length || 6}
                  </span>
                  <span className="text-xs text-[#464555]">disponibles</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#f2f3ff]">
                  <span className="text-[#464555]">Bulletins & Circulaires</span>
                  <button onClick={() => onNavigateTab('parent-documents')} className="text-[#3525cd] font-bold hover:underline cursor-pointer">
                    Télécharger
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Operational Sections: Timeline & Grades breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (8 cols): Real-Time Student Timeline */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">history_edu</span>
                    <h3 className="text-base font-bold text-[#131b2e]">
                      Derniers événements du carnet — {activeStudent.firstName} {activeStudent.lastName}
                    </h3>
                  </div>
                  <button 
                    onClick={() => onNavigateTab('parent-timeline')} 
                    className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Voir tout ({timelineEvents.length})</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {timelineEvents.length === 0 ? (
                    <div className="p-8 text-center text-[#777587] text-xs">
                      Aucun événement récent enregistré pour le moment.
                    </div>
                  ) : (
                    timelineEvents.slice(0, 4).map(event => (
                      <div key={event.id} className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors">
                        <div className="flex items-start gap-3">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            event.category === 'eval' ? 'bg-[#e2dfff] text-[#3525cd]' :
                            event.category === 'signature' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                            'bg-[#dae2fd] text-[#3525cd]'
                          }`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {event.category === 'eval' ? 'grade' : event.category === 'signature' ? 'draw' : 'school'}
                            </span>
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-[#131b2e]">{event.title}</h4>
                              <span className="text-[10px] text-[#777587]">• {event.date} à {event.time}</span>
                            </div>
                            <p className="text-xs text-[#464555] mt-0.5">{event.content}</p>
                            <span className="text-[10px] text-[#777587] block mt-0.5">Par : {event.author} ({event.authorRole})</span>
                          </div>
                        </div>

                        {event.requiresSignature && (
                          <div className="shrink-0 self-end sm:self-center">
                            {event.isSigned ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#6ffbbe]/30 text-[#005236] text-xs font-bold">
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                <span>Signé par {event.signedBy || 'Parent'}</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSignEvent(event.id)}
                                disabled={signingEventId === event.id}
                                className="px-3 py-1.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-xs disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                              >
                                {signingEventId === event.id ? (
                                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                ) : (
                                  <span className="material-symbols-outlined text-[16px]">draw</span>
                                )}
                                <span>Viser & Signer</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column (4 cols): Academic snapshot & Quick Messaging */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Academic Quick Marks */}
                <div className="bg-white p-5 rounded-3xl border border-[#eaedff] shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                    <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#3525cd] text-[18px]">grade</span>
                      <span>Dernières notes obtenues</span>
                    </h3>
                    <button onClick={() => onNavigateTab('parent-grades')} className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer">
                      Bulletin
                    </button>
                  </div>

                  <div className="space-y-2">
                    {gradeEvents.length > 0 ? (
                      gradeEvents.slice(0, 3).map((g, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-[#131b2e]">{g.title}</div>
                            <span className="text-[10px] text-[#777587]">Coeff. {g.coefficient || 2} • {g.author}</span>
                          </div>
                          <span className="text-sm font-extrabold text-[#3525cd] px-2 py-0.5 rounded-lg bg-white border border-[#eaedff]">
                            {g.score ? `${g.score}/${g.maxScore || 20}` : '17/20'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[#777587] py-3 text-center">
                        Notes consultables dans l'onglet Bulletin.
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Teacher Communication Box */}
                <div className="bg-gradient-to-br from-[#3525cd] to-[#4f46e5] p-5 rounded-3xl text-white shadow-md space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[22px]">forum</span>
                    <h3 className="text-sm font-bold">Contact Équipe Pédagogique</h3>
                  </div>
                  <p className="text-xs text-[#dad7ff] leading-relaxed">
                    Besoin de poser une question au professeur principal de <strong>{activeStudent.firstName}</strong> ou d'adresser un justificatif ?
                  </p>
                  <button
                    onClick={() => onNavigateTab('parent-messaging')}
                    className="w-full py-2.5 rounded-xl bg-white text-[#3525cd] text-xs font-bold hover:bg-[#faf8ff] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Ouvrir la messagerie</span>
                  </button>
                </div>

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
