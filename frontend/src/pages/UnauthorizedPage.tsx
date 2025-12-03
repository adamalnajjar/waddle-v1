import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldAlert, Home, ArrowLeft, LogIn } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppDispatch';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          You don't have permission to access this page. 
          {!isAuthenticated && ' Please log in to continue.'}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

