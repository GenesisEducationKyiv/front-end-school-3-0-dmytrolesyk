import { SortOrder, SortValue } from './types';

export const isValidSortValue = (value: string): value is SortValue => {
  return ['title', 'artist', 'album'].includes(value);
};

export const isValidSortOrder = (value: string): value is SortOrder => {
  return ['asc', 'desc'].includes(value);
};
