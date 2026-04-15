import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

function AdminPage() {
  const { state } = useLocation();
    console.log('STATE:', state);
  const { streamToken, streamApiKey,adminName,userId } = state || {};
  return (
   <AdminDashboard
      streamToken={streamToken}
      streamApiKey={streamApiKey}
      adminName={adminName}      
      
    />
  );
}

export default AdminPage;