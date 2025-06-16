import { SORT_ORDERS, SORT_VALUES, SortOrder, SortValue } from './types';

export const isValidSortValue = (value: unknown): value is SortValue => {
  return typeof value === 'string' && SORT_VALUES.includes(value as SortValue);
};

export const isValidSortOrder = (value: unknown): value is SortOrder => {
  return typeof value === 'string' && SORT_ORDERS.includes(value as SortOrder);
};
