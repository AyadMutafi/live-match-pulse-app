import { useState, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.4, 120));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !refreshing) {
      setRefreshing(true);
      setPullDistance(50);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
    setPulling(false);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {(pullDistance > 0 || refreshing) && (
        <motion.div
          className="flex justify-center items-center py-2"
          style={{ height: pullDistance }}
          animate={{ opacity: pullDistance > 20 ? 1 : 0 }}
        >
          <motion.div
            animate={{ rotate: refreshing ? 360 : pullDistance * 3 }}
            transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0 }}
          >
            <RefreshCw className={`w-5 h-5 ${pullDistance >= threshold || refreshing ? "text-primary" : "text-muted-foreground"}`} />
          </motion.div>
        </motion.div>
      )}
      {children}
    </div>
  );
}
