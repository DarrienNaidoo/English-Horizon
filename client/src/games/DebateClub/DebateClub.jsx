import React, { useState } from "react";

const topics = [
  {
    id: 1,
    title: "Should school uniforms be mandatory?",
    sampleArguments: [
      "Uniforms create equality.",
      "Students lose individuality.",
    ],
  },
  {
    id: 2,
    title: "Is technology helping or harming education?",
    sampleArguments: [
      "It gives access to information.",
      "It causes distraction.",
    ],
  },
];

const DebateClub = () => {
  const [current, setCurrent] = useState(0);
  const [userOpinion, setUserOpinion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const nextDebate = () => {
    setCurrent(current + 1);
    setUserOpinion("");
    setSubmitted(false);
  };

  if (current >= topics.length) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold">🎤 Debate Complete</h2>
        <p>Great job sharing your opinions!</p>
      </div>
    );
  }

  const topic = topics[current];

  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎤 Debate Topic #{current + 1}</h2>
      <p className="mb-2 font-semibold">{topic.title}</p>
      <p className="text-sm text-gray-500 mb-4">
        Sample arguments:
        {topic.sampleArguments.map((arg, idx) => (
          <div key={idx}>– {arg}</div>
        ))}
      </p>

      {!submitted ? (
        <>
          <textarea
            value={userOpinion}
            onChange={(e) => setUserOpinion(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Type your opinion here..."
            rows={4}
          />
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Submit Opinion
          </button>
        </>
      ) : (
        <>
          <p className="font-semibold text-green-600 mb-3">✅ Opinion Submitted!</p>
          <button
            onClick={nextDebate}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Next Topic
          </button>
        </>
      )}
    </div>
  );
};

export default DebateClub;
