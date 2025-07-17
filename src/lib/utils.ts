import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string,
): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const defaultMessage = `Schema validation failed: ${result.error.message}`;
    throw new Error(errorMessage || defaultMessage);
  }

  return result.data;
};

type Updater<T> = T | ((old: T) => T);

export function createUpdaterHandler<T>(currentValue: T, setter: (value: T) => void) {
  return (updaterOrValue: Updater<T>) => {
    const newValue =
      typeof updaterOrValue === 'function'
        ? (updaterOrValue as (old: T) => T)(currentValue)
        : updaterOrValue;
    setter(newValue);
  };
}

export const omitUndefined = <T extends Record<string, unknown>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, val]) => {
      return val !== undefined;
    }),
  ) as { [K in keyof T]: Exclude<T[K], undefined> };
};

export const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data &&
    'error' in error.data
  ) {
    return String(error.data.error);
  }

  return 'An unknown error occurred';
};
