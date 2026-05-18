'use client';

import { useState, useEffect } from 'react';
import { Trophy, CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';

// FIFA World Cup 2026 kicks off on June 11, 2026
const WORLD_CUP_START = new Date('2026-06-11T00:00:00Z').getTime();

export default function WorldCupCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = WORLD_CUP_START - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch by not rendering the numbers until the client mounts
  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-7xl mx-auto mb-10 overflow-hidden"
    >
      <div className="relative bg-gradient-to-r from-gray-900 via-[#1a1c29] to-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* Left Side: Title & Icon */}
        <div className="flex items-center gap-4 z-10 text-center md:text-left">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Trophy className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
              FIFA World Cup 2026
            </h2>
            <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 justify-center md:justify-start mt-1">
              <CalendarClock className="w-4 h-4" /> 
              North America
            </p>
          </div>
        </div>

        {/* Right Side: The Countdown */}
        <div className="flex items-center gap-3 sm:gap-6 z-10">
          <TimeUnit value={timeLeft.days} label="Days" />
          <span className="text-2xl font-black text-gray-600 mb-6">:</span>
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <span className="text-2xl font-black text-gray-600 mb-6">:</span>
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <span className="text-2xl font-black text-gray-600 mb-6">:</span>
          <TimeUnit value={timeLeft.seconds} label="Secs" highlight />
        </div>
        
      </div>
    </motion.div>
  );
}

// Micro-component for each time unit block
function TimeUnit({ value, label, highlight = false }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
      <div className={`text-2xl sm:text-4xl font-black font-poppins tabular-nums tracking-tight ${highlight ? 'text-amber-500' : 'text-gray-100'}`}>
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">
        {label}
      </span>
    </div>
  );
}