import { useState } from 'react';
import { GenresTagInput } from './genres-input.tsx';

const musicGenres = [
  'Pop',
  'Hip Hop',
  'R&B',
  'Jazz',
  'Blues',
  'Classical',
  'Electronic',
  'House',
  'Techno',
  'Trance',
  'Dubstep',
  'Drum and Bass',
  'Reggae',
  'Ska',
  'Country',
  'Folk',
  'Indie',
  'Alternative',
  'Metal',
  'Punk',
  'Grunge',
  'K-Pop',
  'J-Pop',
  'Latin',
  'Salsa',
  'Afrobeat',
  'Gospel',
  'Soul',
  'Funk',
  'Disco',
  'Lo-fi',
  'Ambient',
  'Synthwave',
  'Opera',
  'Trap',
  'EDM',
];

export const GenresInputStory = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Jazz', 'Blues']);

  return (
    <GenresTagInput
      value={selectedGenres}
      genres={musicGenres}
      onChange={values => {
        setSelectedGenres(values);
      }}
    />
  );
};
