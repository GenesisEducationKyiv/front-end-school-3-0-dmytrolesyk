import { Input } from '@/ui/input';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Debouncer } from '@tanstack/react-pacer';

interface DebouncedInputProps extends React.ComponentProps<typeof Input> {
  wait: number;
}

function DebouncedInput({ wait, value, onChange, ...props }: DebouncedInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  const onChangeDebouncer = useMemo(
    () =>
      new Debouncer(
        (value: ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(value);
          }
        },
        { wait },
      ),
    [onChange, wait],
  );

  useEffect(() => {
    return () => {
      onChangeDebouncer.cancel();
    };
  }, [onChangeDebouncer]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChangeDebouncer.maybeExecute(e);
    },
    [onChangeDebouncer],
  );

  return <Input value={internalValue} onChange={handleChange} {...props} />;
}

export { DebouncedInput };
