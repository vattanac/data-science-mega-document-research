import { motion } from 'framer-motion';
import MeshBackground from './components/layout/MeshBackground';
import HeroParticles from './components/layout/HeroParticles';
import Sidebar from './components/layout/Sidebar';
import { Viz1D, VizContour, VizRace } from './components/visualizations';
import {
  Intuition, Mathematics, LearningRate, Variants,
  AdvancedOptimizers, Challenges, Tips, History, ComparisonTable,
} from './components/sections/ContentSections';
import ScrollReveal from './components/sections/ScrollReveal';
import './styles/theme.css';

function Hero() {
  return (
    <div className="hero-section" id="intro" style={{ position: 'relative' }}>
      <HeroParticles />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 0 50px' }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          Deep Learning Fundamentals
        </motion.div>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          The Truth About<br />Gradient Descent
        </motion.h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          A meticulous, step-by-step guide to the most important optimization algorithm in machine learning
          — with interactive visualizations, rigorous math, and practical wisdom.
        </motion.p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <MeshBackground />
      <Sidebar />
      <main className="main">
        <Hero />
        <Intuition />
        <Mathematics />
        <LearningRate />
        <Variants />
        <AdvancedOptimizers />

        <ScrollReveal id="viz-1d">
          <h2><span className="sec-icon">📈</span> Interactive: 1D Gradient Descent</h2>
          <p className="lead">Watch gradient descent optimize f(x) = x⁴ − 3x³ + 2 in real time.</p>
          <Viz1D />
        </ScrollReveal>

        <ScrollReveal id="viz-contour">
          <h2><span className="sec-icon">🗺️</span> Interactive: 2D Contour Map</h2>
          <p className="lead">Visualize gradient descent on the Rosenbrock function.</p>
          <VizContour />
        </ScrollReveal>

        <ScrollReveal id="viz-compare">
          <h2><span className="sec-icon">⚔️</span> Interactive: Optimizer Race</h2>
          <p className="lead">Watch SGD, Momentum, RMSProp, and Adam compete head-to-head.</p>
          <VizRace />
        </ScrollReveal>

        <Challenges />
        <Tips />
        <History />
        <ComparisonTable />

        <div className="footer">
          <p>© 2026 <strong>Sim Vattanac</strong> — All Rights Reserved</p>
          <p>Contact: <a href="mailto:vattanacsim99@gmail.com">vattanacsim99@gmail.com</a></p>
          <p style={{ marginTop: 8, fontSize: '.72rem' }}>Built with React + Framer Motion + Canvas 2D</p>
        </div>
      </main>
    </>
  );
}
