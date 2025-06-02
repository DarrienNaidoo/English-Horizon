import React, { useState } from "react";

const quests = [
  {
    id: 1,
    title: "The Lost Word",
    prompt: "A villager has forgotten a common English word for 'house'. What is it?",
    answer: "house",
    hint: "It’s where people live.",
    xp: 10,
  },
  {
    id: 2,
    title: "The Magic Sentence",
    prompt: "Form a sentence with the word: *beautiful*.",
    answer: "beautiful",
    hint: "Describe something nice.",
    xp: 15,
  },
  {
    id: 3,
    title: "The Hidden Verb",
    prompt: "What’s the past tense of 'go'?",
    answer: "went",
    hint: "Irregular verb.",
    xp: 15,
  },
];

const AIQuestAcademy = () => {
  const [currentQuest, setCurrentQuest] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const gainXp = (amount) => {
    const newXp = xp + amount;
    const newLevel = Math.floor(newXp / 30) + 1;
    setXp(newXp);
    setLevel(newLevel);
  };

  const handleSubmit = () => {
    const correct = quests[currentQuest].answer.toLowerCase();
    const input = userAnswer.trim().toLowerCase();

    if (input === correct || input.includes(correct)) {
      setFeedback("✅ Correct! Great job!");
      gainXp(quests[currentQuest].xp);
      setTimeout(() => {
        setCurrentQuest(currentQuest + 1);
        setUserAnswer("");
        setFeedback("");
      }, 1500);
    } else {
      setFeedback("❌ Not quite. Try again or check the hint.");
    }
  };

  if (currentQuest >= quests.length) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">🏆 Quest Complete!</h2>
        <p className="mb-2">You've completed all language challenges!</p>
        <p className="text-green-600 font-semibold">Final Level: {level}</p>
        <p className="text-blue-500 font-semibold">Total XP: {xp}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <div className="mb-4">
        <p className="text-sm text-gray-500">Level {level} — XP: {xp}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">🧠 {quests[currentQuest].title}</h2>
      <p className="mb-2">{quests[currentQuest].prompt}</p>

      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        placeholder="Your answer..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {feedback && <p className="mt-3 font-semibold">{feedback}</p>}

      <p className="mt-2 text-sm text-gray-500">
        Hint: {quests[currentQuest].hint}
      </p>
    </div>
  );
};

export default AIQuestAcademy;
