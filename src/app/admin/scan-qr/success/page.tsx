import React, { Suspense } from "react";
import ScanSuccessClient from "./ScanSuccessClient";

export default function ScanSuccessPage() {
  return (
    <Suspense>
      <ScanSuccessClient />
    </Suspense>
  );
} 