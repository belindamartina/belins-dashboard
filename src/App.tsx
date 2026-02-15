import { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Clock from './components/Clock';
import TaskManager from './components/TaskManager';
import Quote from './components/Quote';
import FocusTimer from './components/FocusTimer';
import Stats from './components/Stats';

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [dashboardReady, setDashboardReady] = useState(false);

  // Restore saved name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('belins_user_name');
    if (saved) {
      setUserName(saved);
    }
  }, []);

  // Animate dashboard entrance after login
  useEffect(() => {
    if (userName) {
      const timer = setTimeout(() => setDashboardReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [userName]);

  const handleLogin = (name: string) => {
    localStorage.setItem('belins_user_name', name);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('belins_user_name');
    setUserName(null);
    setDashboardReady(false);
  };

  // Show login screen if not logged in
  if (!userName) {
    return (
      <>
        <div className="app-background">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      {/* Animated background */}
      <div className="app-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Main content */}
      <main className={`app-container ${dashboardReady ? 'dashboard-enter' : ''}`}>
        {/* User menu */}
        <div className="user-menu">
          <span className="user-avatar">{userName.charAt(0).toUpperCase()}</span>
          <span className="user-name">{userName}</span>
          <button className="btn-logout" onClick={handleLogout} title="Sign out">
            ↗
          </button>
        </div>

        {/* Clock & Greeting */}
        <Clock userName={userName} />

        {/* Stats Overview */}
        <Stats />

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Tasks */}
          <TaskManager />

          {/* Focus Timer */}
          <FocusTimer />

          {/* Quote */}
          <Quote />
        </div>
      </main>
    </>
  );
}

export default App;
