import { motion } from 'framer-motion';

export default function ScrollReveal({ children, id, className = '', delay = 0 }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.section>
  );
}
