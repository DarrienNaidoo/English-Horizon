import React, { useState } from "react";

const mysteries = [
  {
    id: 1,
    clue: "I'm something you open when you're curious, and I'm often found on a birthday.",
    answer: "present",
  },
  {
    id: 2,
    clue: "I’m something you wear on your feet, and I help you walk comfortably.",
    answer: "shoes",
  },
  {
    id: 3,
    clue: "I'm full of pages, and I tell stories or share knowledge.",
    answer: "book",
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
