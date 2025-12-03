import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultantApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Select } from '../components/ui/Select';
import {
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Save,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AvailabilitySlot {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const time = `${hour.toString().padStart(2, '0')}:${minute}`;
  return { value: time, label: time };
});

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

export const ConsultantAvailabilityPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const response = await consultantApi.getAvailability();
      setSlots(response.data.availability);
      setIsAvailable(response.data.is_available);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = () => {
    setSlots([
      ...slots,
      {
        day_of_week: 1, // Monday
        start_time: '09:00',
        end_time: '17:00',
        timezone: 'UTC',
        is_active: true,
      },
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleUpdateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate slots
      for (const slot of slots) {
        if (slot.start_time >= slot.end_time) {
          setError('End time must be after start time for all slots');
          setIsSaving(false);
          return;
        }
      }

      await consultantApi.updateAvailability(slots.map(slot => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        timezone: slot.timezone,
        is_active: slot.is_active,
      })));

      setSuccessMessage('Availability updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save availability');
    } finally {
      setIsSaving(false);
    }
  };

  const _getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(d => d.value === String(dayOfWeek))?.label || '';
  };
  void _getDayName; // Reserved for future use

  // Group slots by day
  const slotsByDay = slots.reduce((acc, slot, index) => {
    const day = slot.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push({ ...slot, index });
    return acc;
  }, {} as Record<number, (AvailabilitySlot & { index: number })[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/consultant')}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold">Availability Schedule</h1>
            <p className="text-muted-foreground">
              Set your available hours for consultations
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Availability Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Status</h3>
              <p className="text-sm text-muted-foreground">
                {isAvailable
                  ? 'You are currently accepting new consultations'
                  : 'You are not accepting new consultations'}
              </p>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              isAvailable
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddSlot}>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No availability set</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add time slots to let users know when you're available for consultations.
              </p>
              <Button className="mt-4" onClick={handleAddSlot}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Time Slot
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border",
                    !slot.is_active && "opacity-50"
                  )}
                >
                  {/* Day */}
                  <div className="w-full md:w-40">
                    <Select
                      options={DAYS_OF_WEEK}
                      value={String(slot.day_of_week)}
                      onChange={(value) => handleUpdateSlot(index, 'day_of_week', parseInt(value))}
                    />
                  </div>

                  {/* Time Range */}
                  <div className="flex items-center gap-2">
                    <Select
                      options={TIME_SLOTS}
                      value={slot.start_time}
                      onChange={(value) => handleUpdateSlot(index, 'start_time', value)}
                      className="w-24"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Select
                      options={TIME_SLOTS}
                      value={slot.end_time}
                      onChange={(value) => handleUpdateSlot(index, 'end_time', value)}
                      className="w-24"
                    />
                  </div>

                  {/* Timezone */}
                  <div className="w-full md:w-48">
                    <Select
                      options={TIMEZONES}
                      value={slot.timezone}
                      onChange={(value) => handleUpdateSlot(index, 'timezone', value)}
                    />
                  </div>

                  {/* Active Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slot.is_active}
                      onChange={(e) => handleUpdateSlot(index, 'is_active', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Active</span>
                  </label>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSlot(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      {slots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = slotsByDay[parseInt(day.value)] || [];
                const activeSlots = daySlots.filter(s => s.is_active);
                
                return (
                  <div key={day.value} className="text-center">
                    <p className="text-sm font-medium mb-2">{day.label.slice(0, 3)}</p>
                    <div className={cn(
                      "min-h-[60px] rounded-lg p-2",
                      activeSlots.length > 0
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted"
                    )}>
                      {activeSlots.length > 0 ? (
                        <div className="space-y-1">
                          {activeSlots.map((slot, i) => (
                            <p key={i} className="text-xs">
                              {slot.start_time}-{slot.end_time}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Off</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for Setting Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Set consistent hours to help users plan their consultations</li>
            <li>• Consider different time zones if you work with international clients</li>
            <li>• Leave buffer time between slots for breaks and preparation</li>
            <li>• You can temporarily disable slots without deleting them</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

