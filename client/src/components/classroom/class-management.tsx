import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Trophy, 
  Star, 
  Crown, 
  Gift,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { TranslatableText } from '@/components/translation-provider';

// Enhanced data structures for classroom management
interface Student {
  id: string;
  name: string;
  avatar?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalXP: number;
  weeklyXP: number;
  streak: number;
  achievements: string[];
  classRank: number;
  globalRank: number;
  lastActive: Date;
  groups: string[];
  rewards: Reward[];
}

interface StudentGroup {
  id: string;
  name: string;
  color: string;
  members: string[];
  totalXP: number;
  averageProgress: number;
  challenges: GroupChallenge[];
}

interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject: string;
  students: Student[];
  groups: StudentGroup[];
  activeCompetitions: Competition[];
  rewardSystem: RewardSystem;
}

interface Competition {
  id: string;
  title: string;
  type: 'individual' | 'group' | 'class_vs_class';
  startDate: Date;
  endDate: Date;
  prizes: Prize[];
  participants: string[];
  leaderboard: LeaderboardEntry[];
  status: 'active' | 'completed' | 'upcoming';
}

interface Prize {
  rank: number;
  title: string;
  description: string;
  points: number;
  badge?: string;
  physicalReward?: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'digital' | 'privilege' | 'physical';
  icon: string;
  claimed: boolean;
  claimedDate?: Date;
}

interface RewardSystem {
  availableRewards: Reward[];
  pointsExchangeRate: number;
  seasonalBonuses: SeasonalBonus[];
}

interface SeasonalBonus {
  id: string;
  title: string;
  multiplier: number;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  targetPoints: number;
  currentPoints: number;
  reward: string;
  deadline: Date;
}

interface LeaderboardEntry {
  participantId: string;
  participantName: string;
  score: number;
  rank: number;
  change: number;
}

// Class data from storage - will be cached for offline use
const CLASSROOMS: Classroom[] = [
  {
    id: 'class-1',
    name: 'Advanced English 3A',
    grade: 'Grade 10',
    subject: 'English',
    students: [
      {
        id: 'student-1',
        name: 'Li Wei',
        level: 'intermediate',
        totalXP: 2450,
        weeklyXP: 380,
        streak: 12,
        achievements: ['speaking_master', 'vocabulary_champion'],
        classRank: 1,
        globalRank: 15,
        lastActive: new Date(),
        groups: ['group-dragons'],
        rewards: []
      },
      {
        id: 'student-2',
        name: 'Zhang Min',
        level: 'beginner',
        totalXP: 1200,
        weeklyXP: 250,
        streak: 5,
        achievements: ['consistent_learner'],
        classRank: 8,
        globalRank: 45,
        lastActive: new Date(Date.now() - 3600000),
        groups: ['group-phoenixes'],
        rewards: []
      }
    ],
    groups: [
      {
        id: 'group-dragons',
        name: 'Dragons',
        color: 'bg-red-100 text-red-700',
        members: ['student-1'],
        totalXP: 2450,
        averageProgress: 85,
        challenges: [
          {
            id: 'challenge-1',
            title: 'Cultural Presentation Challenge',
            description: 'Create a presentation about Chinese festivals',
            targetPoints: 500,
            currentPoints: 320,
            reward: 'Extra recess time',
            deadline: new Date(Date.now() + 7 * 24 * 3600000)
          }
        ]
      }
    ],
    activeCompetitions: [
      {
        id: 'comp-1',
        title: 'Weekly Speaking Challenge',
        type: 'individual',
        startDate: new Date(Date.now() - 3 * 24 * 3600000),
        endDate: new Date(Date.now() + 4 * 24 * 3600000),
        prizes: [
          { rank: 1, title: 'Gold Medal', description: 'Speaking Champion', points: 100, badge: '🏆' }
        ],
        participants: ['student-1', 'student-2'],
        leaderboard: [
          { participantId: 'student-1', participantName: 'Li Wei', score: 245, rank: 1, change: 0 }
        ],
        status: 'active'
      }
    ],
    rewardSystem: {
      availableRewards: [
        {
          id: 'reward-1',
          title: 'Skip Homework Pass',
          description: 'Skip one homework assignment',
          points: 200,
          category: 'privilege',
          icon: '📝',
          claimed: false
        }
      ],
      pointsExchangeRate: 1,
      seasonalBonuses: [
        {
          id: 'bonus-1',
          title: 'Mid-Autumn Festival Bonus',
          multiplier: 1.5,
          startDate: new Date('2024-09-15'),
          endDate: new Date('2024-10-15'),
          description: 'Celebrate Chinese culture with bonus points!'
        }
      ]
    }
  }
];

export default function ClassManagement() {
  const [selectedClass, setSelectedClass] = useState<Classroom>(CLASSROOMS[0]);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            <TranslatableText>Class Management</TranslatableText>
          </h2>
          <p className="text-muted-foreground">
            <TranslatableText>Manage students, groups, and competitions</TranslatableText>
          </p>
        </div>
        <Select value={selectedClass.id} onValueChange={(value) => {
          const classroom = CLASSROOMS.find(c => c.id === value);
          if (classroom) setSelectedClass(classroom);
        }}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CLASSROOMS.map(classroom => (
              <SelectItem key={classroom.id} value={classroom.id}>
                {classroom.name} - {classroom.grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Total Students</TranslatableText>
                </p>
                <p className="text-2xl font-bold">{selectedClass.students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Active Groups</TranslatableText>
                </p>
                <p className="text-2xl font-bold">{selectedClass.groups.length}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Active Competitions</TranslatableText>
                </p>
                <p className="text-2xl font-bold">{selectedClass.activeCompetitions.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  <TranslatableText>Class Total XP</TranslatableText>
                </p>
                <p className="text-2xl font-bold">
                  {selectedClass.students.reduce((sum, s) => sum + s.totalXP, 0)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <TranslatableText>Overview</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="students">
            <TranslatableText>Students</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="groups">
            <TranslatableText>Groups</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="competitions">
            <TranslatableText>Competitions</TranslatableText>
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <TranslatableText>Rewards</TranslatableText>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <TranslatableText>Class Leaderboard</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClass.students
                  .sort((a, b) => b.totalXP - a.totalXP)
                  .slice(0, 5)
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            <TranslatableText>{student.level}</TranslatableText>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{student.totalXP} XP</p>
                        <p className="text-sm text-green-600">+{student.weeklyXP} this week</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <TranslatableText>Active Competitions</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClass.activeCompetitions.map(competition => (
                  <div key={competition.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">
                        <TranslatableText>{competition.title}</TranslatableText>
                      </h3>
                      <Badge variant="secondary">
                        <TranslatableText>{competition.type.replace('_', ' ')}</TranslatableText>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <TranslatableText>Ends:</TranslatableText> {competition.endDate.toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      {competition.leaderboard.slice(0, 3).map(entry => (
                        <div key={entry.participantId} className="flex justify-between items-center">
                          <span className="text-sm">{entry.rank}. {entry.participantName}</span>
                          <span className="font-medium">{entry.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              <TranslatableText>Student Management</TranslatableText>
            </h3>
            <Button className="bg-primary text-primary-foreground">
              <UserPlus className="h-4 w-4 mr-2" />
              <TranslatableText>Add Student</TranslatableText>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {selectedClass.students.map(student => (
              <Card key={student.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        <TranslatableText>{student.level}</TranslatableText>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span><TranslatableText>Total XP:</TranslatableText></span>
                      <span className="font-medium">{student.totalXP}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span><TranslatableText>Class Rank:</TranslatableText></span>
                      <span className="font-medium">#{student.classRank}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span><TranslatableText>Streak:</TranslatableText></span>
                      <span className="font-medium">{student.streak} days</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.achievements.slice(0, 2).map(achievement => (
                      <Badge key={achievement} variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        <TranslatableText>{achievement.replace('_', ' ')}</TranslatableText>
                      </Badge>
                    ))}
                  </div>

                  <Button size="sm" variant="outline" className="w-full">
                    <TranslatableText>View Details</TranslatableText>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              <TranslatableText>Group Management</TranslatableText>
            </h3>
            <Button className="bg-primary text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              <TranslatableText>Create Group</TranslatableText>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedClass.groups.map(group => (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${group.color.split(' ')[0]}`}></div>
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <TranslatableText>Members</TranslatableText>
                      </p>
                      <p className="font-semibold">{group.members.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <TranslatableText>Total XP</TranslatableText>
                      </p>
                      <p className="font-semibold">{group.totalXP}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">
                        <TranslatableText>Average Progress</TranslatableText>
                      </span>
                      <span className="text-sm font-medium">{group.averageProgress}%</span>
                    </div>
                    <Progress value={group.averageProgress} />
                  </div>

                  {group.challenges.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        <TranslatableText>Active Challenges</TranslatableText>
                      </h4>
                      {group.challenges.map(challenge => (
                        <div key={challenge.id} className="p-3 bg-muted rounded-lg">
                          <h5 className="font-medium text-sm">
                            <TranslatableText>{challenge.title}</TranslatableText>
                          </h5>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{challenge.currentPoints}/{challenge.targetPoints} points</span>
                            <span><TranslatableText>Reward:</TranslatableText> {challenge.reward}</span>
                          </div>
                          <Progress 
                            value={(challenge.currentPoints / challenge.targetPoints) * 100} 
                            className="mt-2 h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              <TranslatableText>Competition Management</TranslatableText>
            </h3>
            <Button className="bg-primary text-primary-foreground">
              <Trophy className="h-4 w-4 mr-2" />
              <TranslatableText>Create Competition</TranslatableText>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText>Class Competitions</TranslatableText>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedClass.activeCompetitions.map(competition => (
                <div key={competition.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">
                        <TranslatableText>{competition.title}</TranslatableText>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        <TranslatableText>Ends:</TranslatableText> {competition.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <TranslatableText>Manage</TranslatableText>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {competition.leaderboard.map(entry => (
                      <div key={entry.participantId} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span>{entry.rank}. {entry.participantName}</span>
                        <span className="font-medium">{entry.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              <TranslatableText>Reward System</TranslatableText>
            </h3>
            <Button className="bg-primary text-primary-foreground">
              <Gift className="h-4 w-4 mr-2" />
              <TranslatableText>Add Reward</TranslatableText>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {selectedClass.rewardSystem.availableRewards.map(reward => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    <h3 className="font-semibold">
                      <TranslatableText>{reward.title}</TranslatableText>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <TranslatableText>{reward.description}</TranslatableText>
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm">
                      <TranslatableText>Cost:</TranslatableText>
                    </span>
                    <span className="font-bold text-lg">{reward.points} pts</span>
                  </div>

                  <Badge variant="outline" className="w-full justify-center">
                    <TranslatableText>{reward.category}</TranslatableText>
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}