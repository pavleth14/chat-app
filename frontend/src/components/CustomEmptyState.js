// CustomEmptyState.js
import React from 'react';

const CustomEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 bg-gray-800 rounded-xl text-center">
      <div className="text-6xl mb-4 animate-bounce">💬</div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-2">
        This channel is empty!
      </h2>
      <p className="text-gray-300 mb-4">
        Start the conversation by sending a message below.
      </p>
      <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-300 transition">
        Send a Message
      </button>
    </div>
  );
};

export default CustomEmptyState;