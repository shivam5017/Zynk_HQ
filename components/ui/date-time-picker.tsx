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
  className?: string;               // 👈 NEW
  popoverClassName?: string;        // 👈 NEW optional
}

export function DateTimePicker({
  value,
  onChange,
  className,
  popoverClassName,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(value ? format(value, "HH:mm") : "");

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;

    const [hours, minutes] = time.split(":").map(Number);
    const updated = new Date(day);

    if (!isNaN(hours)) updated.setHours(hours);
    if (!isNaN(minutes)) updated.setMinutes(minutes);

    onChange(updated);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);

    if (!value) return;

    const [hours, minutes] = e.target.value.split(":").map(Number);
    const updated = new Date(value);

    updated.setHours(hours || 0);
    updated.setMinutes(minutes || 0);

    onChange(updated);
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
            {value ? format(value, "PPP p") : "Pick a date & time"}
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
            disabled={(date) => date < new Date()}
            initialFocus
          />

          <div>
            <label className="text-sm text-muted-foreground">Time</label>
            <Input type="time" value={time} onChange={handleTimeChange} />
          </div>
        </PopoverContent>
      </Popover>

      {value && (
        <p className="text-xs text-muted-foreground">
          Your local timezone:{" "}
          <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>
        </p>
      )}
    </div>
  );
}
