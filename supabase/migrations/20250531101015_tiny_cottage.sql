/*
  # Add API settings and conversations storage

  1. New Tables
    - `api_settings` - Stores OpenRouter API configuration
    - `conversations` - Stores chat history and plugin modifications
    - `conversation_messages` - Stores individual messages within conversations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create api_settings table
CREATE TABLE IF NOT EXISTS api_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  openrouter_api_key text NOT NULL,
  preferred_model text NOT NULL DEFAULT 'openai/gpt-4-turbo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on api_settings
ALTER TABLE api_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for api_settings
CREATE POLICY "Users can read own api settings"
  ON api_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own api settings"
  ON api_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own api settings"
  ON api_settings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plugin_id uuid REFERENCES plugins(id) ON DELETE SET NULL,
  title text NOT NULL,
  model text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own conversations"
  ON conversations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create conversation_messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on conversation_messages
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for conversation_messages
CREATE POLICY "Users can read messages from own conversations"
  ON conversation_messages
  FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own conversations"
  ON conversation_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE user_id = auth.uid()
    )
  );