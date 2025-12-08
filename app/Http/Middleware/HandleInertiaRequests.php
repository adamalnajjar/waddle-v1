<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'first_name' => $request->user()->first_name,
                    'last_name' => $request->user()->last_name,
                    'email' => $request->user()->email,
                    'username' => $request->user()->username,
                    'bio' => $request->user()->bio,
                    'profile_photo_path' => $request->user()->profile_photo_path,
                    'profile_photo_url' => $request->user()->profile_photo_url,
                    'development_competency' => $request->user()->development_competency,
                    'is_consultant' => $request->user()->consultantProfile !== null,
                    'is_admin' => $request->user()->isAdmin(),
                    'token_balance' => $request->user()->tokens_balance ?? 0,
                    'profile_completed' => $request->user()->hasCompletedProfile(),
                    'created_at' => $request->user()->created_at?->toISOString(),
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
