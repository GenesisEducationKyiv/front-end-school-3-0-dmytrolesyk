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
} from '@/lib/network/connectrpc';
import { ConnectError } from '@connectrpc/connect';
import { keepPreviousData } from '@tanstack/react-query';
import { cleanSearchParams } from '@/lib/network/networkUtils';
import { getErrorMessage } from '@/lib/utils';
import {
  MutationOptionsInternal,
  OnMutationError,
  OnMutationSuccess,
  UseFetchTrackParams,
  UseFetchTracksParams,
} from './types';

const getMutationOptions = (onSuccess: OnMutationSuccess, onError: OnMutationError) => ({
  onSuccess,
  onError: (error: ConnectError) => {
    onError({ message: getErrorMessage(error) });
  },
});

export const useFetchTracks = (params: UseFetchTracksParams) => {
  const { page = 0, limit = 10, sort, order, search } = params;

  const queryParams = cleanSearchParams({ page, limit, sort, order, search });
  return useQuery(getTracks, queryParams, {
    placeholderData: keepPreviousData,
  });
};

export const useFetchTrack = ({ slug, enabled = true }: UseFetchTrackParams) => {
  return useQuery(
    getTrack,
    { slug },
    {
      enabled,
      select: data => data.track,
    },
  );
};

export const useFetchGenres = () => {
  return useQuery(getGenres, undefined, {
    select: data => data.genres,
  });
};

export const useAddTrack = ({ onSuccess, onError }: MutationOptionsInternal) => {
  return useMutation(addTrack, getMutationOptions(onSuccess, onError));
};

export const useUpdateTrack = ({ onSuccess, onError }: MutationOptionsInternal) => {
  return useMutation(updateTrack, getMutationOptions(onSuccess, onError));
};

export const useDeleteTrack = ({ onSuccess, onError }: MutationOptionsInternal) => {
  return useMutation(deleteTrack, getMutationOptions(onSuccess, onError));
};

export const useBulkDeleteTracks = ({ onSuccess, onError }: MutationOptionsInternal) => {
  return useMutation(bulkDeleteTracks, getMutationOptions(onSuccess, onError));
};

export const useUploadFile = ({ onSuccess, onError }: MutationOptionsInternal) => {
  return useMutation(uploadTrackFile, getMutationOptions(onSuccess, onError));
};

export const useRemoveFile = ({ onSuccess, onError }: MutationOptionsInternal) => {
  return useMutation(deleteTrackFile, getMutationOptions(onSuccess, onError));
};
