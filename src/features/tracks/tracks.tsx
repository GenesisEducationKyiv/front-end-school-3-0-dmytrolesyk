import { useQuery } from '@tanstack/react-query';
import { columns } from '@/features/tracks/components/columns';
import { DataTable } from '@/ui/data-table';
import { Button } from '@/ui/button';
import { DebouncedInput } from '@/ui/debounced-input';
import { AddEditTrackDialog } from '@/features/tracks/components/add-edit-track-dialog';
import { UploadFileDialog } from '@/features/tracks/components/upload-file-dialog';
import { TrackTableSkeleton } from '@/features/tracks/components/tracks-skeleton';
import { getTracks } from '@/features/tracks/lib/queries';
import { DeleteTracksDialog } from '@/features/tracks/components/delete-tracks-dialog';
import { useTracksStore } from '@/features/tracks/store/tracks-store';
import { useTracksPageSearchParamsState } from '@/features/tracks/hooks/use-search-params-state';

export function TracksPage() {
  const selectedTracks = useTracksStore(store => store.selectedTracks);
  const setSelectedTracks = useTracksStore(store => store.setSelectedTracks);
  const setAddEditDialogOpen = useTracksStore(store => store.setAddEditDialogOpen);
  const setConfirmDeleteDialogOpen = useTracksStore(store => store.setConfirmDeleteDialogOpen);

  const {
    page,
    size,
    sort,
    order,
    search,
    paginationState,
    sortingState,
    updatePagination,
    updateSorting,
    updateSearch,
  } = useTracksPageSearchParamsState();

  const {
    data,
    isLoading,
    refetch: refetchTracks,
  } = useQuery(getTracks({ page, limit: size, sort, order, search }));

  if (isLoading || !data) {
    return <TrackTableSkeleton />;
  }

  const tracksToDelete = Object.keys(selectedTracks);

  return (
    <div className="container mx-auto py-10">
      <h1
        data-testid="tracks-header"
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-2"
      >
        Music Management App
      </h1>
      <div className="flex items-center py-4 justify-between">
        <DebouncedInput
          wait={500}
          data-testid="search-input"
          value={search}
          placeholder="Search tracks..."
          onChange={event => {
            updateSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <div className="flex gap-x-2">
          <Button
            onClick={() => {
              setAddEditDialogOpen(true);
            }}
            className="cursor-pointer"
            variant="outline"
            data-testid="create-track-button"
          >
            Add Track
          </Button>
          {tracksToDelete.length > 0 ? (
            <Button
              onClick={() => {
                setConfirmDeleteDialogOpen(true);
              }}
              className="cursor-pointer"
              variant="outline"
              data-testid="create-track-button"
            >
              Delete Selected Tracks
            </Button>
          ) : null}
        </div>
      </div>
      <DataTable
        pagination={paginationState}
        sorting={sortingState}
        onPaginationChange={updaterOrValue => {
          const newPagination =
            typeof updaterOrValue === 'function' ? updaterOrValue(paginationState) : updaterOrValue;
          updatePagination(newPagination);
        }}
        onSortingChange={updaterOrValue => {
          const newSortingState =
            typeof updaterOrValue === 'function' ? updaterOrValue(sortingState) : updaterOrValue;
          updateSorting(newSortingState);
        }}
        columns={columns}
        data={data.data}
        totalItems={data.meta.total}
        rowSelection={selectedTracks}
        onRowSelectionChange={updaterOrValue => {
          const newSelection =
            typeof updaterOrValue === 'function' ? updaterOrValue(selectedTracks) : updaterOrValue;
          setSelectedTracks(newSelection);
        }}
      />
      <AddEditTrackDialog
        onFormSubmit={() => {
          void refetchTracks();
        }}
      />
      <UploadFileDialog
        onFormSubmit={() => {
          void refetchTracks();
        }}
      />
      <DeleteTracksDialog
        onConfirm={() => {
          void refetchTracks();
        }}
      />
    </div>
  );
}
