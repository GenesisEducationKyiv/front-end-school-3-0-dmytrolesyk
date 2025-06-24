import { FC } from 'react';
import { useTracksStore } from '@/features/tracks/store/tracks-store';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Pencil, Settings, Trash2 } from 'lucide-react';
import { TrackI } from '@/features/tracks/lib/types';

interface TracksTableActionsProps {
  trackData: Pick<TrackI, 'id' | 'slug'> & { isSelected: boolean };
  onCheckedChange: (event: unknown) => void;
}

export const TracksTableActions: FC<TracksTableActionsProps> = ({ trackData, onCheckedChange }) => {
  const setActiveTrack = useTracksStore(store => store.setActiveTrack);
  const setAddEditDialogOpen = useTracksStore(store => store.setAddEditDialogOpen);
  const setUploadFileDialogOpen = useTracksStore(store => store.setUploadFileDialogOpen);
  const setConfirmDeleteDialogOpen = useTracksStore(store => store.setConfirmDeleteDialogOpen);

  return (
    <div className="flex items-baseline">
      <Checkbox
        className="cursor-pointer mx-0.5"
        checked={trackData.isSelected}
        onCheckedChange={onCheckedChange}
      />
      <Button
        data-testid={`edit-track-${trackData.id}`}
        onClick={() => {
          setActiveTrack(trackData);
          setAddEditDialogOpen(true);
        }}
        variant="ghost"
        className="cursor-pointer"
        disabled={trackData.isSelected}
      >
        <Pencil className="ml-2 h-4 w-4" />
      </Button>
      <Button
        data-testid={`upload-track-${trackData.id}`}
        onClick={() => {
          setActiveTrack(trackData);
          setUploadFileDialogOpen(true);
        }}
        variant="ghost"
        className="cursor-pointer"
        disabled={trackData.isSelected}
      >
        <Settings />
      </Button>
      <Button
        data-testid={`delete-track-${trackData.id}`}
        onClick={() => {
          setActiveTrack(trackData);
          setConfirmDeleteDialogOpen(true);
        }}
        variant="ghost"
        className="cursor-pointer"
        disabled={trackData.isSelected}
      >
        <Trash2 />
      </Button>
    </div>
  );
};
