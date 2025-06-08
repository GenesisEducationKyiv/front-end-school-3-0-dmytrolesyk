import { z } from 'zod';
import { GenresResponseSchema, MetadataSchema, TrackSchema, TracksResponseSchema } from './schemas';

export type TrackI = z.infer<typeof TrackSchema>;
export type TracksResponseI = z.infer<typeof TracksResponseSchema>;
export type MetaDataI = z.infer<typeof MetadataSchema>;
export type GenresI = z.infer<typeof GenresResponseSchema>;

export type SortingOrder = 'asc' | 'desc';
