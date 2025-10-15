import React from 'react';
import { Cursor, Viewport } from '../../types/canvas';
import { worldToScreen } from '../../utils/coordinates';
import './Cursors.css';

interface CursorsProps {
  cursors: { [userId: string]: Cursor };
  viewport: Viewport;
  currentUserId: string;
}

const Cursors: React.FC<CursorsProps> = ({ cursors, viewport, currentUserId }) => {
  return (
    <div className="cursors-container">
      {Object.entries(cursors).map(([userId, cursor]) => {
        if (userId === currentUserId) return null;

        const screenPos = worldToScreen(cursor.position, viewport);
        const isStale = Date.now() - cursor.lastUpdated > 5000;

        if (isStale) return null;

        return (
          <div
            key={userId}
            className="cursor"
            style={{
              transform: `translate(${screenPos.x}px, ${screenPos.y}px)`,
              opacity: isStale ? 0.3 : 1
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={cursor.color}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
            </svg>
            <div
              className="cursor-label"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cursors;