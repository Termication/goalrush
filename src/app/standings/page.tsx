'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the data structure
interface TeamData {
  rank: number;
  team: { name: string; logo: string };
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  gf: number;
  ga: number;
  gd: number;
  // form?: string;
}

interface AllStandings {
  premierLeague?: TeamData[];
  laLiga?: TeamData[];
  bundesliga?: TeamData[];
  serieA?: TeamData[];
  championsLeague?: TeamData[];
}

const LEAGUES = [
  { id: 'premierLeague', name: 'Premier League', logo: '/more_graphics/Premier-League-transparent.png', color: 'bg-[#38003c]' },
  { id: 'laLiga', name: 'La Liga', logo: '/more_graphics/la-liga-logo-red.png', color: 'bg-[#ee161f]' },
  { id: 'bundesliga', name: 'Bundesliga', logo: '/more_graphics/bundesliga-logo-black.png', color: 'bg-[#d20515]' },
  { id: 'serieA', name: 'Serie A', logo: '/more_graphics/serie-a-logo.png', color: 'bg-[#004D98]' },
  { id: 'championsLeague', name: 'Champions League', logo: '/more_graphics/uefa-champions-league-logo.png', color: 'bg-[#1e3c72]' },
  { id: 'franceLigue1', name: 'Ligue 1', logo: '/more_graphics/ligue1-logo.png', color: 'bg-[#0033a0]' },
];

export default function StandingsPage() {
  const [data, setData] = useState<AllStandings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState('premierLeague');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/standings');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch standings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeData = data ? (data as any)[activeLeague] : [];
  const currentLeagueInfo = LEAGUES.find(l => l.id === activeLeague);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            League Standings
          </h1>
          <p className="text-gray-500 mt-2">Real-time stats and league tables.</p>
        </div>

        {/* League Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => setActiveLeague(league.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-sm",
                activeLeague === league.id 
                  ? `${league.color} text-white shadow-lg scale-105` 
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              <div className="w-6 h-6 relative">
                 <Image 
                   src={league.logo} 
                   alt={league.name} 
                   fill
                   className={cn(
                     "object-contain",
                     activeLeague === league.id ? "brightness-0 invert" : ""
                   )}
                 />
              </div>
              {league.name}
            </button>
          ))}
        </div>

        {/* Standings Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          
          <div className={cn("h-2 w-full", currentLeagueInfo?.color)}></div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
                <tr>
                  <th className="px-4 py-4 text-center w-12">#</th>
                  <th className="px-4 py-4">Team</th>
                  <th className="px-4 py-4 text-center">MP</th>
                  <th className="px-4 py-4 text-center hidden sm:table-cell">W</th>
                  <th className="px-4 py-4 text-center hidden sm:table-cell">D</th>
                  <th className="px-4 py-4 text-center hidden sm:table-cell">L</th>
                  <th className="px-4 py-4 text-center hidden md:table-cell">GF</th>
                  <th className="px-4 py-4 text-center hidden md:table-cell">GA</th>
                  <th className="px-4 py-4 text-center hidden md:table-cell">GD</th>

                  <th className="px-4 py-4 text-center font-bold text-gray-900 dark:text-white text-base">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {activeData?.map((team: TeamData) => (
                  <tr key={team.team.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-center font-semibold text-gray-500">
                        {team.rank}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 flex-shrink-0">
                          <Image 
                            src={team.team.logo} 
                            alt={team.team.name} 
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{team.team.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-600 dark:text-gray-300">{team.played}</td>
                    <td className="px-4 py-3 text-center text-green-600 hidden sm:table-cell">{team.win}</td>
                    <td className="px-4 py-3 text-center text-gray-500 hidden sm:table-cell">{team.draw}</td>
                    <td className="px-4 py-3 text-center text-red-500 hidden sm:table-cell">{team.lose}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell text-gray-500">{team.gf}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell text-gray-500">{team.ga}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell font-medium">
                        {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                    
                    <td className="px-4 py-3 text-center font-bold text-lg text-gray-900 dark:text-white">
                        {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(!activeData || activeData.length === 0) && (
             <div className="p-10 text-center text-gray-500">
                No standings data available for this league currently.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}