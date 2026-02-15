import { useState, useEffect, useRef, useCallback } from 'react';

type TimerState = 'idle' | 'running' | 'paused';

const PRESETS = [
  { label: '5m', value: 5 * 60 },
  { label: '15m', value: 15 * 60 },
  { label: '25m', value: 25 * 60 },
  { label: '45m', value: 45 * 60 },
];

const CIRCUMFERENCE = 2 * Math.PI * 80;

const FocusTimer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [state, setState] = useState<TimerState>('idle');
  const intervalRef = useRef<number | null>(null);

  const progress = totalSeconds > 0 ? (remaining / totalSeconds) * CIRCUMFERENCE : CIRCUMFERENCE;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = () => {
    if (remaining <= 0) return;
    setState('running');
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setState('idle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearTimer();
    setState('paused');
  };

  const reset = () => {
    clearTimer();
    setRemaining(totalSeconds);
    setState('idle');
  };

  const selectPreset = (seconds: number) => {
    clearTimer();
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setState('idle');
  };

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <div className="section-icon blue">🍅</div>
        <h2 className="section-title">Focus Timer</h2>
      </div>

      <div className="timer-display">
        <div className="timer-circle">
          <svg className="timer-svg" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <circle className="timer-track" cx="90" cy="90" r="80" />
            <circle
              className="timer-progress"
              cx="90"
              cy="90"
              r="80"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - progress}
            />
          </svg>
          <div className="timer-value">
            <span className="timer-digits">{formatTime(remaining)}</span>
            <span className="timer-label">
              {state === 'running' ? 'Focusing' : state === 'paused' ? 'Paused' : 'Ready'}
            </span>
          </div>
        </div>

        <div className="timer-controls">
          {state === 'running' ? (
            <button className="timer-btn" onClick={pause}>
              Pause
            </button>
          ) : (
            <button className="timer-btn primary" onClick={start}>
              {state === 'paused' ? 'Resume' : 'Start'}
            </button>
          )}
          <button className="timer-btn" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="timer-presets">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              className={`preset-btn ${totalSeconds === p.value ? 'active' : ''}`}
              onClick={() => selectPreset(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
