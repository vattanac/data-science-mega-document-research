import { useRef, useEffect, useCallback } from 'react';
import { setupHiDPI } from '../utils/canvas';

export function useHiDPICanvas(width, height) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      setupHiDPI(canvasRef.current, width, height);
    }
  }, [width, height]);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  return { canvasRef, getCtx };
}
