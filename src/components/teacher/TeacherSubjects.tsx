import React, { useState } from 'react';

interface SubjectClass {
  id: string;
  name: string;
  level: string;
  studentsCount: number;
  weeklyHours: number;
  coefficient: number;
  progressPercent: number;
  completedChapters: number;
  totalChapters: number;
  nextExam: string;
  room: string;
  status: 'active' | 'synced' | 'pending';
}

const INITIAL_CLASSES: SubjectClass[] = [
  {
    id: 'fr-3a',
    name: 'Français & Littérature',
    level: '3ème A (Principale)',
    studentsCount: 42,
    weeklyHours: 5,
    coefficient: 5,
    progressPercent: 68,
    completedChapters: 12,
    totalChapters: 18,
    nextExam: '15 Octobre 2026 - Devoir Surveillé N°2',
    room: 'Salle 104',
    status: 'active'
  },
  {
    id: 'fr-3b',
    name: 'Français & Expression Écrite',
    level: '3ème B',
    studentsCount: 40,
    weeklyHours: 5,
    coefficient: 5,
    progressPercent: 62,
    completedChapters: 11,
    totalChapters: 18,
    nextExam: '18 Octobre 2026 - Interrogation Écrite',
    room: 'Salle 106',
    status: 'active'
  },
  {
    id: 'fr-4c',
    name: 'Français & Grammaire Appliquée',
    level: '4ème C',
    studentsCount: 44,
    weeklyHours: 4.5,
    coefficient: 4,
    progressPercent: 74,
    completedChapters: 14,
    totalChapters: 19,
    nextExam: '22 Octobre 2026 - Évaluation de Lecture',
    room: 'Salle 202',
    status: 'synced'
  },
  {
    id: 'edhc-6a',
    name: 'Éducation aux Droits de l’Homme et Citoyenneté (EDHC)',
    level: '6ème A',
    studentsCount: 42,
    weeklyHours: 2,
    coefficient: 2,
    progressPercent: 80,
    completedChapters: 8,
    totalChapters: 10,
    nextExam: '29 Octobre 2026 - QCM & Étude de cas',
    room: 'Salle 101',
    status: 'synced'
  }
];

export const TeacherSubjects: React.FC = () => {
  const [classes, setClasses] = useState<SubjectClass[]>(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('fr-3a');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', level: '3ème C', weeklyHours: '4', coefficient: '4' });
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'resources' | 'homework'>('chapters');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    const newItem: SubjectClass = {
      id: `subj-${Date.now()}`,
      name: newSubject.name,
      level: newSubject.level,
      studentsCount: 38,
      weeklyHours: parseFloat(newSubject.weeklyHours) || 4,
      coefficient: parseInt(newSubject.coefficient) || 3,
      progressPercent: 0,
      completedChapters: 0,
      totalChapters: 16,
      nextExam: 'À programmer',
      room: 'Salle 108',
      status: 'pending'
    };
    setClasses([...classes, newItem]);
    setSelectedClassId(newItem.id);
    setShowAssignModal(false);
    setNewSubject({ name: '', level: '3ème C', weeklyHours: '4', coefficient: '4' });
    setAssignSuccess(true);
    setTimeout(() => setAssignSuccess(false), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Alert toast if assigned */}
      {assignSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-sm animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span className="font-semibold">Matière ajoutée avec succès au planning pédagogique !</span>
          </div>
          <button onClick={() => setAssignSuccess(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-100">
            <span className="material-symbols-outlined text-[15px]">auto_stories</span>
            Coordination Pédagogique & Programme National MENA
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestion des Matières & Répartitions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Suivi des programmes officiels, progression pédagogique, banques d'exercices et devoirs pour chaque cohorte.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => alert("Génération de l'export officiel MENA de la progression annuelle...")}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-600">download_for_offline</span>
            <span>Exporter la progression annuelle</span>
          </button>
          
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Assigner une classe / matière</span>
          </button>
        </div>
      </div>

      {/* Top Statistical Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:border-indigo-200 transition-colors">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Divisions Assignées</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{classes.length}</span>
            <span className="text-xs text-slate-500">classes actives</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> Titularisation MENA validée
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:border-indigo-200 transition-colors">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Total Élèves Suivis</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {classes.reduce((sum, c) => sum + c.studentsCount, 0)}
            </span>
            <span className="text-xs text-slate-500">apprenants</span>
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">group</span> 100% enregistrés
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:border-indigo-200 transition-colors">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Volume Hebdomadaire</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {classes.reduce((sum, c) => sum + c.weeklyHours, 0)}h
            </span>
            <span className="text-xs text-slate-500">par semaine</span>
          </div>
          <span className="text-[11px] text-slate-600 font-medium">Service complet certifié</span>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80 hover:border-indigo-200 transition-colors">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Progression Moyenne</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {Math.round(classes.reduce((sum, c) => sum + c.progressPercent, 0) / classes.length)}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">+4% vs prévisions</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all" 
              style={{ width: `${Math.round(classes.reduce((sum, c) => sum + c.progressPercent, 0) / classes.length)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 shrink-0">Choisir la classe :</span>
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <span>{cls.level}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'}`}>
                {cls.weeklyHours}h/sem
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Class Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{selectedClass.name}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedClass.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-4">
              <span><strong>Salle :</strong> {selectedClass.room}</span>
              <span><strong>Coefficient :</strong> {selectedClass.coefficient}</span>
              <span><strong>Effectif :</strong> {selectedClass.studentsCount} élèves</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Progression du syllabus</span>
              <span className="text-lg font-black text-indigo-600">{selectedClass.progressPercent}% terminé</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-900">
              {selectedClass.completedChapters}/{selectedClass.totalChapters}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chapters'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            Chapitres & Progression ({selectedClass.completedChapters}/{selectedClass.totalChapters})
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            Supports & Fiches de cours (8)
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'homework'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">assignment</span>
            Devoirs & Évaluations programmées
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Plan de cours & Déroulement des séquences</h3>
              <button 
                onClick={() => alert("Ajout d'une nouvelle séquence au programme")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span> Ajouter une séquence
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {[
                { num: 1, title: 'Séquence 1 : Le roman réaliste et l’engagement littéraire au XIXe siècle', status: 'completed', date: 'Septembre 2026' },
                { num: 2, title: 'Séquence 2 : Les figures de style et l’art poétique engagé (Césaire, Senghor)', status: 'completed', date: 'Fin Septembre 2026' },
                { num: 3, title: 'Séquence 3 : Étude intégrale : Les Soleils des Indépendances (Ahmadou Kourouma)', status: 'in_progress', date: 'En cours — Clôture 20 Octobre' },
                { num: 4, title: 'Séquence 4 : L’argumentation directe et le plaidoyer civique', status: 'pending', date: 'Prévu Novembre 2026' },
                { num: 5, title: 'Séquence 5 : Le théâtre classique face au drame moderne', status: 'pending', date: 'Prévu Décembre 2026' },
              ].map((chap) => (
                <div key={chap.num} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      chap.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : chap.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {chap.num}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{chap.title}</p>
                      <p className="text-[11px] text-slate-500">{chap.date}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                    chap.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : chap.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chap.status === 'completed' ? 'Validé MENA' : chap.status === 'in_progress' ? 'En cours' : 'À venir'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Banque de documents & Supports distribués</h3>
              <button 
                onClick={() => alert("Ouverture du sélecteur de fichier PDF/DOCX...")}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Téléverser un document
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Fiche Méthodologique : La dissertation littéraire", type: "PDF", size: "1.4 MB", date: "Mis à jour le 22/09" },
                { title: "Recueil de Textes : Poésie de la négritude", type: "PDF", size: "3.8 MB", date: "Mis à jour le 15/09" },
                { title: "Guide de conjugaison : Le subjonctif et la concordance", type: "PDF", size: "850 KB", date: "Mis à jour le 05/09" },
                { title: "Sujets d'annales BEPC 2023-2025 corrigés", type: "ZIP", size: "12.1 MB", date: "Mis à jour le 28/09" },
              ].map((res, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center">
                      {res.type}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{res.title}</p>
                      <p className="text-[11px] text-slate-500">{res.size} • {res.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Téléchargement de : ${res.title}`)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Télécharger"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Échéancier des devoirs et contrôles continus</h3>
              <button 
                onClick={() => alert("Programmation d'un nouveau devoir pour la classe...")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add_task</span>
                Programmer un devoir
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-700 mt-0.5">event_note</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Devoir Surveillé N°2 : Commentaire composé</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Date : Mercredi 15 Octobre 2026 • Durée : 2h00 • Coeff. : 2</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-bold self-start sm:self-auto">
                  Dans 14 jours
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-600 mt-0.5">assignment_turned_in</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Interrogation Écrite N°1 : Vocabulaire et figures de style</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Effectué le 24 Septembre 2026 • 42 copies corrigées (Moyenne : 14.2/20)</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
                  Saisie clôturée
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Assigning new Class/Subject */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">playlist_add</span>
                Assigner une nouvelle classe
              </h3>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Matière / Discipline</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Français & Poésie"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Classe / Niveau</label>
                <select
                  value={newSubject.level}
                  onChange={(e) => setNewSubject({ ...newSubject, level: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="6ème B">6ème B</option>
                  <option value="5ème A">5ème A</option>
                  <option value="5ème B">5ème B</option>
                  <option value="4ème A">4ème A</option>
                  <option value="3ème C">3ème C</option>
                  <option value="2nde A">2nde A</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heures hebdo</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={newSubject.weeklyHours}
                    onChange={(e) => setNewSubject({ ...newSubject, weeklyHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Coefficient</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubject.coefficient}
                    onChange={(e) => setNewSubject({ ...newSubject, coefficient: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                >
                  Enregistrer l'assignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
