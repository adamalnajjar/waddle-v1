import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Modal, ModalFooter } from '../components/ui/Modal';
import {
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Lock,
  Eye,
  FileText,
  Loader2,
  Check,
  Info
} from 'lucide-react';

interface PrivacySettings {
  email_verified: boolean;
  two_factor_enabled: boolean;
  notification_preferences: boolean;
}

interface DataCollected {
  personal_info: string;
  usage_data: string;
  payment_data: string;
  technical_data: string;
}

interface UserRights {
  access: string;
  rectification: string;
  erasure: string;
  portability: string;
  restriction: string;
  objection: string;
}

interface RetentionPolicy {
  user_data: string;
  consultation_records: string;
  payment_records: string;
  audit_logs: string;
  session_recordings: string;
}

export const PrivacySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [dataCollected, setDataCollected] = useState<DataCollected | null>(null);
  const [userRights, setUserRights] = useState<UserRights | null>(null);
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    try {
      const [settingsRes, policyRes] = await Promise.all([
        api.get('/privacy/settings'),
        api.get('/privacy/policy'),
      ]);
      
      setSettings(settingsRes.data.settings);
      setDataCollected(settingsRes.data.data_collected);
      setUserRights(settingsRes.data.your_rights);
      setRetentionPolicy(policyRes.data.policy);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const response = await api.get('/privacy/download', {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waddle_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage('Your data has been exported successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm || !deletePassword) return;
    
    setIsDeleting(true);
    setError(null);
    try {
      await api.post('/privacy/delete', {
        password: deletePassword,
        confirm: deleteConfirm,
      });
      
      // Clear local storage and redirect
      localStorage.removeItem('auth_token');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Privacy & Data
        </h1>
        <p className="text-muted-foreground">
          Manage your data, privacy settings, and exercise your GDPR rights
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Your Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Data
          </CardTitle>
          <CardDescription>
            Export or manage your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Export Your Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download a copy of all your personal data in JSON format.
              </p>
              <Button onClick={handleExportData} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Data
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg border-destructive/50">
              <h4 className="font-medium mb-2 text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data We Collect */}
      {dataCollected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Data We Collect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(dataCollected).map(([key, value]) => (
                <div key={key} className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium capitalize mb-1">
                    {key.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Rights */}
      {userRights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Your Rights
            </CardTitle>
            <CardDescription>
              Under GDPR, you have the following rights regarding your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(userRights).map(([key, value]) => (
                <div key={key} className="p-3 border rounded-lg">
                  <h4 className="font-medium capitalize mb-1">
                    Right to {key.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Retention */}
      {retentionPolicy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Data Retention Policy
            </CardTitle>
            <CardDescription>
              How long we keep different types of data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(retentionPolicy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Status */}
      {settings && (
        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">
                    Your email address has been verified
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  settings.email_verified 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {settings.email_verified ? 'Verified' : 'Not Verified'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  settings.two_factor_enabled 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {settings.two_factor_enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletePassword('');
          setDeleteConfirm(false);
        }}
        title="Delete Account"
        description="This action cannot be undone. All your data will be permanently deleted."
      >
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This will permanently delete your account and all associated data including:
              <ul className="list-disc list-inside mt-2">
                <li>Your profile information</li>
                <li>Consultation history</li>
                <li>Messages and files</li>
                <li>Token balance and transactions</li>
                <li>Subscription (if any)</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <label className="text-sm font-medium">Enter your password to confirm</label>
            <Input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Your password"
              className="mt-2"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              I understand that this action is permanent and cannot be undone
            </span>
          </label>
        </div>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false);
              setDeletePassword('');
              setDeleteConfirm(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!deletePassword || !deleteConfirm || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete My Account
          </Button>
        </ModalFooter>
      </Modal>
      </div>
    </div>
  );
};

