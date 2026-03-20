import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { f, df, clamp, optimizerStep, createOptimizerState, OPTIMIZER_COLORS, OPTIMIZER_NAMES } from '../../utils/math';
import { Particle } from '../../utils/Particle';
import { setupHiDPI, clearCanvas, drawGrid, drawGlowDot, drawCurveWithFill, drawTrail } from '../../utils/canvas';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import VizControls from './VizControls';

const W = 740, H = 400, LW = 740, LH = 160;
const pad = { t: 30, r: 30, b: 40, l: 50 };
const xMin = -1.5, xMax = 4, yMin = -5, yMax = 15;
const mapX = (x) => pad.l + (x - xMin) / (xMax - xMin) * (W - pad.l - pad.r);
const mapY = (y) => pad.t + (1 - (y - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);
const KEYS = ['sgd', 'momentum', 'rmsprop', 'adam'];

export default function VizRace() {
  const canvasRef = useRef(null);
  const lossRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState('');
  const stateRef = useRef({ opts: createOptimizerState(), particles: [] });
  const { start, stop } = useAnimationFrame();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    clearCanvas(ctx, canvas, W, H);
    drawGrid(ctx, W, H, pad, xMin, xMax, yMin, yMax);

    // curve
    drawCurveWithFill(ctx, f, W, H, pad, xMin, xMax, yMin, yMax, '#3a3560', true);

    const opts = stateRef.current.opts;
    for (const key of KEYS) {
      const o = opts[key];
      if (!o) continue;
      const c = OPTIMIZER_COLORS[key];

      drawTrail(ctx, o.history, mapX, mapY, c);

      if (o.history.length > 0) {
        const last = o.history[o.history.length - 1];
        drawGlowDot(ctx, mapX(last.x), mapY(last.y), 6, c, 22);
        ctx.fillStyle = c;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(OPTIMIZER_NAMES[key], mapX(last.x) + 14, mapY(last.y) - 6);
      }
    }

    // particles
    const particles = stateRef.current.particles;
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (!particles[i].alive) particles.splice(i, 1);
    }

    // Loss convergence chart
    const lc = lossRef.current;
    if (!lc) return;
    const lctx = lc.getContext('2d');
    lctx.save(); lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, lc.width, lc.height); lctx.restore();
    lctx.fillStyle = '#0c0c14';
    lctx.fillRect(0, 0, LW, LH);

    const lPad = { l: 50, r: 20, t: 28, b: 30 };
    let maxL = 0, maxLen = 0;
    for (const key of KEYS) {
      if (opts[key]) {
        maxL = Math.max(maxL, ...opts[key].loss);
        maxLen = Math.max(maxLen, opts[key].loss.length);
      }
    }
    if (maxLen < 2) return;

    // grid
    lctx.strokeStyle = 'rgba(108,92,231,.06)';
    lctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = lPad.t + i / 4 * (LH - lPad.t - lPad.b);
      lctx.beginPath(); lctx.moveTo(lPad.l, y); lctx.lineTo(LW - lPad.r, y); lctx.stroke();
    }
    lctx.fillStyle = '#555';
    lctx.font = 'bold 11px Inter, sans-serif';
    lctx.textAlign = 'left';
    lctx.fillText('Loss Convergence', lPad.l + 4, lPad.t - 10);

    // legend
    let lx = LW - lPad.r - 320;
    for (const key of KEYS) {
      lctx.fillStyle = OPTIMIZER_COLORS[key];
      lctx.beginPath(); lctx.arc(lx, lPad.t - 12, 4, 0, Math.PI * 2); lctx.fill();
      lctx.font = '10px Inter, sans-serif'; lctx.textAlign = 'left';
      lctx.fillText(OPTIMIZER_NAMES[key], lx + 8, lPad.t - 8);
      lx += 70;
    }

    for (const key of KEYS) {
      if (!opts[key]) continue;
      const losses = opts[key].loss;
      lctx.beginPath();
      for (let i = 0; i < losses.length; i++) {
        const x = lPad.l + i / (maxLen - 1) * (LW - lPad.l - lPad.r);
        const y = lPad.t + (1 - losses[i] / (maxL + 0.001)) * (LH - lPad.t - lPad.b);
        if (i === 0) lctx.moveTo(x, y); else lctx.lineTo(x, y);
      }
      lctx.strokeStyle = OPTIMIZER_COLORS[key];
      lctx.lineWidth = 2;
      lctx.shadowColor = OPTIMIZER_COLORS[key];
      lctx.shadowBlur = 4;
      lctx.stroke();
      lctx.shadowBlur = 0;
    }
  }, []);

  const handleRun = useCallback(() => {
    if (running) return;
    setRunning(true);
    setWinner('');
    const opts = createOptimizerState();
    stateRef.current.opts = opts;
    stateRef.current.particles = [];
    let step = 0;
    const lr = 0.01;
    let foundWinner = '';

    start(() => {
      if (step > 300) { setRunning(false); return false; }

      for (const key of KEYS) {
        optimizerStep[key](opts[key], lr);
        opts[key].history.push({ x: opts[key].x, y: f(opts[key].x) });
        opts[key].loss.push(f(opts[key].x));
      }

      if (!foundWinner) {
        for (const key of KEYS) {
          const lastLoss = opts[key].loss[opts[key].loss.length - 1];
          if (lastLoss < -3.9) {
            foundWinner = OPTIMIZER_NAMES[key];
            setWinner(foundWinner);
            const lp = opts[key].history[opts[key].history.length - 1];
            for (let i = 0; i < 30; i++) {
              stateRef.current.particles.push(new Particle(mapX(lp.x), mapY(lp.y), OPTIMIZER_COLORS[key]));
            }
          }
        }
      }

      draw();
      step++;
    });
  }, [running, start, draw]);

  const handleReset = useCallback(() => {
    stop();
    setRunning(false);
    setWinner('');
    stateRef.current.opts = createOptimizerState();
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
      <h4><span className="dot" /> Optimizer Comparison Race</h4>
      <canvas ref={canvasRef} style={{ width: W, height: H, borderRadius: 10 }} />
      <canvas ref={lossRef} style={{ width: LW, height: LH, borderRadius: 10, marginTop: 8 }} />

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              textAlign: 'center', padding: '12px',
              background: 'rgba(108,92,231,.12)', borderRadius: 10,
              margin: '12px 0', fontSize: '.9rem', fontWeight: 700, color: '#a29bfe'
            }}
          >
            🏆 Winner: {winner}!
          </motion.div>
        )}
      </AnimatePresence>

      <VizControls onRun={handleRun} onReset={handleReset} running={running}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginLeft: 12, alignItems: 'center' }}>
          {KEYS.map((k) => (
            <span key={k} style={{ fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: OPTIMIZER_COLORS[k], display: 'inline-block',
                boxShadow: `0 0 8px ${OPTIMIZER_COLORS[k]}`
              }} />
              {OPTIMIZER_NAMES[k]}
            </span>
          ))}
        </div>
      </VizControls>
    </motion.div>
  );
}
