'use client';

import * as React from 'react';

import { PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { Popover, PopoverContent } from '~/components/ui/popover';
import { cn } from '~/libs';

import { Spin } from './spin';

export type Option = {
  value: string;
  label: string;
};

export type AutocompleteProps = {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  value?: string;
  onValueChange?: (value?: string) => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  hasMoreItems?: boolean;
};

const AutoComplete = ({
  options = [],
  placeholder = 'Select an option...',
  emptyMessage = 'No results found.',
  value,
  onValueChange,
  disabled = false,
  className,
  isLoading = false,
  onSearch,
  onLoadMore,
  hasMoreItems = false,
}: AutocompleteProps) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(value);
  const [inputValue, setInputValue] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      if (currentValue === selected) {
        setSelected(undefined);
        onValueChange?.(undefined);
      } else {
        setSelected(currentValue);
        onValueChange?.(currentValue);
      }
      setOpen(false);
    },
    [onValueChange, selected],
  );

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === selected),
    [options, selected],
  );

  const handleScroll = React.useCallback(() => {
    if (!listRef.current || !onLoadMore || !hasMoreItems || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    // Load more when user scrolls to the bottom (with a small threshold)
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      onLoadMore();
    }
  }, [onLoadMore, hasMoreItems, isLoading]);

  // Handle input change with debounce
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch && inputValue !== undefined) {
        onSearch(inputValue);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            { 'text-muted-foreground': !selectedOption },
            className,
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList ref={listRef} onScroll={handleScroll} className="max-h-[300px] overflow-auto">
            {isLoading && options.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Spin />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selected === option.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
            {hasMoreItems && (
              <div className="flex items-center justify-center py-2">
                {isLoading ? <Spin /> : <p className="text-xs text-muted-foreground">Scroll for more</p>}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { AutoComplete };
