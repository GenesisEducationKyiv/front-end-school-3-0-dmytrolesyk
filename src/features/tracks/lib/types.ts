import { z } from 'zod';
import { GenresResponseSchema, MetadataSchema, TrackSchema, TracksResponseSchema } from './schemas';

export type TrackI = z.infer<typeof TrackSchema>;
export type TracksResponseI = z.infer<typeof TracksResponseSchema>;
export type MetaDataI = z.infer<typeof MetadataSchema>;
export type GenresI = z.infer<typeof GenresResponseSchema>;

export const SORT_VALUES = ['title', 'artist', 'album'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export type SortValue = (typeof SORT_VALUES)[number];

export type TracksSearchParams = {
  page: number;
  size: number;
  sort?: SortValue | undefined;
  order?: SortOrder | undefined;
  q?: string | undefined;
};

export type UseFetchTracksParams = Omit<TracksSearchParams, 'q' | 'size'> & {
  search?: string | undefined;
  limit?: number | undefined;
};

export type UseFetchTrackParams = {
  slug: string;
  enabled?: boolean;
};

export type OnMutationSuccess = () => void;

export type OnMutationError = (error: { message: string }) => void;

export type MutationOptionsInternal = {
  onSuccess: OnMutationSuccess;
  onError: OnMutationError;
};
