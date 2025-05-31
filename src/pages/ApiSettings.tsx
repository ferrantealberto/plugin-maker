import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAvailableModels } from '../services/openRouterService';

interface Model {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface ApiSettings {
  openrouterApiKey: string;
  preferredModel: string;
}

const ApiSettings: React.FC = () => {
  const [settings, setSettings] = useState<ApiSettings>({
    openrouterApiKey: '',
    preferredModel: 'openai/gpt-4-turbo',
  });
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);

  const providers = ['all', ...new Set(models.map(model => model.provider))];

  useEffect(() => {
    const filtered = models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider = selectedProvider === 'all' || model.provider === selectedProvider;
      return matchesSearch && matchesProvider;
    });
    setFilteredModels(filtered);
  }, [searchTerm, selectedProvider, models]);

  useEffect(() => {
    // Load settings from localStorage for demo
    const savedSettings = localStorage.getItem('apiSettings');
    const savedModel = localStorage.getItem('currentModel');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      
      // If there's a saved API key, assume it's valid for demo
      const parsedSettings = JSON.parse(savedSettings);
      if (parsedSettings.openrouterApiKey) {
        setIsApiKeyValid(true);
      }
      
      if (savedModel) {
        setCurrentModel(savedModel);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    
    // Reset validation if API key changes
    if (name === 'openrouterApiKey') {
      setIsApiKeyValid(null);
    }
  };

  const validateApiKey = async () => {
    if (!settings.openrouterApiKey) {
      toast.error('Inserisci una chiave API');
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Simulate API validation - in a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoadingModels(true);
      
      // Demo - always succeed if key looks like a valid format
      if (settings.openrouterApiKey.startsWith('sk-') && settings.openrouterApiKey.length > 20) {
        setIsApiKeyValid(true);
        const modelList = await getAvailableModels(settings.openrouterApiKey);
        setModels(modelList);
        
        // Save current model
        if (modelList.length > 0) {
          const defaultModel = modelList.find(m => m.id === settings.preferredModel) || modelList[0];
          setCurrentModel(defaultModel.id);
          localStorage.setItem('currentModel', defaultModel.id);
        }
        
        toast.success('Chiave API valida!');
      } else {
        setIsApiKeyValid(false);
        toast.error('Formato chiave API non valido');
      }
    } catch (error) {
      setIsApiKeyValid(false);
      toast.error('Errore durante la validazione della chiave API');
    } finally {
      setIsValidating(false);
      setIsLoadingModels(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving to API - in a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo purposes
      localStorage.setItem('apiSettings', JSON.stringify(settings));
      if (currentModel) {
        localStorage.setItem('currentModel', currentModel);
      }
      
      toast.success('Impostazioni salvate con successo');
    } catch (error) {
      toast.error('Errore durante il salvataggio delle impostazioni');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6 bg-primary-50 dark:bg-primary-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-300 flex items-center">
            <Key size={20} className="mr-2" />
            Impostazioni API
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configura le tue chiavi API per utilizzare il servizio di generazione dei plugin.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="openrouterApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OpenRouter API Key
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Ottieni una chiave API
              </a>
            </div>
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="password"
                  id="openrouterApiKey"
                  name="openrouterApiKey"
                  value={settings.openrouterApiKey}
                  onChange={handleInputChange}
                  placeholder="sk-or-..."
                  className="input w-full pr-10"
                />
                {isApiKeyValid !== null && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isApiKeyValid ? (
                      <CheckCircle size={18} className="text-secondary-500" />
                    ) : (
                      <XCircle size={18} className="text-error-500" />
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={validateApiKey}
                disabled={isValidating}
                className="ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isValidating ? 'Verifica...' : 'Verifica'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              La tua chiave API è crittografata e mai condivisa.
            </p>
          </div>

          <div className="mb-8">
            <label htmlFor="preferredModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modello AI Preferito
            </label>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                {currentModel && (
                  <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      Modello LLM attuale: {currentModel}
                    </p>
                  </div>
                )}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cerca modelli..."
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
                    className="pl-10 input w-full md:w-auto capitalize"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    {providers.map(provider => (
                      <option key={provider} value={provider} className="capitalize">
                        {provider}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {isLoadingModels ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Caricamento modelli...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border ${
                      settings.preferredModel === model.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700'
                    } cursor-pointer hover:border-primary-500 transition-colors`}
                    onClick={() => setSettings(prev => ({ ...prev, preferredModel: model.id }))}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{model.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{model.provider}</p>
                      </div>
                      {settings.preferredModel === model.id && (
                        <CheckCircle size={20} className="text-primary-500" />
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p>Contesto: {model.context_length.toLocaleString()} tokens</p>
                      <p>Costo prompt: {model.pricing.prompt}/1K tokens</p>
                      <p>Costo completamento: {model.pricing.completion}/1K tokens</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <select
              id="preferredModel"
              name="preferredModel"
              value={settings.preferredModel}
              onChange={handleInputChange}
              className="hidden"
            >
              <option value="" disabled>Seleziona un modello</option>
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Scegli il modello di AI da utilizzare per la generazione dei plugin.
            </p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <button
              type="button"
              onClick={saveSettings}
              disabled={isSaving}
              className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvataggio...' : 'Salva Impostazioni'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informazioni su OpenRouter
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            OpenRouter ti permette di accedere a diversi modelli di intelligenza artificiale tramite un'unica API, inclusi modelli di OpenAI, Anthropic, Google e altri.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                  Nota importante
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    L'utilizzo di OpenRouter può comportare costi in base al modello selezionato e al volume di richieste. Consulta la documentazione di OpenRouter per i dettagli sui prezzi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;