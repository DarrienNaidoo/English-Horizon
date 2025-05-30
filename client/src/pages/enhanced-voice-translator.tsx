import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  Copy, 
  ArrowRightLeft, 
  BookOpen, 
  Users, 
  MessageCircle,
  Play,
  Pause,
  RotateCcw,
  Star,
  Clock,
  Target
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TranslationResult {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  timestamp: Date;
  audioUrl?: string;
  category: 'general' | 'academic' | 'business' | 'travel' | 'cultural';
}

interface ConversationTurn {
  id: string;
  speaker: 'user' | 'system';
  originalText: string;
  translatedText: string;
  language: string;
  timestamp: Date;
}

export default function EnhancedVoiceTranslatorPage() {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("zh");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<'instant' | 'conversation' | 'practice'>('instant');
  const [translationHistory, setTranslationHistory] = useState<TranslationResult[]>([]);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [practiceLevel, setPracticeLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
    { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
    { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
    { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
    { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
    { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹", nativeName: "Português" },
    { code: "ru", name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
    { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
  ];

  const practiceScenarios = {
    beginner: [
      { id: 'greetings', title: 'Basic Greetings', phrases: ['Hello', 'Good morning', 'How are you?', 'Nice to meet you', 'Goodbye'] },
      { id: 'numbers', title: 'Numbers & Time', phrases: ['What time is it?', 'How much does this cost?', 'I need help', 'Where is the bathroom?', 'Thank you'] },
      { id: 'shopping', title: 'Simple Shopping', phrases: ['How much is this?', 'I want to buy this', 'Do you accept credit cards?', 'Can I try this on?', 'Where is the cashier?'] }
    ],
    intermediate: [
      { id: 'directions', title: 'Asking for Directions', phrases: ['Could you help me find the subway station?', 'How do I get to the museum?', 'Is it walking distance?', 'Which bus should I take?', 'Can you show me on the map?'] },
      { id: 'restaurant', title: 'Restaurant Conversation', phrases: ['I would like to make a reservation', 'What do you recommend?', 'I have a food allergy', 'Could I get the check please?', 'The food was delicious'] },
      { id: 'hotel', title: 'Hotel Services', phrases: ['I have a reservation under my name', 'Could I get a wake-up call?', 'Is breakfast included?', 'Where can I find the gym?', 'I need extra towels'] }
    ],
    advanced: [
      { id: 'business', title: 'Business Meetings', phrases: ['Let me introduce our company', 'What are your expectations for this project?', 'We need to discuss the timeline', 'Could you send me the proposal?', 'When can we schedule the next meeting?'] },
      { id: 'academic', title: 'Academic Discussions', phrases: ['I\'m researching Chinese environmental policies', 'Could you explain this concept in detail?', 'What are the main challenges in this field?', 'How does this compare to international standards?', 'What sources would you recommend?'] },
      { id: 'cultural', title: 'Cultural Exchange', phrases: ['I\'m interested in traditional Chinese culture', 'Could you explain the significance of this festival?', 'How has modern life changed traditions?', 'What should foreign visitors know about etiquette?', 'How do different regions vary culturally?'] }
    ]
  };

  const commonPhrases = {
    emergency: ['Help!', 'Call the police', 'I need a doctor', 'Where is the hospital?', 'I lost my passport'],
    politeness: ['Excuse me', 'I\'m sorry', 'Could you please help me?', 'Thank you very much', 'You\'re very kind'],
    learning: ['I don\'t understand', 'Could you repeat that?', 'How do you say this in Chinese?', 'I\'m learning Chinese', 'Could you speak slower?']
  };

  const simulateTranslation = (text: string, source: string, target: string): TranslationResult => {
    // Simulate translation with sample Chinese responses
    const sampleTranslations: Record<string, string> = {
      'Hello': '你好',
      'Good morning': '早上好',
      'How are you?': '你好吗？',
      'Thank you': '谢谢',
      'Nice to meet you': '很高兴见到你',
      'Where is the bathroom?': '洗手间在哪里？',
      'How much does this cost?': '这个多少钱？',
      'I need help': '我需要帮助',
      'Could you help me find the subway station?': '你能帮我找到地铁站吗？',
      'I would like to make a reservation': '我想预订',
      'What do you recommend?': '你推荐什么？',
      'Let me introduce our company': '让我介绍一下我们公司',
      'I\'m researching Chinese environmental policies': '我正在研究中国的环境政策',
      'I\'m interested in traditional Chinese culture': '我对中国传统文化很感兴趣'
    };

    const translated = sampleTranslations[text] || `[${text} - translated to ${target}]`;
    
    return {
      id: `trans-${Date.now()}`,
      originalText: text,
      translatedText: translated,
      sourceLanguage: source,
      targetLanguage: target,
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      timestamp: new Date(),
      category: 'general'
    };
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const result = simulateTranslation(inputText, sourceLanguage, targetLanguage);
      setTranslatedText(result.translatedText);
      setTranslationHistory(prev => [result, ...prev].slice(0, 10));
      setIsLoading(false);
      
      if (currentMode === 'conversation') {
        const userTurn: ConversationTurn = {
          id: `turn-${Date.now()}`,
          speaker: 'user',
          originalText: inputText,
          translatedText: result.translatedText,
          language: sourceLanguage,
          timestamp: new Date()
        };
        setConversation(prev => [...prev, userTurn]);
      }
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          // Simulate speech recognition
          setTimeout(() => {
            setInputText("Hello, how are you today?");
            setIsRecording(false);
          }, 2000);
        }
      });
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText("");
  };

  const practicePhrase = (phrase: string) => {
    setInputText(phrase);
    setCurrentMode('instant');
  };

  const playAudio = (text: string, language: string) => {
    // Simulate text-to-speech
    toast({
      title: "Playing Audio",
      description: `Speaking: "${text}" in ${languages.find(l => l.code === language)?.name}`
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🗣️ Smart Voice Translator</h1>
            <p className="text-blue-100 text-lg">
              Real-time translation with conversation practice and cultural context for Chinese learners
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection */}
        <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instant" className="flex items-center space-x-2">
              <Languages className="h-4 w-4" />
              <span>Instant Translation</span>
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Conversation Mode</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Practice Scenarios</span>
            </TabsTrigger>
          </TabsList>

          {/* Instant Translation */}
          <TabsContent value="instant" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>Input</span>
                      <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardTitle>
                    <Button
                      onClick={swapLanguages}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type or speak your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[120px] mb-4"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? 'Stop' : 'Voice'}
                    </Button>
                    <Button
                      onClick={() => playAudio(inputText, sourceLanguage)}
                      variant="outline"
                      size="sm"
                      disabled={!inputText}
                    >
                      <Volume2 className="h-4 w-4" />
                      Play
                    </Button>
                    <Button
                      onClick={handleTranslate}
                      className="gamified-button ml-auto"
                      disabled={!inputText || isLoading}
                    >
                      {isLoading ? 'Translating...' : 'Translate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Output</span>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[120px] p-4 bg-muted rounded-lg mb-4">
                    {translatedText ? (
                      <p className="text-lg">{translatedText}</p>
                    ) : (
                      <p className="text-muted-foreground">Translation will appear here...</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => playAudio(translatedText, targetLanguage)}
                      variant="outline"
                      size="sm"
                      disabled={!translatedText}
                    >
                      <Volume2 className="h-4 w-4" />
                      Play
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(translatedText)}
                      variant="outline"
                      size="sm"
                      disabled={!translatedText}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Translation History */}
            {translationHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Translations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {translationHistory.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {languages.find(l => l.code === item.sourceLanguage)?.flag} → {languages.find(l => l.code === item.targetLanguage)?.flag}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(item.confidence * 100)}% confident
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">{item.originalText}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{item.translatedText}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Practice Scenarios */}
          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Practice Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <Button
                      key={level}
                      onClick={() => setPracticeLevel(level)}
                      variant={practiceLevel === level ? "default" : "outline"}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {practiceScenarios[practiceLevel].map((scenario) => (
                    <Card key={scenario.id} className="learning-card cursor-pointer" onClick={() => setSelectedScenario(scenario.id)}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">{scenario.title}</h3>
                        <div className="space-y-2">
                          {scenario.phrases.slice(0, 2).map((phrase, index) => (
                            <Button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                practicePhrase(phrase);
                              }}
                              variant="ghost"
                              size="sm"
                              className="w-full text-left justify-start text-xs h-auto py-2"
                            >
                              "{phrase}"
                            </Button>
                          ))}
                          <p className="text-xs text-muted-foreground">
                            +{scenario.phrases.length - 2} more phrases
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Phrases */}
            <Card>
              <CardHeader>
                <CardTitle>Essential Phrases for Chinese Learners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(commonPhrases).map(([category, phrases]) => (
                    <div key={category}>
                      <h3 className="font-semibold mb-3 capitalize">{category}</h3>
                      <div className="space-y-2">
                        {phrases.map((phrase, index) => (
                          <Button
                            key={index}
                            onClick={() => practicePhrase(phrase)}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs h-auto py-2"
                          >
                            "{phrase}"
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation Mode */}
          <TabsContent value="conversation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Live Conversation Translation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversation.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Start a conversation to see real-time translations</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {conversation.map((turn) => (
                        <div key={turn.id} className={cn(
                          "p-4 rounded-lg",
                          turn.speaker === 'user' ? "bg-primary/10 ml-8" : "bg-muted mr-8"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={turn.speaker === 'user' ? 'default' : 'secondary'}>
                              {turn.speaker === 'user' ? 'You' : 'Translation'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {turn.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="font-medium">{turn.originalText}</p>
                          <p className="text-sm text-muted-foreground mt-1">{turn.translatedText}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Textarea
                      placeholder="Type your message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                      >
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={handleTranslate}
                        className="gamified-button"
                        disabled={!inputText || isLoading}
                        size="sm"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}