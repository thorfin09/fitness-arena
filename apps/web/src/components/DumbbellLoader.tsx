import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DumbbellLoaderProps {
  onComplete: () => void;
}

export const DumbbellLoader: React.FC<DumbbellLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds total load
    const intervalTime = 20; // 50 updates per second
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 800); // Allow fade-out animation to finish
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loader-container"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#05070c',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Grid Lines */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle at center, rgba(255, 42, 42, 0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Rolling Barbell/Plate Track */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Horizontal Track line */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                bottom: '20px',
                borderRadius: '2px',
              }}
            />

            {/* Rolling plate SVG */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: 0,
                width: '60px',
                height: '60px',
              }}
              animate={{
                left: `${progress * 2.2}px`, // Roll left to right
                rotate: progress * 7.2,      // Spin based on progress
              }}
              transition={{ ease: 'linear' }}
            >
              <svg width="60" height="60" viewBox="0 0 100 100">
                {/* Outermost ring */}
                <circle cx="50" cy="50" r="45" fill="#121827" stroke="var(--accent-color)" strokeWidth="6" />
                {/* Inner structure lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="var(--accent-color)" strokeWidth="3" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="var(--accent-color)" strokeWidth="3" />
                {/* Weight typography */}
                <circle cx="50" cy="50" r="25" fill="var(--accent-color)" />
                <text
                  x="50"
                  y="55"
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--font-title)' }}
                >
                  20KG
                </text>
              </svg>
            </motion.div>
          </div>

          {/* Loading Percentage & Big Calligraphy Header */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', zIndex: 10 }}>
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '3rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              FITNESS<span style={{ color: 'var(--accent-color)' }}>ARENA</span>
            </motion.h1>

            <motion.p
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1rem',
                color: 'var(--accent-color)',
                letterSpacing: '0.4em',
                marginTop: '0.25rem',
                textTransform: 'uppercase',
              }}
            >
              UNLEASH THE BEAST
            </motion.p>

            {/* Percentage Display */}
            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '4.5rem',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.05)',
                position: 'absolute',
                top: '55%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {progress}%
            </div>

            {/* Loading text indicator */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-color)',
                  animation: 'pulse-glow 1.5s infinite',
                }}
              />
              {progress === 100 ? 'ENGINE READY' : 'PREPARING HYPERTROPHY ENGINE...'}
            </div>

            {/* Micro loading progress bar */}
            <div
              style={{
                width: '240px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '2px',
                marginTop: '0.75rem',
                overflow: 'hidden',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--accent-color)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default DumbbellLoader;
