import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  MdDashboard, 
  MdShowChart, 
  MdEmojiEvents, 
  MdPerson, 
  MdLogout,
  MdClose 
} from 'react-icons/md';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: MdDashboard },
    { name: 'Progress', path: '/progress', icon: MdShowChart },
    { name: 'Challenges', path: '/challenges', icon: MdEmojiEvents },
    { name: 'Profile', path: '/profile', icon: MdPerson },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-green-900 to-gray-900 border-r border-green-500/30 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 flex flex-col shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-green-400/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="text-2xl">💪</span>
            </div>
            <h1 className="text-2xl font-bold text-white">FitLife</h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white transition"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-105'
                    : 'text-white/70 hover:text-white hover:bg-green-500/20'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={isActive ? 'animate-pulse' : ''} />
                  <span className="font-semibold">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-400/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
          >
            <MdLogout size={22} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-white/50 text-xs">
          <p>© 2025 FitLife</p>
          <p className="mt-1">Your Fitness Journey</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;