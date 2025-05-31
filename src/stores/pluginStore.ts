import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface ModifiedFile {
  name: string;
  content: string;
}

interface PluginState {
  currentPlugin: PluginInfo | null;
  messages: Message[];
  modifiedFiles: ModifiedFile[];
  canDownload: boolean;
  setCurrentPlugin: (plugin: PluginInfo | null) => void;
  addMessage: (message: Message) => void;
  setModifiedFiles: (files: ModifiedFile[]) => void;
  setCanDownload: (can: boolean) => void;
  clearCurrentSession: () => void;
}

export const usePluginStore = create<PluginState>()(
  persist(
    (set) => ({
      currentPlugin: null,
      messages: [],
      modifiedFiles: [],
      canDownload: false,
      
      setCurrentPlugin: (plugin) => set({ currentPlugin: plugin }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      setModifiedFiles: (files) => set({ modifiedFiles: files }),
      
      setCanDownload: (can) => set({ canDownload: can }),
      
      clearCurrentSession: () => set({
        currentPlugin: null,
        messages: [],
        modifiedFiles: [],
        canDownload: false
      })
    }),
    {
      name: 'plugin-storage',
      partialize: (state) => ({
        currentPlugin: state.currentPlugin,
        messages: state.messages,
        modifiedFiles: state.modifiedFiles,
        canDownload: state.canDownload
      })
    }
  )
);