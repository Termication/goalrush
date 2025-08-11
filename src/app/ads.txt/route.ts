import { NextResponse } from 'next/server';

// This function handles any GET request to goal-rush.com/ads.txt
export async function GET() {
  // This performs a permanent (301) redirect to the Ezoic ads.txt manager URL.

  const ezoicAdsTxtUrl = 'https://srv.adstxtmanager.com/19390/goal-rush.live';
  
  return NextResponse.redirect(ezoicAdsTxtUrl, 301);
}
