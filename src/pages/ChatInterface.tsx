import React, { useState, useEffect, useRef } from 'react';
import { Send, Download, Code, RotateCw, ArrowDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CodeSnippet {
  language: string;
  code: string;
  filename: string;
}

// Simulated code generation
const generatePluginFiles = (): CodeSnippet[] => {
  return [
    {
      language: 'php',
      filename: 'my-plugin.php',
      code: `<?php
/**
 * Plugin Name: WordPress Social Share
 * Plugin URI: https://example.com/plugins/social-share
 * Description: Un plugin per aggiungere pulsanti di condivisione social ai tuoi contenuti
 * Version: 1.0.0
 * Author: Plugin Maker AI
 * Author URI: https://pluginmaker.weblabfactory.it
 * Text Domain: wp-social-share
 * Domain Path: /languages
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Impedisci l'accesso diretto
if (!defined('ABSPATH')) {
    exit;
}

// Definizioni costanti
define('WP_SOCIAL_SHARE_VERSION', '1.0.0');
define('WP_SOCIAL_SHARE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WP_SOCIAL_SHARE_PLUGIN_URL', plugin_dir_url(__FILE__));

// Inclusione file
require_once WP_SOCIAL_SHARE_PLUGIN_DIR . 'includes/class-wp-social-share.php';
require_once WP_SOCIAL_SHARE_PLUGIN_DIR . 'includes/class-wp-social-share-admin.php';

// Hook di attivazione, disattivazione e disinstallazione
register_activation_hook(__FILE__, array('WP_Social_Share', 'activate'));
register_deactivation_hook(__FILE__, array('WP_Social_Share', 'deactivate'));

// Inizializzazione plugin
function wp_social_share_init() {
    $plugin = new WP_Social_Share();
    $plugin->init();
    
    if (is_admin()) {
        $admin = new WP_Social_Share_Admin();
        $admin->init();
    }
}
add_action('plugins_loaded', 'wp_social_share_init');`
    },
    {
      language: 'php',
      filename: 'includes/class-wp-social-share.php',
      code: `<?php
/**
 * Classe principale del plugin
 */
class WP_Social_Share {
    
    /**
     * Costruttore
     */
    public function __construct() {
        // Inizializzazione
    }
    
    /**
     * Inizializzazione
     */
    public function init() {
        // Carica testi traduzione
        add_action('init', array($this, 'load_textdomain'));
        
        // Aggiungi social buttons dopo il contenuto
        add_filter('the_content', array($this, 'add_social_buttons'));
        
        // Carica script e stili
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    /**
     * Carica il dominio di traduzione
     */
    public function load_textdomain() {
        load_plugin_textdomain('wp-social-share', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Aggiunge pulsanti di condivisione social al contenuto
     */
    public function add_social_buttons($content) {
        // Non aggiungere ai feed o pagine admin
        if (is_feed() || is_admin()) {
            return $content;
        }
        
        // Aggiungi solo ai post singoli e pagine
        if (is_singular('post') || is_page()) {
            $post_url = urlencode(get_permalink());
            $post_title = urlencode(get_the_title());
            
            $buttons = '<div class="wp-social-share">';
            $buttons .= '<h4>' . __('Condividi:', 'wp-social-share') . '</h4>';
            $buttons .= '<a href="https://www.facebook.com/sharer/sharer.php?u=' . $post_url . '" target="_blank" class="wp-social-share-facebook">' . __('Facebook', 'wp-social-share') . '</a>';
            $buttons .= '<a href="https://twitter.com/intent/tweet?url=' . $post_url . '&text=' . $post_title . '" target="_blank" class="wp-social-share-twitter">' . __('Twitter', 'wp-social-share') . '</a>';
            $buttons .= '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' . $post_url . '&title=' . $post_title . '" target="_blank" class="wp-social-share-linkedin">' . __('LinkedIn', 'wp-social-share') . '</a>';
            $buttons .= '</div>';
            
            return $content . $buttons;
        }
        
        return $content;
    }
    
    /**
     * Carica script e stili
     */
    public function enqueue_scripts() {
        wp_enqueue_style(
            'wp-social-share-css', 
            WP_SOCIAL_SHARE_PLUGIN_URL . 'assets/css/wp-social-share.css', 
            array(), 
            WP_SOCIAL_SHARE_VERSION
        );
        
        wp_enqueue_script(
            'wp-social-share-js',
            WP_SOCIAL_SHARE_PLUGIN_URL . 'assets/js/wp-social-share.js',
            array('jquery'),
            WP_SOCIAL_SHARE_VERSION,
            true
        );
    }
    
    /**
     * Attivazione plugin
     */
    public static function activate() {
        // Logica attivazione
    }
    
    /**
     * Disattivazione plugin
     */
    public static function deactivate() {
        // Logica disattivazione
    }
}
`
    },
    {
      language: 'php',
      filename: 'includes/class-wp-social-share-admin.php',
      code: `<?php
/**
 * Classe per gestire la parte admin del plugin
 */
class WP_Social_Share_Admin {
    
    /**
     * Costruttore
     */
    public function __construct() {
        // Inizializzazione
    }
    
    /**
     * Inizializzazione
     */
    public function init() {
        // Aggiunge menu nel pannello admin
        add_action('admin_menu', array($this, 'add_menu'));
        
        // Registra impostazioni
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    /**
     * Aggiunge menu nel pannello admin
     */
    public function add_menu() {
        add_options_page(
            __('WP Social Share', 'wp-social-share'),
            __('WP Social Share', 'wp-social-share'),
            'manage_options',
            'wp-social-share',
            array($this, 'menu_page')
        );
    }
    
    /**
     * Registra le impostazioni
     */
    public function register_settings() {
        register_setting('wp_social_share_settings', 'wp_social_share_options');
        
        add_settings_section(
            'wp_social_share_main_section',
            __('Impostazioni Social Share', 'wp-social-share'),
            array($this, 'main_section_callback'),
            'wp-social-share'
        );
        
        add_settings_field(
            'enable_facebook',
            __('Abilita Facebook', 'wp-social-share'),
            array($this, 'checkbox_callback'),
            'wp-social-share',
            'wp_social_share_main_section',
            array(
                'id' => 'enable_facebook',
                'default' => 1
            )
        );
        
        add_settings_field(
            'enable_twitter',
            __('Abilita Twitter', 'wp-social-share'),
            array($this, 'checkbox_callback'),
            'wp-social-share',
            'wp_social_share_main_section',
            array(
                'id' => 'enable_twitter',
                'default' => 1
            )
        );
        
        add_settings_field(
            'enable_linkedin',
            __('Abilita LinkedIn', 'wp-social-share'),
            array($this, 'checkbox_callback'),
            'wp-social-share',
            'wp_social_share_main_section',
            array(
                'id' => 'enable_linkedin',
                'default' => 1
            )
        );
    }
    
    /**
     * Callback per la sezione principale
     */
    public function main_section_callback() {
        echo '<p>' . __('Configura quali social network mostrare nei pulsanti di condivisione.', 'wp-social-share') . '</p>';
    }
    
    /**
     * Callback per i campi checkbox
     */
    public function checkbox_callback($args) {
        $options = get_option('wp_social_share_options');
        $id = $args['id'];
        $default = isset($args['default']) ? $args['default'] : 0;
        $value = isset($options[$id]) ? $options[$id] : $default;
        
        echo '<input type="checkbox" id="' . esc_attr($id) . '" name="wp_social_share_options[' . esc_attr($id) . ']" value="1" ' . checked(1, $value, false) . '/>';
    }
    
    /**
     * Pagina del menu impostazioni
     */
    public function menu_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('wp_social_share_settings');
                do_settings_sections('wp-social-share');
                submit_button(__('Salva impostazioni', 'wp-social-share'));
                ?>
            </form>
        </div>
        <?php
    }
}
`
    },
    {
      language: 'css',
      filename: 'assets/css/wp-social-share.css',
      code: `.wp-social-share {
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  text-align: center;
}

.wp-social-share h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.wp-social-share a {
  display: inline-block;
  margin: 0 5px;
  padding: 8px 15px;
  color: #fff;
  text-decoration: none;
  border-radius: 3px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.wp-social-share-facebook {
  background: #3b5998;
}
.wp-social-share-facebook:hover {
  background: #2d4373;
}

.wp-social-share-twitter {
  background: #1da1f2;
}
.wp-social-share-twitter:hover {
  background: #0c85d0;
}

.wp-social-share-linkedin {
  background: #0077b5;
}
.wp-social-share-linkedin:hover {
  background: #005582;
}

@media (max-width: 768px) {
  .wp-social-share a {
    display: block;
    margin: 5px 0;
  }
}
`
    },
    {
      language: 'javascript',
      filename: 'assets/js/wp-social-share.js',
      code: `(function($) {
  'use strict';
  
  $(document).ready(function() {
    // Apri i link di condivisione in una finestra popup
    $('.wp-social-share a').on('click', function(e) {
      e.preventDefault();
      
      var url = $(this).attr('href');
      var title = 'Condividi';
      var w = 600;
      var h = 400;
      
      // Posizione centrata
      var left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2);
      
      window.open(
        url, 
        title, 
        'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='+w+',height='+h+',top='+top+',left='+left
      );
      
      // Traccia evento di condivisione se Google Analytics è presente
      if (typeof ga !== 'undefined') {
        var socialNetwork = $(this).text().trim();
        ga('send', 'event', 'Condivisione', 'click', socialNetwork);
      }
    });
  });
  
})(jQuery);
`
    }
  ];
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<CodeSnippet[]>([]);
  const [selectedFile, setSelectedFile] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Ciao! Sono qui per aiutarti a creare il tuo plugin WordPress. Descrivimi le funzionalità che desideri implementare.',
        timestamp: new Date(),
      },
    ]);
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if this is a request to generate a plugin
    if (
      inputValue.toLowerCase().includes('plugin') || 
      inputValue.toLowerCase().includes('wordpress') || 
      inputValue.toLowerCase().includes('woocommerce')
    ) {
      // Add initial response
      const initialResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Grazie per la tua richiesta. Sto analizzando le specifiche e generando il plugin. Questo potrebbe richiedere qualche momento...',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, initialResponse]);
      
      // Simulate generating plugin
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Generate plugin files
      const files = generatePluginFiles();
      setGeneratedFiles(files);
      
      // Final response with plugin details
      const finalResponse: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Ho creato un plugin WordPress per la condivisione social basato sulle tue specifiche. Include:
        
1. Pulsanti di condivisione per Facebook, Twitter e LinkedIn
2. Pannello di amministrazione per configurare quali social abilitare
3. Stili CSS personalizzabili
4. Supporto per la traduzione
        
Puoi vedere l'anteprima del codice qui sotto e scaricare il plugin completo come file ZIP.`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, finalResponse]);
      setIsGenerating(false);
    } else {
      // Regular chat response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Grazie per il tuo messaggio. Per generare un plugin WordPress o WooCommerce, per favore descrivi le funzionalità che desideri includere. 
        
Ad esempio:
- Il tipo di plugin (WordPress generico o WooCommerce)
- Le funzionalità principali che deve avere
- Eventuali integrazioni con altri servizi
- Se necessita di un pannello di amministrazione
- Altre specifiche importanti`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    }
    
    setIsTyping(false);
  };
  
  const handleDownloadZip = async () => {
    try {
      toast.loading('Preparazione del pacchetto ZIP...', { id: 'zip-loading' });
      
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Create a ZIP file with JSZip
      const zip = new JSZip();
      
      // Add files to the ZIP
      generatedFiles.forEach((file) => {
        // Create directories if needed
        const filenameParts = file.filename.split('/');
        let currentFolder = zip;
        
        if (filenameParts.length > 1) {
          for (let i = 0; i < filenameParts.length - 1; i++) {
            const folderName = filenameParts[i];
            if (!currentFolder.folder(folderName)) {
              currentFolder = currentFolder.folder(folderName)!;
            } else {
              currentFolder = currentFolder.folder(folderName)!;
            }
          }
          currentFolder.file(filenameParts[filenameParts.length - 1], file.code);
        } else {
          zip.file(file.filename, file.code);
        }
      });
      
      // Generate the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the ZIP file
      saveAs(content, 'wp-social-share.zip');
      
      toast.dismiss('zip-loading');
      toast.success('Plugin scaricato con successo!');
    } catch (error) {
      toast.dismiss('zip-loading');
      toast.error('Errore durante il download del plugin');
      console.error('Error creating ZIP:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
        {/* Messages section */}
        <div className="flex-1 overflow-y-auto p-4">
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
        
        {/* Plugin generation section */}
        {generatedFiles.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex flex-col md:flex-row h-64 md:h-80">
              {/* File list */}
              <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-sm">File del Plugin</h3>
                  <button
                    onClick={handleDownloadZip}
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                    title="Scarica come ZIP"
                  >
                    <Download size={16} />
                  </button>
                </div>
                <ul>
                  {generatedFiles.map((file, index) => (
                    <li key={index}>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedFile === index
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-2 border-primary-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedFile(index)}
                      >
                        <div className="flex items-center">
                          <Code size={14} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{file.filename}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Code preview */}
              <div className="flex-1 overflow-auto">
                {generatedFiles.length > selectedFile && (
                  <div className="relative h-full">
                    <div className="absolute inset-0 overflow-auto">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 z-10">
                        <h3 className="font-medium text-sm truncate">
                          {generatedFiles[selectedFile].filename}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Aggiorna"
                          >
                            <RotateCw size={16} />
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Scorri in basso"
                            onClick={() => {
                              const codeElement = document.querySelector('.syntax-highlighter');
                              codeElement?.scrollTo({
                                top: codeElement.scrollHeight,
                                behavior: 'smooth',
                              });
                            }}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </div>
                      <SyntaxHighlighter
                        language={generatedFiles[selectedFile].language}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          height: 'calc(100% - 43px)', // 43px is the height of the header
                        }}
                        className="syntax-highlighter"
                      >
                        {generatedFiles[selectedFile].code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Input section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="relative flex-1">
              <textarea
                className="input w-full pr-12 resize-none h-12 py-3 max-h-32"
                placeholder="Descrivi il plugin che vorresti creare..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                disabled={isTyping || isGenerating}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!inputValue.trim() || isTyping || isGenerating}
            >
              {isTyping || isGenerating ? (
                <LoadingSpinner size="small" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Descrivi dettagliatamente le funzionalità che desideri nel tuo plugin. Più dettagli fornisci, migliore sarà il risultato.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;