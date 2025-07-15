import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface InlineLoaderProps {
  size?: 'sm' | 'default' | 'lg';
  text?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    icon: 'h-4 w-4',
    text: 'text-sm',
  },
  default: {
    icon: 'h-6 w-6',
    text: 'text-base',
  },
  lg: {
    icon: 'h-8 w-8',
    text: 'text-lg',
  },
};

export function InlineLoader({ size = 'default', text, className }: InlineLoaderProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', config.icon)} />
      {text && <span className={cn('text-muted-foreground', config.text)}>{text}</span>}
    </div>
  );
}
