import React, { useState, useRef } from 'react';
import { Upload, Github, FileUp, AlertCircle, Send, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePluginStore } from '../stores/pluginStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProcessingStatus from '../components/ui/ProcessingStatus';
import { Transition } from '@headlessui/react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  size: string;
  files: number;
}

const ModifyPlugin: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
    currentFile?: string;
    message?: string;
  } | null>(null);
  const [menuSettings, setMenuSettings] = useState({
    menuTitle: '',
    menuSlug: '',
    menuIcon: 'dashicons-admin-plugins',
    menuPosition: 99
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentPlugin,
    messages,
    modifiedFiles,
    canDownload,
    setCurrentPlugin,
    addMessage,
    setModifiedFiles,
    setCanDownload
  } = usePluginStore();

  // Auto-scroll to bottom of messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for existing session
  React.useEffect(() => {
    if (currentPlugin) {
      setShowUpload(false);
      setShowChat(true);
    }
  }, [currentPlugin]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      toast.error('Per favore carica un file ZIP');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would handle the file upload to your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      
      // Simulate plugin info extraction
      setCurrentPlugin({
        name: file.name.replace('.zip', ''),
        version: '1.0.0',
        description: 'Plugin WordPress per la gestione dei feed RSS',
        author: 'Alberto Ferrante',
        size: '45 KB',
        files: 12
      });
      
      toast.success('Plugin caricato con successo! Ora puoi interagire con l\'AI.');
      setShowUpload(false);
      setShowChat(true);
      addMessage({
        id: '1',
        role: 'assistant',
        content: 'Ho analizzato il plugin. Come posso aiutarti a migliorarlo?',
        timestamp: new Date(),
      });
    } catch (error) {
      toast.error('Errore durante il caricamento del plugin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubUrl) {
      toast.error('Inserisci un URL GitHub valido');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would handle the GitHub repository processing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      // Simulate plugin info extraction from GitHub
      setCurrentPlugin({
        name: 'RSS Feed Import',
        version: '2.1.0',
        description: 'Plugin WordPress per l\'importazione automatica di feed RSS',
        author: 'Alberto Ferrante',
        size: '128 KB',
        files: 18
      });
      
      toast.success('Repository GitHub elaborato con successo! Ora puoi interagire con l\'AI.');
      setShowUpload(false);
      setShowChat(true);
      addMessage({
        id: '1',
        role: 'assistant',
        content: 'Ho analizzato il codice del repository. Come posso aiutarti a migliorarlo?',
        timestamp: new Date(),
      });
    } catch (error) {
      toast.error('Errore durante l\'elaborazione del repository');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const currentModel = localStorage.getItem('currentModel') || 'openai/gpt-4-turbo';
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    });
    
    setInputValue('');
    setIsTyping(true);
    
    setProcessingStatus({
      status: 'processing',
      progress: 0,
      message: 'Analisi del codice in corso...'
    });
    
    try {
      // Analyze user request
      const userRequest = inputValue.toLowerCase();
      let aiResponse = '';
      let modifications = [];
      
      setProcessingStatus(prev => ({
        ...prev!,
        progress: 25,
        message: 'Generazione modifiche...'
      }));
      
      // Process different types of requests
      if (userRequest.includes('ottimizza') || userRequest.includes('migliora')) {
        aiResponse = `Ho analizzato il codice e apportato le seguenti ottimizzazioni:

1. Migliorata la gestione della memoria
2. Ottimizzate le query al database
3. Implementato il caching dei risultati
4. Ridotto il carico sul server

Le modifiche sono pronte per il download.`;

        modifications = [
          {
            name: 'plugin.php',
            content: `// Codice ottimizzato per ${currentPlugin?.name}`
          },
          {
            name: 'includes/cache.php',
            content: '// Sistema di caching implementato'
          }
        ];
      } else if (userRequest.includes('funzionalità') || userRequest.includes('aggiungi')) {
        aiResponse = `Ho aggiunto le seguenti funzionalità al plugin:

1. Nuovo sistema di logging
2. Integrazione con REST API
3. Supporto per shortcode
4. Dashboard widget

Puoi trovare le nuove funzionalità nel codice aggiornato.`;

        modifications = [
          {
            name: 'includes/api.php',
            content: '// Nuova REST API implementata'
          },
          {
            name: 'includes/shortcodes.php',
            content: '// Sistema shortcode aggiunto'
          }
        ];
      } else {
        aiResponse = `Ho elaborato la tua richiesta e apportato le seguenti modifiche:

1. ${currentPlugin?.name} è stato aggiornato secondo le tue specifiche
2. Il codice è stato testato e ottimizzato
3. La documentazione è stata aggiornata

Puoi scaricare la versione aggiornata del plugin.`;

        modifications = [
          {
            name: 'README.md',
            content: `# ${currentPlugin?.name}\n\nDocumentazione aggiornata`
          }
        ];
      }
      
      setModifiedFiles(modifications);
      setCanDownload(true);
      
      setProcessingStatus(prev => ({
        ...prev!,
        progress: 100,
        status: 'completed',
        message: 'Modifiche completate con successo!'
      }));
      
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      });
    } catch (error) {
      toast.error('Errore durante l\'elaborazione delle modifiche');
      
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Mi dispiace, si è verificato un errore durante l\'elaborazione delle modifiche. Riprova.',
        timestamp: new Date(),
      });
    }
    
    setIsTyping(false);
  };

  const handleDownload = async () => {
    try {
      const loadingToast = toast.loading('Preparazione del pacchetto ZIP...', { id: 'download' });
      
      const zip = new JSZip();
      
      // Add demo files to the ZIP (in a real app, these would be the actual modified files)
      const pluginSlug = currentPlugin?.name?.toLowerCase().replace(/\s+/g, '-') || 'modified-plugin';
      const menuSlug = menuSettings.menuSlug || pluginSlug;
      
      const demoFiles = [
        {
          path: 'plugin.php',
          content: `<?php
/**
 * Plugin Name: ${currentPlugin?.name}
 * Plugin URI: https://example.com/plugins/${currentPlugin?.name?.toLowerCase().replace(/\s+/g, '-')}
 * Description: ${currentPlugin?.description}
 * Version: ${currentPlugin?.version}
 * Author: ${currentPlugin?.author}
 * Author URI: https://example.com
 * Text Domain: ${currentPlugin?.name?.toLowerCase().replace(/\s+/g, '-')}
 * Domain Path: /languages
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add admin menu
add_action('admin_menu', function() {
    add_menu_page(
        '${currentPlugin?.name}', // Page title
        '${menuSettings.menuTitle || currentPlugin?.name}', // Menu title
        'manage_options', // Capability
        '${menuSlug}', // Menu slug
        function() { // Callback function
            ?>
            <div class="wrap">
                <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
                <p>Welcome to ${currentPlugin?.name} settings page.</p>
                <!-- Add your plugin settings form here -->
            </div>
            <?php
        },
        '${menuSettings.menuIcon}', // Menu icon
        ${menuSettings.menuPosition} // Menu position
    );
});
`
        },
        {
          path: 'includes/functions.php',
          content: `<?php
// Modified functions file
function ${currentPlugin?.name?.toLowerCase().replace(/\s+/g, '_')}_init() {
    // Plugin initialization code
}

add_action('plugins_loaded', '${currentPlugin?.name?.toLowerCase().replace(/\s+/g, '_')}_init');`
        },
        {
          path: 'assets/css/style.css',
          content: `/* Modified styles */
.${currentPlugin?.name?.toLowerCase().replace(/\s+/g, '-')} {
    /* Your styles here */
}`
        }
      ];
      
      // Add files to ZIP with proper folder structure
      demoFiles.forEach(file => {
        const { path, content } = file;
        if (path.includes('/')) {
          const folders = path.split('/');
          const fileName = folders.pop()!;
          let currentFolder = zip;
          
          folders.forEach(folder => {
            currentFolder = currentFolder.folder(folder) || currentFolder.folder(folder);
          });
          
          currentFolder.file(fileName, content);
        } else {
          zip.file(path, content);
        }
      });
      
      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download the file
      const pluginName = (currentPlugin?.name || 'modified-plugin').toLowerCase().replace(/\s+/g, '-');
      saveAs(content, `${pluginName}-modified.zip`);
      
      toast.dismiss(loadingToast);
      toast.success('Plugin scaricato con successo!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Errore durante il download del plugin');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl h-full flex flex-col">
      <Transition
        show={showUpload}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 bg-primary-50 dark:bg-primary-900 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-300 flex items-center">
              <FileUp size={24} className="mr-2" />
              Modifica Plugin Esistente
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Carica un plugin WordPress esistente per modificarlo o migliorarlo con l'AI.
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* File Upload Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Carica Plugin ZIP
              </h3>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload
                  size={48}
                  className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Trascina qui il file ZIP del plugin
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  oppure
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".zip"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Seleziona File
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  oppure
                </span>
              </div>
            </div>

            {/* GitHub Repository Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Importa da GitHub
              </h3>
              <form onSubmit={handleGithubSubmit} className="space-y-4">
                <div>
                  <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL Repository GitHub
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Github size={20} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="github-url"
                      className="pl-10 input w-full"
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Importa da GitHub
                </button>
              </form>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Informazioni sul processo
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                    <p>
                      Dopo il caricamento del plugin, l'AI analizzerà il codice e ti aiuterà a:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Migliorare la qualità del codice</li>
                      <li>Aggiungere nuove funzionalità</li>
                      <li>Correggere potenziali bug</li>
                      <li>Ottimizzare le prestazioni</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      {showChat && (
        <>
          {/* Plugin Info Box */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileUp className="mr-2 h-5 w-5 text-primary-500" />
                  Plugin Caricato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                    <p className="font-medium text-gray-900 dark:text-white">{currentPlugin?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Versione</p>
                    <p className="font-medium text-gray-900 dark:text-white">{currentPlugin?.version}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Descrizione</p>
                    <p className="font-medium text-gray-900 dark:text-white">{currentPlugin?.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Autore</p>
                    <p className="font-medium text-gray-900 dark:text-white">{currentPlugin?.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dimensione</p>
                    <p className="font-medium text-gray-900 dark:text-white">{currentPlugin?.size}</p>
                  </div>
                </div>

                {/* Menu Settings */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Impostazioni Menu Admin
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Titolo Menu
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        value={menuSettings.menuTitle}
                        onChange={(e) => setMenuSettings(prev => ({
                          ...prev,
                          menuTitle: e.target.value
                        }))}
                        placeholder={currentPlugin?.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Slug Menu
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        value={menuSettings.menuSlug}
                        onChange={(e) => setMenuSettings(prev => ({
                          ...prev,
                          menuSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                        }))}
                        placeholder={currentPlugin?.name?.toLowerCase().replace(/\s+/g, '-')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Icona Menu
                      </label>
                      <select
                        className="input w-full"
                        value={menuSettings.menuIcon}
                        onChange={(e) => setMenuSettings(prev => ({
                          ...prev,
                          menuIcon: e.target.value
                        }))}
                      >
                        <option value="dashicons-admin-plugins">Plugin</option>
                        <option value="dashicons-admin-settings">Settings</option>
                        <option value="dashicons-admin-tools">Tools</option>
                        <option value="dashicons-admin-generic">Generic</option>
                        <option value="dashicons-admin-appearance">Appearance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Posizione Menu
                      </label>
                      <input
                        type="number"
                        className="input w-full"
                        value={menuSettings.menuPosition}
                        onChange={(e) => setMenuSettings(prev => ({
                          ...prev,
                          menuPosition: parseInt(e.target.value) || 99
                        }))}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {canDownload && (
                <button
                  onClick={handleDownload}
                  className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                >
                  <Download size={18} className="mr-2" />
                  Scarica Plugin
                </button>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-1 flex flex-col">
            <div className="p-4 bg-primary-50 dark:bg-primary-900 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-primary-700 dark:text-primary-300">
                Modifica Plugin con l'AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Descrivi le modifiche o i miglioramenti che vorresti apportare al plugin.
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {processingStatus && (
                <div className="mb-4">
                  <ProcessingStatus {...processingStatus} />
                </div>
              )}
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary-100 dark:bg-primary-900 text-gray-900 dark:text-white'
                          : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100'
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === 'user'
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {new Intl.DateTimeFormat('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(message.timestamp))}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-lg p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="relative flex-1">
                  <textarea
                    className="input w-full pr-12 resize-none h-12 py-3 max-h-32"
                    placeholder="Descrivi le modifiche che vorresti apportare..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    rows={1}
                    disabled={isTyping}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!inputValue.trim() || isTyping}
                >
                  {isTyping ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModifyPlugin;