
import { useEffect } from "react";
import { useUserMode } from "@/components/mode-selector/useUserMode";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function RedirectHome() {
  const { currentMode } = useUserMode();

  useEffect(() => {
    if (currentMode === "teacher") {
      window.location.replace("/teacher-dashboard");
    } else if (currentMode === "student") {
      window.location.replace("/student-dashboard");
    }
  }, [currentMode]);

  return <LoadingScreen />;
}
