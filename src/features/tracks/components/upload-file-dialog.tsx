import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { useFetchTrack, useUploadFile, useRemoveFile } from '@/features/tracks/lib/queriesV2';
import { Button } from '@/ui/button';
import { AudioFileUploadInput } from '@/ui/audio-upload';
import { Spinner } from '@/ui/spinner';
import { AudioPlayer } from '@/ui/audioplayer';
import { ConfirmDialog } from '@/ui/confirm-dialog';
import { useTracksStore } from '../store/tracks-store';
import { showToastError, showToastSuccess } from '@/lib/show-toast-message';

interface UploadFileDialogProps {
  onFormSubmit: () => void;
}

export default function UploadFileDialog({ onFormSubmit }: UploadFileDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { activeTrack, setActiveTrack, uploadFileDialogOpen, setUploadFileDialogOpen } =
    useTracksStore(state => ({
      activeTrack: state.activeTrack,
      setActiveTrack: state.setActiveTrack,
      uploadFileDialogOpen: state.uploadFileDialogOpen,
      setUploadFileDialogOpen: state.setUploadFileDialogOpen,
    }));

  const { data: trackToEdit, isLoading: isGetTrackLoading } = useFetchTrack({
    slug: activeTrack?.slug ?? '',
    enabled: Boolean(activeTrack?.slug),
  });

  const onFileProcessed = () => {
    setUploadFileDialogOpen(false);
    setActiveTrack(null);
    onFormSubmit();
    showToastSuccess('File was successfully uploaded');
  };

  const { mutate: upload, isPending: isUploading } = useUploadFile({
    onSuccess: () => {
      onFileProcessed();
      showToastSuccess('File was successfully uploaded');
    },
    onError: ({ message }: { message: string }) => {
      showToastError(message);
    },
  });

  const { mutate: remove, isPending: isRemoving } = useRemoveFile({
    onSuccess: () => {
      onFileProcessed();
      showToastSuccess('File was successfully removed');
    },
    onError: ({ message }: { message: string }) => {
      showToastError(message);
    },
  });

  const uploadFile = async () => {
    if (trackToEdit && file) {
      const arrayBuffer = await file.arrayBuffer();
      const content = new Uint8Array(arrayBuffer);
      upload({
        id: trackToEdit.id,
        fileName: file.name,
        fileType: file.type,
        content,
      });
    }
  };

  const removeFile = () => {
    if (trackToEdit) {
      remove({ id: trackToEdit.id });
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
                  loading="lazy"
                  decoding="async"
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
                  void uploadFile();
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
