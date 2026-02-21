'use client';

import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { checkWidgetHealth } from '@/lib/checkWidgets';

// 1. Configuration
const WIDGETS = {
  premierLeague: "https://widget.the-odds-api.com/v1/sports/soccer_epl/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betfair_ex_uk&oddsFormat=decimal&markets=h2h&marketNames=h2h%3A%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  UEFA: "https://widget.the-odds-api.com/v1/sports/soccer_uefa_champs_league/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3AHead%20To%20Head%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  laLiga: "https://widget.the-odds-api.com/v1/sports/soccer_spain_la_liga/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3AMoneyline%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  Bundesliga: "https://widget.the-odds-api.com/v1/sports/soccer_germany_bundesliga/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3A%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  SeriaA: "https://widget.the-odds-api.com/v1/sports/soccer_italy_serie_a/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3A%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  Ligue1: "https://widget.the-odds-api.com/v1/sports/soccer_france_ligue_one/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3A%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  World_Cup: "https://widget.the-odds-api.com/v1/sports/soccer_fifa_world_cup/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3A%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
  UEFA_Europa_League: "https://widget.the-odds-api.com/v1/sports/soccer_uefa_europa_league/events/?accessKey=wk_f37d9987b57628aeb0cb1e5b3c16cc28&bookmakerKeys=betway&oddsFormat=decimal&markets=h2h&marketNames=h2h%3A%2Cspreads%3ASpreads%2Ctotals%3AOver%2FUnder",
};

type WidgetKey = keyof typeof WIDGETS;

const mapDbCategoryToWidget = (category?: string): WidgetKey => {
  if (!category) return 'premierLeague'; 
  
  const cat = category.toLowerCase();

  if (cat.includes('europa')) return 'UEFA_Europa_League';
  if (cat.includes('uefa') || cat.includes('champions') || cat.includes('champs')) return 'UEFA';
  if (cat.includes('premier') || cat.includes('FA Cup')) return 'premierLeague';
  if (cat.includes('laliga') || cat.includes('spain') || cat.includes('madrid') || cat.includes('barcelona')) return 'laLiga';
  if (cat.includes('bundesliga') || cat.includes('germany')) return 'Bundesliga';
  if (cat.includes('serie') || cat.includes('italy')) return 'SeriaA';
  if (cat.includes('ligue') || cat.includes('france')) return 'Ligue1';
  if (cat.includes('world cup 2026') || cat.includes('fifa')) return 'World_Cup';

  return 'premierLeague'; 
};

export default function RightOddsWidget({ category }: { category?: string }) {
  
  const [activeLeague, setActiveLeague] = useState<WidgetKey>(() => mapDbCategoryToWidget(category));
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<'loading' | 'visible' | 'hidden'>('loading');

  const currentUrl = WIDGETS[activeLeague];

  // Update when parent fetches the data
  useEffect(() => {
    if (category) {
      setLoaded(false);
      setActiveLeague(mapDbCategoryToWidget(category));
    }
  }, [category]);

  // Health check API limits
  useEffect(() => {
    let isMounted = true;
    const performCheck = async () => {
      setStatus('loading');
      const isHealthy = await checkWidgetHealth(currentUrl);
      if (!isMounted) return;
      
      if (isHealthy) {
        setStatus('visible');
      } else {
        setStatus('hidden');
      }
    };
    performCheck();
    return () => { isMounted = false; };
  }, [currentUrl]);

  if (status === 'hidden') return null;

  return (
    <aside 
      className={cn(
        "hidden xl:block fixed top-24 z-30",
        "right-4 w-45 2xl:right-6 2xl:w-72",
        status === 'visible' ? "animate-in slide-in-from-right-6 fade-in duration-700" : "opacity-0"
      )}
    >
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-1 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        
        {/* Header & Select Menu */}
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
              setActiveLeague(e.target.value as WidgetKey);
            }}
            className="text-xs bg-gray-700 dark:bg-gray-800 text-white border-none rounded-md px-1 py-1 cursor-pointer focus:ring-2 focus:ring-green-500 max-w-[65px]"
          >
            <option value="premierLeague">EPL</option>
            <option value="UEFA">UEFA CL</option>
            <option value="laLiga">La Liga</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="SeriaA">Serie A</option>
            <option value="Ligue1">Ligue 1</option>
            <option value="World_Cup">World Cup</option>
            <option value="UEFA_Europa_League">UEFA EL</option>
          </select>
        </div>

        {/* Iframe */}
        <div className="relative w-full h-[450px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          {(!loaded || status === 'loading') && (
             <div className="absolute inset-0 p-4 space-y-4 z-10 bg-white dark:bg-gray-900">
               <Skeleton className="h-8 w-1/2" />
               <Skeleton className="h-24 w-full rounded-xl" />
               <Skeleton className="h-24 w-full rounded-xl" />
               <Skeleton className="h-24 w-full rounded-xl" />
             </div>
          )}
          
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