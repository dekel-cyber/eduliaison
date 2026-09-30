import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, testFirestoreConnection } from './firebase/config';
import { seedInitialDataIfEmpty } from './firebase/firestoreService';
import { 
  getUserProfile, 
  logoutUser, 
  loadPersistentSession, 
  savePersistentSession, 
  clearPersistentSession 
} from './firebase/authService';
import { UserRole, Student } from './types';
import { STUDENTS_DATA } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { MobileBottomNav } from './components/MobileBottomNav';

// Parent Views
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentTimeline } from './components/parent/ParentTimeline';
import { ParentGrades } from './components/parent/ParentGrades';
import { ParentAttendance } from './components/parent/ParentAttendance';
import { ParentDocuments } from './components/parent/ParentDocuments';
import { ParentMessaging } from './components/parent/ParentMessaging';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherScheduleLogbook } from './components/teacher/TeacherScheduleLogbook';
import { TeacherGradebook } from './components/teacher/TeacherGradebook';
import { TeacherSubjects } from './components/teacher/TeacherSubjects';
import { TeacherLiaisonBook } from './components/teacher/TeacherLiaisonBook';

// Admin / Direction Views
import { AdminDashboard } from './components/admin/AdminDashboard';

function getDefaultDashboardForRole(role: UserRole): string {
  if (role === 'parent') return 'parent-dashboard';
  if (role === 'enseignant') return 'teacher-dashboard';
  if (role === 'direction') return 'admin-dashboard';
  return 'parent-dashboard';
}

export default function App() {
  // Load persistent session on initial mount
  const initialSession = loadPersistentSession();

  // Check if user is navigating directly from a password reset email link
  const isResetUrl = typeof window !== 'undefined' && (() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('reset') === 'true' || p.get('mode') === 'reset' || p.has('resetCode') || (p.has('email') && !initialSession.isAuthenticated);
    } catch {
      return false;
    }
  })();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isResetUrl ? false : initialSession.isAuthenticated);
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(isResetUrl ? null : initialSession.user);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialSession.role);
  const [activeTab, setActiveTab] = useState<string>(isResetUrl ? 'auth' : initialSession.tab);
  const [students, setStudents] = useState<Student[]>(STUDENTS_DATA);
  const [activeStudentId, setActiveStudentId] = useState<string>('awa');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('parent');

  useEffect(() => {
    // If URL has reset parameter, always force auth page
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('reset') === 'true' || p.get('mode') === 'reset' || p.has('resetCode') || p.has('email')) {
        setActiveTab('auth');
        setAuthMode('login');
      }
    }

    const initApp = async () => {
      try {
        await testFirestoreConnection();
        await seedInitialDataIfEmpty();
      } catch (err) {
        console.warn('Firestore bootstrap notice:', err);
      }
    };
    initApp();

    // Listen for Firebase Auth state changes and enforce persistent session synchronization
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          const name = profile?.name || user.displayName || user.email?.split('@')[0] || 'Utilisateur';
          const role = profile?.role || initialSession.role || 'parent';
          
          setIsAuthenticated(true);
          setCurrentUser({ name, email: user.email || undefined });
          setCurrentRole(role);

          setActiveTab(prevTab => {
            // If the user was on landing or auth screen, redirect directly to their role dashboard
            let nextTab = prevTab;
            if (prevTab === 'landing' || prevTab === 'auth') {
              nextTab = getDefaultDashboardForRole(role);
            }
            savePersistentSession(role, { name, email: user.email || undefined }, nextTab);
            return nextTab;
          });
        } catch (e) {
          console.warn('Error reading profile on auth state change:', e);
        }
      } else {
        // If there's no active Firebase user and no saved local authentication
        if (!localStorage.getItem('eduliaison_is_authenticated')) {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  const handleSelectStudent = (studentId: string) => {
    setActiveStudentId(studentId);
  };

  // Open Auth Page
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login', targetRole: UserRole = 'parent') => {
    setAuthMode(mode);
    setAuthTargetRole(targetRole);
    setActiveTab('auth');
  };

  // Login / Inscription Success with immediate persistent storage
  const handleAuthSuccess = (role: UserRole, userDetails?: { name?: string; email?: string }) => {
    const destinationTab = getDefaultDashboardForRole(role);
    setIsAuthenticated(true);
    setCurrentRole(role);
    if (userDetails) {
      setCurrentUser(userDetails);
    }
    setActiveTab(destinationTab);
    savePersistentSession(role, userDetails, destinationTab);
  };

  // Logout back to landing page with session cleanup
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    clearPersistentSession();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('landing');
  };

  // Navigation tab switcher with persistent tracking
  const handleNavigateTab = (tab: string) => {
    if (tab === 'landing') {
      setActiveTab('landing');
      return;
    }
    if (!isAuthenticated && tab !== 'auth') {
      // If not authenticated, redirect to login
      handleOpenAuth('login');
      return;
    }
    setActiveTab(tab);
    if (isAuthenticated && tab !== 'auth') {
      savePersistentSession(currentRole, currentUser || undefined, tab);
    }
  };

  // Handle Role Switch in Header (Demo & multi-role support)
  const handleRoleChange = (role: UserRole) => {
    const newTab = getDefaultDashboardForRole(role);
    setCurrentRole(role);
    setActiveTab(newTab);
    if (isAuthenticated) {
      savePersistentSession(role, currentUser || undefined, newTab);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#c3c0ff] selection:text-[#0f0069]">
      {/* Authenticated Global Header (Visible when logged in and not on auth/landing) */}
      {isAuthenticated && activeTab !== 'auth' && activeTab !== 'landing' && (
        <Header
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          activeStudent={activeStudent}
          allStudents={students}
          onSelectStudent={handleSelectStudent}
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
          onOpenAuth={handleLogout}
          userName={currentUser?.name}
          userEmail={currentUser?.email}
        />
      )}

      {/* Main Content View Container */}
      <main className={`flex-1 flex flex-col ${isAuthenticated && activeTab !== 'landing' && activeTab !== 'auth' ? 'pt-16 pb-16 xl:pb-0' : ''}`}>
        {/* 1. Landing Page (Default initial landing when not logged in) */}
        {activeTab === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            isAuthenticated={isAuthenticated}
            currentRole={currentRole}
            userName={currentUser?.name}
            onGoToDashboard={(tab) => {
              const target = tab || getDefaultDashboardForRole(currentRole);
              setActiveTab(target);
            }}
          />
        )}

        {/* 2. Authentication Page (Login / Register) */}
        {activeTab === 'auth' && (
          <AuthPage
            initialMode={authMode}
            onLoginSuccess={handleAuthSuccess}
            onCancel={() => {
              if (isAuthenticated) {
                setActiveTab(getDefaultDashboardForRole(currentRole));
              } else {
                setActiveTab('landing');
              }
            }}
          />
        )}

        {/* 3. Protected Parent Portal Views */}
        {isAuthenticated && activeTab === 'parent-dashboard' && (
          <ParentDashboard
            activeStudent={activeStudent}
            allStudents={students}
            onSelectStudent={handleSelectStudent}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {isAuthenticated && activeTab === 'parent-timeline' && (
          <ParentTimeline
            activeStudent={activeStudent}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {isAuthenticated && activeTab === 'parent-grades' && (
          <ParentGrades
            activeStudent={activeStudent}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {isAuthenticated && activeTab === 'parent-attendance' && (
          <ParentAttendance
            activeStudent={activeStudent}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {isAuthenticated && activeTab === 'parent-documents' && (
          <ParentDocuments
            activeStudent={activeStudent}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {isAuthenticated && activeTab === 'parent-messaging' && (
          <ParentMessaging
            activeStudent={activeStudent}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {/* 4. Protected Teacher Portal Views */}
        {isAuthenticated && activeTab === 'teacher-dashboard' && (
          <TeacherDashboard
            onNavigateTab={handleNavigateTab}
          />
        )}

        {isAuthenticated && activeTab === 'teacher-schedule' && (
          <TeacherScheduleLogbook />
        )}

        {isAuthenticated && activeTab === 'teacher-gradebook' && (
          <TeacherGradebook />
        )}

        {isAuthenticated && activeTab === 'teacher-subjects' && (
          <TeacherSubjects />
        )}

        {isAuthenticated && activeTab === 'teacher-liaison' && (
          <TeacherLiaisonBook />
        )}

        {/* 5. Protected Admin & Direction Portal Views */}
        {isAuthenticated && activeTab === 'admin-dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Mobile Bottom Navigation for Quick Access */}
      {isAuthenticated && activeTab !== 'landing' && activeTab !== 'auth' && (
        <MobileBottomNav
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
        />
      )}

      {/* Global Footer (Visible on landing and main pages) */}
      {(activeTab === 'landing' || activeTab === 'auth') && <Footer />}
    </div>
  );
}
