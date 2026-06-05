'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

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

      className={`hidden 2xl:block fixed left-0 top-20 w-64 border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-lg rounded-r-md z-40 transition-all duration-500 group ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
      }`}
    >

      <div className="bg-[#1e3c72] text-white p-2 border-b border-blue-800 dark:border-gray-800">
        <h3 className="text-sm font-bold flex items-center gap-2">
            <Image
                src="/more_graphics/uefa-champions-league-logo.png"
                alt="UEFA Logo"
                width={100}
                height={100}
                className="w-24 h-24 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-120"
                priority
            />
           Champions League
        </h3>
      </div>


      <div 
        ref={tableRef}
        // allow scrolling
        className="max-h-[600px] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <table className="w-full border-collapse text-xs">
          {/* Dark mode background for sticky header */}
          <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
             <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                <th className="p-2 w-8 text-center">#</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2 w-8 text-center font-bold text-black dark:text-white">Pts</th>
             </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              // Hover states and borders for dark mode rows
              <tr key={team.rank} className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

                <td className={`p-2 text-center font-medium ${
                  team.rank <= 8 
                    ? 'text-green-600 dark:text-green-400 font-bold' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                    {team.rank}
                </td>
                <td className="p-2 flex items-center gap-2">
                  <img src={team.team.logo} alt={team.team.name} className="w-4 h-4 object-contain" />
                  <span className="truncate w-24 font-medium" title={team.team.name}>
                    {team.team.name}
                  </span>
                </td>

                <td className="p-2 text-center font-bold text-gray-900 dark:text-white">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={scrollTable}

        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}