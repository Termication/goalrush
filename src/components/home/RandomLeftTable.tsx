// src/components/home/RandomLeftTable.tsx
'use client';

import { useState, useEffect } from 'react';
import LaLigaLeagueTable from "@/components/home/laligaLeagueTable";
import UefaTable from "@/components/home/eufaTable";

export default function RandomLeftTable() {
  const [showLaLiga, setShowLaLiga] = useState<boolean | null>(null);

  useEffect(() => {
    // 50% chance
    setShowLaLiga(Math.random() > 0.5);
  }, []);

  if (showLaLiga === null) return null;

  return showLaLiga ? <LaLigaLeagueTable /> : <UefaTable />;
}