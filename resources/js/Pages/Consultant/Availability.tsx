import React, { useState } from 'react';
import { Layout } from '@/Components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/Card.tsx';
import { Button } from '@/Components/ui/Button.tsx';
import { Calendar, Clock, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ConsultantAvailability() {
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Availability</h1>
            <p className="text-muted-foreground mt-1">
              Set your working hours and availability
            </p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Select the days you're available for consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-center transition-colors",
                    selectedDays.includes(day)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="font-medium">{day.slice(0, 3)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedDays.includes(day) ? 'Available' : 'Off'}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
            <CardDescription>
              Define your available time slots for each day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDays.map((day) => (
                <div key={day} className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="w-24 font-medium">{day}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                    </select>
                    <span className="text-muted-foreground">to</span>
                    <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                      <option>5:00 PM</option>
                      <option>6:00 PM</option>
                      <option>7:00 PM</option>
                    </select>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timezone */}
        <Card>
          <CardHeader>
            <CardTitle>Timezone</CardTitle>
            <CardDescription>
              Your availability will be shown to users in their local timezone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <select className="w-full max-w-md px-3 py-2 rounded-md border border-input bg-background">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+1 (Central European Time)</option>
            </select>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
