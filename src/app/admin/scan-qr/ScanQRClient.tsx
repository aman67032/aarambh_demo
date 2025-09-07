"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ScanQR() {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Automatically start scanning if redirected with ?scan=1
  useEffect(() => {
    if (searchParams.get("scan") === "1") {
      setScanning(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (scanning && scannerRef.current) {
      const runScanner = async () => {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!scannerRef.current) return;
        html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);
        html5QrCodeRef.current
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText: string) => {
              html5QrCodeRef.current.stop().catch(() => {});
              router.push(`/admin/scan-qr/success?data=${encodeURIComponent(decodedText)}`);
            },
            (error: any) => {
              // Optionally handle scan errors
            }
          )
          .catch((err: any) => {
            alert("Camera error: " + err?.message || err);
            setScanning(false);
          });
      };
      runScanner();
    }
    // Cleanup when scanning stops
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, [scanning, router]);

  const handleStartScan = () => {
    setScanning(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-4 text-white font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center carnival-card animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-fuchsia-400 to-rose-400 text-transparent bg-clip-text">Scan QR Code</h1>
        <div className="w-full flex flex-col items-center gap-6">
          {!scanning ? (
            <button
              onClick={handleStartScan}
              className="w-full py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-white mb-4"
            >
              Start Camera
            </button>
          ) : (
            <>
              <div ref={scannerRef} id="qr-scanner" className="w-full aspect-square bg-black rounded-lg border border-white/20 flex items-center justify-center" />
              <button
                onClick={() => { setScanning(false); router.push('/admin'); }}
                className="w-full mt-4 py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-rose-400 to-fuchsia-400 hover:from-rose-500 hover:to-fuchsia-500 text-white"
              >
                Exit
              </button>
            </>
          )}
          <p className="text-gray-300 text-center text-sm mt-2">Allow camera access to scan a QR code for event check-in.</p>
        </div>
      </div>
    </div>
  );
} 