import React from 'react';

const priorityColors = {
  Low: '#38a169',
  Medium: '#ecc94b',
  High: '#e53e3e',
};

const TaskItem = ({ task, onToggle, onDelete, onEdit, onRequestDelete }) => {
  const handleEdit = () => {
    const newTitle = window.prompt('Edit task title:', task.title);
    if (newTitle === null) return; // Cancelled
    const newDescription = window.prompt('Edit task description:', task.description || '');
    if (newDescription === null) return;
    const newPriority = window.prompt('Edit priority (Low, Medium, High):', task.priority || 'Medium');
    if (newPriority === null) return;
    const newDueDate = window.prompt('Edit due date (YYYY-MM-DD):', task.dueDate || '');
    if (newTitle.trim()) {
      onEdit(task.id, {
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        dueDate: newDueDate,
      });
    }
  };

  return (
    <div className={`task-item${task.completed ? ' completed' : ''}`}> 
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <div className="task-info">
          <div className="task-title">{task.title}</div>
          {task.description && <div className="task-desc">{task.description}</div>}
          {task.categories && task.categories.length > 0 && (
            <div className="task-categories">
              {task.categories.map((cat, idx) => (
                <span className="task-tag" key={idx}>{cat}</span>
              ))}
            </div>
          )}
          <div className="task-date">Created: {new Date(task.createdAt).toLocaleString()}</div>
          {task.dueDate && <div className="task-date">Due: {task.dueDate}</div>}
          {task.priority && (
            <div className="task-priority" style={{ color: priorityColors[task.priority] || '#2d3748', fontWeight: 600 }}>
              {task.priority} Priority
            </div>
          )}
        </div>
      </div>
      <div>
        <button className="edit-btn" onClick={handleEdit}>Edit</button>
        <button className="delete-btn" onClick={() => onRequestDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskItem; 