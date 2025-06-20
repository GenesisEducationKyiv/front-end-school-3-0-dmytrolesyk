import { Pencil, Settings, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { AudioPlayer } from '@/ui/audioplayer';
import { Button } from '@/ui/button';
import { TrackI } from '@/features/tracks/lib/types';
import { Input } from '@/ui/input';
import { SortingButton } from './sorting-button';
import { isValidInputValue } from '@/lib/type-guards';

type TrackData = Pick<TrackI, 'id' | 'slug'>;

export const createColumns = ({
  onEdit,
  onConfigure,
  onDelete,
}: {
  onEdit: (track: TrackData) => void;
  onConfigure: (track: TrackData) => void;
  onDelete: (track: TrackData) => void;
}): ColumnDef<TrackI>[] => [
  {
    id: 'actions',
    accessorKey: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => {
      const trackData = { id: row.original.id, slug: row.original.slug };
      return (
        <>
          <Button
            data-testid={`edit-track-${row.original.id}`}
            onClick={() => {
              onEdit(trackData);
            }}
            variant="ghost"
            className="cursor-pointer"
          >
            <Pencil className="ml-2 h-4 w-4" />
          </Button>
          <Button
            data-testid={`upload-track-${row.original.id}`}
            onClick={() => {
              onConfigure(trackData);
            }}
            variant="ghost"
            className="cursor-pointer"
          >
            <Settings />
          </Button>
          <Button
            data-testid={`delete-track-${row.original.id}`}
            onClick={() => {
              onDelete(trackData);
            }}
            variant="ghost"
            className="cursor-pointer"
          >
            <Trash2 />
          </Button>
        </>
      );
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => {
      const filterValue = column.getFilterValue();
      const value = isValidInputValue(filterValue) ? filterValue : '';
      return (
        <div className="flex-col">
          <SortingButton title="Title" onClick={column.getToggleSortingHandler()} />
          <div className="my-2">
            <Input
              data-testid="filter-title"
              placeholder="Filter titles..."
              value={value}
              onChange={event => {
                column.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
        </div>
      );
    },
    cell: ({ row }) => (
      <span data-testid={`track-item-${row.original.id}-title`}>{row.original.title}</span>
    ),
  },
  {
    id: 'artist',
    accessorKey: 'artist',
    header: ({ column }) => {
      const filterValue = column.getFilterValue();
      const value = isValidInputValue(filterValue) ? filterValue : '';
      return (
        <div>
          <SortingButton title="Artist" onClick={column.getToggleSortingHandler()} />
          <div className="my-2">
            <Input
              data-testid="filter-artist"
              placeholder="Filter artists..."
              value={value}
              onChange={event => {
                column.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
        </div>
      );
    },
    cell: ({ row }) => (
      <span data-testid={`track-item-${row.original.id}-artist`}>{row.original.artist}</span>
    ),
  },
  {
    id: 'album',
    accessorKey: 'album',
    header: ({ column }) => {
      const filterValue = column.getFilterValue();
      const value = isValidInputValue(filterValue) ? filterValue : '';
      return (
        <div>
          <SortingButton title="Album" onClick={column.getToggleSortingHandler()} />
          <div className="my-2">
            <Input
              data-testid="filter-album "
              placeholder="Filter albums..."
              value={value}
              onChange={event => {
                column.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
        </div>
      );
    },
    cell: ({ row }) => (
      <span data-testid={`track-item-${row.original.id}-album`}>{row.original.album}</span>
    ),
  },
  {
    id: 'genres',
    accessorKey: 'genres',
    header: 'Genres',
  },
  {
    id: 'coverImage',
    accessorKey: 'coverImage',
    header: 'Cover Image',
    cell: ({ row }) => {
      const imageUrl = row.original.coverImage;
      return imageUrl ? (
        <img className="mt-2 max-h-32 rounded" width={150} height={150} src={imageUrl} />
      ) : null;
    },
  },
  {
    id: 'audiofile',
    accessorKey: 'audioFile',
    header: 'Audio',
    cell: ({ row }) => {
      const { audioFile, id } = row.original;
      return audioFile ? (
        <div className="w-[420px]">
          <AudioPlayer trackId={id} fileName={audioFile} />
        </div>
      ) : null;
    },
  },
];
