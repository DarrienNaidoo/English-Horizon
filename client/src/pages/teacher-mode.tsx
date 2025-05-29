import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Play, Pause, RotateCcw, Timer, 
  Presentation, Volume2, VolumeX, Settings, 
  ChevronDown, Monitor, Mic, MessageSquare,
  Trophy, Star, Clock, Eye, EyeOff
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { User, Lesson } from "@shared/schema";

export default function TeacherMode() {
  const [currentUserId] = useLocalStorage("currentUserId", 1);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isProjectionMode, setIsProjectionMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [groupCode] = useState("SPEAK2025");

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  // Mock group data - in real app this would come from API
  const groupStudents = [
    { id: 1, name: "李明 (Li Ming)", level: 3, online: true, progress: 85 },
    { id: 2, name: "张三 (Zhang San)", level: 2, online: true, progress: 72 },
    { id: 3, name: "王丽 (Wang Li)", level: 3, online: false, progress: 91 },
    { id: 4, name: "陈伟 (Chen Wei)", level: 2, online: true, progress: 68 },
    { id: 5, name: "刘红 (Liu Hong)", level: 1, online: true, progress: 45 },
  ];

  const groupActivities = [
    {
      id: "debate-social-media",
      title: "Debate: Social Media Impact",
      type: "debate",
      participants: 4,
      timeLimit: 15,
      status: "ready"
    },
    {
      id: "vocabulary-quiz",
      title: "Cultural Vocabulary Quiz",
      type: "quiz",
      participants: 6,
      timeLimit: 10,
      status: "ready"
    },
    {
      id: "pronunciation-practice",
      title: "Group Pronunciation Practice",
      type: "speaking",
      participants: 8,
      timeLimit: 20,
      status: "ready"
    }
  ];

  const startActivity = (activityId: string) => {
    setActiveActivity(activityId);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const pauseActivity = () => {
    setIsTimerRunning(false);
  };

  const resetActivity = () => {
    setActiveActivity(null);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const toggleProjection = () => {
    setIsProjectionMode(!isProjectionMode);
    if (!isProjectionMode) {
      // Request fullscreen when entering projection mode
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isProjectionMode ? 'teacher-mode' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-custom mb-2">
              Teacher Control Panel 👨‍🏫
            </h1>
            <p className="text-medium-custom text-lg">Manage classroom activities and monitor student progress</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <Badge variant="outline" className="text-primary-custom border-primary-custom px-4 py-2">
              Class Code: {groupCode}
            </Badge>
            <Button
              onClick={toggleProjection}
              className={`${isProjectionMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              <Monitor className="w-4 h-4 mr-2" />
              {isProjectionMode ? 'Exit Projection' : 'Projection Mode'}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Activity Control */}
      {activeActivity && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center">
                  <Play className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {groupActivities.find(a => a.id === activeActivity)?.title}
                  </CardTitle>
                  <p className="text-medium-custom">Activity in progress</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-custom">{formatTime(timer)}</div>
                  <div className="text-sm text-medium-custom">Elapsed Time</div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={pauseActivity}
                    disabled={!isTimerRunning}
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsTimerRunning(true)}
                    disabled={isTimerRunning}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={resetActivity}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-medium-custom" />
                  <span>4 students participating</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="flex items-center space-x-2"
                >
                  {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showAnswers ? 'Hide Answers' : 'Show Answers'}</span>
                </Button>
              </div>
              
              <Button variant="destructive" onClick={resetActivity}>
                End Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Group Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Presentation className="text-primary-custom" />
                <span>Group Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      activeActivity === activity.id 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-dark-custom mb-1">{activity.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-medium-custom">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Max {activity.participants} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Timer className="w-4 h-4" />
                            <span>{activity.timeLimit} min</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {activeActivity === activity.id ? (
                          <Button variant="outline" onClick={resetActivity}>
                            Stop
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => startActivity(activity.id)}
                            className="bg-primary-custom hover:bg-blue-600"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Quick Start Activities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Mic className="w-4 h-4 mr-2" />
                    Quick Pronunciation Check
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Vocabulary Flash Cards
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Lesson for Class */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Today's Class Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons && lessons[0] && (
                <div className="flex items-start space-x-4">
                  <img 
                    src={lessons[0].imageUrl || ""} 
                    alt="Lesson preview" 
                    className="w-24 h-24 object-cover rounded-lg" 
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-dark-custom mb-2">
                      {lessons[0].title}
                    </h4>
                    <p className="text-medium-custom text-sm mb-3">
                      {lessons[0].description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-medium-custom" />
                        <span className="text-sm">{lessons[0].duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-accent-custom" />
                        <span className="text-sm">+{lessons[0].xpReward} XP</span>
                      </div>
                      <Badge variant="outline">{lessons[0].category}</Badge>
                    </div>
                  </div>
                  <Button className="bg-primary-custom hover:bg-blue-600">
                    Assign to Class
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student List & Progress */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="text-secondary-custom" />
                  <span>Class Students</span>
                </div>
                <Badge variant="outline">{groupStudents.length} students</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        student.online ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <div className="font-medium text-dark-custom text-sm">
                          {student.name}
                        </div>
                        <div className="text-xs text-medium-custom">
                          Level {student.level}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-dark-custom">
                        {student.progress}%
                      </div>
                      <div className="w-16">
                        <Progress value={student.progress} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  Class Average Progress
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={72} className="flex-1 h-2" />
                  <span className="text-sm font-medium text-blue-900">72%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  Award Badges
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Class Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio Controls
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}