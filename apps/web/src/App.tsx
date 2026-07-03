import React, { useEffect, useState, useRef } from 'react';
import { useApp } from './context/AppContext';
import { apiService } from './services/api';
import GymLogo from './components/GymLogo';
import LanguageThemeSwitcher from './components/LanguageThemeSwitcher';
import CinematicPlateBg from './components/CinematicPlateBg';
import ScrollReveal, { RollingPlateDivider } from './components/ScrollReveal';
import GymSimulator from './components/GymSimulator';
import AthleteZone from './components/AthleteZone';
import DumbbellLoader from './components/DumbbellLoader';
import { Award, ChevronRight, MapPin, Compass, Navigation, Globe, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const { t, token } = useApp();
  const [loading, setLoading] = useState<boolean>(true);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Parallax Marquee scroll variables
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  const belt1X = useTransform(smoothProgress, [0, 1], ['-20%', '20%']);
  const belt2X = useTransform(smoothProgress, [0, 1], ['20%', '-20%']);

  useEffect(() => {
    if (loading) return;
    const loadWorkouts = async () => {
      try {
        const data = await apiService.getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
      }
    };
    loadWorkouts();
  }, [loading]);

  const handleBookClass = async (workoutId: string) => {
    if (!token) {
      setBookingError('Please log in or register in the Athlete Zone first.');
      setTimeout(() => setBookingError(null), 3000);
      return;
    }

    setBookingLoading(workoutId);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      await apiService.bookWorkout(workoutId, token);
      setBookingSuccess(workoutId);
      
      setWorkouts((prev) =>
        prev.map((w) => (w._id === workoutId ? { ...w, bookedCount: w.bookedCount + 1 } : w))
      );
      
      setTimeout(() => setBookingSuccess(null), 4000);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book class.');
      setTimeout(() => setBookingError(null), 4000);
    } finally {
      setBookingLoading(null);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <DumbbellLoader onComplete={() => setLoading(false)} />;
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
      
      {/* Dimmed Olympic Background Plate */}
      <CinematicPlateBg />

      {/* Premium Responsive Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'var(--bg-nav)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5%',
          zIndex: 100,
          boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
        }}
      >
        {/* Brand / Logo */}
        <div 
          onClick={() => { scrollToSection('hero'); setMobileMenuOpen(false); }} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <GymLogo />
          <span 
            style={{ 
              fontFamily: 'var(--font-title)', 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('brandName').toUpperCase()}
          </span>
        </div>

        {/* Navigation Links - Desktop Only */}
        <nav className="nav-links-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { label: 'HOME', id: 'hero' },
            { label: 'CLASSES', id: 'workouts' },
            { label: 'SIMULATOR', id: 'simulator' },
            { label: 'THE COMPOUND', id: 'location-hub' },
            { label: 'ATHLETE ZONE', id: 'auth-zone' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-color)',
                fontFamily: 'var(--font-title)',
                fontSize: '0.95rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                opacity: 0.8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-color)'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-color)'; e.currentTarget.style.opacity = '0.8'; }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions - Desktop Only */}
        <div className="nav-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <LanguageThemeSwitcher />
          <button 
            onClick={() => scrollToSection('auth-zone')} 
            className="btn-beast"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
          >
            JOIN NOW
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none', // Controlled by CSS media queries
            background: 'none',
            border: 'none',
            color: 'var(--text-color)',
            cursor: 'pointer',
            zIndex: 101,
            padding: '0.5rem',
          }}
          className="mobile-nav-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} style={{ color: 'var(--accent-color)' }} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '70px',
                left: 0,
                right: 0,
                background: 'var(--bg-nav)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                borderBottom: '1px solid var(--border-color)',
                padding: '2rem 5%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                zIndex: 99,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'HOME', id: 'hero' },
                  { label: 'CLASSES', id: 'workouts' },
                  { label: 'SIMULATOR', id: 'simulator' },
                  { label: 'THE COMPOUND', id: 'location-hub' },
                  { label: 'ATHLETE ZONE', id: 'auth-zone' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { scrollToSection(item.id); setMobileMenuOpen(false); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-color)',
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      letterSpacing: '0.07em',
                      textAlign: 'left',
                      padding: '0.5rem 0',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Language switcher & CTA stacked vertically */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{ alignSelf: 'flex-start' }}>
                  <LanguageThemeSwitcher />
                </div>
                <button 
                  onClick={() => { scrollToSection('auth-zone'); setMobileMenuOpen(false); }} 
                  className="btn-beast"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                >
                  JOIN THE COMPOUND
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '120px 5% 40px 5%',
          position: 'relative',
          zIndex: 5,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Localized Location Pin Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="location-badge" style={{ marginBottom: '1.5rem' }}>
              <MapPin size={14} style={{ color: 'var(--accent-color)' }} />
              <span>Barharwa Hatpara, Sahibganj, Jharkhand</span>
            </div>
          </motion.div>

          {/* $10,000 Cinematic Header Typography */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="hero-title-text"
          >
            <span className="glow-text">SAHIBGANJ\'S FIRST</span>
            <span className="hero-accent-text glow-accent" style={{ display: 'block', fontSize: '1.1em', fontWeight: 900, marginTop: '0.5rem' }}>
              {t('brandName')}
            </span>
          </motion.h1>

          {/* Subtitle taglines */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              color: 'var(--text-muted)',
              maxWidth: '800px',
              margin: '2rem auto 3rem auto',
              lineHeight: 1.6,
            }}
          >
            {t('heroDesc')}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button onClick={() => scrollToSection('auth-zone')} className="btn-beast">
              {t('joinBtn')}
              <ChevronRight size={18} />
            </button>
            <button onClick={() => scrollToSection('location-hub')} className="btn-outline-beast">
              THE COMPOUND
            </button>
          </motion.div>
        </div>
      </section>

      {/* Parallax horizontal text belt 1 */}
      <div style={{ overflow: 'hidden', padding: '1rem 0', position: 'relative', zIndex: 2 }}>
        <motion.div style={{ x: belt1X, willChange: 'transform' }} className="parallax-text-belt">
          POWER DISCIPLINE SAHIBGANJ HYPERTROPHY JHARKHAND RAW IRON
        </motion.div>
      </div>

      {/* Classes Section */}
      <section id="workouts" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title glow-text">{t('classesTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {t('classesSubtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Classes grid layout */}
        <div className="grid-container">
          {workouts.map((workout, idx) => (
            <ScrollReveal key={workout._id} delay={idx * 0.08} direction={idx % 2 === 0 ? 'left' : 'right'}>
              <div
                className="glass-panel"
                style={{
                  padding: '2.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '420px',
                }}
              >
                {/* Visual neon corner styling */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '4px', background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '40px', background: 'linear-gradient(180deg, var(--accent-color), var(--accent-secondary))' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: 'var(--accent-color)',
                      backgroundColor: 'rgba(255, 60, 0, 0.12)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {workout.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {workout.bookedCount} / {workout.capacity} {t('fullyBooked')}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.5rem', margin: '0.25rem 0' }}>{workout.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexGrow: 1 }}>
                  {workout.description}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('trainer')}:</span>
                    <span style={{ fontWeight: 600 }}>{workout.trainer}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('duration')}:</span>
                    <span style={{ fontWeight: 600 }}>{workout.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('intensity')}:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>
                      {workout.intensity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('schedule')}:</span>
                    <span style={{ fontWeight: 600 }}>{workout.schedule}</span>
                  </div>
                </div>

                {bookingSuccess === workout._id && (
                  <div style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {t('bookingSuccess')}
                  </div>
                )}

                <button
                  disabled={bookingLoading === workout._id || workout.bookedCount >= workout.capacity}
                  onClick={() => handleBookClass(workout._id)}
                  className="btn-beast"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    opacity: workout.bookedCount >= workout.capacity ? 0.5 : 1,
                    cursor: workout.bookedCount >= workout.capacity ? 'not-allowed' : 'pointer',
                  }}
                >
                  {workout.bookedCount >= workout.capacity ? t('fullyBooked') : t('bookBtn')}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Parallax horizontal text belt 2 */}
      <div style={{ overflow: 'hidden', padding: '1rem 0', position: 'relative', zIndex: 2 }}>
        <motion.div style={{ x: belt2X, willChange: 'transform' }} className="parallax-text-belt">
          BARHARWA TEMPLE OLYMPIAN STRENGTH POWERLIFTING INDIA CORE CHAMPIONS
        </motion.div>
      </div>

      {/* Barbell deflection simulator section */}
      <section id="simulator" style={{ padding: '80px 5%', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <ScrollReveal>
          <GymSimulator />
        </ScrollReveal>
      </section>

      {/* Scroll Divider: rolling weight plate */}
      <RollingPlateDivider />

      {/* Dedicated Geographic Compound Section */}
      <section
        id="location-hub"
        style={{
          padding: '80px 5%',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title glow-text">{t('locationTitle')}</h2>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* Graphic location stats details */}
          <ScrollReveal direction="left">
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Compass size={24} style={{ color: 'var(--accent-color)' }} />
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-color)', margin: 0 }}>GEOGRAPHIC METADATA</h3>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {t('locationDesc')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>MUNICIPALITY:</span>
                  <span style={{ fontWeight: 'bold' }}>BARHARWA (HATPARA)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>DISTRICT:</span>
                  <span style={{ fontWeight: 'bold' }}>SAHIBGANJ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>STATE:</span>
                  <span style={{ fontWeight: 'bold' }}>JHARKHAND</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>COUNTRY:</span>
                  <span style={{ fontWeight: 'bold' }}>INDIA 🇮🇳</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Aesthetic Geographical HUD Card */}
          <ScrollReveal direction="right">
            <div
              className="glass-panel box-glow"
              style={{
                padding: '2.5rem',
                border: '1.5px solid var(--accent-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                background: 'linear-gradient(135deg, rgba(255, 60, 0, 0.05) 0%, rgba(3, 4, 7, 0.8) 100%)',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '2px solid var(--accent-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse-glow 2s infinite',
                }}
              >
                <Navigation size={32} style={{ color: 'var(--accent-color)' }} />
              </div>

              <div>
                <h4 style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.1em' }}>GRID SECTOR 816101</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', letterSpacing: '0.2em' }}>
                  SAHIBGANJ &bull; JHARKHAND
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  color: 'var(--accent-secondary)',
                }}
              >
                <div>LAT: 24.9004° N</div>
                <div>LON: 87.7788° E</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', color: '#ffffff' }}>
                  ELEVATION: 28M AMSL
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Located near Hatpara High School ground. Drop in and feel the raw pressure of India\'s finest hypertrophy engines.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Membership purchasing and auth zone */}
      <section
        id="auth-zone"
        style={{
          padding: '80px 5%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <ScrollReveal direction="left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', justifyContent: 'center' }}>
            <h2 className="section-title glow-text" style={{ textAlign: 'start', left: 0, transform: 'none' }}>
              {t('plansTitle')}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('plansSubtitle')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
              {[
                'Full 24/7 Access to iron compound structures',
                'Custom biomechanically optimized bars and dumbbells',
                'Localized athletic coaching and weight training guides',
                'Complete membership cards generated instantly in dashboard',
              ].map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Award size={18} style={{ color: 'var(--accent-color)' }} />
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-color)' }}>{benefit}</span>
                </div>
              ))}
            </div>

            {bookingError && (
              <div style={{ backgroundColor: 'rgba(255, 60, 0, 0.1)', border: '1px solid var(--accent-color)', color: '#ffffff', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                {bookingError}
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <AthleteZone />
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          marginTop: '6rem',
          padding: '3rem 5% 0 5%',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={14} />
          <span>Located in Barharwa Hatpara, Sahibganj, Jharkhand, India 🇮🇳</span>
        </div>
        <p>
          &copy; {new Date().getFullYear()} <strong>{t('brandName')}</strong>. {t('footerRights')}
        </p>
        <p style={{ opacity: 0.4, fontSize: '0.75rem' }}>
          Production Quality Build &bull; High Frame Rate Parallax Canvas Enabled
        </p>
      </footer>
    </div>
  );
};
export default App;
