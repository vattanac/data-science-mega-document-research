import { useRef, useCallback, useEffect } from 'react';

export function useAnimationFrame() {
  const rafRef = useRef(null);
  const runningRef = useRef(false);

  const start = useCallback((callback) => {
    if (runningRef.current) return;
    runningRef.current = true;

    const tick = () => {
      if (!runningRef.current) return;
      const shouldContinue = callback();
      if (shouldContinue === false) {
        runningRef.current = false;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, isRunning: runningRef };
}
