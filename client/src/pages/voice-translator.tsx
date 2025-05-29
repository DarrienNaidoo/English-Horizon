import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  RefreshCw,
  Copy,
  Info,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  timestamp: Date;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "Chinese (Mandarin)", flag: "🇨🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
];

export default function VoiceTranslator() {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [translationHistory, setTranslationHistory] = useState<TranslationResult[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("zh");
  const [error, setError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState({
    speechRecognition: false,
    speechSynthesis: false
  });
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check browser support
    const recognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const synthesis = 'speechSynthesis' in window;
    
    setBrowserSupport({
      speechRecognition: recognition,
      speechSynthesis: synthesis
    });

    // Initialize speech recognition if supported
    if (recognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage === "zh" ? "zh-CN" : sourceLanguage;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setCurrentText(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          handleTranslation(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Initialize speech synthesis if supported
    if (synthesis) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [sourceLanguage]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser");
      return;
    }
    
    setError(null);
    setCurrentText("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleTranslation = async (text: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (result.error === "EXTERNAL_SERVICE_NEEDED") {
          setError("Currently supports demo phrases: " + result.supportedPhrases.join(", "));
        } else {
          setError(result.message || "Translation failed");
        }
        return;
      }
      
      const translationResult: TranslationResult = {
        originalText: text,
        translatedText: result.translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: result.confidence || 0.95,
        timestamp: new Date(),
      };
      
      setTranslationHistory(prev => [translationResult, ...prev.slice(0, 9)]);
      
      // Speak the translation
      if (result.translatedText && browserSupport.speechSynthesis) {
        speakText(result.translatedText, targetLanguage);
      }
      
    } catch (error) {
      setError("Translation failed. Please check your connection and try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, language: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "zh" ? "zh-CN" : language;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Text-to-speech failed");
    };
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const getLanguageFlag = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.flag || "🌐";
  };

  const getLanguageName = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Voice Translator</h1>
          <p className="text-primary-foreground/80">
            Speak naturally and get instant translations with voice output
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Browser Support Alert */}
        {(!browserSupport.speechRecognition || !browserSupport.speechSynthesis) && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {!browserSupport.speechRecognition && "Speech recognition not supported. "}
              {!browserSupport.speechSynthesis && "Text-to-speech not supported. "}
              For best experience, use Chrome or Edge browser.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Translation Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="h-5 w-5" />
              <span>Live Translation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">From</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="mt-6"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">To</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={isTranslating || !browserSupport.speechRecognition}
                className="flex-1"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Speaking
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={isSpeaking ? stopSpeaking : () => {
                  if (translationHistory.length > 0) {
                    speakText(translationHistory[0].translatedText, translationHistory[0].targetLanguage);
                  }
                }}
                disabled={!translationHistory.length || !browserSupport.speechSynthesis}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-5 w-5 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 mr-2" />
                    Repeat
                  </>
                )}
              </Button>
            </div>

            {/* Current Speech Display */}
            {(currentText || isListening) && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>{getLanguageFlag(sourceLanguage)}</span>
                  <span className="text-sm font-medium">
                    {isListening ? "Listening..." : "Heard:"}
                  </span>
                  {isListening && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <p className="text-lg">{currentText || "Speak now..."}</p>
              </div>
            )}

            {/* Translation Status */}
            {isTranslating && (
              <div className="flex items-center justify-center space-x-2 p-4">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Translating...</span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Quick Text Translation */}
        <Card>
          <CardHeader>
            <CardTitle>Type to Translate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type text to translate..."
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              rows={3}
            />
            <Button
              onClick={() => handleTranslation(currentText)}
              disabled={!currentText.trim() || isTranslating}
              className="w-full"
            >
              {isTranslating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Translation History */}
        {translationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Translation History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {translationHistory.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{getLanguageFlag(result.sourceLanguage)}</span>
                      <span className="text-sm text-muted-foreground">
                        {getLanguageName(result.sourceLanguage)}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{getLanguageFlag(result.targetLanguage)}</span>
                      <span className="text-sm text-muted-foreground">
                        {getLanguageName(result.targetLanguage)}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(result.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Original</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.originalText)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="p-2 bg-muted rounded text-sm">{result.originalText}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Translation</span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(result.translatedText, result.targetLanguage)}
                            disabled={!browserSupport.speechSynthesis}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.translatedText)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="p-2 bg-primary/10 rounded text-sm">{result.translatedText}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {result.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}