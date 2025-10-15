import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CanvasState, CanvasObject, Viewport, Cursor } from '../types/canvas';

const CANVAS_ID = 'shared-canvas';
const SYNC_THROTTLE_MS = 16;

interface UseCanvasReturn {
  objects: CanvasObject[];
  viewport: Viewport;
  cursors: { [userId: string]: Cursor };
  activeUsers: { [userId: string]: any };
  updateViewport: (viewport: Viewport) => void;
  createObject: (object: CanvasObject) => void;
  updateObject: (object: CanvasObject) => void;
  updateCursor: (cursor: Cursor) => void;
  isLoading: boolean;
}

export const useCanvas = (userId: string, userName: string, userColor: string): UseCanvasReturn => {
  // Skip if no user ID (not signed in yet)
  const isValidUser = userId && userId.trim() !== '';
  const [canvasState, setCanvasState] = useState<CanvasState>({
    id: CANVAS_ID,
    objects: [],
    viewport: { center: { x: 0, y: 0 }, zoom: 1 },
    cursors: {},
    activeUsers: {},
    lastUpdated: Date.now()
  });
  const [isLoading, setIsLoading] = useState(true);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<CanvasState>>({});

  const syncToFirestore = useCallback(async () => {
    if (Object.keys(pendingUpdatesRef.current).length === 0) return;

    const updates = { ...pendingUpdatesRef.current };
    pendingUpdatesRef.current = {};

    try {
      const docRef = doc(db, 'canvases', CANVAS_ID);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error syncing to Firestore:', error);
    }
  }, []);

  const scheduleSyncToFirestore = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(syncToFirestore, SYNC_THROTTLE_MS);
  }, [syncToFirestore]);

  useEffect(() => {
    if (!isValidUser) {
      setIsLoading(false);
      return;
    }

    const initCanvas = async () => {
      const docRef = doc(db, 'canvases', CANVAS_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const initialState: CanvasState = {
          id: CANVAS_ID,
          objects: [],
          viewport: { center: { x: 0, y: 0 }, zoom: 1 },
          cursors: {},
          activeUsers: {},
          lastUpdated: Date.now()
        };
        await setDoc(docRef, initialState);
      }

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data() as CanvasState;
          setCanvasState(data);
          setIsLoading(false);
        }
      });

      return () => unsubscribe();
    };

    initCanvas();
  }, [isValidUser]);

  const updateViewport = useCallback((viewport: Viewport) => {
    setCanvasState(prev => ({ ...prev, viewport }));
    pendingUpdatesRef.current.viewport = viewport;
    scheduleSyncToFirestore();
  }, [scheduleSyncToFirestore]);

  const createObject = useCallback((object: CanvasObject) => {
    setCanvasState(prev => {
      const newObjects = [...prev.objects, object];
      pendingUpdatesRef.current.objects = newObjects;
      scheduleSyncToFirestore();
      return { ...prev, objects: newObjects };
    });
  }, [scheduleSyncToFirestore]);

  const updateObject = useCallback((updatedObject: CanvasObject) => {
    setCanvasState(prev => {
      const newObjects = prev.objects.map(obj =>
        obj.id === updatedObject.id ? updatedObject : obj
      );
      pendingUpdatesRef.current.objects = newObjects;
      scheduleSyncToFirestore();
      return { ...prev, objects: newObjects };
    });
  }, [scheduleSyncToFirestore]);

  const updateCursor = useCallback((cursor: Cursor) => {
    if (!isValidUser) return;

    setCanvasState(prev => {
      const newCursors = {
        ...prev.cursors,
        [userId]: cursor
      };
      pendingUpdatesRef.current.cursors = newCursors;
      scheduleSyncToFirestore();
      return { ...prev, cursors: newCursors };
    });
  }, [userId, isValidUser, scheduleSyncToFirestore]);

  useEffect(() => {
    if (!isValidUser) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setCanvasState(prev => {
          const newCursors = { ...prev.cursors };
          delete newCursors[userId];
          const newActiveUsers = { ...prev.activeUsers };
          delete newActiveUsers[userId];
          pendingUpdatesRef.current.cursors = newCursors;
          pendingUpdatesRef.current.activeUsers = newActiveUsers;
          syncToFirestore();
          return { ...prev, cursors: newCursors, activeUsers: newActiveUsers };
        });
      } else if (document.visibilityState === 'visible') {
        setCanvasState(prev => {
          const newActiveUsers = {
            ...prev.activeUsers,
            [userId]: { uid: userId, email: '', displayName: userName, color: userColor }
          };
          pendingUpdatesRef.current.activeUsers = newActiveUsers;
          scheduleSyncToFirestore();
          return { ...prev, activeUsers: newActiveUsers };
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    setCanvasState(prev => {
      const newActiveUsers = {
        ...prev.activeUsers,
        [userId]: { uid: userId, email: '', displayName: userName, color: userColor }
      };
      pendingUpdatesRef.current.activeUsers = newActiveUsers;
      scheduleSyncToFirestore();
      return { ...prev, activeUsers: newActiveUsers };
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, userName, userColor, isValidUser, syncToFirestore, scheduleSyncToFirestore]);

  return {
    objects: canvasState.objects,
    viewport: canvasState.viewport,
    cursors: canvasState.cursors,
    activeUsers: canvasState.activeUsers,
    updateViewport,
    createObject,
    updateObject,
    updateCursor,
    isLoading
  };
};