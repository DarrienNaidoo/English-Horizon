import React, { useState } from "react";

const quests = [
  {
    id: 1,
    title: "The Forgotten Word",
    prompt: "What's the word for a place where you live?",
    answer: "house",
    hint: "It starts with 'h' and keeps you safe from rain.",
    xp: 10,
  },
  {
    id: 2,
    title: "Time Travel Trouble",
    prompt: "What's the past tense of 'eat'?",
    answer: "ate",
    hint: "It rhymes with 'late'.",
    xp: 10,
  },
  {
    id: 3,
    title: "The Secret Sentence",
    prompt: "Finish the sentence: 'I ___ to the market yesterday.'",
    answer: "went",
    hint: "Irregular past tense of 'go'.",
    xp: 15,
  },
  {
    id: 4,
    title: "The Lost Item",
    prompt: "What's the name of something you wear on your wrist to tell time?",
    answer: "watch",
    hint: "Starts with 'w', ends with 'ch'.",
    xp: 10,
  },
  {
    id: 5,
    title: "Article Ambush",
    prompt: "Choose the correct article: '___ apple a day keeps the doctor away.'",
    answer: "an",
    hint: "Use before a vowel sound.",
    xp: 10,
  },
  {
    id: 6,
    title: "Adjective Adventure",
    prompt: "What is the adjective in this sentence? 'The smart girl solved the problem.'",
    answer: "smart",
    hint: "It describes the girl.",
    xp: 15,
  },
  {
    id: 7,
    title: "Pronoun Puzzle",
    prompt: "Replace the noun with a pronoun: 'Sarah is my friend.' → '___ is my friend.'",
    answer: "she",
    hint: "Sarah is a girl.",
    xp: 10,
  },
  {
    id: 8,
    title: "The Verb Vault",
    prompt: "Identify the verb: 'The dog runs fast.'",
    answer: "runs",
    hint: "An action word.",
    xp: 10,
  },
  {
    id: 9,
    title: "Plurals Please",
    prompt: "What is the plural of 'child'?",
    answer: "children",
    hint: "It’s irregular — not 'childs'.",
    xp: 15,
  },
  {
    id: 10,
    title: "Sentence Builder",
    prompt: "Build a sentence using the word 'excited'.",
    answer: "excited",
    hint: "Show emotion or feeling.",
    xp: 20,
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
