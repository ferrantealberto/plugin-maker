import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick} 
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Plugin Maker
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.name}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;