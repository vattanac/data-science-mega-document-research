// ── Canvas Drawing Utilities ──

export function setupHiDPI(canvas, w, h) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w, h, dpr };
}

export function clearCanvas(ctx, canvas, w, h) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.fillStyle = '#0c0c14';
  ctx.fillRect(0, 0, w, h);
}

export function drawGrid(ctx, W, H, pad, xMin, xMax, yMin, yMax) {
  ctx.save();
  ctx.strokeStyle = 'rgba(108,92,231,.07)';
  ctx.lineWidth = 1;
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const px = pad.l + (x - xMin) / (xMax - xMin) * (W - pad.l - pad.r);
    ctx.beginPath();
    ctx.moveTo(px, pad.t);
    ctx.lineTo(px, H - pad.b);
    ctx.stroke();
    ctx.fillStyle = '#555';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(x, px, H - pad.b + 16);
  }
  const yStep = Math.max(1, Math.floor((yMax - yMin) / 5));
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep) {
    const py = pad.t + (1 - (y - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);
    ctx.beginPath();
    ctx.moveTo(pad.l, py);
    ctx.lineTo(W - pad.r, py);
    ctx.stroke();
    ctx.fillStyle = '#555';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(y, pad.l - 8, py + 4);
  }
  ctx.restore();
}

export function drawGlowDot(ctx, x, y, r, color, glowR = r * 4) {
  const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR);
  grd.addColorStop(0, color + 'aa');
  grd.addColorStop(0.3, color + '44');
  grd.addColorStop(1, color + '00');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(x, y, glowR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

export function drawArrow(ctx, x1, y1, x2, y2, color, lw = 2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  if (len < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const hs = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hs * Math.cos(angle - 0.4), y2 - hs * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - hs * Math.cos(angle + 0.4), y2 - hs * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawCurveWithFill(ctx, fn, W, H, pad, xMin, xMax, yMin, yMax, strokeColor, fillGradient) {
  const mapX = (x) => pad.l + (x - xMin) / (xMax - xMin) * (W - pad.l - pad.r);
  const mapY = (y) => pad.t + (1 - (y - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);

  // fill
  ctx.beginPath();
  ctx.moveTo(pad.l, mapY(fn(xMin)));
  for (let px = 0; px <= W - pad.l - pad.r; px++) {
    const x = xMin + px / (W - pad.l - pad.r) * (xMax - xMin);
    ctx.lineTo(pad.l + px, mapY(fn(x)));
  }
  ctx.lineTo(W - pad.r, H - pad.b);
  ctx.lineTo(pad.l, H - pad.b);
  ctx.closePath();
  if (fillGradient) {
    const grd = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grd.addColorStop(0, 'rgba(108,92,231,.12)');
    grd.addColorStop(1, 'rgba(108,92,231,.01)');
    ctx.fillStyle = grd;
    ctx.fill();
  }

  // stroke with glow
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 12;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let px = 0; px <= W - pad.l - pad.r; px++) {
    const x = xMin + px / (W - pad.l - pad.r) * (xMax - xMin);
    if (px === 0) ctx.moveTo(pad.l + px, mapY(fn(x)));
    else ctx.lineTo(pad.l + px, mapY(fn(x)));
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function drawTrail(ctx, points, mapX, mapY, color) {
  if (points.length < 2) return;
  for (let i = 0; i < points.length - 1; i++) {
    const alpha = 0.1 + 0.5 * (i / points.length);
    ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 1.5 + (i / points.length) * 1.5;
    ctx.beginPath();
    ctx.moveTo(mapX(points[i].x), mapY(points[i].y));
    ctx.lineTo(mapX(points[i + 1].x), mapY(points[i + 1].y));
    ctx.stroke();
  }
}

export function drawLossChart(ctx, W, H, losses, color = '#6c5ce7', label = 'Loss Convergence') {
  ctx.fillStyle = '#0c0c14';
  ctx.fillRect(0, 0, W, H);
  if (losses.length < 2) return;

  const pad = { l: 50, r: 20, t: 28, b: 24 };
  const maxL = Math.max(...losses, 1);
  const minL = Math.min(...losses);

  ctx.fillStyle = '#555';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, pad.l + 4, pad.t - 10);

  ctx.beginPath();
  for (let i = 0; i < losses.length; i++) {
    const x = pad.l + i / (losses.length - 1) * (W - pad.l - pad.r);
    const y = pad.t + (1 - (losses[i] - minL) / (maxL - minL + 0.001)) * (H - pad.t - pad.b);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const lastX = pad.l + (losses.length - 1) / (losses.length - 1) * (W - pad.l - pad.r);
  ctx.lineTo(lastX, H - pad.b);
  ctx.lineTo(pad.l, H - pad.b);
  ctx.closePath();
  const grd = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
  grd.addColorStop(0, color + '33');
  grd.addColorStop(1, color + '03');
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.fillStyle = '#555';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(maxL.toFixed(1), pad.l - 6, pad.t + 4);
  ctx.fillText(minL.toFixed(1), pad.l - 6, H - pad.b + 2);
}

export function drawHUD(ctx, W, H, pad, texts) {
  const hudW = 310, hudH = 50;
  const hudX = W - pad.r - hudW - 4, hudY = pad.t + 4;
  ctx.fillStyle = 'rgba(12,12,20,.85)';
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudW, hudH, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(108,92,231,.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudW, hudH, 10);
  ctx.stroke();

  ctx.textAlign = 'left';
  if (texts[0]) {
    ctx.fillStyle = '#00cec9';
    ctx.font = 'bold 13px JetBrains Mono, monospace';
    ctx.fillText(texts[0], hudX + 14, hudY + 20);
  }
  if (texts[1]) {
    ctx.fillStyle = '#a29bfe';
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillText(texts[1], hudX + 14, hudY + 38);
  }
  ctx.textAlign = 'start';
}
