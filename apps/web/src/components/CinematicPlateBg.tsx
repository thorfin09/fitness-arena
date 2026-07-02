import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const CinematicPlateBg: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Scroll bindings for the weight plate
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.16, 0.22, 0.12, 0.05]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Dim spotlight overlay to ensure text readability on top of background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 20%, var(--bg-color) 85%)',
          zIndex: 1,
        }}
      />

      {/* Hardware-accelerated motion plate */}
      <motion.div
        style={{
          width: '80vmin',
          height: '80vmin',
          minWidth: '350px',
          minHeight: '350px',
          maxHeight: '750px',
          maxWidth: '750px',
          rotate,
          scale,
          opacity,
          zIndex: 0,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.75)) blur(1px)',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outermost rim border */}
          <circle cx="100" cy="100" r="92" fill="#0d0e12" stroke="#ff3c00" strokeWidth="3" />
          <circle cx="100" cy="100" r="88" fill="#12131a" stroke="#2a2c36" strokeWidth="1" />

          {/* Cast Iron concentric ribs */}
          <circle cx="100" cy="100" r="76" stroke="#1d1f27" strokeWidth="4" />
          <circle cx="100" cy="100" r="62" stroke="#1d1f27" strokeWidth="2" strokeDasharray="15 8" />
          <circle cx="100" cy="100" r="48" stroke="#1d1f27" strokeWidth="3" />

          {/* Central hub flange */}
          <circle cx="100" cy="100" r="32" fill="#181a22" stroke="#2d303f" strokeWidth="2" />
          {/* Silver center sleeve washer */}
          <circle cx="100" cy="100" r="14" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="100" cy="100" r="8" fill="#cbd5e1" />

          {/* Cast branding text: fitnessArena */}
          <path
            id="textPathUpper"
            d="M 30,100 A 70,70 0 0,1 170,100"
            fill="none"
          />
          <text fill="var(--text-color)" fontSize="9.5" fontWeight="bold" letterSpacing="0.32em" style={{ fontFamily: 'var(--font-title)' }}>
            <textPath href="#textPathUpper" startOffset="50%" textAnchor="middle">
              FITNESS ARENA
            </textPath>
          </text>

          {/* Location indicators & weight stamp casted on plate */}
          <path
            id="textPathLower"
            d="M 170,100 A 70,70 0 0,1 30,100"
            fill="none"
          />
          <text fill="#ff3c00" fontSize="9" fontWeight="bold" letterSpacing="0.25em" style={{ fontFamily: 'var(--font-title)' }}>
            <textPath href="#textPathLower" startOffset="50%" textAnchor="middle">
              SAHIBGANJ &bull; JHARKHAND
            </textPath>
          </text>

          {/* Deep Cast indicators (45LBS / 20.4KG stampings) */}
          <text
            x="52"
            y="104"
            fill="#1e2029"
            fontSize="10"
            fontWeight="900"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            45
          </text>
          <text
            x="148"
            y="104"
            fill="#1e2029"
            fontSize="10"
            fontWeight="900"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            LBS
          </text>
        </svg>
      </motion.div>
    </div>
  );
};
export default CinematicPlateBg;
