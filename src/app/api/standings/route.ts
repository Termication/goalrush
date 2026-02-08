import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  const headers = { 'X-Auth-Token': API_KEY };
  
  try {
    // Fetch all 6 leagues in parallel
    const [plRes, clRes, pdRes, blRes, flRes, saRes] = await Promise.all([
      fetch('https://api.football-data.org/v4/competitions/PL/standings', { headers, next: { revalidate: 300 } }),
      fetch('https://api.football-data.org/v4/competitions/CL/standings', { headers, next: { revalidate: 3600 } }),
      fetch('https://api.football-data.org/v4/competitions/PD/standings', { headers, next: { revalidate: 300 } }),
      fetch('https://api.football-data.org/v4/competitions/BL1/standings', { headers, next: { revalidate: 300 } }),
      fetch('https://api.football-data.org/v4/competitions/FL1/standings', { headers, next: { revalidate: 300 } }),
      fetch('https://api.football-data.org/v4/competitions/SA/standings', { headers, next: { revalidate: 300 } }),
    ]);

    const plData = plRes.ok ? await plRes.json() : null;
    const clData = clRes.ok ? await clRes.json() : null;
    const pdData = pdRes.ok ? await pdRes.json() : null;
    const blData = blRes.ok ? await blRes.json() : null;
    const flData = flRes.ok ? await flRes.json() : null;
    const saData = saRes.ok ? await saRes.json() : null;

    // Processes raw table data into your frontend format
    const formatTable = (data: any) => {
        // If data is missing or empty, return empty array
        if (!data || !data.standings) return [];

  
        let table = [];
        if (data.competition?.code === 'CL') {
             const totalStanding = data.standings.find((s: any) => s.type === 'TOTAL');
             table = totalStanding?.table || [];
        } else {
             table = data.standings[0]?.table || [];
        }

        return table.map((item: any) => ({
            rank: item.position,
            team: {
                name: item.team.shortName || item.team.tla || item.team.name,
                logo: item.team.crest,
            },
            points: item.points,
            played: item.playedGames,
            win: item.won,          
            draw: item.draw,       
            lose: item.lost,        
            gf: item.goalsFor,       
            ga: item.goalsAgainst,   
            gd: item.goalDifference,
            form: item.form,
        }));
    };

    return NextResponse.json({
      premierLeague: formatTable(plData),
      championsLeague: formatTable(clData),
      laLiga: formatTable(pdData),
      bundesliga: formatTable(blData),
      franceLigue1: formatTable(flData),
      serieA: formatTable(saData),
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}