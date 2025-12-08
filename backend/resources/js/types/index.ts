export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    profile_photo_path: string | null;
    is_consultant: boolean;
    is_admin: boolean;
    token_balance: number;
    profile_completed: boolean;
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
