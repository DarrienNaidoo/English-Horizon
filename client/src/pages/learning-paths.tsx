import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, Star, Filter } from "lucide-react";
import LessonCard from "@/components/learning/lesson-card";
import { cn } from "@/lib/utils";
import type { Lesson, UserProgress } from "@shared/schema";

const TOPICS = [
  { id: "food", name: "Food & Cooking", icon: "🍜", color: "bg-orange-100 text-orange-700" },
  { id: "travel", name: "Travel & Places", icon: "✈️", color: "bg-blue-100 text-blue-700" },
  { id: "technology", name: "Technology", icon: "💻", color: "bg-purple-100 text-purple-700" },
  { id: "chinese-culture", name: "Chinese Culture", icon: "🏮", color: "bg-red-100 text-red-700" },
  { id: "school-life", name: "School Life", icon: "🎓", color: "bg-green-100 text-green-700" },
  { id: "hobbies", name: "Hobbies & Sports", icon: "⚽", color: "bg-indigo-100 text-indigo-700" },
];

const LEVELS = [
  { id: "beginner", name: "Beginner", description: "Basic vocabulary and simple sentences" },
  { id: "intermediate", name: "Intermediate", description: "Complex conversations and grammar" },
  { id: "advanced", name: "Advanced", description: "Native-level expressions and idioms" },
];

// Mock user ID - in real app would come from auth
const CURRENT_USER_ID = 1;

export default function LearningPaths() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const { data: lessons = [], isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons", { category: "learning-paths", level: selectedLevel !== "all" ? selectedLevel : undefined }],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", CURRENT_USER_ID, "progress"],
  });

  const filteredLessons = lessons.filter(lesson => {
    if (selectedTopic !== "all" && lesson.topic !== selectedTopic) return false;
    if (selectedLevel !== "all" && lesson.level !== selectedLevel) return false;
    return true;
  });

  const getProgressForLesson = (lessonId: number) => {
    return userProgress.find(p => p.lessonId === lessonId);
  };

  const getLevelStats = (level: string) => {
    const levelLessons = lessons.filter(l => l.level === level);
    const completed = levelLessons.filter(lesson => {
      const progress = getProgressForLesson(lesson.id);
      return progress?.completed;
    }).length;
    
    return {
      total: levelLessons.length,
      completed,
      percentage: levelLessons.length > 0 ? Math.round((completed / levelLessons.length) * 100) : 0
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📚 Learning Paths</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Structured lessons covering essential English topics with culturally relevant content for Chinese students
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Level Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {LEVELS.map((level) => {
            const stats = getLevelStats(level.id);
            return (
              <Card key={level.id} className="learning-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">{level.name}</CardTitle>
                    <Badge className={cn(
                      "level-badge",
                      level.id === "beginner" ? "level-beginner" :
                      level.id === "intermediate" ? "level-intermediate" :
                      "level-advanced"
                    )}>
                      {stats.completed}/{stats.total}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {level.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{stats.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Topics Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Learning Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {TOPICS.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "default" : "outline"}
                  className="h-auto p-4 flex-col space-y-2"
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? "all" : topic.id)}
                >
                  <span className="text-2xl">{topic.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {topic.name}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {TOPICS.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.icon} {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground ml-auto">
            <span>{filteredLessons.length} lessons found</span>
          </div>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more lessons.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={getProgressForLesson(lesson.id)}
                onClick={() => {
                  // Navigate to lesson detail
                  console.log('Opening lesson:', lesson.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
