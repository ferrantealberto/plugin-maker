import express from 'express';
import axios from 'axios';

const router = express.Router();

// OpenRouter API proxy
router.post('/openrouter', async (req, res) => {
  try {
    const { apiKey, endpoint, data } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key richiesta'
      });
    }
    
    const response = await axios.post(`https://openrouter.ai/api/v1/${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://pluginmaker.weblabfactory.it'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('OpenRouter API error:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.error?.message || 'Errore API OpenRouter',
        error: error.response.data
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Errore durante la comunicazione con OpenRouter API'
    });
  }
});

// Validate OpenRouter API key
router.post('/validate-openrouter-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key richiesta'
      });
    }
    
    // Test the API key by fetching models
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://pluginmaker.weblabfactory.it'
      }
    });
    
    if (response.status === 200) {
      res.json({
        success: true,
        message: 'API key valida',
        models: response.data.data
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'API key non valida'
      });
    }
  } catch (error) {
    console.error('API key validation error:', error);
    
    res.status(401).json({
      success: false,
      message: 'API key non valida o errore di comunicazione'
    });
  }
});

export default router;