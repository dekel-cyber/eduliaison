import { Student, SubjectGrade, TimelineEvent, AttendanceRecord, SchoolDocument, MessageThread, TeacherScheduleSlot } from '../types';

export const STUDENTS_DATA: Student[] = [
  {
    id: 'awa',
    firstName: 'Awa',
    lastName: 'Kouamé',
    class: '3ème A',
    level: '3ème',
    matricule: '2021-AK44',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyCWO6vRgTWSq1hrAfnHXeaak3P2Bcsvus6vJkhDzJ4nif1x5A-o4UN_xlMuu68aPm4NXCzl3opcU_n0TpN0UvPK6i58O5ZaYgVH-R8r-EqK7McDfxf4OVR6uq5INjd31D9XdD4BeX_sS09BFmQt0OrG45L0m5Q_VOqrvhu-2mWMeVkl0VwbSUH8lGaf_DF2gq7_zKnCe3jBB_i6BpcOi12bKcSi4pOyK4e-oRglqY2p4vMpsqHnWzuA',
    generalAverage: 15.8,
    attendanceRate: 98.5,
    rank: 3,
    totalStudents: 42,
    honors: 'Tableau d\'Honneur & Félicitations',
    parentName: 'M. Koffi Kouamé',
    parentPhone: '+225 07 00 12 34 56',
    parentEmail: 'koffi.kouame@eduliaison.ci',
    isDelegue: true
  },
  {
    id: 'david',
    firstName: 'David',
    lastName: 'Kouamé',
    class: '6ème B',
    level: '6ème',
    matricule: '2024-DK12',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-V80tIzB0jhA_ZKof11DFHnkNDpg_Wi57zGrcJHz9Fb0fZxduGf60jzuslhaFT0kVWDX8UiTduEswnl3gNWTrvZmoxPGGP0GxSD3CwlI9-z6W9SSEVM6VvV1XCo3sgM8FGfy0SczRFn-Xqbp7Nai6aRoxHCilngVaSxiNMBDEyUquobENsoRtm4Y6F8ijwywagM1QiRb0UNNCVJri4syh_LnqmVLN90xUuZSe2fBRaooQr_eh93rPAA',
    generalAverage: 14.2,
    attendanceRate: 95.0,
    rank: 8,
    totalStudents: 38,
    honors: 'Encouragements du Conseil',
    parentName: 'M. Koffi Kouamé',
    parentPhone: '+225 07 00 12 34 56',
    parentEmail: 'koffi.kouame@eduliaison.ci',
    isDelegue: false
  }
];

export const SUBJECTS_GRADES_AWA: SubjectGrade[] = [
  {
    id: 'maths',
    subject: 'Mathématiques',
    coefficient: 3,
    teacher: 'M. Kouakou Bertin',
    average: 17.0,
    classAverage: 12.4,
    rankInClass: 2,
    icon: 'functions',
    colorClass: 'bg-primary-fixed text-primary',
    evaluations: [
      { name: 'Interrogation 1', score: 16, maxScore: 20, coefficient: 1, date: '15 Jan 2025' },
      { name: 'Interrogation 2', score: 18, maxScore: 20, coefficient: 1, date: '04 Fév 2025' },
      { name: 'Devoir Surveillé N°3', score: 17, maxScore: 20, coefficient: 2, date: '12 Mars 2025' }
    ],
    appreciation: 'Très bon travail, raisonnement rigoureux et participation très constructive en classe. Continuez ainsi.'
  },
  {
    id: 'francais',
    subject: 'Français & Littérature',
    coefficient: 3,
    teacher: 'Mme Aya Touré (PP)',
    average: 15.5,
    classAverage: 13.1,
    rankInClass: 4,
    icon: 'menu_book',
    colorClass: 'bg-surface-container text-on-surface',
    evaluations: [
      { name: 'Devoir Type Examen', score: 15, maxScore: 20, coefficient: 2, date: '22 Jan 2025' },
      { name: 'Oral / Exposé Droits Homme', score: 18, maxScore: 20, coefficient: 1, date: '12 Mars 2025' },
      { name: 'Dissertation littéraire', score: 16.5, maxScore: 20, coefficient: 2, date: '01 Mars 2025' }
    ],
    appreciation: 'Élève motrice et excellente expression écrite. Awa fait preuve d\'une belle finesse d\'analyse dans ses argumentations.'
  },
  {
    id: 'physique',
    subject: 'Physique - Chimie',
    coefficient: 2,
    teacher: 'Dr. N\'Guessan Yao',
    average: 16.0,
    classAverage: 11.8,
    rankInClass: 1,
    icon: 'science',
    colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    evaluations: [
      { name: 'Travaux Pratiques', score: 17, maxScore: 20, coefficient: 1, date: '28 Jan 2025' },
      { name: 'Devoir Synthèse Électricité', score: 15.5, maxScore: 20, coefficient: 2, date: '18 Fév 2025' }
    ],
    appreciation: 'Esprit scientifique aiguisé. Manipulation impeccable en laboratoire. Félicitations.'
  },
  {
    id: 'svt',
    subject: 'Sciences de la Vie et de la Terre (SVT)',
    coefficient: 2,
    teacher: 'M. Diallo Oumar',
    average: 14.0,
    classAverage: 12.1,
    rankInClass: 6,
    icon: 'eco',
    colorClass: 'bg-tertiary-fixed text-tertiary',
    evaluations: [
      { name: 'Devoir N°1 Génétique', score: 13.5, maxScore: 20, coefficient: 2, date: '10 Fév 2025' },
      { name: 'Interrogation Flash', score: 14.5, maxScore: 20, coefficient: 1, date: '25 Fév 2025' }
    ],
    appreciation: 'Bonne compréhension des concepts biologiques. Travail soigné et régulier.'
  },
  {
    id: 'anglais',
    subject: 'Anglais LV1',
    coefficient: 2,
    teacher: 'Mrs. Mensah Cynthia',
    average: 16.5,
    classAverage: 13.0,
    rankInClass: 3,
    icon: 'language',
    colorClass: 'bg-secondary-fixed text-secondary',
    evaluations: [
      { name: 'Oral Speaking test', score: 17.0, maxScore: 20, coefficient: 1, date: '14 Fév 2025' },
      { name: 'Grammar & Essay', score: 16.0, maxScore: 20, coefficient: 2, date: '03 Mars 2025' }
    ],
    appreciation: 'Outstanding oral fluency and strong grammar command. Very active participation.'
  },
  {
    id: 'histgeo',
    subject: 'Histoire - Géographie',
    coefficient: 2,
    teacher: 'M. Kassi Daniel',
    average: 15.0,
    classAverage: 12.8,
    rankInClass: 5,
    icon: 'public',
    colorClass: 'bg-surface-container text-on-surface',
    evaluations: [
      { name: 'Cartographie Afrique', score: 16.0, maxScore: 20, coefficient: 1, date: '08 Fév 2025' },
      { name: 'Synthèse historique', score: 14.0, maxScore: 20, coefficient: 2, date: '27 Fév 2025' }
    ],
    appreciation: 'Raisonnement historique bien étayé. Connaissance solide des repères spatiaux.'
  },
  {
    id: 'arts',
    subject: 'Arts Plastiques & Culture',
    coefficient: 1,
    teacher: 'Mme Koffi Estelle',
    average: 17.0,
    classAverage: 14.2,
    rankInClass: 2,
    icon: 'palette',
    colorClass: 'bg-surface-container-high text-on-surface',
    evaluations: [
      { name: 'Projet Créatif Masque Akan', score: 17.0, maxScore: 20, coefficient: 1, date: '20 Fév 2025' }
    ],
    appreciation: 'Créativité vive et excellente recherche documentaire sur le patrimoine ivoirien.'
  },
  {
    id: 'eps',
    subject: 'Éducation Physique & Sportive',
    coefficient: 1,
    teacher: 'M. Bamba Souleymane',
    average: 15.0,
    classAverage: 13.5,
    rankInClass: 10,
    icon: 'sports_handball',
    colorClass: 'bg-surface-container text-on-surface',
    evaluations: [
      { name: 'Demi-fond & Basket-ball', score: 15.0, maxScore: 20, coefficient: 1, date: '05 Mars 2025' }
    ],
    appreciation: 'Esprit d\'équipe exemplaire et bel engagement dans les épreuves d\'endurance.'
  }
];

export const TIMELINE_EVENTS_DATA: TimelineEvent[] = [
  {
    id: 'evt-1',
    studentId: 'awa',
    title: 'Devoir Surveillé N°3 — Géométrie Vectorielle (17 / 20)',
    category: 'eval',
    date: '12 Mars 2025',
    time: '10:15',
    dayGroup: 'today',
    author: 'M. Traoré (Mathématiques)',
    authorRole: 'Enseignant Certifié',
    content: 'Évaluation sommative de mi-trimestre. Excellent raisonnement sur les démonstrations de colinéarité et propriétés des vecteurs.',
    score: 17,
    maxScore: 20,
    coefficient: 3,
    classAverage: 12.4,
    maxClassScore: 19.0,
    rank: 3,
    statusText: 'Mention Très Bien'
  },
  {
    id: 'evt-2',
    studentId: 'awa',
    title: 'Évaluation de SVT — Chapitre : Génétique Humaine',
    category: 'eval',
    date: '12 Mars 2025',
    time: '08:30',
    dayGroup: 'today',
    author: 'M. Diallo (SVT)',
    authorRole: 'Enseignant',
    content: 'Devoir sur table d\'1 heure portant sur les arbres généalogiques et la transmission des allèles. Prévu pour ce Vendredi 14 Mars.',
    attachmentName: 'Fiche_Revision_Genetique_3A.pdf',
    attachmentSize: '1.2 Mo'
  },
  {
    id: 'evt-3',
    studentId: 'awa',
    title: 'Observation Pédagogique — Français',
    category: 'pedagogie',
    date: '11 Mars 2025',
    time: '14:00',
    dayGroup: 'yesterday',
    author: 'Mme Aya Touré',
    authorRole: 'Professeur Principal (3ème A)',
    content: '« Excellente prise de parole et argumentation remarquable sur l\'œuvre au programme ce mardi lors du débat thématique. Une maturité exemplaire qui dynamise toute la classe. Continue ainsi ! »',
    statusText: 'Lu par le parent'
  },
  {
    id: 'evt-4',
    studentId: 'awa',
    title: 'Organisation des Journées Pédagogiques du 27 Mars',
    category: 'ecole',
    date: '11 Mars 2025',
    time: '11:30',
    dayGroup: 'yesterday',
    author: 'Direction Générale',
    authorRole: 'Secrétariat Général',
    content: 'Les cours seront suspendus pour l\'ensemble des élèves le jeudi 27 mars toute la journée afin de permettre le séminaire académique des enseignants. Reprise normale le vendredi 28 à 07h30.'
  },
  {
    id: 'evt-5',
    studentId: 'awa',
    title: 'Retard en 1ère Heure (15 minutes) — Justifié',
    category: 'vie-scolaire',
    date: '10 Mars 2025',
    time: '07:45',
    dayGroup: 'monday',
    author: 'M. Bakary Koné (CPE)',
    authorRole: 'Conseiller Principal d\'Éducation',
    content: 'Motif : Embouteillages majeurs signalés sur le Boulevard Lagunaire. Billet d\'entrée en cours de Mathématiques délivré et visé.',
    statusText: 'Justifié par Parent'
  },
  {
    id: 'evt-6',
    studentId: 'awa',
    title: 'Réunion Parents-Professeurs de Mi-Parcours (T2)',
    category: 'ecole',
    date: '07 Mars 2025',
    time: '15:00',
    dayGroup: 'earlier',
    author: 'Administration Collège',
    authorRole: 'Direction des Études',
    content: 'Entretien individuel de 15 minutes avec l\'équipe pédagogique pour faire le point sur les choix d\'orientation post-3ème et la préparation au BEPC.',
    meetingDate: 'Samedi 22 Mars à 09h45',
    meetingRoom: 'Salle 104',
    isConfirmed: true
  }
];

export const ATTENDANCE_RECORDS_AWA: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'awa',
    date: '10 Mars 2025',
    type: 'retard',
    duration: '15 minutes',
    motif: 'Forte congestion routière sur le Boulevard Lagunaire suite à un incident.',
    isJustified: true,
    justificationType: 'Trafic / Transports',
    validatedBy: 'M. Bakary Koné (CPE)',
    status: 'valide',
    details: 'Arrivée à 07h45 (au lieu de 07h30). Billet d\'entrée délivré.'
  },
  {
    id: 'att-2',
    studentId: 'awa',
    date: '20 Février 2025',
    type: 'absence-jour',
    duration: '4 heures (Matinée)',
    motif: 'Consultation médicale d\'urgence (Soins dentaires urgents).',
    isJustified: true,
    justificationType: 'Certificat Médical',
    validatedBy: 'M. Bakary Koné (CPE)',
    documentUrl: 'Certificat_Medical_Dr_Kouassi.pdf',
    status: 'valide',
    details: 'Certificat délivré par le Dr Kouassi (Clinique Farah) transmis et archivé.'
  },
  {
    id: 'att-3',
    studentId: 'awa',
    date: '15 Janvier 2025',
    type: 'retard',
    duration: '10 minutes',
    motif: 'Panne mécanique sur véhicule familial au départ du domicile.',
    isJustified: true,
    justificationType: 'Mot signé du parent',
    validatedBy: 'M. Bakary Koné (CPE)',
    status: 'valide',
    details: 'Arrivée à 07h40. Dispense acceptée et clôturée.'
  }
];

export const SCHOOL_DOCUMENTS_DATA: SchoolDocument[] = [
  {
    id: 'doc-1',
    title: 'Organisation des Journées Pédagogiques & Conseils de Classe',
    category: 'direction',
    date: '11 Mars 2025',
    size: '450 Ko',
    issuer: 'Direction des Études',
    badge: 'Nouveau',
    badgeColor: 'bg-primary-fixed text-primary',
    verifiedBy: 'Signé par Proviseur',
    description: 'Planning des commissions pédagogiques et arrêt des notes trimestrielles.'
  },
  {
    id: 'doc-2',
    title: 'Calendrier Officiel des Épreuves Blanches BEPC 2025',
    category: 'examens',
    date: '08 Mars 2025',
    size: '520 Ko',
    issuer: 'Examens & Concours',
    badge: 'Important',
    badgeColor: 'bg-secondary-fixed text-secondary',
    description: 'Convocation jointe en page 3, horaires de passage et consignes de table.'
  },
  {
    id: 'doc-3',
    title: 'Circulaire sur les Tenues Réglementaires et Uniformes Scolaires',
    category: 'reglements',
    date: '22 Février 2025',
    size: '310 Ko',
    issuer: 'Vie Scolaire & Discipline',
    verifiedBy: 'Censeur des Études',
    description: 'Rappel des normes vestimentaires et équipements autorisés.'
  },
  {
    id: 'doc-4',
    title: 'Menu de la Cantine Scolaire — Mois de Mars 2025',
    category: 'reglements',
    date: '01 Mars 2025',
    size: '280 Ko',
    issuer: 'Service Restauration & Internat',
    verifiedBy: 'Validé par Nutritionniste',
    description: 'Menus équilibrés et programmes des collations hebdomadaires.'
  },
  {
    id: 'doc-5',
    title: 'Reçu de Paiement Écolage — Trimestre 2 (Année 2024-2025)',
    category: 'scolarite',
    date: '15 Janvier 2025',
    size: '180 Ko',
    issuer: 'Intendance & Caisse',
    badge: 'Paiement Validé',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    description: 'Réf: REC-2025-09823 • Règlement soldé pour Awa Kouamé.'
  },
  {
    id: 'doc-6',
    title: 'Fiche d\'Urgence Médicale et Autorisations Parentales',
    category: 'reglements',
    date: '28 Septembre 2024',
    size: '340 Ko',
    issuer: 'Infirmerie Scolaire',
    badge: 'Archivé',
    badgeColor: 'bg-surface-container-high text-on-surface-variant',
    verifiedBy: 'Validé par Dr. Touré',
    description: 'Fiche médicale annuelle et personnes à contacter en cas d\'urgence.'
  }
];

export const MESSAGE_THREADS_DATA: MessageThread[] = [
  {
    id: 'thread-toure',
    contactName: 'Mme Aya Touré',
    contactRole: 'Professeur Principal • Français 3ème A',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDE38sw5h3Uz2alcPm3hAKHKO7NvYGQSvqmF0GMBUS-8g37jOH1wZUNOXOMPxi7ksRs7EvMBlvxMii1hOmVgXMOJArMQQHDB4eNi9kq-F3WuWJ_eZk9Y8i-z4n4B20s2GVcpFh8JIhlwLl5oHbS9sOUb2wfsCIDtPQDET0K640uw9JZ9J7IaGxYg8JcmkEurnT9U4VIVNHE2Fbemrgdfmv1NsFpQ5volIwN8aQHJOL-WX9kEtCW5AvIQ',
    lastMessageTime: '10:45',
    unreadCount: 1,
    isOnline: true,
    studentContext: 'Awa Kouamé (Classe de 3ème A)',
    messages: [
      {
        id: 'msg-1',
        sender: 'teacher',
        senderName: 'Mme Aya Touré',
        time: '09:15',
        date: 'Aujourd\'hui',
        text: 'Bonjour M. Kouamé, je tenais à vous féliciter pour l\'engagement d\'Awa lors de notre exposé d\'Éducation aux Droits de l\'Homme ce matin. Elle fait preuve d\'une excellente maturité et sa note de 18/20 consolide sa candidature pour la série scientifique de premier choix.',
        isOfficial: true,
        requiresSignature: true,
        isSigned: true,
        signedBy: 'M. Koffi Kouamé',
        signedAt: '12/03 à 09:30'
      },
      {
        id: 'msg-2',
        sender: 'parent',
        senderName: 'M. Koffi Kouamé',
        time: '09:48',
        date: 'Aujourd\'hui',
        text: 'Bonjour Madame Touré, merci beaucoup pour ce retour très encourageant. Nous veillons également à la maison à ce qu\'elle conserve ce rythme studieux. Pour la réunion de vendredi, le créneau de 16h30 est parfait pour moi.'
      },
      {
        id: 'msg-3',
        sender: 'teacher',
        senderName: 'Mme Aya Touré',
        time: '10:45',
        date: 'Aujourd\'hui',
        text: 'Parfait, je vous note pour 16h30 en salle Polyvalente. N\'hésitez pas à m\'indiquer si vous souhaitez que nous abordions en priorité ses choix d\'orientation pour la classe de 2nde générale ou scientifique.',
        appointmentProposal: {
          date: 'Vendredi 14 Mars',
          time: '16h30',
          room: 'Salle B12 (Polyvalente)',
          status: 'pending'
        },
        attachment: {
          name: 'Fiche_Orientation_3eme_Option_Sciences.pdf',
          size: '420 Ko',
          type: 'pdf'
        }
      }
    ]
  },
  {
    id: 'thread-kone',
    contactName: 'M. Bakary Koné',
    contactRole: 'CPE • Vie Scolaire Collège',
    initials: 'BK',
    lastMessageTime: 'Lundi',
    unreadCount: 0,
    isOnline: true,
    studentContext: 'Awa Kouamé (Classe de 3ème A)',
    messages: [
      {
        id: 'msg-k1',
        sender: 'parent',
        senderName: 'M. Koffi Kouamé',
        time: '07:35',
        date: '10 Mars',
        text: 'Bonjour M. le CPE, Awa aura environ 15 minutes de retard ce matin suite à un accident majeur sur le pont De Gaulle bloquant la circulation.'
      },
      {
        id: 'msg-k2',
        sender: 'school',
        senderName: 'M. Bakary Koné',
        time: '07:50',
        date: '10 Mars',
        text: 'Bien noté M. Kouamé. Le justificatif a été validé et un billet d\'entrée a été délivré à Awa dès son arrivée à 07h45.'
      }
    ]
  },
  {
    id: 'thread-traore',
    contactName: 'M. S. Traoré',
    contactRole: 'Professeur de Mathématiques',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVI6dZanKDiByS9LHr7OVewr2zDSd46hcFndrzGuaS4wJ-P9BwO2rfEAtCgJkYm6GyOl2jm6_-jgPd_d95PMsILjEkYfGesoRkj31lmNimw5DiNAmdTPsl58xgv8_vfGfl5IHjZa9HRpleqVYabl95nbV5pkStcw0yB-k3Fpbsor0-wIxQBK7LKKej3UXC3bNRsO18FFUl5pie8GB-p_oho2ihrmcBWrlER79CrjiOXI_QxKIzceh9WQ',
    lastMessageTime: '5 Mars',
    unreadCount: 0,
    isOnline: false,
    studentContext: 'Awa Kouamé (Classe de 3ème A)',
    messages: [
      {
        id: 'msg-t1',
        sender: 'teacher',
        senderName: 'M. S. Traoré',
        time: '14:20',
        date: '5 Mars',
        text: 'Félicitations pour le dernier devoir de synthèse d\'Awa en géométrie dans l\'espace. Les progrès méthodologiques sont très nets.'
      }
    ]
  },
  {
    id: 'thread-secretariat',
    contactName: 'Secrétariat & Intendance',
    contactRole: 'Gestion Financière & Scolarité',
    initials: 'GS',
    lastMessageTime: '28 Fév',
    unreadCount: 0,
    isOnline: true,
    studentContext: 'Famille Kouamé',
    messages: [
      {
        id: 'msg-s1',
        sender: 'school',
        senderName: 'Caisse & Intendance',
        time: '11:00',
        date: '28 Fév',
        text: 'Votre reçu de paiement d\'écolage du 2ème trimestre pour Awa et David est archivé et disponible dans votre coffre-fort numérique.'
      }
    ]
  }
];

export const TEACHER_SCHEDULE_DATA: TeacherScheduleSlot[] = [
  {
    id: 'slot-1',
    day: 'MER',
    dayNumber: 12,
    startTime: '08h00',
    endTime: '10h00',
    className: '4ème C',
    subject: 'Français & Grammaire',
    room: 'Salle 102',
    topic: 'Dictée préparée, accords des participes & grammaire de phrase',
    type: 'course',
    status: 'done',
    studentCount: 44
  },
  {
    id: 'slot-2',
    day: 'MER',
    dayNumber: 12,
    startTime: '10h00',
    endTime: '12h00',
    className: '3ème A',
    subject: 'Français & Littérature',
    room: 'Salle 14 (Bâtiment B)',
    topic: 'Étude stylistique : Les Soleils des Indépendances d\'Ahmadou Kourouma',
    type: 'course',
    status: 'active',
    studentCount: 42
  },
  {
    id: 'slot-3',
    day: 'MER',
    dayNumber: 12,
    startTime: '14h00',
    endTime: '15h30',
    className: 'Soutien BEPC',
    subject: 'Remédiation de Lettres',
    room: 'Salle Polyvalente 1',
    topic: 'Atelier de méthodologie du sujet de dissertation & argumentation',
    type: 'remediation',
    status: 'upcoming',
    studentCount: 18
  },
  {
    id: 'slot-4',
    day: 'MER',
    dayNumber: 12,
    startTime: '15h30',
    endTime: '17h00',
    className: 'Bureau PP',
    subject: 'Permanence Parents',
    room: 'Salle des Professeurs',
    topic: 'Permanence d\'écoute et entretiens d\'orientation 3ème A',
    type: 'office',
    status: 'upcoming'
  }
];

export const TEACHER_GRADEBOOK_3A = [
  {
    matricule: 'CI-2023-0941',
    name: 'Kouamé Awa',
    rankT1: '2ème',
    tag: 'Assidue • Déléguée',
    initials: 'KA',
    int1: 16.0,
    int2: 18.0,
    ds1: 15.0,
    ds2: 16.5,
    calculatedAverage: 16.1,
    appreciation: 'Excellente élève, travail d\'une grande rigueur intellectuelle.',
    status: 'Validé'
  },
  {
    matricule: 'CI-2023-0882',
    name: 'Diop Aminata',
    rankT1: '7ème',
    tag: 'Active',
    initials: 'DA',
    int1: 14.0,
    int2: 13.5,
    ds1: 14.0,
    ds2: 15.0,
    calculatedAverage: 14.3,
    appreciation: 'Bon trimestre, participation très active en classe.',
    status: 'Validé'
  },
  {
    matricule: 'CI-2023-1104',
    name: 'Traoré Ibrahim',
    rankT1: '19ème',
    tag: 'Progresse',
    initials: 'TI',
    int1: 11.0,
    int2: 12.0,
    ds1: 10.5,
    ds2: 11.5,
    calculatedAverage: 11.2,
    appreciation: 'Résultats corrects mais peut progresser avec plus de régularité.',
    status: 'Enregistré'
  },
  {
    matricule: 'CI-2023-0715',
    name: 'Kassi Jean',
    rankT1: '32ème',
    tag: 'Besoins méthodologiques',
    initials: 'KJ',
    int1: 8.5,
    int2: 9.0,
    ds1: 7.5,
    ds2: 8.0,
    calculatedAverage: 8.1,
    appreciation: 'Doit approfondir les méthodes d\'analyse de texte. Soutien recommandé.',
    status: 'À réviser'
  },
  {
    matricule: 'CI-2023-0629',
    name: 'Bakayoko Fatou',
    rankT1: '1ère',
    tag: 'Major de classe',
    initials: 'BF',
    int1: 17.5,
    int2: 19.0,
    ds1: 18.0,
    ds2: 18.5,
    calculatedAverage: 18.3,
    appreciation: 'Brillant travail d\'analyse, félicitations du professeur.',
    status: 'Validé'
  }
];
