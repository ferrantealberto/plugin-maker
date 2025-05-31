import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} Plugin Maker - WebLab Factory. Tutti i diritti riservati.
        </p>
        <div className="mt-2 md:mt-0 flex items-center space-x-4">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Termini di Servizio
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Contatti
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;