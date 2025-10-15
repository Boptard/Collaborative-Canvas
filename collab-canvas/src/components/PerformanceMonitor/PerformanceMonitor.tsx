import React, { useState, useEffect } from 'react';
import './PerformanceMonitor.css';

interface PerformanceMonitorProps {
  syncLatency?: number;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ syncLatency }) => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="performance-monitor">
      <div className="metric">
        <span className="metric-label">FPS:</span>
        <span className={`metric-value ${fps < 30 ? 'warning' : fps < 50 ? 'caution' : ''}`}>
          {fps}
        </span>
      </div>
      {syncLatency !== undefined && (
        <div className="metric">
          <span className="metric-label">Sync:</span>
          <span className={`metric-value ${syncLatency > 100 ? 'warning' : syncLatency > 50 ? 'caution' : ''}`}>
            {syncLatency}ms
          </span>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;