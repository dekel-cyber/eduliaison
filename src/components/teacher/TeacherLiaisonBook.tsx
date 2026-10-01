import React, { useState } from 'react';

interface LiaisonEntry {
  id: string;
  studentName: string;
  className: string;
  category: 'conduite' | 'felicitations' | 'retard' | 'materiel' | 'rdv';
  title: string;
  content: string;
  author: string;
  date: string;
  time: string;
  signedByParent: boolean;
  parentSignedDate?: string;
  parentComment?: string;
  requiresSignature: boolean;
}

const INITIAL_ENTRIES: LiaisonEntry[] = [
  {
    id: 'l-1',
    studentName: 'Awa Kouamé',
    className: '3ème A',
    category: 'felicitations',
    title: 'Excellente prestation orale en poésie',
    content: 'Awa a démontré une maîtrise remarquable lors de la récitation du poème de Léopold Sédar Senghor. Participation exemplaire et force de proposition pour la classe.',
    author: 'Mme Aya Touré (Prof. Principal & Français)',
    date: 'Aujourd’hui',
    time: '11:30',
    signedByParent: true,
    parentSignedDate: 'Aujourd’hui à 12:45',
    parentComment: 'Merci beaucoup Mme Touré pour vos encouragements !',
    requiresSignature: false
  },
  {
    id: 'l-2',
    studentName: 'David Kouamé',
    className: '6ème A',
    category: 'materiel',
    title: 'Oubli du manuel d’EDHC en classe',
    content: 'David a oublié son manuel d’exercices pour la 2ème fois consécutive. Merci de veiller à la vérification du cartable le soir.',
    author: 'Mme Aya Touré (EDHC)',
    date: 'Hier',
    time: '15:15',
    signedByParent: true,
    parentSignedDate: 'Hier à 19:20',
    parentComment: 'C’est bien noté, nous avons fait le point avec lui.',
    requiresSignature: true
  },
  {
    id: 'l-3',
    studentName: 'Koffi Jean-Luc',
    className: '3ème A',
    category: 'rdv',
    title: 'Convocation Entretien Pédagogique Trimestriel',
    content: 'Je souhaiterais échanger avec vous concernant les perspectives d’orientation en classe de 2nde et le renforcement en méthodologie de commentaire.',
    author: 'Mme Aya Touré (Professeur Principal)',
    date: '28 Septembre',
    time: '16:00',
    signedByParent: false,
    requiresSignature: true
  },
  {
    id: 'l-4',
    studentName: 'Diallo Oumar',
    className: '3ème A',
    category: 'conduite',
    title: 'Bavardages répétés et dispersion',
    content: 'Plusieurs rappels à l’ordre lors du cours de grammaire ce matin. Merci de sensibiliser l’élève à l’écoute active.',
    author: 'Mme Aya Touré (Français)',
    date: '27 Septembre',
    time: '09:40',
    signedByParent: true,
    parentSignedDate: '27 Septembre à 21:00',
    requiresSignature: true
  }
];

export const TeacherLiaisonBook: React.FC = () => {
  const [entries, setEntries] = useState<LiaisonEntry[]>(INITIAL_ENTRIES);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'signed'>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    studentName: 'Awa Kouamé',
    className: '3ème A',
    category: 'conduite' as LiaisonEntry['category'],
    title: '',
    content: '',
    requiresSignature: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const filteredEntries = entries.filter(item => {
    if (selectedFilter === 'pending' && item.signedByParent) return false;
    if (selectedFilter === 'signed' && !item.signedByParent) return false;
    if (selectedStudent !== 'all' && item.studentName !== selectedStudent) return false;
    return true;
  });

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.title.trim() || !newEntry.content.trim() || isSaving) return;

    setIsSaving(true);
    setTimeout(() => {
      const entry: LiaisonEntry = {
        id: `l-${Date.now()}`,
        studentName: newEntry.studentName,
        className: newEntry.className,
        category: newEntry.category,
        title: newEntry.title,
        content: newEntry.content,
        author: 'Mme Aya Touré (Professeur Principal)',
        date: 'À l’instant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        signedByParent: false,
        requiresSignature: newEntry.requiresSignature
      };

      setEntries([entry, ...entries]);
      setIsSaving(false);
      setShowNewModal(false);
      setNewEntry({
        studentName: 'Awa Kouamé',
        className: '3ème A',
        category: 'conduite',
        title: '',
        content: '',
        requiresSignature: true
      });
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    }, 600);
  };

  const getCategoryBadge = (cat: LiaisonEntry['category']) => {
    switch (cat) {
      case 'felicitations':
        return { label: 'Félicitations', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'auto_awesome' };
      case 'rdv':
        return { label: 'Convocation / RDV', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'calendar_today' };
      case 'conduite':
        return { label: 'Observation Discipline', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'warning' };
      case 'materiel':
        return { label: 'Oubli Matériel', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'backpack' };
      default:
        return { label: 'Information', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'info' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {sendSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-sm shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">mark_email_read</span>
            <span className="font-semibold">Le mot de liaison a été transmis instantanément aux parents de l'élève !</span>
          </div>
          <button onClick={() => setSendSuccess(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Hub */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
            <span>Portail Enseignant</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Classe 3ème A & Collège</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-indigo-600">Carnet de Liaison Numérique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Carnet de Liaison & Communication Parents
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Liaison directe avec les familles, mots de correspondance officiels, suivi des rendez-vous et observations scolaires.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => alert("Permanence pédagogique : Jeudi 16h-18h en Salle des Professeurs.")}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700 border border-indigo-100 shadow-xs cursor-pointer flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
            <span>Permanence : Jeu. 16h-18h</span>
          </button>
          
          <button 
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>+ Rédiger un mot de liaison</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Bar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Mots émis ce mois</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{entries.length}</span>
            <span className="text-xs text-slate-500">transmissions</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">done_all</span> 100% distribués sur mobile
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Taux d'Émargement</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {Math.round((entries.filter(e => e.signedByParent).length / entries.length) * 100)}%
            </span>
            <span className="text-xs text-emerald-600 font-bold">+12% vs moyenne</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Délais moyen : 3h20</span>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">En attente de signature</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {entries.filter(e => !e.signedByParent && e.requiresSignature).length}
            </span>
            <span className="text-xs text-slate-500">parents à relancer</span>
          </div>
          <button 
            onClick={() => alert("Notification push de rappel envoyée aux parents concernés.")}
            className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Relancer en 1 clic
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Entretiens Planifiés</span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">3</span>
            <span className="text-xs text-slate-500">cette semaine</span>
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">event_available</span> Créneaux confirmés
          </span>
        </div>
      </div>

      {/* Filter and search toolstrip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous les messages ({entries.length})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              selectedFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            En attente ({entries.filter(e => !e.signedByParent).length})
          </button>
          <button
            onClick={() => setSelectedFilter('signed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              selectedFilter === 'signed'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Signés par la famille ({entries.filter(e => e.signedByParent).length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="text-xs font-bold text-slate-500">Filtrer par élève :</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tous les élèves (3ème A)</option>
            <option value="Awa Kouamé">Awa Kouamé</option>
            <option value="David Kouamé">David Kouamé</option>
            <option value="Koffi Jean-Luc">Koffi Jean-Luc</option>
            <option value="Diallo Oumar">Diallo Oumar</option>
          </select>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map((item) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-indigo-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 font-black text-slate-800 flex items-center justify-center text-xs">
                    {item.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.studentName}</h3>
                      <span className="text-xs text-slate-500">• {item.className}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{item.author} • {item.date} à {item.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                    <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                    {badge.label}
                  </span>

                  {item.signedByParent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Signé
                    </span>
                  ) : item.requiresSignature ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      En attente signature
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
                      Informatif
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {item.content}
                </p>
              </div>

              {item.parentComment && (
                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-indigo-600 text-[18px] mt-0.5">forum</span>
                  <div>
                    <span className="font-bold text-indigo-950">Réponse de la famille ({item.parentSignedDate}) :</span>
                    <p className="text-indigo-900 mt-0.5 italic">« {item.parentComment} »</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Liaison Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">edit_note</span>
                Nouveau mot de liaison officiel
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Élève destinataire</label>
                  <select
                    value={newEntry.studentName}
                    onChange={(e) => setNewEntry({ ...newEntry, studentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Awa Kouamé">Awa Kouamé (3ème A)</option>
                    <option value="David Kouamé">David Kouamé (6ème A)</option>
                    <option value="Koffi Jean-Luc">Koffi Jean-Luc (3ème A)</option>
                    <option value="Diallo Oumar">Diallo Oumar (3ème A)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Motif / Catégorie</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="conduite">Observation Conduite</option>
                    <option value="felicitations">Félicitations</option>
                    <option value="rdv">Demande de RDV</option>
                    <option value="materiel">Oubli de Matériel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Objet / Titre</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Demande d'entretien ou félicitations..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message à l'attention des parents</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Rédigez ici le mot officiel..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqSig"
                  checked={newEntry.requiresSignature}
                  onChange={(e) => setNewEntry({ ...newEntry, requiresSignature: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="reqSig" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Exiger l'émargement / signature électronique des parents
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                  <span>Transmettre aux parents</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
