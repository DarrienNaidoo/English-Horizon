import { useOffline } from "@/hooks/use-offline";
import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span>Offline Mode - Your progress is saved locally</span>
      </div>
    </div>
  );
}
