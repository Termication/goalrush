export function getDynamicRevalidation() {
  // Get current time in Johannesburg (SAST)
  const now = new Date();
  const sastTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
  
  const day = sastTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hour = sastTime.getHours(); // 0 - 23

  // --- FRIDAY (Save Mode) ---
  // Strategy: Validate less (Every 4 hours)
  if (day === 5) {
    return 14400; // 4 hours in seconds
  }

  // --- WEEKENDS (Sat & Sun) ---
  // Strategy: "More more more" starting 13:00 SAST
  if (day === 0 || day === 6) {
    if (hour >= 13) {
      return 1800; // 30 minutes (High update frequency)
    }
    return 14400; // 4 hours (Morning/Night savings)
  }

  // --- WEEKDAYS (Mon - Thu) ---
  // Strategy: "More more" starting 19:00 SAST
  if (day >= 1 && day <= 4) {
    if (hour >= 19) {
      return 1500; // 25 minutes (High update frequency)
    }
    return 18000; // 5 hours (Daytime savings)
  }

  // Default fallback (Safe mode)
  return 3600; // 1 hour
}