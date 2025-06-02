import React from "react";

const GameMenu = ({ onSelectGame }) => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold mb-6">🎮 English Horizon Game Menu</h1>

      <button
        onClick={() => onSelectGame("aiQuest")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        🧠 AI Quest Academy
      </button>

      {/* Placeholder for future games */}
      <button
        onClick={() => alert("Coming soon!")}
        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-400 transition"
        disabled
      >
        🚀 Grammar Galaxy (Coming Soon)
      </button>
    </div>
  );
};

export default GameMenu;
