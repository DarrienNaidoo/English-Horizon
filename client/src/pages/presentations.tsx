import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Presentation, 
  Mic, 
  MicOff, 
  Timer, 
  Eye, 
  Volume2, 
  FileText, 
  CheckCircle,
  BarChart3,
  Target,
  Lightbulb
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PresentationTopic {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'business' | 'academic' | 'cultural' | 'technology' | 'personal';
  outline: string[];
  keyVocabulary: string[];
  tips: string[];
  chineseContext?: string;
}

interface PresentationSession {
  id: string;
  topicId: string;
  script: string;
  currentSlide: number;
  totalSlides: number;
  timeSpent: number;
  isRecording: boolean;
  feedback: PresentationFeedback | null;
  status: 'preparing' | 'presenting' | 'completed';
}

interface PresentationFeedback {
  overallScore: number;
  criteria: {
    content: number;
    delivery: number;
    timing: number;
    engagement: number;
  };
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}

export default function PresentationsPage() {
  const [selectedTopic, setSelectedTopic] = useState<PresentationTopic | null>(null);
  const [currentSession, setCurrentSession] = useState<PresentationSession | null>(null);
  const [presentationScript, setPresentationScript] = useState('');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const presentationTopics: PresentationTopic[] = [
    {
      id: 'chinese-startup',
      title: 'My Chinese Startup Idea',
      description: 'Present an innovative business idea that addresses a problem in Chinese society',
      duration: 5,
      difficulty: 'intermediate',
      category: 'business',
      outline: [
        'Problem identification in Chinese market',
        'Solution overview and unique value',
        'Target audience and market size',
        'Business model and revenue streams',
        'Implementation timeline and goals'
      ],
      keyVocabulary: ['innovation', 'market opportunity', 'revenue', 'scalability', 'investment'],
      tips: [
        'Use specific examples from Chinese cities',
        'Mention relevant Chinese apps or services',
        'Include cultural considerations',
        'Practice confident body language'
      ],
      chineseContext: 'Consider China\'s digital economy and consumer preferences'
    },
    {
      id: 'cultural-exchange',
      title: 'Introducing Chinese Culture to International Students',
      description: 'Create a presentation to help foreign students understand Chinese customs and traditions',
      duration: 7,
      difficulty: 'beginner',
      category: 'cultural',
      outline: [
        'Welcome and personal introduction',
        'Key Chinese festivals and celebrations',
        'Traditional food culture and etiquette',
        'Modern Chinese lifestyle vs traditions',
        'Practical tips for living in China'
      ],
      keyVocabulary: ['tradition', 'customs', 'etiquette', 'celebration', 'adaptation'],
      tips: [
        'Use personal anecdotes and examples',
        'Explain cultural context clearly',
        'Be patient with cultural differences',
        'Include interactive elements'
      ],
      chineseContext: 'Bridge traditional values with modern Chinese life'
    },
    {
      id: 'tech-innovation',
      title: 'The Future of AI in Chinese Education',
      description: 'Discuss how artificial intelligence will transform learning in Chinese schools and universities',
      duration: 8,
      difficulty: 'advanced',
      category: 'technology',
      outline: [
        'Current state of Chinese education technology',
        'AI applications in personalized learning',
        'Benefits for students and teachers',
        'Challenges and ethical considerations',
        'Vision for the next decade'
      ],
      keyVocabulary: ['artificial intelligence', 'personalization', 'automation', 'ethics', 'transformation'],
      tips: [
        'Use data and research to support points',
        'Address potential concerns proactively',
        'Include real-world examples',
        'Maintain academic tone while being engaging'
      ],
      chineseContext: 'Consider China\'s tech advancement and educational policies'
    },
    {
      id: 'environmental-action',
      title: 'Green Living in Chinese Cities',
      description: 'Present practical solutions for environmental sustainability in urban China',
      duration: 6,
      difficulty: 'intermediate',
      category: 'academic',
      outline: [
        'Environmental challenges in Chinese cities',
        'Individual actions for sustainability',
        'Community-based green initiatives',
        'Technology solutions and innovation',
        'Call to action for audience'
      ],
      keyVocabulary: ['sustainability', 'pollution', 'renewable energy', 'conservation', 'initiative'],
      tips: [
        'Focus on actionable solutions',
        'Use local examples and case studies',
        'Include visual data when possible',
        'End with clear next steps'
      ],
      chineseContext: 'Address China\'s environmental goals and green development'
    }
  ];

  const startPresentationSession = (topic: PresentationTopic) => {
    const session: PresentationSession = {
      id: `pres-${Date.now()}`,
      topicId: topic.id,
      script: '',
      currentSlide: 1,
      totalSlides: topic.outline.length,
      timeSpent: 0,
      isRecording: false,
      feedback: null,
      status: 'preparing'
    };
    
    setCurrentSession(session);
    setSelectedTopic(topic);
    setCurrentSlide(1);
    setTimeElapsed(0);
    setPresentationScript('');
  };

  const startPresenting = () => {
    if (!currentSession) return;
    
    setCurrentSession(prev => prev ? { ...prev, status: 'presenting' } : null);
    setIsTimerActive(true);
    
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const completePresentation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsTimerActive(false);
    
    // Generate feedback
    const feedback: PresentationFeedback = {
      overallScore: Math.floor(Math.random() * 20) + 75,
      criteria: {
        content: Math.floor(Math.random() * 15) + 80,
        delivery: Math.floor(Math.random() * 20) + 70,
        timing: timeElapsed <= (selectedTopic?.duration || 5) * 60 + 30 ? 85 : 70,
        engagement: Math.floor(Math.random() * 25) + 70
      },
      strengths: [
        'Clear structure and logical flow',
        'Good use of examples and evidence',
        'Appropriate vocabulary for audience'
      ],
      improvements: [
        'Practice smoother transitions between points',
        'Maintain more consistent eye contact',
        'Use more varied vocal intonation'
      ],
      detailedFeedback: 'Your presentation demonstrated good preparation and understanding of the topic. The content was well-organized and culturally relevant. Focus on building confidence in delivery and engaging more directly with your audience.'
    };
    
    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'completed',
      feedback,
      timeSpent: timeElapsed
    } : null);
    
    toast({
      title: "Presentation Complete!",
      description: `Overall Score: ${feedback.overallScore}%`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSlide = () => {
    if (currentSlide < (selectedTopic?.outline.length || 1)) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="gradient-primary text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">🎤 Presentation Practice</h1>
              <p className="text-blue-100 text-lg">
                Build confidence and improve your English presentation skills with AI-powered feedback
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Presentation className="h-5 w-5" />
                <span>Choose Your Presentation Topic</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {presentationTopics.map((topic) => (
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
                        <div className="flex space-x-2">
                          <Badge variant="outline">{topic.category}</Badge>
                          <Badge variant="outline">
                            <Timer className="h-3 w-3 mr-1" />
                            {topic.duration}min
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{topic.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Presentation Outline:</h4>
                          <ul className="text-xs space-y-1">
                            {topic.outline.slice(0, 3).map((point, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-primary">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                            {topic.outline.length > 3 && (
                              <li className="text-muted-foreground">... and {topic.outline.length - 3} more points</li>
                            )}
                          </ul>
                        </div>
                        
                        {topic.chineseContext && (
                          <div className="bg-muted/50 p-3 rounded text-xs">
                            <strong>Cultural Context:</strong> {topic.chineseContext}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTopic && (
                <div className="mt-8">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>{selectedTopic.title}</CardTitle>
                      <p className="text-muted-foreground">{selectedTopic.description}</p>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="outline" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="outline">Outline</TabsTrigger>
                          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                          <TabsTrigger value="tips">Tips</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="outline" className="space-y-4">
                          <h3 className="font-semibold">Presentation Structure</h3>
                          <div className="space-y-3">
                            {selectedTopic.outline.map((point, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                                <div>
                                  <p className="font-medium">{point}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="vocabulary" className="space-y-4">
                          <h3 className="font-semibold">Key Vocabulary</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTopic.keyVocabulary.map((word) => (
                              <Badge key={word} variant="secondary">{word}</Badge>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="tips" className="space-y-4">
                          <h3 className="font-semibold">Presentation Tips</h3>
                          <div className="space-y-2">
                            {selectedTopic.tips.map((tip, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <p className="text-sm">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-6">
                        <Button 
                          onClick={() => startPresentationSession(selectedTopic)}
                          className="w-full gamified-button"
                          size="lg"
                        >
                          Start Preparing Presentation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active Presentation Interface
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-primary text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{selectedTopic?.title}</h1>
              <p className="text-blue-100">
                {currentSession.status === 'preparing' ? 'Preparation Phase' : 
                 currentSession.status === 'presenting' ? 'Live Presentation' : 'Review Results'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {isTimerActive ? formatTime(timeElapsed) : 'Ready'}
              </div>
              <div className="text-sm text-blue-200">
                Target: {selectedTopic?.duration} minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSession.status === 'preparing' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Prepare Your Script</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your presentation script here. Include key points for each section..."
                    value={presentationScript}
                    onChange={(e) => setPresentationScript(e.target.value)}
                    className="min-h-[300px] text-base"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {presentationScript.split(' ').filter(word => word.length > 0).length} words
                    </p>
                    <Button onClick={startPresenting} className="gamified-button">
                      Start Presentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Presentation Outline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTopic?.outline.map((point, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Badge 
                          variant={index + 1 === currentSlide ? "default" : "outline"}
                          className="mt-1"
                        >
                          {index + 1}
                        </Badge>
                        <p className="text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>Maintain eye contact with audience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4 text-green-500" />
                      <span>Speak clearly and at moderate pace</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>Stay focused on main points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentSession.status === 'presenting' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Slide {currentSlide} of {selectedTopic?.outline.length}
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => setIsRecording(!isRecording)}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    <Badge className="text-lg px-3 py-1">
                      <Timer className="h-4 w-4 mr-1" />
                      {formatTime(timeElapsed)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h2 className="text-3xl font-bold mb-4">
                    {selectedTopic?.outline[currentSlide - 1]}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Present this section of your topic. Use your prepared script as a guide.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      onClick={prevSlide} 
                      disabled={currentSlide === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 bg-muted rounded">
                      {currentSlide} / {selectedTopic?.outline.length}
                    </span>
                    {currentSlide < (selectedTopic?.outline.length || 1) ? (
                      <Button onClick={nextSlide}>
                        Next Slide
                      </Button>
                    ) : (
                      <Button onClick={completePresentation} className="gamified-button">
                        Complete Presentation
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Progress 
                value={(currentSlide / (selectedTopic?.outline.length || 1)) * 100} 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
        )}

        {currentSession.status === 'completed' && currentSession.feedback && (
          <div className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-3xl">Presentation Complete!</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Time: {formatTime(currentSession.timeSpent)} | 
                    Target: {selectedTopic?.duration} minutes
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {currentSession.feedback.overallScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500 mb-2">
                      {currentSession.feedback.criteria.content}%
                    </div>
                    <div className="text-sm text-muted-foreground">Content</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500 mb-2">
                      {currentSession.feedback.criteria.delivery}%
                    </div>
                    <div className="text-sm text-muted-foreground">Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500 mb-2">
                      {currentSession.feedback.criteria.engagement}%
                    </div>
                    <div className="text-sm text-muted-foreground">Engagement</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-green-600 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {currentSession.feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-3">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {currentSession.feedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Detailed Feedback</h3>
                  <p className="text-sm">{currentSession.feedback.detailedFeedback}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setCurrentSession(null)}
                    className="gamified-button"
                  >
                    Try Another Topic
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}