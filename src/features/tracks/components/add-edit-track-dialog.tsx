import { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Spinner } from '@/ui/spinner';
import { getGenres, useAddTrack, getTrack, useEditTrack } from '@/features/tracks/lib/queries';
import { ConfirmDialog } from '../../../ui/confirm-dialog';
import { TrackSchema } from '@/features/tracks/lib/schemas';
import { GenresTagInput } from './genres-input';
import { FieldError } from '@/ui/field-error';

const TrackFormSchema = TrackSchema.pick({
  title: true,
  artist: true,
  album: true,
  coverImage: true,
  genres: true,
});

type TrackForm = z.infer<typeof TrackFormSchema>;

const defaultTrack: TrackForm = {
  title: '',
  artist: '',
  album: '',
  coverImage: undefined,
  genres: [],
};

interface AddEditTrackDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: () => void;
  onClose: () => void;
  trackSlug: string | undefined;
}

const onError = ({ message }: { message: string }) => {
  toast.error(<p data-testid="toast-error">{message}</p>);
};

export function AddEditTrackDialog({
  open,
  setOpen,
  onClose,
  onFormSubmit,
  trackSlug,
}: AddEditTrackDialogProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { data: genres = [], isLoading: isGetGenresLoading } = useQuery(getGenres());
  const { data: trackToEdit, isLoading: isGetTrackLoading } = useQuery({
    ...getTrack(trackSlug ?? ''),
    enabled: Boolean(trackSlug),
  });

  const editMode = Boolean(trackToEdit);

  const { mutate: addTrack, isPending: isAddTrackPending } = useAddTrack({
    onSuccess: () => {
      toast.success(<p data-testid="toast-success">Track was successfully added</p>);
      form.reset(defaultTrack);
      onFormSubmit();
    },
    onError,
  });

  const { mutate: editTrack, isPending: isEditTrackPending } = useEditTrack({
    onSuccess: () => {
      toast.success(<p data-testid="toast-success">Track was successfully edited</p>);
      form.reset(defaultTrack);
      onFormSubmit();
    },
    onError,
  });

  const form = useForm({
    defaultValues: trackToEdit ?? defaultTrack,
    validators: {
      onChange: TrackFormSchema,
    },
    onSubmit: ({ value: newTrack }) => {
      if (trackToEdit) {
        editTrack({ id: trackToEdit.id, ...newTrack });
      } else {
        addTrack(newTrack);
      }
    },
  });

  const isLoading =
    isAddTrackPending || isGetTrackLoading || isEditTrackPending || isGetGenresLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={newOpen => {
        if (!newOpen && form.state.isDirty) {
          setConfirmDialogOpen(true);
        } else {
          if (!newOpen) {
            form.reset(defaultTrack);
            onClose();
          }
          setOpen(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <Spinner spinning={isLoading}>
          <DialogHeader className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <DialogTitle>{editMode ? 'Edit' : 'Add'} Track</DialogTitle>
            <DialogDescription>
              Fill in all the fields to {editMode ? 'edit' : 'add'} the track
            </DialogDescription>
          </DialogHeader>
          <form
            data-testid="track-form"
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="title">
                  {field => (
                    <>
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        data-test-id="input-title"
                        onBlur={field.handleBlur}
                        onChange={e => {
                          field.handleChange(e.target.value);
                        }}
                        value={field.state.value}
                        className="col-span-3"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.map((error, i) => (
                          <FieldError
                            dataTestId="error-title"
                            key={i}
                            className="col-span-4"
                            error={error?.message}
                          />
                        ))}
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="artist">
                  {field => (
                    <>
                      <Label htmlFor="artist" className="text-right">
                        Artist
                      </Label>
                      <Input
                        data-test-id="input-artist"
                        onChange={e => {
                          field.handleChange(e.target.value);
                        }}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        id="artist"
                        className="col-span-3"
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.map((error, i) => (
                          <FieldError
                            dataTestId="error-artist"
                            key={i}
                            className="col-span-4"
                            error={error?.message}
                          />
                        ))}
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="album">
                  {field => (
                    <>
                      <Label htmlFor="album" className="text-right">
                        Album
                      </Label>
                      <Input
                        data-test-id="input-album"
                        onChange={e => {
                          field.handleChange(e.target.value);
                        }}
                        value={field.state.value}
                        id="album"
                        className="col-span-3"
                      />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="coverImage">
                  {field => (
                    <>
                      <Label htmlFor="coverImage" className="text-right">
                        Cover Image
                      </Label>
                      <div className="col-span-3">
                        <Input
                          data-test-id="input-cover-image"
                          onChange={e => {
                            field.handleChange(e.target.value);
                          }}
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          id="coverImage"
                        />
                        {field.state.value && field.state.meta.errors.length === 0 ? (
                          <img
                            src={field.state.value}
                            alt="Cover preview"
                            className="mt-2 max-h-32 rounded col-span-3"
                          />
                        ) : null}
                      </div>
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.map((error, i) => (
                          <FieldError
                            dataTestId="error-title"
                            key={i}
                            className="col-span-4"
                            error={error?.message}
                          />
                        ))}
                    </>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <form.Field name="genres">
                  {field => (
                    <>
                      <Label htmlFor="genres" className="text-right">
                        Genres
                      </Label>
                      <div className="col-span-3">
                        <GenresTagInput
                          value={field.state.value}
                          genres={genres}
                          onChange={values => {
                            field.handleChange(values);
                          }}
                        />
                      </div>
                    </>
                  )}
                </form.Field>
              </div>
            </div>
            <DialogFooter>
              <Button
                data-test-id="submit-button"
                aria-disabled={isLoading}
                disabled={isLoading}
                type="submit"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Spinner>
      </DialogContent>
      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={() => {
          form.reset(defaultTrack);
          setOpen(false);
        }}
        message="All the typed values will be reset"
      />
    </Dialog>
  );
}
