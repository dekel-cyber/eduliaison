import React, { useState } from 'react';
import { TEACHER_GRADEBOOK_3A } from '../../data/mockData';

export const TeacherGradebook: React.FC = () => {
  const [rows, setRows] = useState(TEACHER_GRADEBOOK_3A);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [lockedTerm, setLockedTerm] = useState(false);
  const [showSpecimenModal, setShowSpecimenModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScoreChange = (index: number, field: 'int1' | 'int2' | 'ds1' | 'ds2', value: string) => {
    const num = parseFloat(value) || 0;
    const clamped = Math.min(20, Math.max(0, num));
    
    setRows(prev => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: clamped };
      // Recalculate average: (int1*1 + int2*1 + ds1*2 + ds2*3) / 7
      const avg = (target.int1 * 1 + target.int2 * 1 + target.ds1 * 2 + target.ds2 * 3) / 7;
      target.calculatedAverage = parseFloat(avg.toFixed(1));
      target.status = target.calculatedAverage >= 10 ? 'Validé' : 'À réviser';
      updated[index] = target;
      return updated;
    });
  };

  const handleAppreciationChange = (index: number, text: string) => {
    setRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], appreciation: text };
      return updated;
    });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      showToast("Notes et appréciations sauvegardées avec succès !");
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 700);
  };

  const handleAutoRanks = () => {
    setRows(prev => {
      const sorted = [...prev].sort((a, b) => b.calculatedAverage - a.calculatedAverage);
      return sorted.map((row, idx) => ({
        ...row,
        rankT1: `${idx + 1}${idx === 0 ? 'er' : 'ème'}`
      }));
    });
    showToast("Calcul automatique des rangs effectué avec succès.");
  };

  const handleGroupAppreciation = () => {
    setRows(prev => prev.map(r => ({
      ...r,
      appreciation: r.calculatedAverage >= 14 
        ? "Très bon trimestre, travail sérieux et rigoureux." 
        : r.calculatedAverage >= 10 
        ? "Résultats convenables, intensifier les efforts." 
        : "Des lacunes à combler, soutien méthodologique requis."
    })));
    showToast("Appréciations automatiques insérées selon le barème.");
  };

  const filteredRows = rows.filter(r => 
    r.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
    r.matricule.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse"></span>
                Session d'évaluation active
              </span>
              <span className="text-xs text-[#777587]">Réglementation MENA CI-2025</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
              Notes et Bulletins Enseignant
            </h1>
            <p className="text-xs sm:text-sm text-[#464555] max-w-3xl">
              Saisie des notes, coefficients officiels MENA, calcul des moyennes et appréciation des livrets scolaires
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button 
              onClick={() => showToast("Export du relevé trimestriel (.xlsx / .pdf) en cours...")}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs font-bold shadow-xs hover:bg-[#f2f3ff] transition-all cursor-pointer border border-[#eaedff]" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3525cd] group-hover:scale-110 transition-transform">file_download</span>
              <span>Exporter le relevé (.xlsx / .pdf)</span>
            </button>
            <button 
              onClick={() => {
                setLockedTerm(!lockedTerm);
                showToast(lockedTerm ? "Déverrouillage des notes effectué." : "Notes du trimestre verrouillées pour le conseil.");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition-all cursor-pointer ${
                lockedTerm ? 'bg-[#005338] hover:bg-[#006e4b]' : 'bg-[#ae3115] hover:bg-[#8c1900]'
              }`} 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {lockedTerm ? 'lock_open' : 'lock'}
              </span>
              <span>{lockedTerm ? 'Déverrouiller les notes' : 'Verrouiller les notes du trimestre'}</span>
            </button>
          </div>
        </div>

        {/* Filter Control Bar */}
        <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-[#eaedff] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Classe Selector */}
            <div className="flex flex-col gap-1 min-w-[200px] flex-1 lg:flex-none">
              <span className="text-[11px] text-[#777587] uppercase font-bold tracking-wider">Classe assignée</span>
              <div className="relative">
                <select 
                  defaultValue="3A"
                  className="w-full appearance-none bg-[#f2f3ff] px-4 py-2 pr-9 rounded-xl text-xs font-bold text-[#131b2e] focus:outline-none focus:bg-white cursor-pointer transition-colors border border-[#eaedff]"
                >
                  <option value="3A">Classe de 3ème A • 42 élèves</option>
                  <option value="3B">Classe de 3ème B • 39 élèves</option>
                  <option value="4C">Classe de 4ème C • 44 élèves</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#464555] pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            {/* Matière Selector */}
            <div className="flex flex-col gap-1 min-w-[190px] flex-1 lg:flex-none">
              <span className="text-[11px] text-[#777587] uppercase font-bold tracking-wider">Matière & Coefficient</span>
              <div className="relative">
                <select 
                  defaultValue="francais"
                  className="w-full appearance-none bg-[#f2f3ff] px-4 py-2 pr-9 rounded-xl text-xs font-bold text-[#131b2e] focus:outline-none focus:bg-white cursor-pointer transition-colors border border-[#eaedff]"
                >
                  <option value="francais">Français (Coeff. 3)</option>
                  <option value="litterature">Littérature Africaine (Coeff. 2)</option>
                  <option value="expression">Expression Orale (Coeff. 1)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#464555] pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            {/* Trimestre Selector */}
            <div className="flex flex-col gap-1 min-w-[180px] flex-1 lg:flex-none">
              <span className="text-[11px] text-[#777587] uppercase font-bold tracking-wider">Période académique</span>
              <div className="relative">
                <select 
                  defaultValue="Trimestre 2 (En cours)"
                  className="w-full appearance-none bg-[#f2f3ff] px-4 py-2 pr-9 rounded-xl text-xs font-bold text-[#131b2e] focus:outline-none focus:bg-white cursor-pointer transition-colors border border-[#eaedff]"
                >
                  <option value="Trimestre 1 (Clôturé)">Trimestre 1 (Clôturé)</option>
                  <option value="Trimestre 2 (En cours)">Trimestre 2 (En cours)</option>
                  <option value="Trimestre 3 (À venir)">Trimestre 3 (À venir)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#464555] pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6ffbbe] text-[#002113] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">cloud_done</span>
              <span>Calcul auto synchronisé</span>
            </div>
            <button 
              onClick={() => showToast("Barème officiel MENA CI appliqué : (Int1×1 + Int2×1 + DS1×2 + DS2×3) / 7")}
              className="p-2 rounded-xl bg-[#f2f3ff] text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer border border-[#eaedff]" 
              id="toggle-help" 
              title="Règles MENA" 
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">info</span>
            </button>
          </div>
        </div>

        {/* Top KPIs Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#464555]">Moyenne de la classe</span>
              <div className="w-8 h-8 rounded-full bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-none">13.8</span>
              <span className="text-sm text-[#777587]">/ 20</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#f2f3ff] flex items-center gap-1 text-xs text-[#005338] font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+0.4 vs T1</span>
              <span className="text-[#777587] text-[11px] ml-1 font-normal">(T1: 13.4)</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#464555]">Évaluations saisies</span>
              <div className="w-8 h-8 rounded-full bg-[#6ffbbe] flex items-center justify-center text-[#005338]">
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-none">4</span>
              <span className="text-sm text-[#777587]">sur 5</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#f2f3ff] flex flex-col gap-1">
              <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#005338] h-full rounded-full transition-all duration-500" style={{ width: '80%' }}></div>
              </div>
              <span className="text-[11px] text-[#464555]">Progression: 80% • Reste 1 Devoir</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#464555]">Appréciations livrets</span>
              <div className="w-8 h-8 rounded-full bg-[#ffdad2] flex items-center justify-center text-[#ae3115]">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] leading-none">38</span>
              <span className="text-sm text-[#777587]">/ 42</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#f2f3ff] flex flex-col gap-1">
              <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ae3115] h-full rounded-full transition-all duration-500" style={{ width: '90.4%' }}></div>
              </div>
              <span className="text-[11px] text-[#ae3115] font-bold">4 élèves sans commentaire</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-gradient-to-br from-[#3525cd] to-[#4f46e5] text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#e2dfff]">Clôture du livret</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold">Urgent</span>
            </div>
            <div className="flex flex-col my-1">
              <span className="text-2xl sm:text-3xl text-white font-extrabold tracking-tight">24 Mars 2025</span>
              <span className="text-xs text-[#dad7ff]">J - 12 avant Conseil de classe</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[#6ffbbe] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Signature numérique requise</span>
            </div>
          </div>
        </div>

        {/* Main Content: Interactive Gradebook Table */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-[#eaedff] overflow-hidden flex flex-col">
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#f2f3ff]/50 border-b border-[#eaedff]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">table_chart</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#131b2e]">Registre Périodique des Notes</h2>
                <p className="text-xs text-[#464555]">Pondération MENA: Moyenne = (Int1×1 + Int2×1 + DS1×2 + DS2×3) ÷ 7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-[18px]">search</span>
                <input 
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-48 lg:w-64 pl-9 pr-3 py-1.5 rounded-xl bg-white text-[#131b2e] text-xs placeholder:text-[#777587] focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 border border-[#eaedff]" 
                  placeholder="Filtrer un élève..." 
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eaedff] text-[#464555] text-xs font-bold uppercase tracking-wider border-b border-[#dae2fd]">
                  <th className="py-3 px-4">N° Matricule</th>
                  <th className="py-3 px-4 min-w-[200px]">Nom & Prénoms</th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span>Interro 1</span>
                      <span className="text-[#777587] text-[10px] font-normal">/20 • Coeff 1</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span>Interro 2</span>
                      <span className="text-[#777587] text-[10px] font-normal">/20 • Coeff 1</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span>Devoir S1</span>
                      <span className="text-[#777587] text-[10px] font-normal">/20 • Coeff 2</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span>Devoir S2</span>
                      <span className="text-[#777587] text-[10px] font-normal">/20 • Coeff 3</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center bg-[#dae2fd]/40">
                    <div className="flex flex-col items-center">
                      <span className="text-[#3525cd] font-bold">Moyenne</span>
                      <span className="text-[#3525cd]/70 text-[10px] font-normal">Calculée /20</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 min-w-[280px]">Appréciation Bulletin</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff] text-[#131b2e] text-xs">
                {filteredRows.map((row, idx) => {
                  const isLow = row.calculatedAverage < 10;
                  return (
                    <tr 
                      key={row.matricule} 
                      className={`hover:bg-[#f2f3ff]/60 transition-colors ${isLow ? 'bg-[#ffdad2]/15' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono text-[#777587] text-xs">{row.matricule}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isLow ? 'bg-[#ffdad2] text-[#ae3115]' : 'bg-[#e2dfff] text-[#3525cd]'
                          }`}>
                            {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#131b2e]">{row.name}</span>
                            <span className="text-[11px] text-[#777587]">Rang : {row.rankT1}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input 
                          type="number" 
                          step="0.5" 
                          min="0" 
                          max="20"
                          value={row.int1}
                          onChange={(e) => handleScoreChange(idx, 'int1', e.target.value)}
                          className="w-14 text-center py-1 rounded-lg bg-[#f2f3ff] text-xs font-bold text-[#131b2e] focus:bg-white focus:ring-2 focus:ring-[#3525cd] focus:outline-none border border-[#eaedff]" 
                        />
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input 
                          type="number" 
                          step="0.5" 
                          min="0" 
                          max="20"
                          value={row.int2}
                          onChange={(e) => handleScoreChange(idx, 'int2', e.target.value)}
                          className="w-14 text-center py-1 rounded-lg bg-[#f2f3ff] text-xs font-bold text-[#131b2e] focus:bg-white focus:ring-2 focus:ring-[#3525cd] focus:outline-none border border-[#eaedff]" 
                        />
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input 
                          type="number" 
                          step="0.5" 
                          min="0" 
                          max="20"
                          value={row.ds1}
                          onChange={(e) => handleScoreChange(idx, 'ds1', e.target.value)}
                          className="w-14 text-center py-1 rounded-lg bg-[#f2f3ff] text-xs font-bold text-[#131b2e] focus:bg-white focus:ring-2 focus:ring-[#3525cd] focus:outline-none border border-[#eaedff]" 
                        />
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input 
                          type="number" 
                          step="0.5" 
                          min="0" 
                          max="20"
                          value={row.ds2}
                          onChange={(e) => handleScoreChange(idx, 'ds2', e.target.value)}
                          className="w-14 text-center py-1 rounded-lg bg-[#f2f3ff] text-xs font-bold text-[#131b2e] focus:bg-white focus:ring-2 focus:ring-[#3525cd] focus:outline-none border border-[#eaedff]" 
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center bg-[#dae2fd]/20">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold ${
                          row.calculatedAverage >= 14 
                            ? 'bg-[#6ffbbe] text-[#002113]' 
                            : row.calculatedAverage >= 10 
                            ? 'bg-[#eaedff] text-[#3525cd]' 
                            : 'bg-[#ffdad2] text-[#ae3115]'
                        }`}>
                          {row.calculatedAverage.toFixed(1)}<span className="text-[10px] font-normal">/20</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <input 
                          type="text"
                          value={row.appreciation}
                          onChange={(e) => handleAppreciationChange(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-xs focus:bg-white focus:ring-2 focus:ring-[#3525cd] focus:outline-none border border-[#eaedff]" 
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          row.status === 'Validé' 
                            ? 'bg-[#6ffbbe] text-[#002113]' 
                            : 'bg-[#ffdad2] text-[#ae3115]'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {row.status === 'Validé' ? 'check_circle' : 'warning'}
                          </span>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Footer of Table */}
          <div className="p-4 bg-[#f2f3ff]/70 flex flex-wrap items-center justify-between gap-4 border-t border-[#eaedff]">
            <div className="flex items-center gap-2 text-[#777587] text-xs">
              <span>Affichage de {filteredRows.length} sur {rows.length} élèves</span>
              <span>•</span>
              <span className="text-[#3525cd] font-semibold">Calcul automatique temps réel</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button 
                onClick={handleAutoRanks}
                className="px-3 py-2 rounded-xl bg-white text-[#131b2e] text-xs font-bold hover:bg-[#eaedff] transition-colors flex items-center gap-1 cursor-pointer border border-[#eaedff]" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                <span>Calculer automatiquement les rangs</span>
              </button>
              <button 
                onClick={handleGroupAppreciation}
                className="px-3 py-2 rounded-xl bg-white text-[#131b2e] text-xs font-bold hover:bg-[#eaedff] transition-colors flex items-center gap-1 cursor-pointer border border-[#eaedff]" 
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                <span>Insérer une appréciation groupée</span>
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5] disabled:opacity-60 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer" 
                id="save-button" 
                type="button"
              >
                {saving ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : saveSuccess ? (
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}
                <span>{saveSuccess ? 'Enregistré avec succès !' : 'Sauvegarder les modifications'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Panels & Side Widgets Mosaic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Graph Widget: Répartition des notes */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#131b2e]">Répartition des moyennes</h3>
                  <p className="text-[11px] text-[#777587]">Distribution sur 42 élèves inscrits</p>
                </div>
              </div>
              <span className="text-[11px] text-[#002113] bg-[#6ffbbe] px-2 py-0.5 rounded-full font-bold">Taux de réussite: 83.3%</span>
            </div>

            {/* Distribution Bar Chart */}
            <div className="w-full my-auto py-2">
              <div className="flex items-end justify-between gap-2 h-32 px-2">
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] text-[#ae3115] font-bold opacity-0 group-hover:opacity-100 transition-opacity">7 él.</span>
                  <div className="w-full bg-[#ffdad2] rounded-t-lg transition-all group-hover:bg-[#ae3115]" style={{ height: '25%' }}></div>
                  <span className="text-[10px] text-[#777587] mt-1">&lt; 10</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] text-[#464555] font-bold opacity-0 group-hover:opacity-100 transition-opacity">11 él.</span>
                  <div className="w-full bg-[#dae2fd] rounded-t-lg transition-all group-hover:bg-[#c3c0ff]" style={{ height: '42%' }}></div>
                  <span className="text-[10px] text-[#777587] mt-1">10-12</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] text-[#3525cd] font-bold opacity-0 group-hover:opacity-100 transition-opacity">13 él.</span>
                  <div className="w-full bg-[#4f46e5]/70 rounded-t-lg transition-all group-hover:bg-[#3525cd]" style={{ height: '52%' }}></div>
                  <span className="text-[10px] text-[#777587] mt-1">12-14</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] text-[#005338] font-bold opacity-0 group-hover:opacity-100 transition-opacity">8 él.</span>
                  <div className="w-full bg-[#6ffbbe] rounded-t-lg transition-all group-hover:bg-[#005338]" style={{ height: '32%' }}></div>
                  <span className="text-[10px] text-[#777587] mt-1">14-16</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] text-[#005338] font-bold opacity-0 group-hover:opacity-100 transition-opacity">3 él.</span>
                  <div className="w-full bg-[#005338] rounded-t-lg transition-all group-hover:brightness-110" style={{ height: '15%' }}></div>
                  <span className="text-[10px] text-[#777587] mt-1">&gt; 16</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#777587]">
              <span>Note basse: <strong className="text-[#ae3115]">06.5</strong></span>
              <span>Médiane: <strong className="text-[#131b2e]">13.2</strong></span>
              <span>Note haute: <strong className="text-[#005338]">18.5</strong></span>
            </div>
          </div>

          {/* Regulatory Reference: Barème Officiel MENA */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#6ffbbe] text-[#005338] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">balance</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#131b2e]">Barème Officiel MENA CI</h3>
                <p className="text-[11px] text-[#777587]">Directives ministérielles en vigueur</p>
              </div>
            </div>
            <div className="space-y-2 my-2">
              <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between text-xs border border-[#eaedff]">
                <span className="font-semibold text-[#131b2e]">Interrogations écrites (x2)</span>
                <span className="font-mono font-bold text-[#3525cd]">Coeff. 1 chacune</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between text-xs border border-[#eaedff]">
                <span className="font-semibold text-[#131b2e]">Devoir Surveillé N°1</span>
                <span className="font-mono font-bold text-[#3525cd]">Coeff. 2 (1 heure)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between text-xs border border-[#eaedff]">
                <span className="font-semibold text-[#131b2e]">Devoir Surveillé N°2 (Bilan)</span>
                <span className="font-mono font-bold text-[#3525cd]">Coeff. 3 (2 heures)</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#e2dfff]/40 flex items-start gap-2 border border-[#c3c0ff]">
              <span className="material-symbols-outlined text-[18px] text-[#3525cd] shrink-0 mt-0.5">verified</span>
              <span className="text-xs text-[#131b2e]">
                Les moyennes trimestrielles sont validées sous réserve de la présence d'au moins deux notes de devoirs surveillés.
              </span>
            </div>
          </div>

          {/* Preview Card: Bulletin Officiel & Cachet */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ffdad2] text-[#ae3115] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#131b2e]">Livret & Bulletin</h3>
                  <p className="text-[11px] text-[#777587]">Génération sécurisée</p>
                </div>
              </div>
            </div>
            <div 
              onClick={() => setShowSpecimenModal(true)}
              className="bg-[#f2f3ff] rounded-xl p-3 flex flex-col items-center justify-center text-center my-2 cursor-pointer hover:bg-[#eaedff] transition-colors border border-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[36px] text-[#3525cd] mb-1">picture_as_pdf</span>
              <span className="text-xs font-bold text-[#131b2e]">Spécimen Bulletin Trimestre 2</span>
              <span className="text-[11px] text-[#777587] mt-0.5">Format officiel MENA A4</span>
              <div className="mt-2 flex items-center gap-1 px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Cachet Électronique Prêt</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSpecimenModal(true)}
              className="w-full py-2.5 rounded-xl bg-[#3525cd] text-white text-xs font-bold shadow-xs hover:bg-[#4f46e5] transition-all flex items-center justify-center gap-1.5 cursor-pointer" 
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Aperçu du bulletin officiel</span>
            </button>
          </div>
        </div>

        {/* Specimen Modal */}
        {showSpecimenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-[#eaedff] relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[24px]">verified</span>
                  <h3 className="text-base font-bold text-[#131b2e]">Spécimen Officiel Bulletin MENA (Côte d'Ivoire)</h3>
                </div>
                <button 
                  onClick={() => setShowSpecimenModal(false)}
                  className="p-1 rounded-full hover:bg-[#f2f3ff] text-[#464555] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="p-4 bg-[#f2f3ff] rounded-xl my-4 text-xs space-y-2 border border-[#eaedff]">
                <p className="font-bold text-[#131b2e]">MINISTÈRE DE L'ÉDUCATION NATIONALE ET DE L'ALPHABÉTISATION</p>
                <p className="text-[#464555]">Établissement : Groupe Scolaire d'Excellence d'Abidjan • Classe : 3ème A</p>
                <p className="text-[#464555]">Discipline : Français • Professeur : Mme Aya Touré</p>
                <div className="p-3 bg-white rounded-lg border border-[#eaedff] mt-2">
                  <p className="font-bold text-[#3525cd]">Exemple élève : Kouamé Awa (Moyenne : 16.1/20 • Rang : 2ème)</p>
                  <p className="italic text-[#464555] mt-1">« Excellente élève, travail d'une grande rigueur intellectuelle. »</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowSpecimenModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#eaedff] text-[#131b2e] text-xs font-bold hover:bg-[#dae2fd] cursor-pointer"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => {
                    setShowSpecimenModal(false);
                    showToast("Génération du livret complet de classe en cours...");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Télécharger tous les bulletins</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#283044] text-[#eef0ff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-[#777587]/30">
            <span className="material-symbols-outlined text-[#6ffbbe] text-[22px]">check_circle</span>
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
