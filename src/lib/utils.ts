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
