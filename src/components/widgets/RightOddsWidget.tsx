'use client';

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


const WIDGETS = {
  premierLeague: "https://widget.the-odds-api.com/v1/sports/soccer_epl/events/?...", // to full URL here
  laLiga: "https://widget.the-odds-api.com/v1/sports/soccer_spain_la_liga/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3AMoneyline%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
};

export default function RightOddsWidget() {
  const [activeLeague, setActiveLeague] = useState('laLiga');
  const [loaded, setLoaded] = useState(false);

  // Get the URL based on state
  const currentUrl = WIDGETS[activeLeague as keyof typeof WIDGETS];

  return (
    <aside className="hidden xl:block fixed right-6 top-24 w-[180px] z-30">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-1 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        
        {/* Header with Selector */}
        <div className="flex items-center justify-between p-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Live Odds</h3>
          </div>
          
          {/* Simple Dropdown to switch widget */}
          <select 
            value={activeLeague}
            onChange={(e) => {
              setLoaded(false); // Reset loader
              setActiveLeague(e.target.value);
            }}
            className="text-xs bg-gray-100 dark:bg-gray-800 border-none rounded-md px-2 py-1"
          >
            <option value="premierLeague">EPL</option>
            <option value="laLiga">La Liga</option>
          </select>
        </div>

        {/* Iframe Container */}
        <div className="relative w-full h-[450px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          {!loaded && (
             <div className="absolute inset-0 p-4 space-y-4 z-10 bg-white dark:bg-gray-900">
               <Skeleton className="h-8 w-1/2" />
               <Skeleton className="h-full w-full rounded-xl" />
             </div>
          )}
          
          <iframe
            key={activeLeague}
            title="Sports Odds Widget"
            src={currentUrl}
            onLoad={() => setLoaded(true)}
            className={cn("w-full h-full border-0 transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
            loading="lazy"
          />
        </div>
      </div>
    </aside>
  );
}