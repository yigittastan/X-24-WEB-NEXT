"use client";
import { useState, useEffect, useRef } from "react";

export default function TimeTracker() {
  const [isWorking, setIsWorking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isWorking && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isWorking, isPaused]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startWork = async () => {
    // API isteği burada yapılabilir...
    setIsWorking(true);
    setIsPaused(false);
    setSeconds(0);
  };

  const pauseWork = async () => {
    setIsPaused(true);
  };

  const resumeWork = async () => {
    setIsPaused(false);
  };

  const finishWork = async () => {
    setIsWorking(false);
    setIsPaused(false);
    setSeconds(0);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 p-1">
      {isWorking ? (
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Zaman Gösterimi */}
          <div className="bg-white rounded-lg p-3 shadow-sm border w-full min-h-[120px] flex items-center justify-center">
            <div className="text-xs font-bold text-blue-600 font-mono leading-tight transform -rotate-90 whitespace-nowrap">
              {formatTime(seconds)}
            </div>
          </div>

          {/* Kontrol Butonları */}
          <div className="flex flex-col gap-1 w-full">
            {!isPaused ? (
              <button
                onClick={pauseWork}
                className="w-full h-10 rounded-md font-medium bg-yellow-500 text-white hover:bg-yellow-600 text-xs transition-colors flex items-center justify-center"
                title="Duraklat"
              >
                ⏸️
              </button>
            ) : (
              <button
                onClick={resumeWork}
                className="w-full h-10 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 text-xs transition-colors flex items-center justify-center"
                title="Devam Et"
              >
                ▶️
              </button>
            )}
            <button
              onClick={finishWork}
              className="w-full h-10 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 text-xs transition-colors flex items-center justify-center"
              title="Bitir"
            >
              ⏹️
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startWork}
          className="w-full h-16 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center"
          title="İşe Başla"
        >
          ▶️
        </button>
      )}
    </div>
  );
}
