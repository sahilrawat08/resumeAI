import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <ResumeUpload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analysis/:id" 
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <ResumeAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <div className="lg:ml-80 p-6">
                    <h1 className="text-3xl font-bold text-white">AI Insights</h1>
                    <p className="text-gray-400">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <div className="lg:ml-80 p-6">
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Sidebar />
                  <div className="lg:ml-80 p-6">
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } 
            />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

