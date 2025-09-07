'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LayeredLandingPage from "./HOME";
import LoadingPage from "../../components/LoadingPage";

// Separate component that uses useSearchParams
function PageContent() {
  // Temporarily disable first-visit loading video
  const [showLoading, setShowLoading] = useState(false);
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Disabled: do not show the intro/loading video for now
    setShowLoading(false);
    setHasShownLoading(true);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      {/* Intro video disabled */}
      {/* <LoadingPage isVisible={showLoading} onComplete={handleLoadingComplete} /> */}
      <LayeredLandingPage isLoading={false} />
    </>
  );
}

// Main page component with Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={<LayeredLandingPage isLoading={false} />}>
      <PageContent />
    </Suspense>
  );
}
