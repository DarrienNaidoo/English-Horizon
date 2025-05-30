import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, RotateCcw, Target, Volume2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function SpeechRecognition() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["/api/speech-recognition/exercises"],
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/speech-recognition/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/speech-recognition/exercises"] });
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const analyzeRecording = () => {
    if (audioBlob && selectedExercise) {
      analyzeMutation.mutate({
        audioData: "base64_audio_data",
        targetText: selectedExercise.targetWords?.join(" ") || selectedExercise.targetSentences?.join(" "),
      });
    }
  };

  const playNativeAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading speech exercises...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Speech Recognition & Pronunciation
        </h1>
        <p className="text-muted-foreground">
          Practice pronunciation with AI-powered feedback and accent training
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Exercises</h2>
          {exercises?.exercises?.map((exercise) => (
            <Card 
              key={exercise.id} 
              className={`cursor-pointer transition-all ${
                selectedExercise?.id === exercise.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{exercise.title}</CardTitle>
                <Badge variant="outline">{exercise.difficulty}</Badge>
              </CardHeader>
              <CardContent>
                {exercise.targetWords && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Target Words:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetWords.map((word, idx) => (
                        <Badge key={idx} variant="secondary">{word}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {exercise.targetSentences && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Practice Sentences:</p>
                    {exercise.targetSentences.map((sentence, idx) => (
                      <p key={idx} className="text-sm italic">"{sentence}"</p>
                    ))}
                  </div>
                )}
                {exercise.nativeAudio && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      playNativeAudio(exercise.nativeAudio);
                    }}
                    className="mt-2"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen to Native
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recording Interface */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Record Your Practice</h2>
          
          {selectedExercise ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {selectedExercise.title}
                </CardTitle>
                <CardDescription>
                  Practice the highlighted content below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  {selectedExercise.targetWords && (
                    <div className="space-y-2">
                      <p className="font-medium">Say these words clearly:</p>
                      <div className="text-lg font-mono">
                        {selectedExercise.targetWords.join(" • ")}
                      </div>
                      {selectedExercise.phonetics && (
                        <div className="text-sm text-muted-foreground">
                          Phonetics: {selectedExercise.phonetics.join(" • ")}
                        </div>
                      )}
                    </div>
                  )}
                  {selectedExercise.targetSentences && (
                    <div className="space-y-2">
                      <p className="font-medium">Read these sentences:</p>
                      {selectedExercise.targetSentences.map((sentence, idx) => (
                        <p key={idx} className="text-lg">{sentence}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="min-w-32"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  {audioBlob && (
                    <Button onClick={analyzeRecording} disabled={analyzeMutation.isPending}>
                      {analyzeMutation.isPending ? "Analyzing..." : "Analyze Speech"}
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Recording in progress...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Select an exercise to start practicing
              </CardContent>
            </Card>
          )}
        </div>

        {/* Feedback Display */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Feedback</h2>
          
          {analyzeMutation.data ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Analysis Results
                  <Badge variant={analyzeMutation.data.accuracy >= 80 ? "success" : "warning"}>
                    {analyzeMutation.data.accuracy}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pronunciation</span>
                      <span>{analyzeMutation.data.feedback.pronunciation.score}%</span>
                    </div>
                    <Progress value={analyzeMutation.data.feedback.pronunciation.score} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fluency</span>
                      <span>{analyzeMutation.data.feedback.fluency.score}%</span>
                    </div>
                    <Progress value={analyzeMutation.data.feedback.fluency.score} className="h-2" />
                  </div>
                </div>

                {analyzeMutation.data.feedback.pronunciation.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                    <ul className="text-sm space-y-1">
                      {analyzeMutation.data.feedback.pronunciation.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analyzeMutation.data.feedback.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Practice Suggestions:</h4>
                    <ul className="text-sm space-y-1">
                      {analyzeMutation.data.feedback.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analyzeMutation.data.detailedAnalysis?.wordScores && (
                  <div>
                    <h4 className="font-medium mb-2">Word-by-Word Analysis:</h4>
                    <div className="space-y-2">
                      {analyzeMutation.data.detailedAnalysis.wordScores.map((wordScore, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="font-mono">{wordScore.word}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={wordScore.score >= 80 ? "success" : "warning"}>
                              {wordScore.score}%
                            </Badge>
                            {wordScore.issues.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ({wordScore.issues.join(", ")})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => {
                    setAudioBlob(null);
                    analyzeMutation.reset();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Record your speech to receive AI-powered feedback
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}