import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Play, Pause, RotateCcw, Volume2, Star, Clock, Users } from "lucide-react";

export default function SpeakingZone() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const speakingExercises = [
    {
      id: "pronunciation",
      title: "Pronunciation Practice",
      description: "Practice individual sounds and word pronunciation",
      difficulty: "Beginner",
      duration: 10,
      exercises: [
        { word: "Hello", phonetic: "/həˈloʊ/", difficulty: "easy" },
        { word: "Beautiful", phonetic: "/ˈbjuːtɪfəl/", difficulty: "medium" },
        { word: "Pronunciation", phonetic: "/prəˌnʌnsiˈeɪʃən/", difficulty: "hard" },
      ]
    },
    {
      id: "conversation",
      title: "Daily Conversations",
      description: "Practice real-world conversation scenarios",
      difficulty: "Intermediate",
      duration: 15,
      scenarios: [
        "Introducing yourself to a classmate",
        "Ordering food at a restaurant",
        "Asking for directions",
      ]
    },
    {
      id: "storytelling",
      title: "Cultural Storytelling",
      description: "Tell stories about Chinese culture in English",
      difficulty: "Advanced",
      duration: 20,
      topics: [
        "Describe Chinese New Year traditions",
        "Explain your favorite Chinese festival",
        "Share a family tradition",
      ]
    }
  ];

  const aiDebateTopics = [
    {
      topic: "Social Media Impact on Teenagers",
      description: "Discuss the positive and negative effects of social media",
      difficulty: "Intermediate",
      participants: 3,
    },
    {
      topic: "Traditional vs Modern Education",
      description: "Compare traditional Chinese education with modern methods",
      difficulty: "Advanced",
      participants: 5,
    },
    {
      topic: "Environmental Protection in Cities",
      description: "Debate solutions for urban environmental challenges",
      difficulty: "Intermediate",
      participants: 4,
    }
  ];

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Stop after 30 seconds for demo
      setTimeout(() => {
        setIsRecording(false);
        setRecordingTime(0);
        clearInterval(timer);
      }, 30000);
    } else {
      setRecordingTime(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-custom mb-2">Speaking Zone</h1>
        <p className="text-medium-custom text-lg">Improve your English pronunciation and speaking confidence</p>
      </div>

      {/* Recording Interface */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center">
              <Mic className="text-white" />
            </div>
            <div>
              <h2 className="text-xl">AI Speech Assistant</h2>
              <p className="text-sm text-medium-custom font-normal">Get instant feedback on your pronunciation</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="mb-6">
              <Button
                onClick={toggleRecording}
                size="lg"
                className={`w-24 h-24 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-primary-custom hover:bg-blue-600'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
              </h3>
              {isRecording && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-mono">{recordingTime}s</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline" disabled={!isRecording}>
                <Play className="w-4 h-4 mr-2" />
                Playback
              </Button>
              <Button variant="outline" disabled={!isRecording}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speaking Exercises */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-custom mb-6">Speaking Exercises</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {speakingExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedExercise === exercise.id ? 'ring-2 ring-primary-custom' : ''
              }`}
              onClick={() => setSelectedExercise(exercise.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={
                      exercise.difficulty === 'Beginner' ? 'text-green-600 border-green-600' :
                      exercise.difficulty === 'Intermediate' ? 'text-blue-600 border-blue-600' :
                      'text-purple-600 border-purple-600'
                    }
                  >
                    {exercise.difficulty}
                  </Badge>
                </div>
                <p className="text-medium-custom text-sm">{exercise.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-medium-custom" />
                    <span className="text-sm text-medium-custom">{exercise.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent-custom" />
                    <span className="text-sm text-medium-custom">+{exercise.duration * 5} XP</span>
                  </div>
                </div>
                
                {exercise.id === 'pronunciation' && (
                  <div className="space-y-2">
                    <p className="text-xs text-medium-custom font-medium">Sample words:</p>
                    {exercise.exercises?.slice(0, 2).map((ex, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{ex.word}</span>
                        <span className="text-medium-custom">{ex.phonetic}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button className="w-full mt-4">
                  <Play className="w-4 h-4 mr-2" />
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Debate Sessions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark-custom mb-6">AI Debate Sessions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiDebateTopics.map((topic, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{topic.topic}</CardTitle>
                <p className="text-medium-custom text-sm">{topic.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="outline"
                    className={
                      topic.difficulty === 'Intermediate' ? 'text-blue-600 border-blue-600' :
                      'text-purple-600 border-purple-600'
                    }
                  >
                    {topic.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-medium-custom" />
                    <span className="text-sm text-medium-custom">{topic.participants} participants</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Join Debate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Speaking Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pronunciation Accuracy</span>
                <span className="text-sm text-medium-custom">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Speaking Fluency</span>
                <span className="text-sm text-medium-custom">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Vocabulary Usage</span>
                <span className="text-sm text-medium-custom">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-custom">47</div>
              <div className="text-sm text-medium-custom">Minutes Practiced</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-custom">12</div>
              <div className="text-sm text-medium-custom">Exercises Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-custom">3</div>
              <div className="text-sm text-medium-custom">Debates Joined</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cultural-custom">580</div>
              <div className="text-sm text-medium-custom">XP Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
