'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Calendar, Trophy, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// --- CONFIGURATION ---
const LEAGUES = [
  { key: 'soccer_epl', name: 'Premier League' },
  { key: 'soccer_spain_la_liga', name: 'La Liga' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga' },
  { key: 'soccer_italy_serie_a', name: 'Serie A' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1' },
  { key: 'soccer_uefa_champs_league', name: 'Champions League' },
  { key: 'soccer_southafrica_psl', name: 'South Africa PSL' },
  { key: 'soccer_fifa_world_cup', name: 'World Cup 2026' },
];

interface Outcome {
  name: string;
  price: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: {
    title: string;
    markets: {
      key: string;
      outcomes: Outcome[];
    }[];
  }[];
}


function useLiveOdds(initialMatches: Match[]) {
  const [liveMatches, setLiveMatches] = useState<Match[]>(initialMatches);

  // Sync state when new API data arrives
  useEffect(() => {
    setLiveMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    if (liveMatches.length === 0) return;

    const interval = setInterval(() => {
      setLiveMatches((prevMatches) => {
        const newMatches = [...prevMatches];

        for (let attempt = 0; attempt < 5; attempt++) {
          const randomMatchIndex = Math.floor(Math.random() * newMatches.length);
          
          const match = { ...newMatches[randomMatchIndex] };

          if (match.bookmakers && match.bookmakers.length > 0) {
            // Copy bookmakers
            match.bookmakers = [...match.bookmakers];
            

            const bookieIndex = 0; 
            const bookie = { ...match.bookmakers[bookieIndex] };
            match.bookmakers[bookieIndex] = bookie;

            // Copy markets
            bookie.markets = [...bookie.markets];
            const h2hIndex = bookie.markets.findIndex((m: any) => m.key === 'h2h');

            if (h2hIndex !== -1) {
              const h2h = { ...bookie.markets[h2hIndex] };
              bookie.markets[h2hIndex] = h2h;
              

              h2h.outcomes = [...h2h.outcomes];

              if (h2h.outcomes.length > 0) {
                // Pick a random outcome (1, X, or 2)
                const randomOutcomeIndex = Math.floor(Math.random() * h2h.outcomes.length);
                const outcome = { ...h2h.outcomes[randomOutcomeIndex] };
                h2h.outcomes[randomOutcomeIndex] = outcome;

                const isUp = Math.random() > 0.5;
                const change = 0.01;
                let newPrice = isUp ? outcome.price + change : outcome.price - change;
                
  
                newPrice = Math.round(newPrice * 100) / 100;

                // Update Values
                outcome.price = newPrice;
                outcome.trend = isUp ? 'up' : 'down';

                // Assign the updated match back to the array
                newMatches[randomMatchIndex] = match;

                // Return the new state immediately once an update is made
                return newMatches; 
              }
            }
          }
        }
        // If 5 attempts failed (rare), return state unchanged
        return prevMatches;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [liveMatches]);

  return liveMatches;
}


const LiveOdd = ({ label, value, trend }: { label: string, value: number | string, trend?: 'up' | 'down' | 'neutral' }) => {
  const [activeTrend, setActiveTrend] = useState<'up' | 'down' | 'neutral' | null>(null);

  useEffect(() => {
    if (trend) {
      setActiveTrend(trend);
      const timer = setTimeout(() => setActiveTrend(null), 1500); // clear flash after 1.5s
      return () => clearTimeout(timer);
    }
  }, [value, trend]); 

  return (
    <div 
      className={cn(
        "flex flex-col items-center p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
        "bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700",
        activeTrend === 'up' && "bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700",
        activeTrend === 'down' && "bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-700",
        !activeTrend && "hover:border-green-200 dark:group-hover:border-green-900"
      )}
    >
      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</span>
      
      <div className="flex items-center gap-1">
        <span className={cn(
          "text-xl font-black transition-colors duration-300",
          activeTrend === 'up' ? "text-green-600 dark:text-green-400" :
          activeTrend === 'down' ? "text-red-600 dark:text-red-400" :
          "text-gray-900 dark:text-white"
        )}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>

        {/* Animated Arrows */}
        {activeTrend === 'up' && (
          <TrendingUp className="h-4 w-4 text-green-600 animate-in slide-in-from-bottom-2 fade-in duration-300" />
        )}
        {activeTrend === 'down' && (
          <TrendingDown className="h-4 w-4 text-red-600 animate-in slide-in-from-top-2 fade-in duration-300" />
        )}
      </div>
    </div>
  );
};



export default function BettingPage() {
  const [rawMatches, setRawMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('soccer_epl');

  // live simulator
  const liveMatches = useLiveOdds(rawMatches);

  useEffect(() => {
    const fetchOdds = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/odds?sport=${selectedSport}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRawMatches(data);
        } else {
          setRawMatches([]); 
        }
      } catch (err) {
        console.error('Failed to load odds');
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [selectedSport]);

  const getOdds = (match: Match) => {
    const preferredBookies = ['Unibet', 'William Hill', 'Bet365', 'Betfair', 'Sunbet']; 
    const bookie = match.bookmakers.find(b => preferredBookies.includes(b.title)) || match.bookmakers[0];

    if (!bookie) return null;

    const h2h = bookie.markets.find((m) => m.key === 'h2h');
    if (!h2h) return null;

    return { bookieName: bookie.title, outcomes: h2h.outcomes };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/20">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Bet</span>
              </h1>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Market Updates
              </p>
            </div>
          </div>

          {/* League Selector */}
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none min-w-[240px] cursor-pointer hover:border-green-500 transition-colors"
            >
              {LEAGUES.map((league) => (
                <option key={league.key} value={league.key}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <p className="text-gray-500 text-sm font-medium animate-pulse">Scanning markets...</p>
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No matches found</h3>
            <p className="text-gray-500 max-w-xs mt-1">There are no upcoming games listed for this league right now. Try switching competitions.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => {
              const oddsData = getOdds(match);
              if (!oddsData) return null;

              const homeOutcome = oddsData.outcomes.find(o => o.name === match.home_team);
              const awayOutcome = oddsData.outcomes.find(o => o.name === match.away_team);
              const drawOutcome = oddsData.outcomes.find(o => o.name === 'Draw');

              return (
                <div key={match.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-green-500/30 transition-all duration-300">
                  {/* Match Header */}
                  <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(match.commence_time), 'EEE, MMM d • HH:mm')}
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-medium bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">
                      {oddsData.bookieName}
                    </Badge>
                  </div>

                  {/* Teams & Odds */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-6 gap-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight w-1/2" title={match.home_team}>
                        {match.home_team}
                      </h3>
                      <span className="text-xs text-gray-400 font-bold mt-1 uppercase">VS</span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight w-1/2 text-right" title={match.away_team}>
                        {match.away_team}
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <LiveOdd 
                        label="1" 
                        value={homeOutcome?.price || '-'} 
                        trend={homeOutcome?.trend} 
                      />
                      <LiveOdd 
                        label="X" 
                        value={drawOutcome?.price || '-'} 
                        trend={drawOutcome?.trend} 
                      />
                      <LiveOdd 
                        label="2" 
                        value={awayOutcome?.price || '-'} 
                        trend={awayOutcome?.trend} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}