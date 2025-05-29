import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Gamepad2, 
  Star, 
  Trophy, 
  Timer, 
  Target,
  Zap,
  CheckCircle,
  XCircle,
  RotateCcw,
  Play,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  exampleSentence: string;
  translation?: string;
}

interface GameQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'match-definition';
  word: VocabularyWord;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

interface GameSession {
  id: string;
  userId: number;
  gameType: string;
  wordsStudied: string[];
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  xpEarned: number;
  startedAt: Date;
}

interface GameStats {
  totalWordsStudied: number;
  averageMastery: number;
  totalXPEarned: number;
  gamesPlayed: number;
  currentStreak: number;
}

const GAME_TYPES = [
  { id: 'multiple-choice', name: 'Multiple Choice', description: 'Choose the correct definition' },
  { id: 'fill-blank', name: 'Fill in the Blank', description: 'Complete the sentence' },
  { id: 'match-definition', name: 'Match Definition', description: 'Match words with meanings' }
];

const CURRENT_USER_ID = 1;

export default function VocabularyGames() {
  const [selectedGameType, setSelectedGameType] = useState('multiple-choice');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const queryClient = useQueryClient();

  const { data: vocabularyStats } = useQuery<{progress: any[], stats: GameStats}>({
    queryKey: [`/api/vocabulary/progress/${CURRENT_USER_ID}`],
  });

  const startGameMutation = useMutation({
    mutationFn: async ({ gameType, difficulty }: { gameType: string; difficulty: string }) => {
      const response = await fetch('/api/vocabulary/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: CURRENT_USER_ID, 
          gameType, 
          difficulty 
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.session);
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setScore({ correct: 0, incorrect: 0 });
      setGameStartTime(Date.now());
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ sessionId, questionId, answer }: { 
      sessionId: string; 
      questionId: string; 
      answer: string; 
    }) => {
      const timeSpent = Date.now() - gameStartTime;
      const response = await fetch(`/api/vocabulary/game/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer, timeSpent }),
      });
      return response.json();
    },
    onSuccess: (result) => {
      setLastResult(result);
      setShowResult(true);
      setScore(prev => ({
        correct: prev.correct + (result.correct ? 1 : 0),
        incorrect: prev.incorrect + (result.correct ? 0 : 1)
      }));
      
      queryClient.invalidateQueries({ 
        queryKey: [`/api/vocabulary/progress/${CURRENT_USER_ID}`] 
      });
    },
  });

  const startGame = () => {
    startGameMutation.mutate({
      gameType: selectedGameType,
      difficulty: selectedDifficulty
    });
  };

  const submitAnswer = () => {
    if (!currentSession || !questions[currentQuestionIndex] || !userAnswer.trim()) return;
    
    submitAnswerMutation.mutate({
      sessionId: currentSession.id,
      questionId: questions[currentQuestionIndex].id,
      answer: userAnswer.trim()
    });
  };

  const nextQuestion = () => {
    setShowResult(false);
    setUserAnswer('');
    setGameStartTime(Date.now());
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Game completed
      setCurrentSession(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
    }
  };

  const resetGame = () => {
    setCurrentSession(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setUserAnswer('');
    setScore({ correct: 0, incorrect: 0 });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentSession ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Vocabulary Games</h1>
          <p className="text-white/80">
            Build your vocabulary through engaging games and challenges
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Your Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vocabularyStats?.stats && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Words Studied</span>
                      <Badge variant="secondary">{vocabularyStats.stats.totalWordsStudied}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Mastery</span>
                      <Badge variant="outline">{vocabularyStats.stats.averageMastery}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total XP</span>
                      <Badge className="bg-yellow-500">{vocabularyStats.stats.totalXPEarned}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <Badge variant="destructive">{vocabularyStats.stats.currentStreak}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Types */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Game Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {GAME_TYPES.map((gameType) => (
                  <Button
                    key={gameType.id}
                    variant={selectedGameType === gameType.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedGameType(gameType.id)}
                    disabled={!!currentSession}
                  >
                    <div className="text-left">
                      <div className="font-medium">{gameType.name}</div>
                      <div className="text-xs opacity-70">{gameType.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {!currentSession ? (
              /* Game Setup */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gamepad2 className="h-6 w-6" />
                    <span>Start New Game</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Game Type</label>
                      <Select value={selectedGameType} onValueChange={setSelectedGameType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GAME_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      size="lg" 
                      onClick={startGame}
                      disabled={startGameMutation.isPending}
                      className="px-8"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {startGameMutation.isPending ? 'Starting...' : 'Start Game'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Active Game */
              <div className="space-y-6">
                {/* Game Progress */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
                        <Badge className="bg-green-500">Correct: {score.correct}</Badge>
                        <Badge variant="destructive">Incorrect: {score.incorrect}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={resetGame}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </CardContent>
                </Card>

                {/* Question Card */}
                {currentQuestion && !showResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>{currentQuestion.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-lg font-medium">
                        {currentQuestion.question}
                      </div>

                      {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                        <div className="grid gap-3">
                          {currentQuestion.options.map((option, index) => (
                            <Button
                              key={index}
                              variant={userAnswer === option ? "default" : "outline"}
                              className="justify-start text-left p-4 h-auto"
                              onClick={() => setUserAnswer(option)}
                            >
                              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'fill-blank' && (
                        <div>
                          <Input
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer..."
                            className="text-lg"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                submitAnswer();
                              }
                            }}
                          />
                        </div>
                      )}

                      {currentQuestion.hint && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                          <p className="text-sm"><strong>Hint:</strong> {currentQuestion.hint}</p>
                        </div>
                      )}

                      <Button 
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim() || submitAnswerMutation.isPending}
                        className="w-full"
                        size="lg"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit Answer
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Result Card */}
                {showResult && lastResult && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                        lastResult.correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {lastResult.correct ? (
                          <CheckCircle className="h-8 w-8" />
                        ) : (
                          <XCircle className="h-8 w-8" />
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-2">
                        {lastResult.correct ? "Correct!" : "Incorrect"}
                      </h3>

                      <p className="text-muted-foreground mb-4">
                        {lastResult.explanation}
                      </p>

                      {lastResult.xpEarned > 0 && (
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">+{lastResult.xpEarned} XP</span>
                        </div>
                      )}

                      <Button onClick={nextQuestion} size="lg">
                        {currentQuestionIndex < questions.length - 1 ? (
                          <>Next Question</>
                        ) : (
                          <>
                            <Award className="h-5 w-5 mr-2" />
                            Complete Game
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}