import { keepPreviousData, queryOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '../../../lib/network/apiClient';
import { GenresI, SortingOrder, TrackI, TracksResponseI } from '@/features/tracks/lib/types';
import {
  GenresResponseSchema,
  TrackSchema,
  TracksResponseSchema,
} from '@/features/tracks/lib/schemas';
import {
  formatError,
  getData,
  ErrorResponse,
  validateApiResponseSchema,
  cleanSearchParams,
} from '../../../lib/network/networkUtils';

export const getTracks = (params: {
  page: number;
  limit: number;
  sort?: string | undefined;
  order?: SortingOrder | undefined;
  search?: string | undefined;
}) => {
  const { page = 0, limit = 10, sort, order, search } = params;

  return queryOptions({
    queryKey: ['GET_TRACKS', page, limit, sort, order, search],
    queryFn: async (): Promise<TracksResponseI> => {
      const endpoint = '/tracks';
      const searchParams = new URLSearchParams(
        cleanSearchParams({ page, limit, sort, order, search }),
      ).toString();

      const data = await getData(apiClient.get<TracksResponseI>(`${endpoint}?${searchParams}`));

      return validateApiResponseSchema(endpoint, TracksResponseSchema, data);
    },
    placeholderData: keepPreviousData,
  });
};

export const getTrack = (trackSlug: string) =>
  queryOptions({
    queryKey: ['GET_TRACK', trackSlug],
    queryFn: async (): Promise<TrackI | null> => {
      const endpoint = `tracks/${trackSlug}`;
      const data = await getData(apiClient.get<TrackI>(endpoint));

      return validateApiResponseSchema(endpoint, TrackSchema, data);
    },
  });

export const getGenres = () =>
  queryOptions({
    queryKey: ['GET_GENRES'],
    queryFn: async (): Promise<GenresI> => {
      const endpoint = '/genres';
      const data = await getData(apiClient.get<GenresI>(endpoint));
      return validateApiResponseSchema(endpoint, GenresResponseSchema, data);
    },
  });

export const useAddTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (params: Pick<TrackI, 'title' | 'artist' | 'album' | 'genres' | 'coverImage'>) => {
      const { title, artist, album, genres, coverImage } = params;
      return apiClient.post('/tracks', {
        title,
        artist,
        album,
        genres,
        coverImage,
      });
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      onError(formatError(e));
    },
  });
};

export const useEditTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (
      params: Pick<TrackI, 'id' | 'title' | 'artist' | 'album' | 'genres' | 'coverImage'>,
    ) => {
      const { id, title, artist, album, genres, coverImage } = params;
      return apiClient.put(`/tracks/${id}`, {
        title,
        artist,
        album,
        genres,
        coverImage,
      });
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      onError(formatError(e));
    },
  });
};

export const useDeleteTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (trackId: string) => {
      return apiClient.delete(`tracks/${trackId}`);
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      if (onError) {
        onError(formatError(e));
      }
    },
  });
};

export const useBulkDeleteTracks = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (trackIds: string[]) => {
      return apiClient.post(`tracks/delete`, {
        ids: trackIds,
      });
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      onError(formatError(e));
    },
  });
};

export const useUploadFile = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: ({ trackId, file }: { trackId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post(`tracks/${trackId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      onError(formatError(e));
    },
  });
};

export const useRemoveFile = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation({
    mutationFn: (trackId: string) => {
      return apiClient.delete(`tracks/${trackId}/file`);
    },
    onSuccess,
    onError: (e: AxiosError<ErrorResponse>) => {
      onError(formatError(e));
    },
  });
};
