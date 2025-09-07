"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ScanQR() {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const isStartedRef = useRef<boolean>(false);
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
      if (html5QrCodeRef.current && isStartedRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
        isStartedRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (scanning && scannerRef.current) {
      const runScanner = async () => {
        try {
          const { Html5Qrcode } = await import("html5-qrcode");
          // Ensure previous instance is fully stopped and cleared
          if (html5QrCodeRef.current) {
            try {
              await html5QrCodeRef.current.stop();
            } catch {}
            try {
              await html5QrCodeRef.current.clear();
            } catch {}
          }

          // Wait one frame to ensure the scanner container has layout and size
          await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

          if (!scannerRef.current) return;
          html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);

          await html5QrCodeRef.current.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText: string) => {
              if (html5QrCodeRef.current && isStartedRef.current) {
                html5QrCodeRef.current
                  .stop()
                  .catch(() => {})
                  .finally(() => {
                    isStartedRef.current = false;
                    router.push(`/admin/scan-qr/success?data=${encodeURIComponent(decodedText)}`);
                  });
              } else {
                router.push(`/admin/scan-qr/success?data=${encodeURIComponent(decodedText)}`);
              }
            },
            () => {}
          );
          isStartedRef.current = true;
        } catch (err: any) {
          alert("Camera error: " + (err?.message || String(err)));
          setScanning(false);
        }
      };
      runScanner();
    }
    // Cleanup when scanning stops
    return () => {
      if (html5QrCodeRef.current && isStartedRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
        isStartedRef.current = false;
      }
    };
  }, [scanning, router]);

  const handleStartScan = () => {
    // Unlock audio on user gesture so failure buzzer can play later
    try {
      const audio = new Audio('/audio/buzzer.mp3');
      audio.volume = 0;
      audio.play()
        .then(() => {
          try { audio.pause(); audio.currentTime = 0; } catch {}
          (window as any).__audioUnlocked = true;
        })
        .catch(() => { (window as any).__audioUnlocked = false; });
    } catch { (window as any).__audioUnlocked = false; }
    setScanning(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-12 px-4 text-white font-sans">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col items-center carnival-card animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-fuchsia-400 to-rose-400 text-transparent bg-clip-text leading-tight">Scan QR Code</h1>
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
              <div ref={scannerRef} id="qr-scanner" className="w-full aspect-square bg-black rounded-lg border border-white/20 flex items-center justify-center overflow-hidden" />
              <button
                onClick={() => { setScanning(false); router.push('/admin'); }}
                className="w-full mt-4 py-3 px-6 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-rose-400 to-fuchsia-400 hover:from-rose-500 hover:to-fuchsia-500 text-white"
              >
                Exit
              </button>
            </>
          )}
          <p className="text-gray-300 text-center text-xs md:text-sm mt-2">Allow camera access to scan a QR code for event check-in.</p>
        </div>
      </div>
    </div>
  );
} 
