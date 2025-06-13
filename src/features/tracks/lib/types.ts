import { z } from 'zod';
import { GenresResponseSchema, MetadataSchema, TrackSchema, TracksResponseSchema } from './schemas';

export type TrackI = z.infer<typeof TrackSchema>;
export type TracksResponseI = z.infer<typeof TracksResponseSchema>;
export type MetaDataI = z.infer<typeof MetadataSchema>;
export type GenresI = z.infer<typeof GenresResponseSchema>;

export type SortOrder = 'asc' | 'desc';

export type SortValue = 'title' | 'artist' | 'album';

export interface TracksSearchParams {
  page: number;
  size: number;
  sort?: SortValue | undefined;
  order?: SortOrder | undefined;
  q?: string | undefined;
}
