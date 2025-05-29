import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, Route, Mic, Gamepad2, TrendingUp, 
  Presentation, Menu, X, Brain 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/use-local-storage";
import TranslationToggle from "@/components/translation-toggle";
import type { User } from "@shared/schema";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTeacherMode, setIsTeacherMode] = useLocalStorage("teacherMode", false);
  const [currentUserId] = useLocalStorage("currentUserId", 1);

  const { data: user } = useQuery<User>({
    queryKey: [`/api/user/${currentUserId}`],
  });

  const toggleTeacherMode = () => {
    setIsTeacherMode(!isTeacherMode);
    document.documentElement.style.fontSize = isTeacherMode ? '' : '1.2rem';
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/learning-paths", label: "Learning Paths", icon: Route },
    { path: "/speaking-zone", label: "Speaking Zone", icon: Mic },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/progress", label: "Progress", icon: TrendingUp },
  ];

  // Check if current user is a teacher
  const isTeacher = user?.role === "teacher";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg">
                SW
              </div>
              <span className="ml-3 text-xl font-bold text-dark-custom">SpeakWorld</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className={`font-medium transition-colors cursor-pointer ${
                    location === item.path 
                      ? 'text-primary-custom border-b-2 border-primary-custom pb-1' 
                      : 'text-medium-custom hover:text-dark-custom'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Translation Toggle */}
            <TranslationToggle className="hidden md:flex" />
            
            {/* Teacher Mode Access - Only show if user is teacher or in teacher mode */}
            {(isTeacher || isTeacherMode) && (
              <Link href="/teacher-mode">
                <Button 
                  variant="ghost"
                  className={`hidden lg:flex items-center space-x-2 transition-colors ${
                    location === "/teacher-mode" ? 'bg-primary-custom text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  <span className="text-sm">Teacher Mode</span>
                </Button>
              </Link>
            )}
            
            {/* Teacher Mode Toggle - Desktop */}
            <Button 
              variant="ghost"
              onClick={toggleTeacherMode}
              className={`hidden lg:flex items-center space-x-2 transition-colors ${
                isTeacherMode ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span className="text-sm">Projection</span>
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-dark-custom">
                  {user?.displayName || 'Student'}
                </div>
                <div className="text-xs text-medium-custom">
                  Level {user?.currentLevel || 1} • {user?.totalXP || 0} XP
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0) || 'S'}
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      location === item.path 
                        ? 'bg-primary-custom text-white' 
                        : 'text-medium-custom hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {/* Teacher Mode Access - Mobile */}
              {(isTeacher || isTeacherMode) && (
                <Link href="/teacher-mode">
                  <div 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      location === "/teacher-mode" 
                        ? 'bg-primary-custom text-white' 
                        : 'text-medium-custom hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Presentation className="w-5 h-5" />
                    <span>Teacher Mode</span>
                  </div>
                </Link>
              )}
              
              {/* Translation Toggle - Mobile */}
              <div className="px-3 py-2">
                <TranslationToggle className="w-full" />
              </div>
              
              {/* Projection Toggle - Mobile */}
              <Button 
                variant="ghost"
                onClick={toggleTeacherMode}
                className={`w-full justify-start space-x-3 px-3 py-2 ${
                  isTeacherMode ? 'bg-orange-500 text-white' : 'text-medium-custom hover:bg-gray-100'
                }`}
              >
                <Presentation className="w-5 h-5" />
                <span>Projection Mode</span>
                {isTeacherMode && <Badge variant="secondary" className="ml-auto">ON</Badge>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
