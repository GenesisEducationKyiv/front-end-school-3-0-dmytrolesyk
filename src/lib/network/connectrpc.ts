import { createConnectTransport } from '@connectrpc/connect-web';
import { createClient } from '@connectrpc/connect';

import { TracksService } from '@buf/dmytrolesyk_music-manager-api.bufbuild_es/tracks/v1/tracks_pb';

const BASE_API_URL = import.meta.env['VITE_API_HOST'];

export const connectrpcTransport = createConnectTransport({
  baseUrl: `${BASE_API_URL}/connect`,
  useBinaryFormat: true,
});

export const connectrpcClient = createClient(TracksService, connectrpcTransport);

export {
  getTracks,
  getTrack,
  getGenres,
  addTrack,
  updateTrack,
  deleteTrack,
  bulkDeleteTracks,
  uploadTrackFile,
  deleteTrackFile,
} from '@buf/dmytrolesyk_music-manager-api.connectrpc_query-es/tracks/v1/tracks-TracksService_connectquery';
