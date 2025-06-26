"use client";
import { useState, useEffect, useRef } from 'react';

export default function RightPanel() {
  const [isWorking, setIsWorking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sayaç çalıştırma
  useEffect(() => {
    if (isWorking && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isWorking, isPaused]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // İşe başla
  const startWork = async () => {
    try {
      const response = await fetch('/api/work-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'default-user' // Kullanıcı ID'si
        },
        body: JSON.stringify({
          action: 'start',
          startTime: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSessionId(data.sessionId);
        setIsWorking(true);
        setIsPaused(false);
        setSeconds(0);
      } else {
        const error = await response.json();
        console.error('İş başlatılamadı:', error.error);
        alert(error.error);
      }
    } catch (error) {
      console.error('API hatası:', error);
    }
  };

  // İşi duraklat
  const pauseWork = async () => {
    if (!currentSessionId) return;

    try {
      await fetch(`/api/work-sessions/${currentSessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pause',
          duration: seconds,
          pauseTime: new Date().toISOString()
        })
      });

      setIsPaused(true);
    } catch (error) {
      console.error('API hatası:', error);
    }
  };

  // İşi devam ettir
  const resumeWork = async () => {
    if (!currentSessionId) return;

    try {
      await fetch(`/api/work-sessions/${currentSessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resume',
          duration: seconds
        })
      });

      setIsPaused(false);
    } catch (error) {
      console.error('API hatası:', error);
    }
  };

  // İşi bitir
  const finishWork = async () => {
    if (!currentSessionId) return;

    try {
      await fetch(`/api/work-sessions/${currentSessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'finish',
          duration: seconds,
          endTime: new Date().toISOString()
        })
      });

      setIsWorking(false);
      setIsPaused(false);
      setSeconds(0);
      setCurrentSessionId(null);
    } catch (error) {
      console.error('API hatası:', error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: 0,
        width: !isWorking ? "120px" : "280px", // Çalışırken genişlet
        height: `calc(100vh - 10px)`,
        backgroundColor: "#f0f0f0",
        borderLeft: "1px solid #ccc",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "10px",
        gap: "10px",
        transition: "width 0.3s ease" // Yumuşak geçiş
      }}
    >
      {/* Sayaç Gösterimi - Yatay */}
      {isWorking && (
        <div className="w-full px-4">
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <div className="text-center mb-2">
              <div className="text-2xl font-bold text-blue-600 font-mono">
                {formatTime(seconds)}
              </div>
              <div className="text-xs text-gray-500">
                {isPaused ? '⏸️ Duraklatıldı' : '▶️ Çalışıyor'}
              </div>
            </div>
            
            {/* Yatay Buton Grubu */}
            <div className="flex gap-2 justify-center">
              {!isPaused ? (
                <button
                  onClick={pauseWork}
                  className="px-3 py-1 rounded-md font-medium bg-yellow-500 text-white hover:bg-yellow-600 text-xs flex-1"
                >
                  ⏸️ Duraklat
                </button>
              ) : (
                <button
                  onClick={resumeWork}
                  className="px-3 py-1 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 text-xs flex-1"
                >
                  ▶️ Devam Et
                </button>
              )}
              <button
                onClick={finishWork}
                className="px-3 py-1 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 text-xs flex-1"
              >
                ⏹️ Bitir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Başlat Butonu */}
      {!isWorking && (
        <button
          onClick={startWork}
          className="px-4 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 text-sm shadow-md hover:shadow-lg transition-all"
        >
          ▶️ İşe Başla
        </button>
      )}

      {/* İstatistikler */}
      {isWorking && (
        <div className="w-full px-4 mt-4">
          <div className="bg-gray-100 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-600">Bugünkü Toplam</div>
            <div className="text-sm font-bold text-gray-800">
              {formatTime(seconds)} {/* Burada günlük toplam gösterilebilir */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}