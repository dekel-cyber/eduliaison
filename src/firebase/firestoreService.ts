import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  onSnapshot, 
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { 
  Student, 
  SchoolClass, 
  UserAccount, 
  UserRole, 
  ActivityLog, 
  Circular, 
  TimelineEvent, 
  AttendanceRecord, 
  SchoolDocument,
  MessageThread 
} from '../types';
import { 
  STUDENTS_DATA, 
  TIMELINE_EVENTS_DATA, 
  ATTENDANCE_RECORDS_AWA, 
  SCHOOL_DOCUMENTS_DATA,
  MESSAGE_THREADS_DATA 
} from '../data/mockData';

// Initial Classes Data for Seeding
export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'cls-3a', name: '3ème A', level: '3ème (Collège)', room: 'Salle 102 - Bâtiment A', academicYear: '2025-2026', studentCount: 42, mainTeacherId: 't-toure', mainTeacherName: 'Mme Aya Touré', subjects: ['Français', 'Mathématiques', 'Anglais', 'Histoire-Géo', 'SVT', 'Physique-Chimie'] },
  { id: 'cls-3b', name: '3ème B', level: '3ème (Collège)', room: 'Salle 104 - Bâtiment A', academicYear: '2025-2026', studentCount: 39, mainTeacherId: 't-kouassi', mainTeacherName: 'M. Patrice Kouassi', subjects: ['Français', 'Mathématiques', 'Anglais', 'Histoire-Géo', 'SVT', 'Physique-Chimie'] },
  { id: 'cls-4c', name: '4ème C', level: '4ème (Collège)', room: 'Salle 201 - Bâtiment B', academicYear: '2025-2026', studentCount: 44, mainTeacherId: 't-brou', mainTeacherName: 'Mme Sylvie Brou', subjects: ['Français', 'Mathématiques', 'Anglais', 'Histoire-Géo', 'SVT'] },
  { id: 'cls-6a', name: '6ème A', level: '6ème (Collège)', room: 'Salle 003 - Rez-de-chaussée', academicYear: '2025-2026', studentCount: 40, mainTeacherId: 't-yao', mainTeacherName: 'M. Eric Yao', subjects: ['Français', 'Mathématiques', 'Anglais', 'Histoire-Géo', 'SVT', 'Arts Plastiques'] },
  { id: 'cls-2ndec', name: '2nde C', level: '2nde (Lycée)', room: 'Salle 302 - Bâtiment C', academicYear: '2025-2026', studentCount: 38, mainTeacherId: 't-kouassi', mainTeacherName: 'M. Patrice Kouassi', subjects: ['Français', 'Mathématiques', 'Physique-Chimie', 'SVT', 'Philosophie'] },
  { id: 'cls-tlec', name: 'Tle C', level: 'Terminale (Lycée)', room: 'Salle 305 - Bâtiment C', academicYear: '2025-2026', studentCount: 35, mainTeacherId: 't-yao', mainTeacherName: 'M. Eric Yao', subjects: ['Mathématiques', 'Physique-Chimie', 'Philosophie', 'SVT', 'Anglais'] }
];

// Initial Users Data for Seeding
export const INITIAL_USERS: UserAccount[] = [
  { uid: 'dir-principal', email: 'direction@eduliaison.ci', name: 'Direction Générale (Proviseur)', firstName: 'Amadou', lastName: 'Sow', role: 'direction', phone: '+225 07 00 00 00 01', status: 'Actif', createdAt: '2025-01-01T08:00:00Z' },
  { uid: 't-toure', email: 'enseignant.test@eduliaison.ci', name: 'Mme Aya Touré', firstName: 'Aya', lastName: 'Touré', role: 'enseignant', phone: '+225 07 11 22 33 44', status: 'Actif', assignedClasses: ['3ème A', '3ème B'], subjects: ['Français', 'Littérature Africaine'], createdAt: '2025-01-05T09:00:00Z' },
  { uid: 't-kouassi', email: 'patrice.kouassi@eduliaison.ci', name: 'M. Patrice Kouassi', firstName: 'Patrice', lastName: 'Kouassi', role: 'enseignant', phone: '+225 05 99 88 77 66', status: 'Actif', assignedClasses: ['3ème A', '3ème B', '2nde C', 'Tle C'], subjects: ['Mathématiques'], createdAt: '2025-01-06T10:00:00Z' },
  { uid: 't-brou', email: 'sylvie.brou@eduliaison.ci', name: 'Mme Sylvie Brou', firstName: 'Sylvie', lastName: 'Brou', role: 'enseignant', phone: '+225 01 23 45 67 89', status: 'Actif', assignedClasses: ['4ème C', '3ème A'], subjects: ['Histoire-Géographie'], createdAt: '2025-01-07T11:00:00Z' },
  { uid: 't-yao', email: 'eric.yao@eduliaison.ci', name: 'M. Eric Yao', firstName: 'Eric', lastName: 'Yao', role: 'enseignant', phone: '+225 07 44 55 66 77', status: 'Actif', assignedClasses: ['6ème A', '3ème A', 'Tle C'], subjects: ['Sciences Physiques & Chimie'], createdAt: '2025-01-08T12:00:00Z' },
  { uid: 'p-kouame', email: 'parent.test@eduliaison.ci', name: 'M. Jean-Baptiste Kouamé', firstName: 'Jean-Baptiste', lastName: 'Kouamé', role: 'parent', phone: '+225 07 08 12 34 56', status: 'Actif', childrenIds: ['awa', 'david'], createdAt: '2025-01-10T14:00:00Z' },
  { uid: 'p-koffi', email: 'christine.koffi@gmail.com', name: 'Mme Christine Koffi', firstName: 'Christine', lastName: 'Koffi', role: 'parent', phone: '+225 05 44 23 11 00', status: 'Actif', childrenIds: ['jean-luc'], createdAt: '2025-01-12T15:00:00Z' },
  { uid: 'p-diallo', email: 'ibrahima.diallo@orange.ci', name: 'M. Ibrahima Diallo', firstName: 'Ibrahima', lastName: 'Diallo', role: 'parent', phone: '+225 01 02 03 04 05', status: 'Actif', childrenIds: ['oumar'], createdAt: '2025-01-14T16:00:00Z' },
  { uid: 'p-bamba', email: 'fatou.bamba@aviso.ci', name: 'Mme Fatou Bamba', firstName: 'Fatou', lastName: 'Bamba', role: 'parent', phone: '+225 07 77 88 99 00', status: 'Actif', childrenIds: ['sarah'], createdAt: '2025-01-15T17:00:00Z' },
  { uid: 'u-nouveau1', email: 'michel.kone@yahoo.fr', name: 'M. Michel Koné', firstName: 'Michel', lastName: 'Koné', role: 'user', phone: '+225 07 55 44 33 22', status: 'En attente', createdAt: '2025-02-01T08:30:00Z' },
  { uid: 'u-nouveau2', email: 'mariam.sangare@gmail.com', name: 'Mme Mariam Sangaré', firstName: 'Mariam', lastName: 'Sangaré', role: 'user', phone: '+225 05 11 22 33 44', status: 'En attente', createdAt: '2025-02-02T09:15:00Z' }
];

// Initial Activity Logs for Seeding
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'act-1', type: 'student_created', title: 'Nouvel élève inscrit', description: 'Création et attribution de matricule pour Awa Kouamé en classe de 3ème A', actorName: 'Direction Générale', actorRole: 'direction', targetName: 'Awa Kouamé (3ème A)', timestamp: 'Aujourd\'hui à 08:30', category: 'admin' },
  { id: 'act-2', type: 'parent_associated', title: 'Association Parent → Élève', description: 'M. Jean-Baptiste Kouamé associé aux élèves Awa Kouamé et David Kouamé', actorName: 'Direction Générale', actorRole: 'direction', targetName: 'M. Jean-Baptiste Kouamé', timestamp: 'Aujourd\'hui à 09:15', category: 'admin' },
  { id: 'act-3', type: 'teacher_assigned', title: 'Affectation de professeur', description: 'Mme Aya Touré assignée comme Professeur Principal de la classe de 3ème A (Français)', actorName: 'Direction Générale', actorRole: 'direction', targetName: 'Mme Aya Touré (3ème A)', timestamp: 'Hier à 14:00', category: 'pedagogie' },
  { id: 'act-4', type: 'circular_sent', title: 'Circulaire N°04 diffusée', description: 'Convocation officielle réunion parents-professeurs envoyée à 1 200 familles', actorName: 'Secrétariat Direction', actorRole: 'direction', targetName: 'Toutes les familles', timestamp: 'Hier à 16:30', category: 'system' },
  { id: 'act-5', type: 'role_assigned', title: 'Attribution de rôle', description: 'Compte de Mme Christine Koffi validé avec succès en rôle Parent Référent', actorName: 'Direction Générale', actorRole: 'direction', targetName: 'Mme Christine Koffi', timestamp: 'Il y a 2 jours', category: 'admin' }
];

/**
 * Seed initial dataset to Firestore if collections are empty
 */
export async function seedInitialDataIfEmpty() {
  try {
    // 1. Seed classes
    const classesSnap = await getDocs(collection(db, 'classes'));
    if (classesSnap.empty) {
      for (const cls of INITIAL_CLASSES) {
        await setDoc(doc(db, 'classes', cls.id), cls);
      }
    }

    // 2. Seed students
    const studentsSnap = await getDocs(collection(db, 'students'));
    if (studentsSnap.empty) {
      for (const st of STUDENTS_DATA) {
        await setDoc(doc(db, 'students', st.id), {
          ...st,
          gender: st.firstName === 'Awa' || st.firstName === 'Sarah' ? 'F' : 'M',
          birthDate: '2010-04-15',
          status: 'En règle',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 3. Seed users
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.empty) {
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, 'users', u.uid), u);
      }
    }

    // 4. Seed activity logs
    const logsSnap = await getDocs(collection(db, 'activity_logs'));
    if (logsSnap.empty) {
      for (const log of INITIAL_ACTIVITY_LOGS) {
        await setDoc(doc(db, 'activity_logs', log.id), log);
      }
    }

    // 5. Seed timeline events
    const eventsSnap = await getDocs(collection(db, 'timeline_events'));
    if (eventsSnap.empty) {
      for (const evt of TIMELINE_EVENTS_DATA) {
        await setDoc(doc(db, 'timeline_events', evt.id), evt);
      }
    }

    // 6. Seed documents
    const docsSnap = await getDocs(collection(db, 'school_documents'));
    if (docsSnap.empty) {
      for (const sdoc of SCHOOL_DOCUMENTS_DATA) {
        await setDoc(doc(db, 'school_documents', sdoc.id), sdoc);
      }
    }
  } catch (error) {
    console.warn("Could not check/seed Firestore initial data:", error);
  }
}

// ==========================================
// 1. STUDENTS MANAGEMENT (Direction Only)
// ==========================================

export async function fetchStudentsFromFirestore(): Promise<Student[]> {
  const path = 'students';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return STUDENTS_DATA;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
  } catch (error) {
    console.warn('Error fetching students:', error);
    return STUDENTS_DATA;
  }
}

export function subscribeToStudents(callback: (students: Student[]) => void) {
  const path = 'students';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
        callback(list);
      } else {
        callback(STUDENTS_DATA);
      }
    }, (err) => {
      console.warn('Students snapshot error:', err);
      callback(STUDENTS_DATA);
    });
  } catch (e) {
    callback(STUDENTS_DATA);
    return () => {};
  }
}

export async function createStudentInFirestore(studentData: Partial<Student>): Promise<Student> {
  const path = 'students';
  const id = studentData.id || `st_${Date.now()}`;
  const newStudent: Student = {
    id,
    firstName: studentData.firstName || '',
    lastName: studentData.lastName || '',
    matricule: studentData.matricule || `MAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    class: studentData.class || '3ème A',
    level: studentData.level || '3ème',
    photoUrl: studentData.photoUrl || `https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80`,
    generalAverage: studentData.generalAverage ?? 14.5,
    attendanceRate: studentData.attendanceRate ?? 98.5,
    rank: studentData.rank ?? 5,
    totalStudents: studentData.totalStudents ?? 42,
    honors: studentData.honors || 'Tableau d\'Honneur',
    parentName: studentData.parentName || '',
    parentPhone: studentData.parentPhone || '',
    parentEmail: studentData.parentEmail || '',
    parentId: studentData.parentId || '',
    gender: studentData.gender || 'M',
    birthDate: studentData.birthDate || '2010-01-01',
    status: studentData.status || 'En règle'
  };

  try {
    await setDoc(doc(db, path, id), newStudent);
    await logActivityInFirestore({
      type: 'student_created',
      title: 'Création d\'un nouvel élève',
      description: `L'élève ${newStudent.firstName} ${newStudent.lastName} (Matricule: ${newStudent.matricule}) a été créé et inscrit en classe de ${newStudent.class}.`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: `${newStudent.firstName} ${newStudent.lastName}`,
      category: 'admin'
    });
    return newStudent;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    return newStudent;
  }
}

export async function updateStudentInFirestore(studentId: string, updates: Partial<Student>): Promise<void> {
  const path = 'students';
  try {
    await updateDoc(doc(db, path, studentId), updates);
    await logActivityInFirestore({
      type: 'student_updated',
      title: 'Mise à jour fiche élève',
      description: `Mise à jour des informations pour l'élève (${studentId})`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: updates.lastName ? `${updates.firstName || ''} ${updates.lastName}` : studentId,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${studentId}`);
  }
}

export async function deleteStudentInFirestore(studentId: string, studentName?: string): Promise<void> {
  const path = 'students';
  try {
    await deleteDoc(doc(db, path, studentId));
    await logActivityInFirestore({
      type: 'student_updated',
      title: 'Radiation / Suppression élève',
      description: `L'élève ${studentName || studentId} a été retiré du registre de l'établissement.`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: studentName || studentId,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${studentId}`);
  }
}

// ==========================================
// 2. CLASSES MANAGEMENT (Direction Only)
// ==========================================

export async function fetchClassesFromFirestore(): Promise<SchoolClass[]> {
  const path = 'classes';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return INITIAL_CLASSES;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolClass));
  } catch (error) {
    console.warn('Error fetching classes:', error);
    return INITIAL_CLASSES;
  }
}

export function subscribeToClasses(callback: (classes: SchoolClass[]) => void) {
  const path = 'classes';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolClass));
        callback(list);
      } else {
        callback(INITIAL_CLASSES);
      }
    }, (err) => {
      console.warn('Classes snapshot error:', err);
      callback(INITIAL_CLASSES);
    });
  } catch (e) {
    callback(INITIAL_CLASSES);
    return () => {};
  }
}

export async function createClassInFirestore(classData: Partial<SchoolClass>): Promise<SchoolClass> {
  const path = 'classes';
  const id = classData.id || `cls_${classData.name?.toLowerCase().replace(/\s+/g, '') || Date.now()}`;
  const newClass: SchoolClass = {
    id,
    name: classData.name || 'Nouvelle Classe',
    level: classData.level || 'Collège',
    room: classData.room || 'Salle principale',
    academicYear: classData.academicYear || '2025-2026',
    studentCount: classData.studentCount || 0,
    mainTeacherId: classData.mainTeacherId || '',
    mainTeacherName: classData.mainTeacherName || 'Non assigné',
    subjects: classData.subjects || ['Français', 'Mathématiques', 'Anglais', 'Histoire-Géo', 'SVT'],
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, path, id), newClass);
    await logActivityInFirestore({
      type: 'class_created',
      title: 'Création de classe',
      description: `La classe ${newClass.name} (${newClass.level}) a été ouverte dans l'établissement.`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: newClass.name,
      category: 'admin'
    });
    return newClass;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    return newClass;
  }
}

export async function updateClassInFirestore(classId: string, updates: Partial<SchoolClass>): Promise<void> {
  const path = 'classes';
  try {
    await updateDoc(doc(db, path, classId), updates);
    await logActivityInFirestore({
      type: 'class_updated',
      title: 'Mise à jour classe',
      description: `Modification des paramètres de la classe ${updates.name || classId}`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: updates.name || classId,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${classId}`);
  }
}

export async function deleteClassInFirestore(classId: string, className?: string): Promise<void> {
  const path = 'classes';
  try {
    await deleteDoc(doc(db, path, classId));
    await logActivityInFirestore({
      type: 'class_updated',
      title: 'Fermeture / Suppression de classe',
      description: `La classe ${className || classId} a été archivée/supprimée de l'établissement.`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: className || classId,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${classId}`);
  }
}

// ==========================================
// 3. USERS & ROLES MANAGEMENT (Direction Only)
// ==========================================

export async function fetchUsersFromFirestore(): Promise<UserAccount[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return INITIAL_USERS;
    }
    return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserAccount));
  } catch (error) {
    console.warn('Error fetching users:', error);
    return INITIAL_USERS;
  }
}

export function subscribeToUsers(callback: (users: UserAccount[]) => void) {
  const path = 'users';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserAccount));
        callback(list);
      } else {
        callback(INITIAL_USERS);
      }
    }, (err) => {
      console.warn('Users snapshot error:', err);
      callback(INITIAL_USERS);
    });
  } catch (e) {
    callback(INITIAL_USERS);
    return () => {};
  }
}

/**
 * Direction assigns a role to a user account
 */
export async function updateUserRoleInFirestore(
  uid: string, 
  newRole: UserRole, 
  status: 'Actif' | 'En attente' | 'Suspendu' = 'Actif',
  userName?: string
): Promise<void> {
  const path = 'users';
  try {
    await updateDoc(doc(db, path, uid), {
      role: newRole,
      status: status,
      updatedAt: new Date().toISOString()
    });

    await logActivityInFirestore({
      type: 'role_assigned',
      title: `Attribution de rôle : ${newRole.toUpperCase()}`,
      description: `Le compte ${userName || uid} a été validé et configuré avec le rôle ${newRole.toUpperCase()} (Statut: ${status}).`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: userName || uid,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${uid}`);
  }
}

/**
 * Direction creates a new Teacher account in Firestore
 */
export async function createTeacherInFirestore(teacherData: {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  assignedClasses: string[];
  subjects: string[];
}): Promise<UserAccount> {
  const path = 'users';
  const uid = `t_${Date.now()}`;
  const newTeacher: UserAccount = {
    uid,
    email: teacherData.email.trim().toLowerCase(),
    name: teacherData.name || `${teacherData.firstName || ''} ${teacherData.lastName || ''}`.trim(),
    firstName: teacherData.firstName,
    lastName: teacherData.lastName,
    role: 'enseignant',
    phone: teacherData.phone,
    status: 'Actif',
    assignedClasses: teacherData.assignedClasses,
    subjects: teacherData.subjects,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, path, uid), newTeacher);
    await logActivityInFirestore({
      type: 'teacher_assigned',
      title: 'Création & Enregistrement Enseignant',
      description: `Le professeur ${newTeacher.name} (${newTeacher.email}) a été ajouté au corps enseignant pour les classes [${teacherData.assignedClasses.join(', ')}].`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: newTeacher.name,
      category: 'pedagogie'
    });
    return newTeacher;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${uid}`);
    return newTeacher;
  }
}

/**
 * Direction associates Teacher to Classes & Subjects
 */
export async function updateTeacherAssignments(
  uid: string, 
  assignedClasses: string[], 
  subjects: string[],
  teacherName?: string
): Promise<void> {
  const path = 'users';
  try {
    await updateDoc(doc(db, path, uid), {
      assignedClasses,
      subjects,
      role: 'enseignant',
      updatedAt: new Date().toISOString()
    });

    await logActivityInFirestore({
      type: 'teacher_assigned',
      title: 'Affectation pédagogique professeur',
      description: `Le professeur ${teacherName || uid} a été assigné aux classes : [${assignedClasses.join(', ')}] pour les matières : [${subjects.join(', ')}].`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: teacherName || uid,
      category: 'pedagogie'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${uid}`);
  }
}

// ==========================================
// 4. ASSOCIATIONS (Parent -> Élève, Élève -> Classe)
// ==========================================

/**
 * Direction associates Parent User to Student
 */
export async function associateParentToStudentInFirestore(
  studentId: string, 
  parentAccount: { uid: string; name: string; email: string; phone?: string }
): Promise<void> {
  const studentPath = 'students';
  const userPath = 'users';

  try {
    // 1. Update student document
    await updateDoc(doc(db, studentPath, studentId), {
      parentId: parentAccount.uid,
      parentName: parentAccount.name,
      parentEmail: parentAccount.email,
      parentPhone: parentAccount.phone || ''
    });

    // 2. Update parent user document (add child ID)
    const parentSnap = await getDoc(doc(db, userPath, parentAccount.uid));
    let childrenIds: string[] = [];
    if (parentSnap.exists()) {
      const data = parentSnap.data() as UserAccount;
      childrenIds = Array.from(new Set([...(data.childrenIds || []), studentId]));
    } else {
      childrenIds = [studentId];
    }

    await setDoc(doc(db, userPath, parentAccount.uid), {
      uid: parentAccount.uid,
      email: parentAccount.email,
      name: parentAccount.name,
      role: 'parent',
      status: 'Actif',
      phone: parentAccount.phone || '',
      childrenIds: childrenIds,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 3. Log activity
    await logActivityInFirestore({
      type: 'parent_associated',
      title: 'Association Parent → Élève certifiée',
      description: `L'accès parental pour l'élève (${studentId}) a été officiellement attribué au compte de ${parentAccount.name} (${parentAccount.email}).`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: `${parentAccount.name} ➔ Élève ${studentId}`,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `association/${studentId}`);
  }
}

/**
 * Direction associates Student to Class
 */
export async function associateStudentToClassInFirestore(
  studentId: string, 
  newClassName: string, 
  studentName?: string
): Promise<void> {
  const path = 'students';
  try {
    await updateDoc(doc(db, path, studentId), {
      class: newClassName
    });

    await logActivityInFirestore({
      type: 'student_updated',
      title: 'Changement / Affectation de classe',
      description: `L'élève ${studentName || studentId} a été affecté à la classe de ${newClassName}.`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: `${studentName || studentId} ➔ ${newClassName}`,
      category: 'admin'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${studentId}`);
  }
}

// ==========================================
// 5. ACTIVITY LOGS & AUDIT AUDIENCE
// ==========================================

export async function fetchActivityLogsFromFirestore(): Promise<ActivityLog[]> {
  const path = 'activity_logs';
  try {
    const snap = await getDocs(query(collection(db, path), limit(25)));
    if (snap.empty) {
      return INITIAL_ACTIVITY_LOGS;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
  } catch (error) {
    console.warn('Error fetching activity logs:', error);
    return INITIAL_ACTIVITY_LOGS;
  }
}

export function subscribeToActivityLogs(callback: (logs: ActivityLog[]) => void) {
  const path = 'activity_logs';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
        callback(list);
      } else {
        callback(INITIAL_ACTIVITY_LOGS);
      }
    }, (err) => {
      console.warn('Activity logs snapshot error:', err);
      callback(INITIAL_ACTIVITY_LOGS);
    });
  } catch (e) {
    callback(INITIAL_ACTIVITY_LOGS);
    return () => {};
  }
}

export async function logActivityInFirestore(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
  const path = 'activity_logs';
  const id = `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const now = new Date();
  const timeStr = `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const logItem: ActivityLog = {
    id,
    ...activity,
    timestamp: timeStr
  };

  try {
    await setDoc(doc(db, path, id), logItem);
  } catch (e) {
    console.warn('Could not record activity log to Firestore:', e);
  }
}

// ==========================================
// 6. CIRCULARS & EMERGENCY BROADCASTS
// ==========================================

export async function createCircularInFirestore(circularData: Omit<Circular, 'id' | 'createdAt'>): Promise<Circular> {
  const path = 'circulars';
  const id = `circ_${Date.now()}`;
  const newCirc: Circular = {
    id,
    ...circularData,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, path, id), newCirc);

    // Also write into school documents so parents/teachers can download
    await setDoc(doc(db, 'school_documents', id), {
      id,
      title: circularData.title,
      category: 'direction',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      size: '240 Ko',
      issuer: 'Direction Générale',
      badge: circularData.urgent ? 'URGENT' : 'Circulaire',
      badgeColor: circularData.urgent ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800',
      description: circularData.message,
      requiresSignature: false
    });

    await logActivityInFirestore({
      type: circularData.urgent ? 'alert_sent' : 'circular_sent',
      title: circularData.urgent ? 'Alerte Flash Urgence émise' : 'Circulaire administrative publiée',
      description: `${circularData.title} (Cible: ${circularData.target})`,
      actorName: 'Direction Générale',
      actorRole: 'direction',
      targetName: circularData.target,
      category: 'system'
    });

    return newCirc;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    return newCirc;
  }
}

// Add an attendance record to Firestore
export async function addAttendanceToFirestore(record: AttendanceRecord) {
  const path = 'attendance_records';
  try {
    await setDoc(doc(db, path, record.id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Update a timeline event (e.g. sign or acknowledge)
export async function updateTimelineEventInFirestore(eventId: string, updates: Partial<TimelineEvent>) {
  const path = 'timeline_events';
  try {
    await updateDoc(doc(db, path, eventId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Add a timeline event to Firestore
export async function addTimelineEventInFirestore(event: TimelineEvent) {
  const path = 'timeline_events';
  try {
    await setDoc(doc(db, path, event.id), event);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to timeline events for a specific student (or school-wide events)
export function subscribeToTimelineEvents(studentId: string, callback: (events: TimelineEvent[]) => void) {
  const path = 'timeline_events';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        const allEvents = snap.docs.map(d => ({ id: d.id, ...d.data() } as TimelineEvent));
        const filtered = allEvents.filter(e => !e.studentId || e.studentId === studentId || e.studentId === 'all' || e.studentId === 'awa');
        callback(filtered.length > 0 ? filtered : allEvents);
      } else {
        const filtered = TIMELINE_EVENTS_DATA.filter(e => !e.studentId || e.studentId === studentId || e.studentId === 'all');
        callback(filtered.length > 0 ? filtered : TIMELINE_EVENTS_DATA);
      }
    }, (err) => {
      console.warn('Timeline events snapshot error:', err);
      callback(TIMELINE_EVENTS_DATA.filter(e => !e.studentId || e.studentId === studentId || e.studentId === 'all'));
    });
  } catch (e) {
    callback(TIMELINE_EVENTS_DATA);
    return () => {};
  }
}

// Subscribe to attendance records for a specific student
export function subscribeToAttendance(studentId: string, callback: (records: AttendanceRecord[]) => void) {
  const path = 'attendance_records';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        const allRecords = snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord));
        const filtered = allRecords.filter(r => r.studentId === studentId);
        callback(filtered);
      } else {
        callback(ATTENDANCE_RECORDS_AWA.filter(r => r.studentId === studentId || studentId === 'awa'));
      }
    }, (err) => {
      console.warn('Attendance snapshot error:', err);
      callback(ATTENDANCE_RECORDS_AWA);
    });
  } catch (e) {
    callback(ATTENDANCE_RECORDS_AWA);
    return () => {};
  }
}

// Subscribe to school documents & circulars
export function subscribeToSchoolDocuments(callback: (docs: SchoolDocument[]) => void) {
  const path = 'school_documents';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolDocument)));
      } else {
        callback(SCHOOL_DOCUMENTS_DATA);
      }
    }, (err) => {
      console.warn('School documents snapshot error:', err);
      callback(SCHOOL_DOCUMENTS_DATA);
    });
  } catch (e) {
    callback(SCHOOL_DOCUMENTS_DATA);
    return () => {};
  }
}

// Subscribe to Message Threads
export function subscribeToMessageThreads(callback: (threads: MessageThread[]) => void) {
  const path = 'message_threads';
  try {
    return onSnapshot(collection(db, path), (snap) => {
      if (!snap.empty) {
        callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as MessageThread)));
      } else {
        callback(MESSAGE_THREADS_DATA);
      }
    }, (err) => {
      console.warn('Message threads snapshot error:', err);
      callback(MESSAGE_THREADS_DATA);
    });
  } catch (e) {
    callback(MESSAGE_THREADS_DATA);
    return () => {};
  }
}

// Helper: Build canonical thread ID
export function getCanonicalThreadId(parentIdentifier?: string, teacherIdentifier?: string): string {
  const cleanP = (parentIdentifier || 'parent').toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanT = (teacherIdentifier || 'teacher').toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  return `thread_${cleanP}_${cleanT}`;
}

// Helper: Match an existing thread in Firestore by multiple robust criteria
export function findMatchingThread(
  threads: MessageThread[],
  parent?: { uid?: string; email?: string; name?: string },
  teacher?: { uid?: string; email?: string; name?: string },
  studentId?: string
): MessageThread | undefined {
  if (!threads || threads.length === 0) return undefined;

  const pUid = parent?.uid?.toLowerCase().trim() || '';
  const pEmail = parent?.email?.toLowerCase().trim() || '';
  const pName = parent?.name?.toLowerCase().trim() || '';

  const tUid = teacher?.uid?.toLowerCase().trim() || '';
  const tEmail = teacher?.email?.toLowerCase().trim() || '';
  const tName = teacher?.name?.toLowerCase().trim() || '';
  const sId = studentId?.toLowerCase().trim() || '';

  return threads.find(t => {
    const tid = (t.id || '').toLowerCase();
    const tParentId = (t.parentId || '').toLowerCase();
    const tParentEmail = (t.parentEmail || '').toLowerCase();
    const tTeacherId = (t.teacherId || '').toLowerCase();
    const tTeacherEmail = (t.teacherEmail || '').toLowerCase();
    const tContactName = (t.contactName || '').toLowerCase();

    // 1. Exact or canonical threadId matching
    if (pUid && (tid === `thread_${pUid}_teacher` || tid === `thread_${pUid}`)) return true;
    if (pUid && tUid && (tid === `thread_${pUid}_${tUid}` || tid === `thread_${tUid}_${pUid}`)) return true;
    if (pUid && tEmail && (tid === getCanonicalThreadId(pUid, tEmail).toLowerCase() || tid.includes(pUid))) {
      // If thread has teacher metadata or matching email
      if (!tTeacherId || tTeacherId === tUid || tTeacherEmail === tEmail || tid.includes(tEmail.replace(/[^a-zA-Z0-9_-]/g, '_'))) {
        return true;
      }
    }
    if (pEmail && tid.includes(pEmail.replace(/[^a-zA-Z0-9_-]/g, '_'))) return true;
    if (tUid && sId && tid === `thread_${tUid}_${sId}` && (!pUid || tParentId === pUid || tid.includes(pUid))) return true;

    // 2. Metadata field matches
    const parentMatchesMeta = (pUid && tParentId === pUid) || 
                             (pEmail && tParentEmail === pEmail) ||
                             (pEmail && tParentEmail && tParentEmail.includes(pEmail)) ||
                             (pName && t.parentName && t.parentName.toLowerCase().includes(pName));

    const teacherMatchesMeta = (tUid && tTeacherId === tUid) || 
                              (tEmail && tTeacherEmail === tEmail) || 
                              (tName && t.teacherName && t.teacherName.toLowerCase().includes(tName)) ||
                              (!tTeacherId && !tTeacherEmail);

    if (parentMatchesMeta && teacherMatchesMeta) return true;

    // 3. Contact name matches
    if (pName && (tContactName.includes(pName) || pName.includes(tContactName))) {
      if (tUid && tTeacherId && tTeacherId !== tUid) return false;
      return true;
    }
    if (tName && (tContactName.includes(tName) || tName.includes(tContactName))) {
      if (pUid && tParentId && tParentId !== pUid) return false;
      return true;
    }

    // 4. Scan messages in thread for participant matching
    if (t.messages && t.messages.length > 0) {
      const hasParentMsg = t.messages.some(m => {
        const sName = (m.senderName || '').toLowerCase();
        const rName = (m.recipientName || '').toLowerCase();
        const sid = (m.senderId || '').toLowerCase();
        const rid = (m.recipientId || '').toLowerCase();
        return (pUid && (sid === pUid || rid === pUid)) ||
               (pEmail && (sName.includes(pEmail) || rName.includes(pEmail))) ||
               (pName && (sName.includes(pName) || rName.includes(pName)));
      });

      const hasTeacherMsg = t.messages.some(m => {
        const sName = (m.senderName || '').toLowerCase();
        const rName = (m.recipientName || '').toLowerCase();
        const sid = (m.senderId || '').toLowerCase();
        const rid = (m.recipientId || '').toLowerCase();
        return (tUid && (sid === tUid || rid === tUid)) ||
               (tEmail && (sName.includes(tEmail) || rName.includes(tEmail))) ||
               (tName && (sName.includes(tName) || rName.includes(tName)));
      });

      if (hasParentMsg && (hasTeacherMsg || (!tUid && !tEmail && !tName))) return true;
    }

    return false;
  });
}

// Send a message to a thread in Firestore with rich metadata
export async function sendMessageToThreadInFirestore(
  threadId: string, 
  message: any,
  threadMeta?: Partial<MessageThread>
): Promise<void> {
  const path = 'message_threads';
  try {
    const threadRef = doc(db, path, threadId);
    const snap = await getDoc(threadRef);
    if (snap.exists()) {
      const data = snap.data() as MessageThread;
      const updatedMessages = [...(data.messages || []), message];
      await updateDoc(threadRef, {
        messages: updatedMessages,
        lastMessageTime: message.time || 'À l\'instant',
        updatedAt: new Date().toISOString(),
        ...(threadMeta || {})
      });
    } else {
      await setDoc(threadRef, {
        id: threadId,
        contactName: message.recipientName || threadMeta?.contactName || 'Interlocuteur',
        contactRole: message.recipientRole || threadMeta?.contactRole || 'Enseignant / Établissement',
        lastMessageTime: message.time || 'À l\'instant',
        unreadCount: 0,
        studentContext: message.studentContext || threadMeta?.studentContext || 'Liaison scolaire',
        messages: [message],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(threadMeta || {})
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${threadId}`);
  }
}

