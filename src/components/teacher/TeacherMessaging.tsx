import React, { useState, useRef, useEffect } from 'react';
import { Student, UserAccount, MessageThread } from '../../types';
import { 
  subscribeToStudents,
  subscribeToUsers, 
  subscribeToMessageThreads, 
  sendMessageToThreadInFirestore 
} from '../../firebase/firestoreService';

interface TeacherMessagingProps {
  onNavigateTab: (tab: string) => void;
  userName?: string;
  currentTeacher?: {
    name?: string;
    email?: string;
    assignedClasses?: string[];
    subjects?: string[];
  };
}

export const TeacherMessaging: React.FC<TeacherMessagingProps> = ({
  onNavigateTab,
  userName,
  currentTeacher
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const teacherDisplayName = userName || currentTeacher?.name || 'Professeur';
  const teacherClasses = currentTeacher?.assignedClasses && currentTeacher.assignedClasses.length > 0
    ? currentTeacher.assignedClasses
    : ['3ème A', '3ème B'];

  useEffect(() => {
    const unsubStudents = subscribeToStudents((data) => setStudents(data));
    const unsubUsers = subscribeToUsers((data) => setUsers(data));
    const unsubThreads = subscribeToMessageThreads((data) => setThreads(data));

    return () => {
      unsubStudents();
      unsubUsers();
      unsubThreads();
    };
  }, []);

  // Filter students belonging to teacher's classes
  const assignedStudents = students.filter(s => teacherClasses.includes(s.class));

  // Eligible parents from teacher's classes
  const eligibleParents = users.filter(u => 
    u.role === 'parent' && 
    (u.childrenIds?.some(cid => assignedStudents.some(as => as.id === cid)) ||
     assignedStudents.some(as => as.parentEmail?.toLowerCase() === u.email?.toLowerCase()))
  );

  // Build unified conversation list:
  // Combines existing Firestore threads + potential parent contacts of assigned classes
  const conversationList = eligibleParents.map(parent => {
    // Find child associated to this parent
    const child = assignedStudents.find(s => 
      (parent.childrenIds && parent.childrenIds.includes(s.id)) || 
      (s.parentEmail && s.parentEmail.toLowerCase() === parent.email?.toLowerCase())
    ) || assignedStudents[0];

    const threadId = `thread_${parent.uid}_teacher`;
    const firestoreThread = threads.find(t => 
      t.id === threadId || 
      t.id === `thread_${parent.uid}` || 
      t.id.includes(parent.uid) ||
      (child && t.id.includes(child.id))
    );

    return {
      threadId: firestoreThread?.id || threadId,
      parentId: parent.uid,
      parentName: parent.name || `${parent.firstName || ''} ${parent.lastName || ''}`.trim() || parent.email,
      parentEmail: parent.email,
      parentPhone: parent.phone,
      childName: child ? `${child.firstName} ${child.lastName}` : 'Élève',
      childClass: child ? child.class : teacherClasses[0] || 'Classe',
      lastMessage: firestoreThread?.messages?.slice(-1)[0]?.text || "Aucun message échangé pour l'instant",
      lastTime: firestoreThread?.lastMessageTime || 'Récemment',
      unreadCount: firestoreThread?.unreadCount || 0,
      messages: firestoreThread?.messages || []
    };
  });

  // Set default active thread
  useEffect(() => {
    if (conversationList.length > 0 && !activeThreadId) {
      setActiveThreadId(conversationList[0].threadId);
    }
  }, [conversationList, activeThreadId]);

  // Filtered conversations
  const filteredConversations = conversationList.filter(conv => {
    const matchesClass = selectedClassFilter === 'all' || conv.childClass === selectedClassFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      conv.parentName.toLowerCase().includes(q) || 
      conv.childName.toLowerCase().includes(q) ||
      conv.parentEmail.toLowerCase().includes(q);
    return matchesClass && matchesSearch;
  });

  const activeConv = conversationList.find(c => c.threadId === activeThreadId) || conversationList[0];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activeConv || isSending) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'teacher',
      senderName: teacherDisplayName,
      time: timeStr,
      date: 'Aujourd\'hui',
      text: textToSend.trim(),
      recipientName: activeConv.parentName,
      recipientRole: 'Parent Référent',
      studentContext: `${activeConv.childName} (${activeConv.childClass})`
    };

    setInputText('');
    setIsSending(true);

    try {
      await sendMessageToThreadInFirestore(activeConv.threadId, newMsg);
    } catch (e) {
      console.warn('Could not persist teacher reply in Firestore:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Top Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#464555] font-semibold mb-1">
              <span onClick={() => onNavigateTab('teacher-dashboard')} className="hover:text-[#3525cd] transition-colors cursor-pointer">
                Espace Enseignant
              </span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#3525cd] font-semibold">Messagerie avec les Familles</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight flex items-center gap-2">
              <span>Messagerie Parents d'Élèves</span>
              <span className="px-3 py-1 rounded-full bg-[#e2dfff] text-[#3525cd] text-xs font-bold">
                Classes : [{teacherClasses.join(', ')}]
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#6ffbbe]/30 text-[#005236] text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006e4b] animate-pulse"></span>
              <span>{eligibleParents.length} parents joignables</span>
            </span>
          </div>
        </div>

        {/* Messaging Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[78vh] min-h-[580px] bg-white rounded-3xl border border-[#eaedff] shadow-sm overflow-hidden">
          
          {/* Left Column (4 cols): Parents Conversations List */}
          <div className="lg:col-span-4 border-r border-[#eaedff] flex flex-col h-full bg-[#faf8ff]">
            
            {/* Search & Class Filter */}
            <div className="p-4 border-b border-[#eaedff] space-y-3 bg-white">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">search</span>
                <input 
                  type="text"
                  placeholder="Rechercher par parent ou élève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                />
              </div>

              {/* Class Filter Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedClassFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedClassFilter === 'all' ? 'bg-[#3525cd] text-white' : 'bg-[#f2f3ff] text-[#464555]'
                  }`}
                >
                  Toutes mes classes
                </button>
                {teacherClasses.map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClassFilter(cls)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      selectedClassFilter === cls ? 'bg-[#3525cd] text-white' : 'bg-[#f2f3ff] text-[#464555]'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#eaedff]/60 p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#777587]">
                  Aucun parent trouvé pour cette sélection.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.threadId === activeConv?.threadId;
                  return (
                    <div
                      key={conv.threadId}
                      onClick={() => setActiveThreadId(conv.threadId)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-[#e2dfff] border-l-4 border-l-[#3525cd]' 
                          : 'hover:bg-white bg-white/60 border border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-[#3525cd] text-white' : 'bg-[#eaedff] text-[#3525cd]'
                      }`}>
                        {conv.parentName[0] || 'P'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#131b2e] truncate">{conv.parentName}</h4>
                          <span className="text-[10px] text-[#777587] font-medium">{conv.lastTime}</span>
                        </div>
                        <span className="text-[10px] text-[#3525cd] font-bold block mt-0.5">
                          Élève : {conv.childName} ({conv.childClass})
                        </span>
                        <p className="text-[11px] text-[#464555] truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column (8 cols): Active Chat Area */}
          <div className="lg:col-span-8 flex flex-col h-full bg-white">
            
            {/* Chat Header */}
            {activeConv ? (
              <div className="p-4 border-b border-[#eaedff] flex items-center justify-between bg-[#faf8ff]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-bold text-xs">
                    {activeConv.parentName[0] || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#131b2e] flex items-center gap-2">
                      <span>{activeConv.parentName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#e2dfff] text-[#3525cd] text-[10px] font-bold">
                        {activeConv.childClass}
                      </span>
                    </h3>
                    <p className="text-xs text-[#464555]">
                      Parent de <strong>{activeConv.childName}</strong> • {activeConv.parentEmail} {activeConv.parentPhone ? `• ${activeConv.parentPhone}` : ''}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/30 text-[#005236] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#006e4b] animate-pulse"></span>
                  <span>Canal certifié</span>
                </span>
              </div>
            ) : (
              <div className="p-4 border-b border-[#eaedff] bg-[#faf8ff] text-xs text-[#777587]">
                Sélectionnez un parent pour afficher la conversation
              </div>
            )}

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#faf8ff]/40">
              {activeConv?.messages && activeConv.messages.length > 0 ? (
                activeConv.messages.map((msg: any) => {
                  const isTeacher = msg.sender === 'teacher';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-[#777587] font-semibold mb-1 px-1">
                        {msg.senderName} • {msg.time}
                      </span>
                      <div className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[75%] text-xs leading-relaxed shadow-2xs ${
                        isTeacher 
                          ? 'bg-[#3525cd] text-white rounded-tr-none' 
                          : 'bg-white text-[#131b2e] border border-[#eaedff] rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#777587]">
                  Aucun message échangé pour l'instant. Vous pouvez rédiger le premier message ci-dessous.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Shortcuts & Message Box */}
            <div className="p-4 border-t border-[#eaedff] bg-white space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => handleSendMessage(`Bonjour ${activeConv?.parentName}, je vous confirme la bonne réception de votre mot concernant ${activeConv?.childName}.`)}
                  className="px-3 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[11px] font-semibold text-[#3525cd] shrink-0 cursor-pointer"
                >
                  ✓ Accusé de réception
                </button>
                <button
                  onClick={() => handleSendMessage(`Bonjour, ${activeConv?.childName} fait de remarquables progrès et sa participation en classe est exemplaire.`)}
                  className="px-3 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[11px] font-semibold text-[#3525cd] shrink-0 cursor-pointer"
                >
                  ⭐ Félicitations pour le travail
                </button>
                <button
                  onClick={() => handleSendMessage(`Bonjour, je vous propose un point d'étape ce vendredi à 16h30 en salle de réunion.`)}
                  className="px-3 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[11px] font-semibold text-[#3525cd] shrink-0 cursor-pointer"
                >
                  📅 Proposition de RDV
                </button>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  placeholder={`Répondre à ${activeConv?.parentName || 'ce parent'}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 p-3 text-xs rounded-2xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3525cd] resize-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isSending}
                  className="p-3 rounded-2xl bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 transition-all flex items-center justify-center"
                >
                  {isSending ? (
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
