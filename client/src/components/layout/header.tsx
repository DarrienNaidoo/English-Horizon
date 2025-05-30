import { Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import OfflineIndicator from "@/components/pwa/offline-indicator";

// Mock user data - in real app this would come from auth context
const CURRENT_USER = {
  firstName: "Li",
  lastName: "Wei",
  level: "Level 5",
  xp: 1250,
  initials: "LW"
};

const navigationItems = [
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/speaking-zone", label: "Speaking Zone" },
  { href: "/games", label: "Games" },
  { href: "/progress", label: "Progress" },
];

function NavigationMenu({ className, onItemClick }: { className?: string; onItemClick?: () => void }) {
  const [location] = useLocation();

  return (
    <nav className={cn("flex items-center space-x-8", className)}>
      {navigationItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "text-muted-foreground hover:text-primary transition-colors",
              location === item.href && "text-primary font-medium"
            )}
            onClick={onItemClick}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Globe className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>SpeakWorld</h1>
                <p className="text-xs text-muted-foreground">English for Life</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex" />

          {/* User Profile and Status */}
          <div className="flex items-center space-x-4">
            {/* Offline Status Indicator */}
            <OfflineIndicator />
            
            {/* User Avatar */}
            <Link href="/profile">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold">
                    {CURRENT_USER.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {CURRENT_USER.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {CURRENT_USER.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="pb-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                          {CURRENT_USER.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {CURRENT_USER.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {CURRENT_USER.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <NavigationMenu 
                    className="flex-col items-start space-x-0 space-y-2"
                    onItemClick={() => setMobileMenuOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
