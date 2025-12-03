import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || errorMessage;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-6xl font-bold text-muted-foreground/30 mb-4">
          {errorStatus}
        </div>
        <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {errorMessage}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

