import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChatClient } from '../utils/chatClient';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = async (e) => {
    e.preventDefault();
    setError('');

    if (!userName.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userName, password }),
      });

      const text = await res.text();
      if (!res.ok) {
        let errMsg = `Error: ${res.status}`;
        try { errMsg = JSON.parse(text).error || errMsg; } catch { }
        throw new Error(errMsg);
      }

      const data = JSON.parse(text);
      const { userId, role, streamToken, streamApiKey, accessToken, adminName, userNamee } = data;
      //ovde setujem flag za login preko local storage 
      localStorage.setItem('accessToken', accessToken);

      if (!role) throw new Error('User role missing');

      if (role === 'user') {
        // === STREAM CHAT DEO ===
        const chatClient = getChatClient(streamApiKey);

        if (!chatClient) {
          throw new Error('Failed to initialize chat client');
        }

        // const userName = `${firstName.trim()} ${lastName.trim()}`;

        console.log('Connecting to Stream Chat...', { userId, userName });

        await chatClient.connectUser(
          { id: userId, name: userNamee },
          streamToken
        );

        console.log('✅ Successfully connected to Stream Chat');

        // Sačuvaj sve potrebne podatke u AuthContext
        setUser({
          userId,
          role,
          name: userName,
          streamToken,     // VAŽNO!
          streamApiKey     // VAŽNO!
        });

        navigate('/chat');
      }
      else if (role === 'admin') {
        console.log('rola: ', role)
        setUser({ role, name: userNamee });
        console.log('Login userId',userId)
        navigate("/admin", {
          state: {            
            adminName,
            streamToken,
            streamApiKey
          }
        });
      }
      else {
        throw new Error('Unknown role');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-800">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 px-8 py-12 text-center border-b border-zinc-700">
          <h1 className="text-4xl font-bold text-white mb-3">Log in</h1>
          <p className="text-zinc-400 text-lg">Our team is ready to help you</p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={login} className="space-y-6">
    
               <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
              className="w-full p-4 rounded-xl bg-zinc-800 text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full p-4 rounded-xl bg-zinc-800 text-white"
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="text-center pb-8 text-zinc-500 text-sm">
          Your data is safe and will only be used for this chat session.
        </div>
      </div>
    </div>
  );
}

export default Login;