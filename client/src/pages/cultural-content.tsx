import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flag, 
  MapPin, 
  Calendar, 
  Users, 
  BookOpen,
  Star,
  Clock,
  Globe
} from "lucide-react";
import LessonCard from "@/components/learning/lesson-card";
import { cn } from "@/lib/utils";
import type { Lesson, UserProgress } from "@shared/schema";

interface CulturalTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessonCount: number;
  category: "festivals" | "places" | "traditions" | "people";
}

const CULTURAL_TOPICS: CulturalTopic[] = [
  {
    id: "spring-festival",
    title: "Spring Festival (Chinese New Year)",
    description: "Learn about China's most important traditional holiday",
    icon: "🧧",
    color: "from-red-50 to-pink-50 border-red-100",
    lessonCount: 8,
    category: "festivals"
  },
  {
    id: "mid-autumn",
    title: "Mid-Autumn Festival",
    description: "The festival of moon cakes and family reunions",
    icon: "🥮",
    color: "from-yellow-50 to-orange-50 border-yellow-100",
    lessonCount: 6,
    category: "festivals"
  },
  {
    id: "great-wall",
    title: "The Great Wall of China",
    description: "Explore the history and significance of this wonder",
    icon: "🏯",
    color: "from-gray-50 to-slate-50 border-gray-100",
    lessonCount: 5,
    category: "places"
  },
  {
    id: "forbidden-city",
    title: "The Forbidden City",
    description: "Imperial palace and symbol of Chinese power",
    icon: "🏛️",
    color: "from-purple-50 to-indigo-50 border-purple-100",
    lessonCount: 7,
    category: "places"
  },
  {
    id: "tea-culture",
    title: "Chinese Tea Culture",
    description: "The art and tradition of tea in Chinese society",
    icon: "🍵",
    color: "from-green-50 to-emerald-50 border-green-100",
    lessonCount: 4,
    category: "traditions"
  },
  {
    id: "calligraphy",
    title: "Chinese Calligraphy",
    description: "The beautiful art of Chinese writing",
    icon: "🖌️",
    color: "from-blue-50 to-cyan-50 border-blue-100",
    lessonCount: 6,
    category: "traditions"
  },
  {
    id: "confucius",
    title: "Confucius and His Philosophy",
    description: "The great philosopher who shaped Chinese thought",
    icon: "👨‍🏫",
    color: "from-amber-50 to-yellow-50 border-amber-100",
    lessonCount: 5,
    category: "people"
  },
  {
    id: "terracotta-warriors",
    title: "Terracotta Warriors",
    description: "Ancient army protecting Emperor Qin Shi Huang",
    icon: "🏺",
    color: "from-orange-50 to-red-50 border-orange-100",
    lessonCount: 4,
    category: "places"
  }
];

const FEATURED_ARTICLES = [
  {
    id: 1,
    title: "Dragon Boat Festival: Racing Through History",
    excerpt: "Discover the thrilling tradition of dragon boat racing and the legend of Qu Yuan",
    readTime: "5 min read",
    level: "intermediate",
    image: "🐉"
  },
  {
    id: 2,
    title: "Modern Chinese Architecture: Blending Old and New",
    excerpt: "How contemporary Chinese cities honor tradition while embracing the future",
    readTime: "7 min read",
    level: "advanced",
    image: "🏗️"
  },
  {
    id: 3,
    title: "Chinese Zodiac: Understanding the 12 Animals",
    excerpt: "Learn about the cultural significance of zodiac animals in Chinese society",
    readTime: "4 min read",
    level: "beginner",
    image: "🐅"
  }
];

// Mock user ID
const CURRENT_USER_ID = 1;

export default function CulturalContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<CulturalTopic | null>(null);

  const { data: culturalLessons = [], isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons", { category: "cultural" }],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", CURRENT_USER_ID, "progress"],
  });

  const filteredTopics = selectedCategory === "all" 
    ? CULTURAL_TOPICS 
    : CULTURAL_TOPICS.filter(topic => topic.category === selectedCategory);

  const getProgressForLesson = (lessonId: number) => {
    return userProgress.find(p => p.lessonId === lessonId);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "festivals": return "🎊";
      case "places": return "🏛️";
      case "traditions": return "🎎";
      case "people": return "👑";
      default: return "🇨🇳";
    }
  };

  const categories = [
    { id: "all", name: "All Topics", icon: "🇨🇳" },
    { id: "festivals", name: "Festivals", icon: "🎊" },
    { id: "places", name: "Famous Places", icon: "🏛️" },
    { id: "traditions", name: "Traditions", icon: "🎎" },
    { id: "people", name: "Historical Figures", icon: "👑" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-500 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🇨🇳 Cultural Bridge</h1>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              Explore Chinese culture, festivals, and traditions while improving your English skills
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cultural Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">24</div>
              <p className="text-sm text-muted-foreground">Cultural Topics</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">89%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">450</div>
              <p className="text-sm text-muted-foreground">Cultural Words Learned</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="topics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="topics">Cultural Topics</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="articles">Featured Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Explore Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="flex items-center space-x-2"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Topics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className={cn("learning-card", topic.color)}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <span className="text-4xl mb-4 block">{topic.icon}</span>
                      <Badge className="mb-2">{topic.category}</Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 text-center">{topic.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 text-center">{topic.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Lessons</span>
                        <span className="font-medium">{topic.lessonCount}</span>
                      </div>
                      
                      <Button className="w-full" onClick={() => setSelectedTopic(topic)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Explore Topic
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            {culturalLessons.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No cultural lessons found</h3>
                  <p className="text-muted-foreground">
                    Cultural lessons are being prepared. Check back soon!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culturalLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    progress={getProgressForLesson(lesson.id)}
                    onClick={() => {
                      console.log('Opening cultural lesson:', lesson.id);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_ARTICLES.map((article) => (
                <Card key={article.id} className="learning-card">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <span className="text-4xl">{article.image}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="level-intermediate">{article.level}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                    
                    <Button className="w-full">
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Topic Detail Modal */}
        {selectedTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedTopic.icon}</span>
                    <span>{selectedTopic.title}</span>
                  </CardTitle>
                  <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{selectedTopic.description}</p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">What You'll Learn</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Historical background and cultural significance</li>
                      <li>• Key vocabulary and expressions in English</li>
                      <li>• Interactive exercises and cultural insights</li>
                      <li>• Comparison with global traditions</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {selectedTopic.lessonCount} lessons available
                    </div>
                    <Button>
                      Start Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
