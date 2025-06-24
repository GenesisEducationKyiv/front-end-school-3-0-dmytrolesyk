import { create } from 'zustand';
import { TrackI } from '@/features/tracks/lib/types';

type ActiveTrack = Pick<TrackI, 'id' | 'slug'> | null;

interface TracksStore {
  addEditDialogOpen: boolean;
  uploadFileDialogOpen: boolean;
  confirmDeleteDialogOpen: boolean;
  activeTrack: ActiveTrack;
  selectedTracks: Record<string, boolean>;
  setActiveTrack: (activeTrack: ActiveTrack) => void;
  setSelectedTracks: (selectedTracks: Record<string, boolean>) => void;
  setAddEditDialogOpen: (addEditDialogOpen: boolean) => void;
  setUploadFileDialogOpen: (uploadFileDialogOpen: boolean) => void;
  setConfirmDeleteDialogOpen: (confirmDeleteDialogOpen: boolean) => void;
}

export const useTracksStore = create<TracksStore>(set => ({
  activeTrack: null,
  selectedTracks: {},
  addEditDialogOpen: false,
  uploadFileDialogOpen: false,
  confirmDeleteDialogOpen: false,
  setAddEditDialogOpen: (addEditDialogOpen: boolean) => {
    set({ addEditDialogOpen });
  },
  setUploadFileDialogOpen: (uploadFileDialogOpen: boolean) => {
    set({ uploadFileDialogOpen });
  },
  setConfirmDeleteDialogOpen: (confirmDeleteDialogOpen: boolean) => {
    set({ confirmDeleteDialogOpen });
  },
  setActiveTrack: (activeTrack: ActiveTrack) => {
    set({ activeTrack });
  },
  setSelectedTracks: (selectedTracks: Record<string, boolean>) => {
    set({ selectedTracks });
  },
}));
