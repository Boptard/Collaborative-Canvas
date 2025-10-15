import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useCanvas } from './hooks/useCanvas';
import { generateUserColor } from './utils/colors';
import { screenToWorld } from './utils/coordinates';
import { Cursor } from './types/canvas';
import './utils/debugEnv'; // Import to trigger debug logging

import Login from './components/Auth/Login';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import Cursors from './components/Cursors/Cursors';
import Presence from './components/Presence/Presence';
import PerformanceMonitor from './components/PerformanceMonitor/PerformanceMonitor';

import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'circle'>('select');
  const [syncLatency, setSyncLatency] = useState<number>(0);

  const userColor = user ? generateUserColor(user.uid) : '#000000';
  const userName = user?.displayName || 'Anonymous';

  const {
    objects,
    viewport,
    cursors,
    activeUsers,
    updateViewport,
    createObject,
    updateObject,
    updateCursor,
    isLoading: isCanvasLoading
  } = useCanvas(user?.uid || '', userName, userColor);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!user) return;

    const worldPos = screenToWorld(
      { x: e.clientX, y: e.clientY },
      viewport
    );

    const cursor: Cursor = {
      userId: user.uid,
      position: worldPos,
      userName: userName,
      color: userColor,
      lastUpdated: Date.now()
    };

    updateCursor(cursor);
  }, [user, viewport, userName, userColor, updateCursor]);

  useEffect(() => {
    let lastSyncTime = Date.now();
    const measureLatency = setInterval(() => {
      const now = Date.now();
      setSyncLatency(now - lastSyncTime);
      lastSyncTime = now;
    }, 1000);

    return () => clearInterval(measureLatency);
  }, []);

  useEffect(() => {
    const throttledMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => handleMouseMove(e));
    };

    window.addEventListener('mousemove', throttledMouseMove);
    return () => window.removeEventListener('mousemove', throttledMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'v':
          setSelectedTool('select');
          break;
        case 'r':
          setSelectedTool('rectangle');
          break;
        case 'o':
          setSelectedTool('circle');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (isAuthLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  if (isCanvasLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading canvas...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Canvas
        objects={objects}
        viewport={viewport}
        onViewportChange={updateViewport}
        onObjectCreate={createObject}
        onObjectUpdate={updateObject}
        selectedTool={selectedTool}
        userId={user.uid}
      />
      <Cursors
        cursors={cursors}
        viewport={viewport}
        currentUserId={user.uid}
      />
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onSignOut={handleSignOut}
        userName={userName}
      />
      <Presence
        activeUsers={activeUsers}
        currentUserId={user.uid}
      />
      <PerformanceMonitor syncLatency={syncLatency} />
    </div>
  );
}

export default App;
