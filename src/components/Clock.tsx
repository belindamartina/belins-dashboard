import { useState, useEffect } from 'react';

interface ClockProps {
  userName: string;
}

const Clock: React.FC<ClockProps> = ({ userName }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = (): string => {
    const hour = time.getHours();
    if (hour < 6) return 'Good Night';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const formatTime = (): string => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (): string => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="glass-card clock-section">
      <p className="clock-greeting">
        {getGreeting()}, <span className="clock-user-name">{userName}</span>
      </p>
      <h1 className="clock-time">{formatTime()}</h1>
      <p className="clock-date">{formatDate()}</p>
    </div>
  );
};

export default Clock;
