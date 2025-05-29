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
      title: "📚 Learning Paths",
      description: "Structured lessons covering Food, Travel, Technology, Chinese Culture, and more",
      href: "/learning-paths",
      icon: BookOpen,
      gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      borderColor: "border-blue-100 dark:border-blue-800",
      iconBg: "bg-primary",
      stats: "12 topics • 150+ lessons",
      badges: [
        { label: "Beginner", color: "level-beginner" },
        { label: "Intermediate", color: "level-intermediate" },
        { label: "Advanced", color: "level-advanced" },
      ]
    },
    {
      title: "🗣️ Speaking Zone",
      description: "Practice pronunciation, join AI debates, and improve your speaking confidence",
      href: "/speaking-zone",
      icon: Mic,
      gradient: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
      borderColor: "border-emerald-100 dark:border-emerald-800",
      iconBg: "bg-secondary",
      stats: "AI Feedback • Real-time pronunciation scoring"
    },
    {
      title: "🎮 Gamified Learning",
      description: "Word matching, spelling bees, and role-play quests with XP rewards",
      href: "/games",
      icon: Gamepad2,
      gradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      borderColor: "border-purple-100 dark:border-purple-800",
      iconBg: "bg-purple-500",
      stats: "Word Match • Spelling Bee • Role-play • Quests"
    },
    {
      title: "👥 Group Activities",
      description: "Collaborate with classmates on stories, debates, and team challenges",
      href: "/group-activities",
      icon: Users,
      gradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      borderColor: "border-orange-100 dark:border-orange-800",
      iconBg: "bg-orange-500",
      stats: "Team collaboration • Peer feedback"
    },
    {
      title: "🇨🇳 Cultural Bridge",
      description: "Learn about Chinese culture, festivals, and famous places in English",
      href: "/cultural-content",
      icon: Flag,
      gradient: "from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20",
      borderColor: "border-red-100 dark:border-red-800",
      iconBg: "bg-red-500",
      stats: "Chinese festivals • Famous landmarks • Cultural traditions"
    },
    {
      title: "📈 Progress Hub",
      description: "Track your improvement with detailed analytics and achievements",
      href: "/progress",
      icon: BarChart3,
      gradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
      borderColor: "border-indigo-100 dark:border-indigo-800",
      iconBg: "bg-indigo-500",
      stats: `850 words • Level 5 • 12 badges`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome back, {CURRENT_USER.firstName}! 🌟
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Ready to continue your English journey? Today's focus: Chinese Culture in English
              </p>
              
              {/* Daily Challenge Card */}
              {dailyChallenge && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Today's Challenge</h3>
                      <Badge className="bg-accent text-white hover:bg-accent/90">
                        +{dailyChallenge.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-blue-100 mb-4">{dailyChallenge.description}</p>
                    <Button 
                      className="bg-white text-primary hover:bg-blue-50"
                      asChild
                    >
                      <Link href="/daily-challenge">Start Challenge</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Students collaborating in classroom" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
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
                <Card className={cn(
                  "learning-card",
                  module.gradient,
                  module.borderColor
                )}>
                  <CardContent className="p-8 text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform",
                      module.iconBg
                    )}>
                      <module.icon className="text-white text-2xl h-8 w-8" />
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
                    
                    <div className="text-sm text-muted-foreground">{module.stats}</div>
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
