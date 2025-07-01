import { useQuery, useMutation } from '@connectrpc/connect-query';
import {
  getTracks,
  getTrack,
  getGenres,
  addTrack,
  updateTrack,
  deleteTrack,
  bulkDeleteTracks,
  uploadTrackFile,
  deleteTrackFile,
} from '@music-manager-api/tracks-queries';
import { cleanSearchParams } from '@/lib/network/networkUtils';
import { keepPreviousData } from '@tanstack/react-query';
import { SortOrder } from './types';
import { getErrorMessage } from '@/lib/utils';

export const useFetchTracks = (params: {
  page: number;
  limit: number;
  sort?: string | undefined;
  order?: SortOrder | undefined;
  search?: string | undefined;
}) => {
  const { page = 0, limit = 10, sort, order, search } = params;

  const queryParams = cleanSearchParams({ page, limit, sort, order, search });
  return useQuery(getTracks, queryParams, {
    placeholderData: keepPreviousData,
  });
};

export const useFetchTrack = ({ slug, enabled = true }: { slug: string; enabled: boolean }) => {
  return useQuery(
    getTrack,
    { slug },
    {
      enabled,
      select: data => {
        const { track } = data;
        return track;
      },
    },
  );
};

export const useFetchGenres = () => {
  return useQuery(getGenres, undefined, {
    select: data => {
      const { genres } = data;
      return genres;
    },
  });
};

export const useAddTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation(addTrack, {
    onSuccess,
    onError: error => {
      onError({ message: getErrorMessage(error) });
    },
  });
};

export const useUpdateTrack = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (e: { message: string }) => void;
}) => {
  return useMutation(updateTrack, {
    onSuccess,
    onError: error => {
      onError({ message: getErrorMessage(error) });
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
  return useMutation(deleteTrack, {
    onSuccess,
    onError: error => {
      onError({ message: getErrorMessage(error) });
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
  return useMutation(bulkDeleteTracks, {
    onSuccess,
    onError: error => {
      onError({ message: getErrorMessage(error) });
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
  return useMutation(uploadTrackFile, {
    onSuccess,
    onError: error => {
      onError({ message: getErrorMessage(error) });
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
  return useMutation(deleteTrackFile, {
    onSuccess,
    onError: error => {
      onError({ message: getErrorMessage(error) });
    },
  });
};
