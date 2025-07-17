import { ColumnDef } from '@tanstack/react-table';
import { AudioPlayer } from '@/ui/audioplayer';
import { TrackI } from '@/features/tracks/lib/types';
import { Input } from '@/ui/input';
import { SortingButton } from './sorting-button';
import { isValidInputValue } from '@/lib/type-guards';
import { TracksTableActions } from './tracks-table-actions';
import { TrackImage } from './track-image';

export const columns: ColumnDef<TrackI>[] = [
  {
    id: 'actions',
    accessorKey: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => {
      return (
        <TracksTableActions
          trackData={{
            id: row.original.id,
            slug: row.original.slug,
            isSelected: row.getIsSelected(),
          }}
          onCheckedChange={row.getToggleSelectedHandler()}
        />
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
      return imageUrl ? <TrackImage imageUrl={imageUrl} /> : null;
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
