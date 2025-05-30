import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import LearningPaths from "@/pages/learning-paths";
import SpeakingZone from "@/pages/speaking-zone";
import Games from "@/pages/games";
import GroupActivities from "@/pages/group-activities";
import CulturalContent from "@/pages/cultural-content";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import VoiceTranslator from "@/pages/voice-translator";
import AIConversation from "@/pages/ai-conversation";
import VocabularyGames from "@/pages/vocabulary-games";
import WritingAssistant from "@/pages/writing-assistant";
import VirtualClassroom from "@/pages/virtual-classroom";
import PronunciationPractice from "@/pages/pronunciation-practice";
import ReadingComprehension from "@/pages/reading-comprehension";
import SocialLearning from "@/pages/social-learning";
import SpeechRecognition from "@/pages/speech-recognition";
import InteractiveGames from "@/pages/interactive-games";
import CulturalImmersion from "@/pages/cultural-immersion";
import Achievements from "@/pages/achievements";
import DailyChallenge from "@/pages/daily-challenge";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/learning-paths" component={LearningPaths} />
          <Route path="/speaking-zone" component={SpeakingZone} />
          <Route path="/games" component={Games} />
          <Route path="/group-activities" component={GroupActivities} />
          <Route path="/cultural-content" component={CulturalContent} />
          <Route path="/progress" component={Progress} />
          <Route path="/profile" component={Profile} />
          <Route path="/voice-translator" component={VoiceTranslator} />
          <Route path="/ai-conversation" component={AIConversation} />
          <Route path="/vocabulary-games" component={VocabularyGames} />
          <Route path="/writing-assistant" component={WritingAssistant} />
          <Route path="/virtual-classroom" component={VirtualClassroom} />
          <Route path="/pronunciation-practice" component={PronunciationPractice} />
          <Route path="/reading-comprehension" component={ReadingComprehension} />
          <Route path="/social-learning" component={SocialLearning} />
          <Route path="/speech-recognition" component={SpeechRecognition} />
          <Route path="/interactive-games" component={InteractiveGames} />
          <Route path="/cultural-immersion" component={CulturalImmersion} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/daily-challenge" component={DailyChallenge} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Register service worker (disabled during development to prevent reload loops)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="speakworld-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
