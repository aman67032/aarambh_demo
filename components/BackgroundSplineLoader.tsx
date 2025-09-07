'use client';

import { useEffect } from 'react';

// Background service for ultra-fast Spline loading
export default function BackgroundSplineLoader() {
  useEffect(() => {
    // Start loading immediately when this component mounts (app initialization)
    
    // 1. Preload runtime in background
    const runtimePromise = import('@splinetool/runtime').then(({ Application }) => {
      if (typeof window !== 'undefined') {
        window.splineRuntimeCache = Application;
      }
      return Application;
    }).catch(() => {});
    
    // 2. Preload scene with aggressive caching
    const scenePromise = fetch('https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode', {
      method: 'GET',
      mode: 'cors',
      cache: 'force-cache'
    }).then(res => res.arrayBuffer()).then(buffer => {
      if (typeof window !== 'undefined') {
        window.splineSceneCache = buffer;
        
        // Store in localStorage for instant subsequent loads
        try {
          localStorage.setItem('splineSceneCache', JSON.stringify(Array.from(new Uint8Array(buffer))));
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    }).catch(() => {});
    
    // 3. Establish connection immediately
    const connectionPromise = fetch('https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode', {
      method: 'HEAD',
      mode: 'cors'
    }).catch(() => {});
    
    // Execute all preloading strategies in parallel
    Promise.all([runtimePromise, scenePromise, connectionPromise]).catch(() => {});
    
  }, []);

  return null; // This component doesn't render anything
}
