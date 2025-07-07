import { connectrpcClient } from '@/lib/network/connectrpc';
import { useEffect, useState } from 'react';

export const useBroadcastTrack = () => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const run = async () => {
      let attempt = 0;

      while (!signal.aborted) {
        try {
          const stream = connectrpcClient.broadcastActiveTrack({});

          for await (const response of stream) {
            if (signal.aborted) break;
            setCurrentTrack(response.track);
          }

          attempt = 0;
        } catch (err) {
          if (signal.aborted) break;
          console.error('Stream error:', err);

          const baseDelay = 100;
          const maxDelay = 5000;
          const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
          const jitter = delay * 0.2 * Math.random();
          await new Promise(res => setTimeout(res, delay + jitter));

          attempt += 1;
        }
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, []);

  return currentTrack;
};
