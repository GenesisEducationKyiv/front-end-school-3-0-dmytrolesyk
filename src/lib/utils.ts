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
