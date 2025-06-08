import { AxiosError } from 'axios';
import { z } from 'zod';
import { validateSchema } from '@/lib/utils';
import { isValidSearchParam } from '@/lib/type-guards';

export type ErrorResponse = { error?: string };

const DEFAULT_ERROR = 'An error has occurred';

export const formatError = (e: AxiosError<ErrorResponse>) => ({
  message: e.response?.data.error ?? DEFAULT_ERROR,
});

export const getData = <T>(promise: Promise<{ data: T }>): Promise<T> =>
  promise.then(res => res.data);

export const validateApiResponseSchema = <T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  data: unknown,
) => {
  return validateSchema(schema, data, `API response for ${endpoint} has unexpected format`);
};

export const cleanSearchParams = (
  obj: Record<string, string | null | undefined | number>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    if (isValidSearchParam(value)) {
      if (typeof value === 'number') {
        result[key] = String(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};
