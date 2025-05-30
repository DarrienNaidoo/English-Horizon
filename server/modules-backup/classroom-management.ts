// Teacher and student mode with classroom management
export interface TeacherProfile {
  userId: number;
  teacherCode: string;
  schoolName: string;
  certification: string[];
  experience: number; // years
  specializations: string[];
  classrooms: string[];
  totalStudents: number;
  createdAt: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Classroom {
  id: string;
  teacherId: number;
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  academicYear: string;
  students: ClassroomStudent[];
  inviteCode: string;
  maxStudents: number;
  isActive: boolean;
  settings: ClassroomSettings;
  assignments: ClassroomAssignment[];
  announcements: Announcement[];
  schedule: ClassSchedule[];
  createdAt: Date;
}

export interface ClassroomStudent {
  userId: number;
  studentId: string;
  displayName: string;
  joinedAt: Date;
  lastActive: Date;
  progress: StudentProgress;
  permissions: StudentPermissions;
  parentEmail?: string;
  notes: string;
}

export interface StudentProgress {
  currentLevel: string;
  lessonsCompleted: number;
  averageScore: number;
  timeSpent: number; // minutes
  assignmentsCompleted: number;
  attendanceRate: number;
  lastAssessment: Date;
  strengths: string[];
  needsImprovement: string[];
}

export interface StudentPermissions {
  canAccessForum: boolean;
  canSubmitAssignments: boolean;
  canViewGrades: boolean;
  canParticipateInGroup: boolean;
  restrictedFeatures: string[];
}

export interface ClassroomSettings {
  allowStudentInteraction: boolean;
  requireApprovalForPosts: boolean;
  enableRealTimeView: boolean;
  allowSelfPacing: boolean;
  gradingSystem: 'points' | 'percentage' | 'letter' | 'pass_fail';
  languageRestrictions: string[];
  contentFiltering: boolean;
  parentNotifications: boolean;
  allowVoiceRecording: boolean;
  projectionMode: boolean;
}

export interface ClassroomAssignment {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  type: 'homework' | 'quiz' | 'project' | 'practice' | 'assessment';
  instructions: string[];
  resources: AssignmentResource[];
  dueDate: Date;
  totalPoints: number;
  estimatedTime: number; // minutes
  difficulty: string;
  tags: string[];
  submissions: AssignmentSubmission[];
  rubric?: GradingRubric;
  isPublished: boolean;
  allowLateSubmission: boolean;
  maxAttempts: number;
  createdAt: Date;
}

export interface AssignmentResource {
  type: 'document' | 'video' | 'audio' | 'link' | 'exercise';
  title: string;
  url?: string;
  content?: string;
  description: string;
  required: boolean;
  duration?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: number;
  content: string;
  attachments: SubmissionAttachment[];
  submittedAt: Date;
  isLate: boolean;
  attempts: number;
  score?: number;
  feedback?: TeacherFeedback;
  status: 'submitted' | 'graded' | 'returned' | 'draft';
}

export interface SubmissionAttachment {
  id: string;
  type: 'text' | 'audio' | 'image' | 'document';
  filename: string;
  url: string;
  size: number;
  description?: string;
}

export interface TeacherFeedback {
  teacherId: number;
  score: number;
  maxScore: number;
  rubricScores?: { [criterion: string]: number };
  comments: FeedbackComment[];
  suggestions: string[];
  strengths: string[];
  areasForImprovement: string[];
  gradedAt: Date;
  isPublic: boolean;
}

export interface FeedbackComment {
  id: string;
  position?: number; // character position in text
  type: 'praise' | 'correction' | 'suggestion' | 'question';
  comment: string;
  category: string;
  resolved: boolean;
}

export interface GradingRubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
  totalPoints: number;
  description: string;
}

export interface RubricCriterion {
  name: string;
  description: string;
  weight: number; // percentage
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
  indicators: string[];
}

export interface Announcement {
  id: string;
  classroomId: string;
  teacherId: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'students' | 'parents' | 'specific';
  specificStudents?: number[];
  attachments: AnnouncementAttachment[];
  readBy: number[];
  scheduledFor?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface AnnouncementAttachment {
  type: 'document' | 'image' | 'link';
  title: string;
  url: string;
  description?: string;
}

export interface ClassSchedule {
  id: string;
  classroomId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
  endTime: string;
  subject: string;
  room?: string;
  isRecurring: boolean;
  notes?: string;
}

export interface TeacherDashboard {
  teacherId: number;
  classrooms: ClassroomSummary[];
  todaySchedule: ClassSchedule[];
  pendingSubmissions: number;
  recentActivity: DashboardActivity[];
  announcements: number;
  studentProgress: ProgressSummary[];
  upcomingDeadlines: UpcomingDeadline[];
}

export interface ClassroomSummary {
  id: string;
  name: string;
  studentCount: number;
  activeStudents: number;
  averageProgress: number;
  pendingAssignments: number;
  lastActivity: Date;
}

export interface DashboardActivity {
  type: 'submission' | 'login' | 'completion' | 'question';
  studentId: number;
  studentName: string;
  description: string;
  timestamp: Date;
  urgent: boolean;
}

export interface ProgressSummary {
  classroomId: string;
  classroomName: string;
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  strugglingStudents: number;
  topPerformers: number;
}

export interface UpcomingDeadline {
  assignmentId: string;
  assignmentTitle: string;
  classroomName: string;
  dueDate: Date;
  submissionCount: number;
  totalStudents: number;
}

export interface StudentMode {
  userId: number;
  currentClassroom?: string;
  focusMode: boolean;
  parentalControls: ParentalControls;
  learningPath: LearningPathProgress;
  dailyGoals: DailyGoal[];
  recentActivities: StudentActivity[];
}

export interface ParentalControls {
  enabled: boolean;
  restrictedHours: TimeSlot[];
  allowedFeatures: string[];
  blockedFeatures: string[];
  timeLimit: number; // minutes per day
  requireApproval: string[];
  progressReports: 'daily' | 'weekly' | 'monthly';
  parentEmail: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  days: number[]; // 0-6 for days of week
}

export interface LearningPathProgress {
  currentUnit: string;
  completedLessons: string[];
  currentLesson?: string;
  nextRecommended: string[];
  overallProgress: number;
  estimatedTimeToComplete: number; // hours
}

export interface DailyGoal {
  type: 'lessons' | 'exercises' | 'time' | 'score';
  target: number;
  current: number;
  description: string;
  points: number;
  completed: boolean;
}

export interface StudentActivity {
  type: 'lesson' | 'exercise' | 'assignment' | 'quiz';
  title: string;
  score?: number;
  timeSpent: number;
  completed: boolean;
  timestamp: Date;
}

export interface ProjectionMode {
  isActive: boolean;
  classroomId: string;
  currentContent: ProjectionContent;
  connectedDevices: ConnectedDevice[];
  settings: ProjectionSettings;
}

export interface ProjectionContent {
  type: 'lesson' | 'exercise' | 'quiz' | 'announcement' | 'student_work';
  content: any;
  title: string;
  description: string;
  interactive: boolean;
}

export interface ConnectedDevice {
  deviceId: string;
  deviceType: 'tablet' | 'phone' | 'laptop';
  studentId: number;
  studentName: string;
  isActive: boolean;
  lastSeen: Date;
}

export interface ProjectionSettings {
  allowStudentControl: boolean;
  showStudentNames: boolean;
  enableRealTimePolling: boolean;
  autoAdvance: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'high-contrast';
}

export class ClassroomManagementSystem {
  private teacherProfiles: Map<number, TeacherProfile> = new Map();
  private classrooms: Map<string, Classroom> = new Map();
  private assignments: Map<string, ClassroomAssignment> = new Map();
  private submissions: Map<string, AssignmentSubmission> = new Map();
  private studentModes: Map<number, StudentMode> = new Map();
  private projectionModes: Map<string, ProjectionMode> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample teacher profile
    const teacherProfile: TeacherProfile = {
      userId: 1,
      teacherCode: 'TCH001',
      schoolName: 'International Language Academy',
      certification: ['TESOL', 'CELTA'],
      experience: 8,
      specializations: ['Business English', 'Academic Writing', 'Conversation'],
      classrooms: ['class-001'],
      totalStudents: 25,
      createdAt: new Date('2023-09-01'),
      verificationStatus: 'verified'
    };

    this.teacherProfiles.set(1, teacherProfile);

    // Sample classroom
    const classroom: Classroom = {
      id: 'class-001',
      teacherId: 1,
      name: 'Intermediate English - Morning Class',
      description: 'Comprehensive English course for intermediate level students',
      subject: 'English Language Learning',
      gradeLevel: 'Intermediate',
      academicYear: '2024-2025',
      students: [
        {
          userId: 2,
          studentId: 'STU001',
          displayName: 'Li Wei',
          joinedAt: new Date('2023-09-15'),
          lastActive: new Date(),
          progress: {
            currentLevel: 'Intermediate',
            lessonsCompleted: 24,
            averageScore: 85,
            timeSpent: 1200, // 20 hours
            assignmentsCompleted: 8,
            attendanceRate: 92,
            lastAssessment: new Date('2024-01-10'),
            strengths: ['Vocabulary', 'Reading'],
            needsImprovement: ['Speaking confidence', 'Pronunciation']
          },
          permissions: {
            canAccessForum: true,
            canSubmitAssignments: true,
            canViewGrades: true,
            canParticipateInGroup: true,
            restrictedFeatures: []
          },
          parentEmail: 'parent@email.com',
          notes: 'Hardworking student, needs encouragement with speaking practice'
        }
      ],
      inviteCode: 'JOIN2024',
      maxStudents: 30,
      isActive: true,
      settings: {
        allowStudentInteraction: true,
        requireApprovalForPosts: false,
        enableRealTimeView: true,
        allowSelfPacing: true,
        gradingSystem: 'percentage',
        languageRestrictions: ['English', 'Chinese'],
        contentFiltering: true,
        parentNotifications: true,
        allowVoiceRecording: true,
        projectionMode: true
      },
      assignments: [],
      announcements: [
        {
          id: 'ann-001',
          classroomId: 'class-001',
          teacherId: 1,
          title: 'Welcome to the New Semester!',
          content: 'I\'m excited to start this new semester with all of you. Please check the assignment schedule and let me know if you have any questions.',
          priority: 'medium',
          targetAudience: 'all',
          attachments: [],
          readBy: [2],
          createdAt: new Date('2024-01-08')
        }
      ],
      schedule: [
        {
          id: 'sch-001',
          classroomId: 'class-001',
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '10:30',
          subject: 'English Conversation',
          room: 'Room 201',
          isRecurring: true
        },
        {
          id: 'sch-002',
          classroomId: 'class-001',
          dayOfWeek: 3, // Wednesday
          startTime: '09:00',
          endTime: '10:30',
          subject: 'Grammar & Writing',
          room: 'Room 201',
          isRecurring: true
        }
      ],
      createdAt: new Date('2023-09-01')
    };

    this.classrooms.set('class-001', classroom);

    // Sample assignment
    const assignment: ClassroomAssignment = {
      id: 'assign-001',
      classroomId: 'class-001',
      title: 'Weekly Writing Assignment - Describing Your Hometown',
      description: 'Write a 200-word essay describing your hometown, including its culture, food, and interesting places.',
      type: 'homework',
      instructions: [
        'Write between 150-250 words',
        'Include at least 3 descriptive adjectives',
        'Use past and present tenses appropriately',
        'Check your grammar and spelling before submitting'
      ],
      resources: [
        {
          type: 'document',
          title: 'Essay Writing Guide',
          content: 'Tips for writing descriptive essays...',
          description: 'Helpful guidelines for writing your essay',
          required: true
        }
      ],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalPoints: 20,
      estimatedTime: 60,
      difficulty: 'intermediate',
      tags: ['writing', 'description', 'hometown'],
      submissions: [],
      rubric: {
        id: 'writing-rubric-001',
        name: 'Descriptive Writing Rubric',
        criteria: [
          {
            name: 'Content',
            description: 'Quality and relevance of ideas',
            weight: 40,
            levels: [
              {
                score: 4,
                label: 'Excellent',
                description: 'Rich, detailed description with vivid examples',
                indicators: ['Uses specific details', 'Engages the reader', 'Clear organization']
              },
              {
                score: 3,
                label: 'Good',
                description: 'Good description with adequate details',
                indicators: ['Some specific details', 'Generally organized', 'Mostly clear']
              },
              {
                score: 2,
                label: 'Fair',
                description: 'Basic description with limited details',
                indicators: ['Few specific details', 'Basic organization', 'Somewhat unclear']
              },
              {
                score: 1,
                label: 'Poor',
                description: 'Minimal description, lacks detail',
                indicators: ['Very few details', 'Poor organization', 'Unclear']
              }
            ]
          },
          {
            name: 'Language Use',
            description: 'Grammar, vocabulary, and sentence structure',
            weight: 35,
            levels: [
              {
                score: 4,
                label: 'Excellent',
                description: 'Strong command of language with varied vocabulary',
                indicators: ['Excellent grammar', 'Rich vocabulary', 'Varied sentences']
              },
              {
                score: 3,
                label: 'Good',
                description: 'Good language use with minor errors',
                indicators: ['Good grammar', 'Appropriate vocabulary', 'Some variety']
              },
              {
                score: 2,
                label: 'Fair',
                description: 'Adequate language use with some errors',
                indicators: ['Some grammar errors', 'Basic vocabulary', 'Simple sentences']
              },
              {
                score: 1,
                label: 'Poor',
                description: 'Limited language use with frequent errors',
                indicators: ['Many grammar errors', 'Limited vocabulary', 'Unclear sentences']
              }
            ]
          },
          {
            name: 'Mechanics',
            description: 'Spelling, punctuation, and formatting',
            weight: 25,
            levels: [
              {
                score: 4,
                label: 'Excellent',
                description: 'Virtually no mechanical errors',
                indicators: ['Perfect spelling', 'Correct punctuation', 'Proper format']
              },
              {
                score: 3,
                label: 'Good',
                description: 'Few mechanical errors',
                indicators: ['Minor spelling errors', 'Mostly correct punctuation', 'Good format']
              },
              {
                score: 2,
                label: 'Fair',
                description: 'Some mechanical errors that may interfere',
                indicators: ['Some spelling errors', 'Punctuation issues', 'Format problems']
              },
              {
                score: 1,
                label: 'Poor',
                description: 'Many mechanical errors that interfere significantly',
                indicators: ['Many spelling errors', 'Poor punctuation', 'Poor format']
              }
            ]
          }
        ],
        totalPoints: 20,
        description: 'Rubric for evaluating descriptive writing assignments'
      },
      isPublished: true,
      allowLateSubmission: true,
      maxAttempts: 2,
      createdAt: new Date('2024-01-08')
    };

    this.assignments.set('assign-001', assignment);
  }

  // Teacher methods
  createClassroom(
    teacherId: number,
    name: string,
    description: string,
    subject: string,
    gradeLevel: string,
    maxStudents: number = 30
  ): Classroom {
    const classroomId = `class-${Date.now()}`;
    const inviteCode = this.generateInviteCode();

    const classroom: Classroom = {
      id: classroomId,
      teacherId,
      name,
      description,
      subject,
      gradeLevel,
      academicYear: '2024-2025',
      students: [],
      inviteCode,
      maxStudents,
      isActive: true,
      settings: {
        allowStudentInteraction: true,
        requireApprovalForPosts: false,
        enableRealTimeView: true,
        allowSelfPacing: true,
        gradingSystem: 'percentage',
        languageRestrictions: ['English'],
        contentFiltering: true,
        parentNotifications: true,
        allowVoiceRecording: true,
        projectionMode: true
      },
      assignments: [],
      announcements: [],
      schedule: [],
      createdAt: new Date()
    };

    this.classrooms.set(classroomId, classroom);

    // Update teacher profile
    const teacher = this.teacherProfiles.get(teacherId);
    if (teacher) {
      teacher.classrooms.push(classroomId);
    }

    return classroom;
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  joinClassroomByCode(userId: number, inviteCode: string, displayName: string): boolean {
    for (const classroom of this.classrooms.values()) {
      if (classroom.inviteCode === inviteCode && classroom.isActive) {
        if (classroom.students.length >= classroom.maxStudents) {
          return false; // Classroom full
        }

        if (classroom.students.some(s => s.userId === userId)) {
          return false; // Already joined
        }

        const student: ClassroomStudent = {
          userId,
          studentId: `STU${String(userId).padStart(3, '0')}`,
          displayName,
          joinedAt: new Date(),
          lastActive: new Date(),
          progress: {
            currentLevel: 'Beginner',
            lessonsCompleted: 0,
            averageScore: 0,
            timeSpent: 0,
            assignmentsCompleted: 0,
            attendanceRate: 100,
            lastAssessment: new Date(),
            strengths: [],
            needsImprovement: []
          },
          permissions: {
            canAccessForum: true,
            canSubmitAssignments: true,
            canViewGrades: true,
            canParticipateInGroup: true,
            restrictedFeatures: []
          },
          notes: ''
        };

        classroom.students.push(student);
        return true;
      }
    }
    return false;
  }

  createAssignment(
    classroomId: string,
    teacherId: number,
    assignmentData: Omit<ClassroomAssignment, 'id' | 'classroomId' | 'submissions' | 'createdAt'>
  ): ClassroomAssignment {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new Error('Classroom not found or unauthorized');
    }

    const assignmentId = `assign-${Date.now()}`;
    const assignment: ClassroomAssignment = {
      id: assignmentId,
      classroomId,
      submissions: [],
      createdAt: new Date(),
      ...assignmentData
    };

    this.assignments.set(assignmentId, assignment);
    classroom.assignments.push(assignmentId);

    return assignment;
  }

  submitAssignment(
    assignmentId: string,
    studentId: number,
    content: string,
    attachments: SubmissionAttachment[] = []
  ): AssignmentSubmission {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const submissionId = `sub-${Date.now()}-${studentId}`;
    const isLate = new Date() > assignment.dueDate;

    const submission: AssignmentSubmission = {
      id: submissionId,
      assignmentId,
      studentId,
      content,
      attachments,
      submittedAt: new Date(),
      isLate,
      attempts: 1,
      status: 'submitted'
    };

    assignment.submissions.push(submission);
    this.submissions.set(submissionId, submission);

    return submission;
  }

  gradeSubmission(
    submissionId: string,
    teacherId: number,
    score: number,
    feedback: Omit<TeacherFeedback, 'teacherId' | 'gradedAt'>
  ): AssignmentSubmission {
    const submission = this.submissions.get(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    const assignment = this.assignments.get(submission.assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const classroom = this.classrooms.get(assignment.classroomId);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new Error('Unauthorized');
    }

    submission.score = score;
    submission.feedback = {
      teacherId,
      gradedAt: new Date(),
      ...feedback
    };
    submission.status = 'graded';

    return submission;
  }

  // Projection mode methods
  enableProjectionMode(classroomId: string, teacherId: number): ProjectionMode {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom || classroom.teacherId !== teacherId) {
      throw new Error('Unauthorized');
    }

    const projectionMode: ProjectionMode = {
      isActive: true,
      classroomId,
      currentContent: {
        type: 'announcement',
        content: { message: 'Welcome to class!' },
        title: 'Class Started',
        description: 'Teacher has started projection mode',
        interactive: false
      },
      connectedDevices: [],
      settings: {
        allowStudentControl: false,
        showStudentNames: true,
        enableRealTimePolling: true,
        autoAdvance: false,
        fontSize: 'medium',
        theme: 'light'
      }
    };

    this.projectionModes.set(classroomId, projectionMode);
    return projectionMode;
  }

  connectStudentDevice(
    classroomId: string,
    studentId: number,
    deviceId: string,
    deviceType: 'tablet' | 'phone' | 'laptop'
  ): boolean {
    const projectionMode = this.projectionModes.get(classroomId);
    if (!projectionMode) return false;

    const classroom = this.classrooms.get(classroomId);
    if (!classroom) return false;

    const student = classroom.students.find(s => s.userId === studentId);
    if (!student) return false;

    const device: ConnectedDevice = {
      deviceId,
      deviceType,
      studentId,
      studentName: student.displayName,
      isActive: true,
      lastSeen: new Date()
    };

    // Remove existing device if any
    projectionMode.connectedDevices = projectionMode.connectedDevices.filter(
      d => d.studentId !== studentId
    );

    projectionMode.connectedDevices.push(device);
    return true;
  }

  // Dashboard methods
  getTeacherDashboard(teacherId: number): TeacherDashboard {
    const teacher = this.teacherProfiles.get(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const teacherClassrooms = teacher.classrooms.map(id => this.classrooms.get(id)).filter(Boolean) as Classroom[];
    
    const classroomSummaries: ClassroomSummary[] = teacherClassrooms.map(classroom => {
      const activeStudents = classroom.students.filter(
        s => (Date.now() - s.lastActive.getTime()) < 24 * 60 * 60 * 1000 // active in last 24h
      ).length;

      const avgProgress = classroom.students.length > 0
        ? classroom.students.reduce((sum, s) => sum + s.progress.averageScore, 0) / classroom.students.length
        : 0;

      return {
        id: classroom.id,
        name: classroom.name,
        studentCount: classroom.students.length,
        activeStudents,
        averageProgress: Math.round(avgProgress),
        pendingAssignments: classroom.assignments.length,
        lastActivity: new Date()
      };
    });

    return {
      teacherId,
      classrooms: classroomSummaries,
      todaySchedule: [],
      pendingSubmissions: 0,
      recentActivity: [],
      announcements: 0,
      studentProgress: [],
      upcomingDeadlines: []
    };
  }

  // Public methods
  getTeacherClassrooms(teacherId: number): Classroom[] {
    return Array.from(this.classrooms.values())
      .filter(classroom => classroom.teacherId === teacherId);
  }

  getClassroomStudents(classroomId: string, teacherId: number): ClassroomStudent[] {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom || classroom.teacherId !== teacherId) {
      return [];
    }
    return classroom.students;
  }

  getClassroomAssignments(classroomId: string): ClassroomAssignment[] {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) return [];

    return classroom.assignments
      .map(id => this.assignments.get(id))
      .filter(Boolean) as ClassroomAssignment[];
  }

  getStudentAssignments(userId: number): ClassroomAssignment[] {
    const assignments: ClassroomAssignment[] = [];
    
    for (const classroom of this.classrooms.values()) {
      if (classroom.students.some(s => s.userId === userId)) {
        const classroomAssignments = this.getClassroomAssignments(classroom.id);
        assignments.push(...classroomAssignments);
      }
    }

    return assignments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  getStudentClassrooms(userId: number): Classroom[] {
    return Array.from(this.classrooms.values())
      .filter(classroom => classroom.students.some(s => s.userId === userId));
  }

  createTeacherProfile(
    userId: number,
    schoolName: string,
    certification: string[],
    experience: number,
    specializations: string[]
  ): TeacherProfile {
    const teacherCode = `TCH${String(userId).padStart(3, '0')}`;
    
    const profile: TeacherProfile = {
      userId,
      teacherCode,
      schoolName,
      certification,
      experience,
      specializations,
      classrooms: [],
      totalStudents: 0,
      createdAt: new Date(),
      verificationStatus: 'pending'
    };

    this.teacherProfiles.set(userId, profile);
    return profile;
  }

  getTeacherProfile(userId: number): TeacherProfile | undefined {
    return this.teacherProfiles.get(userId);
  }

  isTeacher(userId: number): boolean {
    return this.teacherProfiles.has(userId);
  }
}

export const classroomManagementSystem = new ClassroomManagementSystem();