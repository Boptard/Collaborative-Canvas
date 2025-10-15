import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasObject, Viewport, InteractionState } from '../../types/canvas';
import { screenToWorld, getMousePosition, clampZoom } from '../../utils/coordinates';
import './Canvas.css';

interface CanvasProps {
  objects: CanvasObject[];
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  onObjectCreate: (object: CanvasObject) => void;
  onObjectUpdate: (object: CanvasObject) => void;
  onObjectDelete: (objectId: string) => void;
  selectedTool: 'select' | 'rectangle' | 'circle' | 'delete';
  userId: string;
}

const Canvas: React.FC<CanvasProps> = ({
  objects,
  viewport,
  onViewportChange,
  onObjectCreate,
  onObjectUpdate,
  onObjectDelete,
  selectedTool,
  userId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [interaction, setInteraction] = useState<InteractionState>({
    isMouseDown: false,
    isPanning: false,
    isResizing: false,
    isDragging: false,
    selectedObjectId: null,
    dragStart: null,
    resizeHandle: null
  });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(-viewport.center.x, -viewport.center.y);

    objects.forEach(obj => {
      ctx.save();
      ctx.translate(obj.position.x, obj.position.y);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      ctx.strokeStyle = obj.borderColor;
      ctx.lineWidth = obj.borderWidth;
      ctx.fillStyle = obj.color;

      if (obj.type === 'rectangle') {
        ctx.fillRect(-obj.size.width / 2, -obj.size.height / 2, obj.size.width, obj.size.height);
        ctx.strokeRect(-obj.size.width / 2, -obj.size.height / 2, obj.size.width, obj.size.height);
      } else if (obj.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, obj.size.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (interaction.selectedObjectId === obj.id) {
        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.setLineDash([5 / viewport.zoom, 5 / viewport.zoom]);
        if (obj.type === 'rectangle') {
          ctx.strokeRect(-obj.size.width / 2 - 5, -obj.size.height / 2 - 5, obj.size.width + 10, obj.size.height + 10);
        } else if (obj.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, obj.size.width / 2 + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        const handleSize = 8 / viewport.zoom;
        ctx.fillStyle = '#4ECDC4';
        const handles = [
          { x: -obj.size.width / 2, y: -obj.size.height / 2 },
          { x: obj.size.width / 2, y: -obj.size.height / 2 },
          { x: obj.size.width / 2, y: obj.size.height / 2 },
          { x: -obj.size.width / 2, y: obj.size.height / 2 }
        ];
        handles.forEach(handle => {
          ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        });
      }

      ctx.restore();
    });

    ctx.restore();
  }, [objects, viewport, interaction.selectedObjectId]);

  useEffect(() => {
    const animate = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const mousePos = getMousePosition(e);
    const worldPos = screenToWorld(mousePos, viewport);

    if (selectedTool === 'select') {
      // Check if clicking on any object (regardless of lock status)
      const clickedObject = objects.find(obj => {
        const dx = worldPos.x - obj.position.x;
        const dy = worldPos.y - obj.position.y;
        if (obj.type === 'rectangle') {
          return Math.abs(dx) <= obj.size.width / 2 && Math.abs(dy) <= obj.size.height / 2;
        } else if (obj.type === 'circle') {
          return Math.sqrt(dx * dx + dy * dy) <= obj.size.width / 2;
        }
        return false;
      });

      // If clicked on an object
      if (clickedObject) {
        // Allow any user to drag any shape
        setInteraction({
          ...interaction,
          isMouseDown: true,
          isDragging: true,
          selectedObjectId: clickedObject.id,
          dragStart: worldPos
        });
        // Lock the object to current user while dragging
        onObjectUpdate({ ...clickedObject, lockedBy: userId, lockedAt: Date.now() });
      } else {
        // Clicked on empty space, enable panning
        setInteraction({
          ...interaction,
          isMouseDown: true,
          isPanning: true,
          selectedObjectId: null,
          dragStart: mousePos
        });
      }
    } else if (selectedTool === 'delete') {
      // Find the topmost object at the click location
      // Iterate in reverse order (last drawn = topmost)
      let clickedObject = null;
      for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        const dx = worldPos.x - obj.position.x;
        const dy = worldPos.y - obj.position.y;

        let isInside = false;
        if (obj.type === 'rectangle') {
          isInside = Math.abs(dx) <= obj.size.width / 2 && Math.abs(dy) <= obj.size.height / 2;
        } else if (obj.type === 'circle') {
          isInside = Math.sqrt(dx * dx + dy * dy) <= obj.size.width / 2;
        }

        if (isInside) {
          clickedObject = obj;
          break; // Found the topmost object
        }
      }

      // Delete the clicked object
      if (clickedObject) {
        onObjectDelete(clickedObject.id);
      }
    } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      const newObject: CanvasObject = {
        id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: selectedTool,
        position: worldPos,
        size: { width: 100, height: 100 },
        color: '#ffffff',
        borderColor: '#000000',
        borderWidth: 2,
        rotation: 0
      };
      onObjectCreate(newObject);
    }
  }, [selectedTool, objects, viewport, interaction, userId, onObjectUpdate, onObjectCreate, onObjectDelete]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interaction.isMouseDown) return;

    const mousePos = getMousePosition(e);

    if (interaction.isPanning && interaction.dragStart) {
      const dx = (mousePos.x - interaction.dragStart.x) / viewport.zoom;
      const dy = (mousePos.y - interaction.dragStart.y) / viewport.zoom;
      onViewportChange({
        ...viewport,
        center: {
          x: viewport.center.x - dx,
          y: viewport.center.y - dy
        }
      });
      setInteraction({ ...interaction, dragStart: mousePos });
    } else if (interaction.isDragging && interaction.selectedObjectId && interaction.dragStart) {
      const worldPos = screenToWorld(mousePos, viewport);
      const selectedObject = objects.find(obj => obj.id === interaction.selectedObjectId);
      if (selectedObject) {
        onObjectUpdate({
          ...selectedObject,
          position: worldPos
        });
      }
    }
  }, [interaction, viewport, objects, onViewportChange, onObjectUpdate]);

  const handleMouseUp = useCallback(() => {
    if (interaction.selectedObjectId) {
      const selectedObject = objects.find(obj => obj.id === interaction.selectedObjectId);
      if (selectedObject && selectedObject.lockedBy === userId) {
        onObjectUpdate({ ...selectedObject, lockedBy: undefined, lockedAt: undefined });
      }
    }

    setInteraction({
      ...interaction,
      isMouseDown: false,
      isPanning: false,
      isDragging: false,
      isResizing: false,
      dragStart: null
    });
  }, [interaction, objects, userId, onObjectUpdate]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = clampZoom(viewport.zoom + delta);
    onViewportChange({ ...viewport, zoom: newZoom });
  }, [viewport, onViewportChange]);

  useEffect(() => {
    const handleResize = () => render();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

export default Canvas;