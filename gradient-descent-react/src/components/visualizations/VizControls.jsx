import { motion } from 'framer-motion';

export default function VizControls({ sliders = [], onRun, onReset, running, children }) {
  return (
    <div className="viz-controls">
      {sliders.map((s, i) => (
        <div key={i}>
          <label>
            {s.label}: <strong style={{ color: '#a29bfe' }}>{s.format ? s.format(s.value) : s.value}</strong>
          </label>
          <br />
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={s.value}
            onChange={(e) => s.onChange(+e.target.value)}
            style={{ width: 180 }}
          />
        </div>
      ))}
      <motion.button
        className="btn btn-primary"
        onClick={onRun}
        disabled={running}
        whileHover={{ scale: running ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {running ? '⏳ Running...' : '▶ Run'}
      </motion.button>
      <motion.button
        className="btn btn-outline"
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ↺ Reset
      </motion.button>
      {children}
    </div>
  );
}
