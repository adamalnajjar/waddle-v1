import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { register, clearError } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    date_of_birth: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user' as 'user' | 'consultant',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /\d/.test(p) },
    { label: 'One special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(register(formData));
    
    if (register.fulfilled.match(result)) {
      // Redirect to profile completion for new users
      navigate('/complete-profile');
    }
  };

  const allPasswordRequirementsMet = passwordRequirements.every(
    (req) => req.test(formData.password)
  );

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Get started with expert technical consultations
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I want to</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={cn(
                    "p-4 rounded-lg border text-left transition-colors",
                    formData.role === 'user'
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                  )}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'user' }))}
                >
                  <div className="font-medium text-foreground">Get Help</div>
                  <div className="text-sm text-muted-foreground">
                    Find expert consultants
                  </div>
                </button>
                <div
                  className="p-4 rounded-lg border border-input bg-muted/30 text-left opacity-60 cursor-not-allowed relative"
                >
                  <div className="font-medium text-muted-foreground">Provide Help</div>
                  <div className="text-sm text-muted-foreground">
                    Become a consultant
                  </div>
                  <span className="absolute top-2 right-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be your unique identifier on the platform
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1 mt-2">
                  {passwordRequirements.map((req, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        req.test(formData.password)
                          ? "text-green-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {req.test(formData.password) ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  error={
                    formData.password_confirmation &&
                    formData.password !== formData.password_confirmation
                      ? "Passwords don't match"
                      : undefined
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={
                !allPasswordRequirementsMet ||
                formData.password !== formData.password_confirmation
              }
            >
              Create Account
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

