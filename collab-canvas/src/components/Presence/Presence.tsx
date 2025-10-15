import React from 'react';
import { User } from '../../types/canvas';
import './Presence.css';

interface PresenceProps {
  activeUsers: { [userId: string]: User };
  currentUserId: string;
}

const Presence: React.FC<PresenceProps> = ({ activeUsers, currentUserId }) => {
  const otherUsers = Object.entries(activeUsers).filter(([uid]) => uid !== currentUserId);

  if (otherUsers.length === 0) return null;

  return (
    <div className="presence-container">
      <div className="presence-list">
        {otherUsers.map(([uid, user]) => (
          <div key={uid} className="presence-user">
            <div
              className="presence-avatar"
              style={{ backgroundColor: user.color }}
            >
              {user.displayName ? user.displayName[0].toUpperCase() : '?'}
            </div>
            <span className="presence-name">{user.displayName || 'Anonymous'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presence;