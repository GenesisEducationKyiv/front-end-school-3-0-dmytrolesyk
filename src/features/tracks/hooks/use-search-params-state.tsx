import { toast } from 'sonner';
import { getRouteApi } from '@tanstack/react-router';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { TracksSearchParams } from '../lib/types';

const onNavigationError = () => {
  toast.error(<p data-testid="toast-error">Error has occurred, please try again</p>);
};

export const useSearchParamsState = () => {
  const route = getRouteApi('/tracks');
  const { page, size, sort, order, q } = route.useSearch();
  const navigate = route.useNavigate();

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
    ) as Pick<TracksSearchParams, 'sort' | 'order'>;
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
