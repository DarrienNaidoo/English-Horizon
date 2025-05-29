import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, TrendingUp, Target, Lightbulb, CheckCircle, 
  Clock, Star, BarChart3, BookOpen, MessageSquare,
  RefreshCw, ChevronRight, Award, Zap
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TranslatedText } from "@/components/translation-toggle";
import { apiRequest } from "@/lib/queryClient";

interface LearningAnalytics {
  id: number;
  userId: number;
  skillArea: string;
  proficiencyLevel: number;
  strugglingTopics: string[];
  strongTopics: string[];
  recommendedDifficulty: string;
  learningStyle: string;
  adaptiveMetrics: {
    completionRate: number;
    averageScore: number;
    streakDays: number;
    totalXP: number;
    learningVelocity: number;
    difficultyPreference: string;
    timeSpentLearning: number;
  };
  lastAnalysis: string;
}

interface PersonalizedRecommendation {
  id: number;
  userId: number;
  lessonId?: number;
  recommendationType: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  priority: number;
  reasoning: string;
  isCompleted: boolean;
  createdAt: string;
}

interface AdaptiveFeedback {
  id: number;
  userId: number;
  activityId?: number;
  feedbackType: string;
  message: string;
  chineseTranslation?: string;
  tone: string;
  triggers: string[];
  isRead: boolean;
  createdAt: string;
}

interface LearningPath {
  focus: string;
  nextSteps: string[];
  timeframe: string;
}

export default function AdaptiveLearningDashboard() {
  const [currentUserId] = useLocalStorage("currentUserId", 1);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<LearningAnalytics>({
    queryKey: [`/api/user/${currentUserId}/analytics`],
  });

  // Fetch recommendations
  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery<PersonalizedRecommendation[]>({
    queryKey: [`/api/user/${currentUserId}/recommendations`],
  });

  // Fetch feedback
  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<AdaptiveFeedback[]>({
    queryKey: [`/api/user/${currentUserId}/feedback`],
  });

  // Fetch learning path
  const { data: learningPath, isLoading: pathLoading } = useQuery<LearningPath>({
    queryKey: [`/api/user/${currentUserId}/learning-path`],
  });

  // Refresh analytics mutation
  const refreshAnalytics = useMutation({
    mutationFn: () => apiRequest(`/api/user/${currentUserId}/analytics/refresh`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${currentUserId}/analytics`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${currentUserId}/recommendations`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${currentUserId}/feedback`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${currentUserId}/learning-path`] });
      setRefreshing(false);
    },
  });

  // Complete recommendation mutation
  const completeRecommendation = useMutation({
    mutationFn: (recommendationId: number) => 
      apiRequest(`/api/recommendation/${recommendationId}/complete`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${currentUserId}/recommendations`] });
    },
  });

  // Mark feedback as read mutation
  const markFeedbackRead = useMutation({
    mutationFn: (feedbackId: number) => 
      apiRequest(`/api/feedback/${feedbackId}/read`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${currentUserId}/feedback`] });
    },
  });

  const handleRefreshAnalytics = () => {
    setRefreshing(true);
    refreshAnalytics.mutate();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: number) => {
    if (priority >= 4) return <Zap className="w-4 h-4 text-red-500" />;
    if (priority >= 3) return <Star className="w-4 h-4 text-yellow-500" />;
    return <Target className="w-4 h-4 text-blue-500" />;
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary-custom" />
          <p className="text-medium-custom">
            <TranslatedText english="Analyzing your learning patterns..." chinese="正在分析您的学习模式..." />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-custom mb-2 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-primary-custom" />
            <TranslatedText english="AI Learning Insights" chinese="AI学习洞察" />
          </h1>
          <p className="text-medium-custom text-lg">
            <TranslatedText 
              english="Personalized recommendations based on your learning patterns"
              chinese="基于您的学习模式的个性化建议"
            />
          </p>
        </div>
        
        <Button
          onClick={handleRefreshAnalytics}
          disabled={refreshing}
          className="mt-4 lg:mt-0 bg-primary-custom hover:bg-blue-600"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          <TranslatedText english="Refresh Analysis" chinese="刷新分析" />
        </Button>
      </div>

      {/* Learning Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-custom">
                    <TranslatedText english="Proficiency Level" chinese="熟练程度" />
                  </p>
                  <p className="text-2xl font-bold text-dark-custom">{analytics.proficiencyLevel}/5</p>
                </div>
                <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-white" />
                </div>
              </div>
              <Progress value={analytics.proficiencyLevel * 20} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-custom">
                    <TranslatedText english="Average Score" chinese="平均分数" />
                  </p>
                  <p className="text-2xl font-bold text-dark-custom">
                    {Math.round(analytics.adaptiveMetrics.averageScore)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-gradient rounded-xl flex items-center justify-center">
                  <Target className="text-white" />
                </div>
              </div>
              <Progress value={analytics.adaptiveMetrics.averageScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-custom">
                    <TranslatedText english="Learning Style" chinese="学习方式" />
                  </p>
                  <p className="text-lg font-semibold text-dark-custom capitalize">
                    {analytics.learningStyle}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center">
                  <Lightbulb className="text-white" />
                </div>
              </div>
              <Badge variant="outline" className="mt-2">
                <TranslatedText english={analytics.recommendedDifficulty} chinese={
                  analytics.recommendedDifficulty === 'beginner' ? '初学者' :
                  analytics.recommendedDifficulty === 'intermediate' ? '中级' : '高级'
                } />
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-custom">
                    <TranslatedText english="Time Spent" chinese="学习时间" />
                  </p>
                  <p className="text-2xl font-bold text-dark-custom">
                    {Math.round(analytics.adaptiveMetrics.timeSpentLearning)}h
                  </p>
                </div>
                <div className="w-12 h-12 bg-cultural-gradient rounded-xl flex items-center justify-center">
                  <Clock className="text-white" />
                </div>
              </div>
              <p className="text-xs text-medium-custom mt-2">
                <TranslatedText english="Total learning time" chinese="总学习时间" />
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="text-primary-custom" />
            <TranslatedText english="Personalized Recommendations" chinese="个性化推荐" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendationsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-custom" />
              <p className="text-medium-custom">
                <TranslatedText english="Loading recommendations..." chinese="正在加载推荐..." />
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <div 
                  key={recommendation.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getPriorityIcon(recommendation.priority)}
                        <h4 className="font-semibold text-dark-custom">
                          {recommendation.title}
                        </h4>
                        <Badge className={getDifficultyColor(recommendation.difficulty)}>
                          {recommendation.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {recommendation.recommendationType}
                        </Badge>
                      </div>
                      
                      <p className="text-medium-custom text-sm mb-3">
                        {recommendation.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-medium-custom">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recommendation.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Priority: {recommendation.priority}/5</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-medium-custom italic mt-2">
                        {recommendation.reasoning}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => completeRecommendation.mutate(recommendation.id)}
                      disabled={completeRecommendation.isPending}
                      className="ml-4 bg-primary-custom hover:bg-blue-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <TranslatedText english="Complete" chinese="完成" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-medium-custom">
                <TranslatedText 
                  english="No recommendations available. Complete some lessons to get personalized suggestions!"
                  chinese="暂无推荐。完成一些课程以获得个性化建议！"
                />
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Path */}
        {learningPath && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="text-secondary-custom" />
                <TranslatedText english="Learning Path" chinese="学习路径" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-dark-custom mb-2">
                    <TranslatedText english="Current Focus" chinese="当前重点" />: {learningPath.focus}
                  </h4>
                  <Badge variant="outline" className="text-primary-custom border-primary-custom">
                    {learningPath.timeframe}
                  </Badge>
                </div>
                
                <div>
                  <h5 className="font-medium text-dark-custom mb-3">
                    <TranslatedText english="Next Steps" chinese="下一步" />:
                  </h5>
                  <div className="space-y-2">
                    {learningPath.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary-custom text-white rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="text-medium-custom">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adaptive Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="text-accent-custom" />
              <TranslatedText english="AI Feedback" chinese="AI反馈" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-custom" />
                <p className="text-medium-custom">
                  <TranslatedText english="Loading feedback..." chinese="正在加载反馈..." />
                </p>
              </div>
            ) : feedback.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {feedback.map((fb) => (
                  <div 
                    key={fb.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      fb.tone === 'celebratory' ? 'border-green-500 bg-green-50' :
                      fb.tone === 'motivational' ? 'border-blue-500 bg-blue-50' :
                      fb.tone === 'constructive' ? 'border-yellow-500 bg-yellow-50' :
                      'border-gray-500 bg-gray-50'
                    } ${!fb.isRead ? 'ring-2 ring-blue-200' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-dark-custom mb-1">{fb.message}</p>
                        {fb.chineseTranslation && (
                          <p className="text-xs text-medium-custom italic">{fb.chineseTranslation}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {fb.feedbackType}
                          </Badge>
                          <span className="text-xs text-medium-custom">
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {!fb.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markFeedbackRead.mutate(fb.id)}
                          className="text-xs"
                        >
                          <TranslatedText english="Mark Read" chinese="标记已读" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-medium-custom">
                  <TranslatedText 
                    english="No feedback available yet. Keep learning to receive personalized insights!"
                    chinese="暂无反馈。继续学习以获得个性化洞察！"
                  />
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skill Areas Progress */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-cultural-custom" />
              <TranslatedText english="Skill Areas Analysis" chinese="技能领域分析" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-dark-custom mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-500" />
                  <TranslatedText english="Strong Areas" chinese="优势领域" />
                </h4>
                {analytics.strongTopics && analytics.strongTopics.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.strongTopics.map((topic, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 mr-2">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-medium-custom text-sm">
                    <TranslatedText 
                      english="Continue learning to identify your strengths!"
                      chinese="继续学习以发现您的优势！"
                    />
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-dark-custom mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-yellow-500" />
                  <TranslatedText english="Areas for Improvement" chinese="待改进领域" />
                </h4>
                {analytics.strugglingTopics && analytics.strugglingTopics.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.strugglingTopics.map((topic, index) => (
                      <Badge key={index} className="bg-yellow-100 text-yellow-800 mr-2">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-medium-custom text-sm">
                    <TranslatedText 
                      english="Great! No specific areas need improvement."
                      chinese="太好了！没有特定领域需要改进。"
                    />
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}