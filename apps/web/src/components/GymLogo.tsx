import React from 'react';
import { motion } from 'framer-motion';

export const GymLogo: React.FC = () => {

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      <svg
        width="45"
        height="45"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated Barbell Shaft */}
        <motion.line
          x1="15"
          y1="50"
          x2="85"
          y2="50"
          stroke="var(--text-color)"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ strokeWidth: [6, 10, 6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Left Collar */}
        <rect x="25" y="40" width="4" height="20" rx="1" fill="var(--text-color)" />
        {/* Right Collar */}
        <rect x="71" y="40" width="4" height="20" rx="1" fill="var(--text-color)" />

        {/* Left Inner Weight Plate */}
        <rect x="29" y="30" width="6" height="40" rx="2" fill="var(--text-muted)" />
        {/* Right Inner Weight Plate */}
        <rect x="65" y="30" width="6" height="40" rx="2" fill="var(--text-muted)" />

        {/* Left Outer Weight Plate */}
        <rect x="36" y="20" width="8" height="60" rx="3" fill="var(--accent-color)" />
        {/* Right Outer Weight Plate */}
        <rect x="56" y="20" width="8" height="60" rx="3" fill="var(--accent-color)" />

        {/* Animated Spinning Plate Gear in Background */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke="var(--accent-color)"
          strokeWidth="2"
          strokeDasharray="8 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {/* Central Core */}
        <circle cx="50" cy="50" r="12" fill="var(--bg-color)" stroke="var(--text-color)" strokeWidth="4" />
        <path d="M47 43H53V47H47V43ZM47 50H53V57H47V50Z" fill="var(--accent-color)" />
      </svg>

      <span
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.75rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--text-color)',
          display: 'flex',
          alignItems: 'baseline',
        }}
      >
        <span style={{ color: 'var(--text-color)' }}>fit</span>
        <span style={{ color: 'var(--accent-color)' }}>ness</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 300, textTransform: 'none', marginInlineStart: '0.15rem' }}>
          Arena
        </span>
      </span>
    </div>
  );
};
export default GymLogo;
