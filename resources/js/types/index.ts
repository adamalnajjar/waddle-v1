export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    bio: string | null;
    profile_photo_path: string | null;
    profile_photo_url: string | null;
    development_competency: 'beginner' | 'intermediate' | 'advanced' | 'senior' | null;
    is_consultant: boolean;
    is_admin: boolean;
    token_balance: number;
    profile_completed: boolean;
    created_at: string | null;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

export type { PageProps as InertiaPageProps };
