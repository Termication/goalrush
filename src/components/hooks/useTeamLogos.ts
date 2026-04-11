'use client';

import { useState, useEffect } from 'react';

// Helper to strip accents, punctuation, and handle weird spacing
const normalize = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents (é -> e, ö -> o)
    .toLowerCase()
    .replace(/&/g, 'and')           // Convert & to and
    .replace(/[-_]/g, ' ')          // Convert hyphens to spaces
    .replace(/[^a-z0-9\s]/g, '')    // Remove periods, ellipses, apostrophes
    .replace(/\s+/g, ' ')           // Collapse multiple spaces into one
    .trim();
};

// Dictionary to catch teams with different betting names vs official names
const MANUAL_ALIASES: Record<string, string> = {
  "inter milan": "internazionale",
  "celta vigo": "celta de vigo",
  "athletic bilb": "athletic club",
  "bayern muni": "bayern munchen",
  "bayer leverku": "leverkusen",
  "tsg hoffenh": "hoffenheim",
  "rennes": "stade rennais",
  "brighton and h": "brighton",
  "atletico madrid": "atletico de madrid",
  "paris saint germ": "paris saint germain",
  "rc lens": "lens",
  "borussia monchengladbach": "monchengladbach",
  "man utd": "manchester united",
  "man city": "manchester city",
  "spurs": "tottenham",
  "wolves": "wolverhampton",
  "nottm forest": "nottingham forest",
  "psv eindhoven": "psv",
  "sporting lisbon": "sporting",
  "benfica": "sl benfica",
  "porto": "fc porto",
};

// Custom hook to fetch team logos from the standings API and provide a lookup function
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

  const getLogo = (teamName: string) => {
    // 1. Check for exact match first
    if (logos[teamName]) return logos[teamName];

    // 2. Normalize the search term
    let search = normalize(teamName);

    // 3. Swap the search term if it matches one of our known aliases
    for (const [bettingName, officialName] of Object.entries(MANUAL_ALIASES)) {
      if (search.includes(bettingName)) {
        search = officialName;
        break;
      }
    }

    // 4. Do a fuzzy match against the normalized database names
    const matchKey = Object.keys(logos).find(key => {
      const dbName = normalize(key);
      return dbName.includes(search) || search.includes(dbName);
    });

    // 5. Return matched logo, or a placeholder if totally missing
    return matchKey ? logos[matchKey] : 'https://placehold.co/100x100/png?text=Logo'; 
  };

  return { logos, getLogo, loading };
}