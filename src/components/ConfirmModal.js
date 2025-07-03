import React from 'react';

const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button className="delete-btn" onClick={onConfirm}>Delete</button>
          <button className="edit-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 