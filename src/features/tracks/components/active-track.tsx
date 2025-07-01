import { useBroadcastActiveTrack } from '@/features/tracks/hooks/use-broadcast-active-track';

export function ActiveTrack() {
  const activeTrack = useBroadcastActiveTrack();

  return (
    <div className="py-4 max-w-sm">
      <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
      {activeTrack ? (
        <p className="text-lg text-gray-700">{activeTrack}</p>
      ) : (
        <p className="text-gray-400 italic">No active track</p>
      )}
    </div>
  );
}
