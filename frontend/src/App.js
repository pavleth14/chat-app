import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserChatPage from './pages/UserChatPage';
import AdminPage from './pages/AdminPage';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  console.log('user na pocetku', user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={user ? <Navigate to="/chat" /> : <Login />}
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={user ? <Navigate to="/chat" /> : <Signup />}
      />

      {/* User */}
      <Route
        path="/chat"
        element={ 
          <ProtectedRoute role="user">
            <UserChatPage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;