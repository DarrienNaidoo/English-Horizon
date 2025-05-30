import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Trophy, Zap, Brain, Globe, CheckCircle, XCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function InteractiveGames() {
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const { data: puzzles, isLoading: puzzlesLoading } = useQuery({
    queryKey: ["/api/games/word-puzzles"],
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["/api/games/cultural-quiz"],
  });

  const startGame = (game) => {
    setActiveGame(game);
    setGameState({});
    setScore(0);
    setCurrentQuestion(0);
    setUserAnswers({});
    
    if (game.timeLimit) {
      setTimeRemaining(game.timeLimit);
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const endGame = () => {
    setActiveGame(null);
    setTimeRemaining(0);
  };

  const handleWordMatch = (word, match) => {
    const newAnswers = { ...userAnswers };
    newAnswers[word] = match;
    setUserAnswers(newAnswers);
    
    // Check if match is correct
    const correctPair = activeGame.pairs.find(p => p.word === word);
    if (correctPair && correctPair.match === match) {
      setScore(prev => prev + 10);
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    const newAnswers = { ...userAnswers };
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
    
    const question = activeGame.questions[questionIndex];
    if (question.correct === answerIndex) {
      setScore(prev => prev + 20);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < activeGame.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const WordMatchGame = ({ game }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            {game.title}
          </span>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{score} points</Badge>
            {timeRemaining > 0 && (
              <Badge variant="secondary">
                <Timer className="w-4 h-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-3">Words</h4>
            <div className="space-y-2">
              {game.pairs.map((pair, idx) => (
                <Button
                  key={idx}
                  variant={userAnswers[pair.word] ? "secondary" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleWordMatch(pair.word, pair.match)}
                >
                  {pair.word}
                  {userAnswers[pair.word] && (
                    <span className="ml-auto">
                      {userAnswers[pair.word] === pair.match ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Matches</h4>
            <div className="space-y-2">
              {game.pairs.map((pair, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className="w-full justify-start border-dashed border"
                  onClick={() => {
                    const selectedWord = Object.keys(userAnswers).find(word => 
                      userAnswers[word] === pair.match
                    );
                    if (selectedWord) {
                      handleWordMatch(selectedWord, pair.match);
                    }
                  }}
                >
                  {pair.match}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CulturalQuizGame = ({ game }) => {
    const currentQ = game.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / game.questions.length) * 100;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {game.title}
            </span>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{score} points</Badge>
              <Badge variant="secondary">
                {currentQuestion + 1} / {game.questions.length}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            <Progress value={progress} className="w-full mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant={userAnswers[currentQuestion] === idx ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleQuizAnswer(currentQuestion, idx)}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </Button>
              ))}
            </div>
          </div>

          {userAnswers[currentQuestion] !== undefined && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                userAnswers[currentQuestion] === currentQ.correct 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {userAnswers[currentQuestion] === currentQ.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {userAnswers[currentQuestion] === currentQ.correct ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm">{currentQ.explanation}</p>
              </div>

              <Button onClick={nextQuestion} className="w-full">
                {currentQuestion < game.questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (puzzlesLoading || quizzesLoading) {
    return <div className="flex justify-center p-8">Loading games...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Interactive Language Games
        </h1>
        <p className="text-muted-foreground">
          Challenge yourself with word puzzles, cultural quizzes, and brain teasers
        </p>
      </div>

      {activeGame ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={endGame}>
              ← Back to Games
            </Button>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Score: {score}</span>
            </div>
          </div>

          {activeGame.type === "word_match" && <WordMatchGame game={activeGame} />}
          {activeGame.type === "quiz" && <CulturalQuizGame game={activeGame} />}
        </div>
      ) : (
        <Tabs defaultValue="puzzles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="puzzles">Word Puzzles</TabsTrigger>
            <TabsTrigger value="quizzes">Cultural Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="puzzles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {puzzles?.puzzles?.map((puzzle) => (
                <Card key={puzzle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      {puzzle.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{puzzle.difficulty}</Badge>
                      {puzzle.timeLimit && (
                        <Badge variant="secondary">
                          <Timer className="w-4 h-4 mr-1" />
                          {formatTime(puzzle.timeLimit)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {puzzle.type === "crossword" && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Solve the crossword using the given clues
                        </p>
                        <div className="text-xs">
                          {puzzle.clues.length} clues • Mixed difficulty
                        </div>
                      </div>
                    )}
                    {puzzle.type === "word_match" && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Match words with their synonyms
                        </p>
                        <div className="text-xs">
                          {puzzle.pairs.length} word pairs
                        </div>
                      </div>
                    )}
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => startGame(puzzle)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Start Game
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes?.quizzes?.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Test your knowledge of global cultures and traditions
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span>{quiz.questions.length} questions</span>
                        <span>•</span>
                        <span>20 points each</span>
                      </div>
                      
                      {quiz.culturalTips && (
                        <div className="bg-muted p-3 rounded text-xs">
                          <strong>Cultural Tips:</strong>
                          <ul className="mt-1 space-y-1">
                            {quiz.culturalTips.map((tip, idx) => (
                              <li key={idx}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => startGame({ ...quiz, type: "quiz" })}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}