import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f2f3ff] py-8 mt-auto border-t border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#464555] text-xs">
        <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center">
          <span className="font-semibold text-[#131b2e]">© 2025 EduLiaison Technologies.</span>
          <span>Tous droits réservés. • Portail Établissement Scolaire Connecté</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-wider">
          <a 
            href="https://wa.me/2250700000000" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#005338] hover:text-[#3525cd] transition-colors flex items-center gap-1 bg-[#6ffbbe]/30 px-2.5 py-1 rounded-full"
          >
            <span className="material-symbols-outlined text-[15px]">chat</span>
            Assistance WhatsApp École
          </a>
          <span className="flex items-center gap-1 text-[#005338]">
            <span className="material-symbols-outlined text-[15px]">lock</span>
            Sécurité TLS 256-bit
          </span>
          <a href="#confidentialite" className="hover:text-[#3525cd] transition-colors">Confidentialité</a>
          <a href="#reglement" className="hover:text-[#3525cd] transition-colors">Règlement Intérieur</a>
        </div>
      </div>
    </footer>
  );
};
