<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ConsultantAvailability;
use App\Models\ConsultantInvitation;
use Illuminate\Http\Request;

class ConsultantController extends Controller
{
    /**
     * Toggle the consultant's availability status.
     */
    public function toggleAvailability(Request $request)
    {
        $user = $request->user();
        $profile = $user->consultantProfile;

        if (!$profile) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }

        $profile->is_available = !$profile->is_available;
        $profile->save();

        $status = $profile->is_available ? 'available' : 'unavailable';
        
        return back()->with('success', "You are now {$status} for consultations.");
    }

    /**
     * Accept a consultation invitation.
     */
    public function acceptInvitation(Request $request, $invitationId)
    {
        $user = $request->user();
        
        if (!$user->consultantProfile) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }
        
        $invitation = ConsultantInvitation::where('id', $invitationId)
            ->where('consultant_id', $user->consultantProfile->id)
            ->firstOrFail();

        if (!$invitation->canRespond()) {
            return back()->withErrors(['error' => 'This invitation can no longer be accepted.']);
        }

        if ($invitation->accept()) {
            return back()->with('success', 'Invitation accepted! You can now start the consultation.');
        }

        return back()->withErrors(['error' => 'Failed to accept invitation.']);
    }

    /**
     * Decline a consultation invitation.
     */
    public function declineInvitation(Request $request, $invitationId)
    {
        $user = $request->user();
        
        if (!$user->consultantProfile) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }
        
        $invitation = ConsultantInvitation::where('id', $invitationId)
            ->where('consultant_id', $user->consultantProfile->id)
            ->firstOrFail();

        if (!$invitation->canRespond()) {
            return back()->withErrors(['error' => 'This invitation can no longer be declined.']);
        }

        $reason = $request->input('reason');
        
        if ($invitation->decline($reason)) {
            return back()->with('success', 'Invitation declined.');
        }

        return back()->withErrors(['error' => 'Failed to decline invitation.']);
    }

    /**
     * Update consultant availability schedule.
     */
    public function updateAvailability(Request $request)
    {
        $validated = $request->validate([
            'schedule' => ['required', 'array'],
            'schedule.*.day_of_week' => ['required', 'integer', 'min:0', 'max:6'],
            'schedule.*.start_time' => ['required', 'date_format:H:i'],
            'schedule.*.end_time' => ['required', 'date_format:H:i', 'after:schedule.*.start_time'],
            'schedule.*.is_active' => ['boolean'],
            'timezone' => ['nullable', 'string', 'timezone'],
        ]);

        $user = $request->user();
        $profile = $user->consultantProfile;

        if (!$profile) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }

        $timezone = $validated['timezone'] ?? 'UTC';

        // Delete existing availability and create new ones
        $profile->availability()->delete();

        foreach ($validated['schedule'] as $slot) {
            ConsultantAvailability::create([
                'consultant_id' => $profile->id,
                'day_of_week' => $slot['day_of_week'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'timezone' => $timezone,
                'is_active' => $slot['is_active'] ?? true,
            ]);
        }

        return back()->with('success', 'Availability schedule updated.');
    }
}
