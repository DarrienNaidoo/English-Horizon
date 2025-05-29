import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, Star, Clock, Trophy, Users, Zap, 
  Target, BookOpen, Mic, Shuffle, Play, Crown
} from "lucide-react";

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: "word-match",
      title: "Word Matching",
      description: "Match English words with their Chinese meanings",
      icon: Target,
      difficulty: "Beginner",
      duration: 5,
      xp: 25,
      category: "Vocabulary",
      color: "bg-green-500",
      players: "Single Player",
      featured: true,
    },
    {
      id: "sentence-builder",
      title: "Sentence Builder",
      description: "Arrange words to create correct English sentences",
      icon: BookOpen,
      difficulty: "Intermediate",
      duration: 10,
      xp: 40,
      category: "Grammar",
      color: "bg-blue-500",
      players: "Single Player",
      featured: false,
    },
    {
      id: "spelling-bee",
      title: "Spelling Bee",
      description: "Test your spelling skills with pronunciation hints",
      icon: Mic,
      difficulty: "Intermediate",
      duration: 8,
      xp: 35,
      category: "Spelling",
      color: "bg-purple-500",
      players: "Single Player",
      featured: true,
    },
    {
      id: "cultural-quiz",
      title: "Cultural Quiz",
      description: "Learn about Chinese culture while practicing English",
      icon: Crown,
      difficulty: "Advanced",
      duration: 15,
      xp: 60,
      category: "Culture",
      color: "bg-red-500",
      players: "Multiplayer",
      featured: false,
    },
    {
      id: "role-play",
      title: "Role-Play Adventures",
      description: "Interactive scenarios in real-world situations",
      icon: Users,
      difficulty: "Intermediate",
      duration: 20,
      xp: 80,
      category: "Speaking",
      color: "bg-orange-500",
      players: "Multiplayer",
      featured: true,
    },
    {
      id: "word-scramble",
      title: "Word Scramble",
      description: "Unscramble letters to form English words quickly",
      icon: Shuffle,
      difficulty: "Beginner",
      duration: 5,
      xp: 20,
      category: "Vocabulary",
      color: "bg-teal-500",
      players: "Single Player",
      featured: false,
    }
  ];

  const leaderboard = [
    { rank: 1, name: "小王 (Xiao Wang)", score: 2840, avatar: "👨‍🎓" },
    { rank: 2, name: "李明 (Li Ming)", score: 2650, avatar: "👨‍💻", isCurrentUser: true },
    { rank: 3, name: "张三 (Zhang San)", score: 2520, avatar: "👩‍🎓" },
    { rank: 4, name: "王丽 (Wang Li)", score: 2350, avatar: "👩‍💼" },
    { rank: 5, name: "陈伟 (Chen Wei)", score: 2180, avatar: "👨‍🔬" },
  ];

  const achievements = [
    { name: "Word Master", description: "Complete 50 vocabulary games", progress: 42, total: 50, icon: "🎯" },
    { name: "Speed Demon", description: "Finish 10 games in under 3 minutes", progress: 7, total: 10, icon: "⚡" },
    { name: "Cultural Expert", description: "Score 100% on 5 cultural quizzes", progress: 3, total: 5, icon: "🏮" },
    { name: "Grammar Guru", description: "Perfect score on 20 grammar games", progress: 15, total: 20, icon: "📚" },
  ];

  const dailyChallenge = {
    title: "Vocabulary Sprint",
    description: "Match 30 words with their meanings in 3 minutes",
    timeLeft: "4h 23m",
    reward: 100,
    progress: 18,
    total: 30,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-custom mb-2">Game Center</h1>
        <p className="text-medium-custom text-lg">Learn English through fun and interactive games</p>
      </div>

      {/* Daily Challenge */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center">
                <Zap className="text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Daily Challenge</CardTitle>
                <p className="text-sm text-medium-custom">Time left: {dailyChallenge.timeLeft}</p>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-white">
              +{dailyChallenge.reward} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">{dailyChallenge.title}</h3>
          <p className="text-medium-custom text-sm mb-4">{dailyChallenge.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Progress: {dailyChallenge.progress}/{dailyChallenge.total}</span>
            <span className="text-sm text-medium-custom">
              {Math.round((dailyChallenge.progress / dailyChallenge.total) * 100)}% Complete
            </span>
          </div>
          <Progress value={(dailyChallenge.progress / dailyChallenge.total) * 100} className="mb-4" />
          
          <Button className="bg-accent-custom hover:bg-yellow-600">
            <Play className="w-4 h-4 mr-2" />
            Continue Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Featured Games */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-custom mb-6">Featured Games</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.filter(game => game.featured).map((game) => (
            <Card 
              key={game.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary-custom/20"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 ${game.color} rounded-xl flex items-center justify-center`}>
                    <game.icon className="text-white text-xl" />
                  </div>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <CardTitle className="text-lg">{game.title}</CardTitle>
                <p className="text-medium-custom text-sm">{game.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="outline"
                    className={
                      game.difficulty === 'Beginner' ? 'text-green-600 border-green-600' :
                      game.difficulty === 'Intermediate' ? 'text-blue-600 border-blue-600' :
                      'text-purple-600 border-purple-600'
                    }
                  >
                    {game.difficulty}
                  </Badge>
                  <span className="text-sm text-medium-custom">{game.players}</span>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-medium-custom" />
                    <span className="text-sm text-medium-custom">{game.duration}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent-custom" />
                    <span className="text-sm text-medium-custom">+{game.xp} XP</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Games Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-custom mb-6">All Games</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center`}>
                    <game.icon className="text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {game.category}
                  </Badge>
                </div>
                <CardTitle className="text-base">{game.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-medium-custom">{game.difficulty}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-medium-custom">{game.duration}m</span>
                    <span className="text-accent-custom">+{game.xp} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-accent-custom" />
              <span>Weekly Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div 
                  key={player.rank}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    player.isCurrentUser ? 'bg-primary-custom/10 border border-primary-custom/20' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.rank === 1 ? 'bg-yellow-500 text-white' :
                    player.rank === 2 ? 'bg-gray-400 text-white' :
                    player.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {player.rank}
                  </div>
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="flex-1">
                    <div className={`font-medium ${player.isCurrentUser ? 'text-primary-custom' : 'text-dark-custom'}`}>
                      {player.name}
                    </div>
                    <div className="text-sm text-medium-custom">{player.score.toLocaleString()} points</div>
                  </div>
                  {player.isCurrentUser && (
                    <Badge variant="outline" className="text-primary-custom border-primary-custom">
                      You
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="text-purple-500" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-dark-custom">{achievement.name}</h4>
                      <p className="text-sm text-medium-custom mb-2">{achievement.description}</p>
                      
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-medium-custom">
                          {achievement.progress}/{achievement.total}
                        </span>
                        <span className="text-xs text-medium-custom">
                          {Math.round((achievement.progress / achievement.total) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.total) * 100} 
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
