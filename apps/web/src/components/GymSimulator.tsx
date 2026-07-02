import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Play, RotateCcw } from 'lucide-react';

export const GymSimulator: React.FC = () => {
  const { t } = useApp();
  const [platesCount, setPlatesCount] = useState<number>(0);
  const [isLifting, setIsLifting] = useState<boolean>(false);
  const [liftStatus, setLiftStatus] = useState<string>('');

  const BAR_WEIGHT = 20; // 20kg Olympic Barbell
  const PLATE_WEIGHT = 20; // 20kg plates
  const totalWeight = BAR_WEIGHT + platesCount * 2 * PLATE_WEIGHT;

  // Calculate bend factor based on weight
  const bend = Math.min(platesCount * 4.5, 25);

  const addPlate = () => {
    if (platesCount < 6) {
      setPlatesCount((prev) => prev + 1);
    }
  };

  const removePlates = () => {
    setPlatesCount(0);
    setLiftStatus('');
    setIsLifting(false);
  };

  const startLift = () => {
    if (isLifting) return;
    setIsLifting(true);

    let status = 'WARMUP LIFT';
    if (totalWeight >= 220) {
      status = 'OLYMPIAN GOD LIFT!';
    } else if (totalWeight >= 140) {
      status = 'BEAST MODE LIFT!';
    } else if (totalWeight > 20) {
      status = 'SOLID EFFORT!';
    }

    setLiftStatus(status);

    setTimeout(() => {
      setIsLifting(false);
    }, 2500);
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-color)', margin: 0 }}>
          {t('simulatorTitle')}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          {t('simulatorDesc')}
        </p>
      </div>

      {/* Simulator canvas boundary */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Absolute Gritty Background Grid */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />

        {/* Dynamic Weight Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '15px',
            left: '20px',
            fontFamily: 'var(--font-title)',
            fontSize: '1.25rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.5)',
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 10,
          }}
        >
          <span>{t('barbellWeight')}:</span>
          <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.5rem' }}>
            {totalWeight} kg
          </span>
        </div>

        {/* Lifting Status Notification */}
        <AnimatePresence>
          {isLifting && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: 1,
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontFamily: 'var(--font-title)',
                fontSize: '1.2rem',
                color: '#ffffff',
                backgroundColor: 'var(--accent-color)',
                padding: '0.5rem 1.2rem',
                borderRadius: '6px',
                boxShadow: '0 0 20px rgba(255,42,42,0.8)',
                zIndex: 10,
                letterSpacing: '0.05em',
              }}
            >
              {liftStatus}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Barbell rendering zone */}
        <motion.div
          animate={
            isLifting
              ? {
                  y: [0, -40, 20, -30, 10, -20, 5, 0],
                  x: [0, -3, 3, -2, 2, -1, 1, 0],
                }
              : { y: 0, x: 0 }
          }
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          style={{ width: '480px', height: '180px', position: 'relative' }}
        >
          <svg width="480" height="180" viewBox="0 0 480 180">
            {/* Deflection path calculations for bar */}
            {/* Mid height of SVG is 90 */}
            {/* The bar starts at X=60, ends at X=420 */}
            <path
              d={`M 60 ${90 + bend * 0.4} Q 240 ${90 + bend * 2.2} 420 ${90 + bend * 0.4}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Inner steel core lining */}
            <path
              d={`M 60 ${90 + bend * 0.4} Q 240 ${90 + bend * 2.2} 420 ${90 + bend * 0.4}`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Left Collar (Inner stop for weights) */}
            {/* Tangent slope at X=110 to orient collar */}
            <circle
              cx="110"
              cy={90 + bend * 0.7}
              r="10"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Right Collar */}
            <circle
              cx="370"
              cy={90 + bend * 0.7}
              r="10"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Stacking Left plates from inner to outer */}
            {/* Inner starts at X=100 and moves leftwards */}
            {Array.from({ length: platesCount }).map((_, idx) => {
              const xPos = 100 - idx * 10;
              const yPos = 90 + bend * 0.78; // offset approximation
              return (
                <g key={`l-plate-${idx}`}>
                  <rect
                    x={xPos}
                    y={yPos - 25}
                    width="8"
                    height="50"
                    rx="2"
                    fill="var(--accent-color)"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  {/* Metal center washer */}
                  <rect x={xPos + 2} y={yPos - 5} width="4" height="10" rx="1" fill="#94a3b8" />
                </g>
              );
            })}

            {/* Stacking Right plates from inner to outer */}
            {/* Inner starts at X=372 and moves rightwards */}
            {Array.from({ length: platesCount }).map((_, idx) => {
              const xPos = 372 + idx * 10;
              const yPos = 90 + bend * 0.78;
              return (
                <g key={`r-plate-${idx}`}>
                  <rect
                    x={xPos}
                    y={yPos - 25}
                    width="8"
                    height="50"
                    rx="2"
                    fill="var(--accent-color)"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  {/* Metal center washer */}
                  <rect x={xPos + 2} y={yPos - 5} width="4" height="10" rx="1" fill="#94a3b8" />
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={addPlate}
          disabled={platesCount >= 6 || isLifting}
          className="btn-beast"
          style={{
            fontSize: '1rem',
            padding: '0.6rem 1.5rem',
            opacity: platesCount >= 6 ? 0.6 : 1,
            cursor: platesCount >= 6 ? 'not-allowed' : 'pointer',
          }}
        >
          {t('loadPlate')}
        </button>

        <button
          onClick={startLift}
          disabled={isLifting}
          className="btn-outline-beast"
          style={{
            fontSize: '1rem',
            padding: '0.6rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            borderColor: 'var(--text-color)',
            cursor: isLifting ? 'not-allowed' : 'pointer',
          }}
        >
          <Play size={16} fill="currentColor" />
          LIFT!
        </button>

        <button
          onClick={removePlates}
          disabled={isLifting || platesCount === 0}
          className="btn-outline-beast"
          style={{
            fontSize: '1rem',
            padding: '0.6rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            borderColor: '#94a3b8',
            color: 'var(--text-muted)',
            cursor: isLifting || platesCount === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <RotateCcw size={16} />
          {t('clearPlates')}
        </button>
      </div>
    </div>
  );
};
export default GymSimulator;
