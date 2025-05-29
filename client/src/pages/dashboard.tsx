import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { 
  Clock, Star, Users, Trophy, Flame, Medal, CheckCircle, 
  Route, Mic, Gamepad2, Globe, ArrowRight, Book, Play
} from "lucide-react";
import type { User, Lesson, Activity, DailyChallenge, UserChallengeProgress } from "@shared/schema";

export default function Dashboard() {
  const [currentUserId] = useLocalStorage("currentUserId", 1);

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: [`/api/user/${currentUserId}`],
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: [`/api/user/${currentUserId}/activities`],
  });

  const { data: todayChallenge } = useQuery<DailyChallenge>({
    queryKey: ["/api/challenges/today"],
  });

  const { data: challengeProgress } = useQuery<UserChallengeProgress>({
    queryKey: [`/api/user/${currentUserId}/challenges/${todayChallenge?.id}/progress`],
    enabled: !!todayChallenge?.id,
  });

  const todayLesson = lessons?.find((lesson: any) => lesson.category === "Cultural");

  if (userLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="loading-shimmer h-8 w-64 rounded mb-4"></div>
        <div className="loading-shimmer h-4 w-96 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 loading-shimmer h-64 rounded-2xl"></div>
          <div className="loading-shimmer h-64 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const levelProgress = user ? ((user.totalXP % 500) / 500) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-custom mb-2">
              Welcome back, <span className="text-primary-custom">{user?.displayName?.split(' ')[0] || 'Student'}</span>! 🌟
            </h1>
            <p className="text-medium-custom text-lg">Ready to continue your English journey?</p>
          </div>
          
          {/* Streak Counter */}
          <div className="mt-4 lg:mt-0 flex items-center space-x-6">
            <Card className="p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center">
                  <Flame className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark-custom">{user?.streak || 0}</div>
                  <div className="text-sm text-medium-custom">Day Streak</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary-gradient rounded-xl flex items-center justify-center">
                  <Trophy className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-dark-custom">{user?.badges || 0}</div>
                  <div className="text-sm text-medium-custom">Badges</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-primary-gradient text-white mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold mb-2">Your Learning Progress</h2>
            <p className="text-blue-100">Keep going! You're doing amazing.</p>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{user?.currentLevel || 1}</div>
              <div className="text-sm text-blue-100">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user?.totalXP || 0}</div>
              <div className="text-sm text-blue-100">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user?.lessonsCompleted || 0}</div>
              <div className="text-sm text-blue-100">Lessons Done</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-blue-100 mb-2">
            <span>Level {user?.currentLevel || 1} Progress</span>
            <span>{Math.round(levelProgress)}% Complete</span>
          </div>
          <Progress value={levelProgress} className="h-3 bg-blue-500/30" />
        </div>
      </Card>

      {/* Quick Actions & Today's Lesson */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Today's Lesson */}
        <Card className="lg:col-span-2 p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-dark-custom">Today's Lesson</h3>
            <Badge variant="secondary" className="bg-secondary-custom/10 text-secondary-custom">
              Recommended
            </Badge>
          </div>
          
          {todayLesson ? (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img 
                src={todayLesson.imageUrl} 
                alt="Lesson preview" 
                className="w-full sm:w-48 h-32 object-cover rounded-xl" 
              />
              
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-dark-custom mb-2">{todayLesson.title}</h4>
                <p className="text-medium-custom mb-3">{todayLesson.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-medium-custom" />
                    <span className="text-sm text-medium-custom">{todayLesson.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent-custom" />
                    <span className="text-sm text-medium-custom">+{todayLesson.xpReward} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-medium-custom" />
                    <span className="text-sm text-medium-custom">{todayLesson.category}</span>
                  </div>
                </div>
                
                <Button className="bg-primary-custom hover:bg-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Book className="w-12 h-12 text-medium-custom mx-auto mb-4" />
              <p className="text-medium-custom">No lessons available at the moment</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-dark-custom mb-4">Quick Practice</h3>
            
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-3 bg-secondary-custom/10 hover:bg-secondary-custom/20"
              >
                <div className="w-10 h-10 bg-secondary-gradient rounded-lg flex items-center justify-center mr-3">
                  <Mic className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-dark-custom">Speaking Practice</div>
                  <div className="text-sm text-medium-custom">5 min quick session</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start p-3 bg-accent-custom/10 hover:bg-accent-custom/20"
              >
                <div className="w-10 h-10 bg-accent-gradient rounded-lg flex items-center justify-center mr-3">
                  <Gamepad2 className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-dark-custom">Word Game</div>
                  <div className="text-sm text-medium-custom">Fun & quick</div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start p-3 bg-cultural-custom/10 hover:bg-cultural-custom/20"
              >
                <div className="w-10 h-10 bg-cultural-gradient rounded-lg flex items-center justify-center mr-3">
                  <Book className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-dark-custom">Review Words</div>
                  <div className="text-sm text-medium-custom">Vocabulary boost</div>
                </div>
              </Button>
            </div>
          </Card>
          
          {/* Daily Challenge */}
          {todayChallenge && (
            <Card className="bg-accent-gradient text-white p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Medal className="text-2xl" />
                <h3 className="text-lg font-semibold">Daily Challenge</h3>
              </div>
              <p className="text-yellow-100 mb-4">{todayChallenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span>{challengeProgress?.currentCount || 0}</span>/<span>{todayChallenge.targetCount}</span> completed
                </div>
                <div className="text-sm font-medium">+{todayChallenge.xpReward} XP</div>
              </div>
              <Progress 
                value={((challengeProgress?.currentCount || 0) / todayChallenge.targetCount) * 100} 
                className="mt-3 h-2 bg-yellow-400/30" 
              />
            </Card>
          )}
        </div>
      </div>

      {/* Learning Modules */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark-custom">Learning Modules</h2>
          <Button variant="ghost" className="text-primary-custom hover:text-blue-600">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              icon: Route,
              title: "Learning Paths",
              description: "Structured courses from beginner to advanced levels",
              badge: "3 Active",
              gradient: "bg-primary-gradient",
            },
            {
              icon: Mic,
              title: "Speaking Zone",
              description: "Practice pronunciation with AI feedback and peer debates",
              badge: "New Session",
              gradient: "bg-secondary-gradient",
            },
            {
              icon: Gamepad2,
              title: "Game Center",
              description: "Fun games and challenges to boost your skills",
              badge: "5 Games",
              gradient: "bg-accent-gradient",
            },
            {
              icon: Globe,
              title: "Cultural Bridge",
              description: "Learn about Chinese culture in English",
              badge: "Featured",
              gradient: "bg-cultural-gradient",
            },
          ].map((module, index) => (
            <Card key={index} className="p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-16 h-16 ${module.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                <module.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-dark-custom mb-2">{module.title}</h3>
              <p className="text-medium-custom text-sm mb-3">{module.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{module.badge}</Badge>
                <ArrowRight className="w-4 h-4 text-medium-custom" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Cultural Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-dark-custom mb-4">Recent Activity</h3>
          
          <div className="space-y-4">
            {activities?.length ? activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-secondary-gradient rounded-xl flex items-center justify-center">
                  {activity.type === 'lesson_completed' && <CheckCircle className="text-white" />}
                  {activity.type === 'badge_earned' && <Trophy className="text-white" />}
                  {activity.type === 'group_activity' && <Users className="text-white" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-dark-custom">{activity.title}</div>
                  <div className="text-sm text-medium-custom">{activity.description}</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-medium-custom">No recent activities</p>
              </div>
            )}
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-primary-custom hover:text-blue-600">
            View All Activity
          </Button>
        </Card>

        {/* Cultural Spotlight */}
        <Card className="p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="text-cultural-custom text-xl" />
            <h3 className="text-xl font-semibold text-dark-custom">Cultural Spotlight</h3>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
            alt="Chinese cultural celebration" 
            className="w-full h-48 object-cover rounded-xl mb-4" 
          />
          
          <h4 className="text-lg font-semibold text-dark-custom mb-2">Mid-Autumn Festival Traditions</h4>
          <p className="text-medium-custom mb-4">
            Discover how to describe this beautiful Chinese festival in English. Learn vocabulary about moon cakes, family reunions, and cultural significance.
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs bg-cultural-custom/10 text-cultural-custom">
                Featured Content
              </Badge>
              <span className="text-xs text-medium-custom">10 min read</span>
            </div>
            <Button variant="ghost" className="text-primary-custom hover:text-blue-600 p-0">
              Read More <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
