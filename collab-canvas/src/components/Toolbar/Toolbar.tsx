import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  selectedTool: 'select' | 'rectangle' | 'circle';
  onToolSelect: (tool: 'select' | 'rectangle' | 'circle') => void;
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