import { useState, useEffect, useCallback } from "react";
import { CalendarIcon, SendHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  format,
  startOfYear,
  subDays,
  subMonths,
  setHours,
  setMinutes,
  setSeconds,
  endOfDay,
  startOfDay,
} from "date-fns";
import { Separator } from "@/components/ui/separator";
import { CardTitle } from "@/components/ui/card";

function DateRangePicker({ date, onDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(date);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  const handleQuickSelect = useCallback((type) => {
    const today = new Date();
    let startDate, endDate;

    switch (type) {
      case "today":
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        setStartTime("00:00:00");
        setEndTime("23:59:59");
        break;
      case "yesterday":
        startDate = startOfDay(subDays(today, 1));
        endDate = endOfDay(subDays(today, 1));
        setStartTime("00:00:00");
        setEndTime("23:59:59");
        break;
      case "last7days":
        startDate = startOfDay(subDays(today, 6));
        endDate = endOfDay(today);
        setStartTime("00:00:00");
        setEndTime("23:59:59");
        break;
      case "last1month":
        startDate = startOfDay(subMonths(today, 1));
        endDate = endOfDay(today);
        setStartTime("00:00:00");
        setEndTime("23:59:59");
        break;
      case "last3months":
        startDate = startOfDay(subMonths(today, 3));
        endDate = endOfDay(today);
        setStartTime("00:00:00");
        setEndTime("23:59:59");
        break;
      case "thisyear":
        startDate = startOfYear(today);
        endDate = endOfDay(today);
        setStartTime("00:00:00");
        setEndTime("23:59:59");
        break;
      default:
        return;
    }

    setTempDateRange({ from: startDate, to: endDate });
  }, []);

  const handleDateSelect = (range) => {
    if (!range) return;
    setTempDateRange({
      from: range.from ? setTime(range.from, startTime) : undefined,
      to: range.to ? setTime(range.to, endTime) : undefined,
    });
  };

  const setTime = (date, time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return setSeconds(setMinutes(setHours(date, hours), minutes), seconds);
  };

  const handleApply = () => {
    onDateChange(tempDateRange);
    setIsOpen(false);
  };

  const dateRangeLabel = date.from && date.to
    ? `${format(date.from, "MMM d, yyyy HH:mm:ss")} - ${format(date.to, "MMM d, yyyy HH:mm:ss")}`
    : "Select date range";

  // Set default to "Last 7 Days" on initial render
  useEffect(() => {
    handleQuickSelect("last7days");
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-[340px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRangeLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row" align="end">
        <div className="w-full sm:w-48 p-4 border-r flex flex-col gap-1">
          <CardTitle className="mb-1 text-sm">Quick Select</CardTitle>
          <Separator />
          <div className="w-[80vw] sm:full flex flex-wrap sm:flex-col space-x-3 gap-1">
            <Button
              size="sm"
              variant={tempDateRange.from && format(tempDateRange.from, "yyyy-MM-dd") === format(startOfDay(new Date()), "yyyy-MM-dd") ? "outline" : "ghost"}
              className="w-fit justify-start px-1 sm:px-3"
              onClick={() => handleQuickSelect("today")}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant={tempDateRange.from && format(tempDateRange.from, "yyyy-MM-dd") === format(startOfDay(subDays(new Date(), 1)), "yyyy-MM-dd") ? "outline" : "ghost"}
              className="w-fit justify-start px-1 sm:px-3"
              onClick={() => handleQuickSelect("yesterday")}
            >
              Yesterday
            </Button>
            <Button
              size="sm"
              variant={tempDateRange.from && format(tempDateRange.from, "yyyy-MM-dd") === format(startOfDay(subDays(new Date(), 6)), "yyyy-MM-dd") ? "outline" : "ghost"}
              className="w-fit justify-start px-1 sm:px-3"
              onClick={() => handleQuickSelect("last7days")}
            >
              Last 7 Days
            </Button>
            <Button
              size="sm"
              variant={tempDateRange.from && format(tempDateRange.from, "yyyy-MM-dd") === format(startOfDay(subMonths(new Date(), 1)), "yyyy-MM-dd") ? "outline" : "ghost"}
              className="w-fit justify-start px-1 sm:px-3"
              onClick={() => handleQuickSelect("last1month")}
            >
              Last 1 Month
            </Button>
            <Button
              size="sm"
              variant={tempDateRange.from && format(tempDateRange.from, "yyyy-MM-dd") === format(startOfDay(subMonths(new Date(), 3)), "yyyy-MM-dd") ? "outline" : "ghost"}
              className="w-fit justify-start px-1 sm:px-3"
              onClick={() => handleQuickSelect("last3months")}
            >
              Last 3 Months
            </Button>
            <Button
              size="sm"
              variant={tempDateRange.from && format(tempDateRange.from, "yyyy-MM-dd") === format(startOfYear(new Date()), "yyyy-MM-dd") ? "outline" : "ghost"}
              className="w-fit justify-start px-1 sm:px-3"
              onClick={() => handleQuickSelect("thisyear")}
            >
              This Year
            </Button>
          </div>
          <Button
            size="sm"
            variant="default"
            className="justify-center mt-4 sm:mt-auto px-1 sm:px-3"
            onClick={handleApply}
          >
            Apply <SendHorizontal className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label className="px-1">Date Range</Label>
            <Calendar
              mode="range"
              selected={tempDateRange}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              className="rounded-md border w-full"
            />
            <div className="w-full flex gap-4">
              <div className="w-full flex flex-col gap-3">
                <Label htmlFor="start-time-picker" className="px-1">
                  Start Time
                </Label>
                <Input
                  type="time"
                  id="start-time-picker"
                  step="1"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    if (tempDateRange.from) {
                      setTempDateRange((prev) => ({
                        ...prev,
                        from: setTime(tempDateRange.from, e.target.value),
                      }));
                    }
                  }}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                <Label htmlFor="end-time-picker" className="px-1">
                  End Time
                </Label>
                <Input
                  type="time"
                  id="end-time-picker"
                  step="1"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    if (tempDateRange.to) {
                      setTempDateRange((prev) => ({
                        ...prev,
                        to: setTime(tempDateRange.to, e.target.value),
                      }));
                    }
                  }}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;
