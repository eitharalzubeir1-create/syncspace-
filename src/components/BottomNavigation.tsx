
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, User, MapPin } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MapPin, label: 'Location', path: '/location' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#A9A9A9]/30 dark:border-gray-700 px-6 py-2 z-50 transition-colors duration-300">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-[#0057B7] dark:text-blue-400' 
                  : 'text-[#708090] dark:text-gray-400 hover:text-[#0057B7] dark:hover:text-blue-400'
              }`}
            >
              <Icon 
                size={24} 
                className={`transition-all duration-200 ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}
              />
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-[#0057B7] dark:text-blue-400' : 'text-[#708090] dark:text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
