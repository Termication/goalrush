'use client';

import { useTeamLogos } from '@/components/hooks/useTeamLogos';

export default function ExampleComponent() {
  const { getLogo, loading } = useTeamLogos();

  if (loading) return <p>Loading logos...</p>;

  return (
    <div className="flex gap-4 p-4 bg-gray-900 text-white rounded-xl max-w-sm mx-auto mt-10 justify-center">
      <div className="flex flex-col items-center">

        <img 
          src={getLogo("Real Madrid")} 
          alt="Real Madrid" 
          className="w-12 h-12 object-contain"
        />
        <span className="mt-2 text-sm">Real Madrid</span>
      </div>
      
      <span className="font-bold mt-4">VS</span>

      <div className="flex flex-col items-center">
        <img 
          src={getLogo("Barcelona")} 
          alt="Barcelona" 
          className="w-12 h-12 object-contain"
        />
        <span className="mt-2 text-sm">Barcelona</span>
      </div>
    </div>
  );
}