import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock plugins data store
const plugins = [];

// Get all plugins
router.get('/', (req, res) => {
  res.json({
    success: true,
    plugins
  });
});

// Get a specific plugin
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const plugin = plugins.find(p => p.id === id);
  
  if (!plugin) {
    return res.status(404).json({
      success: false,
      message: 'Plugin non trovato'
    });
  }
  
  res.json({
    success: true,
    plugin
  });
});

// Create a new plugin
router.post('/', (req, res) => {
  const { name, description, type, files } = req.body;
  
  if (!name || !type || !files) {
    return res.status(400).json({
      success: false,
      message: 'Dati mancanti per la creazione del plugin'
    });
  }
  
  const newPlugin = {
    id: uuidv4(),
    name,
    description: description || '',
    type,
    files,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: req.user?.id || 'demo-user' // In a real app, this would come from authentication
  };
  
  plugins.push(newPlugin);
  
  res.status(201).json({
    success: true,
    message: 'Plugin creato con successo',
    plugin: newPlugin
  });
});

// Delete a plugin
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const pluginIndex = plugins.findIndex(p => p.id === id);
  
  if (pluginIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Plugin non trovato'
    });
  }
  
  // In a real app, check if the user owns this plugin
  
  plugins.splice(pluginIndex, 1);
  
  res.json({
    success: true,
    message: 'Plugin eliminato con successo'
  });
});

export default router;