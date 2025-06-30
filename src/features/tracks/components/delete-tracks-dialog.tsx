import { useBulkDeleteTracks, useDeleteTrack } from '@/features/tracks/lib/queries';
import { ConfirmDialog, ConfirmDialogProps } from '@/ui/confirm-dialog';
import { useTracksStore } from '../store/tracks-store';
import { showToastError, showToastSuccess } from '@/lib/show-toast-message';

type DeleteTrackDialogProps = Pick<ConfirmDialogProps, 'onConfirm'>;

export function DeleteTracksDialog({ onConfirm }: DeleteTrackDialogProps) {
  const {
    activeTrack,
    selectedTracks,
    setSelectedTracks,
    setActiveTrack,
    confirmDeleteDialogOpen,
    setConfirmDeleteDialogOpen,
  } = useTracksStore(state => ({
    activeTrack: state.activeTrack,
    selectedTracks: state.selectedTracks,
    setSelectedTracks: state.setSelectedTracks,
    setActiveTrack: state.setActiveTrack,
    confirmDeleteDialogOpen: state.confirmDeleteDialogOpen,
    setConfirmDeleteDialogOpen: state.setConfirmDeleteDialogOpen,
  }));

  const tracksToDelete = Object.keys(selectedTracks ?? {});

  const handlers = {
    onSuccess: () => {
      setConfirmDeleteDialogOpen(false);
      onConfirm();
    },
    onError: ({ message }: { message: string }) => {
      showToastError(message);
    },
  };

  const { mutate: deleteTrack } = useDeleteTrack({
    onSuccess: () => {
      setActiveTrack(null);
      handlers.onSuccess();
      showToastSuccess('Track was deleted successfully');
    },
    onError: handlers.onError,
  });
  const { mutate: bulkDeleteTracks } = useBulkDeleteTracks({
    onSuccess: () => {
      setSelectedTracks({});
      handlers.onSuccess();
      showToastSuccess('Tracks were deleted successfully');
    },
    onError: handlers.onError,
  });

  const onConfirmDeleteTrack = () => {
    if (activeTrack) {
      deleteTrack(activeTrack.id);
    } else if (tracksToDelete.length > 0) {
      bulkDeleteTracks(tracksToDelete);
    }
  };

  return (
    <ConfirmDialog
      open={confirmDeleteDialogOpen}
      setOpen={setConfirmDeleteDialogOpen}
      message="Track(s) will be deleted permanently"
      onConfirm={onConfirmDeleteTrack}
    />
  );
}
