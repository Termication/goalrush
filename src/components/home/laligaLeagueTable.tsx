'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface TeamStanding {
  rank: number;
  team: { name: string; logo: string };
  points: number;
  played: number;
  form?: string;
}

export default function LaLigaLeagueTable() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch Data
    const fetchData = async () => {
      try {
        const res = await fetch('/api/standings');
        const data = await res.json();
        if (data.laLiga) {
          setStandings(data.laLiga);
        }
      } catch (err) {
        console.error('Failed to load La Liga standings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // 2. Handle Scroll Visibility
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

  if (loading || standings.length === 0) return null;

  return (
    <div
      className={`hidden 2xl:block fixed left-0 top-20 w-64 border border-gray-300 bg-white shadow-lg rounded-r-md z-40 transition-all duration-500 group ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'
      }`}
    >
      <div className="bg-red-800 text-white p-2 border-b border-red-900 flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Image
            src="/more_graphics/la-liga-logo.png"
            alt="La Liga Logo"
            width={100}
            height={100}
            className="w-15 h-24 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
            priority
          />
          La Liga
        </h3>
      </div>

      <div
        ref={tableRef}
        className="max-h-[600px] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="text-center p-2 w-8">#</th>
              <th className="text-left p-2">Team</th>
              <th className="text-center p-2 w-10 font-bold text-black">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr key={team.rank} className="border-b border-gray-200 hover:bg-gray-50">
                <td className={`text-center p-2 font-medium ${team.rank <= 4 ? 'text-blue-600 font-bold' : (team.rank >= 18 ? 'text-red-600' : 'text-gray-500')}`}>
                  {team.rank}
                </td>
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={team.team.logo}
                    alt={team.team.name}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="truncate w-24 font-medium" title={team.team.name}>
                    {team.team.name}
                  </span>
                </td>
                <td className="text-center p-2 font-bold text-gray-900">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={scrollTable}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-800 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-900"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}