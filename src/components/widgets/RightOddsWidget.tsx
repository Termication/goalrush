'use client';

import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { checkWidgetHealth } from '@/lib/checkWidgets';

// Configuration
const WIDGETS = {
  premierLeague: "https://widget.the-odds-api.com/v1/sports/soccer_epl/events/?accessKey=YOUR_KEY_HERE&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3AMoneyline%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  laLiga: "https://widget.the-odds-api.com/v1/sports/soccer_spain_la_liga/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3AMoneyline%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
};

export default function RightOddsWidget() {
  const [activeLeague, setActiveLeague] = useState('laLiga');
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<'loading' | 'visible' | 'hidden'>('loading');

  const currentUrl = WIDGETS[activeLeague as keyof typeof WIDGETS];

  useEffect(() => {
    let isMounted = true;

    const performCheck = async () => {
      setStatus('loading');
      
      // Call the Server Action
      // This bypasses the CORS NetworkError
      const isHealthy = await checkWidgetHealth(currentUrl);

      if (!isMounted) return;

      if (isHealthy) {
        setStatus('visible');
      } else {
        console.warn("Widget hidden: Health check failed (Likely 429 Quota or 404)");
        setStatus('hidden');
      }
    };

    performCheck();

    return () => { isMounted = false; };
  }, [currentUrl]);

  // If Hidden (Quota/Error), Return Null
  if (status === 'hidden') return null;

  return (
    <aside 
      className={cn(
        "hidden 2xl:block fixed right-6 top-24 w-[320px] z-30",
        // Only animate in when confirmed visible
        status === 'visible' ? "animate-in slide-in-from-right-6 fade-in duration-700" : "opacity-0"
      )}
    >
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-1 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Live Odds</h3>
          </div>
          
          <select 
            value={activeLeague}
            onChange={(e) => {
              setLoaded(false); 
              setActiveLeague(e.target.value);
            }}
            className="text-xs bg-gray-700 dark:bg-gray-800 border-none rounded-md px-2 py-1 cursor-pointer focus:ring-2 focus:ring-green-500"
          >
            <option value="premierLeague">EPL</option>
            <option value="laLiga">La Liga</option>
          </select>
        </div>

        {/* Iframe Container */}
        <div className="relative w-full h-[450px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          
          {/* Skeleton Overlay */}
          {(!loaded || status === 'loading') && (
             <div className="absolute inset-0 p-4 space-y-4 z-10 bg-white dark:bg-gray-900">
               <Skeleton className="h-8 w-1/2" />
               <Skeleton className="h-24 w-full rounded-xl" />
               <Skeleton className="h-24 w-full rounded-xl" />
               <Skeleton className="h-24 w-full rounded-xl" />
             </div>
          )}
          
          {/* Iframe */}
          {status === 'visible' && (
            <iframe
              key={activeLeague}
              title="Sports Odds Widget"
              src={currentUrl}
              onLoad={() => setLoaded(true)}
              className={cn(
                "w-full h-full border-0 transition-opacity duration-500",
                loaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
            />
          )}
        </div>
        
      </div>
    </aside>
  );
}