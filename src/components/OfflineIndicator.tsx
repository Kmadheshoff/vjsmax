import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xl"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span className="whitespace-nowrap">Offline Mode — Cached episodes loaded</span>
    </div>
  );
}
