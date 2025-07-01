import { useState } from 'react';
import { z } from 'zod';
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
import { ConfirmDialog } from '@/ui/confirm-dialog';
import { TrackSchema } from '@/features/tracks/lib/schemas';
import { GenresTagInput } from './genres-input/genres-input';
import { FieldError } from '@/ui/field-error';
import { useTracksStore } from '@/features/tracks/store/tracks-store';
import { showToastError, showToastSuccess } from '@/lib/show-toast-message';
import {
  useFetchGenres,
  useFetchTrack,
  useAddTrack,
  useUpdateTrack,
} from '@/features/tracks/lib/queriesV2';
import { omitUndefined } from '@/lib/utils';

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
  onFormSubmit: () => void;
}

const onError = ({ message }: { message: string }) => {
  showToastError(message);
};

export function AddEditTrackDialog({ onFormSubmit }: AddEditTrackDialogProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { activeTrack, setActiveTrack, addEditDialogOpen, setAddEditDialogOpen } = useTracksStore(
    state => ({
      activeTrack: state.activeTrack,
      setActiveTrack: state.setActiveTrack,
      addEditDialogOpen: state.addEditDialogOpen,
      setAddEditDialogOpen: state.setAddEditDialogOpen,
    }),
  );

  const { data: genres = [], isLoading: isGetGenresLoading } = useFetchGenres();

  const { data: trackToEdit, isLoading: isGetTrackLoading } = useFetchTrack({
    slug: activeTrack?.slug ?? '',
    enabled: Boolean(activeTrack?.slug),
  });

  const editMode = Boolean(trackToEdit);

  const onSuccess = () => {
    showToastSuccess(`Track was successfully ${editMode ? 'edited' : 'added'}`);
    form.reset(defaultTrack);
    setAddEditDialogOpen(false);
    setActiveTrack(null);
    onFormSubmit();
  };

  const { mutate: addTrack, isPending: isAddTrackPending } = useAddTrack({
    onSuccess,
    onError,
  });

  const { mutate: updateTrack, isPending: isEditTrackPending } = useUpdateTrack({
    onSuccess,
    onError,
  });

  const form = useForm({
    defaultValues: trackToEdit ?? defaultTrack,
    validators: {
      onChange: TrackFormSchema,
    },
    onSubmit: ({ value: newTrack }) => {
      const finalTrack = omitUndefined(newTrack);
      if (trackToEdit) {
        updateTrack({ id: trackToEdit.id, ...finalTrack });
      } else {
        addTrack(finalTrack);
      }
    },
  });

  const onDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen && form.state.isDirty) {
      setConfirmDialogOpen(true);
    } else {
      if (!newOpen) {
        form.reset(defaultTrack);
        setActiveTrack(null);
      }
      setAddEditDialogOpen(newOpen);
    }
  };

  const isLoading =
    isAddTrackPending || isGetTrackLoading || isEditTrackPending || isGetGenresLoading;

  return (
    <Dialog open={addEditDialogOpen} onOpenChange={onDialogOpenChange}>
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
                        data-testid="input-title"
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
                        data-testid="input-artist"
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
                        data-testid="input-album"
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
                          data-testid="input-cover-image"
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
                data-testid="submit-button"
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
          setAddEditDialogOpen(false);
        }}
        message="All the typed values will be reset"
      />
    </Dialog>
  );
}
