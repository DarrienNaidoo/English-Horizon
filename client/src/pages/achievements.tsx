import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star, TrendingUp, Flame, Crown, Target, Calendar } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: achievementData, isLoading } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const shareAchievementMutation = useMutation({
    mutationFn: async (achievementId) => {
      const response = await fetch(`/api/achievements/${achievementId}/share`, {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common": return "text-gray-600 bg-gray-100";
      case "uncommon": return "text-green-600 bg-green-100";
      case "rare": return "text-blue-600 bg-blue-100";
      case "epic": return "text-purple-600 bg-purple-100";
      case "legendary": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "milestone": return <Target className="w-4 h-4" />;
      case "streak": return <Flame className="w-4 h-4" />;
      case "social": return <Star className="w-4 h-4" />;
      case "skill": return <Medal className="w-4 h-4" />;
      case "exploration": return <Trophy className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  const filteredAchievements = selectedCategory === "all" 
    ? achievementData?.available || []
    : achievementData?.available?.filter(achievement => achievement.category === selectedCategory) || [];

  const earnedAchievements = filteredAchievements.filter(a => a.earned);
  const availableAchievements = filteredAchievements.filter(a => !a.earned);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading achievements...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Achievements & Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Track your progress and compete with learners worldwide
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Level {achievementData?.userStats?.level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {achievementData?.userStats?.totalPoints}
            </div>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Medal className="w-5 h-5 text-blue-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {achievementData?.userStats?.achievementsEarned}
            </div>
            <p className="text-sm text-muted-foreground">Unlocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {achievementData?.userStats?.currentStreak}
            </div>
            <p className="text-sm text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              #{achievementData?.userStats?.rank}
            </div>
            <p className="text-sm text-muted-foreground">worldwide</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">My Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements">
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {["milestone", "streak", "social", "skill", "exploration"].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1">{category}</span>
                </Button>
              ))}
            </div>

            {/* Earned Achievements */}
            {earnedAchievements.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-green-600">
                  Earned Achievements ({earnedAchievements.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedAchievements.map((achievement) => (
                    <Card key={achievement.id} className="border-green-200 bg-green-50/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{achievement.title}</CardTitle>
                              <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                                {achievement.rarity}
                              </Badge>
                            </div>
                          </div>
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-green-600">+{achievement.points} XP</span>
                          <span className="text-muted-foreground">
                            Earned {formatDate(achievement.earnedDate)}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => shareAchievementMutation.mutate(achievement.id)}
                        >
                          Share Achievement
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Available Achievements */}
            {availableAchievements.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Available Achievements ({availableAchievements.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableAchievements.map((achievement) => (
                    <Card key={achievement.id} className="opacity-75 hover:opacity-100 transition-opacity">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl grayscale">{achievement.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{achievement.title}</CardTitle>
                              <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                                {achievement.rarity}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(achievement.category)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {achievement.progress !== undefined && achievement.required && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.required}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.required) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-blue-600">+{achievement.points} XP</span>
                          <Badge variant="outline" className="text-xs">
                            {achievement.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>
                  Top learners by total experience points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievementData?.leaderboard?.map((entry, index) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                        entry.name === "You" 
                          ? "bg-blue-50 border border-blue-200" 
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1 ? "bg-yellow-500 text-white" :
                          entry.rank === 2 ? "bg-gray-400 text-white" :
                          entry.rank === 3 ? "bg-amber-600 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {entry.rank}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${entry.name === "You" ? "text-blue-600" : ""}`}>
                            {entry.name}
                          </p>
                          {entry.name === "You" && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.country}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">XP</p>
                      </div>

                      {entry.rank <= 3 && (
                        <div className="ml-2">
                          {entry.rank === 1 && <Crown className="w-6 h-6 text-yellow-500" />}
                          {entry.rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                          {entry.rank === 3 && <Medal className="w-6 h-6 text-amber-600" />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    This Week's Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievementData?.leaderboard?.slice(0, 5).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{entry.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {entry.points.toLocaleString()} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" />
                    Streak Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-4 text-muted-foreground">
                      <Flame className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Streak leaderboard coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}