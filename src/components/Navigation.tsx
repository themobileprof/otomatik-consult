import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { scrollToSection } from '@/lib/utils';

const Navigation = () => {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/#hero" className="flex items-center space-x-2" onClick={(e) => handleAnchorClick(e, 'hero')}>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Otomatik
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/#services" 
              className="text-slate-600 hover:text-slate-900"
              onClick={(e) => handleAnchorClick(e, 'services')}
            >
              Services
            </a>
            <a 
              href="/#booking" 
              className="text-slate-600 hover:text-slate-900"
              onClick={(e) => handleAnchorClick(e, 'booking')}
            >
              Book Now
            </a>
            <a 
              href="/#faq" 
              className="text-slate-600 hover:text-slate-900"
              onClick={(e) => handleAnchorClick(e, 'faq')}
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 