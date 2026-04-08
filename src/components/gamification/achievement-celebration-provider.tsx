"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import {
  AchievementCelebration,
  type AchievementCelebrationData,
} from "./achievement-celebration";

interface CelebrationContextValue {
  celebrate: (data: AchievementCelebrationData) => void;
  celebrateMultiple: (items: AchievementCelebrationData[]) => void;
}

const CelebrationContext = createContext<CelebrationContextValue>({
  celebrate: () => {},
  celebrateMultiple: () => {},
});

export function useCelebration() {
  return useContext(CelebrationContext);
}

export function AchievementCelebrationProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<AchievementCelebrationData[]>([]);
  const [current, setCurrent] = useState<AchievementCelebrationData | null>(null);

  const showNext = useCallback((q: AchievementCelebrationData[]) => {
    if (q.length === 0) {
      setCurrent(null);
      return;
    }
    const [next, ...rest] = q;
    setCurrent(next);
    setQueue(rest);
  }, []);

  const celebrate = useCallback(
    (data: AchievementCelebrationData) => {
      if (!current) {
        setCurrent(data);
      } else {
        setQueue((prev) => [...prev, data]);
      }
    },
    [current]
  );

  const celebrateMultiple = useCallback(
    (items: AchievementCelebrationData[]) => {
      if (items.length === 0) return;
      if (!current) {
        const [first, ...rest] = items;
        setCurrent(first);
        setQueue((prev) => [...prev, ...rest]);
      } else {
        setQueue((prev) => [...prev, ...items]);
      }
    },
    [current]
  );

  const handleClose = useCallback(() => {
    // Show next in queue after a brief pause
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(null);
      setTimeout(() => {
        setCurrent(next);
        setQueue(rest);
      }, 400);
    } else {
      setCurrent(null);
    }
  }, [queue]);

  return (
    <CelebrationContext.Provider value={{ celebrate, celebrateMultiple }}>
      {children}
      <AchievementCelebration data={current} onClose={handleClose} />
    </CelebrationContext.Provider>
  );
}
