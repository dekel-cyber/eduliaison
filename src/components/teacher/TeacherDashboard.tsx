import React, { useState, useEffect } from 'react';
import { Student, SchoolClass, UserAccount, MessageThread } from '../../types';
import { 
  subscribeToStudents, 
  subscribeToClasses, 
  subscribeToUsers, 
  subscribeToMessageThreads, 
  sendMessageToThreadInFirestore,
  getCanonicalThreadId,
  findMatchingThread,
  logActivityInFirestore 
} from '../../firebase/firestoreService';

interface TeacherDashboardProps {
  onNavigateTab: (tab: string, targetId?: string) => void;
  userName?: string;
  currentTeacher?: {
    name?: string;
    email?: string;
    assignedClasses?: string[];
    subjects?: string[];
  };
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  onNavigateTab, 
  userName,
  currentTeacher 
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  
  const [callingRoll, setCallingRoll] = useState(false);
  const [rollSuccess, setRollSuccess] = useState(false);
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Messaging state for teacher
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [teacherMsgText, setTeacherMsgText] = useState<string>('');

  useEffect(() => {
    const unsubStudents = subscribeToStudents((data) => setStudents(data));
    const unsubClasses = subscribeToClasses((data) => setClasses(data));
    const unsubUsers = subscribeToUsers((data) => setUsers(data));
    const unsubThreads = subscribeToMessageThreads((data) => setThreads(data));

    return () => {
      unsubStudents();
      unsubClasses();
      unsubUsers();
      unsubThreads();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const teacherDisplayName = userName || currentTeacher?.name || 'Professeur';
  const teacherClasses = currentTeacher?.assignedClasses && currentTeacher.assignedClasses.length > 0 
    ? currentTeacher.assignedClasses 
    : ['3ème A', '3ème B'];
  const teacherSubjects = currentTeacher?.subjects && currentTeacher.subjects.length > 0
    ? currentTeacher.subjects
    : ['Français & Lettres'];

  // Students belonging strictly to this teacher's assigned classes
  const assignedStudents = students.filter(s => teacherClasses.includes(s.class));

  // Parents list: prioritize assigned class parents, followed by other registered parents
  const classParents = users.filter(u => 
    u.role === 'parent' && 
    (u.childrenIds?.some(cid => assignedStudents.some(as => as.id === cid)) ||
     assignedStudents.some(as => as.parentEmail?.toLowerCase() === u.email?.toLowerCase()))
  );
  const otherParents = users.filter(u => 
    u.role === 'parent' && 
    !classParents.some(cp => cp.uid === u.uid)
  );
  const eligibleParents = [...classParents, ...otherParents];

  const handleQuickRollcall = async () => {
    setCallingRoll(true);
    try {
      await logActivityInFirestore({
        type: 'teacher_assigned',
        title: `Appel effectué (${teacherClasses[0] || 'Classe'})`,
        description: `Appel de présence validé par ${teacherDisplayName} pour la classe de ${teacherClasses[0]}.`,
        actorName: teacherDisplayName,
        actorRole: 'enseignant',
        targetName: teacherClasses[0],
        category: 'vie_scolaire'
      });
      setCallingRoll(false);
      setRollSuccess(true);
      showToast(`Appel validé et enregistré pour la classe de ${teacherClasses[0]} !`);
      setTimeout(() => setRollSuccess(false), 3000);
    } catch {
      setCallingRoll(false);
    }
  };

  const handleSendTeacherMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMsgText.trim() || !selectedParentId) return;

    const parent = eligibleParents.find(p => p.uid === selectedParentId) || users.find(u => u.uid === selectedParentId);
    if (!parent) return;

    // Find student associated with parent
    const child = students.find(s => 
      s.parentId === parent.uid || 
      (parent.childrenIds && parent.childrenIds.includes(s.id)) ||
      (s.parentEmail && s.parentEmail.toLowerCase().trim() === parent.email?.toLowerCase().trim())
    ) || assignedStudents[0];

    const teacherIdentifier = currentTeacher?.email || currentTeacher?.name || 'teacher';
    const existingThread = findMatchingThread(threads, parent, currentTeacher, child?.id);
    const threadId = existingThread ? existingThread.id : getCanonicalThreadId(parent.uid, teacherIdentifier);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setIsSendingMsg(true);
    try {
      const parentFullName = parent.name || `${parent.firstName || ''} ${parent.lastName || ''}`.trim() || parent.email;
      const contextText = child ? `${child.firstName} ${child.lastName} (${child.class})` : `Suivi pédagogique (${teacherClasses.join(', ')})`;

      await sendMessageToThreadInFirestore(threadId, {
        id: `msg_${Date.now()}`,
        sender: 'teacher',
        senderName: teacherDisplayName,
        senderId: currentTeacher?.email || 'teacher',
        recipientId: parent.uid,
        recipientName: parentFullName,
        recipientRole: 'Parent Référent',
        time: timeStr,
        date: 'Aujourd\'hui',
        text: teacherMsgText.trim(),
        studentContext: contextText
      }, {
        parentId: parent.uid,
        parentEmail: parent.email,
        parentName: parentFullName,
        teacherId: currentTeacher?.email || 'teacher',
        teacherEmail: currentTeacher?.email,
        teacherName: teacherDisplayName,
        studentId: child?.id,
        studentName: child ? `${child.firstName} ${child.lastName}` : undefined,
        studentClass: child?.class,
        contactName: parentFullName,
        contactRole: 'Parent Référent',
        studentContext: contextText,
        lastMessageTime: timeStr
      });

      setTeacherMsgText('');
      setSelectedParentId('');
      showToast(`Message transmis avec succès à ${parentFullName} ! Rendez-vous dans la messagerie pour poursuivre.`);
    } catch (err: any) {
      showToast("Erreur d'envoi du message.");
    } finally {
      setIsSendingMsg(false);
    }
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* 1. Header Section */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-[#eaedff] overflow-hidden shadow-xs shrink-0 flex items-center justify-center font-bold text-xl text-[#3525cd]">
              {teacherDisplayName[0] || 'P'}
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#006e4b] ring-2 ring-white"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight">
                  Bonjour, {teacherDisplayName} 👋
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#3525cd]/10 text-[#3525cd] text-xs uppercase tracking-wider font-bold">
                  Espace Pédagogique Actif
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#464555] mt-0.5">
                Disciplines : <strong className="text-[#131b2e]">{teacherSubjects.join(', ')}</strong> • Classes assignées : <strong className="text-[#3525cd]">[{teacherClasses.join(', ')}]</strong>
              </p>
              <div className="flex items-center gap-2 text-xs text-[#777587] mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[#464555]">
                  <span className="material-symbols-outlined text-[16px] text-[#3525cd]">school</span> Groupe Scolaire Excellence d'Abidjan
                </span>
                <span>•</span>
                <span>{assignedStudents.length} élèves sous votre responsabilité</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={handleQuickRollcall}
              disabled={callingRoll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3525cd] text-white text-xs font-bold shadow-md hover:bg-[#4f46e5] disabled:opacity-60 transition-all cursor-pointer" 
            >
              {callingRoll ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : rollSuccess ? (
                <span className="material-symbols-outlined text-[18px]">check</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              )}
              <span>{rollSuccess ? 'Appel validé !' : "Faire l'appel express"}</span>
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

        {/* 2. Key Metrics Row for this teacher */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Mes Classes Assignées</span>
            <div className="my-2">
              <span className="text-3xl font-black text-[#3525cd]">{teacherClasses.length}</span>
            </div>
            <span className="text-xs text-[#464555] font-semibold">{teacherClasses.join(' & ')}</span>
          </div>

          <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Total Élèves Suivis</span>
            <div className="my-2">
              <span className="text-3xl font-black text-[#131b2e]">{assignedStudents.length}</span>
            </div>
            <span className="text-xs text-[#006e4b] font-semibold">Effectifs synchronisés</span>
          </div>

          <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Matières Enseignées</span>
            <div className="my-2">
              <span className="text-2xl font-black text-[#ae3115]">{teacherSubjects.length}</span>
            </div>
            <span className="text-xs text-[#464555] truncate">{teacherSubjects[0] || 'Général'}</span>
          </div>

          <div className="p-5 rounded-3xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Parents Joignables</span>
            <div className="my-2">
              <span className="text-3xl font-black text-[#005338]">{eligibleParents.length || assignedStudents.length}</span>
            </div>
            <span className="text-xs text-[#464555]">Canal certifié ouvert</span>
          </div>
        </section>

        {/* 3. Class breakdown & Direct Messaging with Parents */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Assigned Students List (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">school</span>
                <h3 className="text-base font-bold text-[#131b2e]">
                  Élèves de vos classes [{teacherClasses.join(', ')}] ({assignedStudents.length})
                </h3>
              </div>
              <button 
                onClick={() => onNavigateTab('teacher-gradebook')}
                className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
              >
                Accéder au carnet de notes
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[#777587] font-bold border-b border-[#eaedff] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Élève & Matricule</th>
                    <th className="pb-3">Classe</th>
                    <th className="pb-3">Parent Référent</th>
                    <th className="pb-3">Moyenne</th>
                    <th className="pb-3 text-right pr-2">Action Pédagogique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {assignedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#777587]">
                        Aucun élève trouvé dans vos classes assignées.
                      </td>
                    </tr>
                  ) : (
                    assignedStudents.map(student => (
                      <tr key={student.id} className="hover:bg-[#faf8ff] transition-colors">
                        <td className="py-3 pl-2 font-bold text-[#131b2e] flex items-center gap-2.5">
                          <img 
                            src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'} 
                            alt={student.firstName} 
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div>{student.firstName} {student.lastName}</div>
                            <span className="text-[10px] text-[#777587] font-mono">{student.matricule}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-[#e2dfff] text-[#3525cd] font-bold text-[10px]">
                            {student.class}
                          </span>
                        </td>
                        <td className="py-3 text-[#464555]">
                          {student.parentName || 'Non assigné'}
                        </td>
                        <td className="py-3 font-bold text-[#3525cd]">
                          {student.generalAverage ? `${student.generalAverage}/20` : '14.5/20'}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button
                            onClick={() => onNavigateTab('teacher-liaison')}
                            className="px-3 py-1 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] font-bold text-[11px] cursor-pointer"
                          >
                            Écrire mot
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Direct Messaging with Parents of Assigned Classes (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd]">chat</span>
                  <h3 className="text-base font-bold text-[#131b2e]">Messagerie</h3>
                </div>
                <button 
                  onClick={() => onNavigateTab('teacher-messaging', selectedParentId || undefined)}
                  className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Ouvrir l'espace complet</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
              <p className="text-xs text-[#777587] mt-2">
                Vous pouvez envoyer un message direct aux parents d'élèves de vos classes assignées.
              </p>

              <form onSubmit={handleSendTeacherMessage} className="space-y-3 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Sélectionner un parent</label>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] font-bold outline-none cursor-pointer"
                  >
                    <option value="">-- Choisir un parent d'élève --</option>
                    {eligibleParents.map(parent => (
                      <option key={parent.uid} value={parent.uid}>
                        {parent.name || parent.email} ({parent.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Message direct</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Écrivez votre mot pédagogique au parent..."
                    value={teacherMsgText}
                    onChange={(e) => setTeacherMsgText(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none focus:ring-2 focus:ring-[#3525cd] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedParentId || !teacherMsgText.trim() || isSendingMsg}
                  className="w-full py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSendingMsg ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  )}
                  <span>Transmettre au parent</span>
                </button>
              </form>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#6ffbbe]/20 border border-[#6ffbbe] text-[#005236] text-[11px] leading-relaxed">
              ✓ Les messages envoyés sont instantanément visibles par le parent concerné dans sa boîte de messagerie.
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
