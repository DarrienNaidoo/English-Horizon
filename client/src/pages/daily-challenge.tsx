import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, CheckCircle, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyChallenge } from "@shared/schema";

export default function DailyChallenePage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isRecording, setIsRecording] = useState(false);

  const { data: challenge, isLoading } = useQuery<DailyChallenge>({
    queryKey: ["/api/daily-challenge"],
  });

  const handleStartChallenge = () => {
    setIsStarted(true);
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (response.trim().length >= 100) {
      setIsCompleted(true);
      // In a real app, would submit to API
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, would handle speech-to-text
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Challenge Available</h3>
            <p className="text-muted-foreground">Check back tomorrow for a new challenge!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🎯 Daily Challenge</h1>
            <p className="text-blue-100 text-lg">
              Complete today's challenge to earn XP and improve your skills
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isStarted ? (
          // Challenge Preview
          <Card className="learning-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                <Badge className="level-badge">
                  +{challenge.xpReward} XP
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg mb-6">
                {challenge.description}
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Challenge Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Time Limit: {Math.floor(challenge.completionRequirement.timeLimit / 60)} minutes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>Minimum {challenge.completionRequirement.minWords} words required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mic className="h-5 w-5 text-primary" />
                      <span>Speaking challenge: {challenge.content.difficulty} level</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Instructions</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {challenge.content.prompt}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleStartChallenge}
                className="w-full gamified-button"
                size="lg"
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>
        ) : isCompleted ? (
          // Completion Screen
          <Card className="cyber-card text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Challenge Completed!</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Congratulations! You've earned {challenge.xpReward} XP points.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{response.split(' ').length}</div>
                  <div className="text-sm text-muted-foreground">Words Written</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{challenge.xpReward}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{formatTime(300 - timeLeft)}</div>
                  <div className="text-sm text-muted-foreground">Time Used</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="gamified-button"
                >
                  Return to Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/learning-paths'}
                  variant="outline"
                  className="gamified-button"
                >
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Active Challenge
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Challenge Progress</h3>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className={cn(
                      timeLeft < 60 ? "border-red-500 text-red-500" : "border-primary text-primary"
                    )}>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(timeLeft)}
                    </Badge>
                    <Badge variant="outline">
                      {response.split(' ').filter(word => word.length > 0).length} / {challenge.completionRequirement.minWords} words
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(response.split(' ').filter(word => word.length > 0).length / challenge.completionRequirement.minWords) * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Challenge Content */}
            <Card className="learning-card">
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
                <p className="text-muted-foreground">{challenge.content.prompt}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="response" className="text-sm font-medium">
                      Your Response
                    </label>
                    <Button
                      onClick={toggleRecording}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "transition-colors",
                        isRecording ? "bg-red-100 border-red-300 text-red-700" : ""
                      )}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? "Stop Recording" : "Voice Input"}
                    </Button>
                  </div>
                  
                  <Textarea
                    id="response"
                    placeholder="Start writing your response here..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="min-h-[200px] text-base"
                  />
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Write at least {challenge.completionRequirement.minWords} words to complete the challenge
                    </p>
                    <Button
                      onClick={handleSubmit}
                      disabled={response.split(' ').filter(word => word.length > 0).length < challenge.completionRequirement.minWords}
                      className="gamified-button"
                    >
                      Submit Challenge
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}