import React, { useState, useEffect } from 'react';
import { 
  Student, 
  SchoolClass, 
  UserAccount, 
  UserRole, 
  ActivityLog 
} from '../../types';
import { 
  subscribeToStudents, 
  subscribeToClasses, 
  subscribeToUsers, 
  subscribeToActivityLogs,
  createStudentInFirestore,
  updateStudentInFirestore,
  deleteStudentInFirestore,
  createClassInFirestore,
  updateClassInFirestore,
  deleteClassInFirestore,
  updateUserRoleInFirestore,
  updateTeacherAssignments,
  associateParentToStudentInFirestore,
  associateStudentToClassInFirestore,
  createCircularInFirestore
} from '../../firebase/firestoreService';

export const AdminDashboard: React.FC = () => {
  // Live Data Subscriptions
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'eleves' | 'classes' | 'profs' | 'comptes' | 'associations' | 'activites'>('eleves');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Modals
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState<SchoolClass | null>(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserAccount | null>(null);

  const [showTeacherAssignmentModal, setShowTeacherAssignmentModal] = useState(false);
  const [selectedTeacherForAssignment, setSelectedTeacherForAssignment] = useState<UserAccount | null>(null);

  const [showAssociateParentModal, setShowAssociateParentModal] = useState(false);
  const [selectedStudentForParentAssoc, setSelectedStudentForParentAssoc] = useState<Student | null>(null);

  const [showCircularModal, setShowCircularModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form States - Student
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    class: '3ème A',
    level: '3ème',
    gender: 'M' as 'M' | 'F',
    birthDate: '2010-04-15',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    generalAverage: 14.5,
    status: 'En règle' as 'En règle' | 'À régulariser'
  });

  // Form States - Class
  const [classForm, setClassForm] = useState({
    name: '',
    level: '3ème (Collège)',
    room: 'Salle 101',
    academicYear: '2025-2026',
    mainTeacherName: '',
    studentCount: 40
  });

  // Form States - Role & Teacher
  const [roleForm, setRoleForm] = useState<{ role: UserRole; status: 'Actif' | 'En attente' | 'Suspendu' }>({
    role: 'parent',
    status: 'Actif'
  });
  const [selectedTeacherClasses, setSelectedTeacherClasses] = useState<string[]>([]);
  const [selectedTeacherSubjects, setSelectedTeacherSubjects] = useState<string[]>([]);
  const [selectedParentIdForAssoc, setSelectedParentIdForAssoc] = useState<string>('');

  // Form States - Circular & Alert
  const [emergencyText, setEmergencyText] = useState('');
  const [circularData, setCircularData] = useState({ title: '', target: 'all', message: '', urgent: false });

  // Subscribe to real Firestore database
  useEffect(() => {
    const unsubStudents = subscribeToStudents((data) => {
      setStudents(data);
      setLoading(false);
    });

    const unsubClasses = subscribeToClasses((data) => {
      setClasses(data);
    });

    const unsubUsers = subscribeToUsers((data) => {
      setUsers(data);
    });

    const unsubLogs = subscribeToActivityLogs((data) => {
      setActivityLogs(data);
    });

    return () => {
      unsubStudents();
      unsubClasses();
      unsubUsers();
      unsubLogs();
    };
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // KPI Calculations
  const totalStudentsCount = students.length;
  const totalClassesCount = classes.length;
  const totalTeachersCount = users.filter(u => u.role === 'enseignant').length;
  const totalParentsCount = users.filter(u => u.role === 'parent').length;
  const pendingUsersCount = users.filter(u => u.role === 'user' || u.status === 'En attente').length;

  // Handler: Create Student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createStudentInFirestore({
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        matricule: studentForm.matricule || `MAT-2026-${Math.floor(100 + Math.random() * 900)}`,
        class: studentForm.class,
        level: studentForm.level,
        gender: studentForm.gender,
        birthDate: studentForm.birthDate,
        parentName: studentForm.parentName,
        parentEmail: studentForm.parentEmail,
        parentPhone: studentForm.parentPhone,
        generalAverage: Number(studentForm.generalAverage) || 14.0,
        status: studentForm.status
      });

      setShowCreateStudentModal(false);
      setStudentForm({
        firstName: '',
        lastName: '',
        matricule: '',
        class: '3ème A',
        level: '3ème',
        gender: 'M',
        birthDate: '2010-04-15',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        generalAverage: 14.5,
        status: 'En règle'
      });
      showToast(`Élève ${created.firstName} ${created.lastName} enregistré avec succès dans la base de données !`);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la création de l\'élève', 'error');
    }
  };

  // Handler: Update Student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEdit) return;

    try {
      await updateStudentInFirestore(selectedStudentForEdit.id, {
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        matricule: studentForm.matricule,
        class: studentForm.class,
        level: studentForm.level,
        gender: studentForm.gender,
        birthDate: studentForm.birthDate,
        parentName: studentForm.parentName,
        parentEmail: studentForm.parentEmail,
        parentPhone: studentForm.parentPhone,
        generalAverage: Number(studentForm.generalAverage),
        status: studentForm.status
      });

      setShowEditStudentModal(false);
      setSelectedStudentForEdit(null);
      showToast(`Fiche de l'élève mise à jour avec succès.`);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la modification', 'error');
    }
  };

  // Handler: Delete Student
  const handleDeleteStudent = async (student: Student) => {
    if (window.confirm(`Confirmez-vous la suppression / radiation de l'élève ${student.firstName} ${student.lastName} (${student.matricule}) ?`)) {
      try {
        await deleteStudentInFirestore(student.id, `${student.firstName} ${student.lastName}`);
        showToast(`Élève ${student.firstName} ${student.lastName} retiré du registre.`);
      } catch (err: any) {
        showToast(err.message || 'Erreur de suppression', 'error');
      }
    }
  };

  // Handler: Create Class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCls = await createClassInFirestore({
        name: classForm.name,
        level: classForm.level,
        room: classForm.room,
        academicYear: classForm.academicYear,
        mainTeacherName: classForm.mainTeacherName || 'À assigner',
        studentCount: Number(classForm.studentCount) || 0
      });

      setShowCreateClassModal(false);
      setClassForm({
        name: '',
        level: '3ème (Collège)',
        room: 'Salle 101',
        academicYear: '2025-2026',
        mainTeacherName: '',
        studentCount: 40
      });
      showToast(`Classe ${newCls.name} créée avec succès.`);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la création de la classe', 'error');
    }
  };

  // Handler: Update Class
  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForEdit) return;

    try {
      await updateClassInFirestore(selectedClassForEdit.id, {
        name: classForm.name,
        level: classForm.level,
        room: classForm.room,
        academicYear: classForm.academicYear,
        mainTeacherName: classForm.mainTeacherName,
        studentCount: Number(classForm.studentCount)
      });

      setShowEditClassModal(false);
      setSelectedClassForEdit(null);
      showToast(`Classe ${classForm.name} mise à jour.`);
    } catch (err: any) {
      showToast(err.message || 'Erreur de mise à jour', 'error');
    }
  };

  // Handler: Delete Class
  const handleDeleteClass = async (cls: SchoolClass) => {
    if (window.confirm(`Confirmez-vous la fermeture / suppression de la classe ${cls.name} ?`)) {
      try {
        await deleteClassInFirestore(cls.id, cls.name);
        showToast(`Classe ${cls.name} archivée/supprimée.`);
      } catch (err: any) {
        showToast(err.message || 'Erreur de suppression', 'error');
      }
    }
  };

  // Handler: Change Role of User
  const handleSaveUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRole) return;

    try {
      await updateUserRoleInFirestore(
        selectedUserForRole.uid, 
        roleForm.role, 
        roleForm.status,
        selectedUserForRole.name || selectedUserForRole.email
      );

      setShowRoleModal(false);
      setSelectedUserForRole(null);
      showToast(`Rôle ${roleForm.role.toUpperCase()} attribué au compte ${selectedUserForRole.email}.`);
    } catch (err: any) {
      showToast(err.message || 'Erreur d\'attribution de rôle', 'error');
    }
  };

  // Handler: Assign Teacher to Classes & Subjects
  const handleSaveTeacherAssignments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForAssignment) return;

    try {
      await updateTeacherAssignments(
        selectedTeacherForAssignment.uid,
        selectedTeacherClasses,
        selectedTeacherSubjects,
        selectedTeacherForAssignment.name
      );

      setShowTeacherAssignmentModal(false);
      setSelectedTeacherForAssignment(null);
      showToast(`Affectations mises à jour pour ${selectedTeacherForAssignment.name}.`);
    } catch (err: any) {
      showToast(err.message || 'Erreur d\'affectation', 'error');
    }
  };

  // Handler: Associate Parent to Student
  const handleAssociateParentToStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForParentAssoc || !selectedParentIdForAssoc) return;

    const parentAccount = users.find(u => u.uid === selectedParentIdForAssoc);
    if (!parentAccount) {
      showToast('Compte parent introuvable', 'error');
      return;
    }

    try {
      await associateParentToStudentInFirestore(selectedStudentForParentAssoc.id, {
        uid: parentAccount.uid,
        name: parentAccount.name || `${parentAccount.firstName || ''} ${parentAccount.lastName || ''}`.trim() || parentAccount.email,
        email: parentAccount.email,
        phone: parentAccount.phone
      });

      setShowAssociateParentModal(false);
      setSelectedStudentForParentAssoc(null);
      setSelectedParentIdForAssoc('');
      showToast(`Parent ${parentAccount.name || parentAccount.email} associé à l'élève ${selectedStudentForParentAssoc.firstName} ${selectedStudentForParentAssoc.lastName} !`);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l\'association', 'error');
    }
  };

  // Handler: Broadcast Emergency Alert
  const handleEmergencyAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCircularInFirestore({
        title: '🚨 ALERTE URGENCE ÉTABLISSEMENT',
        target: 'all',
        message: emergencyText,
        urgent: true,
        author: 'Direction Générale'
      });

      setShowEmergencyModal(false);
      setEmergencyText('');
      showToast('Alerte d\'urgence SMS & Push diffusée avec succès à toutes les familles et enseignants !');
    } catch (err: any) {
      showToast(err.message || 'Erreur d\'envoi de l\'alerte', 'error');
    }
  };

  // Handler: Broadcast Circular
  const handlePublishCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCircularInFirestore({
        title: circularData.title,
        target: circularData.target,
        message: circularData.message,
        urgent: circularData.urgent,
        author: 'Direction Générale'
      });

      setShowCircularModal(false);
      setCircularData({ title: '', target: 'all', message: '', urgent: false });
      showToast('Circulaire officielle publiée et notifiée sur les espaces concernés.');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la publication', 'error');
    }
  };

  // Filtered lists
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.class === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  const filteredTeachers = users.filter(u => u.role === 'enseignant' && (
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  ));

  const filteredAccounts = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const parentsList = users.filter(u => u.role === 'parent' || u.role === 'user');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#131b2e]">
      
      {/* Toast Confirmation */}
      {toastMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
          toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
          toastMessage.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' :
          'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-emerald-600">
              {toastMessage.type === 'success' ? 'check_circle' : toastMessage.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="font-semibold">{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* 1. Header Strategic Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#eaedff] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3525cd] mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006e4b] animate-pulse"></span>
            <span>Portail Décisionnel Direction • Base Firestore Connectée</span>
            <span className="text-[#777587]">• Homologation MENA N° 00412/DP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight">
            Direction Générale — Supervision & Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#464555] mt-0.5">
            Gestion centrale des élèves, classes, professeurs, comptes inscrits et associations officielles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">notification_important</span>
            <span>Alerte SMS Urgence</span>
          </button>

          <button
            onClick={() => setShowCircularModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Diffuser une Circulaire</span>
          </button>
        </div>
      </div>

      {/* 2. Key 5 KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: Students */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Élèves Inscrits</span>
            <span className="w-8 h-8 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">school</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-[#131b2e]">{totalStudentsCount}</span>
          </div>
          <span className="text-[11px] text-[#006e4b] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> Base active
          </span>
        </div>

        {/* Metric 2: Classes */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Classes Ouvertes</span>
            <span className="w-8 h-8 rounded-lg bg-[#dae2fd] text-[#3525cd] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">meeting_room</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-[#131b2e]">{totalClassesCount}</span>
          </div>
          <span className="text-[11px] text-[#464555]">Collège & Lycée</span>
        </div>

        {/* Metric 3: Teachers */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Corps Enseignant</span>
            <span className="w-8 h-8 rounded-lg bg-[#ffdad2] text-[#ae3115] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person_apron</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-[#131b2e]">{totalTeachersCount}</span>
          </div>
          <span className="text-[11px] text-[#006e4b] font-semibold">100% assignés</span>
        </div>

        {/* Metric 4: Parents */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">Comptes Parents</span>
            <span className="w-8 h-8 rounded-lg bg-[#6ffbbe]/30 text-[#005338] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">family_restroom</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-[#131b2e]">{totalParentsCount}</span>
          </div>
          <span className="text-[11px] text-[#464555]">Accès certifiés</span>
        </div>

        {/* Metric 5: Pending Users */}
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#777587]">En Attente de Rôle</span>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${pendingUsersCount > 0 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#eaedff] text-[#464555]'}`}>
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </span>
          </div>
          <div className="my-2">
            <span className={`text-3xl font-extrabold ${pendingUsersCount > 0 ? 'text-[#ba1a1a]' : 'text-[#131b2e]'}`}>{pendingUsersCount}</span>
          </div>
          <span className="text-[11px] text-[#464555]">À valider par Direction</span>
        </div>
      </div>

      {/* 3. Main Operational Administrative Panel */}
      <div className="bg-white rounded-3xl border border-[#eaedff] shadow-sm p-6 space-y-6">
        
        {/* Navigation Tabs Bar & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#eaedff]">
          
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('eleves')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'eleves' 
                  ? 'bg-[#3525cd] text-white shadow-sm' 
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span>Élèves ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'classes' 
                  ? 'bg-[#3525cd] text-white shadow-sm' 
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">meeting_room</span>
              <span>Classes ({classes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'profs' 
                  ? 'bg-[#3525cd] text-white shadow-sm' 
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_apron</span>
              <span>Enseignants ({totalTeachersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('comptes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'comptes' 
                  ? 'bg-[#3525cd] text-white shadow-sm' 
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
              <span>Comptes Inscrits ({users.length})</span>
              {pendingUsersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingUsersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('associations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'associations' 
                  ? 'bg-[#3525cd] text-white shadow-sm' 
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>Associations Parent ➔ Élève</span>
            </button>

            <button
              onClick={() => setActiveTab('activites')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'activites' 
                  ? 'bg-[#3525cd] text-white shadow-sm' 
                  : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Journal & Audit</span>
            </button>
          </div>

          {/* Quick Add Buttons based on active tab */}
          <div className="flex items-center gap-2 self-end lg:self-center">
            {activeTab === 'eleves' && (
              <button
                onClick={() => setShowCreateStudentModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#fd6a49] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Créer un Élève</span>
              </button>
            )}

            {activeTab === 'classes' && (
              <button
                onClick={() => setShowCreateClassModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#fd6a49] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Créer une Classe</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Subfilters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f2f3ff] p-3 rounded-2xl border border-[#eaedff]">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#777587] text-[18px]">search</span>
            <input
              type="text"
              placeholder={
                activeTab === 'eleves' ? "Rechercher par nom d'élève, prénom, matricule..." :
                activeTab === 'classes' ? "Rechercher une classe, niveau, salle..." :
                activeTab === 'profs' ? "Rechercher un professeur, matière, contact..." :
                activeTab === 'comptes' ? "Rechercher un compte, email, nom..." :
                "Rechercher dans les données..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white text-[#131b2e] rounded-xl border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
            />
          </div>

          {activeTab === 'eleves' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#464555] shrink-0">Filtrer par classe :</span>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white text-[#131b2e] rounded-xl border border-[#eaedff] font-semibold outline-none cursor-pointer"
              >
                <option value="all">Toutes les classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'comptes' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#464555] shrink-0">Rôle :</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white text-[#131b2e] rounded-xl border border-[#eaedff] font-semibold outline-none cursor-pointer"
              >
                <option value="all">Tous les rôles</option>
                <option value="user">Utilisateur de base (En attente)</option>
                <option value="parent">Parent</option>
                <option value="enseignant">Enseignant / Professeur</option>
                <option value="direction">Direction</option>
              </select>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* TAB 1: ÉLÈVES (LISTE & GESTION)            */}
        {/* ========================================== */}
        {activeTab === 'eleves' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[#777587] font-bold border-b border-[#eaedff] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Élève & Matricule</th>
                  <th className="pb-3">Classe & Niveau</th>
                  <th className="pb-3">Parent Référent Associé</th>
                  <th className="pb-3">Moyenne T2</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right pr-2">Actions Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#777587]">
                      Aucun élève trouvé. Utilisez le bouton « Créer un Élève » pour en ajouter un.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#f2f3ff] transition-colors group">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'} 
                            alt={student.firstName} 
                            className="w-9 h-9 rounded-xl object-cover border border-[#eaedff]"
                          />
                          <div>
                            <div className="font-bold text-[#131b2e]">{student.firstName} {student.lastName}</div>
                            <span className="text-[10px] text-[#777587] font-mono">{student.matricule}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#e2dfff] text-[#3525cd] font-bold text-[11px]">
                          {student.class}
                        </span>
                        <div className="text-[10px] text-[#777587] mt-0.5">{student.level}</div>
                      </td>
                      <td className="py-3">
                        {student.parentName ? (
                          <div>
                            <div className="font-semibold text-[#131b2e] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-[#006e4b]">verified_user</span>
                              <span>{student.parentName}</span>
                            </div>
                            <span className="text-[10px] text-[#777587]">{student.parentPhone || student.parentEmail}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedStudentForParentAssoc(student);
                              setShowAssociateParentModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ffdad2] text-[#ae3115] font-bold text-[10px] hover:bg-[#ffb4a3] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">person_add</span>
                            <span>Associer un parent</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3 font-extrabold text-[#3525cd]">
                        {student.generalAverage ? `${student.generalAverage}/20` : '14.5/20'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === 'En règle' || !student.status ? 'bg-[#6ffbbe]/30 text-[#005236]' : 'bg-[#ffdad2] text-[#ae3115]'
                        }`}>
                          {student.status || 'En règle'}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStudentForDetail(student);
                              setShowStudentDetailModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] cursor-pointer"
                            title="Consulter profil & historique"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudentForEdit(student);
                              setStudentForm({
                                firstName: student.firstName,
                                lastName: student.lastName,
                                matricule: student.matricule,
                                class: student.class,
                                level: student.level,
                                gender: student.gender || 'M',
                                birthDate: student.birthDate || '2010-04-15',
                                parentName: student.parentName,
                                parentEmail: student.parentEmail,
                                parentPhone: student.parentPhone,
                                generalAverage: student.generalAverage || 14.5,
                                status: (student.status as any) || 'En règle'
                              });
                              setShowEditStudentModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] cursor-pointer"
                            title="Modifier fiche élève"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="p-1.5 rounded-lg bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] cursor-pointer"
                            title="Supprimer / Radier élève"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: CLASSES & AFFECTATIONS              */}
        {/* ========================================== */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const classStudents = students.filter(s => s.class === cls.name);
              const assignedTeachers = users.filter(u => u.role === 'enseignant' && u.assignedClasses?.includes(cls.name));

              return (
                <div key={cls.id} className="p-5 rounded-2xl bg-[#faf8ff] border border-[#eaedff] hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-[#3525cd] font-extrabold uppercase tracking-wider">{cls.level}</span>
                        <h3 className="text-xl font-extrabold text-[#131b2e] mt-0.5">{cls.name}</h3>
                        <p className="text-xs text-[#777587] flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">door_front</span>
                          <span>{cls.room}</span>
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-white text-[#131b2e] font-bold text-xs shadow-xs border border-[#eaedff]">
                        {classStudents.length} élèves
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#eaedff]">
                        <span className="text-[10px] text-[#777587] uppercase font-bold block">Professeur Principal</span>
                        <span className="font-bold text-[#131b2e] flex items-center gap-1.5 mt-0.5">
                          <span className="material-symbols-outlined text-[#ae3115] text-[16px]">person_apron</span>
                          <span>{cls.mainTeacherName || 'Non assigné'}</span>
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#eaedff]">
                        <span className="text-[10px] text-[#777587] uppercase font-bold block mb-1">
                          Enseignants intervenants ({assignedTeachers.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {assignedTeachers.length === 0 ? (
                            <span className="text-[11px] text-[#777587] italic">Aucun enseignant associé</span>
                          ) : (
                            assignedTeachers.map(t => (
                              <span key={t.uid} className="px-2 py-0.5 rounded-md bg-[#e2dfff] text-[#3525cd] text-[10px] font-semibold">
                                {t.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedClassFilter(cls.name);
                        setActiveTab('eleves');
                      }}
                      className="text-xs font-bold text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir les {classStudents.length} élèves</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedClassForEdit(cls);
                          setClassForm({
                            name: cls.name,
                            level: cls.level,
                            room: cls.room,
                            academicYear: cls.academicYear || '2025-2026',
                            mainTeacherName: cls.mainTeacherName || '',
                            studentCount: cls.studentCount || 40
                          });
                          setShowEditClassModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-white hover:bg-[#eaedff] text-[#464555] border border-[#eaedff] cursor-pointer"
                        title="Modifier classe"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls)}
                        className="p-1.5 rounded-lg bg-white hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#eaedff] cursor-pointer"
                        title="Supprimer classe"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: ENSEIGNANTS & AFFECTATIONS          */}
        {/* ========================================== */}
        {activeTab === 'profs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[#777587] font-bold border-b border-[#eaedff] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">Enseignant & Contact</th>
                  <th className="pb-3">Classes Assignées</th>
                  <th className="pb-3">Matières Enseignées</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right pr-2">Affectations Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff]">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#777587]">
                      Aucun professeur enregistré. Vous pouvez déclarer un compte inscrit comme Enseignant dans l'onglet « Comptes Inscrits ».
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher.uid} className="hover:bg-[#f2f3ff] transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#ffdad2] text-[#ae3115] flex items-center justify-center font-bold">
                            {teacher.firstName?.[0] || 'P'}{teacher.lastName?.[0] || 'R'}
                          </div>
                          <div>
                            <div className="font-bold text-[#131b2e]">{teacher.name || teacher.email}</div>
                            <span className="text-[10px] text-[#777587]">{teacher.email} • {teacher.phone || 'Non renseigné'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                            teacher.assignedClasses.map(c => (
                              <span key={c} className="px-2 py-0.5 rounded-md bg-[#e2dfff] text-[#3525cd] font-bold text-[10px]">
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#ba1a1a] font-semibold">Aucune classe assignée</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects && teacher.subjects.length > 0 ? (
                            teacher.subjects.map(s => (
                              <span key={s} className="px-2 py-0.5 rounded-md bg-[#faf8ff] border border-[#eaedff] text-[#131b2e] text-[10px]">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#777587]">Toutes disciplines</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#6ffbbe]/30 text-[#005236] text-[10px] font-bold">
                          {teacher.status || 'Actif'}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => {
                            setSelectedTeacherForAssignment(teacher);
                            setSelectedTeacherClasses(teacher.assignedClasses || []);
                            setSelectedTeacherSubjects(teacher.subjects || []);
                            setShowTeacherAssignmentModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#3525cd] text-white font-bold text-xs hover:bg-[#4f46e5] transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit_note</span>
                          <span>Gérer Classes & Matières</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: COMPTES INSCRITS & VALIDATION RÔLE  */}
        {/* ========================================== */}
        {activeTab === 'comptes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#eaedff] text-xs text-[#131b2e] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3525cd] text-[24px]">verified_user</span>
              <div>
                <span className="font-bold">Règle de sécurité de la Direction :</span>
                <p className="text-[#464555] mt-0.5">
                  Tout nouveau compte créé possède initialement le rôle utilisateur de base. La Direction est la seule entité habilitée à lui attribuer son rôle fonctionnel (Parent, Professeur, Direction) et ses accès aux données scolaires.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[#777587] font-bold border-b border-[#eaedff] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Utilisateur & Identifiant</th>
                    <th className="pb-3">Rôle Actuel</th>
                    <th className="pb-3">Date d'inscription</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3 text-right pr-2">Attribution du Rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {filteredAccounts.map((account) => (
                    <tr key={account.uid} className="hover:bg-[#f2f3ff] transition-colors">
                      <td className="py-3 pl-2">
                        <div className="font-bold text-[#131b2e]">{account.name || account.email}</div>
                        <span className="text-[10px] text-[#777587]">{account.email} • {account.phone || 'Sans tél'}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          account.role === 'direction' ? 'bg-[#3525cd] text-white' :
                          account.role === 'enseignant' ? 'bg-[#ffdad2] text-[#ae3115]' :
                          account.role === 'parent' ? 'bg-[#6ffbbe]/30 text-[#005236]' :
                          'bg-[#ffdad6] text-[#ba1a1a] animate-pulse'
                        }`}>
                          {account.role === 'direction' ? 'Direction' :
                           account.role === 'enseignant' ? 'Professeur / Enseignant' :
                           account.role === 'parent' ? 'Parent Référent' :
                           'Utilisateur de base (En attente)'}
                        </span>
                      </td>
                      <td className="py-3 text-[#777587]">
                        {account.createdAt ? new Date(account.createdAt).toLocaleDateString('fr-FR') : 'Récemment'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          account.status === 'Actif' ? 'bg-[#6ffbbe]/30 text-[#005236]' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {account.status || 'Actif'}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => {
                            setSelectedUserForRole(account);
                            setRoleForm({
                              role: account.role || 'parent',
                              status: account.status || 'Actif'
                            });
                            setShowRoleModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Définir le rôle</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: ASSOCIATIONS PARENT ➔ ÉLÈVE         */}
        {/* ========================================== */}
        {activeTab === 'associations' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#3525cd] to-[#4f46e5] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div>
                <h3 className="text-base font-bold">Liaison Parent ➔ Élève</h3>
                <p className="text-xs text-[#dad7ff] mt-0.5">
                  Un parent ne peut accéder qu'aux élèves qui lui sont explicitement associés par la Direction.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedStudentForParentAssoc(students[0] || null);
                  setShowAssociateParentModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-white text-[#3525cd] text-xs font-bold hover:bg-[#faf8ff] transition-all cursor-pointer shrink-0"
              >
                + Associer un Parent à un Élève
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <div key={student.id} className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex flex-col justify-between space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={student.photoUrl} 
                      alt={student.firstName} 
                      className="w-11 h-11 rounded-xl object-cover border border-[#eaedff]"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#131b2e]">{student.firstName} {student.lastName}</h4>
                      <span className="text-xs text-[#3525cd] font-semibold">{student.class} • {student.matricule}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#eaedff] text-xs space-y-1">
                    <span className="text-[10px] text-[#777587] uppercase font-bold block">Parent Associé</span>
                    {student.parentName ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#131b2e]">{student.parentName}</div>
                          <div className="text-[11px] text-[#777587]">{student.parentEmail || student.parentPhone}</div>
                        </div>
                        <span className="material-symbols-outlined text-[#006e4b] text-[20px]">check_circle</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[#ba1a1a]">
                        <span className="text-xs font-semibold">Aucun parent rattaché</span>
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStudentForParentAssoc(student);
                      setShowAssociateParentModal(true);
                    }}
                    className="w-full py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {student.parentName ? 'Modifier le parent associé' : 'Associer un compte parent'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: JOURNAL DES ACTIVITÉS & AUDIT       */}
        {/* ========================================== */}
        {activeTab === 'activites' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3525cd]">history</span>
              <span>Journal Global des Événements & Audit de la Plateforme</span>
            </h3>

            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-[#faf8ff] border border-[#eaedff] flex items-start gap-3 hover:bg-white transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    log.type === 'student_created' ? 'bg-[#6ffbbe] text-[#005236]' :
                    log.type === 'role_assigned' ? 'bg-[#e2dfff] text-[#3525cd]' :
                    log.type === 'alert_sent' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                    log.type === 'teacher_assigned' ? 'bg-[#ffdad2] text-[#ae3115]' :
                    'bg-[#dae2fd] text-[#3525cd]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {log.type === 'student_created' ? 'person_add' :
                       log.type === 'role_assigned' ? 'verified' :
                       log.type === 'alert_sent' ? 'notification_important' :
                       log.type === 'teacher_assigned' ? 'school' : 'campaign'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-[#131b2e]">{log.title}</h4>
                      <span className="text-[10px] text-[#777587] font-medium shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#464555] mt-0.5">{log.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-[#777587]">
                      <span>Par : <strong>{log.actorName}</strong> ({log.actorRole})</span>
                      {log.targetName && <span>• Cible : <strong>{log.targetName}</strong></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MODAL: CRÉER UN ÉLÈVE                      */}
      {/* ========================================== */}
      {showCreateStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#eaedff] mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">person_add</span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#131b2e]">Création d'un nouvel élève</h3>
                  <p className="text-xs text-[#777587]">Action réservée exclusivement à la Direction</p>
                </div>
              </div>
              <button onClick={() => setShowCreateStudentModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé"
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aminata"
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Matricule</label>
                  <input
                    type="text"
                    placeholder="Auto-généré si vide"
                    value={studentForm.matricule}
                    onChange={(e) => setStudentForm({ ...studentForm, matricule: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Classe attribuée *</label>
                  <select
                    value={studentForm.class}
                    onChange={(e) => {
                      const selectedCls = classes.find(c => c.name === e.target.value);
                      setStudentForm({ 
                        ...studentForm, 
                        class: e.target.value,
                        level: selectedCls?.level?.split(' ')?.[0] || '3ème'
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none font-bold"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Sexe</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={studentForm.birthDate}
                    onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Moyenne initiale (/20)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={studentForm.generalAverage}
                    onChange={(e) => setStudentForm({ ...studentForm, generalAverage: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white focus:ring-2 focus:ring-[#3525cd] outline-none font-bold text-[#3525cd]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf8ff] border border-[#eaedff] space-y-3">
                <span className="text-xs font-bold text-[#3525cd] uppercase tracking-wider block">
                  Informations Parent Référent
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#464555] mb-1">Nom du Parent</label>
                    <input
                      type="text"
                      placeholder="Ex: M. Jean Kouamé"
                      value={studentForm.parentName}
                      onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-[#eaedff] outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#464555] mb-1">Téléphone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+225 07 00 00 00 00"
                      value={studentForm.parentPhone}
                      onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-[#eaedff] outline-none focus:ring-2 focus:ring-[#3525cd]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#464555] mb-1">Email du parent</label>
                  <input
                    type="email"
                    placeholder="parent@email.com"
                    value={studentForm.parentEmail}
                    onChange={(e) => setStudentForm({ ...studentForm, parentEmail: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-[#eaedff] outline-none focus:ring-2 focus:ring-[#3525cd]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowCreateStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#3525cd] to-[#fd6a49] text-white shadow-md hover:opacity-95 cursor-pointer"
                >
                  Enregistrer l'élève dans la base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: MODIFIER UN ÉLÈVE                   */}
      {/* ========================================== */}
      {showEditStudentModal && selectedStudentForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#eaedff] mb-4">
              <h3 className="text-base font-bold text-[#131b2e]">
                Modifier fiche élève : {selectedStudentForEdit.firstName} {selectedStudentForEdit.lastName}
              </h3>
              <button onClick={() => setShowEditStudentModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Classe</label>
                  <select
                    value={studentForm.class}
                    onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] font-bold outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Statut administratif</label>
                  <select
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] outline-none font-bold"
                  >
                    <option value="En règle">En règle</option>
                    <option value="À régulariser">À régulariser</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Nom du parent</label>
                  <input
                    type="text"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Téléphone parent</label>
                  <input
                    type="text"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowEditStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3525cd] text-white shadow-md hover:bg-[#4f46e5] cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: PROFIL DÉTAILLÉ ÉLÈVE               */}
      {/* ========================================== */}
      {showStudentDetailModal && selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedStudentForDetail.photoUrl} 
                  alt={selectedStudentForDetail.firstName} 
                  className="w-14 h-14 rounded-2xl object-cover border border-[#eaedff]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#131b2e]">
                    {selectedStudentForDetail.firstName} {selectedStudentForDetail.lastName}
                  </h3>
                  <span className="text-xs text-[#3525cd] font-bold">{selectedStudentForDetail.class} • Matricule : {selectedStudentForDetail.matricule}</span>
                </div>
              </div>
              <button onClick={() => setShowStudentDetailModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                <span className="text-[10px] text-[#777587] uppercase font-bold block">Moyenne Générale</span>
                <span className="text-xl font-extrabold text-[#3525cd] mt-0.5 block">{selectedStudentForDetail.generalAverage || 14.5} / 20</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff]">
                <span className="text-[10px] text-[#777587] uppercase font-bold block">Taux d'Assiduité</span>
                <span className="text-xl font-extrabold text-[#006e4b] mt-0.5 block">{selectedStudentForDetail.attendanceRate || 98.5}%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] text-xs space-y-2">
              <span className="text-[10px] text-[#3525cd] uppercase font-extrabold block">Filiation & Contact Responsable</span>
              <div className="flex justify-between">
                <span className="text-[#777587]">Parent / Tuteur :</span>
                <span className="font-bold text-[#131b2e]">{selectedStudentForDetail.parentName || 'Non assigné'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777587]">Téléphone :</span>
                <span className="font-semibold text-[#131b2e]">{selectedStudentForDetail.parentPhone || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777587]">Email certifié :</span>
                <span className="font-semibold text-[#131b2e]">{selectedStudentForDetail.parentEmail || 'Non renseigné'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStudentDetailModal(false)}
                className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CRÉER UNE CLASSE                   */}
      {/* ========================================== */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-4">
              <h3 className="text-base font-bold text-[#131b2e]">Ouvrir une nouvelle classe</h3>
              <button onClick={() => setShowCreateClassModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Nom de la classe *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5ème B, 1ère D, Tle A..."
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Niveau académique</label>
                <input
                  type="text"
                  placeholder="Ex: Collège (Cycle 1), Lycée (Cycle 2)"
                  value={classForm.level}
                  onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Salle attribuée</label>
                  <input
                    type="text"
                    placeholder="Ex: Salle 204"
                    value={classForm.room}
                    onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Effectif cible</label>
                  <input
                    type="number"
                    value={classForm.studentCount}
                    onChange={(e) => setClassForm({ ...classForm, studentCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3525cd] text-white shadow-md hover:bg-[#4f46e5] cursor-pointer"
                >
                  Créer la classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: DÉFINIR RÔLE UTILISATEUR            */}
      {/* ========================================== */}
      {showRoleModal && selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">Attribution du rôle fonctionnel</h3>
                <p className="text-xs text-[#777587]">{selectedUserForRole.email}</p>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUserRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Sélectionner le rôle à attribuer</label>
                <div className="grid grid-cols-1 gap-2">
                  <label className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    roleForm.role === 'parent' ? 'border-[#3525cd] bg-[#f2f3ff]' : 'border-[#eaedff] bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="parent"
                      checked={roleForm.role === 'parent'}
                      onChange={() => setRoleForm({ ...roleForm, role: 'parent' })}
                      className="text-[#3525cd]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#131b2e]">Parent d'élève</div>
                      <div className="text-[11px] text-[#777587]">Accès au suivi des enfants rattachés</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    roleForm.role === 'enseignant' ? 'border-[#ae3115] bg-[#ffdad2]/30' : 'border-[#eaedff] bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="enseignant"
                      checked={roleForm.role === 'enseignant'}
                      onChange={() => setRoleForm({ ...roleForm, role: 'enseignant' })}
                      className="text-[#ae3115]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#131b2e]">Professeur / Enseignant</div>
                      <div className="text-[11px] text-[#777587]">Saisie des notes, appels et mots de liaison</div>
                    </div>
                  </label>

                  <label className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    roleForm.role === 'direction' ? 'border-[#3525cd] bg-[#e2dfff]' : 'border-[#eaedff] bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="direction"
                      checked={roleForm.role === 'direction'}
                      onChange={() => setRoleForm({ ...roleForm, role: 'direction' })}
                      className="text-[#3525cd]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#131b2e]">Direction / Administration</div>
                      <div className="text-[11px] text-[#777587]">Gestion globale de l'établissement</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Statut du compte</label>
                <select
                  value={roleForm.status}
                  onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] outline-none font-bold"
                >
                  <option value="Actif">Actif (Accès autorisé)</option>
                  <option value="En attente">En attente de vérification</option>
                  <option value="Suspendu">Suspendu</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3525cd] text-white shadow-md hover:bg-[#4f46e5] cursor-pointer"
                >
                  Valider et appliquer le rôle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: AFFECTATION PROFESSEUR              */}
      {/* ========================================== */}
      {showTeacherAssignmentModal && selectedTeacherForAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">Affectation pédagogique</h3>
                <p className="text-xs text-[#777587]">{selectedTeacherForAssignment.name} ({selectedTeacherForAssignment.email})</p>
              </div>
              <button onClick={() => setShowTeacherAssignmentModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveTeacherAssignments} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-2">
                  Classes où enseigne ce professeur :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {classes.map(cls => {
                    const isChecked = selectedTeacherClasses.includes(cls.name);
                    return (
                      <label 
                        key={cls.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer text-xs font-bold transition-colors ${
                          isChecked ? 'bg-[#e2dfff] border-[#3525cd] text-[#3525cd]' : 'bg-[#faf8ff] border-[#eaedff] text-[#464555]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeacherClasses([...selectedTeacherClasses, cls.name]);
                            } else {
                              setSelectedTeacherClasses(selectedTeacherClasses.filter(c => c !== cls.name));
                            }
                          }}
                          className="rounded text-[#3525cd]"
                        />
                        <span>{cls.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-2">
                  Matières attribuées :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Français', 'Mathématiques', 'Anglais', 'Histoire-Géographie', 'SVT', 'Physique-Chimie', 'Philosophie', 'Arts Plastiques'].map(subject => {
                    const isChecked = selectedTeacherSubjects.includes(subject);
                    return (
                      <label 
                        key={subject}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer text-xs font-semibold transition-colors ${
                          isChecked ? 'bg-[#ffdad2]/40 border-[#ae3115] text-[#ae3115]' : 'bg-[#faf8ff] border-[#eaedff] text-[#464555]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTeacherSubjects([...selectedTeacherSubjects, subject]);
                            } else {
                              setSelectedTeacherSubjects(selectedTeacherSubjects.filter(s => s !== subject));
                            }
                          }}
                          className="rounded text-[#ae3115]"
                        />
                        <span>{subject}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowTeacherAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3525cd] text-white shadow-md hover:bg-[#4f46e5] cursor-pointer"
                >
                  Enregistrer les affectations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ASSOCIER PARENT ➔ ÉLÈVE             */}
      {/* ========================================== */}
      {showAssociateParentModal && selectedStudentForParentAssoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">Association Parent ➔ Élève</h3>
                <p className="text-xs text-[#3525cd] font-bold">
                  Élève : {selectedStudentForParentAssoc.firstName} {selectedStudentForParentAssoc.lastName} ({selectedStudentForParentAssoc.class})
                </p>
              </div>
              <button onClick={() => setShowAssociateParentModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAssociateParentToStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Sélectionner le compte parent inscrit</label>
                <select
                  required
                  value={selectedParentIdForAssoc}
                  onChange={(e) => setSelectedParentIdForAssoc(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] outline-none font-bold"
                >
                  <option value="">-- Choisir un compte parent --</option>
                  {parentsList.map(p => (
                    <option key={p.uid} value={p.uid}>
                      {p.name} ({p.email}) - {p.phone || 'Sans tel'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#6ffbbe]/20 text-[#005236] text-[11px] leading-relaxed">
                ✓ Une fois l'association validée par la Direction, ce parent aura accès en temps réel au carnet de liaison, bulletins et présences de cet élève.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowAssociateParentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!selectedParentIdForAssoc}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3525cd] text-white shadow-md hover:bg-[#4f46e5] disabled:opacity-50 cursor-pointer"
                >
                  Valider l'association
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: DIFFUSER ALERTE URGENCE             */}
      {/* ========================================== */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">notification_important</span>
                Alerte Flash SMS & Push Urgente
              </h3>
              <button onClick={() => setShowEmergencyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEmergencyAlert} className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
                ⚠️ Ce message sera diffusé par SMS prioritaire à l'ensemble des familles et personnels de l'établissement.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texte de l'alerte SMS (160 caractères max)</label>
                <textarea
                  rows={3}
                  required
                  maxLength={160}
                  placeholder="Ex: URGENT: En raison des intempéries, fermeture exceptionnelle des classes ce jour à 14h..."
                  value={emergencyText}
                  onChange={(e) => setEmergencyText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 resize-none outline-none"
                />
                <span className="text-[10px] text-slate-400 block text-right">{emergencyText.length}/160 caractères</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
                >
                  Diffuser l'alerte immédiate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: PUBLIER CIRCULAIRE                 */}
      {/* ========================================== */}
      {showCircularModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff] animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <h3 className="text-base font-bold text-[#131b2e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">campaign</span>
                Nouvelle Circulaire Administrative
              </h3>
              <button onClick={() => setShowCircularModal(false)} className="text-[#777587] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handlePublishCircular} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Destinataires</label>
                <select
                  value={circularData.target}
                  onChange={(e) => setCircularData({ ...circularData, target: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:ring-2 focus:ring-[#3525cd] outline-none font-bold"
                >
                  <option value="all">Toutes les familles & Personnel ({totalStudentsCount} élèves)</option>
                  <option value="college">Collège uniquement (6ème à 3ème)</option>
                  <option value="lycee">Lycée uniquement (2nde à Tle)</option>
                  <option value="teachers">Corps Enseignant uniquement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Titre de la circulaire</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Circulaire N°05 — Calendrier des examens blancs..."
                  value={circularData.title}
                  onChange={(e) => setCircularData({ ...circularData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:ring-2 focus:ring-[#3525cd] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">Contenu officiel</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Rédigez la communication officielle..."
                  value={circularData.message}
                  onChange={(e) => setCircularData({ ...circularData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f2f3ff] border border-[#eaedff] focus:ring-2 focus:ring-[#3525cd] resize-none outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowCircularModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#464555] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-md cursor-pointer"
                >
                  Publier et notifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
