'use client';

import { useState, useEffect } from 'react';
import PremierLeagueTable from './PremierLeagueTable';
import BundesligaTable from './bundegasligaTable';
import Ligue1Table from './ligue1Table';

export default function RandomRightTable() {
    const [selectedTable, setSelectedTable] = useState<number | null>(null);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * 3);
        setSelectedTable(randomIndex);
    }, []);

    // Return null while waiting for client-side hydration
    if (selectedTable === null) return null;

    // Render based on the random number
    if (selectedTable === 0) return <PremierLeagueTable />;
    if (selectedTable === 1) return <BundesligaTable />;
    return <Ligue1Table />;
}