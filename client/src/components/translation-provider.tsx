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
  'Speaking Zone': '口语区',
  'Games': '游戏',
  'Progress': '进度',
  'Achievements': '成就',
  'Profile': '个人资料',
  'Settings': '设置',
  'Daily Challenge': '每日挑战',
  'English for Life': '生活英语',
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
  'Start': '开始',
  'Finish': '完成',
  'Close': '关闭',
  'Open': '打开',
  
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
  'Chapter': '章节',
  'Score': '分数',
  'Difficulty': '难度',
  'Time Limit': '时间限制',
  'Instructions': '说明',
  'Example': '例子',
  'Tip': '提示',
  'Hint': '暗示',
  'Feedback': '反馈',
  
  // Levels
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
  
  // Daily Challenge Specific
  'Mid-Autumn Festival': '中秋节',
  'Speaking Challenge': '口语挑战',
  'Record your response': '录制你的回答',
  'Word count': '字数',
  'Time remaining': '剩余时间',
  'Start Recording': '开始录音',
  'Stop Recording': '停止录音',
  'Submit Response': '提交回答',
  'Recording...': '录音中...',
  'Your Progress': '你的进度',
  'Challenge completed!': '挑战完成！',
  'Great job completing today\'s challenge!': '很好地完成了今天的挑战！',
  'minutes': '分钟',
  'words': '个词',
  'Type your response here...': '在这里输入你的回答...',
  
  // Learning Paths
  'Beginner': '初学者',
  'Intermediate': '中级',
  'Advanced': '高级',
  'Unit': '单元',
  'Lesson': '课程',
  'lessons completed': '课程已完成',
  'XP earned': 'XP 获得',
  'minutes studied': '学习分钟',
  
  // Games and Activities
  'Interactive Games': '互动游戏',
  'Vocabulary Games': '词汇游戏',
  'Cultural Content': '文化内容',
  'AI Conversation': 'AI 对话',
  'Voice Translator': '语音翻译器',
  'Pronunciation Practice': '发音练习',
  'Reading Comprehension': '阅读理解',
  'Writing Assistant': '写作助手',
  'AI Debates': 'AI 辩论',
  'Group Activities': '小组活动',
  'Virtual Classroom': '虚拟教室',
  'Social Learning': '社交学习',
  'Cultural Immersion': '文化沉浸',
  
  // User Interface  
  'XP': '经验值',
  'Badge': '徽章',
  'Streak': '连击',
  'Points': '积分',
  'Rank': '排名',
  'Leaderboard': '排行榜',
  'Friends': '朋友',
  'Groups': '群组',
  
  // Time and Status
  'Online': '在线',
  'Offline': '离线',
  'Today': '今天',
  'Yesterday': '昨天',
  'This week': '本周',
  'This month': '本月',
  'All time': '全部时间',
  'Recent': '最近',
  'New': '新的',
  'Updated': '已更新',
  'Loading...': '加载中...',
  'Error': '错误',
  'Success': '成功',
  
  // Page Headings and Subheadings
  'Welcome to SpeakWorld': '欢迎来到 SpeakWorld',
  'Your Learning Journey': '你的学习之旅',
  'Today\'s Progress': '今日进度',
  'Quick Access': '快速访问',
  'Learning Statistics': '学习统计',
  'Recent Activity': '最近活动',
  'Recommended for You': '为你推荐',
  'Choose Your Path': '选择你的路径',
  'All Levels': '所有级别',
  'Popular Activities': '热门活动',
  'Cultural Topics': '文化话题',
  'Practice Areas': '练习区域',
  'Achievement Gallery': '成就展厅',
  'Your Badges': '你的徽章',
  'Learning Streaks': '学习连击',
  'Performance Analytics': '表现分析',
  'Weekly Summary': '每周总结',
  'Monthly Report': '月度报告',
  'Skill Development': '技能发展',
  'Pronunciation Score': '发音分数',
  'Vocabulary Growth': '词汇增长',
  'Grammar Accuracy': '语法准确性',
  'Speaking Fluency': '口语流利度',
  'Listening Comprehension': '听力理解',
  'Reading Speed': '阅读速度',
  'Writing Quality': '写作质量',
  
  // Learning Path Specific
  'Course Overview': '课程概览',
  'Learning Objectives': '学习目标',
  'Lesson Plan': '课程计划',
  'Study Materials': '学习材料',
  'Practice Exercises': '练习题',
  'Assessment Tools': '评估工具',
  'Progress Tracking': '进度跟踪',
  'Completion Status': '完成状态',
  'Next Steps': '下一步',
  'Prerequisites': '先决条件',
  
  // Game and Activity Titles
  'Interactive Learning': '互动学习',
  'Language Games': '语言游戏',
  'Cultural Exploration': '文化探索',
  'Real-world Practice': '真实场景练习',
  'Conversation Simulation': '对话模拟',
  'Pronunciation Training': '发音训练',
  'Vocabulary Builder': '词汇建设者',
  'Grammar Workshop': '语法工作坊',
  'Listening Lab': '听力实验室',
  'Speaking Studio': '口语工作室',
  'Reading Corner': '阅读角',
  'Writing Center': '写作中心',
  
  // Presentation Topics
  'My Chinese Startup Idea': '我的中国创业想法',
  'Introducing Chinese Culture to International Students': '向国际学生介绍中国文化',
  'The Future of AI in Chinese Education': 'AI在中国教育中的未来',
  'Green Living in Chinese Cities': '中国城市的绿色生活',
  'Traditional vs Modern China': '传统与现代中国',
  
  // Festival and Cultural Content
  'Spring Festival Traditions': '春节传统',
  'Dragon Boat Festival': '端午节',
  'Qingming Festival': '清明节',
  'Chinese Tea Culture': '中国茶文化',
  'Martial Arts Heritage': '武术传承',
  'Calligraphy Art': '书法艺术',
  'Traditional Medicine': '传统医学',
  'Chinese Cuisine': '中华料理',
  'Architecture Styles': '建筑风格',
  'Folk Music': '民间音乐',
  
  // Teacher and Student Mode
  'Teacher': '教师',
  'Student': '学生',
  'Teacher Mode': '教师模式',
  'Student Mode': '学生模式',
  'Teacher Dashboard': '教师仪表板',
  'Student Dashboard': '学生仪表板',
  'Manage your classroom and track student progress': '管理您的教室并跟踪学生进度',
  'Create Assignment': '创建作业',
  'Export Reports': '导出报告',
  'Total Students': '学生总数',
  'Class Average': '班级平均分',
  'Completed Lessons': '已完成课程',
  'Pending Assignments': '待处理作业',
  'active today': '今日活跃',
  'from last week': '相比上周',
  'This semester': '本学期',
  'Need review': '需要审查',
  'Students': '学生',
  'Assignments': '作业',
  'Analytics': '分析',
  'Recent Student Activity': '最近学生活动',
  'Last active:': '最后活跃：',
  'Assignment Management': '作业管理',
  'Due:': '截止日期：',
  'submitted': '已提交',
  'Active': '活跃',
  'Completed': '已完成',
  'Review': '审查',
  'Class Performance': '班级表现',
  'Weekly Activity': '每周活动',
  'Speaking Exercises': '口语练习',
  'Cultural Activities': '文化活动',
  'AI Conversations': 'AI 对话',
  'Classroom Settings': '教室设置',
  'Assignment Defaults': '作业默认设置',
  'Default Due Date': '默认截止日期',
  'Auto-grading': '自动评分',
  'Notification Preferences': '通知偏好',
  'New submissions': '新提交',
  'Low participation': '参与度低',
  'Weekly reports': '每周报告',
  
  // Common UI Elements
  'Welcome': '欢迎',
  'Hello': '你好',
  'Goodbye': '再见',
  'Thank you': '谢谢',
  'Please': '请',
  'Yes': '是',
  'No': '否',
  'OK': '好的',
  'Help': '帮助',
  'About': '关于',
  'Contact': '联系',
  'Privacy': '隐私',
  'Terms': '条款',
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