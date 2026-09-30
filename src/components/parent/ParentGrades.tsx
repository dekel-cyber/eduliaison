import React, { useState } from 'react';
import { Student } from '../../types';

interface ParentGradesProps {
  activeStudent: Student;
  onNavigateTab: (tab: string) => void;
}

export const ParentGrades: React.FC<ParentGradesProps> = ({
  activeStudent,
  onNavigateTab
}) => {
  const [selectedTerm, setSelectedTerm] = useState<'T1' | 'T2' | 'T3'>('T2');
  const [downloadingBulletin, setDownloadingBulletin] = useState(false);
  const [bulletinDownloaded, setBulletinDownloaded] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<string | null>(null);

  const handleDownloadBulletin = () => {
    setDownloadingBulletin(true);
    setTimeout(() => {
      setDownloadingBulletin(false);
      setBulletinDownloaded(true);
      setTimeout(() => setBulletinDownloaded(false), 2500);
    }, 1000);
  };

  const handleVerify = () => {
    setVerifiedStatus("✓ Bulletin authentifié auprès de la Direction des Examens et Concours (DECO - Ministère).");
    setTimeout(() => setVerifiedStatus(null), 4000);
  };

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top Bar: Breadcrumb, Student Summary & Term Selector */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#464555]">
              <span onClick={() => onNavigateTab('parent-dashboard')} className="hover:text-[#3525cd] cursor-pointer">EduLiaison</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>{activeStudent.firstName} {activeStudent.lastName} ({activeStudent.class})</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#3525cd] font-semibold">Suivi Académique</span>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">Notes, Évaluations & Bulletins</h1>
              <span className="text-[11px] uppercase px-2.5 py-1 rounded-full bg-[#e2dfff] text-[#3525cd] font-bold">Année Scolaire 2024-2025</span>
            </div>
          </div>

          {/* Term Selector Tabs */}
          <div className="flex items-center p-1 bg-[#eaedff] rounded-xl shadow-xs self-stretch sm:self-auto overflow-x-auto">
            <button 
              onClick={() => setSelectedTerm('T1')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedTerm === 'T1' 
                  ? 'bg-white text-[#3525cd] shadow-sm font-bold' 
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#005338]">check_circle</span>
              <span>Trimestre 1 (Clôturé)</span>
            </button>

            <button 
              onClick={() => setSelectedTerm('T2')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                selectedTerm === 'T2' 
                  ? 'bg-white text-[#3525cd] shadow-sm' 
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#fd6a49] animate-pulse"></span>
              <span>Trimestre 2</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#ffdad2] text-[#3d0600] text-[10px] font-bold">EN COURS</span>
            </button>

            <button 
              onClick={() => setSelectedTerm('T3')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold text-[#777587] hover:text-[#464555] transition-colors whitespace-nowrap cursor-pointer ${
                selectedTerm === 'T3' ? 'bg-white text-[#3525cd] shadow-sm font-bold' : ''
              }`}
            >
              Trimestre 3
            </button>
          </div>
        </div>

        {/* Student Key Performance Ribbon (Bento Mosaic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Primary Metric Card: Overall Average */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#e2dfff]/30 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase text-[#464555] tracking-wider">Moyenne Générale Provisoire</span>
                <span className="text-xs text-[#464555]">Trimestre 2 • Sur 20 pts</span>
              </div>
              <span className="p-2 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </span>
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">15,8</span>
              <span className="text-lg text-[#464555] font-semibold">/ 20</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold ml-2">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +0.6 pt vs T1
              </span>
            </div>
            {/* Mini Progress Gauge */}
            <div className="flex flex-col gap-1.5">
              <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#3525cd] h-full rounded-full transition-all duration-700" style={{ width: '79%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-[#464555]">
                <span>Seuil d'excellence (16.0)</span>
                <span className="font-semibold text-[#3525cd]">Objectif Brevet Mention TB</span>
              </div>
            </div>
          </div>

          {/* Rank & Class Standing Card */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase text-[#464555] tracking-wider">Classement Actuel</span>
                <span className="text-xs text-[#464555]">Classe de 3ème A (42 élèves)</span>
              </div>
              <span className="p-2 rounded-lg bg-[#ffdad2] text-[#ae3115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">military_tech</span>
              </span>
            </div>
            <div className="my-3 flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight">3<sup className="text-lg text-[#ae3115] font-bold">ème</sup></span>
              <span className="text-sm text-[#464555] font-semibold ml-2">sur 42 élèves</span>
            </div>
            <div className="pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-xs text-[#464555]">
              <span>Tête de classe: <strong className="text-[#131b2e]">17,4</strong></span>
              <span>Moy. classe: <strong className="text-[#131b2e]">12,8</strong></span>
            </div>
          </div>

          {/* Distinction & Council Forecast Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#f2f3ff] p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#6ffbbe] text-[#002113] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </span>
                <div>
                  <span className="text-[11px] uppercase text-[#005338] font-bold tracking-wider">Avis Prévisionnel</span>
                  <h2 className="text-sm sm:text-base font-bold text-[#131b2e]">Tableau d'Honneur & Félicitations</h2>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#006e4b] text-[#67f4b7] font-semibold">T1 Validé</span>
            </div>
            <p className="text-xs sm:text-sm text-[#464555] my-2">
              « Comportement exemplaire et assiduité remarquable. Awa consolide ses acquis scientifiques tout en maintenant une aisance littéraire brillante. »
            </p>
            <div className="flex items-center justify-between gap-2 bg-[#eaedff]/60 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">verified_user</span>
                <span className="text-xs text-[#131b2e] font-semibold">Validation Direction des Études</span>
              </div>
              <span className="text-xs text-[#464555]">Prof. M. Bamba</span>
            </div>
          </div>
        </div>

        {/* Official PDF Download Banner with Seal & Digital Signature */}
        <div className="w-full bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#4d44e3] rounded-2xl p-5 md:p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-[32px]">picture_as_pdf</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">Document Certifié</span>
                <span className="text-xs text-[#dad7ff]">SHA-256 Signé électroniquement</span>
              </div>
              <h2 className="text-lg sm:text-xl text-white font-bold mt-0.5">Bulletin Officiel du 1er Trimestre disponible</h2>
              <p className="text-xs text-[#dad7ff]">Comporte le sceau officiel d'État, les coefficients ministériels et le QR Code de vérification ministérielle.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button 
              onClick={handleDownloadBulletin}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-white text-[#3525cd] hover:bg-[#faf8ff] transition-all text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {downloadingBulletin ? 'progress_activity' : bulletinDownloaded ? 'check' : 'download'}
              </span>
              <span>{downloadingBulletin ? 'Téléchargement...' : bulletinDownloaded ? 'Téléchargé !' : 'Télécharger le Bulletin (PDF 1.2 Mo)'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Detailed Subject Breakdown (Left/Center) + Sidebar Statistics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Columns: Subject Grades & Continuous Evaluations Table */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#131b2e]">Relevé Détaillé par Discipline</h2>
                <p className="text-xs text-[#464555]">Trimestre 2 • Évaluations continues, devoirs surveillés et coefficients</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005338]"></span> ≥ 14 / 20
                </span>
                <span className="flex items-center gap-1 text-xs text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd]"></span> 12 - 13.9
                </span>
                <span className="flex items-center gap-1 text-xs text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fd6a49]"></span> &lt; 10 / 20
                </span>
              </div>
            </div>

            {/* Subject List Stack */}
            <div className="flex flex-col gap-3">
              {/* Subject: Mathématiques */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#e2dfff] text-[#3525cd] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">functions</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#131b2e]">Mathématiques</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">Coeff. 3</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold">2ème de la classe</span>
                      </div>
                      <span className="text-xs text-[#464555]">Enseignant : M. Kouakou Bertin</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#3525cd]">17,0</span>
                        <span className="text-xs text-[#464555]">/ 20</span>
                      </div>
                      <span className="text-[11px] text-[#464555] block">Moy. classe : 12,4</span>
                    </div>
                  </div>
                </div>
                {/* Detailed Marks Pills */}
                <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex flex-wrap items-center gap-2 border border-[#eaedff]">
                  <span className="text-xs text-[#464555] mr-1">Évaluations :</span>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Interro 1 :</span>
                    <span className="font-bold text-[#131b2e]">16 / 20</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Interro 2 :</span>
                    <span className="font-bold text-[#005338]">18 / 20</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Devoir Surveillé :</span>
                    <span className="font-bold text-[#3525cd]">17 / 20</span>
                    <span className="text-[#777587] text-[10px]">(Coeff 2)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-[#464555] text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#005338] shrink-0 mt-0.5">format_quote</span>
                  <p className="italic text-[#131b2e]">« Très bon travail, raisonnement rigoureux et participation très constructive en classe. Continuez ainsi. »</p>
                </div>
              </div>

              {/* Subject: Français */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eaedff] text-[#131b2e] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">menu_book</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#131b2e]">Français</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">Coeff. 3</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#131b2e] text-xs font-semibold">4ème de la classe</span>
                      </div>
                      <span className="text-xs text-[#464555]">Enseignante : Mme Touré Fatoumata</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#3525cd]">15,5</span>
                        <span className="text-xs text-[#464555]">/ 20</span>
                      </div>
                      <span className="text-[11px] text-[#464555] block">Moy. classe : 13,1</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex flex-wrap items-center gap-2 border border-[#eaedff]">
                  <span className="text-xs text-[#464555] mr-1">Évaluations :</span>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Devoir Type Examen :</span>
                    <span className="font-bold text-[#131b2e]">15 / 20</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Oral / Exposé :</span>
                    <span className="font-bold text-[#005338]">16 / 20</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-[#464555] text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#005338] shrink-0 mt-0.5">format_quote</span>
                  <p className="italic text-[#131b2e]">« Élève motrice et excellente expression écrite. Awa fait preuve d'une belle finesse d'analyse dans ses argumentations. »</p>
                </div>
              </div>

              {/* Subject: Physique - Chimie */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6ffbbe] text-[#005236] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">science</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#131b2e]">Physique - Chimie</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">Coeff. 2</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-xs font-bold">1ère de la classe</span>
                      </div>
                      <span className="text-xs text-[#464555]">Enseignant : Dr. N'Guessan Yao</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#005338]">16,0</span>
                        <span className="text-xs text-[#464555]">/ 20</span>
                      </div>
                      <span className="text-[11px] text-[#464555] block">Moy. classe : 11,8</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex flex-wrap items-center gap-2 border border-[#eaedff]">
                  <span className="text-xs text-[#464555] mr-1">Évaluations :</span>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Travaux Pratiques :</span>
                    <span className="font-bold text-[#005338]">17 / 20</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-2xs text-xs flex items-center gap-1.5 border border-[#eaedff]">
                    <span className="text-[#464555]">Devoir Synthèse :</span>
                    <span className="font-bold text-[#131b2e]">15.5 / 20</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-[#464555] text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#005338] shrink-0 mt-0.5">format_quote</span>
                  <p className="italic text-[#131b2e]">« Esprit scientifique aiguisé. Manipulation claire en laboratoire. Félicitations. »</p>
                </div>
              </div>

              {/* Grid of other disciplines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* SVT */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#131b2e]">SVT</h4>
                      <span className="text-xs text-[#464555]">Coeff. 2 • M. Diallo</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#3525cd]">14,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                      <span className="block text-[11px] text-[#464555]">Classe: 12.1</span>
                    </div>
                  </div>
                  <div className="bg-[#f2f3ff] p-2 rounded-lg flex items-center justify-between text-xs border border-[#eaedff]">
                    <span>Devoir 1: <strong>13.5</strong></span>
                    <span>Interro: <strong>14.5</strong></span>
                  </div>
                </div>

                {/* Anglais LV1 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#131b2e]">Anglais LV1</h4>
                      <span className="text-xs text-[#464555]">Coeff. 2 • Mrs. Mensah</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#005338]">16,5</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                      <span className="block text-[11px] text-[#464555]">Classe: 13.0</span>
                    </div>
                  </div>
                  <div className="bg-[#f2f3ff] p-2 rounded-lg flex items-center justify-between text-xs border border-[#eaedff]">
                    <span>Speaking: <strong>17.0</strong></span>
                    <span>Grammar: <strong>16.0</strong></span>
                  </div>
                </div>

                {/* Histoire - Géographie */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#131b2e]">Histoire - Géographie</h4>
                      <span className="text-xs text-[#464555]">Coeff. 2 • M. Kassi</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#3525cd]">15,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                      <span className="block text-[11px] text-[#464555]">Classe: 12.8</span>
                    </div>
                  </div>
                  <div className="bg-[#f2f3ff] p-2 rounded-lg flex items-center justify-between text-xs border border-[#eaedff]">
                    <span>Cartographie: <strong>16.0</strong></span>
                    <span>Synthèse: <strong>14.0</strong></span>
                  </div>
                </div>

                {/* Arts Plastiques & Musique */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#131b2e]">Arts & Culture</h4>
                      <span className="text-xs text-[#464555]">Coeff. 1 • Mme Koffi</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#005338]">17,0</span>
                      <span className="text-xs text-[#464555]">/ 20</span>
                      <span className="block text-[11px] text-[#464555]">Classe: 14.2</span>
                    </div>
                  </div>
                  <div className="bg-[#f2f3ff] p-2 rounded-lg flex items-center justify-between text-xs border border-[#eaedff]">
                    <span>Projet créatif: <strong>17.0</strong></span>
                    <span className="text-[#005338] font-semibold">Créativité vive</span>
                  </div>
                </div>
              </div>

              {/* Single Row for EPS */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-[#eaedff] text-[#131b2e] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">sports_handball</span>
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">Éducation Physique & Sportive</h4>
                    <span className="text-xs text-[#464555]">Coeff. 1 • Demi-fond et Basket-ball</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-base font-bold text-[#3525cd]">15,0</span>
                    <span className="text-xs text-[#464555]">/ 20</span>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#eaedff] text-[#464555] text-xs font-semibold">
                    Esprit d'équipe exemplaire
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Synthesis, Visual Radar, & Official Archives */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Class Council Decision Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#131b2e]">Bilan Synthétique du Conseil</h3>
                <span className="material-symbols-outlined text-[#3525cd] text-[20px]">gavel</span>
              </div>
              {/* Coefficients & Points computation */}
              <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-2 border border-[#eaedff]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#464555]">Total des coefficients :</span>
                  <strong className="text-[#131b2e]">15</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#464555]">Total points coefficientés :</span>
                  <strong className="text-[#131b2e]">237,0 pts</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#464555]">Moyenne de classe générale :</span>
                  <span className="text-[#131b2e] font-semibold">12,8 / 20</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#464555]">Plus basse / Plus haute moy. :</span>
                  <span className="text-[#131b2e] font-semibold">08,2 • 17,4</span>
                </div>
              </div>

              {/* Visual Bar Chart for Subject Clusters */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[11px] uppercase text-[#464555] font-bold tracking-wide">Pôles d'Excellence</span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span>Sciences (Maths, PC, SVT)</span>
                    <span className="font-bold text-[#3525cd]">15,7 / 20</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '78.5%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between text-xs">
                    <span>Lettres & Langues (FR, ANG)</span>
                    <span className="font-bold text-[#005338]">16,0 / 20</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between text-xs">
                    <span>Sciences Humaines & Arts</span>
                    <span className="font-bold text-[#131b2e]">15,7 / 20</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#fd6a49] h-full rounded-full" style={{ width: '78.5%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#6ffbbe]/40 rounded-xl flex items-center gap-3 text-[#005236] border border-[#6ffbbe]">
                <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Félicitations du Conseil</span>
                  <span className="text-xs">Inscription au Tableau d'Honneur de l'Établissement</span>
                </div>
              </div>
            </div>

            {/* Archival & Historical Downloads Module */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-base font-bold text-[#131b2e]">Archives des Bulletins</h3>
                <span className="material-symbols-outlined text-[#777587] text-[18px]">history_edu</span>
              </div>
              <div className="flex flex-col gap-2">
                {/* T1 Bulletin */}
                <button 
                  onClick={handleDownloadBulletin}
                  className="p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors flex items-center justify-between group cursor-pointer text-left border border-[#eaedff]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#3525cd] text-[24px] group-hover:scale-110 transition-transform">description</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Bulletin Trimestre 1 (3ème)</span>
                      <span className="text-[11px] text-[#464555]">Moy: 15,2/20 • PDF 1.2 Mo</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#3525cd] text-[20px]">download</span>
                </button>

                {/* 4ème Final Report */}
                <button 
                  onClick={handleDownloadBulletin}
                  className="p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors flex items-center justify-between group cursor-pointer text-left border border-[#eaedff]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#464555] text-[24px] group-hover:scale-110 transition-transform">folder_open</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Bilan Annuel 4ème (2023-2024)</span>
                      <span className="text-[11px] text-[#464555]">Moy. Annuelle: 14,9/20 • PDF</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#464555] text-[20px]">download</span>
                </button>

                {/* Certificat de Scolarité */}
                <button 
                  onClick={() => onNavigateTab('parent-documents')}
                  className="p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors flex items-center justify-between group cursor-pointer text-left border border-[#eaedff]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#005338] text-[24px] group-hover:scale-110 transition-transform">badge</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#131b2e]">Certificat de Scolarité Officiel</span>
                      <span className="text-[11px] text-[#464555]">Tamponné le 12/09/2024</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#005338] text-[20px]">download</span>
                </button>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => onNavigateTab('parent-documents')}
                  className="w-full py-2.5 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] transition-colors text-xs font-bold text-[#3525cd] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">folder_shared</span>
                  <span>Consulter l'historique complet (6ème - 3ème)</span>
                </button>
              </div>
            </div>

            {/* Direct School Contact for Grade Clarification */}
            <div className="bg-[#eaedff] p-5 rounded-2xl flex flex-col gap-2 border border-[#dae2fd]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">contact_support</span>
                <h4 className="text-sm font-bold text-[#131b2e]">Une question sur les notes ?</h4>
              </div>
              <p className="text-xs text-[#464555]">
                Vous pouvez solliciter un rendez-vous pédagogique avec le professeur principal (M. Kouakou) ou le responsable de niveau 3ème.
              </p>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => onNavigateTab('parent-messaging')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#3525cd] text-white text-xs font-bold hover:bg-[#4f46e5] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Message Enseignant</span>
                </button>
                <button 
                  onClick={() => onNavigateTab('parent-timeline')}
                  className="p-2 rounded-xl bg-white text-[#464555] hover:text-[#131b2e] transition-colors flex items-center justify-center cursor-pointer border border-[#eaedff]"
                >
                  <span className="material-symbols-outlined text-[18px]">event</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Authenticity Stamp Footer Card */}
        <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3525cd] shrink-0">
              <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#131b2e]">Vérification Numérique & Intégrité</h4>
              <p className="text-xs text-[#464555]">Chaque relevé téléchargé porte un identifiant unique vérifiable auprès du Ministère de l'Éducation Nationale.</p>
              {verifiedStatus && (
                <p className="text-xs text-[#005338] font-bold mt-1">{verifiedStatus}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] uppercase font-mono text-[#777587]">ID: EDU-2025-CI-3A-00891</span>
            <button 
              onClick={handleVerify}
              className="px-3 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold transition-colors cursor-pointer border border-[#eaedff]"
            >
              Vérifier l'authenticité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
