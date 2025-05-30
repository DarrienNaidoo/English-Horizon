import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Users, MessageCircle, Trophy, Calendar, Globe, UserPlus, Star, Clock } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function SocialLearning() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["/api/social/friends"],
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/social/group-challenges"],
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId) => {
      const response = await fetch(`/api/social/group-challenges/${challengeId}/join`, {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/group-challenges"] });
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: async (friendId) => {
      const response = await fetch("/api/social/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/friends"] });
    },
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatTimeUntil = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "Soon";
  };

  if (friendsLoading || challengesLoading) {
    return <div className="flex justify-center p-8">Loading social features...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Social Learning
        </h1>
        <p className="text-muted-foreground">
          Connect with learners worldwide and participate in group challenges
        </p>
      </div>

      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="challenges">Group Challenges</TabsTrigger>
          <TabsTrigger value="exchange">Language Exchange</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Find New Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by username or language..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button>Search</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends?.friends?.map((friend) => (
                <Card key={friend.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.profileImage} alt={friend.firstName} />
                        <AvatarFallback>{getInitials(friend.firstName, friend.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{friend.firstName}</CardTitle>
                        <CardDescription>@{friend.username}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={friend.status === 'online' ? 'default' : 'secondary'}>
                          {friend.status}
                        </Badge>
                        <Badge variant="outline">{friend.level}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">From: {friend.country}</p>
                      <div className="flex gap-1">
                        {friend.languages.map((lang, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{friend.mutualFriends} mutual friends</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges?.challenges?.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        {challenge.title}
                      </span>
                      {challenge.difficulty && (
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants}/{challenge.maxParticipants} participants</span>
                      </div>
                      {challenge.endDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeUntil(challenge.endDate)} left</span>
                        </div>
                      )}
                    </div>

                    <Progress 
                      value={(challenge.participants / challenge.maxParticipants) * 100} 
                      className="h-2"
                    />

                    {challenge.prize && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-yellow-800">
                          <Trophy className="w-4 h-4" />
                          Prize: {challenge.prize}
                        </div>
                      </div>
                    )}

                    {challenge.type && (
                      <div className="flex gap-2">
                        <Badge variant="secondary">{challenge.type}</Badge>
                        {challenge.language && (
                          <Badge variant="outline">{challenge.language}</Badge>
                        )}
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={() => joinChallengeMutation.mutate(challenge.id)}
                      disabled={joinChallengeMutation.isPending || challenge.participants >= challenge.maxParticipants}
                    >
                      {challenge.participants >= challenge.maxParticipants ? "Full" : "Join Challenge"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Create Your Own Challenge
                </CardTitle>
                <CardDescription>
                  Start a learning challenge and invite friends to join
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Create Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exchange">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language Exchange Sessions
                </CardTitle>
                <CardDescription>
                  Practice with native speakers in structured conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">English-Spanish Exchange</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>Next: Tomorrow 2:00 PM</span>
                      <span>Duration: 60 min</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary">daily life</Badge>
                      <Badge variant="secondary">hobbies</Badge>
                      <Badge variant="secondary">culture</Badge>
                    </div>
                    <Button size="sm">Join Session</Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Cultural Discussion</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Festival Traditions Around the World
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>3 open slots</span>
                      <span>Language: English</span>
                    </div>
                    <Button size="sm" variant="outline">Request to Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Find Exchange Partners</CardTitle>
                <CardDescription>
                  Connect with learners who speak your target language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Target language" className="flex-1" />
                    <Button>Search</Button>
                  </div>
                  
                  <div className="text-center text-muted-foreground py-8">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Search for exchange partners based on your learning goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}