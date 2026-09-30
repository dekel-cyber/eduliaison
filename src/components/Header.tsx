import React, { useState, useRef, useEffect } from 'react';
import { UserRole, Student } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (studentId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  userName?: string;
  userEmail?: string;
}

interface NavDropdownItem {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  badge?: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: string;
  isDirect?: boolean;
  directTabId?: string;
  children?: NavDropdownItem[];
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeStudent,
  allStudents,
  onSelectStudent,
  activeTab,
  setActiveTab,
  onOpenAuth,
  userName
}) => {
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close open dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
        setShowStudentDropdown(false);
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build grouped navigation structure per role
  const getNavGroups = (): NavGroup[] => {
    if (currentRole === 'parent') {
      return [
        {
          id: 'parent-home',
          label: 'Tableau de bord',
          icon: 'space_dashboard',
          isDirect: true,
          directTabId: 'parent-dashboard'
        },
        {
          id: 'parent-schooling-group',
          label: 'Scolarité & Résultats',
          icon: 'school',
          children: [
            {
              id: 'parent-grades',
              label: 'Notes & Bulletins',
              subtitle: 'Moyennes T2, relevés et classements',
              icon: 'grading',
              badge: 'T2 actif'
            },
            {
              id: 'parent-attendance',
              label: 'Absences & Retards',
              subtitle: 'Assiduité, justificatifs et contact CPE',
              icon: 'event_available'
            },
            {
              id: 'parent-timeline',
              label: 'Timeline & Événements',
              subtitle: 'Fil d’actualité scolaire et devoirs',
              icon: 'history_edu'
            }
          ]
        },
        {
          id: 'parent-comm-group',
          label: 'Liaison & Documents',
          icon: 'forum',
          children: [
            {
              id: 'parent-messaging',
              label: 'Messagerie École',
              subtitle: 'Échanges avec les professeurs et l’administration',
              icon: 'chat',
              badge: 'Direct'
            },
            {
              id: 'parent-documents',
              label: 'Documents & Circulaires',
              subtitle: 'Certificats de scolarité, règlements et reçus',
              icon: 'folder_shared'
            }
          ]
        }
      ];
    } else if (currentRole === 'enseignant') {
      return [
        {
          id: 'teacher-home',
          label: 'Tableau de bord',
          icon: 'space_dashboard',
          isDirect: true,
          directTabId: 'teacher-dashboard'
        },
        {
          id: 'teacher-pedagogy-group',
          label: 'Pédagogie & Cours',
          icon: 'menu_book',
          children: [
            {
              id: 'teacher-schedule',
              label: 'Cahier de Textes & Planning',
              subtitle: 'Emploi du temps, séquences et visa direction',
              icon: 'calendar_month'
            },
            {
              id: 'teacher-subjects',
              label: 'Matières & Programmes',
              subtitle: 'Progression MENA, fiches et banque de devoirs',
              icon: 'auto_stories'
            }
          ]
        },
        {
          id: 'teacher-eval-group',
          label: 'Évaluations & Familles',
          icon: 'how_to_reg',
          children: [
            {
              id: 'teacher-gradebook',
              label: 'Notes & Bulletins',
              subtitle: 'Saisie des notes, coefficients et conseils',
              icon: 'grading'
            },
            {
              id: 'teacher-liaison',
              label: 'Carnet de Liaison',
              subtitle: 'Observations de conduite et suivi des signatures',
              icon: 'edit_note',
              badge: 'À jour'
            }
          ]
        }
      ];
    } else {
      // Direction / Admin
      return [
        {
          id: 'admin-home',
          label: 'Direction Décisionnelle',
          icon: 'admin_panel_settings',
          isDirect: true,
          directTabId: 'admin-dashboard'
        },
        {
          id: 'admin-pedagogy-group',
          label: 'Suivi Pédagogique',
          icon: 'school',
          children: [
            {
              id: 'teacher-schedule',
              label: 'Cahier de Textes Établissement',
              subtitle: 'Supervision des séances et visas MENA',
              icon: 'calendar_month'
            },
            {
              id: 'parent-grades',
              label: 'Bulletins & Performances',
              subtitle: 'Analyses globales, moyennes et conseils',
              icon: 'analytics'
            }
          ]
        },
        {
          id: 'admin-life-group',
          label: 'Vie Scolaire & Liaisons',
          icon: 'supervisor_account',
          children: [
            {
              id: 'parent-attendance',
              label: 'Assiduité Globale & Absences',
              subtitle: 'Suivi du taux de présence et bilans CPE',
              icon: 'event_available'
            },
            {
              id: 'teacher-liaison',
              label: 'Carnet de Liaison Familles',
              subtitle: 'Supervision des correspondances officielles',
              icon: 'forum'
            }
          ]
        }
      ];
    }
  };

  const navGroups = getNavGroups();

  return (
    <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/95 backdrop-blur-xl shadow-xs border-b border-[#eaedff]">
      <div className="h-16 w-full px-4 sm:px-8 flex items-center justify-between gap-3" ref={navRef}>
        {/* Left: Brand Logo & Contextual Sibling Selector */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#ff6b4a] flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-[#131b2e] leading-tight tracking-tight flex items-center">
                Edu<span className="text-[#3525cd]">Liaison</span>
              </span>
              <span className="text-[9px] font-bold text-[#777587] tracking-wider uppercase leading-none hidden sm:inline">
                Carnet Scolaire Numérique
              </span>
            </div>
          </button>

          {/* Sibling / Student Selector for Parent Role */}
          {currentRole === 'parent' && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowStudentDropdown(!showStudentDropdown);
                  setOpenDropdownId(null);
                }}
                className="flex items-center gap-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] rounded-xl px-3 py-1.5 transition-colors cursor-pointer text-left border border-[#dae2fd]/70 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">school</span>
                <span className="font-bold text-xs text-[#131b2e] max-w-[130px] sm:max-w-[180px] truncate">
                  {activeStudent.firstName} ({activeStudent.class})
                </span>
                <span className={`material-symbols-outlined text-[#777587] text-[16px] transition-transform duration-150 ${showStudentDropdown ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {showStudentDropdown && (
                <div 
                  className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setShowStudentDropdown(false)}
                >
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Changer d'élève suivi
                  </div>
                  {allStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => onSelectStudent(student.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        activeStudent.id === student.id 
                          ? 'bg-indigo-50 text-indigo-700 font-bold' 
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${student.id === 'awa' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{student.firstName} {student.lastName} ({student.class})</span>
                      </div>
                      {activeStudent.id === student.id && (
                        <span className="material-symbols-outlined text-[16px] text-indigo-600">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role badge tags */}
          {currentRole === 'enseignant' && (
            <div className="hidden md:flex items-center gap-1.5 bg-[#f2f3ff] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 border border-[#dae2fd]/70">
              <span className="material-symbols-outlined text-[#3525cd] text-[17px]">badge</span>
              <span>PP 3ème A • Français</span>
            </div>
          )}
          {currentRole === 'direction' && (
            <div className="hidden md:flex items-center gap-1.5 bg-[#f2f3ff] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 border border-[#dae2fd]/70">
              <span className="material-symbols-outlined text-[#3525cd] text-[17px]">domain</span>
              <span>Direction • GS Excellence</span>
            </div>
          )}
        </div>

        {/* Center: Streamlined Dropdown Navigation Hub */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-[#f2f3ff]/80 p-1.5 rounded-2xl border border-[#dae2fd]/60">
          {navGroups.map((group) => {
            if (group.isDirect && group.directTabId) {
              const isActive = activeTab === group.directTabId;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveTab(group.directTabId!);
                    setOpenDropdownId(null);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{group.icon}</span>
                  <span>{group.label}</span>
                </button>
              );
            }

            // Group with Dropdown
            const isChildActive = group.children?.some(c => c.id === activeTab);
            const isOpen = openDropdownId === group.id;

            return (
              <div key={group.id} className="relative">
                <button
                  onClick={() => setOpenDropdownId(isOpen ? null : group.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isChildActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : isOpen
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-indigo-600">{group.icon}</span>
                  <span>{group.label}</span>
                  <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}>
                    expand_more
                  </span>
                </button>

                {/* Dropdown Menu Overlay */}
                {isOpen && group.children && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>{group.label}</span>
                      <span className="material-symbols-outlined text-xs">tune</span>
                    </div>

                    {group.children.map((child) => {
                      const isItemActive = activeTab === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveTab(child.id);
                            setOpenDropdownId(null);
                          }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isItemActive
                              ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-100'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isItemActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className="material-symbols-outlined text-[18px]">{child.icon}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 truncate">{child.label}</span>
                              {child.badge && (
                                <span className="px-1.5 py-0.2 text-[9px] font-black rounded-md bg-indigo-100 text-indigo-700">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 leading-tight mt-0.5">
                              {child.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Role Switcher, Notification & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setOpenDropdownId(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100/70 text-indigo-900 text-xs font-bold hover:bg-indigo-200 transition-colors cursor-pointer border border-indigo-200 shadow-2xs"
              title="Changer de vue (Mode Démo)"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-700">swap_horiz</span>
              <span className="capitalize">{currentRole}</span>
              <span className={`material-symbols-outlined text-[14px] text-indigo-600 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {showRoleDropdown && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowRoleDropdown(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Changer de vue (Mode Démo)
                </div>
                <button
                  onClick={() => { setCurrentRole('parent'); setActiveTab('parent-dashboard'); }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${currentRole === 'parent' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-800'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                  <span>Espace Parent (M. Kouamé)</span>
                </button>
                <button
                  onClick={() => { setCurrentRole('enseignant'); setActiveTab('teacher-dashboard'); }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${currentRole === 'enseignant' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-800'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  <span>Espace Enseignant (Mme Touré)</span>
                </button>
                <button
                  onClick={() => { setCurrentRole('direction'); setActiveTab('admin-dashboard'); }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${currentRole === 'direction' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-800'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span>Espace Direction (Proviseur)</span>
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-left text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  <span>Accueil & Présentation</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <button 
            aria-label="Notifications" 
            onClick={() => {
              if (currentRole === 'parent') setActiveTab('parent-timeline');
              else if (currentRole === 'enseignant') setActiveTab('teacher-dashboard');
              else setActiveTab('admin-dashboard');
            }}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2">
            {userName && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">{userName}</span>
                <span className="text-[10px] text-slate-500 capitalize">{currentRole}</span>
              </div>
            )}
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
              title="Déconnexion"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                <span className="material-symbols-outlined text-[13px]">person</span>
              </div>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="xl:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-800 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {showMobileMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation: Grouped & Structured */}
      {showMobileMenu && (
        <div className="xl:hidden bg-white border-b border-slate-200 p-4 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto space-y-4">
          {navGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-indigo-600">{group.icon}</span>
                <span>{group.label}</span>
              </div>

              {group.isDirect && group.directTabId ? (
                <button
                  onClick={() => {
                    setActiveTab(group.directTabId!);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === group.directTabId
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Vue d'ensemble</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                group.children?.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      setActiveTab(child.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      activeTab === child.id
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-slate-500">{child.icon}</span>
                      <span>{child.label}</span>
                    </div>
                    {child.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-indigo-100 text-indigo-700 font-bold">
                        {child.badge}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
