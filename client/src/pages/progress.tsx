import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { 
  TrendingUp, Star, Clock, Trophy, Target, BookOpen, 
  Mic, Gamepad2, Calendar, Award, Flame, Crown
} from "lucide-react";
import type { User, UserProgress, Activity, UserAchievement } from "@shared/schema";

export default function ProgressPage() {
  const [currentUserId] = useLocalStorage("currentUserId", 1);

  // Disable queries to stop continuous loading
  const user: User = {
    id: 1,
    username: "liming",
    displayName: "李明 (Li Ming)",
    email: "liming@example.com",
    role: "student" as const,
    xpTotal: 1250,
    currentLevel: 3,
    currentStreak: 7,
    createdAt: new Date()
  };
  const userLoading = false;
  const userProgress: UserProgress[] = [];
  const activities: Activity[] = [];
  const userAchievements: UserAchievement[] = [];

  if (userLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="loading-shimmer h-8 w-64 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="loading-shimmer h-64 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const completedLessons = userProgress?.filter(p => p.completed).length || 0;
  const totalLessons = userProgress?.length || 0;
  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Mock data for skills
  const skills = [
    { name: "Reading", level: 3, progress: 75, xp: 850, icon: BookOpen, color: "text-blue-600" },
    { name: "Writing", level: 2, progress: 60, xp: 620, icon: BookOpen, color: "text-green-600" },
    { name: "Listening", level: 3, progress: 80, xp: 920, icon: BookOpen, color: "text-purple-600" },
    { name: "Speaking", level: 2, progress: 45, xp: 480, icon: Mic, color: "text-red-600" },
  ];

  const weeklyStats = [
    { day: "Mon", lessons: 2, minutes: 45 },
    { day: "Tue", lessons: 1, minutes: 30 },
    { day: "Wed", lessons: 3, minutes: 60 },
    { day: "Thu", lessons: 2, minutes: 40 },
    { day: "Fri", lessons: 1, minutes: 25 },
    { day: "Sat", lessons: 4, minutes: 80 },
    { day: "Sun", lessons: 2, minutes: 50 },
  ];

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: "🎯", earned: true },
    { id: 2, name: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", earned: true },
    { id: 3, name: "Vocabulary Master", description: "Learn 100 new words", icon: "📚", earned: true },
    { id: 4, name: "Speaking Star", description: "Complete 20 speaking exercises", icon: "🎤", earned: false },
    { id: 5, name: "Cultural Explorer", description: "Complete all cultural lessons", icon: "🏮", earned: false },
    { id: 6, name: "Grammar Guru", description: "Perfect score on 10 grammar tests", icon: "✏️", earned: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-custom mb-2">Your Progress</h1>
        <p className="text-medium-custom text-lg">Track your English learning journey and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark-custom">{user?.currentLevel || 1}</div>
              <div className="text-sm text-medium-custom">Current Level</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center">
              <Star className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark-custom">{user?.totalXP || 0}</div>
              <div className="text-sm text-medium-custom">Total XP</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary-gradient rounded-xl flex items-center justify-center">
              <Flame className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark-custom">{user?.streak || 0}</div>
              <div className="text-sm text-medium-custom">Day Streak</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-cultural-gradient rounded-xl flex items-center justify-center">
              <Trophy className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-dark-custom">{user?.badges || 0}</div>
              <div className="text-sm text-medium-custom">Badges Earned</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-primary-custom" />
              <span>Skills Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <skill.icon className={`w-5 h-5 ${skill.color}`} />
                      <span className="font-medium text-dark-custom">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        Level {skill.level}
                      </Badge>
                    </div>
                    <span className="text-sm text-medium-custom">{skill.xp} XP</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-medium-custom mt-1">
                    <span>{skill.progress}% to next level</span>
                    <span>{Math.round((skill.progress / 100) * 500)} / 500 XP</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="text-secondary-custom" />
              <span>Weekly Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium">
                      {stat.day}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-dark-custom">
                        {stat.lessons} lesson{stat.lessons !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-medium-custom">{stat.minutes} minutes</div>
                    </div>
                  </div>
                  <div className="w-20">
                    <Progress value={(stat.lessons / 4) * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900">This Week's Summary</div>
              <div className="text-xs text-blue-700 mt-1">
                Total: {weeklyStats.reduce((sum, stat) => sum + stat.lessons, 0)} lessons • {' '}
                {weeklyStats.reduce((sum, stat) => sum + stat.minutes, 0)} minutes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Completion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="text-green-600" />
            <span>Lesson Completion</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600">{completedLessons}</div>
                <div className="text-sm text-medium-custom">Lessons Completed</div>
              </div>
            </div>
            
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600">{totalLessons - completedLessons}</div>
                <div className="text-sm text-medium-custom">Lessons Remaining</div>
              </div>
            </div>
            
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-600">{Math.round(completionRate)}%</div>
                <div className="text-sm text-medium-custom">Completion Rate</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(completionRate)}% Complete</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="text-yellow-600" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <Badge className="mt-2 bg-green-500 text-white text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
