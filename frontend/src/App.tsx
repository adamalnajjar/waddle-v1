import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch';
import { fetchUser } from './features/auth/authSlice';

// Layout
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { NewConsultationPage } from './pages/NewConsultationPage';
import { TokensPage } from './pages/TokensPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { ConsultantDashboardPage } from './pages/ConsultantDashboardPage';
import { ConsultantRequestsPage } from './pages/ConsultantRequestsPage';
import { ConsultantAvailabilityPage } from './pages/ConsultantAvailabilityPage';
import { ConsultantEarningsPage } from './pages/ConsultantEarningsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PrivacySettingsPage } from './pages/PrivacySettingsPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Footer pages
import { ConsultantsPage } from './pages/ConsultantsPage';
import { EnterprisePage } from './pages/EnterprisePage';
import { HelpPage } from './pages/HelpPage';
import { BlogPage } from './pages/BlogPage';
import { DocsPage } from './pages/DocsPage';
import { StatusPage } from './pages/StatusPage';
import { AboutPage } from './pages/AboutPage';
import { CareersPage } from './pages/CareersPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { UsingAIPage } from './pages/UsingAIPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Auth initializer component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user, fetch the user
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, user]);

  return <>{children}</>;
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* Placeholder routes - to be implemented */}
        <Route
          path="/consultations"
          element={
            <ProtectedRoute>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Consultations</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultations/new"
          element={
            <ProtectedRoute>
              <NewConsultationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tokens"
          element={
            <ProtectedRoute>
              <TokensPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PrivacySettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Subscription</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Consultation Session */}
        <Route
          path="/consultation/:id"
          element={
            <ProtectedRoute>
              <ConsultationPage />
            </ProtectedRoute>
          }
        />
        
        {/* Consultant Routes */}
        <Route
          path="/consultant"
          element={
            <ProtectedRoute requiredRole="consultant">
              <ConsultantDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant/requests"
          element={
            <ProtectedRoute requiredRole="consultant">
              <ConsultantRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant/availability"
          element={
            <ProtectedRoute requiredRole="consultant">
              <ConsultantAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant/earnings"
          element={
            <ProtectedRoute requiredRole="consultant">
              <ConsultantEarningsPage />
            </ProtectedRoute>
          }
        />

        {/* Public info pages */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/using-ai" element={<UsingAIPage />} />
        
        {/* Footer pages - Product */}
        <Route path="/consultants" element={<ConsultantsPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
        
        {/* Footer pages - Resources */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/status" element={<StatusPage />} />
        
        {/* Footer pages - Company */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
