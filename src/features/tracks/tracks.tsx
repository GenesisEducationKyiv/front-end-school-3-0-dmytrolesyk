import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumns } from '@/features/tracks/components/columns';
import { DataTable } from '@/ui/data-table';
import { TrackI } from '@/features/tracks/lib/types';
import { AddEditTrackDialog } from '@/features/tracks/components/add-edit-track-dialog';
import { Button } from '@/ui/button';
import { UploadFileDialog } from '@/features/tracks/components/upload-file-dialog';
import { TrackTableSkeleton } from '@/features/tracks/components/tracks-skeleton';
import { getTracks } from '@/features/tracks/lib/queries';
import { DeleteTracksDialog } from '@/features/tracks/components/delete-tracks-dialog';
import { useTracksPageSearchParamsState } from './hooks/use-search-params-state';
import { DebouncedInput } from '@/ui/debounced-input';

export function TracksPage() {
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<Pick<TrackI, 'id' | 'slug'> | null>(null);

  const [tracksSelected, setTracksSelected] = useState<{ [id: string]: boolean }>({});

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

  const columns = useMemo(
    () =>
      createColumns({
        onEdit: track => {
          setActiveTrack(track);
          setAddEditDialogOpen(true);
        },
        onConfigure: track => {
          setActiveTrack(track);
          setUploadFileDialogOpen(true);
        },
        onDelete: track => {
          setActiveTrack(track);
          setConfirmDeleteDialogOpen(true);
        },
      }),
    [],
  );

  if (isLoading || !data) {
    return <TrackTableSkeleton />;
  }

  const tracksToDelete = Object.keys(tracksSelected);

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
        rowSelection={tracksSelected}
        onRowSelectionChange={setTracksSelected}
      />
      {addEditDialogOpen && (
        <AddEditTrackDialog
          open={addEditDialogOpen}
          trackSlug={activeTrack?.slug}
          setOpen={setAddEditDialogOpen}
          onClose={() => {
            setActiveTrack(null);
          }}
          onFormSubmit={() => {
            setAddEditDialogOpen(false);
            setActiveTrack(null);
            void refetchTracks();
          }}
        />
      )}
      {activeTrack && uploadFileDialogOpen && (
        <UploadFileDialog
          trackSlug={activeTrack.slug}
          open={uploadFileDialogOpen}
          setOpen={setUploadFileDialogOpen}
          onClose={() => {
            setActiveTrack(null);
          }}
          onFormSubmit={() => {
            setUploadFileDialogOpen(false);
            setActiveTrack(null);
            void refetchTracks();
          }}
        />
      )}
      {activeTrack ? (
        <DeleteTracksDialog
          trackId={activeTrack.id}
          open={confirmDeleteDialogOpen}
          setOpen={setConfirmDeleteDialogOpen}
          onConfirm={() => {
            void refetchTracks();
            setConfirmDeleteDialogOpen(false);
          }}
        />
      ) : tracksToDelete.length > 0 ? (
        <DeleteTracksDialog
          tracksToDelete={tracksToDelete}
          open={confirmDeleteDialogOpen}
          setOpen={setConfirmDeleteDialogOpen}
          onConfirm={() => {
            void refetchTracks();
            setConfirmDeleteDialogOpen(false);
            setTracksSelected({});
          }}
        />
      ) : null}
    </div>
  );
}
