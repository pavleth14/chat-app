import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      
      {/* Header */}
      <header className="w-full p-6 border-b border-zinc-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <span className="text-sm text-zinc-400">Logged in as Admin</span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-zinc-900 p-10 rounded-2xl shadow-xl w-full max-w-2xl text-center">
          
          <h2 className="text-4xl font-bold mb-4">
            Dashboard
          </h2>

          <p className="text-zinc-400 mb-8">
            Manage users, create accounts and access conversations.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link to="/signup">
              <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition">
                ➕ Register New User
              </button>
            </Link>

            <Link to="/chat">
              <button className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition">
                💬 Open Chat
              </button>
            </Link>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-zinc-500 text-sm border-t border-zinc-800">
        © 2026 Admin Dashboard
      </footer>

    </div>
  );
}

export default AdminDashboard;