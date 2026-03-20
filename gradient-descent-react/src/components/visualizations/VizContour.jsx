import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clamp, rosenbrock, dRosenX, dRosenY } from '../../utils/math';
import { Particle } from '../../utils/Particle';
import { setupHiDPI, drawGlowDot, drawArrow } from '../../utils/canvas';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import VizControls from './VizControls';

const W = 740, H = 500;
const cXmin = -2, cXmax = 2, cYmin = -1, cYmax = 3;
const mCX = (x) => (x - cXmin) / (cXmax - cXmin) * W;
const mCY = (y) => H - (y - cYmin) / (cYmax - cYmin) * H;

export default function VizContour() {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const [lr, setLr] = useState(0.0008);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({ path: [], particles: [] });
  const { start, stop } = useAnimationFrame();

  const renderBG = useCallback(() => {
    const offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const octx = offscreen.getContext('2d');
    const imgData = octx.createImageData(W, H);
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const x = cXmin + px / W * (cXmax - cXmin);
        const y = cYmax - py / H * (cYmax - cYmin);
        let v = rosenbrock(x, y);
        v = Math.log(1 + v) / 12;
        v = clamp(v, 0, 1);
        const idx = (py * W + px) * 4;
        imgData.data[idx] = Math.floor(12 + v * 60 + (1 - v) * 10);
        imgData.data[idx + 1] = Math.floor(12 + (1 - v) * 60);
        imgData.data[idx + 2] = Math.floor(18 + (1 - v) * 140 + v * 20);
        imgData.data[idx + 3] = 255;
      }
    }
    octx.putImageData(imgData, 0, 0);

    const levels = [0.5, 1, 2, 5, 10, 25, 50, 100, 200, 500, 1000, 2500];
    for (const level of levels) {
      for (let py = 0; py < H; py += 2) {
        for (let px = 0; px < W; px += 2) {
          const x = cXmin + px / W * (cXmax - cXmin);
          const y = cYmax - py / H * (cYmax - cYmin);
          const v = rosenbrock(x, y);
          if (Math.abs(v - level) < level * 0.06) {
            octx.fillStyle = 'rgba(162,155,254,.12)';
            octx.fillRect(px, py, 1.5, 1.5);
          }
        }
      }
    }
    bgRef.current = offscreen;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgRef.current) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.drawImage(bgRef.current, 0, 0, W, H);

    // min marker
    const t = Date.now() / 1000;
    const pulse = 6 + Math.sin(t * 3) * 2;
    drawGlowDot(ctx, mCX(1), mCY(1), 5, '#ffeaa7', pulse * 3);
    ctx.fillStyle = '#ffeaa7';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('Min (1,1)', mCX(1) + 12, mCY(1) + 4);

    const path = stateRef.current.path;
    // trail
    if (path.length > 1) {
      for (let i = 0; i < path.length - 1; i++) {
        const alpha = 0.08 + 0.7 * (i / path.length);
        ctx.strokeStyle = `rgba(0,206,201,${alpha})`;
        ctx.lineWidth = 1 + 2 * (i / path.length);
        ctx.beginPath();
        ctx.moveTo(mCX(path[i].x), mCY(path[i].y));
        ctx.lineTo(mCX(path[i + 1].x), mCY(path[i + 1].y));
        ctx.stroke();
      }
    }
    // dots
    for (let i = 0; i < path.length - 1; i++) {
      const a = 0.1 + 0.5 * (i / path.length);
      ctx.fillStyle = `rgba(0,206,201,${a})`;
      ctx.beginPath();
      ctx.arc(mCX(path[i].x), mCY(path[i].y), 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // current
    if (path.length > 0) {
      const last = path[path.length - 1];
      drawGlowDot(ctx, mCX(last.x), mCY(last.y), 6, '#00cec9', 24);
      const gx = dRosenX(last.x, last.y);
      const gy = dRosenY(last.x, last.y);
      const gLen = Math.sqrt(gx * gx + gy * gy) + 0.001;
      const scale = clamp(35, 15, 60);
      drawArrow(ctx, mCX(last.x), mCY(last.y),
        mCX(last.x) - gx / gLen * scale * (cXmax - cXmin) / W * 30,
        mCY(last.y) + gy / gLen * scale * (cYmax - cYmin) / H * 30,
        '#fd79a8', 2);
    }

    // particles
    const particles = stateRef.current.particles;
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (!particles[i].alive) particles.splice(i, 1);
    }

    // HUD
    ctx.fillStyle = 'rgba(12,12,20,.85)';
    ctx.beginPath(); ctx.roundRect(10, H - 52, 400, 42, 10); ctx.fill();
    ctx.strokeStyle = 'rgba(108,92,231,.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(10, H - 52, 400, 42, 10); ctx.stroke();
    if (path.length > 0) {
      const last = path[path.length - 1];
      ctx.fillStyle = '#00cec9';
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Step ${path.length - 1}  |  (${last.x.toFixed(3)}, ${last.y.toFixed(3)})  |  f = ${rosenbrock(last.x, last.y).toFixed(4)}`,
        22, H - 26
      );
    } else {
      ctx.fillStyle = '#555';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Rosenbrock: f(x,y) = (1\u2212x)\u00B2 + 100(y\u2212x\u00B2)\u00B2', 22, H - 26);
    }
  }, []);

  const handleRun = useCallback(() => {
    if (running) return;
    setRunning(true);
    let x = -1.5, y = 2.0;
    stateRef.current.path = [{ x, y }];
    stateRef.current.particles = [];
    let step = 0;

    start(() => {
      if (step > 600) { setRunning(false); return false; }
      const gx = dRosenX(x, y), gy = dRosenY(x, y);
      x = clamp(x - lr * gx, cXmin, cXmax);
      y = clamp(y - lr * gy, cYmin, cYmax);
      stateRef.current.path.push({ x, y });
      if (step % 8 === 0) stateRef.current.particles.push(new Particle(mCX(x), mCY(y), '#00cec9'));
      if (step % 2 === 0) draw();
      step++;
    });
  }, [lr, running, start, draw]);

  const handleReset = useCallback(() => {
    stop();
    setRunning(false);
    stateRef.current.path = [];
    stateRef.current.particles = [];
    draw();
  }, [stop, draw]);

  useEffect(() => {
    renderBG();
    if (canvasRef.current) setupHiDPI(canvasRef.current, W, H);
    setTimeout(draw, 50);
  }, [renderBG, draw]);

  return (
    <motion.div
      className="viz-container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <h4><span className="dot" /> Contour Optimization</h4>
      <canvas ref={canvasRef} style={{ width: W, height: H, borderRadius: 10 }} />
      <VizControls
        sliders={[
          { label: 'Learning Rate', value: lr, min: 0.0001, max: 0.003, step: 0.0001, onChange: setLr, format: v => v.toFixed(4) },
        ]}
        onRun={handleRun}
        onReset={handleReset}
        running={running}
      />
    </motion.div>
  );
}
