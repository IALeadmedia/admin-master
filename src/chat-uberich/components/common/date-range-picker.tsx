"use client";

import * as React from "react";
import { subDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { cn } from "@/chat-uberich/lib/utils";

export function DatePickerWithRange({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (range: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 5),
    to: new Date(),
  });

  const setToEndOfDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  const handleDateChange = (range: DateRange | any) => {
    if (range) {
      const fromDate = range.from;
      const toDate = range.to ? range.to : fromDate;
      const adjustedToDate = setToEndOfDay(toDate);

      setDate({
        from: fromDate,
        to: adjustedToDate,
      });

      if (onChange)
        onChange({
          from: fromDate,
          to: adjustedToDate,
        });
    } else {
      setDate(undefined);
      if (onChange) onChange(undefined);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-50 text-xs justify-start text-left font-normal focus:ring-0 focus:border-blue-900 ",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <>
                {date.from && format(date.from, "LLL dd, y")}
                {date.to && ` - ${format(date.to, "LLL dd, y")}`}
              </>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
