import { Position, Viewport } from '../types/canvas';

export const screenToWorld = (screenPos: Position, viewport: Viewport): Position => {
  return {
    x: (screenPos.x - window.innerWidth / 2) / viewport.zoom + viewport.center.x,
    y: (screenPos.y - window.innerHeight / 2) / viewport.zoom + viewport.center.y
  };
};

export const worldToScreen = (worldPos: Position, viewport: Viewport): Position => {
  return {
    x: (worldPos.x - viewport.center.x) * viewport.zoom + window.innerWidth / 2,
    y: (worldPos.y - viewport.center.y) * viewport.zoom + window.innerHeight / 2
  };
};

export const getMousePosition = (event: MouseEvent | React.MouseEvent): Position => {
  return {
    x: event.clientX,
    y: event.clientY
  };
};

export const clampZoom = (zoom: number): number => {
  return Math.max(0.1, Math.min(5, zoom));
};