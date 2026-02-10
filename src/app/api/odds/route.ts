import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Default to EPL if no sport is specified
  const sport = searchParams.get('sport') || 'soccer_epl'; 
  const API_KEY = process.env.ODDS_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  const REGIONS = 'eu'; // uk | us | eu | au
  const MARKETS = 'h2h'; // head to head (win/draw/loss)
  const ODDS_FORMAT = 'decimal';

  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${API_KEY}&regions=${REGIONS}&markets=${MARKETS}&oddsFormat=${ODDS_FORMAT}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour to save API quota
    );

    if (!response.ok) {
      throw new Error(`Error fetching odds: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Odds API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch odds' }, { status: 500 });
  }
}