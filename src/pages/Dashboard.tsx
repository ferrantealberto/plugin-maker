import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles, History, Settings, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto">
      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Benvenuto, {user?.name || 'Utente'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Crea facilmente plugin WordPress e WooCommerce con l'aiuto dell'intelligenza artificiale.
        </p>
      </section>
      
      {/* Quick actions */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/chat"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <MessageSquare size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Nuovo Plugin</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Crea un nuovo plugin</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/plugins/history"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-md bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
              <History size={24} className="text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Cronologia</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plugin precedenti</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/settings/api"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-md bg-accent-100 dark:bg-accent-900 flex items-center justify-center">
              <Settings size={24} className="text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">API Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configura OpenRouter</p>
            </div>
          </div>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Sparkles size={24} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Abbonamento</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Piano gratuito</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Le Tue Statistiche
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plugin Creati</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilizzo API</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">0%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Giorni Rimanenti</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">∞</p>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Funzionalità Principali
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-lg text-white">
            <div className="flex items-center mb-4">
              <Zap size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Generazione Intelligente di Plugin</h3>
            </div>
            <p className="mb-4">
              Descrivi le funzionalità desiderate in italiano semplice e l'AI genererà un plugin WordPress completo e pronto all'uso.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white"
            >
              Inizia Ora
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Come Funziona
            </h3>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Configura la tua chiave API di OpenRouter</li>
              <li>Descrivi le funzionalità del plugin desiderato</li>
              <li>Aspetta mentre l'AI genera il codice completo</li>
              <li>Scarica il plugin come file ZIP</li>
              <li>Carica il plugin sul tuo sito WordPress</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;