import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import ModifyPlugin from './pages/ModifyPlugin';
import ApiSettings from './pages/ApiSettings';
import PluginHistory from './pages/PluginHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  const { theme } = useTheme();
  
  return (
    <div className={theme}>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<ChatInterface />} />
            <Route path="plugins/modify" element={<ModifyPlugin />} />
            <Route path="settings/api" element={<ApiSettings />} />
            <Route path="plugins/history" element={<PluginHistory />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;