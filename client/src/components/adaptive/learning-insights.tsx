import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock,
  Eye,
  Headphones,
  Hand,
  BarChart3,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningProfile {
  userId: number;
  currentLevel: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number;
  averageSessionTime: number;
  preferredTopics: string[];
  masteryLevels: Record<string, number>;
  lastUpdated: string;
}

interface AdaptiveRecommendation {
  type: 'lesson' | 'review' | 'challenge' | 'practice';
  content: any;
  reasoning: string;
  difficulty: number;
  estimatedTime: number;
  priority: number;
}

interface LearningInsightsProps {
  userId: number;
  className?: string;
}

export default function LearningInsights({ userId, className }: LearningInsightsProps) {
  const { data: profileData, isLoading } = useQuery<{
    profile: LearningProfile;
    recommendations: AdaptiveRecommendation[];
    generatedAt: string;
  }>({
    queryKey: ["/api/users", userId, "recommendations"],
  });

  const profile = profileData?.profile;
  const recommendations = profileData?.recommendations || [];

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Unable to generate learning insights</p>
        </CardContent>
      </Card>
    );
  }

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'auditory': return <Headphones className="h-4 w-4" />;
      case 'kinesthetic': return <Hand className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <Target className="h-4 w-4" />;
      case 'review': return <BarChart3 className="h-4 w-4" />;
      case 'challenge': return <TrendingUp className="h-4 w-4" />;
      case 'practice': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500';
      case 'review': return 'bg-orange-500';
      case 'challenge': return 'bg-red-500';
      case 'practice': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Learning Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Learning Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Learning Style</span>
                  {getLearningStyleIcon(profile.learningStyle)}
                </div>
                <Badge variant="outline" className="capitalize">
                  {profile.learningStyle}
                </Badge>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Preferred Difficulty</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(profile.difficultyPreference * 100)}%
                  </span>
                </div>
                <ProgressBar value={profile.difficultyPreference * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Average Session</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(profile.averageSessionTime)} minutes
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Strengths</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profile.strengths.slice(0, 3).map((strength) => (
                    <Badge key={strength} variant="secondary" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Focus Areas</span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {profile.weaknesses.slice(0, 3).map((weakness) => (
                    <Badge key={weakness} variant="outline" className="text-xs">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mastery Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(profile.masteryLevels)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([topic, mastery]) => (
                <div key={topic} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{topic}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(mastery)}%
                    </span>
                  </div>
                  <ProgressBar value={mastery} className="h-2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generated suggestions based on your learning patterns
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.slice(0, 5).map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs",
                      getRecommendationColor(rec.type)
                    )}>
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div>
                      <h4 className="font-medium capitalize">{rec.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {rec.content.title || `${rec.type} content`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>~{rec.estimatedTime}min</div>
                    <div>Level {Math.round(rec.difficulty * 10)}/10</div>
                  </div>
                </div>
                
                <p className="text-sm bg-muted p-2 rounded">
                  {rec.reasoning}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={rec.priority > 0.8 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {rec.priority > 0.8 ? "High Priority" : 
                     rec.priority > 0.6 ? "Medium Priority" : "Low Priority"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Start {rec.type}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {profile.preferredTopics.length}
            </div>
            <div className="text-sm text-muted-foreground">Favorite Topics</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {Object.keys(profile.masteryLevels).length}
            </div>
            <div className="text-sm text-muted-foreground">Topics Studied</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {Math.round(
                Object.values(profile.masteryLevels).reduce((a, b) => a + b, 0) / 
                Object.values(profile.masteryLevels).length
              )}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Mastery</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}