import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Trophy } from "lucide-react";
import { cn, formatXP } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
  trend?: "up" | "down" | "stable";
  className?: string;
  icon?: React.ReactNode;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

export default function ProgressCard({
  title,
  current,
  target,
  unit,
  progress,
  trend = "stable",
  className,
  icon,
  badge
}: ProgressCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-secondary" />;
    if (trend === "down") return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
    return <Target className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-secondary";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {icon || getTrendIcon()}
          {badge && (
            <Badge variant={badge.variant || "outline"} className="text-xs">
              {badge.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{current.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">
              / {target.toLocaleString()} {unit}
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between items-center text-xs">
            <span className={cn("flex items-center space-x-1", getTrendColor())}>
              {trend === "up" && <span>↗ Improving</span>}
              {trend === "down" && <span>↘ Declining</span>}
              {trend === "stable" && <span>→ Steady</span>}
            </span>
            <span className="text-muted-foreground">
              {progress.toFixed(0)}% complete
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
