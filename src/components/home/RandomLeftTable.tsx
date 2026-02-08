'use client';

import { useState, useEffect } from 'react';
import LaLigaLeagueTable from "@/components/home/laligaLeagueTable";
import UefaTable from "@/components/home/eufaTable";
import SerieALeagueTable from './serieATable';

export default function RandomLeftTable() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 3);
    setSelectedTable(randomIndex);
  }, []);

  if (selectedTable === 0) return <SerieALeagueTable />;
  if (selectedTable === 1) return <UefaTable />;

  return <LaLigaLeagueTable />;
}