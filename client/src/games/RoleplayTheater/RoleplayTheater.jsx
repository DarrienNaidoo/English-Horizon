import React, { useState } from "react";

const scenes = [
  {
    id: 1,
    setting: "Ordering at a restaurant",
    line: "Can I please have the chicken sandwich and a lemonade?",
  },
  {
    id: 2,
    setting: "Asking for directions",
    line: "Excuse me, how do I get to the nearest bus stop?",
  },
  {
    id: 3,
    setting: "Making a phone call",
    line: "Hello, I’d like to speak to Mr. Lee, please.",
  },
  {
    id: 4,
    setting: "Shopping for clothes",
    line: "Do you have this shirt in a smaller size?",
  },
  {
    id: 5,
    setting: "At the doctor’s office",
    line: "I’ve been coughing and feeling tired for three days.",
  },
  {
    id: 6,
    setting: "Job interview introduction",
    line: "Hi, my name is Sarah and I'm excited to apply for this position.",
  },
];

const RoleplayTheater = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [userLine, setUserLine] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    const correct = scenes[currentScene].line.toLowerCase();
    const spoken = userLine.trim().toLowerCase();
    if (spoken.includes(correct.slice(0, 6))) {
      setFeedback("🎭 Great job! You stayed in character.");
    } else {
      setFeedback("🤔 Try to match the tone or key words.");
    }
  };

  const nextScene = () => {
    setCurrentScene(currentScene + 1);
    setUserLine("");
    setFeedback("");
  };

  if (currentScene >= scenes.length) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">🎬 All Scenes Complete!</h2>
        <p>You’ve performed brilliantly!</p>
      </div>
    );
  }

  const scene = scenes[currentScene];

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎬 Scene #{currentScene + 1}</h2>
      <p className="mb-2 font-semibold">Setting: {scene.setting}</p>
      <p className="mb-4 italic">Your line: "{scene.line}"</p>

      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        placeholder="Repeat or type the line..."
        value={userLine}
        onChange={(e) => setUserLine(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Perform Line
      </button>

      {feedback && <p className="mt-3 font-semibold">{feedback}</p>}

      {feedback && (
        <button
          onClick={nextScene}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Next Scene
        </button>
      )}
    </div>
  );
};

export default RoleplayTheater;
