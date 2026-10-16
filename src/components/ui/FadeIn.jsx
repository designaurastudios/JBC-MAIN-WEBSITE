import React from 'react';
import { motion } from 'framer-motion';

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up', // 'up' | 'down' | 'none'
  className = '',
  style,
  ...props 
}) {
  const directionOffset = direction === 'up' ? 12 : direction === 'down' ? -12 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: directionOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.32,
        delay: delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      style={{ willChange: 'opacity, transform', ...style }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
