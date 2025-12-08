<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Complete the user's profile after registration.
     */
    public function completeProfile(Request $request)
    {
        $validated = $request->validate([
            'bio' => ['required', 'string', 'min:10', 'max:500'],
            'development_competency' => ['required', 'string', 'in:beginner,intermediate,advanced,senior'],
            'profile_photo' => ['nullable', 'image', 'max:5120'], // 5MB max
        ]);

        $user = $request->user();

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $user->profile_photo_path = $path;
        }

        $user->bio = $validated['bio'];
        $user->development_competency = $validated['development_competency'];
        $user->profile_completed_at = now();
        $user->save();

        return redirect('/dashboard')->with('success', 'Profile completed successfully!');
    }

    /**
     * Update the user's profile.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:500'],
            'development_competency' => ['nullable', 'string', 'in:beginner,intermediate,advanced,senior'],
        ]);

        $user = $request->user();
        $user->update($validated);

        return back()->with('success', 'Profile updated successfully!');
    }
}
