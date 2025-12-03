import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { consultantApi } from '../services/api';
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Zap,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: string;
  status: string;
  color: string;
}

interface AvailabilitySlot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
}

interface AcceptedInvitation {
  id: number;
  problem_id: number;
  user: {
    id: number;
    name: string;
  };
  accepted_at: string;
  is_surge: boolean;
}

interface UpcomingConsultation {
  id: number;
  status: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ConsultantSchedulePage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [acceptedInvitations, setAcceptedInvitations] = useState<AcceptedInvitation[]>([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState<UpcomingConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      
      // Fetch both calendar and schedule data
      const [calendarRes, scheduleRes] = await Promise.all([
        consultantApi.getCalendar({
          start_date: getMonthStart(currentDate),
          end_date: getMonthEnd(currentDate),
        }),
        consultantApi.getSchedule(),
      ]);

      setEvents(calendarRes.data.events);
      setAvailability(calendarRes.data.availability);
      setAcceptedInvitations(scheduleRes.data.accepted_invitations);
      setUpcomingConsultations(scheduleRes.data.upcoming_consultations);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load schedule';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  };

  const getMonthEnd = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = firstDay.getDay();
    
    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Add padding days from next month
    const remaining = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availability.filter(slot => slot.day_of_week === dayOfWeek);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/consultant/work')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Work
          </Button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
              <p className="mt-1 text-muted-foreground">
                View your calendar and upcoming consultations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-24">
                      <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {/* Day headers */}
                      <div className="grid grid-cols-7 mb-2">
                        {DAYS_SHORT.map(day => (
                          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {getCalendarDays().map(({ date, isCurrentMonth }, index) => {
                          const dayEvents = getEventsForDay(date);
                          const hasAvailability = getAvailabilityForDay(date.getDay()).length > 0;
                          
                          return (
                            <div
                              key={index}
                              className={`
                                min-h-24 p-1 border rounded-lg transition-colors
                                ${isCurrentMonth ? 'bg-card' : 'bg-muted/30'}
                                ${isToday(date) ? 'border-primary' : 'border-border'}
                                ${hasAvailability && isCurrentMonth ? 'bg-green-50 dark:bg-green-900/10' : ''}
                              `}
                            >
                              <div className={`
                                text-sm font-medium mb-1
                                ${isToday(date) ? 'text-primary' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                              `}>
                                {date.getDate()}
                              </div>
                              <div className="space-y-0.5">
                                {dayEvents.slice(0, 3).map(event => (
                                  <div
                                    key={event.id}
                                    className="text-xs truncate px-1 py-0.5 rounded"
                                    style={{ backgroundColor: event.color + '20', color: event.color }}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 3 && (
                                  <div className="text-xs text-muted-foreground px-1">
                                    +{dayEvents.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Accepted Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accepted Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {acceptedInvitations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No accepted jobs pending scheduling
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {acceptedInvitations.map(invitation => (
                        <div
                          key={invitation.id}
                          className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => navigate(`/consultant/work/${invitation.id}`)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm text-foreground">
                              {invitation.user.name}
                            </span>
                            {invitation.is_surge && (
                              <Zap className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Accepted {new Date(invitation.accepted_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Consultations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingConsultations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming consultations
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingConsultations.map(consultation => (
                        <div
                          key={consultation.id}
                          className="p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm text-foreground">
                              {consultation.user.first_name} {consultation.user.last_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(consultation.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  {availability.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        No availability set
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/consultant/availability')}
                      >
                        Set Availability
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {DAYS_OF_WEEK.map((day, index) => {
                        const slots = getAvailabilityForDay(index);
                        if (slots.length === 0) return null;
                        
                        return (
                          <div key={day} className="text-sm">
                            <span className="font-medium text-foreground">{day}</span>
                            <div className="ml-4 text-muted-foreground">
                              {slots.map((slot, i) => (
                                <div key={i}>
                                  {slot.start_time} - {slot.end_time}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0"
                        onClick={() => navigate('/consultant/availability')}
                      >
                        Edit Availability
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

