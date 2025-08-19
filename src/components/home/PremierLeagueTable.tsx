// 'use client';
// import React, { useEffect, useState } from 'react';

// interface TeamStanding {
//   rank: number;
//   team: { name: string; logo: string };
//   points: number;
//   all: { played: number; win: number; draw: number; lose: number };
// }

// export default function PremierLeagueTable() {
//   const [standings, setStandings] = useState<TeamStanding[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('/api/premier-league');
//         const data = await res.json();

//         if (data.response) {
//           // According to API-Football, standings is nested like: response[0].league.standings[0]
//           setStandings(data.response[0]?.league?.standings[0] || []);
//         } else {
//           setError('No data received');
//         }
//       } catch (err) {
//         setError('Failed to load standings');
//       } finally {
//         setLoading(false);
      
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div className="p-4">Loading Premier League Table...</div>;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//     return (
//     <div className="fixed right-0 top-20 w-64 border border-gray-300 p-3 bg-white shadow-lg">
//         <h3 className="text-lg font-bold mb-2">Premier League Table</h3>
//         <table className="w-full border-collapse text-sm">
//         <thead>
//             <tr className="border-b border-gray-300">
//             <th className="text-left p-1">#</th>
//             <th className="text-left p-1">Team</th>
//             <th className="text-center p-1">Pts</th>
//             </tr>
//         </thead>
//         <tbody>
//             {standings.map((team) => (
//             <tr key={team.rank} className="border-b border-gray-100">
//                 <td className="p-1">{team.rank}</td>
//                 <td className="p-1 flex items-center gap-2">
//                 <img src={team.team.logo} alt={team.team.name} className="w-5 h-5" />
//                 {team.team.name}
//                 </td>
//                 <td className="p-1 text-center font-semibold">{team.points}</td>
//             </tr>
//             ))}
//         </tbody>
//         </table>
//     </div>
//     );
// }