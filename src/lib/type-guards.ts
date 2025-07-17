export const isValidInputValue = (
  value: unknown,
): value is string | number | string[] | undefined => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'undefined' ||
    (typeof value === 'object' &&
      value instanceof Array &&
      value.every(val => typeof val === 'string'))
  );
};

export const isValidSearchParam = (value: unknown): value is string | number => {
  return typeof value === 'number' || (typeof value === 'string' && value.length > 0);
};
