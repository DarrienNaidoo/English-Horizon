import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Video, 
  MessageSquare,
  BookOpen,
  Calendar,
  UserPlus,
  Settings,
  Award,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassroomSession {
  id: string;
  title: string;
  description: string;
  teacherId: number;
  students: number[];
  status: 'waiting' | 'active' | 'completed';
  startTime: Date;
  maxStudents: number;
  activities: any[];
  createdAt: Date;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number[];
  ownerId: number;
  isPublic: boolean;
  focusTopics: string[];
  maxMembers: number;
  createdAt: Date;
}

interface GroupProject {
  id: string;
  title: string;
  description: string;
  groupMembers: number[];
  leaderId: number;
  deadline: Date;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  tasks: any[];
  submissions: any[];
}

const CURRENT_USER_ID = 1;

export default function VirtualClassroom() {
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionDescription, setNewSessionDescription] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupTopics, setNewGroupTopics] = useState("");
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: sessions } = useQuery<ClassroomSession[]>({
    queryKey: ["/api/classroom/sessions"],
  });

  const { data: studyGroups } = useQuery<StudyGroup[]>({
    queryKey: ["/api/classroom/study-groups"],
    queryFn: () => fetch("/api/classroom/study-groups?isPublic=true").then(res => res.json()),
  });

  const { data: myGroups } = useQuery<StudyGroup[]>({
    queryKey: ["/api/classroom/study-groups", "mine"],
    queryFn: () => fetch(`/api/classroom/study-groups?userId=${CURRENT_USER_ID}`).then(res => res.json()),
  });

  const { data: projects } = useQuery<GroupProject[]>({
    queryKey: ["/api/classroom/projects"],
    queryFn: () => fetch(`/api/classroom/projects?userId=${CURRENT_USER_ID}`).then(res => res.json()),
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const response = await fetch('/api/classroom/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: CURRENT_USER_ID,
          title: data.title,
          description: data.description,
          maxStudents: 30
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classroom/sessions"] });
      setIsCreateSessionOpen(false);
      setNewSessionTitle("");
      setNewSessionDescription("");
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; topics: string[] }) => {
      const response = await fetch('/api/classroom/study-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: CURRENT_USER_ID,
          name: data.name,
          description: data.description,
          focusTopics: data.topics,
          isPublic: true,
          maxMembers: 10
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classroom/study-groups"] });
      setIsCreateGroupOpen(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupTopics("");
    },
  });

  const joinSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/classroom/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: CURRENT_USER_ID }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classroom/sessions"] });
    },
  });

  const handleCreateSession = () => {
    if (newSessionTitle.trim() && newSessionDescription.trim()) {
      createSessionMutation.mutate({
        title: newSessionTitle,
        description: newSessionDescription
      });
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() && newGroupDescription.trim()) {
      const topics = newGroupTopics.split(',').map(t => t.trim()).filter(t => t.length > 0);
      createGroupMutation.mutate({
        name: newGroupName,
        description: newGroupDescription,
        topics
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Virtual Classroom</h1>
          <p className="text-white/80">
            Join live sessions, collaborate in study groups, and work on group projects
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
            <TabsTrigger value="projects">Group Projects</TabsTrigger>
          </TabsList>

          {/* Live Sessions Tab */}
          <TabsContent value="sessions">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Live Sessions</h2>
                <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Session Title</label>
                        <Input
                          value={newSessionTitle}
                          onChange={(e) => setNewSessionTitle(e.target.value)}
                          placeholder="Enter session title..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={newSessionDescription}
                          onChange={(e) => setNewSessionDescription(e.target.value)}
                          placeholder="Describe what this session will cover..."
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateSession}
                        disabled={createSessionMutation.isPending}
                        className="w-full"
                      >
                        {createSessionMutation.isPending ? 'Creating...' : 'Create Session'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions?.map((session) => (
                  <Card key={session.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <Badge className={cn("text-white", getStatusColor(session.status))}>
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{session.students.length}/{session.maxStudents}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(session.startTime).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => joinSessionMutation.mutate(session.id)}
                          disabled={session.students.includes(CURRENT_USER_ID) || session.students.length >= session.maxStudents}
                          className="flex-1"
                        >
                          {session.students.includes(CURRENT_USER_ID) ? (
                            <>
                              <Video className="h-4 w-4 mr-2" />
                              Joined
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Join
                            </>
                          )}
                        </Button>
                        {session.teacherId === CURRENT_USER_ID && (
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="groups">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Study Groups</h2>
                <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Study Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Group Name</label>
                        <Input
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Enter group name..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={newGroupDescription}
                          onChange={(e) => setNewGroupDescription(e.target.value)}
                          placeholder="What will this group focus on?"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Focus Topics</label>
                        <Input
                          value={newGroupTopics}
                          onChange={(e) => setNewGroupTopics(e.target.value)}
                          placeholder="grammar, speaking, business english (comma separated)"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateGroup}
                        disabled={createGroupMutation.isPending}
                        className="w-full"
                      >
                        {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* My Groups */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">My Groups</h3>
                  <div className="space-y-4">
                    {myGroups?.map((group) => (
                      <Card key={group.id}>
                        <CardHeader>
                          <CardTitle className="text-base">{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {group.focusTopics.map((topic, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {group.members.length} members
                            </span>
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Open
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Public Groups */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Join Public Groups</h3>
                  <div className="space-y-4">
                    {studyGroups?.filter(g => !g.members.includes(CURRENT_USER_ID)).map((group) => (
                      <Card key={group.id}>
                        <CardHeader>
                          <CardTitle className="text-base">{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {group.focusTopics.map((topic, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {group.members.length}/{group.maxMembers} members
                            </span>
                            <Button size="sm" disabled={group.members.length >= group.maxMembers}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Group Projects Tab */}
          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Group Projects</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{project.groupMembers.length} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        {project.leaderId === CURRENT_USER_ID && (
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}