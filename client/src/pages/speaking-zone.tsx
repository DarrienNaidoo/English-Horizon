import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Award,
  TrendingUp,
  Target,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@shared/schema";

// Mock user ID
const CURRENT_USER_ID = 1;

interface PronunciationExercise {
  id: number;
  word: string;
  phonetic: string;
  audioUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  translation: string;
}

interface DebateTopic {
  id: number;
  title: string;
  description: string;
  level: string;
  timeLimit: number;
  sampleQuestions: string[];
}

const PRONUNCIATION_EXERCISES: PronunciationExercise[] = [
  {
    id: 1,
    word: "pronunciation",
    phonetic: "/prəˌnʌnsiˈeɪʃən/",
    difficulty: "hard",
    translation: "发音"
  },
  {
    id: 2,
    word: "schedule",
    phonetic: "/ˈʃedʒuːl/",
    difficulty: "medium",
    translation: "时间表"
  },
  {
    id: 3,
    word: "though",
    phonetic: "/ðoʊ/",
    difficulty: "medium",
    translation: "虽然"
  }
];

const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 1,
    title: "Traditional vs Modern Education",
    description: "Discuss the benefits and drawbacks of traditional Chinese education versus modern teaching methods.",
    level: "intermediate",
    timeLimit: 300,
    sampleQuestions: [
      "Which education system better prepares students for the future?",
      "How important is memorization in learning?",
      "Should technology replace traditional textbooks?"
    ]
  },
  {
    id: 2,
    title: "Cultural Exchange Benefits",
    description: "Explore how cultural exchange programs help Chinese students develop global perspectives.",
    level: "advanced",
    timeLimit: 600,
    sampleQuestions: [
      "How does studying abroad change a student's perspective?",
      "What cultural barriers do Chinese students face internationally?",
      "How can we preserve Chinese culture while embracing global ideas?"
    ]
  }
];

export default function SpeakingZone() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<PronunciationExercise | null>(null);
  const [selectedDebate, setSelectedDebate] = useState<DebateTopic | null>(null);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { data: speakingLessons = [] } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons", { category: "speaking" }],
  });

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
        // Here you would send the audio to pronunciation analysis API
        analyzePronunciation(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzePronunciation = async (audioBlob: Blob) => {
    // Mock pronunciation analysis - in real app would use speech recognition API
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100
      setPronunciationScore(mockScore);
    }, 2000);
  };

  const playExampleAudio = (word: string) => {
    // Mock audio playback - in real app would play actual pronunciation
    console.log(`Playing pronunciation for: ${word}`);
    
    // Use Web Speech API for text-to-speech as fallback
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🗣️ Speaking Zone</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Improve your English pronunciation and speaking confidence with AI feedback and interactive exercises
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Speaking Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">87%</div>
              <p className="text-sm text-muted-foreground">Avg. Pronunciation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">156</div>
              <p className="text-sm text-muted-foreground">Words Practiced</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">12</div>
              <p className="text-sm text-muted-foreground">Debate Sessions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">Level 5</div>
              <p className="text-sm text-muted-foreground">Speaking Level</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pronunciation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pronunciation">Pronunciation Practice</TabsTrigger>
            <TabsTrigger value="debates">AI Debates</TabsTrigger>
            <TabsTrigger value="presentations">Presentations</TabsTrigger>
          </TabsList>

          <TabsContent value="pronunciation" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Exercise Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Pronunciation Exercises</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {PRONUNCIATION_EXERCISES.map((exercise) => (
                    <div 
                      key={exercise.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        selectedExercise?.id === exercise.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{exercise.word}</h3>
                        <Badge className={cn(
                          exercise.difficulty === "easy" ? "bg-green-100 text-green-700" :
                          exercise.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{exercise.phonetic}</p>
                      <p className="text-sm text-muted-foreground">中文: {exercise.translation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Practice Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Practice Session</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedExercise ? (
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-muted/50 rounded-lg">
                        <h2 className="text-3xl font-bold mb-2">{selectedExercise.word}</h2>
                        <p className="text-lg text-muted-foreground mb-1">{selectedExercise.phonetic}</p>
                        <p className="text-sm text-muted-foreground">中文: {selectedExercise.translation}</p>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => playExampleAudio(selectedExercise.word)}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Listen
                        </Button>
                        
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={cn(
                            isRecording 
                              ? "bg-destructive hover:bg-destructive/90" 
                              : "bg-secondary hover:bg-secondary/90"
                          )}
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
                      </div>

                      {pronunciationScore !== null && (
                        <div className="text-center p-6 bg-secondary/5 rounded-lg border border-secondary/20">
                          <h3 className="text-lg font-semibold mb-2">Pronunciation Score</h3>
                          <div className="text-4xl font-bold text-secondary mb-2">{pronunciationScore}%</div>
                          <Progress value={pronunciationScore} className="mb-4" />
                          <div className="text-sm text-muted-foreground">
                            {pronunciationScore >= 90 ? "Excellent pronunciation!" :
                             pronunciationScore >= 80 ? "Good job! Keep practicing." :
                             pronunciationScore >= 70 ? "Not bad, try again for better results." :
                             "Keep practicing, you'll improve!"}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Mic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select an Exercise</h3>
                      <p className="text-muted-foreground">
                        Choose a pronunciation exercise from the list to get started.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="debates" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Debate Topics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Debate Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {DEBATE_TOPICS.map((topic) => (
                      <div 
                        key={topic.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          selectedDebate?.id === topic.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedDebate(topic)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{topic.title}</h3>
                          <Badge className="level-intermediate">{topic.level}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Target className="h-3 w-3 mr-1" />
                          {topic.timeLimit / 60} min session
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Debate Session */}
              <Card>
                <CardHeader>
                  <CardTitle>Debate Session</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDebate ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-muted/50 rounded-lg">
                        <h2 className="text-xl font-bold mb-3">{selectedDebate.title}</h2>
                        <p className="text-muted-foreground mb-4">{selectedDebate.description}</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Discussion Questions:</h4>
                          <ul className="space-y-1">
                            {selectedDebate.sampleQuestions.map((question, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                          <Users className="h-4 w-4 mr-2" />
                          Start AI Debate Session
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Practice with our AI debate partner
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Choose a Debate Topic</h3>
                      <p className="text-muted-foreground">
                        Select a topic to start practicing your debate skills with AI.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presentations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Presentation Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Practice presentations and speeches with AI feedback on delivery, pace, and content structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
