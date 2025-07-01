import { createConnectTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';

import { TracksService } from '@music-manager-api/tracks-service';

const BASE_API_URL = import.meta.env['VITE_API_HOST'];

const transport = createConnectTransport({
  baseUrl: BASE_API_URL,
});

export const connectrpcClient = createClient(TracksService, transport);
