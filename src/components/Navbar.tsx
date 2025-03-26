import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="fixed w-[95%] mx-auto top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-[#0A0A0A]/75 z-50 border border-[#1a1a1a] rounded-full shadow-floating">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-white" />
                <span className="text-xl font-semibold text-white">EduNotes</span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">
                  Marketplace
                </Link>
                <Link to="/groups" className="text-gray-300 hover:text-white transition-colors">
                  Groups
                </Link>
                <Link to="/sell" className="text-gray-300 hover:text-white transition-colors">
                  Sell Notes
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="text-gray-300 hover:text-white">
                      <User className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;