import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Mic, 
  Gamepad2, 
  Users, 
  Flag, 
  BarChart3,
  Home,
  Languages,
  MessageCircle,
  Target,
  PenTool,
  Video
} from "lucide-react";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/learning-paths", label: "Learning Paths", icon: BookOpen },
  { href: "/speaking-zone", label: "Speaking Zone", icon: Mic },
  { href: "/voice-translator", label: "Voice Translator", icon: Languages },
  { href: "/ai-conversation", label: "AI Conversation", icon: MessageCircle },
  { href: "/vocabulary-games", label: "Vocabulary Games", icon: Target },
  { href: "/writing-assistant", label: "Writing Assistant", icon: PenTool },
  { href: "/virtual-classroom", label: "Virtual Classroom", icon: Video },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/group-activities", label: "Group Activities", icon: Users },
  { href: "/cultural-content", label: "Cultural Content", icon: Flag },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

interface NavigationProps {
  className?: string;
  vertical?: boolean;
  onItemClick?: () => void;
}

export default function Navigation({ className, vertical = false, onItemClick }: NavigationProps) {
  const [location] = useLocation();

  return (
    <nav className={cn(
      vertical ? "flex flex-col space-y-2" : "flex items-center space-x-4",
      className
    )}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "justify-start transition-colors",
                vertical ? "w-full" : "",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
              )}
              onClick={onItemClick}
            >
              <Icon className={cn("h-4 w-4", vertical ? "mr-2" : "")} />
              {vertical && <span>{item.label}</span>}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
