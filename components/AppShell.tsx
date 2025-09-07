"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import SplashCursor from "./SplashCursor";
import { SidebarDock } from "./SidebarDock";
import Logo from "./Logo";
import InfinityTransition from "./InfinityTransition";
import { NavigationProvider } from "./NavigationContext";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

// Separate component that uses usePathname
function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle page transitions
  useEffect(() => {
    if (mounted && previousPath && previousPath !== pathname) {
      // If there's no pending navigation, this is a direct URL change
      // Just update the path without animation
      setPreviousPath(pathname);
      setIsTransitioning(false); // Ensure content is visible for direct navigation
    } else if (!previousPath) {
      // Initial load
      setPreviousPath(pathname);
      setIsTransitioning(false);
    }
  }, [pathname, mounted, previousPath]);

  // Reset transition state when pathname changes (after animation)
  useEffect(() => {
    if (!showTransition && pendingNavigation) {
      // Clear pending navigation after successful transition
      setPendingNavigation(null);
    }
  }, [showTransition, pendingNavigation]);

  // Ensure content is visible when pathname changes (for direct navigation)
  useEffect(() => {
    if (pathname && !isTransitioning && !showTransition) {
      setIsTransitioning(false);
    }
  }, [pathname, isTransitioning, showTransition]);

  const handleSidebarNavigate = (href: string) => {
    // Clean the href to remove query parameters for consistent navigation
    const cleanHref = href.split('?')[0];
    setPendingNavigation(cleanHref);
    setIsTransitioning(true);
    setShowTransition(true);
    // Don't call router.push here - let InfinityTransition handle it
  };

  const handleTransitionComplete = () => {
    // Add a longer delay to ensure the new page is fully loaded and rendered
    setShowTransition(false);
    
    // Gradually reveal content with proper timing
    setTimeout(() => {
      if (pendingNavigation) {
        setPendingNavigation(null);
      }
      setIsTransitioning(false);
    }, 150); // Increased delay to prevent flash of old content
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideChrome = pathname === "/" || pathname?.startsWith("/home") || pathname === "/Login" || pathname === "/Signup";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Disable SplashCursor globally to remove WebGL cost */}
      {/* <div className="hidden lg:block">
        <SplashCursor />
      </div> */}
      <Background />
      <InfinityTransition 
        isActive={showTransition} 
        targetHref={pendingNavigation}
        onComplete={handleTransitionComplete}
      />
      <div className="relative z-30 flex-grow">
        <NavigationProvider navigate={handleSidebarNavigate}>
          {mounted && !hideChrome && pathname !== "/why-sponsor-us" && <Logo />}
          <main 
            key={pathname}
            className={`${
              isTransitioning ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 visible'
            }`}
          >
            {!isTransitioning && children}
          </main>
          {!hideChrome && <SidebarDock className="hidden lg:block" onNavigate={handleSidebarNavigate} />}
        </NavigationProvider>
      </div>
      
    </div>
  );
}

// Main AppShell component with Suspense boundary
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black">
        <Background />
        <main>{children}</main>
      </div>
    }>
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}
