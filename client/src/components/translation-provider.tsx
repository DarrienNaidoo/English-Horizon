import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Languages, Volume2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranslationContextType {
  currentLanguage: 'en' | 'zh';
  showTranslations: boolean;
  translationMode: 'hover' | 'click' | 'always';
  toggleLanguage: () => void;
  toggleTranslations: () => void;
  setTranslationMode: (mode: 'hover' | 'click' | 'always') => void;
  translate: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Built-in translation dictionary for common educational terms
const translations: Record<string, string> = {
  // Interface Elements
  'Dashboard': '仪表板',
  'Learning Paths': '学习路径',
  'Progress': '进度',
  'Achievements': '成就',
  'Profile': '个人资料',
  'Settings': '设置',
  'Daily Challenge': '每日挑战',
  'Start Learning': '开始学习',
  'Continue': '继续',
  'Complete': '完成',
  'Next': '下一个',
  'Previous': '上一个',
  'Skip': '跳过',
  'Retry': '重试',
  'Submit': '提交',
  'Save': '保存',
  'Cancel': '取消',
  
  // Learning Content
  'Vocabulary': '词汇',
  'Grammar': '语法',
  'Listening': '听力',
  'Speaking': '口语',
  'Reading': '阅读',
  'Writing': '写作',
  'Pronunciation': '发音',
  'Conversation': '对话',
  'Exercise': '练习',
  'Quiz': '测验',
  'Lesson': '课程',
  'Unit': '单元',
  'Chapter': '章节',
  'Score': '分数',
  'Level': '级别',
  'Difficulty': '难度',
  'Time Limit': '时间限制',
  'Instructions': '说明',
  'Example': '例子',
  'Tip': '提示',
  'Hint': '暗示',
  'Feedback': '反馈',
  
  // Levels
  'Beginner': '初学者',
  'Intermediate': '中级',
  'Advanced': '高级',
  'Easy': '简单',
  'Medium': '中等',
  'Hard': '困难',
  
  // Common Actions
  'Listen': '听',
  'Speak': '说',
  'Read': '读',
  'Write': '写',
  'Practice': '练习',
  'Study': '学习',
  'Review': '复习',
  'Learn': '学',
  'Understand': '理解',
  'Remember': '记住',
  'Repeat': '重复',
  'Record': '录音',
  'Play': '播放',
  'Pause': '暂停',
  'Stop': '停止',
  
  // Cultural Content
  'Chinese Culture': '中国文化',
  'Traditional': '传统的',
  'Modern': '现代的',
  'Festival': '节日',
  'Food': '食物',
  'Family': '家庭',
  'School': '学校',
  'Work': '工作',
  'Travel': '旅行',
  'Technology': '技术',
  'Environment': '环境',
  'Society': '社会',
  
  // Common Phrases
  'Good luck!': '祝你好运！',
  'Well done!': '做得好！',
  'Try again': '再试一次',
  'Great job!': '很棒！',
  'Keep going': '继续加油',
  'You can do it!': '你能做到的！',
  'Practice makes perfect': '熟能生巧',
  
  // Error Messages
  'Please try again': '请再试一次',
  'Something went wrong': '出了点问题',
  'Check your answer': '检查你的答案',
  'Time is up': '时间到了',
  'Correct!': '正确！',
  'Incorrect': '不正确',
  
  // Navigation
  'Home': '首页',
  'Back': '返回',
  'Menu': '菜单',
  'Search': '搜索',
  'Filter': '筛选',
  'View': '查看',
  'Edit': '编辑',
  'Share': '分享',
  'Download': '下载',
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'zh'>('en');
  const [showTranslations, setShowTranslations] = useState(false);
  const [translationMode, setTranslationModeState] = useState<'hover' | 'click' | 'always'>('hover');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('speakworld-language') as 'en' | 'zh';
    const savedTranslations = localStorage.getItem('speakworld-show-translations') === 'true';
    const savedMode = localStorage.getItem('speakworld-translation-mode') as 'hover' | 'click' | 'always';
    
    if (savedLanguage) setCurrentLanguage(savedLanguage);
    if (savedTranslations !== null) setShowTranslations(savedTranslations);
    if (savedMode) setTranslationModeState(savedMode);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('speakworld-language', newLanguage);
  };

  const toggleTranslations = () => {
    const newValue = !showTranslations;
    setShowTranslations(newValue);
    localStorage.setItem('speakworld-show-translations', newValue.toString());
  };

  const setTranslationMode = (mode: 'hover' | 'click' | 'always') => {
    setTranslationModeState(mode);
    localStorage.setItem('speakworld-translation-mode', mode);
  };

  const translate = (text: string): string => {
    if (currentLanguage === 'en') return text;
    
    if (translations[text]) {
      return translations[text];
    }
    
    const lowerText = text.toLowerCase();
    const foundKey = Object.keys(translations).find(key => key.toLowerCase() === lowerText);
    if (foundKey) {
      return translations[foundKey];
    }
    
    return text;
  };

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      showTranslations,
      translationMode,
      toggleLanguage,
      toggleTranslations,
      setTranslationMode,
      translate
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Translation wrapper component for text elements
interface TranslatableTextProps {
  children: string;
  className?: string;
  showPinyin?: boolean;
}

export function TranslatableText({ children, className, showPinyin = false }: TranslatableTextProps) {
  const { currentLanguage, showTranslations, translationMode, translate } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const translatedText = translate(children);
  const hasTranslation = translatedText !== children;
  
  if (!hasTranslation && currentLanguage === 'en') {
    return <span className={className}>{children}</span>;
  }
  
  if (currentLanguage === 'zh') {
    return <span className={className}>{translatedText}</span>;
  }
  
  if (!showTranslations) {
    return <span className={className}>{children}</span>;
  }
  
  const handleMouseEnter = () => {
    if (translationMode === 'hover') setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    if (translationMode === 'hover') setShowTooltip(false);
  };
  
  const handleClick = () => {
    if (translationMode === 'click') setShowTooltip(!showTooltip);
  };
  
  return (
    <span 
      className={cn(
        className,
        hasTranslation && showTranslations && "relative cursor-help border-b border-dotted border-blue-400 transition-colors hover:border-blue-600"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {hasTranslation && showTranslations && (showTooltip || translationMode === 'always') && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm whitespace-nowrap">
            <div className="text-center">
              <div className="font-medium text-foreground">{translatedText}</div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover border-r border-b rotate-45"></div>
          </div>
        </div>
      )}
    </span>
  );
}

// Translation control panel component
export function TranslationControls() {
  const { 
    currentLanguage, 
    showTranslations, 
    translationMode, 
    toggleLanguage, 
    toggleTranslations, 
    setTranslationMode 
  } = useTranslation();
  
  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Language Interface</span>
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Languages className="h-4 w-4" />
            <span>{currentLanguage === 'en' ? 'English' : '中文'}</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Show Translations</span>
          <Button
            onClick={toggleTranslations}
            variant={showTranslations ? "default" : "outline"}
            size="sm"
          >
            {showTranslations ? 'On' : 'Off'}
          </Button>
        </div>
        
        {showTranslations && (
          <div className="space-y-2">
            <span className="font-medium text-sm">Translation Mode</span>
            <div className="flex space-x-2">
              {(['hover', 'click', 'always'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setTranslationMode(mode)}
                  variant={translationMode === mode ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {mode === 'hover' ? 'Hover' : mode === 'click' ? 'Click' : 'Always'}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quick translation button for learning content
export function QuickTranslateButton({ text, className }: { text: string; className?: string }) {
  const { translate } = useTranslation();
  const [showTranslation, setShowTranslation] = useState(false);
  const translatedText = translate(text);
  
  if (translatedText === text) return null;
  
  return (
    <div className={cn("relative inline-block", className)}>
      <Button
        onClick={() => setShowTranslation(!showTranslation)}
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
      >
        <Languages className="h-3 w-3" />
      </Button>
      {showTranslation && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <Badge variant="secondary" className="text-xs whitespace-nowrap">
            {translatedText}
          </Badge>
        </div>
      )}
    </div>
  );
}