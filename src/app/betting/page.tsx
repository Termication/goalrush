'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Calendar, Trophy, Globe } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

// 🟢 ADDED: 'soccer_southafrica_psl'
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

export default function BettingPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('soccer_epl');

  useEffect(() => {
    const fetchOdds = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/odds?sport=${selectedSport}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          setMatches([]); 
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
    const preferredBookies = ['Unibet', 'Bet365', 'Betfair', 'Sunbet'];
    const bookie = match.bookmakers.find(b => preferredBookies.includes(b.title)) || match.bookmakers[0];

    if (!bookie) return null;

    const h2h = bookie.markets.find((m) => m.key === 'h2h');
    if (!h2h) return null;

    return { bookieName: bookie.title, outcomes: h2h.outcomes };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-green-900/20">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Bet</span>
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Live odds from global bookmakers
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
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No matches found</h3>
            <p className="text-gray-500 max-w-xs mt-1">There are no upcoming games listed for this league right now. Try switching competitions.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => {
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
                      {/* Home Win */}
                      <div className="flex flex-col items-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 group-hover:border-green-200 dark:group-hover:border-green-900 transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">1</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white">
                          {homeOutcome?.price.toFixed(2) || '-'}
                        </span>
                      </div>

                      {/* Draw */}
                      <div className="flex flex-col items-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 group-hover:border-green-200 dark:group-hover:border-green-900 transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">X</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white">
                          {drawOutcome?.price.toFixed(2) || '-'}
                        </span>
                      </div>

                      {/* Away Win */}
                      <div className="flex flex-col items-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 group-hover:border-green-200 dark:group-hover:border-green-900 transition-colors">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">2</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white">
                          {awayOutcome?.price.toFixed(2) || '-'}
                        </span>
                      </div>
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