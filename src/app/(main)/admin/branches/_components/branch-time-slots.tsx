/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable complexity */

"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

import { Clock, Save, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranchHoursStore } from "@/stores/admin-dashboard/branch-hours-store";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

interface BranchTimeSlotsProps {
  branchId: string;
  className?: string;
  onTimeSlotsChange?: (timeSlots: TimeSlot[]) => void;
  onSaveTimeSlots?: () => Promise<boolean>; // Returns true if save was successful
  showSaveButton?: boolean; // Whether to show the save button
  title?: string; // Custom title for the card
  description?: string; // Custom description for the card
}

const BranchTimeSlots = forwardRef(
  (
    {
      branchId,
      className,
      onTimeSlotsChange,
      onSaveTimeSlots,
      showSaveButton = true,
      title = "Operating Hours",
      description = "Set the opening and closing times for each day of the week.",
    }: BranchTimeSlotsProps,
    ref,
  ) => {
    const { getHoursForBranch, updateHours } = useBranchHoursStore();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);

    useEffect(() => {
      const fetchHours = async () => {
        setIsLoading(true);
        try {
          // For new branches, create default time slots
          if (branchId === "new") {
            const defaultSlots = Array.from({ length: 7 }, (_, i) => ({
              id: `new-${i}`,
              dayOfWeek: i,
              openTime: i === 0 || i === 6 ? null : "09:00", // Sunday and Saturday closed by default
              closeTime: i === 0 || i === 6 ? null : "17:00",
              isClosed: i === 0 || i === 6, // Sunday and Saturday closed by default
            }));
            setTimeSlots(defaultSlots);
          } else {
            const hours = getHoursForBranch(branchId);
            // Transform to our local format
            const slots = hours.map((h) => ({
              id: h.id,
              dayOfWeek: h.day_of_week,
              openTime: h.open_time,
              closeTime: h.close_time,
              isClosed: h.is_closed,
            }));
            setTimeSlots(slots);
            if (onTimeSlotsChange) {
              onTimeSlotsChange(slots);
            }
          }
        } catch (error) {
          console.error("Error fetching branch hours:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (branchId) {
        fetchHours();
      }
    }, [branchId, getHoursForBranch]);

    const handleTimeChange = (dayIndex: number, field: "openTime" | "closeTime", value: string) => {
      const updatedSlots = timeSlots.map((slot) =>
        slot.dayOfWeek === dayIndex
          ? {
              ...slot,
              [field]: value,
            }
          : slot,
      );
      setTimeSlots(updatedSlots);
      setHasUnsavedChanges(true);
      if (onTimeSlotsChange) {
        onTimeSlotsChange(updatedSlots);
      }
    };

    const handleClosedChange = (dayIndex: number, checked: boolean) => {
      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.dayOfWeek === dayIndex
            ? {
                ...slot,
                isClosed: checked,
                openTime: checked ? null : (slot.openTime ?? "09:00"),
                closeTime: checked ? null : (slot.closeTime ?? "17:00"),
              }
            : slot,
        ),
      );
      setHasUnsavedChanges(true);
    };

    // Expose save function to parent component
    useImperativeHandle(ref, () => ({
      handleSaveAll,
    }));

    const handleSaveAll = async () => {
      // For new branches, we don't save to database yet
      if (branchId === "new") {
        setHasUnsavedChanges(false);
        setSaveStatus("success");
        // Reset success status after 3 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
        return true; // Return success
      }

      setIsSaving(true);
      setSaveStatus(null);

      try {
        const promises = timeSlots.map((slot) =>
          updateHours({
            id: slot.id,
            branch_id: branchId,
            day_of_week: slot.dayOfWeek,
            open_time: slot.isClosed ? null : slot.openTime,
            close_time: slot.isClosed ? null : slot.closeTime,
            is_closed: slot.isClosed,
          }),
        );
        await Promise.all(promises);
        setHasUnsavedChanges(false);
        setSaveStatus("success");

        // Reset success status after 3 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
        return true; // Return success
      } catch (error) {
        console.error("Error saving time slots:", error);
        setSaveStatus("error");
        return false; // Return failure
      } finally {
        setIsSaving(false);
      }
    };

    if (isLoading) {
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span className="ml-2">Loading time slots...</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${className} flex h-full flex-col`}>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {title}
              </CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>

            <div className="flex items-center gap-2">
              {saveStatus === "success" && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Changes saved successfully
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center text-sm text-red-600">
                  <XCircle className="mr-1 h-4 w-4" />
                  Error saving changes
                </div>
              )}
              {showSaveButton && hasUnsavedChanges && (
                <Button onClick={handleSaveAll} disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 overflow-auto">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {timeSlots.map((slot) => (
              <div
                key={slot.dayOfWeek}
                className={`flex flex-col rounded-lg border p-4 transition-all duration-200 sm:flex-row sm:items-center ${
                  slot.isClosed ? "bg-muted/50 opacity-75" : "bg-background hover:bg-accent hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-3 sm:w-32">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="text-primary text-sm font-medium">{dayAbbreviations[slot.dayOfWeek]}</span>
                  </div>
                  <span className="font-medium">{dayNames[slot.dayOfWeek]}</span>
                </div>

                <div className="my-3 flex items-center sm:my-0 sm:mr-4 sm:ml-auto">
                  <Checkbox
                    id={`closed-${slot.dayOfWeek}`}
                    checked={slot.isClosed}
                    onCheckedChange={(checked) => handleClosedChange(slot.dayOfWeek, checked as boolean)}
                  />
                  <Label htmlFor={`closed-${slot.dayOfWeek}`} className="ml-2 cursor-pointer text-sm font-medium">
                    Closed
                  </Label>
                </div>

                {!slot.isClosed ? (
                  <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`open-${slot.dayOfWeek}`} className="text-sm font-medium">
                        Open:
                      </Label>
                      <Input
                        id={`open-${slot.dayOfWeek}`}
                        type="time"
                        value={slot.openTime ?? "09:00"}
                        onChange={(e) => handleTimeChange(slot.dayOfWeek, "openTime", e.target.value)}
                        className="w-28"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`close-${slot.dayOfWeek}`} className="text-sm font-medium">
                        Close:
                      </Label>
                      <Input
                        id={`close-${slot.dayOfWeek}`}
                        type="time"
                        value={slot.closeTime ?? "17:00"}
                        onChange={(e) => handleTimeChange(slot.dayOfWeek, "closeTime", e.target.value)}
                        className="w-28"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex items-center sm:ml-auto">
                    <XCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm">Closed all day</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showSaveButton && hasUnsavedChanges && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveAll} disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

BranchTimeSlots.displayName = "BranchTimeSlots";

export { BranchTimeSlots };
