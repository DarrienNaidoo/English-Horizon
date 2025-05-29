import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, PlayCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, UserProgress } from "@shared/schema";

interface LessonCardProps {
  lesson: Lesson;
  progress?: UserProgress;
  onClick?: () => void;
  className?: string;
}

export default function LessonCard({ lesson, progress, onClick, className }: LessonCardProps) {
  const isCompleted = progress?.completed || false;
  const completionPercentage = progress?.score || 0;

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "level-beginner";
      case "intermediate":
        return "level-intermediate";
      case "advanced":
        return "level-advanced";
      default:
        return "level-beginner";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "speaking":
        return "🗣️";
      case "cultural":
        return "🇨🇳";
      case "games":
        return "🎮";
      case "learning-paths":
        return "📚";
      default:
        return "📖";
    }
  };

  return (
    <Card 
      className={cn(
        "learning-card cursor-pointer transition-all duration-300 hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(lesson.category)}</span>
            <Badge className={cn("level-badge", getLevelBadgeColor(lesson.level))}>
              {lesson.level}
            </Badge>
          </div>
          {isCompleted ? (
            <CheckCircle className="text-secondary h-6 w-6" />
          ) : (
            <PlayCircle className="text-primary h-6 w-6" />
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{lesson.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {lesson.description}
        </p>

        {progress && !isCompleted && completionPercentage > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{lesson.estimatedMinutes} min</span>
            </div>
            <Badge className="xp-badge">
              +{lesson.xpReward} XP
            </Badge>
          </div>

          <Button 
            size="sm" 
            variant={isCompleted ? "outline" : "default"}
            className="ml-auto"
          >
            {isCompleted ? "Review" : "Start"}
          </Button>
        </div>

        {lesson.isOfflineAvailable && (
          <div className="flex items-center space-x-1 mt-3 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>Available offline</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
