// Virtual classroom features for group learning
export interface ClassroomSession {
  id: string;
  title: string;
  description: string;
  teacherId: number;
  students: number[];
  status: 'waiting' | 'active' | 'completed';
  startTime: Date;
  endTime?: Date;
  maxStudents: number;
  activities: ClassroomActivity[];
  createdAt: Date;
}

export interface ClassroomActivity {
  id: string;
  type: 'discussion' | 'quiz' | 'presentation' | 'group-work' | 'writing';
  title: string;
  description: string;
  timeLimit?: number;
  isActive: boolean;
  participants: ActivityParticipant[];
  results: ActivityResult[];
}

export interface ActivityParticipant {
  userId: number;
  joinedAt: Date;
  status: 'joined' | 'active' | 'completed';
  role?: 'presenter' | 'moderator' | 'participant';
}

export interface ActivityResult {
  userId: number;
  content: string;
  score?: number;
  feedback?: string;
  submittedAt: Date;
}

export interface GroupProject {
  id: string;
  title: string;
  description: string;
  groupMembers: number[];
  leaderId: number;
  deadline: Date;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  tasks: ProjectTask[];
  submissions: ProjectSubmission[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ProjectSubmission {
  id: string;
  userId: number;
  content: string;
  attachments: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number[];
  ownerId: number;
  isPublic: boolean;
  focusTopics: string[];
  meetingSchedule: string;
  maxMembers: number;
  createdAt: Date;
}

export class VirtualClassroom {
  private sessions: Map<string, ClassroomSession> = new Map();
  private groupProjects: Map<string, GroupProject> = new Map();
  private studyGroups: Map<string, StudyGroup> = new Map();

  // Classroom Session Management
  createSession(
    teacherId: number,
    title: string,
    description: string,
    maxStudents: number = 30
  ): ClassroomSession {
    const sessionId = `session-${Date.now()}-${teacherId}`;
    const session: ClassroomSession = {
      id: sessionId,
      title,
      description,
      teacherId,
      students: [],
      status: 'waiting',
      startTime: new Date(),
      maxStudents,
      activities: [],
      createdAt: new Date()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  joinSession(sessionId: string, studentId: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (session.students.length >= session.maxStudents) return false;
    if (session.students.includes(studentId)) return true;

    session.students.push(studentId);
    return true;
  }

  startSession(sessionId: string, teacherId: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.teacherId !== teacherId) return false;

    session.status = 'active';
    return true;
  }

  addActivity(
    sessionId: string,
    teacherId: number,
    activity: Omit<ClassroomActivity, 'id' | 'participants' | 'results'>
  ): ClassroomActivity | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.teacherId !== teacherId) return null;

    const newActivity: ClassroomActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
      participants: [],
      results: []
    };

    session.activities.push(newActivity);
    return newActivity;
  }

  // Study Group Management
  createStudyGroup(
    ownerId: number,
    name: string,
    description: string,
    focusTopics: string[],
    isPublic: boolean = true,
    maxMembers: number = 10
  ): StudyGroup {
    const groupId = `group-${Date.now()}-${ownerId}`;
    const group: StudyGroup = {
      id: groupId,
      name,
      description,
      members: [ownerId],
      ownerId,
      isPublic,
      focusTopics,
      meetingSchedule: '',
      maxMembers,
      createdAt: new Date()
    };

    this.studyGroups.set(groupId, group);
    return group;
  }

  joinStudyGroup(groupId: string, userId: number): boolean {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    if (group.members.length >= group.maxMembers) return false;
    if (group.members.includes(userId)) return true;

    group.members.push(userId);
    return true;
  }

  // Group Project Management
  createGroupProject(
    leaderId: number,
    title: string,
    description: string,
    groupMembers: number[],
    deadline: Date
  ): GroupProject {
    const projectId = `project-${Date.now()}-${leaderId}`;
    const project: GroupProject = {
      id: projectId,
      title,
      description,
      groupMembers: [leaderId, ...groupMembers.filter(id => id !== leaderId)],
      leaderId,
      deadline,
      status: 'planning',
      tasks: [],
      submissions: []
    };

    this.groupProjects.set(projectId, project);
    return project;
  }

  addTask(
    projectId: string,
    leaderId: number,
    task: Omit<ProjectTask, 'id' | 'status'>
  ): ProjectTask | null {
    const project = this.groupProjects.get(projectId);
    if (!project || project.leaderId !== leaderId) return null;

    const newTask: ProjectTask = {
      ...task,
      id: `task-${Date.now()}`,
      status: 'pending'
    };

    project.tasks.push(newTask);
    return newTask;
  }

  submitWork(
    projectId: string,
    userId: number,
    content: string,
    attachments: string[] = []
  ): ProjectSubmission | null {
    const project = this.groupProjects.get(projectId);
    if (!project || !project.groupMembers.includes(userId)) return null;

    const submission: ProjectSubmission = {
      id: `submission-${Date.now()}-${userId}`,
      userId,
      content,
      attachments,
      submittedAt: new Date()
    };

    project.submissions.push(submission);
    return submission;
  }

  // Real-time Collaboration Features
  createDiscussionActivity(
    sessionId: string,
    teacherId: number,
    topic: string,
    timeLimit: number = 15
  ): ClassroomActivity | null {
    return this.addActivity(sessionId, teacherId, {
      type: 'discussion',
      title: `Discussion: ${topic}`,
      description: `Group discussion about ${topic}`,
      timeLimit,
      isActive: true
    });
  }

  createQuizActivity(
    sessionId: string,
    teacherId: number,
    questions: Array<{ question: string; options: string[]; correct: number }>
  ): ClassroomActivity | null {
    return this.addActivity(sessionId, teacherId, {
      type: 'quiz',
      title: 'Quick Quiz',
      description: `Quiz with ${questions.length} questions`,
      timeLimit: questions.length * 60, // 1 minute per question
      isActive: true
    });
  }

  // Peer Review System
  assignPeerReview(
    projectId: string,
    reviewerId: number,
    targetUserId: number
  ): { success: boolean; message: string } {
    const project = this.groupProjects.get(projectId);
    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    if (!project.groupMembers.includes(reviewerId)) {
      return { success: false, message: 'Reviewer not in project group' };
    }

    const targetSubmission = project.submissions.find(s => s.userId === targetUserId);
    if (!targetSubmission) {
      return { success: false, message: 'No submission found for target user' };
    }

    return { success: true, message: 'Peer review assigned successfully' };
  }

  // Progress Tracking
  getClassroomStats(sessionId: string): {
    totalStudents: number;
    activeStudents: number;
    completedActivities: number;
    averageParticipation: number;
  } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const totalStudents = session.students.length;
    const completedActivities = session.activities.filter(a => !a.isActive).length;
    
    // Calculate active students based on recent activity participation
    const recentActivity = session.activities[session.activities.length - 1];
    const activeStudents = recentActivity?.participants.length || 0;
    
    const averageParticipation = totalStudents > 0 
      ? Math.round((activeStudents / totalStudents) * 100) 
      : 0;

    return {
      totalStudents,
      activeStudents,
      completedActivities,
      averageParticipation
    };
  }

  // Getters
  getSessions(teacherId?: number): ClassroomSession[] {
    const sessions = Array.from(this.sessions.values());
    return teacherId 
      ? sessions.filter(s => s.teacherId === teacherId)
      : sessions;
  }

  getSession(sessionId: string): ClassroomSession | undefined {
    return this.sessions.get(sessionId);
  }

  getStudyGroups(isPublic?: boolean): StudyGroup[] {
    const groups = Array.from(this.studyGroups.values());
    return isPublic !== undefined 
      ? groups.filter(g => g.isPublic === isPublic)
      : groups;
  }

  getUserStudyGroups(userId: number): StudyGroup[] {
    return Array.from(this.studyGroups.values())
      .filter(g => g.members.includes(userId));
  }

  getGroupProjects(userId?: number): GroupProject[] {
    const projects = Array.from(this.groupProjects.values());
    return userId 
      ? projects.filter(p => p.groupMembers.includes(userId))
      : projects;
  }

  getGroupProject(projectId: string): GroupProject | undefined {
    return this.groupProjects.get(projectId);
  }
}

export const virtualClassroom = new VirtualClassroom();