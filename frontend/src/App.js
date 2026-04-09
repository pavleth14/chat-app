import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserChatPage from './pages/UserChatPage';
import AdminPage from './pages/AdminPage';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
 // Ako Admin chat je posebna stranica

function App() {
  return (
    <Routes>
      {/* Login stranica */}
      <Route path="/" element={<Login />} />

      {/* User chat */}
 <Route
        path="/chat"
        element={
          <ProtectedRoute role="user">
            <UserChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* Admin chat */}
    

      {/* Sve ostalo → redirect na login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;