import express from "express";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());

// Minimal API routes to prevent loading issues
app.get("/api/users", (req, res) => {
  res.json([{
    id: 1,
    username: "liwei",
    firstName: "Li",
    lastName: "Wei",
    level: "intermediate",
    xp: 1250,
    streak: 12,
    lastActiveDate: new Date(),
    preferences: {},
    createdAt: new Date()
  }]);
});

app.get("/api/daily-challenge", (req, res) => {
  res.json({
    id: 1,
    title: "Describe the Mid-Autumn Festival",
    description: "Practice describing traditional festivals and their cultural significance",
    date: new Date().toISOString(),
    content: {
      type: "speaking",
      prompt: "Describe the Mid-Autumn Festival celebrations in your culture",
      difficulty: "intermediate"
    },
    xpReward: 50,
    completionRequirement: {
      minWords: 100,
      timeLimit: 300
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Setup Vite or static serving
(async () => {
  if (app.get("env") === "development") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();