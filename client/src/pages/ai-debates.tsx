import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Mic, MicOff, Timer, Trophy, Brain, Users, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DebateTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'technology' | 'education' | 'environment' | 'culture' | 'society';
  positions: {
    for: string;
    against: string;
  };
  keyPoints: string[];
  vocabulary: string[];
  culturalContext?: string;
}

interface DebateMessage {
  id: string;
  speaker: 'user' | 'ai';
  content: string;
  timestamp: Date;
  argumentType: 'opening' | 'rebuttal' | 'evidence' | 'closing';
  score?: number;
}

interface DebateSession {
  id: string;
  topicId: string;
  userPosition: 'for' | 'against';
  messages: DebateMessage[];
  currentRound: number;
  maxRounds: number;
  status: 'preparing' | 'active' | 'completed';
  scores: {
    argumentation: number;
    evidence: number;
    language: number;
    persuasion: number;
  };
}

export default function AIDebatesPage() {
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);
  const [currentSession, setCurrentSession] = useState<DebateSession | null>(null);
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [messageInput, setMessageInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [preparationTime, setPreparationTime] = useState(120); // 2 minutes
  const [isPreparingMode, setIsPreparingMode] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const debateTopics: DebateTopic[] = [
    {
      id: 'social-media-education',
      title: 'Social Media Should Be Used in Chinese Schools',
      description: 'Debate whether social media platforms like WeChat and Douyin should be integrated into Chinese education.',
      difficulty: 'intermediate',
      category: 'education',
      positions: {
        for: 'Social media enhances learning through engagement and real-world connections',
        against: 'Social media distracts students and creates security concerns in schools'
      },
      keyPoints: [
        'Student engagement and motivation',
        'Digital literacy development',
        'Distraction and focus issues',
        'Privacy and security concerns',
        'Teacher training requirements'
      ],
      vocabulary: ['engagement', 'digital literacy', 'distraction', 'privacy', 'integration'],
      culturalContext: 'Consider Chinese educational values and technology policies'
    },
    {
      id: 'ai-jobs-china',
      title: 'AI Will Create More Jobs Than It Eliminates in China',
      description: 'Discuss the impact of artificial intelligence on employment in China\'s evolving economy.',
      difficulty: 'advanced',
      category: 'technology',
      positions: {
        for: 'AI creates new industries and enhances human productivity',
        against: 'AI automation will lead to widespread unemployment'
      },
      keyPoints: [
        'Manufacturing automation impact',
        'New tech industry jobs',
        'Skills retraining needs',
        'Economic inequality concerns',
        'Government policy responses'
      ],
      vocabulary: ['automation', 'productivity', 'unemployment', 'retraining', 'innovation'],
      culturalContext: 'Focus on China\'s tech advancement and workforce development'
    },
    {
      id: 'traditional-vs-modern',
      title: 'Traditional Chinese Values vs. Modern Lifestyle',
      description: 'Explore the balance between maintaining traditional Chinese culture and embracing modern changes.',
      difficulty: 'intermediate',
      category: 'culture',
      positions: {
        for: 'Traditional values provide essential guidance for modern Chinese society',
        against: 'Modern lifestyle requires abandoning outdated traditional constraints'
      },
      keyPoints: [
        'Family structure evolution',
        'Work-life balance concepts',
        'Respect for elders',
        'Individual freedom',
        'Cultural preservation'
      ],
      vocabulary: ['tradition', 'modernity', 'values', 'evolution', 'preservation'],
      culturalContext: 'Balance filial piety with personal independence'
    }
  ];

  const startDebateSession = (topic: DebateTopic, position: 'for' | 'against') => {
    const session: DebateSession = {
      id: `debate-${Date.now()}`,
      topicId: topic.id,
      userPosition: position,
      messages: [],
      currentRound: 1,
      maxRounds: 4,
      status: 'preparing',
      scores: {
        argumentation: 0,
        evidence: 0,
        language: 0,
        persuasion: 0
      }
    };
    
    setCurrentSession(session);
    setSelectedTopic(topic);
    setUserPosition(position);
    setIsPreparingMode(true);
    
    // Start preparation timer
    const timer = setInterval(() => {
      setPreparationTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPreparingMode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitArgument = async () => {
    if (!currentSession || !selectedTopic || !messageInput.trim()) return;

    const userMessage: DebateMessage = {
      id: `msg-${Date.now()}`,
      speaker: 'user',
      content: messageInput,
      timestamp: new Date(),
      argumentType: currentSession.currentRound === 1 ? 'opening' : 'rebuttal'
    };

    // Simulate AI response
    const aiMessage: DebateMessage = {
      id: `ai-${Date.now()}`,
      speaker: 'ai',
      content: generateAIResponse(selectedTopic, userPosition === 'for' ? 'against' : 'for', userMessage.content),
      timestamp: new Date(),
      argumentType: 'rebuttal',
      score: Math.floor(Math.random() * 20) + 80 // 80-100 score
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage, aiMessage],
      currentRound: currentSession.currentRound + 1,
      status: currentSession.currentRound >= currentSession.maxRounds ? 'completed' : 'active'
    } as DebateSession;

    setCurrentSession(updatedSession);
    setMessageInput('');

    if (updatedSession.status === 'completed') {
      calculateFinalScores(updatedSession);
    }
  };

  const generateAIResponse = (topic: DebateTopic, position: 'for' | 'against', userArgument: string): string => {
    const responses = {
      'social-media-education': {
        for: [
          "I understand your concerns, but consider how social media platforms like WeChat can facilitate real-time communication between teachers, students, and parents, creating a more connected learning environment.",
          "While distraction is a valid concern, proper integration with educational guidelines can turn social media into a powerful tool for collaborative learning and digital citizenship education."
        ],
        against: [
          "Your point about engagement is interesting, but we must consider that social media's addictive design creates dependency that interferes with deep learning and critical thinking skills.",
          "Even with educational benefits, the security risks and data privacy concerns in Chinese schools make social media integration too dangerous to implement widely."
        ]
      }
    };

    const topicResponses = responses[topic.id as keyof typeof responses] || {
      for: ["That's an interesting perspective. However, I believe the benefits outweigh the concerns when proper measures are in place."],
      against: ["I see your point, but I think the risks and negative consequences are too significant to ignore."]
    };

    const positionResponses = topicResponses[position] || topicResponses.for;
    return positionResponses[Math.floor(Math.random() * positionResponses.length)];
  };

  const calculateFinalScores = (session: DebateSession) => {
    // Simulate scoring based on message quality
    const scores = {
      argumentation: Math.floor(Math.random() * 20) + 75,
      evidence: Math.floor(Math.random() * 15) + 70,
      language: Math.floor(Math.random() * 25) + 70,
      persuasion: Math.floor(Math.random() * 20) + 75
    };

    setCurrentSession(prev => prev ? { ...prev, scores } : null);
    
    toast({
      title: "Debate Completed!",
      description: `Overall Score: ${Math.round((scores.argumentation + scores.evidence + scores.language + scores.persuasion) / 4)}%`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="gradient-primary text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🗣️ AI-Powered Debates</h1>
              <p className="text-blue-100 text-lg">
                Practice argumentation and critical thinking through AI-moderated debates on Chinese cultural topics
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Topic Selection */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Choose Your Debate Topic</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {debateTopics.map((topic) => (
                    <Card key={topic.id} className="learning-card cursor-pointer" onClick={() => setSelectedTopic(topic)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className={cn(
                            "level-badge",
                            topic.difficulty === 'beginner' ? 'level-beginner' :
                            topic.difficulty === 'intermediate' ? 'level-intermediate' : 'level-advanced'
                          )}>
                            {topic.difficulty}
                          </Badge>
                          <Badge variant="outline">{topic.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {topic.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Key Vocabulary:</h4>
                            <div className="flex flex-wrap gap-1">
                              {topic.vocabulary.slice(0, 3).map((word) => (
                                <Badge key={word} variant="secondary" className="text-xs">
                                  {word}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {topic.culturalContext && (
                            <div className="bg-muted/50 p-2 rounded text-xs">
                              💡 {topic.culturalContext}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedTopic && (
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle>{selectedTopic.title}</CardTitle>
                  <p className="text-muted-foreground">{selectedTopic.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Position: FOR</h3>
                      <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        {selectedTopic.positions.for}
                      </p>
                      <Button 
                        onClick={() => startDebateSession(selectedTopic, 'for')}
                        className="w-full gamified-button"
                      >
                        Argue FOR this position
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Position: AGAINST</h3>
                      <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        {selectedTopic.positions.against}
                      </p>
                      <Button 
                        onClick={() => startDebateSession(selectedTopic, 'against')}
                        className="w-full gamified-button"
                        variant="outline"
                      >
                        Argue AGAINST this position
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Discussion Points</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedTopic.keyPoints.map((point, index) => (
                        <Badge key={index} variant="outline" className="text-xs p-2">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Debate Interface
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-primary text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{selectedTopic?.title}</h1>
              <p className="text-blue-100">
                Your Position: <span className="font-semibold">{userPosition.toUpperCase()}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                Round {currentSession.currentRound}/{currentSession.maxRounds}
              </div>
              {isPreparingMode && (
                <Badge className="bg-yellow-500">
                  <Timer className="h-3 w-3 mr-1" />
                  Prep: {formatTime(preparationTime)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Debate Messages */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Debate Exchange</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {currentSession.messages.map((message) => (
                    <div key={message.id} className={cn(
                      "p-4 rounded-lg",
                      message.speaker === 'user' 
                        ? "bg-primary/10 ml-8" 
                        : "bg-muted mr-8"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={message.speaker === 'user' ? 'default' : 'secondary'}>
                          {message.speaker === 'user' ? 'You' : 'AI Opponent'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {message.argumentType}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.score && (
                        <div className="mt-2">
                          <Badge variant="outline">Score: {message.score}%</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!isPreparingMode && currentSession.status === 'active' && (
                  <div className="mt-6 space-y-4">
                    <Textarea
                      placeholder="Present your argument here..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={() => setIsRecording(!isRecording)}
                        variant="outline"
                        size="sm"
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        Voice Input
                      </Button>
                      <Button onClick={submitArgument} className="gamified-button">
                        Submit Argument
                      </Button>
                    </div>
                  </div>
                )}

                {currentSession.status === 'completed' && (
                  <div className="mt-6 text-center">
                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Debate Completed!</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{currentSession.scores.argumentation}%</div>
                        <div className="text-xs text-muted-foreground">Argumentation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{currentSession.scores.evidence}%</div>
                        <div className="text-xs text-muted-foreground">Evidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{currentSession.scores.language}%</div>
                        <div className="text-xs text-muted-foreground">Language</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">{currentSession.scores.persuasion}%</div>
                        <div className="text-xs text-muted-foreground">Persuasion</div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setCurrentSession(null)}
                      className="mt-4 gamified-button"
                    >
                      Start New Debate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Debate Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <strong>Use evidence:</strong> Support your arguments with examples and facts
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Address counterpoints:</strong> Acknowledge and refute opposing views
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <strong>Stay focused:</strong> Keep arguments relevant to the main topic
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedTopic && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Vocabulary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.vocabulary.map((word) => (
                      <Badge key={word} variant="outline" className="text-xs">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}