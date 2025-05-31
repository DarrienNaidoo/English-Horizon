
import { useState, useEffect } from "react";

export function useUserMode() {
  const [currentMode, setCurrentMode] = useState<"student" | "teacher" | null>(null);

  useEffect(() => {
    const storedMode = localStorage.getItem("userMode");
    setCurrentMode(storedMode === "teacher" ? "teacher" : "student");
  }, []);

  useEffect(() => {
    if (currentMode) {
      localStorage.setItem("userMode", currentMode);
    }
  }, [currentMode]);

  return { currentMode, setCurrentMode };
}
