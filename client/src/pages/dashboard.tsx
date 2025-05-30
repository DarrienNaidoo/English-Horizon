import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Mic, 
  Gamepad2, 
  Users, 
  Flag,
  BarChart3,
  TrendingUp,
  Trophy,
  Flame,
  Globe,
  Download,
  Smartphone,
  Brain,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import { cn, formatXP, getLevelProgress } from "@/lib/utils";
import LearningInsights from "@/components/adaptive/learning-insights";
import AdaptiveDifficulty from "@/components/adaptive/adaptive-difficulty";
import type { User, DailyChallenge } from "@shared/schema";

// Mock user for demo - in real app this would come from authentication
const CURRENT_USER_ID = 1;
const CURRENT_USER: User = {
  id: 1,
  username: "liwei",
  firstName: "Li",
  lastName: "Wei",
  level: "intermediate",
  xp: 1250,
  streak: 12,
  lastActiveDate: new Date(),
  preferences: {},
  createdAt: new Date(),
};

export default function Dashboard() {
  const { data: dailyChallenge } = useQuery<DailyChallenge>({
    queryKey: ["/api/daily-challenge"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "stats"],
  });

  const levelProgress = getLevelProgress(CURRENT_USER.xp, CURRENT_USER.level);

  const learningModules = [
    {
      title: "🧠 Smart Learning Path",
      description: "AI-powered personalized curriculum that adapts to your unique learning style and pace",
      href: "/learning-paths",
      icon: Brain,
      cardClass: "cyber-card",
      iconClass: "text-primary",
      stats: "Personalized AI • 200+ topics • Smart progression",
      level: "ADAPTIVE LEARNING",
      progress: 72,
      badges: [
        { label: "AI-Enhanced", color: "level-advanced" },
        { label: "Personalized", color: "level-intermediate" },
      ]
    },
    {
      title: "🎭 Interactive Practice",
      description: "Engage with AI tutors and practice partners for immersive, real-world learning scenarios",
      href: "/speaking-zone",
      icon: Mic,
      cardClass: "neon-card",
      iconClass: "text-secondary",
      stats: "AI tutors • Interactive scenarios • Instant feedback",
      level: "PRACTICE HUB",
      progress: 85,
      badges: [
        { label: "Interactive", color: "level-advanced" },
      ]
    },
    {
      title: "🏆 Daily Missions",
      description: "Complete fun daily challenges to build consistency and earn rewards while learning",
      href: "/games",
      icon: Gamepad2,
      cardClass: "cyber-card",
      iconClass: "text-accent",
      stats: "Daily streaks • Skill challenges • Achievement rewards",
      level: "MISSION CENTER",
      progress: 94,
      badges: [
        { label: "12-Day Streak", color: "level-intermediate" },
      ]
    },
    {
      title: "🌍 World Explorer",
      description: "Discover diverse subjects and cultures through engaging multimedia content and stories",
      href: "/cultural-content",
      icon: Globe,
      cardClass: "neon-card",
      iconClass: "text-primary",
      stats: "Global content • Interactive stories • Cultural insights",
      level: "DISCOVERY ZONE",
      progress: 67,
      badges: [
        { label: "Explorer", color: "level-beginner" },
      ]
    },
    {
      title: "👥 Social Learning",
      description: "Connect with fellow learners through collaborative projects and friendly competitions",
      href: "/group-activities", 
      icon: Users,
      cardClass: "cyber-card",
      iconClass: "text-secondary",
      stats: "Team projects • Peer learning • Social challenges",
      level: "COMMUNITY HUB",
      progress: 58,
      badges: [
        { label: "Team Player", color: "level-intermediate" },
      ]
    },
    {
      title: "📈 Progress Insights",
      description: "Track your learning journey with detailed analytics and personalized improvement suggestions",
      href: "/progress",
      icon: BarChart3,
      cardClass: "neon-card",
      iconClass: "text-accent",
      stats: "Learning analytics • Progress tracking • Smart insights",
      level: "ANALYTICS CORE",
      progress: 76,
      badges: [
        { label: "Data Driven", color: "level-advanced" },
      ]
    }
  ];

  return (
    <div className="min-h-screen matrix-background">
      {/* Futuristic Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="gradient-primary py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 neon-text floating-element">
                    LEARNVERSE
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-secondary">
                    Welcome back, {CURRENT_USER.firstName}!
                  </h2>
                  <p className="text-lg mb-8 text-primary-foreground/90">
                    🌟 Your personalized learning universe awaits • Discover, Practice, Master
                  </p>
                </div>
                
                {/* User Stats Card */}
                <Card className="cyber-card">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold neon-text">{CURRENT_USER.xp}</div>
                        <div className="text-sm text-muted-foreground">LEARNING XP</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-secondary">{CURRENT_USER.streak}</div>
                        <div className="text-sm text-muted-foreground">DAY STREAK</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-accent">LV5</div>
                        <div className="text-sm text-muted-foreground">RANK</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Learning Progress</span>
                        <span>{Math.round(levelProgress.progress)}%</span>
                      </div>
                      <div className="energy-progress h-3"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Daily Challenge Card */}
                {dailyChallenge && (
                  <Card className="neon-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold neon-text">🎯 TODAY'S CHALLENGE</h3>
                        <Badge className="holographic-button border-accent text-accent">
                          +{dailyChallenge.xpReward} XP
                        </Badge>
                      </div>
                      <p className="text-foreground/80 mb-6">{dailyChallenge.description}</p>
                      <Button 
                        className="holographic-button w-full"
                        asChild
                    >
                      <Link href="/daily-challenge">Start Challenge</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Current Level */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Current Level</h3>
                  <TrendingUp className="text-primary h-5 w-5" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2 capitalize">
                  {CURRENT_USER.level}
                </div>
                <Progress value={levelProgress.progress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {formatXP(CURRENT_USER.xp)} / {formatXP(levelProgress.nextLevelXP)} to {CURRENT_USER.level === 'beginner' ? 'Intermediate' : 'Advanced'}
                </p>
              </CardContent>
            </Card>

            {/* Weekly Streak */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Study Streak</h3>
                  <Flame className="text-accent h-5 w-5" />
                </div>
                <div className="text-3xl font-bold text-accent mb-2">
                  {CURRENT_USER.streak} Days
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep it up! You're on fire! 🔥
                </p>
              </CardContent>
            </Card>

            {/* Latest Achievement */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Latest Achievement</h3>
                  <Trophy className="text-accent h-5 w-5" />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="achievement-badge gradient-accent">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Speaking Master</p>
                    <p className="text-sm text-muted-foreground">Completed 50 speaking exercises</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Adaptive Learning Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span>Personalized Learning Experience</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced analytics create a unique learning path tailored specifically to your progress and preferences
            </p>
          </div>

          <Tabs defaultValue="insights" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Learning Insights</span>
              </TabsTrigger>
              <TabsTrigger value="difficulty" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Adaptive Difficulty</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="mt-6">
              <LearningInsights userId={CURRENT_USER_ID} />
            </TabsContent>

            <TabsContent value="difficulty" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <AdaptiveDifficulty userId={CURRENT_USER_ID} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Learning Adventure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore different ways to improve your English skills through interactive lessons, games, and cultural content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningModules.map((module, index) => (
              <Link key={index} href={module.href}>
                <Card className={cn("learning-card", module.cardClass)}>
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 floating-element">
                      <module.icon className={cn("h-8 w-8", module.iconClass)} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-accent tracking-wider">
                        {module.level}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                      <p className="text-muted-foreground mb-6">{module.description}</p>
                      
                      {module.badges && (
                        <div className="flex justify-center space-x-2 mb-4">
                          {module.badges.map((badge, i) => (
                            <Badge key={i} className={cn("level-badge", badge.color)}>
                              {badge.label}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="text-primary">{module.progress}%</span>
                        </div>
                        <div className="energy-progress h-2"></div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">{module.stats}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Features */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="gradient-primary text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Learn Anywhere, Anytime</h2>
                  <p className="text-blue-100 text-lg mb-6">
                    Download lessons for offline learning. Perfect for commuting, traveling, or areas with limited internet.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <Download className="text-blue-200 h-5 w-5" />
                      <span>Download lesson packs for offline use</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="text-blue-200 h-5 w-5" />
                      <span>Install as a mobile app</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="text-blue-200 h-5 w-5" />
                      <span>Sync progress when back online</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="bg-white text-primary hover:bg-blue-50"
                      size="lg"
                    >
                      Download Lessons
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                      size="lg"
                    >
                      Install App
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                    alt="Students using educational technology" 
                    className="rounded-xl shadow-2xl w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-xl"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
