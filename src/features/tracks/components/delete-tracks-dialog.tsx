import { useBulkDeleteTracks, useDeleteTrack } from '@/features/tracks/lib/queries';
import { ConfirmDialog, ConfirmDialogProps } from '@/ui/confirm-dialog';
import { toast } from 'sonner';
import { useTracksStore } from '../store/tracks-store';

type DeleteTrackDialogProps = Pick<ConfirmDialogProps, 'onConfirm'>;

export function DeleteTracksDialog({ onConfirm }: DeleteTrackDialogProps) {
  const activeTrack = useTracksStore(store => store.activeTrack);
  const selectedTracks = useTracksStore(store => store.selectedTracks);
  const setSelectedTracks = useTracksStore(store => store.setSelectedTracks);
  const setActiveTrack = useTracksStore(store => store.setActiveTrack);
  const confirmDeleteDialogOpen = useTracksStore(store => store.confirmDeleteDialogOpen);
  const setConfirmDeleteDialogOpen = useTracksStore(store => store.setConfirmDeleteDialogOpen);

  const tracksToDelete = Object.keys(selectedTracks);

  const handlers = {
    onSuccess: () => {
      setConfirmDeleteDialogOpen(false);
      onConfirm();
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  };

  const { mutate: deleteTrack } = useDeleteTrack({
    onSuccess: () => {
      setActiveTrack(null);
      handlers.onSuccess();
      toast.success(<p data-testid="toast-success">Track was deleted successfully</p>);
    },
    onError: handlers.onError,
  });
  const { mutate: bulkDeleteTracks } = useBulkDeleteTracks({
    onSuccess: () => {
      setSelectedTracks({});
      handlers.onSuccess();
      toast.success(<p data-testid="toast-success">Tracks were deleted successfully</p>);
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
