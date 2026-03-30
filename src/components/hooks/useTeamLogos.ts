'use client';

import { useState, useEffect } from 'react';

export function useTeamLogos() {
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndExtractLogos = async () => {
      try {
        const res = await fetch('/api/standings');
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const logoMap: Record<string, string> = {};

        Object.values(data).forEach((leagueTable: any) => {
          if (Array.isArray(leagueTable)) {
            leagueTable.forEach((row) => {
              if (row.team?.name && row.team?.logo) {
                logoMap[row.team.name] = row.team.logo;
              }
            });
          }
        });

        setLogos(logoMap);

      } catch (error) {
        console.error("Failed to extract team logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndExtractLogos();
  }, []);

  // Handles slight typos and missing "FC" / "CF"
  const getLogo = (teamName: string) => {
    // 1. Check for exact match first
    if (logos[teamName]) return logos[teamName];

    // 2. Do a fuzzy/partial match (ignore case)
    const search = teamName.toLowerCase().trim();
    const matchKey = Object.keys(logos).find(key => {
      const dbName = key.toLowerCase();
      return dbName.includes(search) || search.includes(dbName);
    });

    // 3. Return matched logo, or a placeholder if totally missing
    return matchKey ? logos[matchKey] : 'https://placehold.co/100x100/png?text=Logo'; 
  };

  return { logos, getLogo, loading };
}