import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterConfig {
  apiKey: string;
  modelId: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

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

export const createChatCompletion = async (
  config: OpenRouterConfig,
  messages: ChatMessage[],
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<string> => {
  try {
    if (!config.apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        model: config.modelId,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': 'https://pluginmaker.weblabfactory.it',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`OpenRouter API error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
    }
    throw new Error('Failed to communicate with OpenRouter API');
  }
};

export const getAvailableModels = async (apiKey: string): Promise<Model[]> => {
  try {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }

    const response = await axios.get(`${OPENROUTER_API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://pluginmaker.weblabfactory.it',
      },
    });

    return response.data.data.map((model: any): Model => ({
      id: model.id,
      name: model.name,
      provider: model.provider?.name || 'Unknown',
      context_length: model.context_length || 4096,
      pricing: {
        prompt: model.pricing?.prompt || '$0.000',
        completion: model.pricing?.completion || '$0.000',
      },
    }));
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`OpenRouter API error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
    }
    throw new Error('Failed to fetch models from OpenRouter API');
  }
};