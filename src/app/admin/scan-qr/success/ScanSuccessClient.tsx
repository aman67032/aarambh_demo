"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import createApiUrl from "../../../../lib/api";

interface UserData {
  _id: string;
  name: string;
  email: string;
  isvalidated: boolean;
  hasEntered: boolean;
  entryTime: string | null;
  allowEntry: boolean;
}

function extractId(data: string | null): string | null {
  if (!data) return null;
  
  try {
    // Try to parse as JSON
    const obj = JSON.parse(data);
    if (typeof obj === "object" && obj._id) return obj._id;
  } catch {
    // Not JSON, continue
  }
  
  // If it's a URL, try to get last part
  if (data.startsWith("http")) {
    const parts = data.split("/");
    return parts[parts.length - 1] || null;
  }
  
  // Otherwise, assume the data is the ID itself
  return data;
}

export default function ScanSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowingEntry, setAllowingEntry] = useState(false);
  const [entryResult, setEntryResult] = useState<any>(null);

  // Extract ID from scanned data
  const userId = extractId(data);

  useEffect(() => {
    if (!userId) {
      setError("No valid user ID found in QR code");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(createApiUrl(`/admin/verify/${userId}`), {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error("User not found");
        }
        const user = await response.json();
        setUserData(user);
        
        // Auto-play buzzer if user has already entered
        if (user.hasEntered) {
          playBuzzer();
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Redirect after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/admin/scan-qr?scan=1");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [userId, router]);

  // Function to play buzzer sound
  const playBuzzer = () => {
    try {
      const audio = new Audio('/audio/buzzer.mp3');
      audio.play().catch((e) => {
        console.error('Error playing buzzer:', e);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  };

  // Function to allow entry
  const handleAllowEntry = async () => {
    if (!userId) return;
    
    setAllowingEntry(true);
    try {
      const response = await fetch(createApiUrl(`/admin/allow-entry/${userId}`), {
        method: 'POST',
        credentials: 'include'
      });
      
      const result = await response.json();
      setEntryResult(result);
      
      if (result.playBuzzer) {
        playBuzzer();
      }
      
      // Update user data to reflect new entry status
      if (result.success && userData) {
        setUserData({
          ...userData,
          hasEntered: true,
          entryTime: result.entryTime,
          allowEntry: false
        });
      }
      
    } catch (err) {
      setError('Failed to process entry');
    } finally {
      setAllowingEntry(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-4 text-white font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-10 flex flex-col items-center carnival-card animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text">
          Welcome to Sabrang 2025
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="mb-6 text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : userData ? (
          <>
            <div className="mb-6 text-center">
              <span className="text-sm text-gray-200">
                Hello <span className="font-semibold text-white">{userData.name}</span>
              </span>
              
              {/* Entry Status Display */}
              {userData.hasEntered ? (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-300 font-bold text-lg">🚫 ACCESS DENIED</p>
                  <p className="text-red-400 text-sm mt-1">User has already entered</p>
                  {userData.entryTime && (
                    <p className="text-red-400 text-xs mt-1">
                      Entry time: {new Date(userData.entryTime).toLocaleString()}
                    </p>
                  )}
                  <div className="mt-3 animate-pulse">
                    <p className="text-red-300 text-xs">🔊 BUZZER ACTIVATED</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                  <p className="text-green-300 font-bold text-lg">✅ ENTRY ALLOWED</p>
                  <p className="text-green-400 text-sm mt-1">First-time entry</p>
                  
                  {!entryResult && (
                    <button
                      onClick={handleAllowEntry}
                      disabled={allowingEntry}
                      className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                               text-white rounded-lg transition-colors duration-200 text-sm font-semibold"
                    >
                      {allowingEntry ? 'Processing...' : 'ALLOW ENTRY'}
                    </button>
                  )}
                  
                  {entryResult && (
                    <div className={`mt-3 p-2 rounded ${entryResult.success ? 'bg-green-600' : 'bg-red-600'}`}>
                      <p className="text-white text-sm">{entryResult.message}</p>
                      {entryResult.success && entryResult.entryTime && (
                        <p className="text-white text-xs mt-1">
                          Entry recorded at: {new Date(entryResult.entryTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mb-4 grid grid-cols-2 gap-4 w-full">
              <div className="p-3 bg-black/30 rounded-lg">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white text-sm">{userData.email}</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <p className="text-xs text-gray-400">Status</p>
                <p className={`text-sm font-semibold ${userData.hasEntered ? 'text-red-400' : 'text-green-400'}`}>
                  {userData.hasEntered ? 'Already Entered' : 'New Entry'}
                </p>
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-2 mb-6 p-4 bg-black/60 rounded-lg border border-green-400 text-green-300 w-full text-center">
          <span className="font-bold">Scanned ID:</span> {userId || "No ID found"}
        </div>

        <p className="text-gray-300 text-center text-sm">
          {loading ? "Fetching user details..." : "Redirecting back to scanner..."}
        </p>
      </div>
    </div>
  );
}