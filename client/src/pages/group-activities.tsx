import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Clock,
  Star,
  UserPlus,
  Send,
  BookOpen,
  Target,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupActivity {
  id: number;
  title: string;
  description: string;
  type: "story-writing" | "debate" | "quiz" | "discussion";
  participants: number;
  maxParticipants: number;
  status: "active" | "waiting" | "completed";
  timeRemaining?: number;
  creator: string;
  level: string;
}

interface TeamMember {
  id: number;
  name: string;
  avatar?: string;
  score: number;
  role: "leader" | "member";
}

const GROUP_ACTIVITIES: GroupActivity[] = [
  {
    id: 1,
    title: "Chinese Festival Story Writing",
    description: "Collaborate to write a story about Spring Festival traditions",
    type: "story-writing",
    participants: 3,
    maxParticipants: 4,
    status: "active",
    timeRemaining: 1800, // 30 minutes
    creator: "Teacher Wang",
    level: "intermediate"
  },
  {
    id: 2,
    title: "Technology Debate: Social Media Impact",
    description: "Debate the effects of social media on student life",
    type: "debate",
    participants: 6,
    maxParticipants: 8,
    status: "waiting",
    creator: "Li Ming",
    level: "advanced"
  },
  {
    id: 3,
    title: "Cultural Knowledge Quiz",
    description: "Team quiz about Chinese culture explained in English",
    type: "quiz",
    participants: 4,
    maxParticipants: 6,
    status: "active",
    timeRemaining: 900, // 15 minutes
    creator: "Zhang Wei",
    level: "beginner"
  }
];

const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: "Li Wei", score: 145, role: "leader" },
  { id: 2, name: "Wang Min", score: 132, role: "member" },
  { id: 3, name: "Chen Lu", score: 128, role: "member" },
  { id: 4, name: "Zhang Yu", score: 119, role: "member" }
];

const RECENT_MESSAGES = [
  { id: 1, sender: "Li Wei", message: "I think we should start with the dragon dance description", time: "2 min ago" },
  { id: 2, sender: "Wang Min", message: "Great idea! I'll write about the food traditions", time: "5 min ago" },
  { id: 3, sender: "Chen Lu", message: "Should we include fireworks in our story?", time: "8 min ago" }
];

export default function GroupActivities() {
  const [selectedActivity, setSelectedActivity] = useState<GroupActivity | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "story-writing": return "📝";
      case "debate": return "💬";
      case "quiz": return "🧠";
      case "discussion": return "💭";
      default: return "👥";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-secondary text-secondary-foreground";
      case "waiting": return "bg-accent text-accent-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const joinActivity = (activity: GroupActivity) => {
    setSelectedActivity(activity);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send the message via API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">👥 Group Activities</h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Collaborate with classmates on stories, debates, and challenges to improve your English together
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedActivity ? (
          // Activity Session View
          <div className="space-y-6">
            {/* Activity Header */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                ← Back to Activities
              </Button>
              <div className="flex items-center space-x-4">
                {selectedActivity.timeRemaining && (
                  <div className="flex items-center space-x-2 text-accent font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeRemaining(selectedActivity.timeRemaining)}</span>
                  </div>
                )}
                <Badge className={getStatusColor(selectedActivity.status)}>
                  {selectedActivity.status}
                </Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Activity Area */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">{getActivityIcon(selectedActivity.type)}</span>
                      <span>{selectedActivity.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{selectedActivity.description}</p>
                    
                    {selectedActivity.type === "story-writing" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-semibold mb-2">Story Progress</h4>
                          <div className="bg-white p-4 rounded border min-h-[200px]">
                            <p className="text-muted-foreground italic">
                              The Spring Festival celebration began at dawn, with the sound of firecrackers echoing through the ancient hutongs of Beijing. 
                              Li Ming and his family gathered around the table, where his grandmother had prepared traditional dumplings shaped like golden ingots...
                            </p>
                            <div className="mt-4 p-2 bg-primary/5 rounded border-l-4 border-primary">
                              <p className="text-sm">
                                <strong>Wang Min added:</strong> The dragon dance performers arrived in colorful costumes, 
                                their movements flowing like water as they brought the mythical creature to life in the courtyard.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add your part to the story..."
                            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                          <Button>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedActivity.type === "quiz" && (
                      <div className="space-y-4">
                        <div className="p-6 bg-primary/5 rounded-lg text-center">
                          <h4 className="text-xl font-semibold mb-4">Question 3 of 10</h4>
                          <p className="text-lg mb-6">
                            What is the traditional color associated with good luck in Chinese culture?
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="p-4 h-auto">Red</Button>
                            <Button variant="outline" className="p-4 h-auto">Gold</Button>
                            <Button variant="outline" className="p-4 h-auto">Blue</Button>
                            <Button variant="outline" className="p-4 h-auto">Green</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Team & Chat Sidebar */}
              <div className="space-y-6">
                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Team Members</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {TEAM_MEMBERS.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-1">
                              <p className="text-sm font-medium">{member.name}</p>
                              {member.role === "leader" && <Crown className="h-3 w-3 text-accent" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{member.score} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Live Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Team Chat</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {RECENT_MESSAGES.map((msg) => (
                        <div key={msg.id} className="p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">{msg.sender}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <Button size="sm" onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          // Activities List View
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <p className="text-sm text-muted-foreground">Active Groups</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">145</div>
                  <p className="text-sm text-muted-foreground">Your Team Points</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-secondary">8</div>
                  <p className="text-sm text-muted-foreground">Activities Completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">92%</div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="available" className="space-y-6">
              <TabsList>
                <TabsTrigger value="available">Available Activities</TabsTrigger>
                <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GROUP_ACTIVITIES.map((activity) => (
                    <Card key={activity.id} className="learning-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                            <Badge className="level-intermediate">{activity.level}</Badge>
                          </div>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{activity.description}</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Participants</span>
                            <span>{activity.participants}/{activity.maxParticipants}</span>
                          </div>
                          
                          {activity.timeRemaining && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Time left</span>
                              <span className="text-accent font-medium">
                                {formatTimeRemaining(activity.timeRemaining)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Created by</span>
                            <span>{activity.creator}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-4" 
                          onClick={() => joinActivity(activity)}
                          disabled={activity.participants >= activity.maxParticipants}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {activity.status === "active" ? "Join Activity" : "Join Waitlist"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="my-groups">
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Groups</h3>
                    <p className="text-muted-foreground">
                      Join an activity to start collaborating with other students.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed">
                <Card>
                  <CardContent className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Completed Activities</h3>
                    <p className="text-muted-foreground">
                      Your finished group activities will appear here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
