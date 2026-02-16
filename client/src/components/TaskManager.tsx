import { useState, useEffect, useCallback } from 'react';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const BASE_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/tasks`;

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask }),
      });
      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
      setNewTask('');
    } catch {
      console.error('Failed to add task');
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'PATCH' });
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: updated.completed } : t))
      );
    } catch {
      console.error('Failed to toggle task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      console.error('Failed to delete task');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <div className="section-icon purple">✅</div>
        <h2 className="section-title">Tasks</h2>
      </div>

      <div className="task-input-wrapper">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-add-task" onClick={addTask}>
          Add
        </button>
      </div>

      {loading ? (
        <p className="task-empty">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="task-empty">No tasks yet. Add one above! ✨</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleTask(task._id)}
              >
                {task.completed ? '✓' : ''}
              </button>
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                {task.text}
              </span>
              <button className="btn-delete-task" onClick={() => deleteTask(task._id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager;
