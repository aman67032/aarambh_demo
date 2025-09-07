// Ultra-aggressive background script for instant Spline preloading
// This runs immediately when the browser starts

(function() {
  // 1. Preload Spline scene with multiple strategies
  const sceneUrl = 'https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode';
  
  // Strategy 1: Full GET request with aggressive caching
  fetch(sceneUrl, {
    method: 'GET',
    mode: 'cors',
    cache: 'force-cache'
  }).then(res => res.arrayBuffer()).then(buffer => {
    // Store in localStorage for instant access
    try {
      localStorage.setItem('splineSceneCache', JSON.stringify(Array.from(new Uint8Array(buffer))));
    } catch (e) {}
  }).catch(() => {});
  
  // Strategy 2: HEAD request for connection establishment
  fetch(sceneUrl, {
    method: 'HEAD',
    mode: 'cors'
  }).catch(() => {});
  
  // Strategy 3: Preload Spline runtime
  import('https://unpkg.com/@splinetool/runtime@0.9.508/build/spline-runtime.js').catch(() => {});
  
  // Strategy 4: Preload Spline React component
  import('https://unpkg.com/@splinetool/react-spline@2.2.6/lib/index.js').catch(() => {});
  
  // Strategy 5: Preconnect to domain
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://prod.spline.design';
  document.head.appendChild(link);
  
  // Strategy 6: DNS prefetch
  const dnsLink = document.createElement('link');
  dnsLink.rel = 'dns-prefetch';
  dnsLink.href = 'https://prod.spline.design';
  document.head.appendChild(dnsLink);
  
  // Strategy 7: Prefetch scene
  const prefetchLink = document.createElement('link');
  prefetchLink.rel = 'prefetch';
  prefetchLink.href = sceneUrl;
  prefetchLink.crossOrigin = 'anonymous';
  document.head.appendChild(prefetchLink);
})();
