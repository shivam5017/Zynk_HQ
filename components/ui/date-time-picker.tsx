"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  popoverClassName?: string;
}

export function DateTimePicker({
  value,
  onChange,
  className,
  popoverClassName,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  // Initialize time from value or use current time
  const [time, setTime] = React.useState(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  // Update time when value changes externally
  React.useEffect(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, '0');
      const minutes = value.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  }, [value]);

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;

    // Parse the current time
    const [hours, minutes] = time.split(":").map(Number);
    
    // Create a new date with the selected day and current time
    // Important: Use the day's year, month, date but set our time
    const updated = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      hours || 0,
      minutes || 0,
      0,
      0
    );

    console.log("Day selected:", {
      selectedDay: day.toISOString(),
      time: time,
      combinedDateTime: updated.toISOString(),
      localString: updated.toLocaleString(),
    });

    onChange(updated);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (!value) return;

    const [hours, minutes] = newTime.split(":").map(Number);
    
    // Create new date preserving the original date but updating time
    const updated = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      hours || 0,
      minutes || 0,
      0,
      0
    );

    console.log("Time changed:", {
      newTime,
      originalDate: value.toISOString(),
      updatedDate: updated.toISOString(),
      localString: updated.toLocaleString(),
    });

    onChange(updated);
  };

  // Helper to check if a date is before today
  const isBeforeToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate < today;
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left w-full",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <>
                {format(value, "PPP")} at {format(value, "HH:mm")}
              </>
            ) : (
              "Pick a date & time"
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn("w-auto p-4 space-y-4", popoverClassName)}
          align="start"
        >
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleDaySelect}
            disabled={isBeforeToday}
            initialFocus
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Input 
              type="time" 
              value={time} 
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
        </PopoverContent>
      </Popover>

      {value && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Selected: <strong>{value.toLocaleString()}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Timezone: <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>
          </p>
        </div>
      )}
    </div>
  );
}