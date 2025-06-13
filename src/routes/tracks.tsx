import { createFileRoute } from '@tanstack/react-router';
import { TrackTableSkeleton } from '@/features/tracks/components/tracks-skeleton';
import { TracksPage } from '@/features/tracks/tracks';
import { TracksSearchParams } from '@/features/tracks/lib/types';
import { parseSearchParams } from '@/features/tracks/lib/utils';

export const Route = createFileRoute('/tracks')({
  component: TracksPage,
  pendingComponent: TrackTableSkeleton,
  validateSearch: (search): TracksSearchParams => parseSearchParams(search),
});
