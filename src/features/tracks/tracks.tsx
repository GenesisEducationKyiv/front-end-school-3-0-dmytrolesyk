import { lazy, Suspense } from 'react';
import { columns } from '@/features/tracks/components/columns';
import { DataTable } from '@/ui/data-table';
import { Button } from '@/ui/button';
import { DebouncedInput } from '@/ui/debounced-input';
import { TrackTableSkeleton } from '@/features/tracks/components/tracks-skeleton';
import { useTracksStore } from '@/features/tracks/store/tracks-store';
import { useTracksPageSearchParamsState } from '@/features/tracks/hooks/use-search-params-state';
import { createUpdaterHandler } from '@/lib/utils';
import { useFetchTracks } from '@/features/tracks/lib/queriesV2';
import { CurrentTrack } from '@/features/tracks/components/current-track';
import { InlineLoader } from '@/ui/loader';

const DeleteTracksDialog = lazy(() => import('@/features/tracks/components/delete-tracks-dialog'));
const AddEditTrackDialog = lazy(() => import('@/features/tracks/components/add-edit-track-dialog'));
const UploadFileDialog = lazy(() => import('@/features/tracks/components/upload-file-dialog'));

export function TracksPage() {
  const {
    selectedTracks,
    setSelectedTracks,
    setAddEditDialogOpen,
    setConfirmDeleteDialogOpen,
    addEditDialogOpen,
    confirmDeleteDialogOpen,
    uploadFileDialogOpen,
  } = useTracksStore(store => ({
    selectedTracks: store.selectedTracks,
    setSelectedTracks: store.setSelectedTracks,
    setAddEditDialogOpen: store.setAddEditDialogOpen,
    setConfirmDeleteDialogOpen: store.setConfirmDeleteDialogOpen,
    addEditDialogOpen: store.addEditDialogOpen,
    confirmDeleteDialogOpen: store.confirmDeleteDialogOpen,
    uploadFileDialogOpen: store.uploadFileDialogOpen,
  }));

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
  } = useFetchTracks({
    page,
    limit: size,
    sort,
    order,
    search,
  });

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
      <CurrentTrack />
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
        onPaginationChange={createUpdaterHandler(paginationState, updatePagination)}
        onSortingChange={createUpdaterHandler(sortingState, updateSorting)}
        columns={columns}
        data={data.data}
        totalItems={data.meta?.total ?? 0}
        rowSelection={selectedTracks}
        onRowSelectionChange={createUpdaterHandler(selectedTracks, setSelectedTracks)}
      />
      {addEditDialogOpen && (
        <Suspense fallback={<InlineLoader size="lg" />}>
          <AddEditTrackDialog
            onFormSubmit={() => {
              void refetchTracks();
            }}
          />
        </Suspense>
      )}
      {uploadFileDialogOpen && (
        <Suspense fallback={<InlineLoader size="lg" />}>
          <UploadFileDialog
            onFormSubmit={() => {
              void refetchTracks();
            }}
          />
        </Suspense>
      )}
      {confirmDeleteDialogOpen && (
        <Suspense fallback={<InlineLoader size="lg" />}>
          <DeleteTracksDialog
            onConfirm={() => {
              void refetchTracks();
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
