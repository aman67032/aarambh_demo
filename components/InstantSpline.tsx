'use client';

import React, { useEffect, useRef } from 'react';

// Global cache types
declare global {
  var splineSceneCache: any;
  var splineRuntimeCache: any;
}

export default function InstantSpline({ scene, style }: { scene: string; style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<any>(null);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        // Get or create runtime
        let runtime = window.splineRuntimeCache;
        if (!runtime) {
          const { Application } = await import('@splinetool/runtime');
          runtime = new Application(canvasRef.current!);
          window.splineRuntimeCache = runtime;
        }

        runtimeRef.current = runtime;

        // Get scene data
        let sceneData = window.splineSceneCache;
        let sceneUrl = scene;
        
        if (!sceneData) {
          // Check localStorage
          const cached = localStorage.getItem('splineSceneCache');
          if (cached) {
            sceneData = new Uint8Array(JSON.parse(cached)).buffer;
            // Create blob URL for cached data
            sceneUrl = URL.createObjectURL(new Blob([sceneData], { type: 'application/octet-stream' }));
          } else {
            // Fetch scene
            const response = await fetch(scene, {
              method: 'GET',
              mode: 'cors',
              cache: 'force-cache'
            });
            sceneData = await response.arrayBuffer();
            // Cache for next time
            try {
              localStorage.setItem('splineSceneCache', JSON.stringify(Array.from(new Uint8Array(sceneData))));
            } catch (e) {}
            // Create blob URL for fetched data
            sceneUrl = URL.createObjectURL(new Blob([sceneData], { type: 'application/octet-stream' }));
          }
          window.splineSceneCache = sceneData;
        } else {
          // Use cached data with blob URL
          sceneUrl = URL.createObjectURL(new Blob([sceneData], { type: 'application/octet-stream' }));
        }

        // Load scene with URL
        await runtime.load(sceneUrl);
        
      } catch (error) {
        console.error('Spline loading error:', error);
        // Fallback: try loading from original URL
        if (runtimeRef.current) {
          await runtimeRef.current.load(scene);
        }
      }
    };

    // Load immediately
    loadSpline();

    return () => {
      // Cleanup
      if (runtimeRef.current) {
        runtimeRef.current.dispose();
      }
    };
  }, [scene]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
    />
  );
}
