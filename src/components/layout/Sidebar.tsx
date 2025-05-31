import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePluginStore } from '../../stores/pluginStore';
import { 
  X, Home, MessageSquare, Settings, History, ChevronLeft, ChevronRight, FileEdit,
  LogOut, HelpCircle, CreditCard 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { logout, user } = useAuth();
  const clearCurrentSession = usePluginStore(state => state.clearCurrentSession);
  
  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/chat', label: 'Crea Plugin', icon: <MessageSquare size={20} /> },
    { to: '/plugins/modify', label: 'Modifica Plugin', icon: <FileEdit size={20} /> },
    { to: '/plugins/history', label: 'Cronologia', icon: <History size={20} /> },
    { to: '/settings/api', label: 'API Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 ${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center">
                <MessageSquare size={20} className="text-white" />
              </div>
              <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${isCollapsed ? 'hidden' : 'block'}`}>
                Plugin Maker
              </h2>
            </div>
            <div className="flex items-center">
              <button
                onClick={onToggleCollapse}
                className="hidden md:block p-2 rounded-md text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
              <button
              onClick={onClose}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              >
              <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => {
                    if (link.to === '/chat' || link.to === '/plugins/modify') {
                      clearCurrentSession();
                    }
                    onClose();
                  }}
                >
                  <span className={isCollapsed ? '' : 'mr-3'}>{link.icon}</span>
                  {!isCollapsed && link.label}
                </NavLink>
              ))}
            </nav>
            
            <div className={`mt-8 ${isCollapsed ? 'hidden' : 'block'}`}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Supporto
              </h3>
              <nav className="mt-2 space-y-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <HelpCircle size={20} className="mr-3" />
                  Aiuto
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <CreditCard size={20} className="mr-3" />
                  Abbonamenti
                </a>
              </nav>
            </div>
          </div>
          
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;