import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages, Globe } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface TranslationToggleProps {
  className?: string;
}

export default function TranslationToggle({ className }: TranslationToggleProps) {
  const [translationMode, setTranslationMode] = useLocalStorage("translationMode", "both");

  const modes = [
    { id: "en", label: "English Only", icon: "🇺🇸", description: "Show content in English" },
    { id: "both", label: "English + Chinese", icon: "🌏", description: "Show content with translations" },
    { id: "zh", label: "Chinese Only", icon: "🇨🇳", description: "Show content in Chinese" }
  ];

  const currentMode = modes.find(mode => mode.id === translationMode) || modes[1];

  const cycleMode = () => {
    const currentIndex = modes.findIndex(mode => mode.id === translationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTranslationMode(modes[nextIndex].id);
  };

  return (
    <Button
      variant="ghost"
      onClick={cycleMode}
      className={`flex items-center space-x-2 ${className}`}
      title={currentMode.description}
    >
      <Languages className="w-4 h-4" />
      <span className="hidden sm:inline">{currentMode.label}</span>
      <span className="text-lg">{currentMode.icon}</span>
    </Button>
  );
}

// Translation text component
interface TranslatedTextProps {
  english: string;
  chinese?: string;
  className?: string;
  showBoth?: boolean;
}

export function TranslatedText({ english, chinese, className, showBoth }: TranslatedTextProps) {
  const [translationMode] = useLocalStorage("translationMode", "both");

  const renderText = () => {
    if (showBoth || translationMode === "both") {
      return (
        <span className={className}>
          {english}
          {chinese && (
            <span className="text-medium-custom ml-2">
              ({chinese})
            </span>
          )}
        </span>
      );
    } else if (translationMode === "zh" && chinese) {
      return <span className={className}>{chinese}</span>;
    } else {
      return <span className={className}>{english}</span>;
    }
  };

  return renderText();
}

// Vocabulary card with translation
interface VocabularyCardProps {
  english: string;
  chinese: string;
  pronunciation?: string;
  example?: string;
  className?: string;
}

export function VocabularyCard({ 
  english, 
  chinese, 
  pronunciation, 
  example, 
  className 
}: VocabularyCardProps) {
  const [translationMode] = useLocalStorage("translationMode", "both");
  const [showPronunciation, setShowPronunciation] = useState(false);

  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          {(translationMode === "en" || translationMode === "both") && (
            <div className="text-lg font-semibold text-dark-custom">{english}</div>
          )}
          {(translationMode === "zh" || translationMode === "both") && (
            <div className="text-lg font-medium text-cultural-custom">{chinese}</div>
          )}
        </div>
        {pronunciation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPronunciation(!showPronunciation)}
            className="text-xs"
          >
            {showPronunciation ? "Hide" : "Pronunciation"}
          </Button>
        )}
      </div>
      
      {showPronunciation && pronunciation && (
        <div className="text-sm text-medium-custom mb-2 font-mono">
          /{pronunciation}/
        </div>
      )}
      
      {example && (
        <div className="text-sm text-medium-custom italic">
          <TranslatedText english={example} />
        </div>
      )}
    </div>
  );
}

// Static translations dictionary
export const translations = {
  // Common UI terms
  "Dashboard": "仪表板",
  "Learning Paths": "学习路径", 
  "Speaking Zone": "口语练习区",
  "Games": "游戏",
  "Progress": "进度",
  "Teacher Mode": "教师模式",
  "Student Mode": "学生模式",
  
  // Learning terms
  "Lesson": "课程",
  "Exercise": "练习",
  "Vocabulary": "词汇",
  "Grammar": "语法",
  "Pronunciation": "发音",
  "Speaking": "口语",
  "Listening": "听力",
  "Reading": "阅读",
  "Writing": "写作",
  
  // Common actions
  "Start": "开始",
  "Continue": "继续",
  "Complete": "完成",
  "Practice": "练习",
  "Review": "复习",
  "Save": "保存",
  "Cancel": "取消",
  "Next": "下一个",
  "Previous": "上一个",
  
  // Progress terms
  "Level": "等级",
  "XP": "经验值",
  "Streak": "连续学习天数",
  "Badges": "徽章",
  "Achievement": "成就",
  "Score": "分数",
  
  // Time terms
  "Today": "今天",
  "Week": "周",
  "Month": "月",
  "Day": "天",
  "Hour": "小时",
  "Minute": "分钟",
  
  // Cultural terms
  "Chinese New Year": "春节",
  "Mid-Autumn Festival": "中秋节",
  "Dragon Boat Festival": "端午节",
  "Traditional": "传统的",
  "Culture": "文化",
  "Festival": "节日",
  "Family": "家庭",
  "Celebration": "庆祝"
};

// Helper function to get translation
export function getTranslation(key: string): string {
  return translations[key as keyof typeof translations] || key;
}