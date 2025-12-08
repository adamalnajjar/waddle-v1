import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';
import { Alert, AlertDescription } from '@/Components/ui/Alert';
import { 
  Mail, 
  Calendar,
  Camera,
  Pencil
} from 'lucide-react';
import type { PageProps } from '@/types';

export default function Profile() {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;
  
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { data, setData, patch, processing, errors } = useForm({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch('/profile', {
      onSuccess: () => {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      },
    });
  };

  const handleCancel = () => {
    setData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-1">
              Your account details
            </p>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Alerts */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {Array.isArray(Object.values(errors)[0]) 
                ? (Object.values(errors)[0] as string[])[0] 
                : Object.values(errors)[0]}
            </AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  {user.profile_photo_url ? (
                    <img 
                      src={user.profile_photo_url} 
                      alt={`${user.first_name} ${user.last_name}`}
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-muted-foreground text-sm">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{user.bio}</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Token Balance</span>
                  <span className="font-medium">{user.token_balance || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">
                    {user.created_at 
                      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Dec 2025'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="font-medium text-green-600">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold text-lg mb-6">Personal Information</h3>
                
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your email address
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={data.bio}
                      onChange={(e) => setData('bio', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell us a bit about yourself..."
                      rows={3}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                    <Button type="button" variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={processing}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </form>

            {/* Account Actions */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="font-semibold text-lg mb-4">Account</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30+ days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Extra security for your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <p className="font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently remove your data</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
