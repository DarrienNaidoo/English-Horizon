import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
  showText?: boolean;
}

export default function OfflineIndicator({ className, showText = true }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "status-indicator",
        isOnline ? "status-online" : "status-offline"
      )} />
      {showText && (
        <span className="text-sm text-muted-foreground hidden sm:block">
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
      {!isOnline && (
        <Badge variant="outline" className="text-xs bg-muted">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline Mode
        </Badge>
      )}
    </div>
  );
}
