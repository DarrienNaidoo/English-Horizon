import React, { useState } from "react";
import GameMenu from "./GameMenu";

// Import game modules
import AIQuestAcademy from "../games/AIQuestAcademy/AIQuestAcademy";
// Future games can be added here like:
// import GrammarGalaxy from "../games/GrammarGalaxy/GrammarGalaxy";

const GameContainer = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSelectGame = (gameKey) => {
    setSelectedGame(gameKey);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case "aiQuest":
        return (
          <div>
            <button
              className="mb-4 text-sm text-blue-600 hover:underline"
              onClick={handleBackToMenu}
            >
              ← Back to Game Menu
            </button>
            <AIQuestAcademy />
          </div>
        );
      // Add more games like this:
      // case "grammarGalaxy":
      //   return <GrammarGalaxy />;
      default:
        return <GameMenu onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="p-6">
      {renderGame()}
    </div>
  );
};

export default GameContainer;
