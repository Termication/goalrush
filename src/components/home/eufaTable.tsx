'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Team {
  rank: number;
  team: { name: string; logo: string };
  points: number;
  played: number;
}

export default function UefaTable() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/standings');
        const data = await res.json();
        if (data.championsLeague) setTeams(data.championsLeague);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Hide tables when scrolling down the main page
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTable = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  if (loading || teams.length === 0) return null;

  return (
    <div 
      className={`hidden xl:block fixed left-0 top-20 w-64 border border-gray-300 bg-white shadow-lg rounded-r-md z-40 transition-all duration-500 group ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
      }`}
    >
      <div className="bg-[#1e3c72] text-white p-2 border-b border-blue-800">
        <h3 className="text-sm font-bold flex items-center gap-2">
           <span className="text-xs">⚽</span>
           Champions League
        </h3>
      </div>
      
      <div 
        ref={tableRef}
        // allow scrolling
        className="max-h-[600px] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-100 sticky top-0 z-10">
             <tr className="border-b border-gray-200 text-gray-500">
                <th className="p-2 w-8 text-center">#</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2 w-8 text-center font-bold text-black">Pts</th>
             </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.rank} className="border-b border-gray-100 hover:bg-gray-50">
                <td className={`p-2 text-center font-medium ${team.rank <= 8 ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                    {team.rank}
                </td>
                <td className="p-2 flex items-center gap-2">
                  <img src={team.team.logo} alt={team.team.name} className="w-4 h-4 object-contain" />
                  <span className="truncate w-24 font-medium" title={team.team.name}>
                    {team.team.name}
                  </span>
                </td>
                <td className="p-2 text-center font-bold text-gray-900">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={scrollTable}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-700"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}