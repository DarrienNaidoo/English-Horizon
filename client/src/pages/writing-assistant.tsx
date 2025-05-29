import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  PenTool, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  BookOpen,
  FileText,
  TrendingUp,
  Copy,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GrammarError {
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary';
  message: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  severity: 'low' | 'medium' | 'high';
}

interface WritingAnalysis {
  text: string;
  errors: GrammarError[];
  readabilityScore: number;
  wordCount: number;
  sentenceCount: number;
  suggestions: any[];
  vocabulary: {
    level: string;
    complexWords: string[];
    suggestedAlternatives: Array<{ word: string; alternatives: string[] }>;
    diversityScore: number;
  };
}

interface WritingTemplate {
  id: string;
  title: string;
  type: string;
  level: string;
  structure: string[];
  example: string;
  keyPhrases: string[];
}

export default function WritingAssistant() {
  const [currentText, setCurrentText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);
  const [improvedText, setImprovedText] = useState("");

  const { data: templates } = useQuery<WritingTemplate[]>({
    queryKey: ["/api/writing/templates"],
  });

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/writing/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  const improveMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/writing/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setImprovedText(data.improvedText);
    },
  });

  const handleAnalyze = () => {
    if (currentText.trim()) {
      analyzeMutation.mutate(currentText);
    }
  };

  const handleImprove = () => {
    if (currentText.trim()) {
      improveMutation.mutate(currentText);
    }
  };

  const useTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setCurrentText(template.example);
      setSelectedTemplate(templateId);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getReadabilityLevel = (score: number) => {
    if (score >= 90) return { level: "Very Easy", color: "text-green-600" };
    if (score >= 80) return { level: "Easy", color: "text-green-500" };
    if (score >= 70) return { level: "Fairly Easy", color: "text-yellow-500" };
    if (score >= 60) return { level: "Standard", color: "text-orange-500" };
    if (score >= 50) return { level: "Fairly Difficult", color: "text-red-500" };
    return { level: "Difficult", color: "text-red-600" };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      case 'low': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Writing Assistant</h1>
          <p className="text-white/80">
            Improve your writing with grammar correction and style suggestions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Templates Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Templates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates?.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => useTemplate(template.id)}
                  >
                    <div>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs opacity-70 capitalize">
                        {template.type} • {template.level}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {analysis && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Text Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Words</span>
                    <Badge variant="secondary">{analysis.wordCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sentences</span>
                    <Badge variant="secondary">{analysis.sentenceCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Errors</span>
                    <Badge variant="destructive">{analysis.errors.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Readability</span>
                    <Badge 
                      variant="outline" 
                      className={getReadabilityLevel(analysis.readabilityScore).color}
                    >
                      {analysis.readabilityScore}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Writing Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="write" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="write">Write & Edit</TabsTrigger>
                <TabsTrigger value="analyze">Analysis</TabsTrigger>
                <TabsTrigger value="improve">Improvements</TabsTrigger>
              </TabsList>

              {/* Writing Tab */}
              <TabsContent value="write">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <PenTool className="h-5 w-5" />
                        <span>Your Text</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentText("")}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                        <Button
                          onClick={handleAnalyze}
                          disabled={!currentText.trim() || analyzeMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      placeholder="Start writing your text here, or select a template to get started..."
                      className="min-h-[400px] text-base leading-relaxed"
                    />
                    <div className="mt-4 text-sm text-muted-foreground">
                      {currentText.trim().split(/\s+/).filter(word => word.length > 0).length} words
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analyze">
                <div className="space-y-6">
                  {!analysis ? (
                    <Card>
                      <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Write some text and click "Analyze" to see detailed feedback
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Readability Score */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Readability Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl font-bold">
                              {analysis.readabilityScore}
                            </div>
                            <div>
                              <div className={cn("font-medium", getReadabilityLevel(analysis.readabilityScore).color)}>
                                {getReadabilityLevel(analysis.readabilityScore).level}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Flesch Reading Ease Score
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Grammar Errors */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Grammar & Style Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {analysis.errors.length === 0 ? (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              <span>No grammar errors found!</span>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {analysis.errors.map((error, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "p-3 rounded-lg border",
                                    getSeverityColor(error.severity)
                                  )}
                                >
                                  <div className="flex items-start space-x-3">
                                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <div className="font-medium capitalize">
                                        {error.type} - {error.severity} severity
                                      </div>
                                      <div className="text-sm mt-1">{error.message}</div>
                                      <div className="text-sm mt-2 font-medium">
                                        Suggestion: {error.suggestion}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Vocabulary Analysis */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Vocabulary Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Vocabulary Level</span>
                            <Badge className="capitalize">{analysis.vocabulary.level}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Word Diversity</span>
                            <Badge variant="outline">{analysis.vocabulary.diversityScore}%</Badge>
                          </div>
                          
                          {analysis.vocabulary.suggestedAlternatives.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Suggested Simplifications</h4>
                              <div className="space-y-2">
                                {analysis.vocabulary.suggestedAlternatives.map((alt, index) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium">{alt.word}</span> → {alt.alternatives.join(", ")}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Improvements Tab */}
              <TabsContent value="improve">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>Improved Version</span>
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleImprove}
                          disabled={!currentText.trim() || improveMutation.isPending}
                        >
                          {improveMutation.isPending ? 'Improving...' : 'Generate Improvements'}
                        </Button>
                        {improvedText && (
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(improvedText)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!improvedText ? (
                      <div className="text-center py-12">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Click "Generate Improvements" to see an enhanced version of your text
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Here's an improved version of your text with corrections applied.
                          </AlertDescription>
                        </Alert>
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="whitespace-pre-wrap text-base leading-relaxed">
                            {improvedText}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}