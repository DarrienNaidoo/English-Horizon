import express from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
app.use(express.json());

// Essential API routes only
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
    date: new Date(),
    content: { type: "speaking", difficulty: "intermediate" },
    xpReward: 50,
    completionRequirement: { minWords: 100 }
  });
});

(async () => {
  const server = createServer(app);
  
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(5000, "0.0.0.0", () => {
    log("Server running on port 5000");
  });
})();