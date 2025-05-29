import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LearningPaths from "@/pages/learning-paths";
import SpeakingZone from "@/pages/speaking-zone";
import Games from "@/pages/games";
import Progress from "@/pages/progress";
import TeacherMode from "@/pages/teacher-mode";
// import AIInsights from "@/pages/ai-insights";
import Navigation from "@/components/navigation";
import BottomNavigation from "@/components/bottom-navigation";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/learning-paths" component={LearningPaths} />
      <Route path="/speaking-zone" component={SpeakingZone} />
      <Route path="/games" component={Games} />
      <Route path="/progress" component={Progress} />
      <Route path="/teacher-mode" component={TeacherMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="pb-20 lg:pb-0">
            <Router />
          </main>
          <BottomNavigation />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
