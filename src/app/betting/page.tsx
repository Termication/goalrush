'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isAfter, subMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Loader2, Calendar, Trophy, Globe, TrendingUp, TrendingDown, 
  PlusCircle, Search, Clock, Sparkles, X
} from 'lucide-react';

import { useTeamLogos } from '@/components/hooks/useTeamLogos';

// --- CONFIGURATION ---
const LEAGUES = [
  { key: 'soccer_epl', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { key: 'soccer_spain_la_liga', name: 'La Liga', icon: '🇪🇸' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
  { key: 'soccer_italy_serie_a', name: 'Serie A', icon: '🇮🇹' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1', icon: '🇫🇷' },
  { key: 'soccer_uefa_champs_league', name: 'Champions League', icon: '🌟' },
  { key: 'soccer_southafrica_psl', name: 'South Africa PSL', icon: '🇿🇦' },
  { key: 'soccer_fifa_world_cup', name: 'World Cup 2026', icon: '🏆' },
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
  commence_time: string;
  bookmakers: {
    title: string;
    markets: {
      key: string;
      outcomes: Outcome[];
    }[];
  }[];
}

// Helper function to map country names to flag emojis for International matches
const getCountryFlag = (countryName: string) => {
  const flags: Record<string, string> = {
    // South America
    'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴',
    'Chile': '🇨🇱', 'Peru': '🇵🇪', 'Ecuador': '🇪🇨', 'Paraguay': '🇵🇾',
    'Bolivia': '🇧🇴', 'Venezuela': '🇻🇪',

    // Europe
    'France': '🇫🇷', 'England': '🏴', 'Spain': '🇪🇸', 'Germany': '🇩🇪',
    'Portugal': '🇵🇹', 'Italy': '🇮🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
    'Croatia': '🇭🇷', 'Switzerland': '🇨🇭', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪',
    'Norway': '🇳🇴', 'Poland': '🇵🇱', 'Serbia': '🇷🇸', 'Turkey': '🇹🇷',
    'Greece': '🇬🇷', 'Ukraine': '🇺🇦', 'Austria': '🇦🇹', 'Hungary': '🇭🇺',
    'Czech Republic': '🇨🇿', 'Slovakia': '🇸🇰', 'Romania': '🇷🇴',
    'Bulgaria': '🇧🇬', 'Finland': '🇫🇮', 'Iceland': '🇮🇸',

    // Africa
    'South Africa': '🇿🇦', 'Nigeria': '🇳🇬', 'Ghana': '🇬🇭',
    'Senegal': '🇸🇳', 'Cameroon': '🇨🇲', 'Morocco': '🇲🇦',
    'Egypt': '🇪🇬', 'Algeria': '🇩🇿', 'Tunisia': '🇹🇳',
    'Ivory Coast': '🇨🇮', 'Mali': '🇲🇱',

    // North America
    'USA': '🇺🇸', 'United States': '🇺🇸', 'Canada': '🇨🇦', 'Mexico': '🇲🇽',
    'Costa Rica': '🇨🇷', 'Panama': '🇵🇦',

    // Asia
    'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'China': '🇨🇳',
    'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦', 'Iran': '🇮🇷',
    'India': '🇮🇳', 'UAE': '🇦🇪',

    // Oceania
    'Australia': '🇦🇺', 'New Zealand': '🇳🇿',

    // UK Nations
    'Wales': '🏴', 'Scotland': '🏴', 'Ireland': '🇮🇪'
  };
  
  // Clean up the name for matching (e.g., handle "USA" vs "United States")
  const name = countryName.trim();
  return flags[name] || '🌍'; 
};


// Helper to check if match is live (within 1 hour of start)
const isLiveMatch = (commenceTime: string) => {
  const matchTime = new Date(commenceTime);
  const now = new Date();
  const oneHourBefore = subMinutes(matchTime, 60);
  const oneHourAfter = subMinutes(matchTime, -60);
  return isAfter(now, oneHourBefore) && !isAfter(now, oneHourAfter);
};

// Live odds simulation hook
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
        for (let attempt = 0; attempt < 5; attempt++) {
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
                outcome.price = newPrice;
                outcome.trend = isUp ? 'up' : 'down';
                newMatches[randomMatchIndex] = match;
                return newMatches;
              }
            }
          }
        }
        return prevMatches;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [liveMatches]);

  return liveMatches;
}

// Odds component with motion animation
const LiveOdd = ({ label, value, trend }: { label: string, value: number | string, trend?: 'up' | 'down' | 'neutral' }) => {
  const [highlight, setHighlight] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (trend) {
      setHighlight(up => (trend === 'up' ? 'up' : trend === 'down' ? 'down' : null));
      const timer = setTimeout(() => setHighlight(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [value, trend]);

  return (
    <div
      title={highlight === 'up' ? 'Odds increased' : highlight === 'down' ? 'Odds decreased' : 'Current odds'}
      className={cn(
        "flex flex-col items-center p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
        "bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
        highlight === 'up' && "bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700 shadow-lg shadow-green-500/20",
        highlight === 'down' && "bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-700 shadow-lg shadow-red-500/20",
        !highlight && "hover:border-green-300 hover:shadow-md"
      )}
    >
      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</span>
      <div className="flex items-center gap-1">
        <motion.span
          key={value}
          initial={{ y: highlight === 'up' ? -10 : highlight === 'down' ? 10 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "text-xl font-black transition-colors",
            highlight === 'up' ? "text-green-600 dark:text-green-400" :
            highlight === 'down' ? "text-red-600 dark:text-red-400" :
            "text-gray-900 dark:text-white"
          )}
        >
          {typeof value === 'number' ? value.toFixed(2) : value}
        </motion.span>
        <AnimatePresence>
          {highlight === 'up' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </motion.div>
          )}
          {highlight === 'down' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Simple Snackbar component
const Snackbar = ({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-green-400" />
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function BettingPage() {
  const [rawMatches, setRawMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('soccer_epl');
  const [searchTerm, setSearchTerm] = useState('');
  const [betSlip, setBetSlip] = useState<{ matchId: string, selection: string, odds: number }[]>([]);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const liveMatches = useLiveOdds(rawMatches);
  
  // Initialize the team logos hook
  const { getLogo } = useTeamLogos();

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
      console.error('Failed to load odds');
      setSnackbar({ visible: true, message: 'Failed to fetch odds' });
    } finally {
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    fetchOdds();
  }, [fetchOdds]);

  const getOdds = (match: Match) => {
    const bookie = match.bookmakers.find(b => PREFERRED_BOOKIES.includes(b.title)) || match.bookmakers[0];
    if (!bookie) return null;
    const h2h = bookie.markets.find((m) => m.key === 'h2h');
    if (!h2h) return null;
    return { bookieName: bookie.title, outcomes: h2h.outcomes, lastUpdated: new Date() };
  };

  const addToBetSlip = (matchId: string, selection: string, odds: number) => {
    setBetSlip(prev => [...prev, { matchId, selection, odds }]);
    setSnackbar({ visible: true, message: `Added: ${selection} @ ${odds.toFixed(2)}` });
  };

  const filteredMatches = liveMatches.filter(match => {
    if (!searchTerm) return true;
    return match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
           match.away_team.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Determine if the current view is for an international tournament
  const isInternational = selectedSport === 'soccer_fifa_world_cup';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        onClose={() => setSnackbar({ visible: false, message: '' })}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Bet</span>
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Market Updates
                <span className="text-xs text-gray-400">· Last updated {format(lastUpdated, 'HH:mm:ss')}</span>
              </p>
            </div>
          </div>

          {/* Search & League selector */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none cursor-pointer hover:border-green-500 transition-colors"
              >
                {LEAGUES.map((league) => (
                  <option key={league.key} value={league.key}>
                    {league.icon} {league.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bet Slip Mini */}
        {betSlip.length > 0 && (
          <div className="mb-6 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-200 dark:border-green-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{betSlip.length} selection(s) in bet slip</span>
            </div>
            <button
              onClick={() => setBetSlip([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No matches found</h3>
            <p className="text-gray-500 max-w-xs mt-1">No matches match your search or league. Try another competition.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMatches.map((match) => {
              const oddsData = getOdds(match);
              if (!oddsData) return null;

              const homeOutcome = oddsData.outcomes.find(o => o.name === match.home_team);
              const awayOutcome = oddsData.outcomes.find(o => o.name === match.away_team);
              const drawOutcome = oddsData.outcomes.find(o => o.name === 'Draw');
              const live = isLiveMatch(match.commence_time);

              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-green-500/50 transition-all duration-300"
                >
                  {/* Match Header */}
                  <div className="bg-gray-50/80 dark:bg-gray-900/50 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(match.commence_time), 'EEE, MMM d • HH:mm')}
                      {live && (
                        <span className="ml-2 bg-red-100 text-red-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-red-200 animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400" title={`Odds from ${oddsData.bookieName}`}>
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(), 'HH:mm')}</span>
                    </div>
                  </div>

                  {/* Teams & Odds */}
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-6 gap-4">
                      
                      {/* Home Team Logo / Flag */}
                      <div className="flex items-center gap-2 w-1/2">
                        {isInternational ? (
                          <span className="text-2xl">{getCountryFlag(match.home_team)}</span>
                        ) : (
                          <img 
                            src={getLogo(match.home_team)} 
                            alt={match.home_team} 
                            className="w-6 h-6 object-contain"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/png?text=Team')}
                          />
                        )}
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{match.home_team}</h3>
                      </div>
                      
                      <span className="text-xs text-gray-400 font-bold shrink-0">VS</span>
                      
                      {/* 🟢 Away Team Logo / Flag */}
                      <div className="flex items-center gap-2 w-1/2 justify-end">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{match.away_team}</h3>
                        {isInternational ? (
                          <span className="text-2xl">{getCountryFlag(match.away_team)}</span>
                        ) : (
                          <img 
                            src={getLogo(match.away_team)} 
                            alt={match.away_team} 
                            className="w-6 h-6 object-contain"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/png?text=Team')}
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <LiveOdd label="1" value={homeOutcome?.price || '-'} trend={homeOutcome?.trend} />
                      <LiveOdd label="X" value={drawOutcome?.price || '-'} trend={drawOutcome?.trend} />
                      <LiveOdd label="2" value={awayOutcome?.price || '-'} trend={awayOutcome?.trend} />
                    </div>

                    <button
                      onClick={() => {
                        if (homeOutcome) addToBetSlip(match.id, `${match.home_team} to win`, homeOutcome.price);
                      }}
                      className="w-full mt-2 py-2 px-4 rounded-xl border border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add to bet slip
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}