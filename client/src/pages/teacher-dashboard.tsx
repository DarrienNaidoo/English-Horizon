import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Clock, 
  Award,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  Download,
  PlusCircle,
  Trophy,
  Target
} from "lucide-react";
import { TranslatableText } from "@/components/translation-provider";
import { cn } from "@/lib/utils";
import ClassManagement from "@/components/classroom/class-management";

// Mock classroom data
const CLASSROOM_DATA = {
  totalStudents: 28,
  activeStudents: 24,
  averageProgress: 72,
  completedLessons: 156,
  totalAssignments: 12,
  pendingAssignments: 3,
  classAverage: 85
};

const RECENT_STUDENTS = [
  { id: 1, name: "Li Wei", progress: 85, lastActive: "2 hours ago", level: "Intermediate" },
  { id: 2, name: "Zhang Min", progress: 78, lastActive: "1 day ago", level: "Beginner" },
  { id: 3, name: "Wang Lei", progress: 92, lastActive: "30 minutes ago", level: "Advanced" },
  { id: 4, name: "Chen Xiao", progress: 67, lastActive: "3 hours ago", level: "Intermediate" },
  { id: 5, name: "Liu Yang", progress: 88, lastActive: "1 hour ago", level: "Intermediate" }
];

const ASSIGNMENTS = [
  { id: 1, title: "Mid-Autumn Festival Speaking", dueDate: "Oct 15, 2024", submitted: 18, total: 28, status: "active" },
  { id: 2, title: "Chinese Culture Presentation", dueDate: "Oct 20, 2024", submitted: 8, total: 28, status: "active" },
  { id: 3, title: "Daily Vocabulary Quiz", dueDate: "Oct 12, 2024", submitted: 28, total: 28, status: "completed" }
];

export default function TeacherDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <TranslatableText>Teacher Dashboard</TranslatableText>
          </h1>
          <p className="text-muted-foreground mt-2">
            <TranslatableText>Manage your classroom and track student progress</TranslatableText>
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-primary text-primary-foreground">
            <PlusCircle className="h-4 w-4 mr-2" />
            <TranslatableText>Create Assignment</TranslatableText>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            <TranslatableText>Export Reports</TranslatableText>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Total Students</TranslatableText>
                </p>
                <p className="text-3xl font-bold text-primary">{CLASSROOM_DATA.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TranslatableText>{CLASSROOM_DATA.activeStudents} active today</TranslatableText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Class Average</TranslatableText>
                </p>
                <p className="text-3xl font-bold text-green-600">{CLASSROOM_DATA.classAverage}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TranslatableText>+5% from last week</TranslatableText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Completed Lessons</TranslatableText>
                </p>
                <p className="text-3xl font-bold text-blue-600">{CLASSROOM_DATA.completedLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TranslatableText>This semester</TranslatableText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Pending Assignments</TranslatableText>
                </p>
                <p className="text-3xl font-bold text-orange-600">{CLASSROOM_DATA.pendingAssignments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TranslatableText>Need review</TranslatableText>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="classroom" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="classroom">
            <Trophy className="h-4 w-4 mr-1" />
            <TranslatableText>Class Management</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="students">
            <TranslatableText>Students</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <TranslatableText>Assignments</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TranslatableText>Analytics</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <TranslatableText>Settings</TranslatableText>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText>Recent Student Activity</TranslatableText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_STUDENTS.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          <TranslatableText>{student.level}</TranslatableText> • Last active: {student.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{student.progress}%</p>
                        <Progress value={student.progress} className="w-20" />
                      </div>
                      <Button size="sm" variant="outline">
                        <TranslatableText>View</TranslatableText>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText>Assignment Management</TranslatableText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ASSIGNMENTS.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">
                        <TranslatableText>{assignment.title}</TranslatableText>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        <TranslatableText>Due:</TranslatableText> {assignment.dueDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm">
                          {assignment.submitted}/{assignment.total} <TranslatableText>submitted</TranslatableText>
                        </p>
                        <Progress value={(assignment.submitted / assignment.total) * 100} className="w-24" />
                      </div>
                      <Badge variant={assignment.status === "completed" ? "default" : "secondary"}>
                        <TranslatableText>{assignment.status === "completed" ? "Completed" : "Active"}</TranslatableText>
                      </Badge>
                      <Button size="sm" variant="outline">
                        <TranslatableText>Review</TranslatableText>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <TranslatableText>Class Performance</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>Speaking Skills</TranslatableText></span>
                    <span className="font-semibold">82%</span>
                  </div>
                  <Progress value={82} />
                  
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>Listening Comprehension</TranslatableText></span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <Progress value={78} />
                  
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>Vocabulary</TranslatableText></span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress value={85} />
                  
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>Grammar</TranslatableText></span>
                    <span className="font-semibold">76%</span>
                  </div>
                  <Progress value={76} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <TranslatableText>Weekly Activity</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span><TranslatableText>Lessons Completed</TranslatableText></span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span><TranslatableText>Speaking Exercises</TranslatableText></span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span><TranslatableText>Cultural Activities</TranslatableText></span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span><TranslatableText>AI Conversations</TranslatableText></span>
                    <span className="font-semibold">15</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText>Classroom Settings</TranslatableText>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  <TranslatableText>Assignment Defaults</TranslatableText>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      <TranslatableText>Default Due Date</TranslatableText>
                    </label>
                    <p className="text-sm text-muted-foreground">7 days from creation</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      <TranslatableText>Auto-grading</TranslatableText>
                    </label>
                    <p className="text-sm text-muted-foreground">Enabled for vocabulary and grammar</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  <TranslatableText>Notification Preferences</TranslatableText>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>New submissions</TranslatableText></span>
                    <Badge variant="secondary">Email + App</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>Low participation</TranslatableText></span>
                    <Badge variant="secondary">App only</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><TranslatableText>Weekly reports</TranslatableText></span>
                    <Badge variant="secondary">Email</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}