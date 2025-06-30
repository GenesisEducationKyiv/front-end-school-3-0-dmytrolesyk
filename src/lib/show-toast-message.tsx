import { toast } from 'sonner';

export const showToastSuccess = (message: string, testId = 'toast-success') =>
  toast.success(<p data-testid={testId}>{message}</p>);

export const showToastError = (message: string, testId = 'toast-error') =>
  toast.error(<p data-testid={testId}>{message}</p>);
