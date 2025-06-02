import React, { useState } from "react";

const grammarPlanets = [
  {
    id: "tenses",
    name: "⏳ Tense Planet",
    description: "Practice using the correct verb tenses in context.",
    challenge: {
      question: "Choose the correct verb: 'Yesterday, I ___ to the park.'",
      options: ["go", "went", "going"],
      answer: "went",
    },
  },
  {
    id: "articles",
    name: "📖 Article Asteroid",
    description: "Learn to use 'a', 'an', and 'the' properly.",
    challenge: {
      question: "Which article fits: '___ orange is full of vitamin C'?",
      options: ["A", "An", "The"],
      answer: "An",
    },
  },
  {
    id: "prepositions",
    name: "🛰️ Preposition Planet",
    description: "Explore words like 'in', 'on', 'at' to describe time and place.",
    challenge: {
      question: "Choose the correct preposition: 'The cat is ___ the table.'",
      options: ["on", "in", "at"],
      answer: "on",
    },
  },
  {
    id: "pronouns",
    name: "👽 Pronoun Planet",
    description: "Learn how to replace nouns with pronouns.",
    challenge: {
      question: "Which pronoun replaces 'Tom and I'? '___ are friends.'",
      options: ["He", "We", "They"],
      answer: "We",
    },
  },
  {
    id: "plurals",
    name: "🌌 Plural Galaxy",
    description: "Practice forming regular and irregular plurals.",
    challenge: {
      question: "What is the plural of 'mouse'?",
      options: ["mouses", "mouse", "mice"],
      answer: "mice",
    },
  },
  {
    id: "adjectives",
    name: "🌈 Adjective Asteroid Belt",
    description: "Learn words that describe nouns.",
    challenge: {
      question: "Identify the adjective: 'The tall man ran fast.'",
      options: ["tall", "man", "fast"],
      answer: "tall",
    },
  },
];

const GrammarGalaxy = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAnswer = () => {
    if (!selectedPlanet) return;
    const correct = selectedPlanet.challenge.answer;
    if (selectedOption === correct) {
      setFeedback("✅ Correct! Well done.");
    } else {
      setFeedback("❌ Try again.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      {!selectedPlanet ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">🚀 Welcome to Grammar Galaxy</h2>
          <p className="mb-4">Choose a planet to begin your grammar mission.</p>
          <div className="grid gap-4">
            {grammarPlanets.map((planet) => (
              <button
                key={planet.id}
                className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600"
                onClick={() => setSelectedPlanet(planet)}
              >
                {planet.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">{selectedPlanet.name}</h3>
          <p className="mb-3">{selectedPlanet.description}</p>
          <p className="mb-2 font-semibold">{selectedPlanet.challenge.question}</p>
          <div className="space-y-2 mb-4">
            {selectedPlanet.challenge.options.map((opt, idx) => (
              <label key={idx} className="block">
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  onChange={() => setSelectedOption(opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
          <button
            onClick={handleAnswer}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Answer
          </button>
          {feedback && <p className="mt-3 font-semibold">{feedback}</p>}
        </div>
      )}
    </div>
  );
};

export default GrammarGalaxy;
