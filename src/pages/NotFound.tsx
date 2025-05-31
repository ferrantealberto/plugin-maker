import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Pagina non trovata</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Torna alla Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;