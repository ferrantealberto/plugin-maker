import React, { useState, useEffect } from 'react';
import { Download, Trash2, Code, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Plugin {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  type: 'wordpress' | 'woocommerce';
  size: string;
  model: string;
}

// Demo data
const demoPlugins: Plugin[] = [
  {
    id: '1',
    name: 'WP Social Share',
    description: 'Plugin per condivisione social con contatori e analisi',
    createdAt: '2025-03-15T14:30:00Z',
    type: 'wordpress',
    size: '45 KB',
    model: 'gpt-4-turbo',
  },
  {
    id: '2',
    name: 'WooCommerce Product Recommendations',
    description: 'Sistema di raccomandazione prodotti basato su ML',
    createdAt: '2025-03-12T09:15:00Z',
    type: 'woocommerce',
    size: '124 KB',
    model: 'claude-3-opus',
  },
];

const PluginHistory: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'wordpress' | 'woocommerce'>('all');
  
  useEffect(() => {
    // Simulate API call to fetch plugins
    const fetchPlugins = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlugins(demoPlugins);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlugins();
  }, []);
  
  const handleDownload = (id: string, name: string) => {
    // In a real app, this would download the plugin from the backend
    toast.success(`Download di ${name} iniziato`);
  };
  
  const handleDelete = (id: string, name: string) => {
    // In a real app, this would call the backend to delete the plugin
    setPlugins(plugins.filter(plugin => plugin.id !== id));
    toast.success(`${name} eliminato con successo`);
  };
  
  const filteredPlugins = plugins
    .filter(plugin => plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      plugin.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(plugin => filterType === 'all' || plugin.type === filterType);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="container mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cronologia Plugin
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Visualizza e gestisci i tuoi plugin generati.
          </p>
        </div>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cerca plugin..."
                className="pl-10 input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  className="pl-10 input w-full md:w-auto"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">Tutti i tipi</option>
                  <option value="wordpress">WordPress</option>
                  <option value="woocommerce">WooCommerce</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredPlugins.length === 0 ? (
          <div className="text-center py-12">
            <Code size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Nessun plugin trovato
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== 'all'
                ? 'Nessun plugin corrisponde ai criteri di ricerca.'
                : 'Non hai ancora creato alcun plugin. Inizia creando il tuo primo plugin!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data Creazione
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dimensione
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modello
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPlugins.map((plugin) => (
                  <tr key={plugin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {plugin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {plugin.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plugin.type === 'wordpress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {plugin.type === 'wordpress' ? 'WordPress' : 'WooCommerce'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(plugin.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {plugin.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {plugin.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(plugin.id, plugin.name)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(plugin.id, plugin.name)}
                          className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginHistory;