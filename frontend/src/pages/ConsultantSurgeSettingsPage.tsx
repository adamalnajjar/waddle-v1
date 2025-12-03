import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { consultantApi } from '../services/api';
import { 
  ArrowLeft,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Info
} from 'lucide-react';

interface SurgeSettings {
  can_receive_surge_pricing: boolean;
  notification_start_time: string | null;
  notification_end_time: string | null;
  surge_multiplier: number;
  description: string;
}

export default function ConsultantSurgeSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SurgeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [enabled, setEnabled] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await consultantApi.getSurgeSettings();
      const data = response.data;
      setSettings(data);
      setEnabled(data.can_receive_surge_pricing);
      setStartTime(data.notification_start_time || '09:00');
      setEndTime(data.notification_end_time || '17:00');
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await consultantApi.updateSurgeSettings({
        can_receive_surge_pricing: enabled,
        notification_start_time: startTime,
        notification_end_time: endTime,
      });

      setSuccess('Settings saved successfully');
      await fetchSettings();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/consultant/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-8 h-8 text-yellow-500" />
              Surge Pricing Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Opt in to receive work invitations outside your regular hours at a premium rate
            </p>
          </div>

          {/* Error/Success Alerts */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {/* Main Card */}
          <Card>
            <CardHeader>
              <CardTitle>Surge Pricing</CardTitle>
              <CardDescription>
                {settings?.description || 'When enabled, you may receive work invitations outside your regular hours at premium pay.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-foreground">Enable Surge Pricing</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive work invitations outside your availability hours at {settings?.surge_multiplier || 1.2}x pay
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => setEnabled(!enabled)}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${enabled ? 'bg-yellow-500' : 'bg-muted-foreground/30'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg
                      ring-0 transition duration-200 ease-in-out
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {/* Regular Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Your Regular Hours</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set the hours when you prefer to be notified of regular work. Outside these hours, 
                  you'll only receive surge pricing invitations if enabled.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">How Surge Pricing Works</p>
                  <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Regular invitations are sent during your set hours</li>
                    <li>• Surge invitations can arrive outside your hours (if no one else is available)</li>
                    <li>• Surge invitations pay {settings?.surge_multiplier || 1.2}x the normal rate</li>
                    <li>• You can accept or decline any invitation</li>
                  </ul>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

