import React from 'react';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  activeTab,
  setActiveTab
}) => {
  if (activeTab === 'landing' || activeTab === 'auth') return null;

  const getItems = () => {
    if (currentRole === 'parent') {
      return [
        { id: 'parent-dashboard', label: 'Carnet', icon: 'menu_book' },
        { id: 'parent-grades', label: 'Notes', icon: 'grade' },
        { id: 'parent-attendance', label: 'Présences', icon: 'event_available' },
        { id: 'parent-messaging', label: 'Messages', icon: 'forum' },
        { id: 'parent-documents', label: 'Scolarité', icon: 'account_balance_wallet' }
      ];
    } else if (currentRole === 'enseignant') {
      return [
        { id: 'teacher-dashboard', label: 'Accueil', icon: 'dashboard' },
        { id: 'teacher-gradebook', label: 'Notes', icon: 'fact_check' },
        { id: 'teacher-schedule', label: 'Cahier', icon: 'menu_book' },
        { id: 'teacher-messaging', label: 'Messages', icon: 'forum' },
        { id: 'teacher-liaison', label: 'Liaison', icon: 'edit_note' }
      ];
    } else {
      return [
        { id: 'admin-dashboard', label: 'Direction', icon: 'admin_panel_settings' },
        { id: 'parent-grades', label: 'Notes', icon: 'school' },
        { id: 'parent-attendance', label: 'Présences', icon: 'event_available' },
        { id: 'teacher-liaison', label: 'Liaison', icon: 'forum' },
        { id: 'parent-documents', label: 'Scolarité', icon: 'payments' }
      ];
    }
  };

  const items = getItems();

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#faf8ff]/90 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-2px_12px_rgba(79,70,229,0.06)] pb-safe">
      <div className="flex justify-around items-center h-16 px-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] flex-1 py-1 transition-all cursor-pointer ${
                isActive ? 'text-[#3525cd] font-bold' : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'scale-110 font-bold' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] text-center mt-0.5 leading-none truncate w-full px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
