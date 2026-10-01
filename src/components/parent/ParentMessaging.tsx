import React, { useState, useRef, useEffect } from 'react';
import { Student, UserAccount, MessageThread } from '../../types';
import { 
  subscribeToUsers, 
  subscribeToMessageThreads, 
  sendMessageToThreadInFirestore 
} from '../../firebase/firestoreService';

interface ParentMessagingProps {
  activeStudent: Student;
  onNavigateTab: (tab: string) => void;
  userName?: string;
}

export const ParentMessaging: React.FC<ParentMessagingProps> = ({
  activeStudent,
  onNavigateTab,
  userName
}) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'teachers' | 'direction'>('all');
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to users and message threads in Firestore
  useEffect(() => {
    const unsubUsers = subscribeToUsers((data) => {
      setUsers(data);
    });

    const unsubThreads = subscribeToMessageThreads((data) => {
      setThreads(data);
    });

    return () => {
      unsubUsers();
      unsubThreads();
    };
  }, []);

  // Filter teachers strictly to those assigned to activeStudent.class + Direction
  const eligibleTeachers = users.filter(u => 
    u.role === 'enseignant' && 
    (u.assignedClasses?.includes(activeStudent.class) || !u.assignedClasses || u.assignedClasses.length === 0)
  );

  const directionContacts = users.filter(u => u.role === 'direction');

  // Combined eligible contacts for activeStudent
  const availableContacts = [
    ...eligibleTeachers.map(t => ({
      id: t.uid,
      name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email,
      role: `Professeur (${t.subjects?.join(', ') || 'Disciplines'}) • ${activeStudent.class}`,
      category: 'teachers' as const,
      email: t.email,
      phone: t.phone,
      initials: t.firstName?.[0] || 'P'
    })),
    ...directionContacts.map(d => ({
      id: d.uid,
      name: d.name || 'Direction Générale',
      role: 'Administration & Vie Scolaire',
      category: 'direction' as const,
      email: d.email,
      phone: d.phone,
      initials: 'DIR'
    }))
  ];

  // Set default active contact if not selected
  useEffect(() => {
    if (availableContacts.length > 0 && !activeContactId) {
      setActiveContactId(availableContacts[0].id);
    }
  }, [availableContacts, activeContactId]);

  // Filtered contacts based on search & filter tab
  const filteredContacts = availableContacts.filter(c => {
    const matchesCategory = filterTab === 'all' || c.category === filterTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const activeContact = availableContacts.find(c => c.id === activeContactId) || availableContacts[0];

  // Get or initialize thread for activeContact
  const currentThread = threads.find(t => t.id === `thread_${activeContact?.id}_${activeStudent.id}` || t.id === `thread_${activeContact?.id}`) || {
    id: `thread_${activeContact?.id}_${activeStudent.id}`,
    contactName: activeContact?.name || 'Interlocuteur',
    contactRole: activeContact?.role || 'Équipe pédagogique',
    lastMessageTime: 'Récemment',
    unreadCount: 0,
    studentContext: `${activeStudent.firstName} ${activeStudent.lastName} (${activeStudent.class})`,
    messages: [
      {
        id: 'msg-init',
        sender: 'teacher' as const,
        senderName: activeContact?.name || 'Équipe pédagogique',
        time: '08:30',
        date: 'Aujourd\'hui',
        text: `Bonjour. Espace de dialogue direct ouvert concernant le suivi pédagogique et la scolarité de ${activeStudent.firstName} ${activeStudent.lastName} (${activeStudent.class}).`
      }
    ]
  };

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThread?.messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || !activeContact || isSending) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const parentSenderName = userName || activeStudent.parentName || 'Vous (Parent Référent)';

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'parent',
      senderName: parentSenderName,
      time: timeStr,
      date: 'Aujourd\'hui',
      text: content.trim(),
      recipientName: activeContact.name,
      recipientRole: activeContact.role,
      studentContext: `${activeStudent.firstName} ${activeStudent.lastName} (${activeStudent.class})`
    };

    setInputText('');
    setIsSending(true);

    try {
      await sendMessageToThreadInFirestore(currentThread.id, newMsg);
    } catch (e) {
      console.warn('Could not persist message to Firestore:', e);
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
        
        {/* Top Context Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#464555] font-semibold mb-1">
              <span onClick={() => onNavigateTab('parent-dashboard')} className="hover:text-[#3525cd] transition-colors cursor-pointer">
                Espace Parents
              </span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#3525cd] font-semibold">Messagerie & Liaison École</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight flex items-center gap-2">
              <span>Messagerie avec le Corps Enseignant</span>
              <span className="px-3 py-1 rounded-full bg-[#e2dfff] text-[#3525cd] text-xs font-bold">
                {activeStudent.firstName} ({activeStudent.class})
              </span>
            </h1>
          </div>
        </div>

        {/* Messaging Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[78vh] min-h-[580px] bg-white rounded-3xl border border-[#eaedff] shadow-sm overflow-hidden">
          
          {/* Left Column (4 cols): Teachers & Staff Contacts List */}
          <div className="lg:col-span-4 border-r border-[#eaedff] flex flex-col h-full bg-[#faf8ff]">
            
            {/* Search Input */}
            <div className="p-4 border-b border-[#eaedff] space-y-3 bg-white">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">search</span>
                <input 
                  type="text"
                  placeholder="Rechercher un professeur de l'élève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'all' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555]'
                  }`}
                >
                  Tous ({availableContacts.length})
                </button>
                <button
                  onClick={() => setFilterTab('teachers')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'teachers' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555]'
                  }`}
                >
                  Professeurs ({eligibleTeachers.length})
                </button>
                <button
                  onClick={() => setFilterTab('direction')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterTab === 'direction' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555]'
                  }`}
                >
                  Direction ({directionContacts.length})
                </button>
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#eaedff]/60 p-2 space-y-1">
              {filteredContacts.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#777587]">
                  Aucun enseignant trouvé pour cette recherche.
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = contact.id === activeContact?.id;
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setActiveContactId(contact.id)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-[#e2dfff] border-l-4 border-l-[#3525cd]' 
                          : 'hover:bg-white bg-white/50 border border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-[#3525cd] text-white' : 'bg-[#eaedff] text-[#3525cd]'
                      }`}>
                        {contact.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#131b2e] truncate">{contact.name}</h4>
                          <span className="text-[10px] text-[#006e4b] font-semibold">En ligne</span>
                        </div>
                        <p className="text-[11px] text-[#464555] truncate mt-0.5">{contact.role}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column (8 cols): Active Chat Conversation */}
          <div className="lg:col-span-8 flex flex-col h-full bg-white">
            
            {/* Chat Top Bar */}
            {activeContact && (
              <div className="p-4 border-b border-[#eaedff] flex items-center justify-between bg-[#faf8ff]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-bold text-xs">
                    {activeContact.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#131b2e]">{activeContact.name}</h3>
                    <p className="text-xs text-[#464555]">{activeContact.role}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/30 text-[#005236] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#006e4b] animate-pulse"></span>
                  <span>Canal sécurisé</span>
                </span>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#faf8ff]/40">
              {currentThread?.messages?.map((msg) => {
                const isMe = msg.sender === 'parent';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-[#777587] font-semibold mb-1 px-1">
                      {msg.senderName} • {msg.time}
                    </span>
                    <div className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[75%] text-xs leading-relaxed shadow-2xs ${
                      isMe 
                        ? 'bg-[#3525cd] text-white rounded-tr-none' 
                        : 'bg-white text-[#131b2e] border border-[#eaedff] rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates & Message Input */}
            <div className="p-4 border-t border-[#eaedff] bg-white space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => handleSendMessage(`Bonjour ${activeContact?.name}, je souhaiterais échanger avec vous concernant les devoirs et résultats de ${activeStudent.firstName}.`)}
                  className="px-3 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[11px] font-semibold text-[#3525cd] shrink-0 cursor-pointer"
                >
                  📝 Question sur les devoirs
                </button>
                <button
                  onClick={() => handleSendMessage(`Bonjour, je vous confirme la présence pour le prochain rendez-vous pédagogique de ${activeStudent.firstName}.`)}
                  className="px-3 py-1 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[11px] font-semibold text-[#3525cd] shrink-0 cursor-pointer"
                >
                  🤝 Confirmation de RDV
                </button>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  placeholder={`Écrire un message à ${activeContact?.name || 'l\'enseignant'}...`}
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
