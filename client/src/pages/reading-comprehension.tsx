import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clock, Target, Highlighter, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  wordCount: number;
  estimatedReadingTime: number;
  vocabulary: VocabularyItem[];
  comprehensionQuestions: ComprehensionQuestion[];
  keyPhrases: string[];
  culturalNotes?: string[];
}

interface VocabularyItem {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleSentence: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ComprehensionQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

interface UserNote {
  id: string;
  text: string;
  position: number;
  timestamp: Date;
}

interface ReadingSession {
  id: string;
  userId: number;
  passageId: string;
  startTime: Date;
  endTime?: Date;
  readingSpeed: number;
  comprehensionScore: number;
  questionsAnswered: AnsweredQuestion[];
  highlights: TextHighlight[];
  notes: UserNote[];
}

interface AnsweredQuestion {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
}

interface TextHighlight {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  color: string;
  note?: string;
  timestamp: Date;
}

export default function ReadingComprehensionPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedText, setSelectedText] = useState<string>('');
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  // Fetch reading passages
  const { data: passages = [], isLoading } = useQuery({
    queryKey: ['reading-passages', selectedLevel, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLevel) params.append('level', selectedLevel);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/reading/passages?${params}`);
      if (!response.ok) throw new Error('Failed to fetch passages');
      return response.json();
    }
  });

  // Start reading session mutation
  const startSession = useMutation({
    mutationFn: async ({ passageId }: { passageId: string }) => {
      const response = await fetch('/api/reading/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          passageId
        })
      });
      if (!response.ok) throw new Error('Failed to start session');
      return response.json();
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      setStartTime(new Date());
      toast({
        title: "Reading Session Started",
        description: "Begin reading and track your comprehension"
      });
    }
  });

  // Submit answer mutation
  const submitAnswer = useMutation({
    mutationFn: async ({ questionId, answer, timeSpent }: { questionId: string; answer: string; timeSpent: number }) => {
      if (!currentSession) throw new Error('No active session');
      
      const response = await fetch(`/api/reading/sessions/${currentSession.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          answer,
          timeSpent
        })
      });
      if (!response.ok) throw new Error('Failed to submit answer');
      return response.json();
    },
    onSuccess: (result) => {
      if (currentSession) {
        const updatedSession = { ...currentSession };
        updatedSession.questionsAnswered.push(result);
        setCurrentSession(updatedSession);
      }
      
      toast({
        title: result.isCorrect ? "Correct!" : "Incorrect",
        description: result.isCorrect 
          ? `You earned ${result.pointsEarned} points` 
          : "Review the explanation and try again",
        variant: result.isCorrect ? "default" : "destructive"
      });
    }
  });

  // Add highlight mutation
  const addHighlight = useMutation({
    mutationFn: async ({ text, startIndex, endIndex, color }: { text: string; startIndex: number; endIndex: number; color: string }) => {
      if (!currentSession) throw new Error('No active session');
      
      const response = await fetch(`/api/reading/sessions/${currentSession.id}/highlights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          startIndex,
          endIndex,
          color
        })
      });
      if (!response.ok) throw new Error('Failed to add highlight');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Text Highlighted",
        description: "Your highlight has been saved"
      });
    }
  });

  // Handle passage selection
  const handleSelectPassage = (passage: ReadingPassage) => {
    setCurrentPassage(passage);
    setShowQuestions(false);
    setAnswers({});
    setCurrentSession(null);
    startSession.mutate({ passageId: passage.id });
  };

  // Handle text selection for highlighting
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = (questionId: string, answer: string) => {
    const timeSpent = startTime ? (Date.now() - startTime.getTime()) / 1000 : 0;
    submitAnswer.mutate({ questionId, answer, timeSpent });
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const getQuestionIcon = (questionId: string) => {
    const answered = currentSession?.questionsAnswered.find(q => q.questionId === questionId);
    if (!answered) return null;
    return answered.isCorrect ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const calculateProgress = () => {
    if (!currentPassage || !currentSession) return 0;
    const totalQuestions = currentPassage.comprehensionQuestions.length;
    const answeredQuestions = currentSession.questionsAnswered.length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Reading Comprehension</h1>
        <p className="text-muted-foreground">
          Improve your reading skills with interactive passages and comprehension questions
        </p>
      </div>

      <Tabs defaultValue="passages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="passages">Reading Passages</TabsTrigger>
          <TabsTrigger value="practice" disabled={!currentPassage}>
            Current Reading
          </TabsTrigger>
          <TabsTrigger value="vocabulary" disabled={!currentPassage}>
            Vocabulary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="passages" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="daily-life">Daily Life</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Passage List */}
          <div className="grid gap-4 md:grid-cols-2">
            {passages.map((passage: ReadingPassage) => (
              <Card 
                key={passage.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectPassage(passage)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{passage.title}</CardTitle>
                    <Badge className={levelColors[passage.level]}>
                      {passage.level}
                    </Badge>
                  </div>
                  <CardDescription>{passage.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {passage.wordCount} words
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {passage.estimatedReadingTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {passage.comprehensionQuestions.length} questions
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          {currentPassage && (
            <>
              {/* Reading Progress */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{currentPassage.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Progress: {calculateProgress().toFixed(0)}%
                      </span>
                      <Progress value={calculateProgress()} className="w-20" />
                    </div>
                  </div>
                  <CardDescription>
                    {currentPassage.category} • {currentPassage.wordCount} words • 
                    {currentPassage.estimatedReadingTime} min read
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Reading Content */}
              <Card>
                <CardContent className="p-6">
                  <div 
                    className="prose max-w-none leading-relaxed text-justify"
                    onMouseUp={handleTextSelection}
                  >
                    {currentPassage.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {selectedText && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Selected: "{selectedText}"</span>
                        <Button
                          size="sm"
                          onClick={() => {
                            addHighlight.mutate({
                              text: selectedText,
                              startIndex: 0,
                              endIndex: selectedText.length,
                              color: 'yellow'
                            });
                            setSelectedText('');
                          }}
                        >
                          <Highlighter className="h-4 w-4 mr-1" />
                          Highlight
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Cultural Notes */}
                  {currentPassage.culturalNotes && currentPassage.culturalNotes.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Cultural Notes:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {currentPassage.culturalNotes.map((note, index) => (
                          <li key={index} className="text-sm text-blue-700">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Questions Toggle */}
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowQuestions(!showQuestions)}
                  variant={showQuestions ? "outline" : "default"}
                >
                  {showQuestions ? "Hide Questions" : "Show Comprehension Questions"}
                </Button>
              </div>

              {/* Comprehension Questions */}
              {showQuestions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Comprehension Questions</CardTitle>
                    <CardDescription>
                      Test your understanding of the passage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentPassage.comprehensionQuestions.map((question, index) => {
                      const answered = currentSession?.questionsAnswered.find(q => q.questionId === question.id);
                      
                      return (
                        <div key={question.id} className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-sm mt-1">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium">{question.question}</p>
                                {getQuestionIcon(question.id)}
                              </div>

                              {question.type === 'multiple-choice' && question.options && (
                                <RadioGroup
                                  value={answers[question.id] || ''}
                                  onValueChange={(value) => handleSubmitAnswer(question.id, value)}
                                  disabled={!!answered}
                                >
                                  {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                                      <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}

                              {question.type === 'true-false' && (
                                <RadioGroup
                                  value={answers[question.id] || ''}
                                  onValueChange={(value) => handleSubmitAnswer(question.id, value)}
                                  disabled={!!answered}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id={`${question.id}-true`} />
                                    <Label htmlFor={`${question.id}-true`}>True</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id={`${question.id}-false`} />
                                    <Label htmlFor={`${question.id}-false`}>False</Label>
                                  </div>
                                </RadioGroup>
                              )}

                              {question.type === 'short-answer' && (
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Type your answer here..."
                                    value={answers[question.id] || ''}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                    disabled={!!answered}
                                  />
                                  {!answered && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleSubmitAnswer(question.id, answers[question.id] || '')}
                                      disabled={!answers[question.id]?.trim()}
                                    >
                                      Submit Answer
                                    </Button>
                                  )}
                                </div>
                              )}

                              {answered && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm">
                                    <strong>Explanation:</strong> {question.explanation}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Points earned: {answered.pointsEarned}/{question.points}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          {index < currentPassage.comprehensionQuestions.length - 1 && <Separator />}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-6">
          {currentPassage && (
            <Card>
              <CardHeader>
                <CardTitle>Key Vocabulary</CardTitle>
                <CardDescription>
                  Important words and phrases from this passage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentPassage.vocabulary.map((vocab, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{vocab.word}</h4>
                        <Badge variant="outline">{vocab.partOfSpeech}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vocab.pronunciation}</p>
                      <p className="text-sm">{vocab.definition}</p>
                      <div className="pt-2">
                        <p className="text-sm italic">"{vocab.exampleSentence}"</p>
                      </div>
                    </div>
                  ))}
                </div>

                {currentPassage.keyPhrases.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Key Phrases:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPassage.keyPhrases.map((phrase, index) => (
                        <Badge key={index} variant="secondary">
                          {phrase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}