import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  const headers = { 'X-Auth-Token': API_KEY };
  
  // Uses parallel fetching for speed
  try {
    const [plRes, clRes, pdRes] = await Promise.all([
      fetch('https://api.football-data.org/v4/competitions/PL/standings', { headers, next: { revalidate: 300 } }),
      fetch('https://api.football-data.org/v4/competitions/CL/standings', { headers, next: { revalidate: 3600 } }),
      fetch('https://api.football-data.org/v4/competitions/PD/standings', { headers, next: { revalidate: 300 } }),
    ]);

    // Check for errors in either request
    const plData = plRes.ok ? await plRes.json() : null;
    const clData = clRes.ok ? await clRes.json() : null;
    const pdData = pdRes.ok ? await pdRes.json() : null;

    // --- Process Premier League ---
    const plTable = plData?.standings?.[0]?.table || [];
    const formattedPL = plTable.map((item: any) => ({
      rank: item.position,
      team: {
        name: item.team.shortName || item.team.tla || item.team.name,
        logo: item.team.crest,
      },
      points: item.points,
      played: item.playedGames,
      form: item.form,
    }));



    // --- Process La Liga ---
    const pdTable = pdData?.standings?.[0]?.table || [];
    const formattedPD = pdTable.map((item: any) => ({
      rank: item.position,
      team: {
        name: item.team.shortName || item.team.tla || item.team.name,
        logo: item.team.crest,
      },
      points: item.points,
      played: item.playedGames,
      form: item.form,
    }));



    // --- Process Champions League ---
    const clStandings = clData?.standings?.find((s: any) => s.type === 'TOTAL');
    const clTable = clStandings?.table || [];
    
    const formattedCL = clTable.map((item: any) => ({
      rank: item.position,
      team: {
        name: item.team.shortName || item.team.tla || item.team.name,
        logo: item.team.crest,
      },
      points: item.points,
      played: item.playedGames,
      form: item.form,
    }));

    return NextResponse.json({
      premierLeague: formattedPL,
      championsLeague: formattedCL,
      laLiga: formattedPD,
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}