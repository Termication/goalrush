'use server';

export async function checkWidgetHealth(url: string): Promise<boolean> {
    if (!url) return false;

  try {
    const res = await fetch(url, {
        method: 'HEAD',
        next: { revalidate: 1800 }, // Revalidate every 30 minutes
    
    });
    // Returns TRUE only if status is 200-299. 
    // Returns FALSE if 429 (Quota), 404, 500, etc.
    return res.ok;
  } catch (error) {
    return false;
  }
}
