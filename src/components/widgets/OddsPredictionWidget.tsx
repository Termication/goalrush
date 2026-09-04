'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, BarChart3, ChevronRight, Zap, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTeamLogos } from '@/components/hooks/useTeamLogos';

const PREFERRED_BOOKIES = ['Unibet', 'William Hill', 'Bet365', 'Betfair', 'Sunbet'];

// Top leagues to aggregate matches from
const TOP_LEAGUES = [
  'soccer_epl', 
  'soccer_spain_la_liga', 
  'soccer_uefa_champs_league', 
  'soccer_fifa_world_cup'
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
  sport_key: string;
  bookmakers: {
    title: string;
    markets: {
      key: string;
      outcomes: Outcome[];
    }[];
  }[];
}

interface ProcessedMatchData {
  id: string;
  home: { name: string; short: string; color: string; odds: number; voteSplit: number };
  draw: { name: string; short: string; color: string; odds: number; voteSplit: number };
  away: { name: string; short: string; color: string; odds: number; voteSplit: number };
  league: string;
  time: string;
  isInternational: boolean;
}

const getCountryFlag = (countryName: string) => {
  const flags: Record<string, string> = {
    'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'France': '🇫🇷', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 
    'Spain': '🇪🇸', 'Germany': '🇩🇪', 'Portugal': '🇵🇹', 'Italy': '🇮🇹',
    'South Africa': '🇿🇦', 'USA': '🇺🇸',
  };
  return flags[countryName.trim()] || '🌍'; 
};

export default function OddsPredictionWidget() {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matchData, setMatchData] = useState<ProcessedMatchData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const { getLogo } = useTeamLogos();

  // 1. Fetch matches from multiple top leagues
  const fetchAllTopMatches = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all leagues in parallel
      const fetchPromises = TOP_LEAGUES.map(league => 
        fetch(`/api/odds?sport=${league}`)
          .then(res => res.json())
          .then((data: Match[]) => {
             // Attach the sport_key to each match so we know where it came from
             return data.map(match => ({ ...match, sport_key: league }));
          })
          .catch(() => []) // Silently handle if one league fails
      );

      const results = await Promise.all(fetchPromises);
      const aggregatedMatches = results.flat();

      if (aggregatedMatches.length === 0) {
        setLoading(false);
        return;
      }

      // Sort all matches by how close they are to right now
      const now = new Date().getTime();
      const sortedMatches = aggregatedMatches.sort((a, b) => {
        return Math.abs(new Date(a.commence_time).getTime() - now) - Math.abs(new Date(b.commence_time).getTime() - now);
      });

      setAllMatches(sortedMatches);
      processAndSetMatch(sortedMatches[0]);

    } catch (error) {
      console.error('Failed to load featured odds', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Process a raw match into UI data
  const processAndSetMatch = (rawMatch: Match) => {
    const bookie = rawMatch.bookmakers.find(b => PREFERRED_BOOKIES.includes(b.title)) || rawMatch.bookmakers[0];
    const h2h = bookie?.markets.find((m) => m.key === 'h2h');
    
    const homeOutcome = h2h?.outcomes.find(o => o.name === rawMatch.home_team);
    const awayOutcome = h2h?.outcomes.find(o => o.name === rawMatch.away_team);
    const drawOutcome = h2h?.outcomes.find(o => o.name === 'Draw');

    if (!homeOutcome || !awayOutcome || !drawOutcome) {
      return; // Skip if odds are missing
    }

    const impliedHome = 1 / homeOutcome.price;
    const impliedDraw = 1 / drawOutcome.price;
    const impliedAway = 1 / awayOutcome.price;
    const totalImplied = impliedHome + impliedDraw + impliedAway;

    // Format League Name nicely
    let leagueName = 'Premier League';
    if (rawMatch.sport_key === 'soccer_fifa_world_cup') leagueName = 'World Cup';
    if (rawMatch.sport_key === 'soccer_spain_la_liga') leagueName = 'La Liga';
    if (rawMatch.sport_key === 'soccer_uefa_champs_league') leagueName = 'Champions League';

    const processed: ProcessedMatchData = {
      id: rawMatch.id,
      league: leagueName,
      time: format(new Date(rawMatch.commence_time), "MMM d, HH:mm"),
      isInternational: rawMatch.sport_key === 'soccer_fifa_world_cup',
      home: {
        name: rawMatch.home_team,
        short: rawMatch.home_team.substring(0, 3).toUpperCase(),
        color: 'bg-red-500',
        odds: homeOutcome.price,
        voteSplit: Math.round((impliedHome / totalImplied) * 100)
      },
      draw: {
        name: 'Draw',
        short: 'DRAW',
        color: 'bg-gray-500',
        odds: drawOutcome.price,
        voteSplit: Math.round((impliedDraw / totalImplied) * 100)
      },
      away: {
        name: rawMatch.away_team,
        short: rawMatch.away_team.substring(0, 3).toUpperCase(),
        color: 'bg-sky-500',
        odds: awayOutcome.price,
        voteSplit: Math.round((impliedAway / totalImplied) * 100)
      }
    };

    setMatchData(processed);
  };

  useEffect(() => {
    fetchAllTopMatches();
  }, [fetchAllTopMatches]);

  const handleVote = (choice: 'home' | 'draw' | 'away') => {
    setSelectedChoice(choice);
    setHasVoted(true);
  };

  // 3. Load the next match in the sorted array
  const loadNextMatch = () => {
    const nextIndex = currentMatchIndex + 1;
    // Loop back to start if we reach the end of the array
    const newIndex = nextIndex >= allMatches.length ? 0 : nextIndex;
    
    setCurrentMatchIndex(newIndex);
    setHasVoted(false); // Reset voting state
    setSelectedChoice(null);
    processAndSetMatch(allMatches[newIndex]);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto h-[350px] bg-[#1c1d1e] rounded-3xl animate-pulse border border-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!matchData) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-b from-[#1c1d1e] to-[#151616] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Fan Prediction</h3>
              <p className="text-xs text-indigo-400 font-medium tracking-wide uppercase">{matchData.league}</p>
            </div>
          </div>
          <div className="text-xs font-semibold px-3 py-1 bg-gray-800/80 text-gray-300 rounded-full border border-gray-700">
            {matchData.time}
          </div>
        </div>

        {/* Matchup Header */}
        <div className="flex items-center justify-between text-center mb-8">
          <div className="flex-1">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 shadow-inner overflow-hidden">
              {matchData.isInternational ? (
                <span className="text-3xl">{getCountryFlag(matchData.home.name)}</span>
              ) : (
                <img src={getLogo(matchData.home.name)} alt={matchData.home.name} className="w-10 h-10 object-contain" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/png?text=Team')} />
              )}
            </div>
            <p className="text-sm font-bold text-gray-200 truncate px-2">{matchData.home.name}</p>
          </div>
          
          <div className="px-4">
            <div className="text-sm font-black text-gray-500 italic">VS</div>
          </div>

          <div className="flex-1">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 shadow-inner overflow-hidden">
              {matchData.isInternational ? (
                <span className="text-3xl">{getCountryFlag(matchData.away.name)}</span>
              ) : (
                <img src={getLogo(matchData.away.name)} alt={matchData.away.name} className="w-10 h-10 object-contain" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/png?text=Team')} />
              )}
            </div>
            <p className="text-sm font-bold text-gray-200 truncate px-2">{matchData.away.name}</p>
          </div>
        </div>

        {/* Dynamic Content Area: Voting vs Results */}
        {!hasVoted ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <p className="text-center text-sm text-gray-400 font-medium mb-2">Who will win?</p>
            <div className="grid grid-cols-3 gap-3">
              <VoteButton 
                label={matchData.home.short} 
                odds={matchData.home.odds} 
                onClick={() => handleVote('home')} 
                colorClass="hover:border-red-500 hover:bg-red-500/10"
              />
              <VoteButton 
                label="DRAW" 
                odds={matchData.draw.odds} 
                onClick={() => handleVote('draw')} 
                colorClass="hover:border-gray-400 hover:bg-gray-500/10"
              />
              <VoteButton 
                label={matchData.away.short} 
                odds={matchData.away.odds} 
                onClick={() => handleVote('away')} 
                colorClass="hover:border-sky-500 hover:bg-sky-500/10"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-400" />
                <p className="text-sm font-semibold text-gray-200">Community Consensus</p>
              </div>
            </div>
            
            <ResultBar label={matchData.home.name} percentage={matchData.home.voteSplit} odds={matchData.home.odds} color={matchData.home.color} isSelected={selectedChoice === 'home'} />
            <ResultBar label="Draw" percentage={matchData.draw.voteSplit} odds={matchData.draw.odds} color={matchData.draw.color} isSelected={selectedChoice === 'draw'} />
            <ResultBar label={matchData.away.name} percentage={matchData.away.voteSplit} odds={matchData.away.odds} color={matchData.away.color} isSelected={selectedChoice === 'away'} />

            {/* Next Match Button */}
            <button 
              onClick={loadNextMatch}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-sm font-semibold text-indigo-300 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700 hover:border-indigo-500/50 group"
            >
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              Predict Another Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function VoteButton({ label, odds, onClick, colorClass }: { label: string, odds: number, onClick: () => void, colorClass: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-700 bg-gray-800/50 transition-all duration-300 group",
        colorClass
      )}
    >
      <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{label}</span>
      <span className="text-xs font-semibold text-indigo-400 mt-1">{odds.toFixed(2)}</span>
    </button>
  );
}

function ResultBar({ label, percentage, odds, color, isSelected }: { label: string, percentage: number, odds: number, color: string, isSelected: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1.5">
        <span className="text-gray-300 flex items-center gap-2">
          {label} {isSelected && <Trophy className="h-3 w-3 text-amber-400" />}
        </span>
        <span className="text-gray-400">{percentage}% <span className="ml-1 text-indigo-500 font-bold">({odds.toFixed(2)})</span></span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-800">
        <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}