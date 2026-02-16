import { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className={`login-screen ${animateIn ? 'animate-in' : ''}`}>
      {/* Background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.svg" alt="Belins Logo" className="login-logo-img" />
          <h1 className="login-title">Belins</h1>
        </div>
        <p className="login-subtitle">Your Personal Productivity Dashboard</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label className="login-label" htmlFor="name-input">
              What should we call you?
            </label>
            <input
              id="name-input"
              type="text"
              className="login-input"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={30}
            />
          </div>
          <button
            type="submit"
            className={`login-btn ${name.trim() ? 'active' : ''}`}
            disabled={!name.trim()}
          >
            <span>Get Started</span>
            <span className="login-btn-arrow">→</span>
          </button>
        </form>

        <p className="login-footer">
          Focused. Organized. Inspired.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
