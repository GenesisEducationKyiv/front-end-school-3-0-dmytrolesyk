import { getRouteApi } from '@tanstack/react-router';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { isValidSortValue } from '@/features/tracks/lib/type-guards';

export const useTracksPageSearchParamsState = () => {
  const route = getRouteApi('/tracks');
  const { page, size, sort, order, q } = route.useSearch();
  const navigate = route.useNavigate();

  const paginationState: PaginationState = { pageIndex: page - 1, pageSize: size };
  const sortingState: SortingState = sort ? [{ id: sort, desc: order === 'desc' }] : [];

  const updatePagination = (pagination: PaginationState) => {
    void navigate({
      search: prev => ({
        ...prev,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
    });
  };

  const updateSorting = (sorting: SortingState) => {
    const sort = sorting.at(0);
    if (!sort) {
      void navigate({
        search: prev => ({ ...prev, sort: undefined, order: undefined }),
      });
    } else {
      const newSortValue = isValidSortValue(sort.id) ? sort.id : undefined;
      const newSortOrder = sort.desc ? 'desc' : 'asc';
      void navigate({
        search: prev => ({ ...prev, sort: newSortValue, order: newSortOrder }),
      });
    }
  };

  const updateSearch = (searchString: string) => {
    void navigate({
      search: prev => {
        return { ...prev, q: searchString };
      },
    });
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
