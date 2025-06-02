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

      <button
        onClick={() => onSelectGame("grammarGalaxy")}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition"
      >
        🚀 Grammar Galaxy
      </button>
    </div>
  );
};

export default GameMenu;
