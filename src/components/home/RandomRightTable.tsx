'use client';

import { useState, useEffect } from 'react';
import PremierLeagueTable from './PremierLeagueTable';
import BundesligaTable from './bundegasligaTable';


export default function RandomRightTable() {
    const [showPremier, setShowPremier] = useState<boolean | null>(null);

    useEffect(() => {
        // 50% chance
        setShowPremier(Math.random() > 0.5);
    }, []);

    if (showPremier === null) return null;

    return showPremier ? <PremierLeagueTable /> : <BundesligaTable />;
}