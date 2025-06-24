import { useBulkDeleteTracks, useDeleteTrack } from '@/features/tracks/lib/queries';
import { ConfirmDialog, ConfirmDialogProps } from '@/ui/confirm-dialog';
import { toast } from 'sonner';
import { useTracksStore } from '../store/tracks-store';

type DeleteTrackDialogProps = Pick<ConfirmDialogProps, 'onConfirm'>;

export function DeleteTracksDialog({ onConfirm }: DeleteTrackDialogProps) {
  const activeTrack = useTracksStore(store => store.activeTrack);
  const selectedTracks = useTracksStore(store => store.selectedTracks);
  const setActiveTrack = useTracksStore(store => store.setActiveTrack);
  const confirmDeleteDialogOpen = useTracksStore(store => store.confirmDeleteDialogOpen);
  const setConfirmDeleteDialogOpen = useTracksStore(store => store.setConfirmDeleteDialogOpen);

  const tracksToDelete = Object.keys(selectedTracks);

  const handlers = {
    onSuccess: () => {
      setActiveTrack(null);
      setConfirmDeleteDialogOpen(false);
      onConfirm();
      toast.success(<p data-testid="toast-success">Track(s) were deleted successfully</p>);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  };

  const { mutate: deleteTrack } = useDeleteTrack(handlers);
  const { mutate: bulkDeleteTracks } = useBulkDeleteTracks(handlers);

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
