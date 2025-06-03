import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ConversationsPage } from '@/pages/ConversationsPage';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/conversations" element={<ConversationsPage />} />
                      
                      {/* Placeholder routes for future pages */}
                      <Route 
                        path="/analytics" 
                        element={
                          <div className="text-center py-12">
                            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                            <p className="text-gray-600">Analytics page coming soon...</p>
                          </div>
                        } 
                      />
                      <Route 
                        path="/users" 
                        element={
                          <div className="text-center py-12">
                            <h1 className="text-2xl font-bold mb-4">User Management</h1>
                            <p className="text-gray-600">User management page coming soon...</p>
                          </div>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <div className="text-center py-12">
                            <h1 className="text-2xl font-bold mb-4">Settings</h1>
                            <p className="text-gray-600">Settings page coming soon...</p>
                          </div>
                        } 
                      />
                      
                      {/* 404 route */}
                      <Route 
                        path="*" 
                        element={
                          <div className="text-center py-12">
                            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                          </div>
                        } 
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;