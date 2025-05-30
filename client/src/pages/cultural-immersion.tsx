import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, BookOpen, Users, Play, Clock, MapPin, Calendar, Video } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function CulturalImmersion() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [storyChoices, setStoryChoices] = useState({});

  const { data: stories, isLoading: storiesLoading } = useQuery({
    queryKey: ["/api/cultural/stories"],
  });

  const { data: exchanges, isLoading: exchangesLoading } = useQuery({
    queryKey: ["/api/cultural/exchange"],
  });

  const joinExchangeMutation = useMutation({
    mutationFn: async (exchangeId) => {
      const response = await fetch(`/api/cultural/exchange/${exchangeId}/join`, {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cultural/exchange"] });
    },
  });

  const makeStoryChoice = (choice) => {
    const newChoices = { ...storyChoices };
    newChoices[currentChapter] = choice;
    setStoryChoices(newChoices);
    
    if (currentChapter < selectedStory.chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const InteractiveStory = ({ story }) => {
    const chapter = story.chapters[currentChapter];
    const progress = ((currentChapter + 1) / story.chapters.length) * 100;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {story.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                {story.region}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(story.difficulty)}>
                {story.difficulty}
              </Badge>
              <Badge variant="outline">
                <Clock className="w-4 h-4 mr-1" />
                {story.duration} min
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground">
            Chapter {currentChapter + 1} of {story.chapters.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">{chapter.title}</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{chapter.content}</p>
            </div>
          </div>

          {chapter.vocabulary && (
            <div>
              <h4 className="font-medium mb-2">Key Vocabulary</h4>
              <div className="flex flex-wrap gap-2">
                {chapter.vocabulary.map((word, idx) => (
                  <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {chapter.culturalNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Cultural Insight</h4>
              <p className="text-sm text-blue-700">{chapter.culturalNotes}</p>
            </div>
          )}

          {story.choices && currentChapter === story.chapters.length - 1 && (
            <div className="space-y-3">
              <h4 className="font-medium">What would you like to do?</h4>
              <div className="grid gap-3">
                {story.choices.map((choice, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="text-left justify-start h-auto p-4"
                    onClick={() => makeStoryChoice(choice)}
                  >
                    <div>
                      <p className="font-medium">{choice.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">{choice.consequence}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {currentChapter > 0 && (
              <Button variant="outline" onClick={() => setCurrentChapter(prev => prev - 1)}>
                Previous Chapter
              </Button>
            )}
            {currentChapter < story.chapters.length - 1 && (
              <Button onClick={() => setCurrentChapter(prev => prev + 1)}>
                Next Chapter
              </Button>
            )}
            {currentChapter === story.chapters.length - 1 && (
              <Button onClick={() => setSelectedStory(null)}>
                Complete Story
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (storiesLoading || exchangesLoading) {
    return <div className="flex justify-center p-8">Loading cultural content...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Cultural Immersion
        </h1>
        <p className="text-muted-foreground">
          Explore global cultures through interactive stories and language exchange
        </p>
      </div>

      {selectedStory ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setSelectedStory(null)}>
            ← Back to Stories
          </Button>
          <InteractiveStory story={selectedStory} />
        </div>
      ) : (
        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">Interactive Stories</TabsTrigger>
            <TabsTrigger value="exchange">Cultural Exchange</TabsTrigger>
          </TabsList>

          <TabsContent value="stories">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories?.stories?.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Globe className="w-5 h-5" />
                          {story.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {story.region}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getDifficultyColor(story.difficulty)}>
                          {story.difficulty}
                        </Badge>
                        {story.type === "interactive" && (
                          <Badge variant="outline">Interactive</Badge>
                        )}
                        {story.type === "documentary" && (
                          <Badge variant="outline">
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {story.culturalContext && (
                      <p className="text-sm text-muted-foreground">{story.culturalContext}</p>
                    )}
                    
                    {story.chapters && (
                      <div className="text-xs text-muted-foreground">
                        {story.chapters.length} chapters • {story.duration} minutes
                      </div>
                    )}

                    {story.type === "interactive" && story.choices && (
                      <div>
                        <p className="text-xs font-medium mb-2">Story Paths:</p>
                        <div className="space-y-1">
                          {story.choices.slice(0, 2).map((choice, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              • {choice.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedStory(story);
                        setCurrentChapter(0);
                        setStoryChoices({});
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Story
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exchange">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exchanges?.exchanges?.map((exchange) => (
                  <Card key={exchange.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {exchange.type === "language_exchange" ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          <Globe className="w-5 h-5" />
                        )}
                        {exchange.title}
                      </CardTitle>
                      <CardDescription>
                        {exchange.type === "language_exchange" 
                          ? "Practice with native speakers"
                          : "Join cultural discussions"
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {exchange.participants && (
                        <div>
                          <p className="text-sm font-medium mb-2">Participants</p>
                          <div className="space-y-2">
                            {exchange.participants.map((participant, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-muted rounded">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{participant.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Teaches: {participant.teaches} • Learns: {participant.learns}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {participant.timezone}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {exchange.nextSession && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Next: {new Date(exchange.nextSession).toLocaleDateString()}</span>
                          {exchange.duration && (
                            <>
                              <span>•</span>
                              <Clock className="w-4 h-4" />
                              <span>{exchange.duration} min</span>
                            </>
                          )}
                        </div>
                      )}

                      {exchange.topics && (
                        <div>
                          <p className="text-sm font-medium mb-2">Discussion Topics</p>
                          <div className="flex flex-wrap gap-1">
                            {exchange.topics.map((topic, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {exchange.openSlots && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            {exchange.openSlots} open slots available
                          </p>
                        </div>
                      )}

                      {exchange.language && (
                        <div className="flex gap-2">
                          <Badge variant="outline">Language: {exchange.language}</Badge>
                          {exchange.hostingCountry && (
                            <Badge variant="secondary">{exchange.hostingCountry}</Badge>
                          )}
                        </div>
                      )}

                      <Button 
                        className="w-full"
                        onClick={() => joinExchangeMutation.mutate(exchange.id)}
                        disabled={joinExchangeMutation.isPending}
                      >
                        {exchange.openSlots ? "Join Exchange" : "Request to Join"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Host Your Own Exchange
                  </CardTitle>
                  <CardDescription>
                    Create a cultural exchange session and invite learners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Exchange Session</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}