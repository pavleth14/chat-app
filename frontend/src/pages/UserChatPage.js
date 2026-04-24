import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChatClient } from '../utils/chatClient';
import ChatComponent from '../components/ChatComponent';

function UserChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();                    // ← uzimamo iz AuthContext-a

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initChat = async () => {
      if (!user?.userId || !user?.role || user.role !== 'user') {
        navigate('/');
        return;
      }

      try {
        console.log('user.streamApiKey: ', user.streamApiKey);
        const client = getChatClient(user.streamApiKey || undefined); // ako imaš apiKey u user-u
        console.log('client', client);

        console.log('user iz UserChatPage', user);

        await client.connectUser(
           { id: user.userId, name: user.userNamee },
          user.streamToken
         );


        const newChannel = client.channel('messaging', {
          members: [user.userId, 'admin']
        });// ili neki drugi channel ID
        await newChannel.watch();

        setChatClient(client);
        setChannel(newChannel);
      } catch (err) {
        console.error("Chat initialization failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup
    return () => {
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [user, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading chat...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!channel || !chatClient) return <div>Chat could not be initialized.</div>;

  return <ChatComponent chatClient={chatClient} channel={channel} />;
}

export default UserChatPage;