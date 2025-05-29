import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  progress?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AchievementBadge({ 
  achievement, 
  earned = false, 
  progress = 0,
  className,
  size = "md"
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speaking":
        return "from-secondary to-green-600";
      case "vocabulary":
        return "from-primary to-blue-600";
      case "cultural":
        return "from-red-500 to-pink-600";
      case "streak":
        return "from-accent to-orange-600";
      case "games":
        return "from-purple-500 to-indigo-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getIconFromString = (iconString: string) => {
    // Simple icon mapping - in a real app you'd use a proper icon library
    const iconMap: Record<string, React.ReactNode> = {
      "fas fa-microphone": "🎤",
      "fas fa-book": "📚",
      "fas fa-pagoda": "🏛️",
      "fas fa-fire": "🔥",
      "fas fa-gamepad": "🎮",
      "fas fa-trophy": "🏆"
    };
    
    return iconMap[iconString] || "🏆";
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      earned ? "ring-2 ring-secondary" : "",
      !earned && progress === 0 ? "opacity-60" : "",
      className
    )}>
      <CardContent className={cn(sizeClasses[size], "text-center")}>
        <div className="relative mb-4">
          <div className={cn(
            "achievement-badge mx-auto bg-gradient-to-br",
            iconSizes[size],
            earned ? getCategoryColor(achievement.category) : "from-muted to-muted-foreground",
            earned ? "" : "grayscale"
          )}>
            {earned ? (
              <span className="text-2xl">{getIconFromString(achievement.icon)}</span>
            ) : (
              <Lock className="h-6 w-6 text-white" />
            )}
          </div>
          
          {earned && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle className="h-6 w-6 text-secondary bg-background rounded-full" />
            </div>
          )}
        </div>

        <h3 className={cn("font-semibold mb-2", textSizes[size])}>
          {achievement.title}
        </h3>
        
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
          {achievement.description}
        </p>

        {!earned && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2">
          <Badge className="xp-badge">
            +{achievement.xpReward} XP
          </Badge>
          {achievement.isSecret && !earned && (
            <Badge variant="outline" className="text-xs">
              Secret
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
