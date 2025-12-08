import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button.tsx';
import { Label } from '@/Components/ui/Label.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/Components/ui/Card.tsx';
import { Alert, AlertDescription } from '@/Components/ui/Alert.tsx';
import {
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { PageProps } from '@/types';

const COMPETENCY_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Just starting out, learning the basics',
    icon: '🌱',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Comfortable with fundamentals, building projects',
    icon: '🌿',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Strong skills, tackling complex problems',
    icon: '🌳',
  },
  {
    value: 'senior',
    label: 'Senior',
    description: 'Expert level, architecting solutions',
    icon: '🏔️',
  },
];

export default function CompleteProfile() {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    bio: '',
    development_competency: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup blob URL on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      // Revoke previous blob URL to prevent memory leak
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const submitData = new FormData();
    submitData.append('bio', formData.bio);
    submitData.append('development_competency', formData.development_competency);
    if (profilePhoto) {
      submitData.append('profile_photo', profilePhoto);
    }

    router.post('/complete-profile', submitData, {
      onSuccess: () => {
        router.visit('/dashboard');
      },
      onError: (errors) => {
        // Laravel validation errors can be string or string[] - extract first message
        const firstError = Object.values(errors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        setError(errorMessage || 'Failed to complete profile');
        setIsLoading(false);
      },
      onFinish: () => {
        setIsLoading(false);
      },
    });
  };

  const isFormValid = formData.bio.trim().length >= 10 && formData.development_competency;

  // If user has already completed profile, redirect
  if (user?.profile_completed) {
    router.visit('/dashboard');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Help consultants understand your experience level so they can provide better assistance
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Profile Photo */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Profile Photo</Label>
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-colors",
                      photoPreview ? "border-primary" : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-base font-semibold">
                  About You
                </Label>
                <textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself, your background, and what you're working on..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  {formData.bio.length}/500 characters (minimum 10)
                </p>
              </div>

              {/* Development Competency */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Development Experience Level
                </Label>
                <p className="text-sm text-muted-foreground -mt-2">
                  This helps consultants tailor their explanations to your level
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMPETENCY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        formData.development_competency === level.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, development_competency: level.value }))}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{level.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{level.label}</span>
                            {formData.development_competency === level.value && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {level.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={!isFormValid || isLoading}
                isLoading={isLoading}
              >
                Complete Profile
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You can update this information later in your profile settings
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
