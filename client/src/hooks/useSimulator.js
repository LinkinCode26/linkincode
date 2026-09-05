import { useState, useCallback } from "react";

export function useSimulator() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const resetSimulator = useCallback(() => {
    setResetKey((prev) => prev + 1);
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    resetSimulator,
    resetKey,
  };
}
