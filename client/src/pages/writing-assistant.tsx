import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PenTool, CheckCircle, AlertTriangle, Lightbulb, BookOpen, Zap } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function WritingAssistant() {
  const [text, setText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [writingType, setWritingType] = useState("essay");

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/writing/templates"],
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/writing/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });

  const analyzeText = () => {
    if (text.trim()) {
      analyzeMutation.mutate({ text, type: writingType });
    }
  };

  const applyCorrection = (position, suggestion) => {
    const newText = text.substring(0, position.start) + suggestion + text.substring(position.end);
    setText(newText);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI Writing Assistant
        </h1>
        <p className="text-muted-foreground">
          Get intelligent feedback on grammar, style, and clarity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Writing Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Write Your Text
                </CardTitle>
                <div className="flex gap-2">
                  <Select value={writingType} onValueChange={setWritingType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={analyzeText} disabled={!text.trim() || analyzeMutation.isPending}>
                    {analyzeMutation.isPending ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start writing your text here. The AI will analyze grammar, style, and provide suggestions for improvement..."
                className="min-h-96 resize-none"
              />
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analyzeMutation.data && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analyzeMutation.data.grammarScore)}`}>
                      {analyzeMutation.data.grammarScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Grammar</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analyzeMutation.data.styleScore)}`}>
                      {analyzeMutation.data.styleScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Style</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analyzeMutation.data.clarityScore)}`}>
                      {analyzeMutation.data.clarityScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Clarity</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="issues" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="issues">
                    <div className="space-y-3">
                      {analyzeMutation.data.issues?.map((issue, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className={`w-4 h-4 ${getSeverityColor(issue.severity)}`} />
                                <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                  {issue.type}
                                </Badge>
                                <Badge variant="secondary">{issue.severity}</Badge>
                              </div>
                              <p className="text-sm mb-2">{issue.message}</p>
                              <p className="text-xs text-muted-foreground">
                                Position: {issue.position.start}-{issue.position.end}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applyCorrection(issue.position, issue.suggestion)}
                            >
                              Apply Fix
                            </Button>
                          </div>
                          {issue.suggestion && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Suggestion:</strong> {issue.suggestion}
                            </div>
                          )}
                        </div>
                      ))}
                      {analyzeMutation.data.issues?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                          <p>No issues found! Your writing looks great.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="suggestions">
                    <div className="space-y-3">
                      {analyzeMutation.data.suggestions?.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="vocabulary">
                    <div className="space-y-4">
                      {analyzeMutation.data.vocabularyEnhancements?.map((enhancement, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                              {enhancement.original}
                            </span>
                            <span className="text-muted-foreground">→</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {enhancement.suggestions.map((suggestion, sIdx) => (
                              <Button
                                key={sIdx}
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const regex = new RegExp(`\\b${enhancement.original}\\b`, 'gi');
                                  setText(prev => prev.replace(regex, suggestion));
                                }}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Templates and Tools */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Writing Templates
              </CardTitle>
              <CardDescription>
                Get started with proven structures
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div>Loading templates...</div>
              ) : (
                <div className="space-y-3">
                  {templates?.templates?.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{template.title}</h4>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{template.type}</Badge>
                          {template.tone && (
                            <Badge variant="secondary">{template.tone}</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          {template.structure?.join(" → ")}
                        </div>
                        {template.wordCount && (
                          <div className="text-xs text-muted-foreground mb-3">
                            Target: {template.wordCount.min}-{template.wordCount.max} words
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setText("")}
              >
                Clear Text
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!text.trim()}
              >
                Export as PDF
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={!text.trim()}
              >
                Save Draft
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Use active voice for clearer, more engaging writing</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Vary sentence length to create rhythm and flow</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p>Use specific, concrete examples to support your points</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p>Read your work aloud to catch awkward phrasing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}