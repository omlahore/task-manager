import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import ConfirmModal from './components/ConfirmModal';
import { getUsername, setUsername, removeUsername, getTasks, setTasks } from './utils/localStorage';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasksState] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setTasksState(getTasks());
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const updateTasks = (newTasks) => {
    setTasksState(newTasks);
    setTasks(newTasks);
  };

  const handleAddTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    updateTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (id) => {
    updateTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      updateTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleEditTask = (id, updates) => {
    updateTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const handleFilterChange = (newFilter) => setFilter(newFilter);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const allCategories = Array.from(new Set(tasks.flatMap(t => t.categories || [])));

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;
    if (search && !(
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
    )) return false;
    if (categoryFilter && !(task.categories || []).includes(categoryFilter)) return false;
    return true;
  });

  const counts = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  const handleRequestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    updateTasks(tasks.filter(task => task.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Task Manager</h2>
        <div>
          <button className="dark-toggle-btn" onClick={() => setDarkMode(dm => !dm)} aria-label="Toggle dark mode">
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
            )}
            {darkMode ? 'Dark' : 'Light'}
          </button>
          <button className="logout-btn" onClick={onLogout} aria-label="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 4}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </div>
      <TaskForm onAdd={handleAddTask} />
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={handleSearchChange}
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
      />
      {allCategories.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ marginRight: 8 }}>Filter by category:</span>
          <button
            onClick={() => setCategoryFilter('')}
            style={{ marginRight: 6, fontWeight: !categoryFilter ? 'bold' : 'normal' }}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{ marginRight: 6, fontWeight: categoryFilter === cat ? 'bold' : 'normal' }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
      <TaskFilter currentFilter={filter} counts={counts} onFilterChange={handleFilterChange} />
      <TaskList tasks={filteredTasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={handleEditTask} onRequestDelete={handleRequestDelete} />
      <ConfirmModal open={showDeleteModal} message="Are you sure you want to delete this task?" onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getUsername());

  // Callback for login
  const handleLogin = useCallback((username) => {
    setUsername(username);
    setIsLoggedIn(true);
  }, []);

  // Callback for logout
  const handleLogout = useCallback(() => {
    removeUsername();
    setIsLoggedIn(false);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
