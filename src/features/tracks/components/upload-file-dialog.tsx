import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { getTrack, useRemoveFile, useUploadFile } from '@/features/tracks/lib/queries';
import { Button } from '@/ui/button';
import { AudioFileUploadInput } from '@/ui/audio-upload';
import { Spinner } from '@/ui/spinner';
import { AudioPlayer } from '@/ui/audioplayer';
import { ConfirmDialog } from '@/ui/confirm-dialog';
import { useTracksStore } from '../store/tracks-store';

interface UploadFileDialogProps {
  onFormSubmit: () => void;
}

export function UploadFileDialog({ onFormSubmit }: UploadFileDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const activeTrack = useTracksStore(store => store.activeTrack);
  const setActiveTrack = useTracksStore(store => store.setActiveTrack);
  const uploadFileDialogOpen = useTracksStore(store => store.uploadFileDialogOpen);
  const setUploadFileDialogOpen = useTracksStore(store => store.setUploadFileDialogOpen);

  const { data: trackToEdit, isLoading: isGetTrackLoading } = useQuery({
    ...getTrack(activeTrack?.slug ?? ''),
    enabled: Boolean(activeTrack?.slug),
  });

  const onFileProcessed = () => {
    setUploadFileDialogOpen(false);
    setActiveTrack(null);
    onFormSubmit();
    toast.success(<p data-testid="toast-success">File was successfully uploaded</p>);
  };

  const { mutate: upload, isPending: isUploading } = useUploadFile({
    onSuccess: () => {
      onFileProcessed();
      toast.success(<p data-testid="toast-success">File was successfully uploaded</p>);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  });

  const { mutate: remove, isPending: isRemoving } = useRemoveFile({
    onSuccess: () => {
      onFileProcessed();
      toast.success(<p data-testid="toast-success">File was successfully removed</p>);
    },
    onError: ({ message }: { message: string }) => {
      toast.error(<p data-testid="toast-error">{message}</p>);
    },
  });

  const uploadFile = () => {
    if (trackToEdit && file) {
      upload({ trackId: trackToEdit.id, file });
    }
  };

  const removeFile = () => {
    if (trackToEdit) {
      remove(trackToEdit.id);
    }
  };

  const onDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen && file) {
      setConfirmDialogOpen(true);
    } else {
      if (!newOpen) {
        setActiveTrack(null);
      }
      setUploadFileDialogOpen(newOpen);
    }
  };

  const isProcessing = isUploading || isRemoving;

  return (
    <Dialog open={uploadFileDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <Spinner spinning={isGetTrackLoading || isProcessing}>
          <DialogHeader>
            <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Manage audiofile for the track
            </DialogTitle>
          </DialogHeader>
          <dl className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-lg">Title</dt>
              <dd className="text-lg font-semibold col-span-3">{trackToEdit?.title}</dd>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-lg">Artist</dt>
              <dd className="text-lg font-semibold col-span-3">{trackToEdit?.artist}</dd>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-lg">Album</dt>
              <dd className="text-lg font-semibold col-span-3">{trackToEdit?.album}</dd>
            </div>
            <div>
              {trackToEdit?.coverImage && (
                <img
                  src={trackToEdit.coverImage}
                  alt="Cover preview"
                  className="mt-2 max-h-48 rounded col-span-3"
                />
              )}
            </div>
          </dl>
          {trackToEdit?.audioFile ? (
            <div className="py-4">
              <AudioPlayer trackId={trackToEdit.id} fileName={trackToEdit.audioFile} />
            </div>
          ) : (
            <AudioFileUploadInput
              onChange={file => {
                setFile(file);
              }}
            />
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (trackToEdit?.audioFile) {
                  setConfirmDialogOpen(true);
                } else if (file) {
                  uploadFile();
                }
              }}
              disabled={isGetTrackLoading || isProcessing || (!file && !trackToEdit?.audioFile)}
              type="submit"
            >
              {trackToEdit?.audioFile ? 'Delete file' : 'Upload file'}
            </Button>
          </DialogFooter>
        </Spinner>
      </DialogContent>
      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          removeFile();
          setUploadFileDialogOpen(false);
        }}
        message="Audio file will be deleted (you'll be able to upload a new one though)"
      />
    </Dialog>
  );
}
