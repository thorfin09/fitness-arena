import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Globe } from 'lucide-react';

export const LanguageThemeSwitcher: React.FC = () => {
  const { language, setLanguage, theme, setTheme } = useApp();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        padding: '0.5rem 1rem',
        borderRadius: '30px',
        boxShadow: 'var(--shadow-premium)',
      }}
    >
      {/* Theme Button Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-color)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          transition: 'var(--transition-fast)',
        }}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun size={18} style={{ color: '#ffb300' }} />
        ) : (
          <Moon size={18} style={{ color: 'var(--text-muted)' }} />
        )}
      </button>

      {/* Divider */}
      <span style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }} />

      {/* Language Selector Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'relative' }}>
        <Globe size={16} style={{ color: 'var(--text-muted)' }} />
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            paddingRight: '1rem',
            outline: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
          }}
        >
          <option value="en" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            English
          </option>
          <option value="hi" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            हिन्दी (Hindi)
          </option>
          <option value="bn" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            বাংলা (Bangla)
          </option>
          <option value="ur" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            اردو (Urdu)
          </option>
        </select>
        {/* Custom Arrow Indicator */}
        <span
          style={{
            position: 'absolute',
            right: 0,
            pointerEvents: 'none',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            transform: 'translateY(-1px)',
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
};
export default LanguageThemeSwitcher;
