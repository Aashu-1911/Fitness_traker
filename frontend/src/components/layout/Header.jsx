import React, { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import { getProfile } from '../../api/profileApi.js';

const Header = ({ onMenuToggle }) => {
  const [userName, setUserName] = useState('User');
  const [userInitial, setUserInitial] = useState('U');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await getProfile();
      if (profile) {
        // Try to get name from localStorage (email) or use default
        const email = localStorage.getItem('fitlife_email');
        if (email) {
          const name = email.split('@')[0];
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Use default values on error
    }
  };

  return (
    <header className="bg-gray-800/95 backdrop-blur-lg border-b border-green-500/30 sticky top-0 z-30 shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left Section: Menu Toggle + Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-white hover:text-green-400 transition p-2 hover:bg-green-500/30 rounded-lg"
            aria-label="Toggle menu"
          >
            <MdMenu size={28} />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-green-500/30">
              <span className="text-xl">💪</span>
            </div>
            <h1 className="text-xl font-bold text-white">FitLife</h1>
          </div>
        </div>

        {/* Center Section: Page Title (Mobile) */}
        <div className="lg:hidden">
          <h1 className="text-lg font-bold text-white">FitLife</h1>
        </div>

        {/* Right Section: User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-white">{userName}</p>
            <p className="text-xs text-white/60">Member</p>
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg shadow-green-500/30">
            <span className="text-white font-bold text-lg">{userInitial}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;