import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  RotateCcw, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Mic,
  MicOff,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'daily' | 'business' | 'travel' | 'academic';
  objectives: string[];
  vocabularyFocus: string[];
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  corrections?: string[];
  suggestions?: string[];
}

export default function AIConversation() {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showCorrections, setShowCorrections] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: scenarios } = useQuery<ConversationScenario[]>({
    queryKey: ["/api/conversation/scenarios"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ scenarioId, message }: { scenarioId: string; message: string }) => {
      const response = await fetch(`/api/conversation/${scenarioId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: messages }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        corrections: data.corrections,
        suggestions: data.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedScenario) return;

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate({
      scenarioId: selectedScenario,
      message: currentMessage
    });
    setCurrentMessage("");
  };

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setMessages([]);
    
    // Send initial greeting based on scenario
    const scenario = scenarios?.find(s => s.id === scenarioId);
    if (scenario) {
      const greeting: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `Hello! Welcome to our ${scenario.title.toLowerCase()} practice. I'm here to help you practice your English. How can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    if (selectedScenario) {
      handleScenarioChange(selectedScenario);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentScenario = scenarios?.find(s => s.id === selectedScenario);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">AI Conversation Practice</h1>
          <p className="text-primary-foreground/80">
            Practice real-world conversations with AI-powered scenarios
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Scenario Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Choose Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedScenario} onValueChange={handleScenarioChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios?.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        {scenario.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentScenario && (
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {currentScenario.level}
                      </Badge>
                      <Badge variant="secondary">
                        {currentScenario.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Objectives:</h4>
                      <ul className="text-sm space-y-1">
                        {currentScenario.objectives.map((obj, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Vocabulary:</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentScenario.vocabularyFocus.map((word, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetConversation}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Conversation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Speak naturally and don't worry about mistakes</p>
                <p>• Pay attention to corrections and suggestions</p>
                <p>• Try to use the key vocabulary words</p>
                <p>• Ask follow-up questions to keep the conversation going</p>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Conversation</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCorrections(!showCorrections)}
                    >
                      {showCorrections ? "Hide" : "Show"} Feedback
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4 p-4">
                    {messages.length === 0 && selectedScenario && (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Start the conversation by typing a message below</p>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3 space-y-2",
                            message.role === 'user'
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <p>{message.content}</p>
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakText(message.content)}
                                className="ml-2 p-1 h-auto"
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          
                          {showCorrections && message.corrections && message.corrections.length > 0 && (
                            <Alert className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Correction:</strong> {message.corrections.join(", ")}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {showCorrections && message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                              <strong>Suggestion:</strong> {message.suggestions.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder={selectedScenario ? "Type your message..." : "Select a scenario first"}
                      disabled={!selectedScenario}
                      className="resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || !selectedScenario || sendMessageMutation.isPending}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsListening(!isListening)}
                        disabled={!selectedScenario}
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {sendMessageMutation.isPending && (
                    <div className="text-sm text-muted-foreground">
                      AI is thinking...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}