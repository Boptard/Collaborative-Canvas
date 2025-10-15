export type ShapeType = 'rectangle' | 'circle';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CanvasObject {
  id: string;
  type: ShapeType;
  position: Position;
  size: Size;
  color: string;
  borderColor: string;
  borderWidth: number;
  rotation: number;
  lockedBy?: string;
  lockedAt?: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  color: string;
}

export interface Cursor {
  userId: string;
  position: Position;
  userName: string;
  color: string;
  lastUpdated: number;
}

export interface Viewport {
  center: Position;
  zoom: number;
}

export interface CanvasState {
  id: string;
  objects: CanvasObject[];
  viewport: Viewport;
  cursors: { [userId: string]: Cursor };
  activeUsers: { [userId: string]: User };
  lastUpdated: number;
}

export interface InteractionState {
  isMouseDown: boolean;
  isPanning: boolean;
  isResizing: boolean;
  isDragging: boolean;
  selectedObjectId: string | null;
  dragStart: Position | null;
  resizeHandle: string | null;
}