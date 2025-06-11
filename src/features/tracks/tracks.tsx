import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DebounceInput } from 'react-debounce-input';
import { createColumns } from '@/features/tracks/components/columns';
import { DataTable } from '@/ui/data-table';
import { TrackI } from '@/features/tracks/lib/types';
import { Input } from '@/ui/input';
import { AddEditTrackDialog } from '@/features/tracks/components/add-edit-track-dialog';
import { Button } from '@/ui/button';
import { UploadFileDialog } from '@/features/tracks/components/upload-file-dialog';
import { TrackTableSkeleton } from '@/features/tracks/components/tracks-skeleton';
import { getTracks } from '@/features/tracks/lib/queries';
import { DeleteTrackDialog } from '@/features/tracks/components/delete-track-dialog';
import { useSearchParamsState } from './hooks/use-search-params-state';

export function TracksPage() {
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Pick<TrackI, 'id' | 'slug'> | null>(null);

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
  } = useSearchParamsState();

  const {
    data,
    isLoading,
    refetch: refetchTracks,
  } = useQuery(getTracks({ page, limit: size, sort, order, search }));

  const columns = useMemo(
    () =>
      createColumns({
        onEdit: track => {
          setSelectedTrack(track);
          setAddEditDialogOpen(true);
        },
        onConfigure: track => {
          setSelectedTrack(track);
          setUploadFileDialogOpen(true);
        },
        onDelete: track => {
          setSelectedTrack(track);
          setConfirmDeleteDialogOpen(true);
        },
      }),
    [],
  );

  if (isLoading || !data) {
    return <TrackTableSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1
        data-testid="tracks-header"
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mb-2"
      >
        Music Management App
      </h1>
      <div className="flex items-center py-4 justify-between">
        <DebounceInput
          data-testid="search-input"
          debounceTimeout={300}
          element={Input}
          value={search}
          placeholder="Search tracks..."
          onChange={event => {
            updateSearch(event.target.value);
          }}
          className="max-w-sm"
        />
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
      />
      {selectedTrack && addEditDialogOpen && (
        <AddEditTrackDialog
          open={addEditDialogOpen}
          trackSlug={selectedTrack.slug}
          setOpen={setAddEditDialogOpen}
          onClose={() => {
            setSelectedTrack(null);
          }}
          onFormSubmit={() => {
            setAddEditDialogOpen(false);
            setSelectedTrack(null);
            void refetchTracks();
          }}
        />
      )}
      {selectedTrack && uploadFileDialogOpen && (
        <UploadFileDialog
          trackSlug={selectedTrack.slug}
          open={uploadFileDialogOpen}
          setOpen={setUploadFileDialogOpen}
          onFormSubmit={() => {
            setUploadFileDialogOpen(false);
            setSelectedTrack(null);
            void refetchTracks();
          }}
        />
      )}
      {selectedTrack && confirmDeleteDialogOpen && (
        <DeleteTrackDialog
          trackId={selectedTrack.id}
          open={confirmDeleteDialogOpen}
          setOpen={setConfirmDeleteDialogOpen}
          onConfirm={() => {
            void refetchTracks();
            setConfirmDeleteDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
