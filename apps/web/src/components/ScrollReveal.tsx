import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
}) => {
  const getVariants = () => {
    const offset = 80;
    switch (direction) {
      case 'up':
        return { hidden: { opacity: 0, y: offset }, visible: { opacity: 1, y: 0 } };
      case 'down':
        return { hidden: { opacity: 0, y: -offset }, visible: { opacity: 1, y: 0 } };
      case 'left':
        return { hidden: { opacity: 0, x: offset }, visible: { opacity: 1, x: 0 } };
      case 'right':
        return { hidden: { opacity: 0, x: -offset }, visible: { opacity: 1, x: 0 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={getVariants()}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // Premium cubic easing
      }}
    >
      {children}
    </motion.div>
  );
};

export const RollingPlateDivider: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Calculate plate rolling horizontally and spinning
  const plateX = useTransform(scrollYProgress, [0.1, 0.9], ['-10%', '110%']);
  const plateRotate = useTransform(scrollYProgress, [0.1, 0.9], [0, 720]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, transparent, rgba(var(--accent-rgb), 0.03), transparent)',
        margin: '4rem 0',
      }}
    >
      {/* The Barbell bar running across */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '10px',
          background: 'linear-gradient(180deg, #64748b 0%, #334155 50%, #0f172a 100%)',
          borderRadius: '5px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
          zIndex: 1,
        }}
      />

      {/* Barbell ridges in the center */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '160px',
          height: '16px',
          backgroundColor: '#475569',
          border: '1px solid #1e293b',
          borderRadius: '4px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 4px',
        }}
      >
        <span style={{ width: '2px', height: '10px', backgroundColor: '#334155' }} />
        <span style={{ width: '2px', height: '10px', backgroundColor: '#334155' }} />
        <span style={{ width: '2px', height: '10px', backgroundColor: '#334155' }} />
        <span style={{ width: '2px', height: '10px', backgroundColor: '#334155' }} />
        <span style={{ width: '2px', height: '10px', backgroundColor: '#334155' }} />
      </div>

      {/* The rolling weight plate */}
      <motion.div
        style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          zIndex: 3,
          x: plateX,
          rotate: plateRotate,
          cursor: 'grab',
        }}
        whileDrag={{ scale: 1.15 }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.35))' }}>
          {/* Main plate shape */}
          <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="var(--accent-color)" strokeWidth="6" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="10 5" />
          
          {/* Inner ring & metal core */}
          <circle cx="50" cy="50" r="16" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          <circle cx="50" cy="50" r="8" fill="#cbd5e1" />
          
          {/* High calligraphy emboss for branding */}
          <text
            x="50"
            y="32"
            fill="var(--accent-color)"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-title)', letterSpacing: '0.1em' }}
          >
            ARENA
          </text>
          <text
            x="50"
            y="76"
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-title)', letterSpacing: '0.05em' }}
          >
            25 KG
          </text>
        </svg>
      </motion.div>
    </div>
  );
};
export default ScrollReveal;
