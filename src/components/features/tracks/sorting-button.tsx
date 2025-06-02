import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SortingButton({
  title,
  onClick,
}: {
  title: string;
  onClick: undefined | ((event: unknown) => void);
}) {
  return (
    <Button data-testid="sort-select" variant="ghost" className="cursor-pointer" onClick={onClick}>
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
