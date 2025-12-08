import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Layout } from '@/Components/layout';
import { Button } from '@/Components/ui/Button.tsx';
import { Label } from '@/Components/ui/Label.tsx';
import { Card, CardContent, CardFooter } from '@/Components/ui/Card.tsx';
import { Alert, AlertDescription } from '@/Components/ui/Alert.tsx';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { PageProps } from '@/types';

interface QuestionnaireData {
  problem_description: string;
  tech_stack: string[];
  error_logs: string;
  urgency: string;
  previous_attempts: string;
}

const techStackOptions = [
  'JavaScript', 'TypeScript', 'Python', 'PHP', 'Ruby', 'Java', 'C#', 'Go', 'Rust',
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Django', 'Laravel', 'Rails',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'Other',
];

const urgencyOptions = [
  { value: 'low', label: 'Low - I can wait', icon: Clock, color: 'text-green-500' },
  { value: 'medium', label: 'Medium - Need help within a few hours', icon: Clock, color: 'text-yellow-500' },
  { value: 'high', label: 'High - Need help ASAP', icon: AlertTriangle, color: 'text-red-500' },
];

export default function NewConsultation() {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuestionnaireData>({
    problem_description: '',
    tech_stack: [],
    error_logs: '',
    urgency: 'medium',
    previous_attempts: '',
  });

  const totalSteps = 4;

  // Check if user has sufficient tokens
  const hasInsufficientTokens = (user?.token_balance || 0) < 10;

  const handleTechStackToggle = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(tech)
        ? prev.tech_stack.filter((t) => t !== tech)
        : [...prev.tech_stack, tech],
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    router.post('/consultations', formData, {
      onSuccess: () => {
        router.visit('/consultations', {
          data: {
            message: "Consultation request submitted! We're finding the best expert for you."
          }
        });
      },
      onError: (errors) => {
        setError(Object.values(errors)[0] as string || 'Failed to submit consultation request');
        setIsLoading(false);
      },
      onFinish: () => {
        setIsLoading(false);
      },
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.problem_description.length >= 50;
      case 2:
        return formData.tech_stack.length > 0;
      case 3:
        return formData.urgency !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problem">
                Describe your problem or challenge <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Be as specific as possible. Include what you're trying to achieve and what's blocking you.
              </p>
              <textarea
                id="problem"
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="I'm trying to implement authentication in my React app using JWT tokens, but I keep getting a 401 error when making API requests..."
                value={formData.problem_description}
                onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
              />
              <p className={cn(
                "text-xs",
                formData.problem_description.length < 50 ? "text-muted-foreground" : "text-green-600"
              )}>
                {formData.problem_description.length}/50 characters minimum
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What technologies are you working with? <span className="text-destructive">*</span></Label>
              <p className="text-sm text-muted-foreground">
                Select all that apply
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStackOptions.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechStackToggle(tech)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    formData.tech_stack.includes(tech)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
            {formData.tech_stack.length > 0 && (
              <p className="text-sm text-green-600">
                Selected: {formData.tech_stack.join(', ')}
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>How urgent is this issue? <span className="text-destructive">*</span></Label>
            </div>
            <div className="space-y-3">
              {urgencyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: option.value })}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-colors flex items-center gap-3",
                    formData.urgency === option.value
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                  )}
                >
                  <option.icon className={cn("h-5 w-5", option.color)} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="error_logs">
                Paste any relevant error messages or logs
              </Label>
              <p className="text-sm text-muted-foreground">
                This helps our experts understand your issue faster (optional)
              </p>
              <div className="relative">
                <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="error_logs"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Error: Cannot read property 'map' of undefined..."
                  value={formData.error_logs}
                  onChange={(e) => setFormData({ ...formData, error_logs: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previous_attempts">
                What have you already tried?
              </Label>
              <p className="text-sm text-muted-foreground">
                List any solutions you've attempted (optional)
              </p>
              <textarea
                id="previous_attempts"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="I've tried clearing the cache, reinstalling dependencies, and checking the API endpoint..."
                value={formData.previous_attempts}
                onChange={(e) => setFormData({ ...formData, previous_attempts: e.target.value })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.visit('/dashboard')}
              className="flex items-center text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold">Start a Consultation</h1>
            <p className="text-muted-foreground mt-1">
              Tell us about your problem and we'll match you with the perfect expert
            </p>
          </div>

          {/* Token Warning */}
          {hasInsufficientTokens && (
            <Alert variant="warning" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You need at least 10 tokens to start a consultation. You currently have {user?.token_balance || 0} tokens.
                <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.visit('/tokens')}>
                  Buy tokens
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderStep()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading || hasInsufficientTokens}
                  isLoading={isLoading}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Summary Preview */}
          {step === totalSteps && (
            <Card className="mt-6">
              <CardContent className="pt-6 space-y-4 text-sm">
                <h3 className="text-lg font-semibold">Request Summary</h3>
                <div>
                  <span className="font-medium">Problem:</span>
                  <p className="text-muted-foreground mt-1">
                    {formData.problem_description.slice(0, 200)}
                    {formData.problem_description.length > 200 && '...'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Tech Stack:</span>
                  <p className="text-muted-foreground mt-1">
                    {formData.tech_stack.join(', ')}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Urgency:</span>
                  <p className="text-muted-foreground mt-1 capitalize">
                    {formData.urgency}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
