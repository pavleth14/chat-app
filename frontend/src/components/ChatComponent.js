import React from "react";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "stream-chat-react";
import CustomEmptyState from "./CustomEmptyState";

function ChatComponent({ chatClient, channel, firstName, onLogout }) {
  // Logout funkcija
  const handleLogout = async () => {
    try {
      // Pozovi backend logout da obriše cookie
      await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        credentials: "include", 

      });

      // Diskonektuj Stream korisnika
      await chatClient.disconnectUser();

      // Obavesti parent (Login komponentu) da je user logout-ovan
      if (onLogout) onLogout();

    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="h-screen">
      <Chat client={chatClient} theme="commerce dark" className="h-full">
        <Channel
          channel={channel}
          EmptyStateIndicator={CustomEmptyState}
          className="h-full"
        >
          <Window className="flex flex-col h-full">

            {/* HEADER (sticky) */}
            <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    👨‍💼
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
                </div>

                <div>
                  <h2 className="font-semibold text-white text-lg">
                    Customer Support
                  </h2>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400">
                      Online • Ready to help
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-zinc-800 px-3 py-1 rounded-xl text-sm">
                  <span className="text-zinc-400">Logged in as: </span>
                  <span className="text-white font-medium">
                    {chatClient?.user?.name || firstName}
                  </span>
                </div>

                {/* 🔥 Logout dugme */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  Logout
                </button>
              </div>

            </div>

            {/* MESSAGES (scroll area) */}
            <div className="flex-1 overflow-y-auto bg-zinc-950">
              <MessageList typingIndicator={<TypingIndicator />} />
            </div>

            {/* INPUT (footer style) */}
            <div className="border-t border-zinc-700 bg-zinc-900 px-4 py-3">
              <MessageInput
                focus
                additionalTextareaProps={{
                  placeholder: "Type your message...",
                }}
              />
            </div>

          </Window>
        </Channel>
      </Chat>
    </div>
  );
}

export default ChatComponent;