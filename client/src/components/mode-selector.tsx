import { useState, createContext, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { GraduationCap, Users, User, BookOpen, BarChart3, Settings } from 'lucide-react';
import { TranslatableText } from '@/components/translation-provider';

type UserMode = 'student' | 'teacher';

interface ModeContextType {
  currentMode: UserMode;
  switchMode: (mode: UserMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [currentMode, setCurrentMode] = useState<UserMode>('student');

  useEffect(() => {
    const savedMode = localStorage.getItem('speakworld-user-mode') as UserMode;
    if (savedMode) {
      setCurrentMode(savedMode);
    }
  }, []);

  const switchMode = (mode: UserMode) => {
    setCurrentMode(mode);
    localStorage.setItem('speakworld-user-mode', mode);
  };

  return (
    <ModeContext.Provider value={{ currentMode, switchMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a ModeProvider');
  }
  return context;
}

export function ModeSelector() {
  const { currentMode, switchMode } = useUserMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          {currentMode === 'teacher' ? (
            <GraduationCap className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span>
            <TranslatableText>{currentMode === 'teacher' ? 'Teacher' : 'Student'}</TranslatableText>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => switchMode('student')}>
          <User className="h-4 w-4 mr-2" />
          <span><TranslatableText>Student Mode</TranslatableText></span>
          {currentMode === 'student' && (
            <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchMode('teacher')}>
          <GraduationCap className="h-4 w-4 mr-2" />
          <span><TranslatableText>Teacher Mode</TranslatableText></span>
          {currentMode === 'teacher' && (
            <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModeIndicator() {
  const { currentMode } = useUserMode();

  if (currentMode === 'teacher') {
    return (
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <GraduationCap className="h-4 w-4" />
            <span className="font-medium text-sm">
              <TranslatableText>Teacher Dashboard</TranslatableText>
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}