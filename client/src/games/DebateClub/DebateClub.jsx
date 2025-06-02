import React, { useState } from "react";

const topics = [
  {
    id: 1,
    title: "Should school uniforms be mandatory?",
    sampleArguments: [
      "Uniforms reduce distractions and create equality.",
      "Students should express their individuality through clothing.",
    ],
  },
  {
    id: 2,
    title: "Is online learning better than classroom learning?",
    sampleArguments: [
      "Online learning offers flexibility and access from anywhere.",
      "Classroom learning encourages social interaction and discipline.",
    ],
  },
  {
    id: 3,
    title: "Should students have homework every day?",
    sampleArguments: [
      "Daily homework helps practice and retain lessons.",
      "Too much homework causes stress and reduces free time.",
    ],
  },
  {
    id: 4,
    title: "Are video games good for learning?",
    sampleArguments: [
      "Some games improve problem-solving and language skills.",
      "Too much gaming can reduce focus on studies.",
    ],
  },
  {
    id: 5,
    title: "Should smartphones be allowed in class?",
    sampleArguments: [
      "Phones can be useful for learning tools and research.",
      "They can cause distraction and cheating.",
    ],
  },
  {
    id: 6,
    title: "Is it better to be rich or happy?",
    sampleArguments: [
      "Money provides comfort and opportunities.",
      "Happiness is more important than material things.",
    ],
  },
  {
    id: 7,
    title: "Should schools start later in the morning?",
    sampleArguments: [
      "Later starts help students get enough sleep.",
      "Early starts prepare students for the real world.",
    ],
  },
  {
    id: 8,
    title: "Should animals be kept in zoos?",
    sampleArguments: [
      "Zoos protect endangered species and educate the public.",
      "Animals should live in their natural environments.",
    ],
  },
  {
    id: 9,
    title: "Is it better to read books or watch movies?",
    sampleArguments: [
      "Books improve imagination and vocabulary.",
      "Movies are quicker and easier to understand visually.",
    ],
  },
  {
    id: 10,
    title: "Should teenagers have part-time jobs?",
    sampleArguments: [
      "Jobs teach responsibility and money management.",
      "Work can take time away from school and rest.",
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
