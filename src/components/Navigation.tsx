import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tech Oasis
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/#services" className="text-slate-600 hover:text-slate-900">
              Services
            </a>
            <a href="/#how-it-works" className="text-slate-600 hover:text-slate-900">
              How It Works
            </a>
            <a href="/#booking" className="text-slate-600 hover:text-slate-900">
              Book Now
            </a>
            <a href="/#faq" className="text-slate-600 hover:text-slate-900">
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