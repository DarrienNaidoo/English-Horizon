import React, { useState } from "react";
import GameMenu from "./GameMenu";

import AIQuestAcademy from "../games/AIQuestAcademy/AIQuestAcademy";
import GrammarGalaxy from "../games/GrammarGalaxy/GrammarGalaxy";
import MysteryWords from "../games/MysteryWords/MysteryWords";
import DebateClub from "../games/DebateClub/DebateClub";
import RoleplayTheater from "../games/RoleplayTheater/RoleplayTheater";
import SoundDetective from "../games/SoundDetective/SoundDetective";

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
      case "grammarGalaxy":
        return (
          <div>
            <button
              className="mb-4 text-sm text-purple-600 hover:underline"
              onClick={handleBackToMenu}
            >
              ← Back to Game Menu
            </button>
            <GrammarGalaxy />
          </div>
        );
      case "mysteryWords":
        return (
          <div>
            <button
              className="mb-4 text-sm text-indigo-600 hover:underline"
              onClick={handleBackToMenu}
            >
              ← Back to Game Menu
            </button>
            <MysteryWords />
          </div>
        );
      case "debateClub":
        return (
          <div>
            <button
              className="mb-4 text-sm text-red-600 hover:underline"
              onClick={handleBackToMenu}
            >
              ← Back to Game Menu
            </button>
            <DebateClub />
          </div>
        );
      case "roleplayTheater":
        return (
          <div>
            <button
              className="mb-4 text-sm text-yellow-600 hover:underline"
              onClick={handleBackToMenu}
            >
              ← Back to Game Menu
            </button>
            <RoleplayTheater />
          </div>
        );
      case "soundDetective":
        return (
          <div>
            <button
              className="mb-4 text-sm text-teal-600 hover:underline"
              onClick={handleBackToMenu}
            >
              ← Back to Game Menu
            </button>
            <SoundDetective />
          </div>
        );
      default:
        return <GameMenu onSelectGame={handleSelectGame} />;
    }
  };

  return <div className="p-6">{renderGame()}</div>;
};

export default GameContainer;
