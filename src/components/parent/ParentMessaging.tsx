import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../../types';

interface MessageItem {
  id: string;
  sender: 'teacher' | 'parent';
  senderName: string;
  avatar?: string;
  text: string;
  time: string;
  attachment?: {
    name: string;
    size: string;
  };
  note?: string;
}

interface ParentMessagingProps {
  activeStudent: Student;
  onNavigateTab: (tab: string) => void;
}

export const ParentMessaging: React.FC<ParentMessagingProps> = ({
  activeStudent,
  onNavigateTab
}) => {
  const [activeContactId, setActiveContactId] = useState<string>('toure');
  const [filterTab, setFilterTab] = useState<string>('all');
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm-1',
      sender: 'teacher',
      senderName: 'Mme Aya Touré',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADFnsP9X5GdNLDX28WUlNYoFsj793Z-ib1wRQla4dgtIh7vWVh3tWqzWJgO7nWEbPQO6jubJYcBCB621xWWx4AvYnqsq6H1phJ_WdiDEOZ2w_cJ5PAQxpr1Bau8l2kD4FBrahkbPrEKiUwcTVntsF4kmJRkcj9fKnJDcXzRd-AitPdOnl8PmhdpPRiqN77T16Yd2Mi8R3nJ4paNtdHOdgCxuoq0Rioy3ChZTr4q4J7Mlai3MwEvhU-YQ',
      text: "Bonjour M. Kouamé, je tenais à vous féliciter pour l'engagement d'Awa lors de notre exposé de français ce matin. Elle fait preuve d'une excellente maturité et d'une prise de parole remarquable devant l'ensemble de la classe.",
      time: '09:15',
      note: 'Observation pédagogique positive inscrite au bulletin'
    },
    {
      id: 'm-2',
      sender: 'parent',
      senderName: 'Vous (M. Koffi Kouamé)',
      text: "Bonjour Madame Touré, merci beaucoup pour ce retour encourageant. Nous veillons également à la maison à ce qu'elle conserve ce rythme studieux.\n\nPour la réunion de vendredi, le créneau de 16h30 est parfait pour moi.",
      time: '09:48'
    },
    {
      id: 'm-3',
      sender: 'teacher',
      senderName: 'Mme Aya Touré',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4rIHKZCe6-wzVZX9GFdGndnYf-okbS2BX9DUInZZZSJY8LCJ0pPwoWT4ywrZOd_pQU1tlqU5DXPmDW-Fg86GkGg4qdRm9eqet1UbK-HUB_DPoShLU7sIGb3aIQbzoyfyDCyBNrijxkX5YsoeM-Y6f5gjzB2CJxv74AZ9ulQFp5gzAjptHXWpsE2gKR9r_9lwv8KwDiJ_RTk7tK8oZqGx6vgAWQmPCdInNMaXnDIKcCOSWk4ffpoJW5A',
      text: "Parfait, je vous note pour 16h30 en salle Polyvalente.\n\nN'hésitez pas à m'indiquer si vous souhaitez que nous abordions en priorité ses choix d'orientation pour la classe de 2nde générale ou scientifique.",
      time: '10:45',
      attachment: {
        name: 'Fiche_Orientation_3eme_Option_Sciences.pdf',
        size: 'Document officiel • 420 Ko'
      }
    }
  ]);

  const contacts = [
    {
      id: 'toure',
      name: 'Mme Aya Touré',
      role: 'Prof. Principal • Français 3ème A',
      lastMessage: "N'hésitez pas à me confirmer votre créneau pour la réunion de vendredi...",
      time: '10:45',
      unread: 1,
      category: 'teachers',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDE38sw5h3Uz2alcPm3hAKHKO7NvYGQSvqmF0GMBUS-8g37jOH1wZUNOXOMPxi7ksRs7EvMBlvxMii1hOmVgXMOJArMQQHDB4eNi9kq-F3WuWJ_eZk9Y8i-z4n4B20s2GVcpFh8JIhlwLl5oHbS9sOUb2wfsCIDtPQDET0K640uw9JZ9J7IaGxYg8JcmkEurnT9U4VIVNHE2Fbemrgdfmv1NsFpQ5volIwN8aQHJOL-WX9kEtCW5AvIQ'
    },
    {
      id: 'kone',
      name: 'M. Bakary Koné',
      role: 'CPE • Vie Scolaire Collège',
      lastMessage: 'Le justificatif pour le retard de lundi a bien été pris en compte.',
      time: 'Lundi',
      unread: 0,
      category: 'viescolaire',
      initials: 'BK'
    },
    {
      id: 'traore',
      name: 'M. S. Traoré',
      role: 'Professeur de Mathématiques',
      lastMessage: "Félicitations pour le dernier devoir d'Awa, les progrès sont nets.",
      time: '5 Mars',
      unread: 0,
      category: 'teachers',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVI6dZanKDiByS9LHr7OVewr2zDSd46hcFndrzGuaS4wJ-P9BwO2rfEAtCgJkYm6GyOl2jm6_-jgPd_d95PMsILjEkYfGesoRkj31lmNimw5DiNAmdTPsl58xgv8_vfGfl5IHjZa9HRpleqVYabl95nbV5pkStcw0yB-k3Fpbsor0-wIxQBK7LKKej3UXC3bNRsO18FFUl5pie8GB-p_oho2ihrmcBWrlER79CrjiOXI_QxKIzceh9WQ'
    },
    {
      id: 'secretariat',
      name: 'Secrétariat & Intendance',
      role: 'Gestion Financière & Scolarité',
      lastMessage: 'Votre reçu de paiement du 2ème trimestre est disponible...',
      time: '28 Fév',
      unread: 0,
      category: 'archives',
      icon: 'receipt_long'
    }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: 'parent',
      senderName: 'Vous (M. Koffi Kouamé)',
      text: content.trim(),
      time: time
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesTab = filterTab === 'all' || 
      (filterTab === 'teachers' && contact.category === 'teachers') ||
      (filterTab === 'viescolaire' && contact.category === 'viescolaire') ||
      (filterTab === 'archives' && contact.category === 'archives');
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Breadcrumb & Context Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center text-[#3525cd]">
              <span className="material-symbols-outlined text-[24px]">forum</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#131b2e]">Messagerie École Directe</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#6ffbbe]/30 text-[#005236] text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005338] mr-1.5 animate-pulse"></span> Canal Officiel Sécurisé
                </span>
              </div>
              <p className="text-xs text-[#464555]">Liaison en direct avec les professeurs, la direction et la vie scolaire du Groupe Scolaire d'Excellence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
              <span className="material-symbols-outlined text-[#005338] text-[18px]">verified_user</span>
              <span className="text-xs text-[#464555]">Chiffrement de bout-en-bout • Archivage officiel</span>
            </div>
            <button 
              onClick={() => handleSendMessage("Bonjour, je sollicite un échange avec l'équipe pédagogique.")}
              className="flex items-center gap-2 bg-[#3525cd] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
              <span>Nouveau message</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-white shadow-md border border-[#eaedff] overflow-hidden min-h-[720px]">
          {/* LEFT COLUMN: Conversations & Contact Directory (4 cols on lg) */}
          <aside className="lg:col-span-4 flex flex-col bg-[#f2f3ff]/40 border-r border-[#eaedff]">
            {/* Search & Action Bar */}
            <div className="p-4 bg-white border-b border-[#eaedff]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-[20px]">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f2f3ff] focus:bg-white rounded-xl text-xs text-[#131b2e] placeholder:text-[#777587] focus:outline-none transition-all border border-[#eaedff]" 
                  placeholder="Rechercher un enseignant, une matière..." 
                  type="text" 
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-none">
                <button 
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterTab === 'all' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#eaedff] text-[#464555] hover:text-[#131b2e]'
                  }`}
                >
                  Boîte de réception
                </button>
                <button 
                  onClick={() => setFilterTab('teachers')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterTab === 'teachers' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#eaedff] text-[#464555] hover:text-[#131b2e]'
                  }`}
                >
                  Enseignants
                </button>
                <button 
                  onClick={() => setFilterTab('viescolaire')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterTab === 'viescolaire' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#eaedff] text-[#464555] hover:text-[#131b2e]'
                  }`}
                >
                  Vie Scolaire
                </button>
                <button 
                  onClick={() => setFilterTab('archives')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterTab === 'archives' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#eaedff] text-[#464555] hover:text-[#131b2e]'
                  }`}
                >
                  Archives
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredContacts.map((contact) => {
                const isSelected = activeContactId === contact.id;
                return (
                  <div 
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    className={`cursor-pointer p-3.5 rounded-xl transition-all border ${
                      isSelected 
                        ? 'bg-[#4f46e5]/10 border-[#c3c0ff] shadow-xs' 
                        : 'hover:bg-[#eaedff] border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        {contact.avatar ? (
                          <img 
                            className="w-12 h-12 rounded-full object-cover" 
                            src={contact.avatar} 
                            alt={contact.name} 
                          />
                        ) : contact.initials ? (
                          <div className="w-12 h-12 rounded-full bg-[#dae2fd] text-[#3525cd] text-base flex items-center justify-center font-bold">
                            {contact.initials}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#ffdad2] text-[#ae3115] text-base flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[24px]">{contact.icon || 'folder'}</span>
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#005338] rounded-full ring-2 ring-white"></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] truncate">{contact.name}</h4>
                          <span className={`text-[11px] ${isSelected ? 'text-[#3525cd] font-bold' : 'text-[#464555]'}`}>
                            {contact.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-[#464555] truncate">{contact.role}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-xs text-[#464555] truncate">{contact.lastMessage}</p>
                          {contact.unread > 0 ? (
                            <span className="shrink-0 px-2 py-0.5 bg-[#fd6a49] text-white text-[10px] font-bold rounded-full">
                              {contact.unread}
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px] text-[#005338]">done_all</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Student Direct Switch Reminder Card */}
              <div className="p-3.5 mt-4 rounded-xl bg-gradient-to-br from-[#e2dfff]/40 via-[#eaedff] to-[#dae2fd] text-[#131b2e] border border-[#c3c0ff]/60">
                <div className="flex items-center gap-2 text-[#3525cd] text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  <span>Parent d'élève référent</span>
                </div>
                <p className="text-xs text-[#464555] mt-1">
                  Vous communiquez en qualité de représentant légal de <strong>{activeStudent.firstName} {activeStudent.lastName}</strong> ({activeStudent.class}).
                </p>
                <div 
                  onClick={() => onNavigateTab('parent-dashboard')}
                  className="mt-2 flex items-center gap-1 text-[#3525cd] text-xs font-bold cursor-pointer hover:underline"
                >
                  <span>Voir le trombinoscope de l'équipe</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Active Chat Thread (8 cols on lg) */}
          <section className="lg:col-span-8 flex flex-col bg-white h-full">
            {/* Thread Header */}
            <div className="p-4 px-6 bg-white shadow-xs border-b border-[#eaedff] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img 
                    className="w-12 h-12 rounded-full object-cover shadow-xs" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvbESunckYkInqXqOgBxB0rjCtcuPWppCycRHkp0aoJFCe0MyA23RIIg1ogKI5IwOSIdTkGoDZe-SDwMorwB6ChoihOvZHTpTj0VGvTOIBXbCiAf2ty-TRAwMG5-aAq0FQrdc8MJVZPj5lZxla6I1nEOJ4GUD6Gs_DMJyM7tbTDAfkS__BwobDpoAuNzlGD-dq6uh0QRSbiGo-0B8zQoUVzjbj4g4bk1xi6zidq8QsPTrZrzj8-0oQhw" 
                    alt="Mme Aya Touré" 
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#005338] rounded-full ring-2 ring-white"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#131b2e]">Mme Aya Touré</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-[10px] font-bold">
                      Professeur Principal
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#464555]">Français • 3ème A</span>
                    <span className="text-[#777587]">•</span>
                    <span className="text-xs text-[#005338] flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005338]"></span> En ligne (réponse sous 24h)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                <a 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6ffbbe]/30 hover:bg-[#6ffbbe]/50 text-[#005236] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#6ffbbe]" 
                  href="https://wa.me/2250700000000" 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  title="Assistance permanente WhatsApp"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span className="hidden sm:inline">Permanence WhatsApp</span>
                </a>
                <button 
                  onClick={() => onNavigateTab('parent-timeline')}
                  className="p-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] transition-colors cursor-pointer border border-[#eaedff]" 
                  title="Prendre rendez-vous"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </button>
              </div>
            </div>

            {/* Student Context Chip Banner */}
            <div className="px-6 py-2 bg-[#f2f3ff]/70 border-b border-[#eaedff] flex items-center justify-between text-[#464555] text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">school</span>
                <span>Élève concernée : <strong className="text-[#131b2e]">{activeStudent.firstName} {activeStudent.lastName} ({activeStudent.class})</strong></span>
                <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#131b2e] font-semibold">Moyenne Français : 16.4 / 20</span>
              </div>
              <span className="text-[#777587] hidden sm:inline">Carnet de Correspondance Numérique</span>
            </div>

            {/* Scrollable Messages Flow */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-[#f2f3ff]/20 via-[#faf8ff] to-white">
              {/* Date Separator */}
              <div className="flex items-center justify-center my-2">
                <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#464555] text-[11px] font-bold uppercase tracking-wider">
                  Aujourd'hui • 10 Mars 2025
                </span>
              </div>

              {messages.map((msg) => {
                const isTeacher = msg.sender === 'teacher';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-end gap-3 max-w-xl ${isTeacher ? '' : 'justify-end ml-auto'}`}
                  >
                    {isTeacher && msg.avatar && (
                      <img 
                        className="w-8 h-8 rounded-full object-cover shrink-0 mb-1" 
                        src={msg.avatar} 
                        alt={msg.senderName} 
                      />
                    )}

                    <div className={`flex flex-col ${isTeacher ? '' : 'items-end'}`}>
                      <span className={`text-[11px] text-[#464555] mb-1 ${isTeacher ? 'ml-1' : 'mr-1'}`}>
                        {msg.senderName} • {msg.time}
                      </span>
                      <div className={`p-4 rounded-2xl shadow-xs text-xs sm:text-sm space-y-2 ${
                        isTeacher 
                          ? 'rounded-bl-xs bg-[#f2f3ff] text-[#131b2e] border border-[#eaedff]' 
                          : 'rounded-br-xs bg-[#3525cd] text-white'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                        {msg.note && (
                          <div className="pt-1 flex items-center gap-1.5 text-[#3525cd] text-xs font-semibold">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>{msg.note}</span>
                          </div>
                        )}
                        {msg.attachment && (
                          <div className="mt-3 p-2.5 rounded-xl bg-white flex items-center justify-between gap-3 shadow-2xs border border-[#eaedff] text-[#131b2e]">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">description</span>
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold truncate">{msg.attachment.name}</p>
                                <p className="text-[11px] text-[#464555]">{msg.attachment.size}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => onNavigateTab('parent-documents')}
                              className="shrink-0 p-1.5 rounded-lg text-[#3525cd] hover:bg-[#f2f3ff] transition-colors cursor-pointer" 
                              title="Télécharger"
                            >
                              <span className="material-symbols-outlined text-[20px]">download</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {!isTeacher && (
                        <div className="flex items-center gap-1 mt-1 mr-1 text-[#464555] text-[10px]">
                          <span>Distribué et lu</span>
                          <span className="material-symbols-outlined text-[#005338] text-[14px]">done_all</span>
                        </div>
                      )}
                    </div>

                    {!isTeacher && (
                      <div className="w-8 h-8 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-xs shrink-0 mb-1">
                        KK
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Response Chips */}
            <div className="px-6 pt-2 pb-1 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[#eaedff]">
              <span className="text-xs text-[#777587] font-semibold shrink-0">Suggestions :</span>
              <button 
                onClick={() => setInputText("Oui, priorité à la 2nde C (Sciences)")}
                className="shrink-0 px-3 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-medium transition-colors cursor-pointer border border-[#eaedff]"
              >
                Oui, priorité à la 2nde C (Sciences)
              </button>
              <button 
                onClick={() => setInputText("Bien noté pour 16h30, merci.")}
                className="shrink-0 px-3 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-medium transition-colors cursor-pointer border border-[#eaedff]"
              >
                Bien noté pour 16h30, merci
              </button>
              <button 
                onClick={() => setInputText("Awa sera-t-elle présente lors de cet échange ?")}
                className="shrink-0 px-3 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-medium transition-colors cursor-pointer border border-[#eaedff]"
              >
                Awa sera-t-elle présente ?
              </button>
            </div>

            {/* Message Input Toolbar & Textarea */}
            <div className="p-4 px-6 bg-white border-t border-[#eaedff]">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="space-y-3">
                <div className="relative bg-[#f2f3ff] rounded-2xl p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4f46e5]/30 transition-all border border-[#eaedff]">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent px-2 py-1 text-xs sm:text-sm text-[#131b2e] placeholder:text-[#777587] focus:outline-none resize-none" 
                    placeholder="Rédiger votre message officiel à Mme Aya Touré..." 
                    rows={2}
                  />
                  <div className="flex items-center justify-between pt-2 px-1 border-t border-[#eaedff]/60">
                    <div className="flex items-center gap-1">
                      <button 
                        type="button"
                        onClick={() => onNavigateTab('parent-documents')}
                        className="p-1.5 text-[#464555] hover:text-[#3525cd] rounded-lg hover:bg-[#eaedff] transition-colors cursor-pointer" 
                        title="Joindre un document ou devoir"
                      >
                        <span className="material-symbols-outlined text-[20px]">attach_file</span>
                      </button>
                      <button 
                        type="button"
                        className="p-1.5 text-[#464555] hover:text-[#3525cd] rounded-lg hover:bg-[#eaedff] transition-colors cursor-pointer" 
                        title="Joindre une photo justificative"
                      >
                        <span className="material-symbols-outlined text-[20px]">image</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setInputText(prev => prev + " 👍")}
                        className="p-1.5 text-[#464555] hover:text-[#3525cd] rounded-lg hover:bg-[#eaedff] transition-colors cursor-pointer" 
                        title="Insérer un émoji"
                      >
                        <span className="material-symbols-outlined text-[20px]">mood</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#777587] text-[11px] hidden md:inline">Entrée pour envoyer</span>
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-xl shadow-sm transition-all transform active:scale-95 cursor-pointer"
                      >
                        <span>Envoyer</span>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Legal & Privacy Disclaimer Footer */}
              <div className="flex items-center justify-center gap-2 mt-3 text-[#464555] text-[11px] text-center">
                <span className="material-symbols-outlined text-[14px] text-[#005338]">lock</span>
                <span>Les échanges via EduLiaison sont certifiés, confidentiels et archivés dans le respect du règlement de l'établissement scolaire.</span>
              </div>
            </div>
          </section>
        </div>

        {/* Supplementary Quick Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Card 1: Permanence & Contact */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#4f46e5]/10 text-[#3525cd] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">contact_phone</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#131b2e]">Permanence des Enseignants</h4>
              <p className="text-xs text-[#464555] mt-1">Horaires de réception : Mercredi de 14h à 17h sur rendez-vous pris 48h à l'avance.</p>
              <button 
                onClick={() => onNavigateTab('parent-timeline')}
                className="inline-flex items-center gap-1 mt-2 text-[#3525cd] text-xs font-bold hover:underline cursor-pointer"
              >
                <span>Consulter le planning des permanences</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>

          {/* Card 2: Urgences et Vie Scolaire */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#ffdad2] text-[#ae3115] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">emergency</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#131b2e]">Absence Imprévue ?</h4>
              <p className="text-xs text-[#464555] mt-1">Pour tout retard ou absence du jour même, prévenez directement la Vie Scolaire par signalement rapide.</p>
              <button 
                onClick={() => onNavigateTab('parent-attendance')}
                className="inline-flex items-center gap-1 mt-2 text-[#ae3115] text-xs font-bold hover:underline cursor-pointer"
              >
                <span>Signaler une absence express</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 3: Assistance Numérique EduLiaison */}
          <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#6ffbbe]/30 text-[#005338] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#131b2e]">Support & WhatsApp École</h4>
              <p className="text-xs text-[#464555] mt-1">Un doute sur l'utilisation du carnet numérique ? Les secrétaires vous répondent par message.</p>
              <a 
                className="inline-flex items-center gap-1 mt-2 text-[#005338] text-xs font-bold hover:underline cursor-pointer" 
                href="https://wa.me/2250700000000" 
                rel="noopener noreferrer" 
                target="_blank"
              >
                <span>Ouvrir l'assistance WhatsApp</span>
                <span className="material-symbols-outlined text-[14px]">chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
