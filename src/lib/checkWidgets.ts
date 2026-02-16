'use server';

export async function checkWidgetHealth(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    
    // Returns TRUE only if status is 200-299. 
    // Returns FALSE if 429 (Quota), 404, 500, etc.
    return res.ok;
  } catch (error) {
    return false;
  }
}