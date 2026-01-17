"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // ← Your calendar file
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";

export function SchedulePicker({ onChange }: { onChange: (date: string) => void }) {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarClock className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : "Pick schedule date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(d) => {
            setDate(d || null);
            if (d) onChange(d.toISOString());
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
