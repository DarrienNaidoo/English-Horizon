import { Globe, Menu, Languages, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import OfflineIndicator from "@/components/pwa/offline-indicator";
import { TranslatableText, useTranslation, TranslationControls } from "@/components/translation-provider";
import { ModeSelector, ModeIndicator } from "@/components/mode-selector";

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

// Language selector component
function LanguageSelector() {
  const { currentLanguage, toggleLanguage, showTranslations, toggleTranslations } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Languages className="h-4 w-4" />
          <span>{currentLanguage === 'en' ? 'EN' : '中文'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={toggleLanguage}>
          <Globe className="h-4 w-4 mr-2" />
          <span>Switch to {currentLanguage === 'en' ? '中文 (Chinese)' : 'English'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTranslations}>
          <Languages className="h-4 w-4 mr-2" />
          <span>{showTranslations ? 'Hide' : 'Show'} Translation Hints</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Translation Settings</span>
        </DropdownMenuItem>
        {showSettings && (
          <div className="p-3 border-t">
            <TranslationControls />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
            <TranslatableText>{item.label}</TranslatableText>
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
                <h1 className="text-xl font-bold text-blue-600">SpeakWorld</h1>
                <p className="text-xs text-muted-foreground">
                  <TranslatableText>English for Life</TranslatableText>
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex" />

          {/* User Profile and Status */}
          <div className="flex items-center space-x-4">
            {/* Mode Selector */}
            <ModeSelector />
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
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
                  
                  <div className="pt-4 border-t border-border">
                    <div className="space-y-4">
                      <ModeSelector />
                      <LanguageSelector />
                      <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <OfflineIndicator />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
