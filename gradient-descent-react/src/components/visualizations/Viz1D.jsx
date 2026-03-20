import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { f, df, clamp } from '../../utils/math';
import { Particle } from '../../utils/Particle';
import {
  setupHiDPI, clearCanvas, drawGrid, drawGlowDot,
  drawArrow, drawCurveWithFill, drawTrail, drawLossChart, drawHUD
} from '../../utils/canvas';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import VizControls from './VizControls';

const W = 740, H = 420, LW = 740, LH = 120;
const pad = { t: 30, r: 30, b: 40, l: 50 };
const xMin = -1.5, xMax = 4, yMin = -5, yMax = 15;

const mapX = (x) => pad.l + (x - xMin) / (xMax - xMin) * (W - pad.l - pad.r);
const mapY = (y) => pad.t + (1 - (y - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);

export default function Viz1D() {
  const canvasRef = useRef(null);
  const lossRef = useRef(null);
  const [lr, setLr] = useState(0.012);
  const [startX, setStartX] = useState(-0.5);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({ points: [], particles: [], lossHistory: [], x: 0 });
  const { start, stop } = useAnimationFrame();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const lossCanvas = lossRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    clearCanvas(ctx, canvas, W, H);
    drawGrid(ctx, W, H, pad, xMin, xMax, yMin, yMax);

    // zero axis
    const y0 = mapY(0);
    ctx.strokeStyle = 'rgba(162,155,254,.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y0); ctx.lineTo(W - pad.r, y0); ctx.stroke();
    ctx.setLineDash([]);

    // curve
    drawCurveWithFill(ctx, f, W, H, pad, xMin, xMax, yMin, yMax, '#6c5ce7', true);

    // label
    ctx.fillStyle = 'rgba(162,155,254,.6)';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('f(x) = x\u2074 \u2212 3x\u00B3 + 2', pad.l + 6, pad.t + 18);

    const pts = stateRef.current.points;

    // trail
    drawTrail(ctx, pts, mapX, mapY, '#00cec9');

    // past dots
    for (let i = 0; i < pts.length - 1; i++) {
      const alpha = 0.15 + 0.6 * (i / pts.length);
      ctx.fillStyle = `rgba(0,206,201,${alpha})`;
      ctx.beginPath();
      ctx.arc(mapX(pts[i].x), mapY(pts[i].y), 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // current point
    if (pts.length > 0) {
      const last = pts[pts.length - 1];
      const px = mapX(last.x), py = mapY(last.y);

      // tangent line
      const grad = df(last.x);
      const tangentLen = 50;
      const normG = Math.sqrt(1 + grad * grad);
      const dx = tangentLen / normG;
      const dy = tangentLen * grad / normG;
      ctx.strokeStyle = 'rgba(253,121,168,.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(px - dx, py + dy * (yMax - yMin) / (xMax - xMin) * 0.15);
      ctx.lineTo(px + dx, py - dy * (yMax - yMin) / (xMax - xMin) * 0.15);
      ctx.stroke();
      ctx.setLineDash([]);

      // gradient arrow
      const arrowScale = clamp(Math.abs(grad) * 3, 5, 60);
      const arrowDir = -Math.sign(grad);
      drawArrow(ctx, px, py - 18, px + arrowDir * arrowScale, py - 18, '#fd79a8', 2);
      ctx.fillStyle = '#fd79a8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('\u2212\u2207f', px + arrowDir * arrowScale * 0.5, py - 28);
      ctx.textAlign = 'start';

      drawGlowDot(ctx, px, py, 7, '#00cec9', 28);

      // HUD
      drawHUD(ctx, W, H, pad, [
        `Step ${pts.length - 1}`,
        `x=${last.x.toFixed(4)}  f(x)=${last.y.toFixed(4)}`
      ]);
    }

    // particles
    const particles = stateRef.current.particles;
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (!particles[i].alive) particles.splice(i, 1);
    }

    // loss chart
    if (lossCanvas) {
      const lctx = lossCanvas.getContext('2d');
      drawLossChart(lctx, LW, LH, stateRef.current.lossHistory);
    }
  }, []);

  const handleRun = useCallback(() => {
    if (running) return;
    setRunning(true);
    let x = startX;
    stateRef.current.points = [{ x, y: f(x) }];
    stateRef.current.lossHistory = [f(x)];
    stateRef.current.particles = [];
    let step = 0;
    let prevX = x;

    start(() => {
      if (step > 300) { setRunning(false); return false; }
      const g = df(x);
      x = clamp(x - lr * g, xMin, xMax);
      stateRef.current.points.push({ x, y: f(x) });
      stateRef.current.lossHistory.push(f(x));

      if (Math.abs(x - prevX) > 0.05) {
        const px = mapX(x), py = mapY(f(x));
        for (let i = 0; i < 5; i++) stateRef.current.particles.push(new Particle(px, py, '#00cec9'));
      }
      prevX = x;
      draw();
      step++;
    });
  }, [lr, startX, running, start, draw]);

  const handleReset = useCallback(() => {
    stop();
    setRunning(false);
    stateRef.current.points = [];
    stateRef.current.lossHistory = [];
    stateRef.current.particles = [];
    draw();
  }, [stop, draw]);

  useEffect(() => {
    if (canvasRef.current) setupHiDPI(canvasRef.current, W, H);
    if (lossRef.current) setupHiDPI(lossRef.current, LW, LH);
    draw();
  }, [draw]);

  return (
    <motion.div
      className="viz-container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <h4><span className="dot" /> Live 1D Optimization</h4>
      <canvas ref={canvasRef} style={{ width: W, height: H, borderRadius: 10 }} />
      <canvas ref={lossRef} style={{ width: LW, height: LH, borderRadius: 10, marginTop: 8 }} />
      <VizControls
        sliders={[
          { label: 'Learning Rate', value: lr, min: 0.001, max: 0.08, step: 0.001, onChange: setLr, format: v => v.toFixed(3) },
          { label: 'Start X', value: startX, min: -1, max: 3.5, step: 0.1, onChange: setStartX, format: v => v.toFixed(1) },
        ]}
        onRun={handleRun}
        onReset={handleReset}
        running={running}
      />
    </motion.div>
  );
}
