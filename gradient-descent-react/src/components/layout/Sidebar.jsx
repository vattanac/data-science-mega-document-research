import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV = [
  {
    title: 'Foundations',
    items: [
      { id: 'intro', icon: '📖', label: 'Introduction' },
      { id: 'intuition', icon: '🧠', label: 'Core Intuition' },
      { id: 'math', icon: '📐', label: 'The Mathematics' },
      { id: 'learning-rate', icon: '⚡', label: 'Learning Rate' },
    ],
  },
  {
    title: 'Variants',
    items: [
      { id: 'batch', icon: '📦', label: 'Batch GD' },
      { id: 'sgd', icon: '🎲', label: 'Stochastic GD' },
      { id: 'minibatch', icon: '🧩', label: 'Mini-Batch GD' },
    ],
  },
  {
    title: 'Advanced Optimizers',
    items: [
      { id: 'momentum', icon: '🚀', label: 'Momentum' },
      { id: 'adagrad', icon: '🎯', label: 'AdaGrad' },
      { id: 'rmsprop', icon: '📊', label: 'RMSProp' },
      { id: 'adam', icon: '👑', label: 'Adam' },
      { id: 'adamw', icon: '🔧', label: 'AdamW & Beyond' },
    ],
  },
  {
    title: 'Interactive',
    items: [
      { id: 'viz-1d', icon: '📈', label: '1D Visualization' },
      { id: 'viz-contour', icon: '🗺️', label: 'Contour Map' },
      { id: 'viz-compare', icon: '⚔️', label: 'Optimizer Race' },
    ],
  },
  {
    title: 'Deep Knowledge',
    items: [
      { id: 'challenges', icon: '⚠️', label: 'Challenges' },
      { id: 'tips', icon: '💡', label: 'Practical Tips' },
      { id: 'history', icon: '📜', label: 'History' },
      { id: 'comparison', icon: '📋', label: 'Comparison' },
    ],
  },
];

export default function Sidebar() {
  const [active, setActive] = useState('intro');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll('section[id], .hero-section[id]');
      let current = 'intro';
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>∇ Gradient Descent</h2>
          <span>The Complete Deep Dive</span>
        </div>

        {NAV.map((group, gi) => (
          <div className="nav-group" key={gi}>
            <div className="nav-group-title">{group.title}</div>
            {group.items.map((item, i) => (
              <motion.a
                key={item.id}
                className={`nav-link ${active === item.id ? 'active' : ''}`}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (gi * group.items.length + i) * 0.03, duration: 0.4 }}
              >
                <span className="icon">{item.icon}</span> {item.label}
              </motion.a>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          © 2026 Sim Vattanac<br />
          <a href="mailto:vattanacsim99@gmail.com">vattanacsim99@gmail.com</a>
        </div>
      </nav>
    </>
  );
}
