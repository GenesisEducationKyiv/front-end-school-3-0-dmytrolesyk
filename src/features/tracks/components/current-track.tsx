import { useBroadcastTrack } from '@/features/tracks/hooks/use-broadcast-current-track';

export function CurrentTrack() {
  const currentTrack = useBroadcastTrack();

  return (
    <div className="py-4 max-w-sm">
      <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
      {currentTrack ? (
        <p className="text-lg text-gray-700">{currentTrack}</p>
      ) : (
        <p className="text-gray-400 italic">No active track</p>
      )}
    </div>
  );
}
