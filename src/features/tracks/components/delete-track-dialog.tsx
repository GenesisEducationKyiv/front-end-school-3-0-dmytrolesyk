// ConfirmDialogProps

import { useDeleteTrack } from '@/features/tracks/lib/queries';
import { ConfirmDialog, ConfirmDialogProps } from '@/ui/confirm-dialog';
import { toast } from 'sonner';

interface DeleteTrackDialogProps
  extends Pick<ConfirmDialogProps, 'open' | 'setOpen' | 'onConfirm'> {
  trackId: string;
}

export function DeleteTrackDialog({ trackId, open, setOpen, onConfirm }: DeleteTrackDialogProps) {
  const { mutate: deleteTrack } = useDeleteTrack({
    onSuccess: () => {
      toast.success(<p data-testid="toast-success">Track was deleted successfully</p>);
      onConfirm();
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  });

  const onConfirmDeleteTrack = () => {
    deleteTrack(trackId);
  };

  return (
    <ConfirmDialog
      open={open}
      setOpen={setOpen}
      message="Track(s) will be deleted permanently"
      onConfirm={onConfirmDeleteTrack}
    />
  );
}
