// User types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  role: 'user' | 'consultant' | 'admin';
  tokens_balance: number;
  email_verified_at: string | null;
  two_factor_enabled: boolean;
  has_subscription: boolean;
  subscription: Subscription | null;
  created_at: string;
}

export interface Subscription {
  plan: string | null;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  ends_at: string | null;
  days_until_expiration?: number | null;
}

export interface ConsultantProfile {
  id: number;
  specializations: string[];
  bio: string | null;
  languages: string[];
  hourly_rate: number | null;
  status: 'pending' | 'approved' | 'suspended';
  is_available: boolean;
  approved_at: string | null;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'user' | 'consultant';
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Token types
export interface TokenPackage {
  id: number;
  name: string;
  description: string | null;
  token_amount: number;
  price: number;
  price_per_token: number;
  subscriber_price?: number;
  subscriber_price_per_token?: number;
  effective_price: number;
  is_featured: boolean;
}

export interface TokenTransaction {
  id: number;
  type: 'purchase' | 'deduction' | 'refund' | 'bonus' | 'adjustment';
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

// Subscription types
export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  billing_period: 'monthly' | 'yearly';
  token_discount_percentage: number;
  priority_matching: boolean;
  features: string[] | null;
}

// Consultation types
export interface ConsultationRequest {
  id: number;
  problem_description: string;
  tech_stack: string[];
  error_logs: string | null;
  status: 'pending' | 'matching' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  shuffle_count: number;
  remaining_shuffles: number;
  created_at: string;
}

export interface Consultation {
  id: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  zoom_meeting_id: string | null;
  zoom_join_url: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_minutes: number | null;
  tokens_charged: number;
  user_rating: number | null;
  consultant: {
    id: number;
    name: string;
    specializations: string[];
  } | null;
  request: {
    problem_description: string;
    tech_stack: string[];
  } | null;
  messages_count: number;
  files_count: number;
  created_at: string;
}

export interface ConsultationMessage {
  id: number;
  user_id: number;
  message: string;
  type: 'text' | 'file' | 'code_snippet';
  metadata: Record<string, unknown> | null;
  user: {
    id: number;
    full_name: string;
  };
  created_at: string;
}

export interface ConsultationFile {
  id: number;
  original_name: string;
  mime_type: string;
  size: number;
  human_size: string;
  url: string;
  uploader: {
    id: number;
    full_name: string;
  };
  is_scanned: boolean;
  is_safe: boolean;
  created_at: string;
}

// Questionnaire types
export interface QuestionnaireQuestion {
  id: string;
  question: string;
  help_text?: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox';
  options?: string[] | { value: string; label: string }[];
  is_required: boolean;
  validation_rules?: string;
}

export interface Questionnaire {
  id: number;
  title: string;
  description: string | null;
  questions: QuestionnaireQuestion[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

