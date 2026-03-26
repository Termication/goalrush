'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, subMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { 
  Loader2, Calendar, Trophy, Globe, TrendingUp, TrendingDown, 
  PlusCircle, Search, Clock, Sparkles, X, ChevronRight, ChevronDown 
} from 'lucide-react';

// --- CONFIGURATION ---
const LEAGUES = [
  { key: 'soccer_epl', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag: '🇬🇧', apiAlias: 'premierLeague' },
  { key: 'soccer_spain_la_liga', name: 'La Liga', icon: '🇪🇸', flag: '🇪🇸', apiAlias: 'laLiga' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga', icon: '🇩🇪', flag: '🇩🇪', apiAlias: 'bundesliga' },
  { key: 'soccer_italy_serie_a', name: 'Serie A', icon: '🇮🇹', flag: '🇮🇹', apiAlias: 'serieA' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1', icon: '🇫🇷', flag: '🇫🇷', apiAlias: 'franceLigue1' },
  { key: 'soccer_uefa_champs_league', name: 'Champions League', icon: '🌟', flag: '🇪🇺', apiAlias: 'championsLeague' },
];

const PREFERRED_BOOKIES = ['Unibet', 'William Hill', 'Bet365', 'Betfair', 'Sunbet'];

interface Outcome {
  name: string;
  price: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  commence_time: string;
  bookmakers: {
    title: string;
    markets: {
      key: string;
      outcomes: Outcome[];
    }[];
  }[];
}

// --- LOGO FETCHING LOGIC ---
const isLiveMatch = (commenceTime: string) => {
  const matchTime = new Date(commenceTime);
  const now = new Date();
  const oneHourBefore = subMinutes(matchTime, 60);
  const oneHourAfter = subMinutes(matchTime, -105);
  return isAfter(now, oneHourBefore) && !isAfter(now, oneHourAfter);
};

function useLiveOdds(initialMatches: Match[]) {
  const [liveMatches, setLiveMatches] = useState<Match[]>(initialMatches);

  useEffect(() => {
    setLiveMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    if (liveMatches.length === 0) return;
    const interval = setInterval(() => {
      setLiveMatches((prevMatches) => {
        const newMatches = [...prevMatches];
        for (let attempt = 0; attempt < 3; attempt++) {
          const randomMatchIndex = Math.floor(Math.random() * newMatches.length);
          const match = { ...newMatches[randomMatchIndex] };
          if (match.bookmakers && match.bookmakers.length > 0) {
            match.bookmakers = [...match.bookmakers];
            let bookieIndex = match.bookmakers.findIndex(b => PREFERRED_BOOKIES.includes(b.title));
            if (bookieIndex === -1) bookieIndex = 0;
            const bookie = { ...match.bookmakers[bookieIndex] };
            match.bookmakers[bookieIndex] = bookie;
            bookie.markets = [...bookie.markets];
            const h2hIndex = bookie.markets.findIndex((m: any) => m.key === 'h2h');
            if (h2hIndex !== -1) {
              const h2h = { ...bookie.markets[h2hIndex] };
              bookie.markets[h2hIndex] = h2h;
              h2h.outcomes = [...h2h.outcomes];
              if (h2h.outcomes.length > 0) {
                const randomOutcomeIndex = Math.floor(Math.random() * h2h.outcomes.length);
                const outcome = { ...h2h.outcomes[randomOutcomeIndex] };
                h2h.outcomes[randomOutcomeIndex] = outcome;
                const isUp = Math.random() > 0.5;
                const change = 0.01;
                let newPrice = isUp ? outcome.price + change : outcome.price - change;
                newPrice = Math.round(newPrice * 100) / 100;
                outcome.price = Math.max(1.01, newPrice);
                outcome.trend = isUp ? 'up' : 'down';
                newMatches[randomMatchIndex] = match;
                return newMatches;
              }
            }
          }
        }
        return prevMatches;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [liveMatches]);

  return liveMatches;
}

const LiveOdd = ({ label, value, trend, onClick }: { label: string, value: number | string, trend?: 'up' | 'down' | 'neutral', onClick?: () => void }) => {
  const [highlight, setHighlight] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (trend && trend !== 'neutral') {
      setHighlight(trend);
      const timer = setTimeout(() => setHighlight(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [value, trend]);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
        "bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
        highlight === 'up' && "bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700 shadow-lg shadow-green-500/10",
        highlight === 'down' && "bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-700 shadow-lg shadow-red-500/10",
        !highlight && "hover:border-green-400 hover:bg-white dark:hover:bg-gray-800"
      )}
    >
      <span className="text-[10px] uppercase font-black text-gray-400 mb-1">{label}</span>
      <div className="flex items-center gap-1">
        <motion.span
          key={value}
          initial={{ y: highlight === 'up' ? -5 : highlight === 'down' ? 5 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "text-lg font-black tracking-tighter",
            highlight === 'up' ? "text-green-600" :
            highlight === 'down' ? "text-red-600" :
            "text-gray-900 dark:text-white"
          )}
        >
          {typeof value === 'number' ? value.toFixed(2) : value}
        </motion.span>
        {highlight === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
        {highlight === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
      </div>
    </div>
  );
};

export default function BettingPage() {
  const [rawMatches, setRawMatches] = useState<Match[]>([]);
  const [logoMap, setLogoMap] = useState<Record<string, string>>({}); // Lookup for team logos
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('soccer_epl');
  const [searchTerm, setSearchTerm] = useState('');
  const [betSlip, setBetSlip] = useState<{ matchId: string, selection: string, odds: number }[]>([]);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const liveMatches = useLiveOdds(rawMatches);

  // Fetch team logos from the standings API you provided
  const fetchLogos = useCallback(async () => {
    try {
      const res = await fetch('/api/standings');
      const data = await res.json();
      if (data) {
        const newLogoMap: Record<string, string> = {};
        // Iterate through all leagues returned by your standings API
        Object.values(data).forEach((leagueTeams: any) => {
          if (Array.isArray(leagueTeams)) {
            leagueTeams.forEach((item: any) => {
              if (item.team?.name && item.team?.logo) {
                newLogoMap[item.team.name] = item.team.logo;
              }
            });
          }
        });
        setLogoMap(newLogoMap);
      }
    } catch (err) {
      console.error('Failed to fetch team logos:', err);
    }
  }, []);

  const fetchOdds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/odds?sport=${selectedSport}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRawMatches(data);
        setLastUpdated(new Date());
      } else {
        setRawMatches([]);
      }
    } catch (err) {
      setSnackbar({ visible: true, message: 'Failed to fetch odds' });
    } finally {
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    fetchLogos(); // Initialize logos lookup map
    fetchOdds();
  }, [fetchOdds, fetchLogos]);

  const addToBetSlip = (matchId: string, selection: string, odds: number) => {
    setBetSlip(prev => [...prev, { matchId, selection, odds }]);
    setSnackbar({ visible: true, message: `Selection Added: ${selection} @ ${odds.toFixed(2)}` });
  };

  const filteredMatches = useMemo(() => {
    return liveMatches.filter(match => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return match.home_team.toLowerCase().includes(search) ||
             match.away_team.toLowerCase().includes(search);
    });
  }, [liveMatches, searchTerm]);

  const currentLeague = LEAGUES.find(l => l.key === selectedSport);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-green-100 selection:text-green-900">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {snackbar.visible && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-950 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
              <Sparkles className="h-5 w-5 text-green-400" />
              <span className="font-bold text-sm">{snackbar.message}</span>
              <button onClick={() => setSnackbar({ ...snackbar, visible: false })} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-600/20 ring-4 ring-green-600/10">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Smart<span className="text-green-600">Bet</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 text-gray-500 font-medium pl-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm uppercase tracking-widest font-bold">Live Pulse Market</span>
              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
              <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">
                 {format(lastUpdated, 'HH:mm:ss')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold focus:border-green-500 focus:outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="relative flex-1 sm:w-64">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6 rounded-md bg-gray-100 dark:bg-gray-800 text-sm z-10 pointer-events-none">
                {currentLeague?.flag}
              </div>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold appearance-none cursor-pointer focus:border-green-500 focus:outline-none transition-all shadow-sm hover:border-gray-200"
              >
                {LEAGUES.map((league) => (
                  <option key={league.key} value={league.key}>
                    {league.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Floating Bet Slip Indicator */}
        {betSlip.length > 0 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-4 bg-green-600 text-white rounded-3xl shadow-xl shadow-green-600/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center font-black">
                {betSlip.length}
              </div>
              <div>
                <p className="font-black text-lg leading-none">Selections Ready</p>
                <p className="text-sm text-green-100">Review your ticket to place bets</p>
              </div>
            </div>
            <button onClick={() => setBetSlip([])} className="px-6 py-2.5 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">
              Clear All
            </button>
          </motion.div>
        )}

        {/* Main Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[320px] bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-800 animate-pulse" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="h-20 w-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No Markets Found</h3>
            <p className="text-gray-500 font-medium mt-2">Try searching for a different team or change competition.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredMatches.map((match) => {
              const bookie = match.bookmakers.find(b => PREFERRED_BOOKIES.includes(b.title)) || match.bookmakers[0];
              const h2h = bookie?.markets.find(m => m.key === 'h2h');
              if (!h2h) return null;

              const homeOdds = h2h.outcomes.find(o => o.name === match.home_team);
              const awayOdds = h2h.outcomes.find(o => o.name === match.away_team);
              const drawOdds = h2h.outcomes.find(o => o.name === 'Draw');
              const live = isLiveMatch(match.commence_time);

              // Get actual logos from map using team names
              const homeLogo = logoMap[match.home_team] || `https://placehold.co/100x100/png?text=${match.home_team.charAt(0)}`;
              const awayLogo = logoMap[match.away_team] || `https://placehold.co/100x100/png?text=${match.away_team.charAt(0)}`;

              return (
                <motion.div
                  key={match.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-green-500/30 transition-all duration-500"
                >
                  {/* Status Bar */}
                  <div className="px-8 py-5 flex justify-between items-center border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                    <div className="flex items-center gap-3">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                        {format(new Date(match.commence_time), 'HH:mm')} • {format(new Date(match.commence_time), 'MMM dd')}
                      </span>
                    </div>
                    {live ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-[10px] font-black text-white rounded-full animate-pulse ring-4 ring-red-600/10">
                        <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">UPCOMING</span>
                    )}
                  </div>

                  {/* Match Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-10">
                      {/* Home Team */}
                      <div className="flex flex-col items-center gap-3 w-[40%] text-center">
                        <div className="h-20 w-20 relative bg-gray-50 dark:bg-gray-800 rounded-[20px] p-3 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                          <img 
                            src={homeLogo} 
                            alt={match.home_team}
                            className="w-full h-full object-contain"
                          />
                          <span className="absolute -bottom-2 -right-2 text-xl shadow-sm filter drop-shadow-md">{currentLeague?.flag}</span>
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem] text-sm md:text-base">
                          {match.home_team}
                        </h3>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-gray-300 dark:text-gray-700">VS</span>
                        <div className="h-12 w-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                      </div>

                      {/* Away Team */}
                      <div className="flex flex-col items-center gap-3 w-[40%] text-center">
                        <div className="h-20 w-20 relative bg-gray-50 dark:bg-gray-800 rounded-[20px] p-3 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                          <img 
                            src={awayLogo} 
                            alt={match.away_team}
                            className="w-full h-full object-contain"
                          />
                          <span className="absolute -bottom-2 -left-2 text-xl shadow-sm filter drop-shadow-md">{currentLeague?.flag}</span>
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem] text-sm md:text-base">
                          {match.away_team}
                        </h3>
                      </div>
                    </div>

                    {/* Odds Selector */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <LiveOdd 
                        label="1" 
                        value={homeOdds?.price || '-'} 
                        trend={homeOdds?.trend} 
                        onClick={() => homeOdds && addToBetSlip(match.id, `${match.home_team} Win`, homeOdds.price)}
                      />
                      <LiveOdd 
                        label="X" 
                        value={drawOdds?.price || '-'} 
                        trend={drawOdds?.trend} 
                        onClick={() => drawOdds && addToBetSlip(match.id, `Draw (${match.home_team} v ${match.away_team})`, drawOdds.price)}
                      />
                      <LiveOdd 
                        label="2" 
                        value={awayOdds?.price || '-'} 
                        trend={awayOdds?.trend} 
                        onClick={() => awayOdds && addToBetSlip(match.id, `${match.away_team} Win`, awayOdds.price)}
                      />
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-2">
                       <div className="flex items-center gap-2">
                         <div className="h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                           <Globe className="h-3 w-3 text-gray-400" />
                         </div>
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                           {bookie.title}
                         </span>
                       </div>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-8 px-3 text-[10px] font-black text-green-600 hover:bg-green-50 rounded-xl"
                         onClick={() => addToBetSlip(match.id, `${match.home_team} / ${match.away_team} Over 2.5`, 1.85)}
                       >
                         <PlusCircle className="h-3 w-3 mr-1.5" />
                         MARKETS
                       </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 h-screen w-screen overflow-hidden pointer-events-none opacity-20 dark:opacity-5">
        <div className="absolute top-[10%] -right-[5%] h-96 w-96 rounded-full bg-green-500/20 blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[5%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>
    </div>
  );
}