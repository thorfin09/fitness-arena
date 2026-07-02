import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { User, Mail, Lock, Shield, CreditCard, LogOut, CheckCircle2, UserPlus, LogIn } from 'lucide-react';

export const AthleteZone: React.FC = () => {
  const { user, token, loginUser, logoutUser, t } = useApp();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await apiService.login(email, password);
        loginUser(data.user, data.token);
        setSuccessMsg(t('welcomeBack') + '!');
      } else {
        const data = await apiService.signup(name, email, password);
        loginUser(data.user, data.token);
        setSuccessMsg('Athlete Registered Successfully!');
      }
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = async (planName: string) => {
    if (!token) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await apiService.updateMembership(planName, token);
      // Sync local membership state
      const updatedUser = { ...user!, membership: data.membership };
      loginUser(updatedUser, token);
      setSuccessMsg(`Upgraded to ${planName} successfully!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '380px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Shield size={24} style={{ color: 'var(--accent-color)' }} />
        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
          {user ? t('athleteZone') : t('notLoggedIn')}
        </h3>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: 'rgba(255, 42, 42, 0.15)', border: '1px solid var(--accent-color)', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {user ? (
        /* LOGGED IN ATHLETE PROFILE VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>
              {t('welcomeBack')}, {user.name}!
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', textTransform: 'uppercase' }}>
              System Role: <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{user.role}</span>
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CreditCard size={18} style={{ color: 'var(--accent-color)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Membership Status</span>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {user.membership?.plan !== 'None' ? (
                <span style={{ color: '#22c55e' }}>{user.membership.plan} ({user.membership.status})</span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No Active Plan</span>
              )}
            </p>
            {user.membership?.endDate && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Expires: {new Date(user.membership.endDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Quick Member Upgrade Actions */}
          <div>
            <h5 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-color)' }}>Upgrade Arena Tier:</h5>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Beast Starter', 'Power Lifter', 'Olympian Pro'].map((plan) => (
                <button
                  key={plan}
                  disabled={loading || user.membership?.plan === plan}
                  onClick={() => handleBuyPlan(plan)}
                  style={{
                    backgroundColor: user.membership?.plan === plan ? 'var(--border-color)' : 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    cursor: user.membership?.plan === plan ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="btn-outline-beast"
            style={{
              padding: '0.5rem 1.2rem',
              fontSize: '0.9rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: '0.5rem',
            }}
          >
            <LogOut size={16} />
            {t('logoutBtn')}
          </button>
        </div>
      ) : (
        /* AUTH FORM (LOGIN & REGISTER) */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {!isLogin && (
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <User size={18} style={{ color: 'var(--text-muted)', marginInlineEnd: '0.6rem' }} />
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ background: 'none', border: 'none', color: 'var(--text-color)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <Mail size={18} style={{ color: 'var(--text-muted)', marginInlineEnd: '0.6rem' }} />
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ background: 'none', border: 'none', color: 'var(--text-color)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <Lock size={18} style={{ color: 'var(--text-muted)', marginInlineEnd: '0.6rem' }} />
            <input
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ background: 'none', border: 'none', color: 'var(--text-color)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn-beast"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              t('loading')
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                {t('loginBtn')}
              </>
            ) : (
              <>
                <UserPlus size={18} />
                {t('signupBtn')}
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-color)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'underline',
              }}
            >
              {isLogin ? t('toggleToSignup') : t('toggleToLogin')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default AthleteZone;
