import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { useNavigate } from "react-router-dom"; //
import 'stream-chat-react/dist/css/v2/index.css';
import { useAuth } from '../context/AuthContext';
import {
  Chat,
  Channel,
  ChannelHeader,
  Window,
  MessageList,
  ChannelList,
  MessageInput,
  ChannelPreviewMessenger,
  Thread
} from "stream-chat-react";

let chatClient;




function AdminDashboard({ streamToken, streamApiKey, adminName, onLogout }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleLogout = async () => {
    try {
      // Pozovi backend logout da obriše cookie
      await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Diskonektuj Stream korisnika
      await chatClient?.disconnectUser();
      chatClient = null;
      setUser(null);
      // Obavesti parent (Login komponentu) da je user logout-ovan
      if (onLogout) onLogout();
      navigate("/login")

    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [channel, setChannel] = useState(null);

  useEffect(() => {
    console.log('Admin Dashboard data:', {
      streamToken,
      streamApiKey,
      adminName
    });

    chatClient = new StreamChat(streamApiKey);

    chatClient.connectUser(
      {
        id: adminName,
        name: 'Administrator'
      },
      streamToken
    );

    console.log('LOGGED USER:', chatClient.user);

    // Magda get all admins 5    

    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/getAdmins", {
          method: "GET",
          credentials: "include",
          headers: {
            // "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        console.log(data); // vidi šta dobijaš

        return data;
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdmins();

    const channell = chatClient.channel('messaging', 'livechat', {
      members: [adminName] // Magda ovde ubacis admine 
    });
    channell.watch();
    setChannel(channell);
  }, [streamToken, streamApiKey, adminName]);




  if (channel) {
    return (
      <div>     {/* 🔥 Logout dugme */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          Logout
        </button>
        <Chat client={chatClient} theme={"messaging light"}>
          <ChannelList
            sort={{ last_message_at: -1 }}
            Preview={ChannelPreviewMessenger}
            onSelect={(channel) => { setChannel(channel); }
            }
          />
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat >
      </div>
    );
  }

  //  else {

  //   return (
  //     <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

  //       {/* Header */}
  //       <header className="w-full p-6 border-b border-zinc-800 flex justify-between items-center">
  //         <h1 className="text-2xl font-bold">Admin Panel</h1>
  //         <span className="text-sm text-zinc-400">Logged in as Admin</span>
  //       </header>

  //       {/* Main content */}
  //       <div className="flex-1 flex items-center justify-center px-4">
  //         <div className="bg-zinc-900 p-10 rounded-2xl shadow-xl w-full max-w-2xl text-center">

  //           <h2 className="text-4xl font-bold mb-4">
  //             Dashboard
  //           </h2>

  //           <p className="text-zinc-400 mb-8">
  //             Manage users, create accounts and access conversations.
  //           </p>

  //           {/* Buttons */}
  //           <div className="flex flex-col sm:flex-row gap-4 justify-center">



  //             <Link to="/chat">
  //               <button className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition">
  //                 💬 Open Chat
  //               </button>
  //             </Link>

  //           </div>

  //         </div>
  //       </div>

  //       {/* Footer */}
  //       <footer className="p-4 text-center text-zinc-500 text-sm border-t border-zinc-800">
  //         © 2026 Admin Dashboard
  //       </footer>

  //     </div>
  //   );
  // }
}


export default AdminDashboard;