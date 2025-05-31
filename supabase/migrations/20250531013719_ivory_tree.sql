/*
  # Add plugins and settings tables

  1. New Tables
    - `plugins` - Stores basic plugin information
    - `plugin_settings` - Stores plugin menu configuration
  
  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create plugins table first
CREATE TABLE IF NOT EXISTS plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on plugins
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;

-- Create policies for plugins
CREATE POLICY "Users can read own plugins"
  ON plugins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own plugins"
  ON plugins
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own plugins"
  ON plugins
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own plugins"
  ON plugins
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create plugin settings table
CREATE TABLE IF NOT EXISTS plugin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id uuid REFERENCES plugins(id) ON DELETE CASCADE,
  menu_title text NOT NULL,
  menu_slug text NOT NULL,
  menu_icon text DEFAULT 'dashicons-admin-plugins',
  menu_position integer DEFAULT 99,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on plugin settings
ALTER TABLE plugin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for plugin settings
CREATE POLICY "Users can read own plugin settings"
  ON plugin_settings
  FOR SELECT
  TO authenticated
  USING (
    plugin_id IN (
      SELECT id FROM plugins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own plugin settings"
  ON plugin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    plugin_id IN (
      SELECT id FROM plugins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own plugin settings"
  ON plugin_settings
  FOR UPDATE
  TO authenticated
  USING (
    plugin_id IN (
      SELECT id FROM plugins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    plugin_id IN (
      SELECT id FROM plugins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own plugin settings"
  ON plugin_settings
  FOR DELETE
  TO authenticated
  USING (
    plugin_id IN (
      SELECT id FROM plugins 
      WHERE user_id = auth.uid()
    )
  );