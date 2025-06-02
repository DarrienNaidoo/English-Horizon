import React, { useState } from "react";

const mysteries = [
  {
    id: 1,
    clue: "I'm something you read that tells a story or gives you facts.",
    answer: "book",
  },
  {
    id: 2,
    clue: "I'm full of keys but can't open a door.",
    answer: "keyboard",
  },
  {
    id: 3,
    clue: "I’m cold and made of water, but I’m not wet.",
    answer: "ice",
  },
  {
    id: 4,
    clue: "I have hands but no arms. I tell you the time.",
    answer: "clock",
  },
  {
    id: 5,
    clue: "You write with me, and I help your thoughts flow.",
    answer: "pen",
  },
  {
    id: 6,
    clue: "I light up a room, but I'm not the sun.",
    answer: "lamp",
  },
  {
    id: 7,
    clue: "You wear me on your feet and I come in pairs.",
    answer: "shoes",
  },
  {
    id: 8,
    clue: "I'm green, live in the ground, and you eat me in salads.",
    answer: "lettuce",
  },
  {
    id: 9,
    clue: "You can hear with me, but I don’t speak.",
    answer: "ear",
  },
  {
    id: 10,
    clue: "I go up when the rain comes down.",
    answer: "umbrella",
  },
];

const MysteryWords = () => {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState([]);

  const handleCheck = () => {
    const correct = mysteries[current].answer.toLowerCase();
    const guess = input.trim().toLowerCase();

    if (guess === correct) {
      setFeedback("🕵️‍♂️ Correct! Mystery solved!");
      setSolved([...solved, mysteries[current].id]);
      setTimeout(() => {
        setCurrent(current + 1);
        setInput("");
        setFeedback("");
      }, 1500);
    } else {
      setFeedback("❌ Not quite. Try again.");
    }
  };

  if (current >= mysteries.length) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">🎉 All Mysteries Solved!</h2>
        <p>You're a true Word Detective!</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔎 Mystery #{current + 1}</h2>
      <p className="mb-3 italic">{mysteries[current].clue}</p>

      <input
        type="text"
        placeholder="Type your guess..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleCheck}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Solve
      </button>

      {feedback && <p className="mt-3 font-semibold">{feedback}</p>}
    </div>
  );
};

export default MysteryWords;
