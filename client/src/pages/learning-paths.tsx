import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Users, BookOpen, Play, Lock } from "lucide-react";
import type { Lesson, UserProgress } from "@shared/schema";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function LearningPaths() {
  const [currentUserId] = useLocalStorage("currentUserId", 1);

  // Disable queries to stop continuous loading
  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Chinese New Year Traditions",
      description: "Learn about traditional Chinese celebrations",
      level: 1,
      category: "Cultural",
      xpReward: 100,
      estimatedTime: 15,
      createdAt: new Date()
    }
  ];
  const isLoading = false;
  const userProgress: UserProgress[] = [];

  const lessonsByLevel = lessons?.reduce((acc, lesson) => {
    if (!acc[lesson.level]) {
      acc[lesson.level] = [];
    }
    acc[lesson.level].push(lesson);
    return acc;
  }, {} as Record<number, Lesson[]>) || {};

  const getLessonProgress = (lessonId: number) => {
    return userProgress?.find(p => p.lessonId === lessonId);
  };

  const getLevelProgress = (level: number) => {
    const levelLessons = lessonsByLevel[level] || [];
    const completedLessons = levelLessons.filter(lesson => 
      getLessonProgress(lesson.id)?.completed
    ).length;
    return (completedLessons / levelLessons.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="loading-shimmer h-8 w-64 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="loading-shimmer h-96 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const levels = [
    { 
      level: 1, 
      title: "Beginner", 
      description: "Start your English journey with basic vocabulary and simple conversations",
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    { 
      level: 2, 
      title: "Intermediate", 
      description: "Build on your foundation with more complex grammar and real-world topics",
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    { 
      level: 3, 
      title: "Advanced", 
      description: "Master advanced concepts and cultural nuances in English communication",
      color: "bg-purple-500",
      textColor: "text-purple-600"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-custom mb-2">Learning Paths</h1>
        <p className="text-medium-custom text-lg">Choose your learning journey and progress at your own pace</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {levels.map(({ level, title, description, color, textColor }) => {
          const levelLessons = lessonsByLevel[level] || [];
          const levelProgressValue = getLevelProgress(level);
          const isUnlocked = level === 1 || getLevelProgress(level - 1) >= 80;

          return (
            <Card key={level} className={`shadow-md ${!isUnlocked ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                    {!isUnlocked ? <Lock className="w-6 h-6" /> : level}
                  </div>
                  <Badge variant="outline" className={`${textColor} border-current`}>
                    {levelLessons.length} Lessons
                  </Badge>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <p className="text-medium-custom text-sm">{description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-medium-custom">Progress</span>
                    <span className={textColor}>{Math.round(levelProgressValue)}% Complete</span>
                  </div>
                  <Progress value={levelProgressValue} className="h-2" />
                </div>

                <div className="space-y-3">
                  {levelLessons.slice(0, 3).map((lesson) => {
                    const progress = getLessonProgress(lesson.id);
                    const isCompleted = progress?.completed;
                    
                    return (
                      <div 
                        key={lesson.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : isUnlocked 
                              ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                              : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-dark-custom text-sm mb-1">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center space-x-3 text-xs text-medium-custom">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}m</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>+{lesson.xpReward} XP</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-2">
                            {isCompleted ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <BookOpen className="w-3 h-3 text-white" />
                              </div>
                            ) : isUnlocked ? (
                              <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                                <Play className="w-3 h-3" />
                              </Button>
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <Lock className="w-3 h-3 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {levelLessons.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled={!isUnlocked}
                    >
                      View All {levelLessons.length} Lessons
                    </Button>
                  )}
                </div>

                {!isUnlocked && level > 1 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700">
                      Complete 80% of Level {level - 1} to unlock this level
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Categories */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-dark-custom mb-6">Learning by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Cultural", icon: "🏮", color: "bg-red-500", lessons: lessons?.filter(l => l.category === "Cultural").length || 0 },
            { name: "Vocabulary", icon: "📚", color: "bg-blue-500", lessons: lessons?.filter(l => l.category === "Vocabulary").length || 0 },
            { name: "Conversation", icon: "💬", color: "bg-green-500", lessons: lessons?.filter(l => l.category === "Conversation").length || 0 },
            { name: "Grammar", icon: "✏️", color: "bg-purple-500", lessons: lessons?.filter(l => l.category === "Grammar").length || 0 },
          ].map((category) => (
            <Card key={category.name} className="p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 text-2xl`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-dark-custom mb-2">{category.name}</h3>
              <p className="text-medium-custom text-sm">
                {category.lessons} lesson{category.lessons !== 1 ? 's' : ''} available
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
