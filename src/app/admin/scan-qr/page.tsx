import React, { Suspense } from "react";
import ScanQRClient from "./ScanQRClient";

export default function ScanQRPage() {
  return (
    <Suspense>
      <ScanQRClient />
    </Suspense>
  );
} 