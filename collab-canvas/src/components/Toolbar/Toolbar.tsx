import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  selectedTool: 'select' | 'rectangle' | 'circle' | 'delete';
  onToolSelect: (tool: 'select' | 'rectangle' | 'circle' | 'delete') => void;
  onSignOut: () => void;
  userName?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onToolSelect, onSignOut, userName }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-tools">
        <button
          className={`tool-button ${selectedTool === 'select' ? 'active' : ''}`}
          onClick={() => onToolSelect('select')}
          title="Select (V)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
          </svg>
        </button>
        <button
          className={`tool-button ${selectedTool === 'rectangle' ? 'active' : ''}`}
          onClick={() => onToolSelect('rectangle')}
          title="Rectangle (R)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          </svg>
        </button>
        <button
          className={`tool-button ${selectedTool === 'circle' ? 'active' : ''}`}
          onClick={() => onToolSelect('circle')}
          title="Circle (O)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </button>
        <button
          className={`tool-button ${selectedTool === 'delete' ? 'active' : ''}`}
          onClick={() => onToolSelect('delete')}
          title="Delete (D)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
      <div className="toolbar-user">
        {userName && <span className="user-name">{userName}</span>}
        <button className="sign-out-button" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Toolbar;