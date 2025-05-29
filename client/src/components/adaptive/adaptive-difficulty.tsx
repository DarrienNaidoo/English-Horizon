import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Target,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface AdaptiveDifficultyProps {
  userId: number;
  className?: string;
}

interface DifficultyData {
  userId: number;
  optimalDifficulty: number;
  calculatedAt: string;
}

export default function AdaptiveDifficulty({ userId, className }: AdaptiveDifficultyProps) {
  const queryClient = useQueryClient();
  
  const { data: difficultyData, isLoading } = useQuery<DifficultyData>({
    queryKey: ["/api/users", userId, "adaptive-difficulty"],
  });

  const recalculateMutation = useMutation({
    mutationFn: () => apiRequest(`/api/users/${userId}/adaptive-difficulty`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/users", userId, "adaptive-difficulty"] 
      });
    },
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-pulse flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted rounded-full" />
            <div className="w-24 h-4 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!difficultyData) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Unable to calculate optimal difficulty</p>
        </CardContent>
      </Card>
    );
  }

  const optimalDifficulty = difficultyData.optimalDifficulty;
  const difficultyPercentage = Math.round(optimalDifficulty * 100);
  
  const getDifficultyLevel = (difficulty: number) => {
    if (difficulty < 0.3) return { level: "Beginner", color: "text-green-600", bgColor: "bg-green-100" };
    if (difficulty < 0.6) return { level: "Intermediate", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (difficulty < 0.8) return { level: "Advanced", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { level: "Expert", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const getDifficultyTrend = (difficulty: number) => {
    if (difficulty < 0.4) return { 
      trend: "Ready to advance", 
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      description: "Your performance suggests you can handle more challenging content"
    };
    if (difficulty > 0.7) return { 
      trend: "Consider review", 
      icon: <TrendingDown className="h-4 w-4 text-orange-500" />,
      description: "Focus on mastering current level before advancing"
    };
    return { 
      trend: "Optimal pace", 
      icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
      description: "Current difficulty level matches your learning pace well"
    };
  };

  const difficultyInfo = getDifficultyLevel(optimalDifficulty);
  const trendInfo = getDifficultyTrend(optimalDifficulty);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Adaptive Difficulty</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => recalculateMutation.mutate()}
            disabled={recalculateMutation.isPending}
          >
            {recalculateMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Difficulty Level */}
        <div className="text-center space-y-3">
          <div className="space-y-2">
            <div className="text-3xl font-bold">{difficultyPercentage}%</div>
            <Badge 
              className={cn(
                "text-sm px-3 py-1",
                difficultyInfo.color,
                difficultyInfo.bgColor
              )}
            >
              {difficultyInfo.level}
            </Badge>
          </div>
          
          <ProgressBar value={difficultyPercentage} className="h-3" />
          
          <p className="text-sm text-muted-foreground">
            Optimal difficulty based on your recent performance
          </p>
        </div>

        {/* Difficulty Trend */}
        <div className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2">
            {trendInfo.icon}
            <span className="font-medium text-sm">{trendInfo.trend}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {trendInfo.description}
          </p>
        </div>

        {/* Difficulty Breakdown */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Beginner</div>
            <div className={cn(
              "h-2 rounded",
              optimalDifficulty < 0.3 ? "bg-green-500" : "bg-muted"
            )} />
            <div className="text-xs">0-30%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Inter.</div>
            <div className={cn(
              "h-2 rounded",
              optimalDifficulty >= 0.3 && optimalDifficulty < 0.6 ? "bg-blue-500" : "bg-muted"
            )} />
            <div className="text-xs">30-60%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Adv.</div>
            <div className={cn(
              "h-2 rounded",
              optimalDifficulty >= 0.6 && optimalDifficulty < 0.8 ? "bg-orange-500" : "bg-muted"
            )} />
            <div className="text-xs">60-80%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Expert</div>
            <div className={cn(
              "h-2 rounded",
              optimalDifficulty >= 0.8 ? "bg-red-500" : "bg-muted"
            )} />
            <div className="text-xs">80%+</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Last calculated: {new Date(difficultyData.calculatedAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}