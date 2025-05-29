import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Trophy, Star, MessageCircle, Crown, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'writing' | 'reading';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  participants: ChallengeParticipant[];
  startDate: Date;
  endDate: Date;
  rewards: ChallengeReward[];
  status: 'upcoming' | 'active' | 'completed';
}

interface ChallengeParticipant {
  userId: number;
  joinedAt: Date;
  progress: number;
  score: number;
  rank: number;
  achievements: string[];
  isActive: boolean;
}

interface ChallengeReward {
  type: 'xp' | 'badge' | 'title' | 'feature-unlock';
  value: string | number;
  requirement: string;
  description: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: number;
  members: GroupMember[];
  isPublic: boolean;
  maxMembers: number;
  focusAreas: string[];
  meetingSchedule?: string;
  language: string;
  level: string;
  tags: string[];
  createdAt: Date;
}

interface GroupMember {
  userId: number;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  contributionScore: number;
  isActive: boolean;
}

interface Leaderboard {
  id: string;
  type: 'weekly' | 'monthly' | 'all-time';
  category: 'xp' | 'streak' | 'accuracy' | 'participation';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  score: number;
  badge?: string;
  trend: 'up' | 'down' | 'same';
}

export default function SocialLearningPage() {
  const [selectedChallengeType, setSelectedChallengeType] = useState<string>('');
  const [selectedGroupFocus, setSelectedGroupFocus] = useState<string>('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    focusAreas: [] as string[],
    isPublic: true,
    maxMembers: 15
  });

  const queryClient = useQueryClient();

  // Fetch challenges
  const { data: challenges = [] } = useQuery({
    queryKey: ['social-challenges', selectedChallengeType],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('status', 'active');
      if (selectedChallengeType) params.append('type', selectedChallengeType);
      
      const response = await fetch(`/api/social/challenges?${params}`);
      if (!response.ok) throw new Error('Failed to fetch challenges');
      return response.json();
    }
  });

  // Fetch study groups
  const { data: studyGroups = [] } = useQuery({
    queryKey: ['study-groups', selectedGroupFocus],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('isPublic', 'true');
      if (selectedGroupFocus) params.append('focusArea', selectedGroupFocus);
      
      const response = await fetch(`/api/social/groups?${params}`);
      if (!response.ok) throw new Error('Failed to fetch study groups');
      return response.json();
    }
  });

  // Fetch leaderboards
  const { data: weeklyLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'weekly', 'xp'],
    queryFn: async () => {
      const response = await fetch('/api/social/leaderboard/weekly/xp');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    }
  });

  const { data: streakLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'monthly', 'streak'],
    queryFn: async () => {
      const response = await fetch('/api/social/leaderboard/monthly/streak');
      if (!response.ok) throw new Error('Failed to fetch streak leaderboard');
      return response.json();
    }
  });

  // Join challenge mutation
  const joinChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      const response = await fetch(`/api/social/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 })
      });
      if (!response.ok) throw new Error('Failed to join challenge');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-challenges'] });
      toast({
        title: "Challenge Joined!",
        description: "Good luck with your learning challenge"
      });
    }
  });

  // Create study group mutation
  const createStudyGroup = useMutation({
    mutationFn: async (groupData: any) => {
      const response = await fetch('/api/social/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: 1,
          ...groupData
        })
      });
      if (!response.ok) throw new Error('Failed to create study group');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      setShowCreateGroup(false);
      setNewGroupData({
        name: '',
        description: '',
        focusAreas: [],
        isPublic: true,
        maxMembers: 15
      });
      toast({
        title: "Study Group Created!",
        description: "Your group is now available for members to join"
      });
    }
  });

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const typeIcons = {
    vocabulary: '📚',
    grammar: '📝',
    speaking: '🗣️',
    writing: '✏️',
    reading: '📖'
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Social Learning</h1>
        <p className="text-muted-foreground">
          Connect with fellow learners, join challenges, and track your progress together
        </p>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          {/* Challenge Filters */}
          <div className="flex gap-4">
            <Select value={selectedChallengeType} onValueChange={setSelectedChallengeType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All challenge types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="vocabulary">Vocabulary</SelectItem>
                <SelectItem value="grammar">Grammar</SelectItem>
                <SelectItem value="speaking">Speaking</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Challenges */}
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((challenge: LearningChallenge) => (
              <Card key={challenge.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{typeIcons[challenge.type]}</span>
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={difficultyColors[challenge.difficulty]}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {challenge.duration} days
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {challenge.participants.length} participants
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Challenge Progress</span>
                      <span>
                        {Math.round(((Date.now() - new Date(challenge.startDate).getTime()) / 
                        (new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime())) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.round(((Date.now() - new Date(challenge.startDate).getTime()) / 
                      (new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime())) * 100)} 
                      className="h-2" 
                    />
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Rewards:</h5>
                    <div className="flex flex-wrap gap-1">
                      {challenge.rewards.map((reward, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reward.type === 'xp' && <Star className="h-3 w-3 mr-1" />}
                          {reward.type === 'badge' && <Award className="h-3 w-3 mr-1" />}
                          {reward.description}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => joinChallenge.mutate(challenge.id)}
                    disabled={joinChallenge.isPending}
                  >
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          {/* Group Controls */}
          <div className="flex justify-between items-center">
            <Select value={selectedGroupFocus} onValueChange={setSelectedGroupFocus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All focus areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Areas</SelectItem>
                <SelectItem value="business">Business English</SelectItem>
                <SelectItem value="conversation">Conversation</SelectItem>
                <SelectItem value="grammar">Grammar</SelectItem>
                <SelectItem value="pronunciation">Pronunciation</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
              <DialogTrigger asChild>
                <Button>Create Study Group</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Study Group</DialogTitle>
                  <DialogDescription>
                    Start a study group to learn with other students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Group Name</label>
                    <Input
                      value={newGroupData.name}
                      onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newGroupData.description}
                      onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your study group"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Members</label>
                    <Input
                      type="number"
                      value={newGroupData.maxMembers}
                      onChange={(e) => setNewGroupData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                      min="5"
                      max="50"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => createStudyGroup.mutate(newGroupData)}
                    disabled={!newGroupData.name.trim() || createStudyGroup.isPending}
                  >
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Study Groups */}
          <div className="grid gap-4 md:grid-cols-2">
            {studyGroups.map((group: StudyGroup) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="outline">
                      {group.members.length}/{group.maxMembers}
                    </Badge>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {group.focusAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>

                  {group.meetingSchedule && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Meetings:</strong> {group.meetingSchedule}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge>{group.level}</Badge>
                      <span className="text-sm text-muted-foreground">{group.language}</span>
                    </div>
                    <Button size="sm">Join Group</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* XP Leaderboard */}
            {weeklyLeaderboard && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Weekly XP Leaders
                  </CardTitle>
                  <CardDescription>
                    Top learners by experience points this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyLeaderboard.entries?.map((entry: LeaderboardEntry, index: number) => (
                      <div key={entry.userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {entry.rank === 1 ? <Crown className="h-3 w-3" /> : entry.rank}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{entry.username}</div>
                            {entry.badge && (
                              <Badge variant="outline" className="text-xs">{entry.badge}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{entry.score.toLocaleString()}</span>
                          {getTrendIcon(entry.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Streak Leaderboard */}
            {streakLeaderboard && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Monthly Streak Leaders
                  </CardTitle>
                  <CardDescription>
                    Most consistent learners this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {streakLeaderboard.entries?.map((entry: LeaderboardEntry) => (
                      <div key={entry.userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {entry.rank === 1 ? <Crown className="h-3 w-3" /> : entry.rank}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{entry.username}</div>
                            {entry.badge && (
                              <Badge variant="outline" className="text-xs">{entry.badge}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{entry.score} days</span>
                          {getTrendIcon(entry.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Milestones and badges you've earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start learning to earn your first achievements!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}