import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();  

  // ⛔ ako nema usera → login
  if (!user) return <Navigate to="/" replace />;

  // ⛔ role check
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;