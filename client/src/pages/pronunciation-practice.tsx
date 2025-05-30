import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Play, Volume2, TrendingUp, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PronunciationExercise {
  id: string;
  word: string;
  phonetic: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  commonMistakes: string[];
  tips: string[];
}

interface PronunciationAnalysis {
  word: string;
  userPronunciation: string;
  targetPronunciation: string;
  accuracy: number;
  phonemeAccuracy: any[];
  overallScore: number;
  feedback: string[];
  improvementTips: string[];
}

interface PronunciationProgress {
  userId: number;
  phoneme: string;
  accuracy: number;
  attempts: number;
  lastPracticed: Date;
  improvement: number;
}

export default function PronunciationPracticePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<PronunciationExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PronunciationAnalysis | null>(null);
  const [currentMode, setCurrentMode] = useState<'word' | 'sentence' | 'conversation'>('word');
  const [practiceSession, setPracticeSession] = useState({
    correctCount: 0,
    totalAttempts: 0,
    sessionScore: 0
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const queryClient = useQueryClient();

  // Fetch exercises
  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['pronunciation-exercises', selectedDifficulty, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/pronunciation/exercises?${params}`);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return response.json();
    }
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery({
    queryKey: ['pronunciation-progress', 1], // Using user ID 1
    queryFn: async () => {
      const response = await fetch('/api/pronunciation/progress/1');
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    }
  });

  // Analyze pronunciation mutation
  const analyzePronunciation = useMutation({
    mutationFn: async ({ audioData, targetWord }: { audioData: string; targetWord: string }) => {
      const response = await fetch('/api/pronunciation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData,
          targetWord,
          userId: 1
        })
      });
      if (!response.ok) throw new Error('Failed to analyze pronunciation');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      queryClient.invalidateQueries({ queryKey: ['pronunciation-progress'] });
      toast({
        title: "Analysis Complete",
        description: `Overall score: ${data.overallScore.toFixed(1)}%`
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Please try recording again",
        variant: "destructive"
      });
    }
  });

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Convert to base64 for analysis
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          
          if (selectedExercise) {
            analyzePronunciation.mutate({
              audioData: base64Data,
              targetWord: selectedExercise.word
            });
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Please allow microphone access",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Play target pronunciation (simulated)
  const playTargetPronunciation = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pronunciation Practice</h1>
        <p className="text-muted-foreground">
          Improve your English pronunciation with AI-powered feedback
        </p>
      </div>

      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="exercises">All Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="consonants">Consonants</SelectItem>
                <SelectItem value="vowels">Vowels</SelectItem>
                <SelectItem value="stress">Word Stress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Selection */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise: PronunciationExercise) => (
              <Card 
                key={exercise.id}
                className={`cursor-pointer transition-colors ${
                  selectedExercise?.id === exercise.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedExercise(exercise)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exercise.word}</CardTitle>
                    <Badge className={difficultyColors[exercise.difficulty]}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{exercise.phonetic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {exercise.category}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTargetPronunciation(exercise.word);
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Practice Session */}
          {selectedExercise && (
            <Card>
              <CardHeader>
                <CardTitle>Practice: {selectedExercise.word}</CardTitle>
                <CardDescription>
                  Target pronunciation: {selectedExercise.phonetic}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tips */}
                <div>
                  <h4 className="font-medium mb-2">Pronunciation Tips:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recording Controls */}
                <div className="flex items-center gap-4">
                  <Button
                    onClick={playTargetPronunciation.bind(null, selectedExercise.word)}
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Listen
                  </Button>

                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    disabled={analyzePronunciation.isPending}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  {analyzePronunciation.isPending && (
                    <span className="text-sm text-muted-foreground">
                      Analyzing...
                    </span>
                  )}
                </div>

                {/* Analysis Results */}
                {analysisResult && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Analysis Results</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                        {analysisResult.overallScore.toFixed(1)}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Accuracy</span>
                        <span>{analysisResult.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={analysisResult.accuracy} className="h-2" />
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Feedback:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.feedback.map((feedback, index) => (
                          <li key={index} className="text-sm">
                            {feedback}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Improvement Tips:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.improvementTips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Progress
              </CardTitle>
              <CardDescription>
                Track your pronunciation improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.map((progress: PronunciationProgress, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">/{progress.phoneme}/</div>
                      <div className="text-sm text-muted-foreground">
                        {progress.attempts} attempts
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(progress.accuracy)}`}>
                        {progress.accuracy.toFixed(1)}%
                      </div>
                      {progress.improvement > 0 && (
                        <div className="text-sm text-green-600">
                          +{progress.improvement.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise: PronunciationExercise) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exercise.word}</CardTitle>
                    <Badge className={difficultyColors[exercise.difficulty]}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{exercise.phonetic}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Category:</span> {exercise.category}
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-1">Common Mistakes:</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.commonMistakes.join(', ')}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedExercise(exercise);
                        // Switch to practice tab
                        const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                        practiceTab?.click();
                      }}
                    >
                      Practice This Word
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}