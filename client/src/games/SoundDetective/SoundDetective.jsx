import React, { useState } from "react";

const clues = [
  {
    id: 1,
    text: "The weather is sunny today.",
    answer: "The weather is sunny today.",
  },
  {
    id: 2,
    text: "I have two brothers and one sister.",
    answer: "I have two brothers and one sister.",
  },
  {
    id: 3,
    text: "She loves reading books in the evening.",
    answer: "She loves reading books in the evening.",
  },
  {
    id: 4,
    text: "Can I have a cup of tea, please?",
    answer: "Can I have a cup of tea, please?",
  },
  {
    id: 5,
    text: "They are going to the park this afternoon.",
    answer: "They are going to the park this afternoon.",
  },
];

const SoundDetective = () => {
  const [current, setCurrent] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
  };

  const handleCheck = () => {
    const expected = clues[current].answer.toLowerCase().trim();
    const guess = userInput.toLowerCase().trim();

    if (guess === expected) {
      setFeedback("✅ Correct! Good listening!");
      setTimeout(() => {
        setCurrent(current + 1);
        setUserInput("");
        setFeedback("");
      }, 1500);
    } else {
      setFeedback("❌ Try again. Focus on the details.");
    }
  };

  if (current >= clues.length) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">🎧 Game Complete!</h2>
        <p>You've solved all the audio clues!</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">🔈 Sound Detective</h2>
      <p className="mb-3">Listen carefully and type what you hear.</p>

      <button
        onClick={() => playAudio(clues[current].text)}
        className={`mb-4 px-6 py-2 rounded text-white ${
          isPlaying ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isPlaying}
      >
        {isPlaying ? "Playing..." : "▶️ Play Audio"}
      </button>

      <input
        type="text"
        placeholder="Type what you heard..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={handleCheck}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit
      </button>

      {feedback && <p className="mt-3 font-semibold">{feedback}</p>}
    </div>
  );
};

export default SoundDetective;
