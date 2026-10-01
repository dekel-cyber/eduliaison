import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, testFirestoreConnection } from './firebase/config';
import { seedInitialDataIfEmpty, subscribeToStudents, subscribeToUsers } from './firebase/firestoreService';
import { 
  getUserProfile, 
  logoutUser, 
  loadPersistentSession, 
  savePersistentSession, 
  clearPersistentSession,
  UserProfile 
} from './firebase/authService';
import { UserRole, Student, UserAccount } from './types';
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
import { TeacherMessaging } from './components/teacher/TeacherMessaging';

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
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialSession.role);
  const [activeTab, setActiveTab] = useState<string>(isResetUrl ? 'auth' : initialSession.tab);
  
  // Real-time Firestore master state
  const [students, setStudents] = useState<Student[]>(STUDENTS_DATA);
  const [users, setUsers] = useState<UserAccount[]>([]);
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

    // Subscribe to live students & users from Firestore
    const unsubStudents = subscribeToStudents((data) => setStudents(data));
    const unsubUsers = subscribeToUsers((data) => setUsers(data));

    // Listen for Firebase Auth state changes and enforce persistent session synchronization
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setCurrentUserProfile(profile);
          }
          const name = profile?.name || user.displayName || user.email?.split('@')[0] || 'Utilisateur';
          const role = profile?.role || initialSession.role || 'parent';
          
          setIsAuthenticated(true);
          setCurrentUser({ name, email: user.email || undefined });
          setCurrentRole(role);

          setActiveTab(prevTab => {
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
        if (!localStorage.getItem('eduliaison_is_authenticated')) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setCurrentUserProfile(null);
        }
      }
    });

    return () => {
      unsubStudents();
      unsubUsers();
      unsubscribeAuth();
    };
  }, []);

  // Compute children of the authenticated Parent
  const parentStudents = useMemo(() => {
    if (currentRole !== 'parent') return students;
    const userEmail = currentUser?.email?.toLowerCase().trim();
    const userUid = auth.currentUser?.uid || currentUserProfile?.uid;

    const matched = students.filter(s => {
      const matchesUid = userUid && s.parentId === userUid;
      const matchesEmail = userEmail && s.parentEmail && s.parentEmail.toLowerCase().trim() === userEmail;
      const matchesChildrenList = currentUserProfile && (currentUserProfile as any).childrenIds?.includes(s.id);
      return matchesUid || matchesEmail || matchesChildrenList;
    });

    if (matched.length > 0) return matched;
    return students;
  }, [students, currentRole, currentUser, currentUserProfile]);

  // Keep activeStudentId valid
  useEffect(() => {
    if (currentRole === 'parent' && parentStudents.length > 0) {
      if (!parentStudents.some(s => s.id === activeStudentId)) {
        setActiveStudentId(parentStudents[0].id);
      }
    }
  }, [parentStudents, currentRole, activeStudentId]);

  const displayedStudents = currentRole === 'parent' ? parentStudents : students;
  const activeStudent = displayedStudents.find(s => s.id === activeStudentId) || displayedStudents[0] || students[0];

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
    setCurrentUserProfile(null);
    setActiveTab('landing');
  };

  // Navigation tab switcher with persistent tracking
  const handleNavigateTab = (tab: string) => {
    if (tab === 'landing') {
      setActiveTab('landing');
      return;
    }
    if (!isAuthenticated && tab !== 'auth') {
      handleOpenAuth('login');
      return;
    }
    setActiveTab(tab);
    if (isAuthenticated && tab !== 'auth') {
      savePersistentSession(currentRole, currentUser || undefined, tab);
    }
  };

  // Handle Role Switch in Header
  const handleRoleChange = (role: UserRole) => {
    const newTab = getDefaultDashboardForRole(role);
    setCurrentRole(role);
    setActiveTab(newTab);
    if (isAuthenticated) {
      savePersistentSession(role, currentUser || undefined, newTab);
    }
  };

  // Current Teacher Profile if logged in as teacher
  const currentTeacherAccount = users.find(u => u.email?.toLowerCase() === currentUser?.email?.toLowerCase() || u.uid === auth.currentUser?.uid);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#c3c0ff] selection:text-[#0f0069]">
      {/* Authenticated Global Header */}
      {isAuthenticated && activeTab !== 'auth' && activeTab !== 'landing' && (
        <Header
          currentRole={currentRole}
          setCurrentRole={handleRoleChange}
          activeStudent={activeStudent}
          allStudents={displayedStudents}
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
        {/* 1. Landing Page */}
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

        {/* 2. Authentication Page */}
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
            allStudents={displayedStudents}
            onSelectStudent={handleSelectStudent}
            onNavigateTab={handleNavigateTab}
            userName={currentUser?.name}
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
            userName={currentUser?.name}
          />
        )}

        {/* 4. Protected Teacher Portal Views */}
        {isAuthenticated && activeTab === 'teacher-dashboard' && (
          <TeacherDashboard
            onNavigateTab={handleNavigateTab}
            userName={currentUser?.name}
            currentTeacher={currentTeacherAccount || {
              name: currentUser?.name || 'Professeur',
              email: currentUser?.email,
              assignedClasses: ['3ème A', '3ème B'],
              subjects: ['Français & Littérature']
            }}
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

        {isAuthenticated && activeTab === 'teacher-messaging' && (
          <TeacherMessaging
            onNavigateTab={handleNavigateTab}
            userName={currentUser?.name}
            currentTeacher={currentTeacherAccount || {
              name: currentUser?.name || 'Professeur',
              email: currentUser?.email,
              assignedClasses: ['3ème A', '3ème B'],
              subjects: ['Français & Littérature']
            }}
          />
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

      {/* Global Footer */}
      {(activeTab === 'landing' || activeTab === 'auth') && <Footer />}
    </div>
  );
}
