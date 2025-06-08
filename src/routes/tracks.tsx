import { createFileRoute } from '@tanstack/react-router';
import { SortingOrder } from '@/features/tracks/lib/types';
import { TrackTableSkeleton } from '@/features/tracks/components/tracks-skeleton';
import { Tracks } from '@/features/tracks/tracks';
import { toast } from 'sonner';
import { getRouteApi } from '@tanstack/react-router';
import { PaginationState, SortingState } from '@tanstack/react-table';

export type SearchParamsType = {
  page: number;
  size: number;
  sort?: string;
  order?: SortingOrder;
  q?: string;
};

export const Route = createFileRoute('/tracks')({
  component: TracksPage,
  pendingComponent: TrackTableSkeleton,
  validateSearch: search => {
    const { page = 1, size = 10, sort, order, q } = search;
    return {
      page,
      size,
      sort,
      order,
      q,
    } as SearchParamsType;
  },
});

const onNavigationError = () => {
  toast.error(<p data-testid="toast-error">Error has occurred, please try again</p>);
};

const useQueryParamsState = () => {
  const { page, size, sort, order, q } = Route.useSearch();
  const routeApi = getRouteApi('/tracks');
  const navigate = routeApi.useNavigate();

  const paginationState = { pageIndex: page - 1, pageSize: size };
  const sortingState = sort ? [{ id: sort, desc: order === 'desc' }] : [];

  const updatePagination = (pagination: PaginationState) => {
    navigate({
      search: prev => ({
        ...prev,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
    }).catch(onNavigationError);
  };

  const updateSorting = (sorting: SortingState) => {
    const sort = sorting.at(0);
    const newSortParams = (
      !sort
        ? { sort: undefined, order: undefined }
        : { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }
    ) as Pick<SearchParamsType, 'sort' | 'order'>;
    navigate({
      search: prev => ({ ...prev, ...newSortParams }),
    }).catch(onNavigationError);
  };

  const updateSearch = (searchString: string) => {
    navigate({
      search: prev => ({ ...prev, q: searchString }),
    }).catch(onNavigationError);
  };

  return {
    page,
    size,
    sort,
    order,
    search: q,
    paginationState,
    updatePagination,
    sortingState,
    updateSorting,
    updateSearch,
  };
};

function TracksPage() {
  const queryParamsState = useQueryParamsState();
  return <Tracks {...queryParamsState} />;
}
