import { NextResponse } from 'next/server';
import { getDynamicRevalidation } from '@/lib/getRevalidateInterval';

  // Ensuring our dynamic caching strategy works as intended.
export const dynamic = 'force-dynamic'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport') || 'soccer_epl'; 
  const API_KEY = process.env.ODDS_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  const REGIONS = 'eu'; // uk | us | eu | au
  const MARKETS = 'h2h'; // head to head
  const ODDS_FORMAT = 'decimal';

  // Calculate the strategy once per request
  const revalidateSecs = getDynamicRevalidation();

  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${API_KEY}&regions=${REGIONS}&markets=${MARKETS}&oddsFormat=${ODDS_FORMAT}`,
      { 

        // StoreData Cache for the duration of revalidateSecs.
        next: { revalidate: revalidateSecs } 
      } 
    );

    if (!response.ok) {
      throw new Error(`Error fetching odds: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { 
        status: 200, 
        // Helpful for debugging
        headers: { 
            'X-Cache-Duration': `${revalidateSecs} seconds` 
        } 
    });

  } catch (error: any) {
    console.error('Odds API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch odds' }, { status: 500 });
  }
}