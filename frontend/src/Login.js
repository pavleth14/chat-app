import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import ChatComponent from './components/ChatComponent';
import 'stream-chat-react/dist/css/v2/index.css';

let chatClient = null;

function Login() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !password.trim()) {
      setError('Please fill in First Name, Last Name, and Password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password: password.trim()
        }),
      });

      const responseText = await response.text();
      console.log('Status:', response.status);
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMsg = `Error: ${response.status}`;
        try {
          const errData = JSON.parse(responseText);
          errorMsg = errData.error || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = JSON.parse(responseText);
      const { userId, streamToken, streamApiKey } = data;

      if (!streamApiKey) throw new Error('Missing Stream API key');

      // Initialize StreamChat client
      if (!chatClient) {
        chatClient = StreamChat.getInstance(streamApiKey);
      }

      // Connect user
      await chatClient.connectUser(
        { id: userId, name: `${firstName} ${lastName}` },
        streamToken
      );

      console.log('User connected to StreamChat:', userId);

      // === Create channel ===
      const newChannel = chatClient.channel('messaging', userId);

      console.log('Channel successfully created:', newChannel.id);

      setChannel(newChannel);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      chatClient?.disconnectUser().catch(console.error);
    };
  }, []);

  // If channel is active → show chat
  if (channel) {
    return <ChatComponent chatClient={chatClient} channel={channel} />;
  }

  // Login form
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-800">
        
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 px-8 py-12 text-center border-b border-zinc-700">
          
          <h1 className="text-4xl font-bold text-white mb-3">Log in</h1>
          <p className="text-zinc-400 text-lg">Our team is ready to help you</p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={login} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={loading}
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
                disabled={loading}
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 transition-colors text-white font-semibold py-4 rounded-2xl text-lg mt-4"
            >
              {loading ? 'Connecting...' : 'Login'}
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