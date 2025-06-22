import { useBulkDeleteTracks, useDeleteTrack } from '@/features/tracks/lib/queries';
import { ConfirmDialog, ConfirmDialogProps } from '@/ui/confirm-dialog';
import { toast } from 'sonner';

type BaseDeleteTrackDialogProps = Pick<ConfirmDialogProps, 'open' | 'setOpen' | 'onConfirm'>;

type DeleteTrackDialogProps = BaseDeleteTrackDialogProps &
  (
    | {
        trackId: string;
        tracksToDelete?: never;
      }
    | {
        trackId?: never;
        tracksToDelete: string[];
      }
  );

export function DeleteTracksDialog(props: DeleteTrackDialogProps) {
  const { open, setOpen, onConfirm } = props;
  const handlers = {
    onSuccess: () => {
      toast.success(<p data-testid="toast-success">Track was deleted successfully</p>);
      onConfirm();
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  };

  const { mutate: deleteTrack } = useDeleteTrack(handlers);
  const { mutate: bulkDeleteTracks } = useBulkDeleteTracks(handlers);

  const onConfirmDeleteTrack = () => {
    if ('trackId' in props) {
      deleteTrack(props.trackId);
    } else {
      bulkDeleteTracks(props.tracksToDelete);
    }
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
