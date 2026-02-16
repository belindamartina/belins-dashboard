import { useState, useEffect, useCallback } from 'react';

interface StatsData {
  total: number;
  completed: number;
  pending: number;
}

const BASE_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/tasks`;

const useAnimatedCounter = (target: number, duration: number = 600): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
};

const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({ total: 0, completed: 0, pending: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const tasks = await res.json();
      const completed = tasks.filter((t: { completed: boolean }) => t.completed).length;
      setStats({
        total: tasks.length,
        completed,
        pending: tasks.length - completed,
      });
    } catch {
      console.error('Failed to fetch stats');
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const animatedTotal = useAnimatedCounter(stats.total);
  const animatedCompleted = useAnimatedCounter(stats.completed);
  const animatedPending = useAnimatedCounter(stats.pending);

  return (
    <div className="glass-card full-width">
      <div className="section-header">
        <div className="section-icon green">📊</div>
        <h2 className="section-title">Statistics</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value purple">{animatedTotal}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value green">{animatedCompleted}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value amber">{animatedPending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
