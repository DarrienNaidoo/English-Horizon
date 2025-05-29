import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import LearningPaths from "@/pages/learning-paths";
import SpeakingZone from "@/pages/speaking-zone";
import Games from "@/pages/games";
import GroupActivities from "@/pages/group-activities";
import CulturalContent from "@/pages/cultural-content";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
