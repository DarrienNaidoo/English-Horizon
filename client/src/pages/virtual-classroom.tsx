import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, ClipboardList, TrendingUp, Calendar, Clock, FileText, CheckCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function VirtualClassroom() {
  const [userRole, setUserRole] = useState("teacher"); // teacher or student
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/classroom/assignments"],
  });

  const { data: studentProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/classroom/student-progress"],
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/classroom/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classroom/assignments"] });
    },
  });

  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  const TeacherDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {assignments?.assignments?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {studentProgress?.students?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Avg. Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {assignments?.assignments ? 
                Math.round(assignments.assignments.reduce((acc, a) => acc + (a.submissions / a.totalStudents * 100), 0) / assignments.assignments.length) 
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Assignment completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="create">Create Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <div className="space-y-4">
            {assignments?.assignments?.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {assignment.title}
                      </CardTitle>
                      <CardDescription>{assignment.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{assignment.subject}</Badge>
                      <Badge variant="secondary">{assignment.difficulty}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(assignment.dueDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submissions</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.submissions}/{assignment.totalStudents}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Avg. Score</p>
                      <p className={`text-sm font-medium ${getCompletionColor(assignment.averageScore || 0)}`}>
                        {assignment.averageScore || "N/A"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completion</p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(assignment.submissions / assignment.totalStudents) * 100} 
                          className="flex-1 h-2"
                        />
                        <span className="text-xs">
                          {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Submissions</Button>
                    <Button size="sm" variant="outline">Send Reminder</Button>
                    <Button size="sm" variant="outline">Grade</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentProgress?.students?.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <Badge variant="outline">{student.level}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Completed</p>
                      <p className="text-muted-foreground">
                        {student.completedAssignments}/{student.totalAssignments}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Avg. Score</p>
                      <p className={`font-medium ${getCompletionColor(student.averageScore)}`}>
                        {student.averageScore}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-2">Progress</p>
                    <Progress 
                      value={(student.completedAssignments / student.totalAssignments) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium text-green-600">Strengths</p>
                      <div className="space-y-1">
                        {student.strengths.map((strength, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Needs Work</p>
                      <div className="space-y-1">
                        {student.weaknesses.map((weakness, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last active: {formatDate(student.lastActive)}
                  </div>

                  <Button size="sm" className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>
                Design a new assignment for your students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Assignment title" />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Describe what students need to do..."
                  className="min-h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <label className="text-sm font-medium">Points</label>
                  <Input type="number" placeholder="100" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Instructions</label>
                <Textarea 
                  placeholder="Detailed instructions for students..."
                  className="min-h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Create Assignment</Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (assignmentsLoading || progressLoading) {
    return <div className="flex justify-center p-8">Loading classroom data...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Virtual Classroom
          </h1>
          <p className="text-muted-foreground">
            Manage assignments and track student progress
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={userRole === "teacher" ? "default" : "outline"}
            onClick={() => setUserRole("teacher")}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Teacher View
          </Button>
          <Button 
            variant={userRole === "student" ? "default" : "outline"}
            onClick={() => setUserRole("student")}
          >
            <Users className="w-4 h-4 mr-2" />
            Student View
          </Button>
        </div>
      </div>

      {userRole === "teacher" && <TeacherDashboard />}
      
      {userRole === "student" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments?.assignments?.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    {assignment.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{assignment.subject}</Badge>
                    <Badge variant="secondary">{assignment.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">Start Assignment</Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}