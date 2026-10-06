export type UserRole = 'parent' | 'enseignant' | 'direction' | 'eleve' | 'user';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
  level: string;
  matricule: string;
  photoUrl: string;
  generalAverage: number;
  attendanceRate: number;
  rank: number;
  totalStudents: number;
  honors: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentId?: string;
  classId?: string;
  gender?: 'M' | 'F';
  birthDate?: string;
  address?: string;
  emergencyContact?: string;
  enrollmentDate?: string;
  status?: 'En règle' | 'À régulariser' | 'Inscrit' | 'Suspendu';
  isDelegue?: boolean;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  room: string;
  academicYear: string;
  studentCount?: number;
  mainTeacherId?: string;
  mainTeacherName?: string;
  subjects?: string[];
  createdAt?: string;
}

export interface UserAccount {
  uid: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phone?: string;
  status: 'Actif' | 'En attente' | 'Suspendu';
  assignedClasses?: string[];
  subjects?: string[];
  childrenIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  type: 'student_created' | 'student_updated' | 'class_created' | 'class_updated' | 'role_assigned' | 'parent_associated' | 'teacher_assigned' | 'circular_sent' | 'alert_sent' | 'login';
  title: string;
  description: string;
  actorName: string;
  actorRole: string;
  targetName?: string;
  timestamp: string;
  category: 'admin' | 'pedagogie' | 'vie_scolaire' | 'system';
}

export interface Circular {
  id: string;
  title: string;
  target: 'all' | 'college' | 'lycee' | 'teachers' | string;
  message: string;
  urgent: boolean;
  author: string;
  createdAt: string;
}

export interface SubjectGrade {
  id: string;
  subject: string;
  coefficient: number;
  teacher: string;
  average: number;
  classAverage: number;
  rankInClass?: number;
  icon: string;
  colorClass: string;
  evaluations: {
    name: string;
    score: number;
    maxScore: number;
    coefficient: number;
    date: string;
  }[];
  appreciation: string;
}

export interface TimelineEvent {
  id: string;
  studentId: string;
  title: string;
  category: 'eval' | 'signature' | 'pedagogie' | 'vie-scolaire' | 'ecole';
  date: string;
  time: string;
  dayGroup: 'today' | 'yesterday' | 'monday' | 'earlier';
  author: string;
  authorRole: string;
  content: string;
  details?: string;
  requiresSignature?: boolean;
  isSigned?: boolean;
  signedAt?: string;
  signedBy?: string;
  score?: number;
  maxScore?: number;
  coefficient?: number;
  classAverage?: number;
  maxClassScore?: number;
  rank?: number;
  attachmentName?: string;
  attachmentSize?: string;
  meetingDate?: string;
  meetingRoom?: string;
  isConfirmed?: boolean;
  statusText?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'retard' | 'absence-jour' | 'absence-longue' | 'depart-anticipe';
  duration: string;
  motif: string;
  isJustified: boolean;
  justificationType?: string;
  validatedBy: string;
  documentUrl?: string;
  status: 'valide' | 'en_attente' | 'rejete';
  details?: string;
}

export interface SchoolDocument {
  id: string;
  title: string;
  category: 'direction' | 'reglements' | 'examens' | 'scolarite';
  date: string;
  size: string;
  issuer: string;
  badge?: string;
  badgeColor?: string;
  verifiedBy?: string;
  requiresSignature?: boolean;
  isSigned?: boolean;
  signedAt?: string;
  downloadUrl?: string;
  description?: string;
}

export interface MessageThread {
  id: string;
  parentId?: string;
  parentEmail?: string;
  parentName?: string;
  parentPhone?: string;
  teacherId?: string;
  teacherEmail?: string;
  teacherName?: string;
  studentId?: string;
  studentName?: string;
  studentClass?: string;
  contactName: string;
  contactRole: string;
  avatarUrl?: string;
  initials?: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  studentContext: string;
  messages: {
    id: string;
    sender: 'parent' | 'teacher' | 'school' | 'direction';
    senderName: string;
    senderId?: string;
    recipientName?: string;
    recipientRole?: string;
    recipientId?: string;
    studentContext?: string;
    time: string;
    date: string;
    text: string;
    isOfficial?: boolean;
    requiresSignature?: boolean;
    isSigned?: boolean;
    signedBy?: string;
    signedAt?: string;
    appointmentProposal?: {
      date: string;
      time: string;
      room: string;
      status: 'pending' | 'accepted' | 'declined';
    };
    attachment?: {
      name: string;
      size: string;
      type: string;
    };
  }[];
}

export interface TeacherScheduleSlot {
  id: string;
  day: 'LUN' | 'MAR' | 'MER' | 'JEU' | 'VEN';
  dayNumber: number;
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  room: string;
  topic: string;
  type: 'course' | 'exam' | 'remediation' | 'office';
  status: 'done' | 'active' | 'upcoming';
  studentCount?: number;
}
