import React from 'react';

const TaskFilter = ({ currentFilter, counts, onFilterChange }) => {
  return (
    <div className="task-filter">
      <button
        className={currentFilter === 'all' ? 'active' : ''}
        onClick={() => onFilterChange('all')}
      >
        All ({counts.all})
      </button>
      <button
        className={currentFilter === 'completed' ? 'active' : ''}
        onClick={() => onFilterChange('completed')}
      >
        Completed ({counts.completed})
      </button>
      <button
        className={currentFilter === 'pending' ? 'active' : ''}
        onClick={() => onFilterChange('pending')}
      >
        Pending ({counts.pending})
      </button>
    </div>
  );
};

export default TaskFilter; 