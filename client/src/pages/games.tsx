import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gamepad2, 
  Target, 
  Zap, 
  Trophy, 
  Clock,
  Star,
  Play,
  RotateCcw,
  CheckCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameStats {
  gamesPlayed: number;
  averageScore: number;
  bestStreak: number;
  totalXP: number;
}

interface WordPair {
  word: string;
  definition: string;
  id: string;
}

interface SpellingWord {
  word: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

const GAME_STATS: GameStats = {
  gamesPlayed: 47,
  averageScore: 82,
  bestStreak: 15,
  totalXP: 1240
};

const WORD_PAIRS: WordPair[] = [
  { id: "1", word: "Adventure", definition: "An exciting or unusual experience" },
  { id: "2", word: "Delicious", definition: "Having a very pleasant taste" },
  { id: "3", word: "Traditional", definition: "Following long-established customs" },
  { id: "4", word: "Journey", definition: "An act of traveling from one place to another" },
  { id: "5", word: "Festival", definition: "A special celebration or event" },
  { id: "6", word: "Culture", definition: "The arts, customs, and habits of a society" },
];

const SPELLING_WORDS: SpellingWord[] = [
  { word: "restaurant", hint: "A place where you eat meals", difficulty: "medium" },
  { word: "beautiful", hint: "Very attractive or pleasing", difficulty: "easy" },
  { word: "technology", hint: "Scientific knowledge applied to practical purposes", difficulty: "hard" },
  { word: "education", hint: "The process of learning and teaching", difficulty: "medium" },
  { word: "celebration", hint: "A special event to mark an occasion", difficulty: "hard" },
];

export default function Games() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [wordMatchPairs, setWordMatchPairs] = useState<WordPair[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [currentSpellingWord, setCurrentSpellingWord] = useState<SpellingWord | null>(null);
  const [spellingInput, setSpellingInput] = useState("");
  const [spellingResult, setSpellingResult] = useState<"correct" | "incorrect" | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameTimer, setGameTimer] = useState(0);

  const startWordMatch = () => {
    const shuffledPairs = [...WORD_PAIRS].sort(() => Math.random() - 0.5).slice(0, 4);
    setWordMatchPairs(shuffledPairs);
    setSelectedWords([]);
    setMatchedPairs([]);
    setGameScore(0);
    setCurrentGame("word-match");
  };

  const startSpellingBee = () => {
    const randomWord = SPELLING_WORDS[Math.floor(Math.random() * SPELLING_WORDS.length)];
    setCurrentSpellingWord(randomWord);
    setSpellingInput("");
    setSpellingResult(null);
    setGameScore(0);
    setCurrentGame("spelling-bee");
  };

  const handleWordClick = (type: "word" | "definition", id: string, text: string) => {
    const identifier = `${type}-${id}`;
    
    if (matchedPairs.includes(id) || selectedWords.includes(identifier)) return;

    const newSelected = [...selectedWords, identifier];
    setSelectedWords(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const [firstType, firstId] = first.split("-");
      const [secondType, secondId] = second.split("-");

      if (firstType !== secondType && firstId === secondId) {
        // Correct match
        setMatchedPairs([...matchedPairs, firstId]);
        setSelectedWords([]);
        setGameScore(gameScore + 10);
      } else {
        // Incorrect match
        setTimeout(() => {
          setSelectedWords([]);
        }, 1000);
      }
    }
  };

  const checkSpelling = () => {
    if (!currentSpellingWord) return;
    
    const isCorrect = spellingInput.toLowerCase().trim() === currentSpellingWord.word.toLowerCase();
    setSpellingResult(isCorrect ? "correct" : "incorrect");
    
    if (isCorrect) {
      setGameScore(gameScore + (currentSpellingWord.difficulty === "hard" ? 15 : currentSpellingWord.difficulty === "medium" ? 10 : 5));
    }
  };

  const nextSpellingWord = () => {
    const randomWord = SPELLING_WORDS[Math.floor(Math.random() * SPELLING_WORDS.length)];
    setCurrentSpellingWord(randomWord);
    setSpellingInput("");
    setSpellingResult(null);
  };

  const resetGame = () => {
    setCurrentGame(null);
    setGameScore(0);
    setGameTimer(0);
  };

  const gameItems = [
    {
      id: "word-match",
      title: "Word Matching",
      description: "Match English words with their definitions",
      icon: "🎯",
      difficulty: "Medium",
      xpReward: 15,
      gradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-100",
      action: startWordMatch
    },
    {
      id: "spelling-bee",
      title: "Spelling Challenge",
      description: "Test your spelling skills with audio hints",
      icon: "🐝",
      difficulty: "Hard",
      xpReward: 20,
      gradient: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-100",
      action: startSpellingBee
    },
    {
      id: "sentence-builder",
      title: "Sentence Builder",
      description: "Arrange words to form correct sentences",
      icon: "🏗️",
      difficulty: "Easy",
      xpReward: 10,
      gradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-100",
      action: () => setCurrentGame("sentence-builder")
    },
    {
      id: "vocab-quest",
      title: "Vocabulary Quest",
      description: "Adventure through Chinese culture while learning words",
      icon: "🗡️",
      difficulty: "Medium",
      xpReward: 25,
      gradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-100",
      action: () => setCurrentGame("vocab-quest")
    }
  ];

  if (currentGame) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={resetGame}>
                <X className="h-4 w-4 mr-2" />
                Exit Game
              </Button>
              <div className="text-lg font-semibold">
                Score: <span className="text-primary">{gameScore}</span>
              </div>
            </div>
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Word Matching Game */}
          {currentGame === "word-match" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Word Matching Game</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Words Column */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-center mb-4">Words</h3>
                    {wordMatchPairs.map((pair) => (
                      <Button
                        key={`word-${pair.id}`}
                        variant="outline"
                        className={cn(
                          "w-full h-auto p-4 text-left justify-start",
                          selectedWords.includes(`word-${pair.id}`) && "ring-2 ring-primary",
                          matchedPairs.includes(pair.id) && "bg-secondary/20 border-secondary text-secondary-foreground"
                        )}
                        onClick={() => handleWordClick("word", pair.id, pair.word)}
                        disabled={matchedPairs.includes(pair.id)}
                      >
                        {matchedPairs.includes(pair.id) && <CheckCircle className="h-4 w-4 mr-2" />}
                        {pair.word}
                      </Button>
                    ))}
                  </div>

                  {/* Definitions Column */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-center mb-4">Definitions</h3>
                    {wordMatchPairs.sort(() => Math.random() - 0.5).map((pair) => (
                      <Button
                        key={`definition-${pair.id}`}
                        variant="outline"
                        className={cn(
                          "w-full h-auto p-4 text-left justify-start",
                          selectedWords.includes(`definition-${pair.id}`) && "ring-2 ring-primary",
                          matchedPairs.includes(pair.id) && "bg-secondary/20 border-secondary text-secondary-foreground"
                        )}
                        onClick={() => handleWordClick("definition", pair.id, pair.definition)}
                        disabled={matchedPairs.includes(pair.id)}
                      >
                        {matchedPairs.includes(pair.id) && <CheckCircle className="h-4 w-4 mr-2" />}
                        {pair.definition}
                      </Button>
                    ))}
                  </div>
                </div>

                {matchedPairs.length === wordMatchPairs.length && wordMatchPairs.length > 0 && (
                  <div className="text-center mt-8 p-6 bg-secondary/10 rounded-lg">
                    <Trophy className="h-12 w-12 mx-auto text-secondary mb-4" />
                    <h3 className="text-xl font-bold text-secondary mb-2">Congratulations!</h3>
                    <p className="text-muted-foreground mb-4">You matched all words correctly!</p>
                    <Badge className="xp-badge text-lg px-4 py-2">+{gameScore} XP</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Spelling Bee Game */}
          {currentGame === "spelling-bee" && currentSpellingWord && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Spelling Challenge</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="p-8 bg-muted/50 rounded-lg">
                    <Badge className={cn(
                      "mb-4",
                      currentSpellingWord.difficulty === "easy" ? "bg-green-100 text-green-700" :
                      currentSpellingWord.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {currentSpellingWord.difficulty}
                    </Badge>
                    <h3 className="text-lg font-semibold mb-4">Spell the word for:</h3>
                    <p className="text-xl text-muted-foreground mb-6">"{currentSpellingWord.hint}"</p>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <input
                        type="text"
                        value={spellingInput}
                        onChange={(e) => setSpellingInput(e.target.value)}
                        className="w-full p-3 text-center text-xl border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Type your answer..."
                        onKeyPress={(e) => e.key === "Enter" && checkSpelling()}
                      />
                      
                      {spellingResult === null && (
                        <Button onClick={checkSpelling} className="w-full" disabled={!spellingInput.trim()}>
                          Check Spelling
                        </Button>
                      )}
                      
                      {spellingResult === "correct" && (
                        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                          <CheckCircle className="h-8 w-8 mx-auto text-secondary mb-2" />
                          <p className="text-secondary font-semibold">Correct!</p>
                          <p className="text-sm text-muted-foreground mb-3">The word is: {currentSpellingWord.word}</p>
                          <Button onClick={nextSpellingWord} className="w-full">
                            Next Word
                          </Button>
                        </div>
                      )}
                      
                      {spellingResult === "incorrect" && (
                        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                          <X className="h-8 w-8 mx-auto text-destructive mb-2" />
                          <p className="text-destructive font-semibold">Try Again!</p>
                          <p className="text-sm text-muted-foreground mb-3">The correct spelling is: {currentSpellingWord.word}</p>
                          <Button onClick={nextSpellingWord} className="w-full">
                            Next Word
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coming Soon Games */}
          {(currentGame === "sentence-builder" || currentGame === "vocab-quest") && (
            <Card>
              <CardContent className="text-center py-12">
                <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This game is under development. Check back soon for more exciting language learning adventures!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🎮 Gamified Learning</h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              Learn English through fun, interactive games and challenges designed for Chinese students
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{GAME_STATS.gamesPlayed}</div>
              <p className="text-sm text-muted-foreground">Games Played</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">{GAME_STATS.averageScore}%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">{GAME_STATS.bestStreak}</div>
              <p className="text-sm text-muted-foreground">Best Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{GAME_STATS.totalXP}</div>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Choose Your Game</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {gameItems.map((game) => (
              <Card key={game.id} className={cn("learning-card", game.gradient, game.borderColor)}>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{game.title}</h3>
                  <p className="text-muted-foreground mb-6">{game.description}</p>
                  
                  <div className="flex justify-center space-x-2 mb-6">
                    <Badge className={cn(
                      game.difficulty === "Easy" ? "level-beginner" :
                      game.difficulty === "Medium" ? "level-intermediate" :
                      "level-advanced"
                    )}>
                      {game.difficulty}
                    </Badge>
                    <Badge className="xp-badge">+{game.xpReward} XP</Badge>
                  </div>
                  
                  <Button onClick={game.action} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Game Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <p className="font-medium">Word Matching</p>
                    <p className="text-sm text-muted-foreground">Score: 95% • 2 hours ago</p>
                  </div>
                </div>
                <Badge className="xp-badge">+15 XP</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🐝</span>
                  </div>
                  <div>
                    <p className="font-medium">Spelling Challenge</p>
                    <p className="text-sm text-muted-foreground">Score: 87% • Yesterday</p>
                  </div>
                </div>
                <Badge className="xp-badge">+20 XP</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
