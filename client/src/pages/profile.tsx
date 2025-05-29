import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  Bell, 
  Download, 
  Trash2,
  Globe,
  Moon,
  Sun,
  Volume2,
  Smartphone,
  Wifi,
  HardDrive,
  Shield,
  Edit,
  Save,
  X
} from "lucide-react";
import { cn, formatXP, getLevelProgress } from "@/lib/utils";
import { usePWA } from "@/hooks/use-pwa";
import { useOffline } from "@/hooks/use-offline";
import { pwaUtils } from "@/lib/pwa";
import { localStorageUtils } from "@/lib/storage";

// Mock user data - in real app would come from auth context
const CURRENT_USER = {
  id: 1,
  username: "liwei",
  firstName: "Li",
  lastName: "Wei",
  email: "li.wei@example.com",
  level: "intermediate",
  xp: 1250,
  streak: 12,
  joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  lastActiveDate: new Date(),
  preferences: {
    language: "en",
    theme: "light",
    notifications: true,
    soundEffects: true,
    dailyReminder: true,
    weeklyReport: false
  }
};

interface UserSettings {
  theme: "light" | "dark" | "system";
  language: "en" | "zh";
  notifications: boolean;
  soundEffects: boolean;
  dailyReminder: boolean;
  weeklyReport: boolean;
  offlineMode: boolean;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(CURRENT_USER);
  const [settings, setSettings] = useState<UserSettings>({
    theme: "light",
    language: "en",
    notifications: true,
    soundEffects: true,
    dailyReminder: true,
    weeklyReport: false,
    offlineMode: true
  });
  const [cacheSize, setCacheSize] = useState<number>(0);

  const { isInstallable, isInstalled, installApp } = usePWA();
  const { isOnline } = useOffline();

  const levelProgress = getLevelProgress(CURRENT_USER.xp, CURRENT_USER.level);

  // Calculate cache size on component mount
  useState(() => {
    pwaUtils.getCacheSize().then(size => {
      setCacheSize(size);
    });
  });

  const handleSaveProfile = () => {
    // In real app, this would call an API to update user profile
    console.log("Saving profile:", editedUser);
    setIsEditing(false);
    // Show success toast
  };

  const handleCancelEdit = () => {
    setEditedUser(CURRENT_USER);
    setIsEditing(false);
  };

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Save to localStorage
    localStorageUtils.setItem('userSettings', { ...settings, [key]: value });
    
    // Apply theme changes immediately
    if (key === "theme") {
      document.documentElement.classList.toggle("dark", value === "dark");
    }
  };

  const handleInstallPWA = async () => {
    const success = await installApp();
    if (success) {
      console.log("App installed successfully");
    }
  };

  const clearCache = async () => {
    const success = await pwaUtils.clearCaches();
    if (success) {
      setCacheSize(0);
      console.log("Cache cleared successfully");
    }
  };

  const downloadOfflineContent = () => {
    // In real app, this would trigger download of lesson content
    console.log("Downloading offline content...");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl font-bold text-primary bg-white">
                {CURRENT_USER.firstName[0]}{CURRENT_USER.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {CURRENT_USER.firstName} {CURRENT_USER.lastName}
              </h1>
              <p className="text-blue-100 mb-3">@{CURRENT_USER.username}</p>
              
              <div className="flex items-center space-x-4">
                <Badge className="bg-white/20 text-white hover:bg-white/30 capitalize">
                  {CURRENT_USER.level}
                </Badge>
                <span className="text-blue-100">
                  {formatXP(CURRENT_USER.xp)} • {CURRENT_USER.streak} day streak
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-blue-100 text-sm mb-1">Member since</div>
              <div className="text-white font-medium">
                {CURRENT_USER.joinedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="offline">Offline</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{CURRENT_USER.level} Level</span>
                      <span className="text-sm text-muted-foreground">
                        {formatXP(CURRENT_USER.xp)} / {formatXP(levelProgress.nextLevelXP)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${levelProgress.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{CURRENT_USER.streak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">87%</div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">156</div>
                      <div className="text-sm text-muted-foreground">Lessons Done</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedUser.firstName}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedUser.lastName}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>App Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: "light" | "dark" | "system") => 
                      handleSettingChange("theme", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">App display language</p>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value: "en" | "zh") => 
                      handleSettingChange("language", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>English</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="zh">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>中文</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for interactions</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={settings.soundEffects}
                      onCheckedChange={(checked) => 
                        handleSettingChange("soundEffects", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive app notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => 
                      handleSettingChange("notifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reminder</Label>
                    <p className="text-sm text-muted-foreground">Remind me to practice daily</p>
                  </div>
                  <Switch
                    checked={settings.dailyReminder}
                    onCheckedChange={(checked) => 
                      handleSettingChange("dailyReminder", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Progress Report</Label>
                    <p className="text-sm text-muted-foreground">Send weekly progress summaries</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => 
                      handleSettingChange("weeklyReport", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offline" className="space-y-6">
            {/* PWA Installation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>App Installation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        isInstalled ? "bg-secondary" : isInstallable ? "bg-accent" : "bg-muted-foreground"
                      )} />
                      <div>
                        <p className="font-medium">
                          {isInstalled ? "App Installed" : isInstallable ? "Install Available" : "Web Version"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isInstalled 
                            ? "SpeakWorld is installed on your device" 
                            : isInstallable 
                            ? "Install for better offline experience"
                            : "Using web version of SpeakWorld"
                          }
                        </p>
                      </div>
                    </div>
                    {isInstallable && !isInstalled && (
                      <Button onClick={handleInstallPWA}>
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offline Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Offline Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable offline learning capabilities
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={settings.offlineMode}
                      onCheckedChange={(checked) => 
                        handleSettingChange("offlineMode", checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Download All Lessons</span>
                    <Button onClick={downloadOfflineContent}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Download lessons for offline access. Recommended for areas with limited internet.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Storage Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Connection Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Current network status
                    </p>
                  </div>
                  <Badge className={isOnline ? "bg-secondary" : "bg-accent"}>
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cached Data</p>
                      <p className="text-sm text-muted-foreground">
                        {formatBytes(cacheSize)} stored locally
                      </p>
                    </div>
                    <Button variant="outline" onClick={clearCache}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Clearing cache will remove offline content and require re-downloading
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Collection</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      We collect learning progress data to improve your experience and provide personalized recommendations.
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Learning progress and scores</li>
                      <li>• Time spent on lessons</li>
                      <li>• Vocabulary practice data</li>
                      <li>• App usage patterns</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Data Storage</h4>
                    <p className="text-sm text-muted-foreground">
                      Your learning data is stored locally on your device and optionally synced to our secure servers for backup and cross-device access.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
