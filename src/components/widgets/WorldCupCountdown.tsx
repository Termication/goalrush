'use client';

import { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// The estimated global kickoff time for the 2026 World Cup
const WORLD_CUP_START = new Date('2026-06-11T19:00:00Z').getTime();

export default function WorldCupCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [localKickoff, setLocalKickoff] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // Safely generate the user's local time ONLY on the client to prevent hydration errors
    const localTimeFormatted = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(WORLD_CUP_START));
    
    setLocalKickoff(localTimeFormatted);
    
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

  // Prevent hydration mismatch by not rendering the component until the client mounts
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

        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-4 z-10 text-center md:text-left">
          
          {/* Custom Logo Image with a soft backlight */}
          <div className="relative h-16 w-16 shrink-0 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Image 
              src="/world-cup.png" 
              alt="FIFA World Cup 2026 Logo" 
              fill 
              className="object-contain" 
            />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
              FIFA World Cup 2026
            </h2>
            <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 justify-center md:justify-start mt-1">
              <CalendarClock className="w-4 h-4 text-amber-500" /> 
              {localKickoff}
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