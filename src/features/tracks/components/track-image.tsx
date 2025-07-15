import { useState } from 'react';

export function TrackImage({ imageUrl }: { imageUrl: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mt-2 max-h-32 w-[150px] rounded overflow-hidden bg-gray-300">
      {!loaded && <div className="absolute inset-0 bg-gray-300 animate-pulse" />}
      <img
        className={`rounded transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => {
          setLoaded(true);
        }}
        width={150}
        height={150}
        src={imageUrl}
        fetchPriority="high"
        decoding="async"
        alt="Track Cover"
      />
    </div>
  );
}
