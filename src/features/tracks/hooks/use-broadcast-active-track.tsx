import { connectrpcClient } from '@/lib/network/connectrpcClient';
import { useEffect, useState } from 'react';

export const useBroadcastActiveTrack = () => {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      try {
        const stream = connectrpcClient.broadcastActiveTrack({});

        for await (const response of stream) {
          if (isCancelled) break;
          setActiveTrack(response.track);
        }
      } catch (err) {
        console.error('Stream error:', err);
      }
    };

    void run();

    return () => {
      isCancelled = true;
    };
  }, []);

  return activeTrack;
};
