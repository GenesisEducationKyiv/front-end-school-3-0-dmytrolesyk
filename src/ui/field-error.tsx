import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldErrorProps {
  dataTestId: string;
  error?: string | undefined;
  className?: string | undefined;
}

export function FieldError({ error, className, dataTestId }: FieldErrorProps) {
  if (!error) return null;

  return (
    <div
      data-testid={dataTestId}
      className={cn('flex items-center gap-2 text-sm text-destructive mt-1', className)}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}
