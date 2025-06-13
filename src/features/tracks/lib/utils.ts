import { pipe, O } from '@mobily/ts-belt';
import { TracksSearchParams } from './types';
import { isValidSortOrder, isValidSortValue } from './type-guards';

const parseNumber = (value: unknown, fallback: number): number => {
  return pipe(
    value,
    v => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const parsed = parseInt(v, 10);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    },
    O.fromNullable,
    O.filter(n => n > 0),
    O.getWithDefault(fallback),
  );
};

export const parseSearchParams = (searchParams: Record<string, unknown>): TracksSearchParams => {
  const { page: rawPage, size: rawSize, sort: rawSort, order: rawOrder, q: rawQ } = searchParams;

  const page = parseNumber(rawPage, 1);
  const size = parseNumber(rawSize, 10);

  const sort = pipe(
    rawSort,
    v => (typeof v === 'string' && isValidSortValue(v) ? v : null),
    O.fromNullable,
    O.toUndefined,
  );

  const order = pipe(
    rawOrder,
    v => (typeof v === 'string' && isValidSortOrder(v) ? v : null),
    O.fromNullable,
    O.toUndefined,
  );

  const search = pipe(
    rawQ,
    v => (typeof v === 'string' && v.trim().length > 0 ? v.trim() : null),
    O.fromNullable,
    O.toUndefined,
  );

  return {
    page,
    size,
    sort,
    order,
    q: search,
  };
};
