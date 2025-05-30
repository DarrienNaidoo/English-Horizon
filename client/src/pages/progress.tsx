import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Calendar,
  BookOpen,
  Mic,
  Gamepad2,
  Users,
  Flag,
  BarChart3,
  Award,
  Flame,
  Star,
  Clock
} from "lucide-react";
import ProgressCard from "@/components/learning/progress-card";
import AchievementBadge from "@/components/learning/achievement-badge";
import { cn, formatXP, getLevelProgress, formatTimeAgo } from "@/lib/utils";
import type { User, UserProgress, Achievement, UserAchievement } from "@shared/schema";

// Mock user data
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
  createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
};

const MOCK_WEEKLY_PROGRESS = [
  { day: "Mon", xp: 45, minutes: 30 },
  { day: "Tue", xp: 60, minutes: 45 },
  { day: "Wed", xp: 35, minutes: 25 },
  { day: "Thu", xp: 80, minutes: 60 },
  { day: "Fri", xp: 55, minutes: 40 },
  { day: "Sat", xp: 70, minutes: 50 },
  { day: "Sun", xp: 40, minutes: 30 },
];

const SKILL_BREAKDOWN = [
  { skill: "Vocabulary", current: 850, target: 1000, level: "intermediate" },
  { skill: "Grammar", current: 72, target: 100, level: "intermediate" },
  { skill: "Speaking", current: 65, target: 100, level: "beginner" },
  { skill: "Listening", current: 89, target: 100, level: "advanced" },
  { skill: "Reading", current: 78, target: 100, level: "intermediate" },
  { skill: "Writing", current: 56, target: 100, level: "beginner" },
];

export default function Progress() {
  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", CURRENT_USER_ID, "progress"],
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: ["/api/users", CURRENT_USER_ID, "achievements"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "stats"],
  });

  const levelProgress = getLevelProgress(CURRENT_USER.xp, CURRENT_USER.level);
  const completedLessons = userProgress.filter(p => p.completed).length;
  const totalStudyTime = userProgress.reduce((total, p) => total + (p.timeSpent || 0), 0);
  const averageScore = userProgress.length > 0 
    ? Math.round(userProgress.reduce((total, p) => total + (p.score || 0), 0) / userProgress.length)
    : 0;

  const earnedAchievements = Array.isArray(achievements) ? achievements.filter(achievement => 
    userAchievements.some(ua => ua.achievementId === achievement.id)
  ) : [];

  const pendingAchievements = Array.isArray(achievements) ? achievements.filter(achievement => 
    !userAchievements.some(ua => ua.achievementId === achievement.id)
  ) : [];

  const getSkillColor = (level: string) => {
    switch (level) {
      case "beginner": return "text-blue-600";
      case "intermediate": return "text-green-600"; 
      case "advanced": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📈 Progress Hub</h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Track your English learning journey with detailed analytics and achievements
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Current Level</h3>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold capitalize mb-2">{CURRENT_USER.level}</div>
              <ProgressBar value={levelProgress.progress} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {formatXP(CURRENT_USER.xp)} / {formatXP(levelProgress.nextLevelXP)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Study Streak</h3>
                <Flame className="h-4 w-4 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent mb-2">{CURRENT_USER.streak}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Lessons Completed</h3>
                <BookOpen className="h-4 w-4 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary mb-2">{completedLessons}</div>
              <p className="text-xs text-muted-foreground">total lessons</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Average Score</h3>
                <Star className="h-4 w-4 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent mb-2">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">across all activities</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Weekly Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {MOCK_WEEKLY_PROGRESS.map((day, index) => (
                    <div key={day.day} className="text-center space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">{day.day}</div>
                      <div className="relative">
                        <div 
                          className="bg-primary/20 rounded-lg mx-auto" 
                          style={{ 
                            height: `${Math.max(day.xp, 20)}px`,
                            width: '24px'
                          }}
                        >
                          <div 
                            className="bg-primary rounded-lg w-full"
                            style={{ height: `${Math.max((day.xp / 80) * 100, 10)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{day.xp} XP</div>
                      <div className="text-xs text-muted-foreground">{day.minutes}m</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProgressCard
                title="Total Study Time"
                current={totalStudyTime}
                target={1800} // 30 hours
                unit="minutes"
                progress={(totalStudyTime / 1800) * 100}
                trend="up"
                icon={<Clock className="h-4 w-4 text-primary" />}
              />
              
              <ProgressCard
                title="XP This Month"
                current={385}
                target={500}
                unit="XP"
                progress={77}
                trend="up"
                icon={<Trophy className="h-4 w-4 text-accent" />}
                badge={{ label: "On Track", variant: "secondary" }}
              />
              
              <ProgressCard
                title="Weekly Goal"
                current={5}
                target={7}
                unit="days"
                progress={71}
                trend="stable"
                icon={<Target className="h-4 w-4 text-secondary" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {SKILL_BREAKDOWN.map((skill) => (
                <Card key={skill.skill}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{skill.skill}</h3>
                      <Badge className={cn(
                        "level-badge",
                        skill.level === "beginner" ? "level-beginner" :
                        skill.level === "intermediate" ? "level-intermediate" :
                        "level-advanced"
                      )}>
                        {skill.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">
                          {skill.current}{skill.skill === "Vocabulary" ? " words" : "%"}
                        </span>
                      </div>
                      <ProgressBar 
                        value={(skill.current / skill.target) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        Target: {skill.target}{skill.skill === "Vocabulary" ? " words" : "%"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Earned Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-accent" />
                <span>Earned Achievements ({earnedAchievements.length})</span>
              </h3>
              
              {earnedAchievements.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                    <p className="text-muted-foreground">
                      Keep learning to earn your first achievement!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      earned={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Available Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                <span>Available Achievements ({pendingAchievements.length})</span>
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingAchievements.map((achievement) => {
                  // Mock progress for demo
                  const mockProgress = Math.floor(Math.random() * 80);
                  return (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      earned={false}
                      progress={mockProgress}
                    />
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProgress.slice(0, 10).map((progress) => (
                    <div key={progress.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Lesson {progress.lessonId}</p>
                          <p className="text-sm text-muted-foreground">
                            {progress.completed ? 'Completed' : 'In Progress'} • 
                            {progress.timeSpent ? ` ${progress.timeSpent}m` : ''} •
                            {progress.completedAt ? ` ${formatTimeAgo(new Date(progress.completedAt))}` : ' Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {progress.score && (
                          <div className="text-lg font-semibold text-secondary">
                            {progress.score}%
                          </div>
                        )}
                        <Badge className="xp-badge mt-1">
                          +{Math.floor(Math.random() * 30) + 10} XP
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {userProgress.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                      <p className="text-muted-foreground">
                        Start learning to see your activity history here.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
