'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Button } from '../button/button';
import { Calendar } from '../calendar/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export interface DatePickerProps
  extends Omit<
    React.ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect' | 'className' | 'required'
  > {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  formatStr?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  buttonClassName,
  formatStr = 'PPP',
  ...props
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            buttonClassName,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, formatStr) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange || (() => {})}
          required={false}
          autoFocus
          // biome-ignore lint/suspicious/noExplicitAny: bypass complex union types
          {...(props as any)}
        />
      </PopoverContent>
    </Popover>
  );
}

export interface DateRangePickerProps
  extends Omit<
    React.ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect' | 'className' | 'defaultMonth' | 'numberOfMonths' | 'required'
  > {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  formatStr?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = 'Pick a date range',
  disabled = false,
  className,
  buttonClassName,
  formatStr = 'LLL dd, y',
  ...props
}: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !dateRange && 'text-muted-foreground',
            buttonClassName,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, formatStr)} - {format(dateRange.to, formatStr)}
              </>
            ) : (
              format(dateRange.from, formatStr)
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange || (() => {})}
          numberOfMonths={2}
          // biome-ignore lint/suspicious/noExplicitAny: bypass complex union types
          {...(props as any)}
        />
      </PopoverContent>
    </Popover>
  );
}
