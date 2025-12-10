<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ConsultantAvailability;
use App\Models\ConsultantInvitation;
use App\Models\ConsultationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultantController extends Controller
{
    /**
     * Display the consultant dashboard with invitations and stats.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user->consultant) {
            abort(403, 'You do not have a consultant profile.');
        }

        $consultant = $user->consultant;

        // Get pending invitations
        $pendingInvitations = ConsultantInvitation::where('consultant_id', $consultant->id)
            ->where('status', ConsultantInvitation::STATUS_PENDING)
            ->with(['consultationRequest.user'])
            ->whereHas('consultationRequest')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get scheduled consultations (upcoming meetings)
        $scheduledConsultations = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->whereIn('status', [
                ConsultationRequest::STATUS_SCHEDULED,
                ConsultationRequest::STATUS_READY,
            ])
            ->with('user')
            ->orderBy('agreed_time', 'asc')
            ->get();

        // Get today's consultations count
        $todayConsultations = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->whereDate('agreed_time', today())
            ->count();

        // Get active consultations count
        $activeConsultations = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->where('status', ConsultationRequest::STATUS_IN_PROGRESS)
            ->count();

        // Get weekly completed count
        $weeklyCompleted = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->where('status', ConsultationRequest::STATUS_COMPLETED)
            ->where('updated_at', '>=', now()->startOfWeek())
            ->count();

        // Get monthly earnings (simplified - would need proper calculation)
        $monthlyEarnings = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->where('status', ConsultationRequest::STATUS_COMPLETED)
            ->where('updated_at', '>=', now()->startOfMonth())
            ->count() * 50; // Placeholder calculation

        return Inertia::render('Consultant/Dashboard', [
            'pending_invitations' => $pendingInvitations,
            'scheduled_consultations' => $scheduledConsultations,
            'stats' => [
                'pending_requests' => $pendingInvitations->count(),
                'active_consultations' => $activeConsultations,
                'today_scheduled' => $todayConsultations,
                'weekly_completed' => $weeklyCompleted,
                'monthly_earnings' => $monthlyEarnings,
            ],
            'profile' => [
                'is_available' => $consultant->is_available,
                'status' => $consultant->status,
            ],
        ]);
    }

    /**
     * Display the consultant invitations page.
     */
    public function showInvitations(Request $request)
    {
        $user = $request->user();
        
        if (!$user->consultant) {
            abort(403, 'You do not have a consultant profile.');
        }

        $invitations = ConsultantInvitation::where('consultant_id', $user->consultant->id)
            ->where('status', ConsultantInvitation::STATUS_PENDING)
            ->with(['consultationRequest.user'])
            ->whereHas('consultationRequest')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Consultant/Invitations', [
            'invitations' => $invitations,
        ]);
    }

    /**
     * Accept a consultation invitation with proposed time.
     */
    public function acceptInvitation(Request $request, ConsultantInvitation $invitation)
    {
        $user = $request->user();
        
        if (!$user->consultant) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }

        // Verify this invitation belongs to the consultant
        if ($invitation->consultant_id !== $user->consultant->id) {
            abort(403, 'This invitation does not belong to you.');
        }

        if (!$invitation->canRespond()) {
            return back()->withErrors(['error' => 'This invitation can no longer be accepted.']);
        }

        $validated = $request->validate([
            'proposed_time' => ['required', 'date', 'after:now'],
            'proposal_message' => ['nullable', 'string', 'max:500'],
        ]);

        // Update invitation status and proposed time
        $invitation->update([
            'status' => ConsultantInvitation::STATUS_ACCEPTED,
            'responded_at' => now(),
            'proposed_time' => $validated['proposed_time'],
            'proposal_message' => $validated['proposal_message'] ?? null,
        ]);

        // Update consultation request
        $consultationRequest = $invitation->consultationRequest;
        $consultationRequest->update([
            'status' => ConsultationRequest::STATUS_TIME_PROPOSED,
            'matched_consultant_id' => $invitation->consultant_id,
            'matched_at' => now(),
            'proposed_time' => $validated['proposed_time'],
        ]);

        // Expire other pending invitations for this consultation request
        ConsultantInvitation::where('consultation_request_id', $invitation->consultation_request_id)
            ->where('id', '!=', $invitation->id)
            ->where('status', ConsultantInvitation::STATUS_PENDING)
            ->update(['status' => ConsultantInvitation::STATUS_EXPIRED]);

        // TODO: Send notification to user about proposed time

        return redirect()->route('consultant.dashboard')
            ->with('success', 'Invitation accepted! Your proposed time has been sent to the user.');
    }

    /**
     * Decline a consultation invitation.
     */
    public function declineInvitation(Request $request, ConsultantInvitation $invitation)
    {
        $user = $request->user();
        
        if (!$user->consultant) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }

        // Verify this invitation belongs to the consultant
        if ($invitation->consultant_id !== $user->consultant->id) {
            abort(403, 'This invitation does not belong to you.');
        }

        if (!$invitation->canRespond()) {
            return back()->withErrors(['error' => 'This invitation can no longer be declined.']);
        }

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $invitation->update([
            'status' => ConsultantInvitation::STATUS_DECLINED,
            'responded_at' => now(),
            'decline_reason' => $validated['reason'] ?? null,
        ]);

        // Check if there are other pending invitations
        $hasPendingInvitations = ConsultantInvitation::where('consultation_request_id', $invitation->consultation_request_id)
            ->where('status', ConsultantInvitation::STATUS_PENDING)
            ->exists();

        // If no other pending invitations, revert consultation request to pending
        if (!$hasPendingInvitations) {
            $consultationRequest = $invitation->consultationRequest;
            $consultationRequest->update([
                'status' => ConsultationRequest::STATUS_PENDING,
            ]);
        }

        return back()->with('success', 'Invitation declined.');
    }

    /**
     * Toggle the consultant's availability status.
     */
    public function toggleAvailability(Request $request)
    {
        $user = $request->user();
        $profile = $user->consultant;

        if (!$profile) {
            return back()->withErrors(['error' => 'Consultant profile not found.']);
        }

        $profile->is_available = !$profile->is_available;
        $profile->save();

        $status = $profile->is_available ? 'available' : 'unavailable';
        
        return back()->with('success', "You are now {$status} for consultations.");
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
        $profile = $user->consultant;

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
