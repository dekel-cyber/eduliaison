import React, { useState } from 'react';
import { Student } from '../../types';

interface ParentDocumentsProps {
  activeStudent: Student;
  onNavigateTab: (tab: string) => void;
}

export const ParentDocuments: React.FC<ParentDocumentsProps> = ({
  activeStudent,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || isSigning) return;
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSignModalOpen(false);
      setAcknowledged(true);
      showToast("Accusé de réception validé et archivé avec succès.");
    }, 600);
  };

  const handleDownloadDoc = (title: string) => {
    showToast(`Téléchargement de : ${title} en cours...`);
  };

  const handlePreviewDoc = (title: string) => {
    showToast(`Ouverture de l'aperçu : ${title}`);
  };

  const handleFastCert = () => {
    showToast(`Génération du Certificat Officiel 2024-2025 pour ${activeStudent.firstName} (PDF sécurisé)...`);
  };

  const documents = [
    {
      id: 'doc-1',
      category: 'direction',
      title: 'Organisation des Journées Pédagogiques & Conseils de Classe',
      date: '11 Mars 2025',
      size: 'PDF 450 Ko',
      tag: 'Nouveau',
      tagColor: 'bg-[#e2dfff] text-[#3525cd]',
      issuer: 'Direction des Études',
      signedInfo: 'Signé par Proviseur'
    },
    {
      id: 'doc-2',
      category: 'examens',
      title: 'Calendrier Officiel des Épreuves Blanches BEPC 2025',
      date: '8 Mars 2025',
      size: 'PDF 520 Ko',
      tag: 'Important',
      tagColor: 'bg-[#ffdad2] text-[#ae3115]',
      issuer: 'Examens & Concours',
      signedInfo: 'Convocation jointe en page 3'
    },
    {
      id: 'doc-3',
      category: 'reglements',
      title: 'Circulaire sur les Tenues Réglementaires et Uniformes Scolaires',
      date: '22 Février 2025',
      size: 'PDF 310 Ko',
      tag: '',
      issuer: 'Vie Scolaire & Discipline',
      signedInfo: 'Censeur des Études'
    },
    {
      id: 'doc-4',
      category: 'reglements',
      title: 'Menu de la Cantine Scolaire — Mois de Mars 2025',
      date: '1er Mars 2025',
      size: 'PDF 280 Ko',
      tag: '',
      issuer: 'Service Restauration & Internat',
      signedInfo: 'Validé par Nutritionniste'
    },
    {
      id: 'doc-5',
      category: 'scolarite',
      title: 'Reçu de Paiement Écolage — Trimestre 2 (Année 2024-2025)',
      date: '15 Janvier 2025',
      size: 'PDF 180 Ko',
      tag: 'Paiement Validé',
      tagColor: 'bg-[#6ffbbe] text-[#002113]',
      issuer: 'Intendance & Caisse',
      signedInfo: 'Réf: REC-2025-09823'
    },
    {
      id: 'doc-6',
      category: 'reglements',
      title: "Fiche d'Urgence Médicale et Autorisations Parentales",
      date: '28 Septembre 2024',
      size: 'PDF 340 Ko',
      tag: 'Archivé',
      tagColor: 'bg-[#eaedff] text-[#464555]',
      issuer: 'Infirmerie Scolaire',
      signedInfo: 'Validé par Dr. Touré'
    }
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Page Header & Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2dfff] text-[#3525cd] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-pulse"></span>
              Coffre-fort Électronique Certifié
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
              Documents Officiels & Circulaires
            </h1>
            <p className="text-xs sm:text-sm text-[#464555] mt-1">
              Consultez, téléchargez et émargez les correspondances officielles de l'établissement pour <span className="font-semibold text-[#131b2e]">{activeStudent.firstName} {activeStudent.lastName} ({activeStudent.class})</span>.
            </p>
          </div>

          {/* Quick Action: Direct Certificate Request Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleFastCert}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4f46e5] text-white text-xs font-bold shadow-sm hover:bg-[#3525cd] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">verified</span>
              <span>Demander un certificat de scolarité</span>
            </button>
          </div>
        </div>

        {/* Action Required Banner (Urgent Acknowledgment) */}
        <div className="w-full">
          <div className="rounded-2xl bg-white p-5 md:p-6 shadow-md border border-[#eaedff] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${acknowledged ? 'bg-[#005338]' : 'bg-[#fd6a49]'}`}></div>
            <div className="flex items-start gap-4 pl-2">
              <div className="w-12 h-12 rounded-xl bg-[#ffdad2] flex items-center justify-center text-[#ae3115] shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[26px]">assignment_turned_in</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffdad2] text-[#ae3115] text-[11px] font-bold">
                    {acknowledged ? 'Accusé de réception validé' : 'Accusé de réception requis'}
                  </span>
                  <span className="text-xs text-[#464555] font-medium">
                    Publié le 1er Mars 2025 • Direction Générale
                  </span>
                </div>
                <h2 className="text-base sm:text-lg text-[#131b2e] font-bold">
                  Règlement Intérieur Amendé — Année Scolaire 2024-2025
                </h2>
                <p className="text-xs sm:text-sm text-[#464555] mt-1 max-w-2xl">
                  Mise à jour concernant l'utilisation encadrée des outils pédagogiques connectés et la charte de vie collective du collège. La signature des deux parents est requise avant le 15 Mars.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0 pl-2 lg:pl-0">
              <button 
                onClick={() => handlePreviewDoc("Règlement Intérieur Amendé")}
                className="px-4 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#eaedff]"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Lire l'amendement</span>
              </button>
              {!acknowledged ? (
                <button 
                  onClick={() => setIsSignModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#fd6a49] hover:bg-[#ae3115] text-white text-xs font-bold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                  <span>Valider l'accusé de réception</span>
                </button>
              ) : (
                <span className="px-4 py-2.5 rounded-xl bg-[#6ffbbe] text-[#002113] text-xs font-bold flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Émargé & Archivé</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: Filtered Catalog & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Center & Left: Document Browser (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#464555] text-[20px]">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f2f3ff] text-xs font-medium text-[#131b2e] placeholder:text-[#464555]/60 focus:outline-none focus:bg-white border border-[#eaedff] transition-all" 
                  placeholder="Rechercher par titre, émetteur, mot-clé, date..." 
                  type="text" 
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] hover:text-[#131b2e] border border-[#eaedff]'
                  }`}
                >
                  Tous les documents ({documents.length})
                </button>
                <button 
                  onClick={() => setSelectedCategory('direction')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'direction' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] hover:text-[#131b2e] border border-[#eaedff]'
                  }`}
                >
                  Circulaires de Direction
                </button>
                <button 
                  onClick={() => setSelectedCategory('reglements')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'reglements' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] hover:text-[#131b2e] border border-[#eaedff]'
                  }`}
                >
                  Règlements & Pratique
                </button>
                <button 
                  onClick={() => setSelectedCategory('examens')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'examens' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] hover:text-[#131b2e] border border-[#eaedff]'
                  }`}
                >
                  Calendriers d'Examens
                </button>
                <button 
                  onClick={() => setSelectedCategory('scolarite')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'scolarite' 
                      ? 'bg-[#3525cd] text-white shadow-xs' 
                      : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#464555] hover:text-[#131b2e] border border-[#eaedff]'
                  }`}
                >
                  Reçus & Scolarité
                </button>
              </div>
            </div>

            {/* Document List Container */}
            <div className="flex flex-col gap-3">
              {filteredDocs.map((doc) => (
                <article 
                  key={doc.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-[#eaedff] transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        {doc.category === 'examens' ? 'event_note' : doc.category === 'scolarite' ? 'receipt_long' : 'picture_as_pdf'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        {doc.tag && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.tagColor || 'bg-[#e2dfff] text-[#3525cd]'}`}>
                            {doc.tag}
                          </span>
                        )}
                        <span className="text-[11px] text-[#464555] font-semibold">{doc.issuer}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#131b2e] truncate">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#464555] mt-1">
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span className="text-[#005338] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">verified_user</span> {doc.signedInfo}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button 
                      onClick={() => handlePreviewDoc(doc.title)}
                      className="p-2 rounded-xl hover:bg-[#f2f3ff] text-[#464555] hover:text-[#131b2e] transition-colors cursor-pointer border border-transparent hover:border-[#eaedff]" 
                      title="Aperçu rapide"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button 
                      onClick={() => handleDownloadDoc(doc.title)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#3525cd] hover:text-white text-[#3525cd] text-xs font-bold transition-colors cursor-pointer border border-[#eaedff]"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Télécharger</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar (4 Cols): Coffre-fort Status & Fast Actions */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Storage & Safety Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#131b2e]">
                  Coffre-fort Numérique
                </h3>
                <span className="material-symbols-outlined text-[#3525cd] text-[22px]">cloud_done</span>
              </div>
              <p className="text-xs text-[#464555] mb-4">
                Vos pièces administratives et relevés officiels sont horodatés et archivés selon les normes de traçabilité scolaire.
              </p>
              {/* Storage Gauge */}
              <div className="bg-[#f2f3ff] rounded-xl p-3 mb-4 border border-[#eaedff]">
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-[#464555]">Documents stockés</span>
                  <span className="font-bold text-[#3525cd]">18 fichiers (42.4 Mo)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#eaedff] overflow-hidden">
                  <div className="h-full bg-[#3525cd] rounded-full transition-all duration-500" style={{ width: '24%' }}></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-[#464555]">
                  <span>Synchronisé il y a 10 min</span>
                  <span className="text-[#005338] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005338]"></span> Actif
                  </span>
                </div>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-[#464555]">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">lock</span>
                  <span>Chiffrement certifié AES-256</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#464555]">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">history_edu</span>
                  <span>Valeur probante des signatures</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#464555]">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">contactless</span>
                  <span>Accès garanti pendant tout le cursus</span>
                </div>
              </div>
            </div>

            {/* Certificate Fast Track Card */}
            <div className="bg-gradient-to-br from-[#e2dfff] to-[#eaedff] rounded-2xl p-6 shadow-sm border border-[#dae2fd] relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#3525cd] mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                </div>
                <h3 className="text-base font-bold text-[#0f0069] mb-1">
                  Certificat de Scolarité Express
                </h3>
                <p className="text-xs text-[#3323cc] mb-4">
                  Générez instantanément une attestation officielle avec QR Code de validation administrative pour l'ambassade ou la mutuelle.
                </p>
                <button 
                  onClick={handleFastCert}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3525cd] text-white text-xs font-bold shadow-sm hover:bg-[#4f46e5] transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Générer l'attestation en 1 clic</span>
                </button>
              </div>
            </div>

            {/* Health and Safety Protocol Link */}
            <div 
              onClick={() => handlePreviewDoc("Protocole Sanitaire & Hygiène")}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex items-center gap-3 cursor-pointer hover:bg-[#f2f3ff] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#6ffbbe]/30 flex items-center justify-center text-[#005338] shrink-0">
                <span className="material-symbols-outlined text-[22px]">sanitizer</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#131b2e] truncate">
                  Protocole Sanitaire & Hygiène
                </h4>
                <p className="text-[11px] text-[#464555] truncate">
                  Consignes d'infirmerie et fiches d'évacuation
                </p>
              </div>
              <span className="material-symbols-outlined text-[#464555] text-[20px]">chevron_right</span>
            </div>

            {/* Direct School Liaison Contact */}
            <div className="p-4 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#3525cd] text-[22px] shrink-0 mt-0.5">contact_support</span>
              <div className="text-[#464555] text-xs">
                <span className="font-bold text-[#131b2e]">Un document est manquant ?</span>
                <p className="mt-0.5">Contactez le secrétariat pédagogique au <span className="font-bold text-[#3525cd]">+225 27 22 40 00</span> ou directement via la Messagerie École.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Modal: Digital Signature & Acknowledgment */}
        {isSignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#283044]/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative border border-[#eaedff]">
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#eaedff]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#ffdad2] flex items-center justify-center text-[#ae3115]">
                    <span className="material-symbols-outlined text-[20px]">draw</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#131b2e]">
                    Émargement Officiel
                  </h3>
                </div>
                <button 
                  onClick={() => setIsSignModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#f2f3ff] text-[#464555] hover:text-[#131b2e] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="bg-[#f2f3ff] p-4 rounded-xl mb-4 border border-[#eaedff]">
                <p className="text-[11px] uppercase font-bold text-[#464555]">Document concerné</p>
                <p className="text-sm font-bold text-[#131b2e] mt-0.5">Règlement Intérieur Amendé — Année 2024-2025</p>
                <p className="text-xs text-[#464555] mt-1">
                  En confirmant, vous attestez avoir pris connaissance des règles relatives à l'assiduité, aux uniformes et aux appareils numériques.
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSignSubmit}>
                <div>
                  <label className="block text-xs font-bold text-[#131b2e] mb-1">Nom du parent signataire</label>
                  <input 
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[#131b2e] text-xs font-medium cursor-not-allowed border border-[#eaedff]" 
                    readOnly 
                    type="text" 
                    value="M. Koffi Kouamé (Père / Tuteur Légal)" 
                  />
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#e2dfff]/50 border border-[#c3c0ff]">
                  <input 
                    id="agree-terms" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required 
                    type="checkbox" 
                    className="mt-0.5 h-4 w-4 rounded text-[#3525cd] cursor-pointer"
                  />
                  <label className="text-xs text-[#131b2e] cursor-pointer" htmlFor="agree-terms">
                    Je certifie sur l'honneur avoir lu l'intégralité du règlement et en avoir informé mon enfant Awa Kouamé.
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setIsSignModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold transition-colors cursor-pointer" 
                    type="button"
                  >
                    Annuler
                  </button>
                  <button 
                    className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer ${
                      agreeTerms && !isSigning ? 'bg-[#3525cd] hover:bg-[#4f46e5]' : 'bg-[#777587] opacity-60 cursor-not-allowed'
                    }`} 
                    type="submit"
                    disabled={!agreeTerms || isSigning}
                  >
                    {isSigning ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    )}
                    <span>Signer électroniquement</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notification Toast Feedback */}
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
