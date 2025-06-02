import { AxiosError } from 'axios';
import { validateSchema } from '@/lib/utils';
import { z } from 'zod';

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
  return validateSchema(schema, data, `API response for ${endpoint} has incorrect format`);
};
