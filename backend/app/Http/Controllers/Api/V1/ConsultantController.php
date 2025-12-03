<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Consultant;
use App\Models\ConsultantAvailability;
use App\Models\ConsultationRequest;
use App\Models\Consultation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ConsultantController extends Controller
{
    /**
     * Get consultant profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        $consultant = $user->consultantProfile;

        if (!$consultant) {
            return response()->json([
                'message' => 'Consultant profile not found',
            ], 404);
        }

        return response()->json([
            'profile' => [
                'id' => $consultant->id,
                'specializations' => $consultant->specializations,
                'bio' => $consultant->bio,
                'languages' => $consultant->languages,
                'hourly_rate' => $consultant->hourly_rate,
                'status' => $consultant->status,
                'is_available' => $consultant->is_available,
                'approved_at' => $consultant->approved_at,
            ],
        ]);
    }

    /**
     * Update consultant profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'specializations' => 'sometimes|array',
            'specializations.*' => 'string|max:100',
            'bio' => 'sometimes|string|max:2000',
            'languages' => 'sometimes|array',
            'languages.*' => 'string|max:50',
            'hourly_rate' => 'sometimes|numeric|min:0|max:1000',
        ]);

        $user = $request->user();
        $consultant = $user->consultantProfile;

        if (!$consultant) {
            // Create consultant profile if it doesn't exist
            $consultant = Consultant::create([
                'user_id' => $user->id,
                'specializations' => $request->specializations ?? [],
                'bio' => $request->bio,
                'languages' => $request->languages ?? [],
                'hourly_rate' => $request->hourly_rate,
                'status' => Consultant::STATUS_PENDING,
            ]);

            return response()->json([
                'message' => 'Consultant profile created. Pending approval.',
                'profile' => $consultant,
            ], 201);
        }

        $oldValues = $consultant->only(['specializations', 'bio', 'languages', 'hourly_rate']);
        
        $consultant->update($request->only(['specializations', 'bio', 'languages', 'hourly_rate']));

        AuditLog::log(
            'consultant_profile_updated',
            $user->id,
            Consultant::class,
            $consultant->id,
            $oldValues,
            $consultant->only(['specializations', 'bio', 'languages', 'hourly_rate'])
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $consultant->fresh(),
        ]);
    }

    /**
     * Get consultant availability.
     */
    public function availability(Request $request): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        $availability = $consultant->availability()
            ->active()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'availability' => $availability,
            'is_available' => $consultant->is_available,
        ]);
    }

    /**
     * Update consultant availability.
     */
    public function updateAvailability(Request $request): JsonResponse
    {
        $request->validate([
            'slots' => 'required|array',
            'slots.*.day_of_week' => 'required|integer|min:0|max:6',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
            'slots.*.timezone' => 'sometimes|string|timezone',
            'slots.*.is_active' => 'sometimes|boolean',
        ]);

        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        try {
            DB::beginTransaction();

            // Remove existing availability
            $consultant->availability()->delete();

            // Create new availability slots
            foreach ($request->slots as $slot) {
                ConsultantAvailability::create([
                    'consultant_id' => $consultant->id,
                    'day_of_week' => $slot['day_of_week'],
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                    'timezone' => $slot['timezone'] ?? 'UTC',
                    'is_active' => $slot['is_active'] ?? true,
                ]);
            }

            AuditLog::log(
                'consultant_availability_updated',
                $request->user()->id,
                Consultant::class,
                $consultant->id
            );

            DB::commit();

            return response()->json([
                'message' => 'Availability updated successfully',
                'availability' => $consultant->availability()->active()->get(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update availability'], 500);
        }
    }

    /**
     * Toggle availability status.
     */
    public function toggleAvailability(Request $request): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        if (!$consultant->isApproved()) {
            return response()->json([
                'message' => 'Your profile must be approved before you can accept consultations',
            ], 400);
        }

        $consultant->update(['is_available' => !$consultant->is_available]);

        AuditLog::log(
            'consultant_availability_toggled',
            $request->user()->id,
            Consultant::class,
            $consultant->id,
            null,
            ['is_available' => $consultant->is_available]
        );

        return response()->json([
            'message' => $consultant->is_available ? 'You are now available' : 'You are now unavailable',
            'is_available' => $consultant->is_available,
        ]);
    }

    /**
     * Get pending consultation requests.
     */
    public function requests(Request $request): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        $requests = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->whereIn('status', [
                ConsultationRequest::STATUS_MATCHED,
                ConsultationRequest::STATUS_MATCHING,
            ])
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'requests' => $requests->items(),
            'pagination' => [
                'current_page' => $requests->currentPage(),
                'last_page' => $requests->lastPage(),
                'per_page' => $requests->perPage(),
                'total' => $requests->total(),
            ],
        ]);
    }

    /**
     * Accept consultation request.
     */
    public function acceptRequest(Request $request, int $id): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        $consultationRequest = ConsultationRequest::findOrFail($id);

        if ($consultationRequest->matched_consultant_id !== $consultant->id) {
            return response()->json(['message' => 'This request is not assigned to you'], 403);
        }

        if ($consultationRequest->status !== ConsultationRequest::STATUS_MATCHED) {
            return response()->json([
                'message' => 'This request cannot be accepted',
            ], 400);
        }

        $consultationRequest->update(['status' => ConsultationRequest::STATUS_IN_PROGRESS]);

        AuditLog::log(
            'consultation_request_accepted',
            $request->user()->id,
            ConsultationRequest::class,
            $consultationRequest->id
        );

        return response()->json([
            'message' => 'Request accepted. The user will be notified.',
        ]);
    }

    /**
     * Decline consultation request.
     */
    public function declineRequest(Request $request, int $id): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        $consultationRequest = ConsultationRequest::findOrFail($id);

        if ($consultationRequest->matched_consultant_id !== $consultant->id) {
            return response()->json(['message' => 'This request is not assigned to you'], 403);
        }

        // Remove match and put back in matching queue
        $consultationRequest->excludeConsultant($consultant->id);
        $consultationRequest->update([
            'matched_consultant_id' => null,
            'status' => ConsultationRequest::STATUS_MATCHING,
        ]);

        AuditLog::log(
            'consultation_request_declined',
            $request->user()->id,
            ConsultationRequest::class,
            $consultationRequest->id
        );

        // In production, dispatch job to find new consultant
        // MatchConsultantJob::dispatch($consultationRequest);

        return response()->json([
            'message' => 'Request declined. It will be reassigned to another consultant.',
        ]);
    }

    /**
     * Get consultant earnings.
     */
    public function earnings(Request $request): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        $consultations = Consultation::forConsultant($consultant->id)
            ->completed()
            ->selectRaw('
                COUNT(*) as total_consultations,
                SUM(duration_minutes) as total_minutes,
                SUM(tokens_charged) as total_tokens
            ')
            ->first();

        $recentConsultations = Consultation::forConsultant($consultant->id)
            ->completed()
            ->with('user')
            ->orderBy('ended_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate monthly earnings
        $monthlyEarnings = Consultation::forConsultant($consultant->id)
            ->completed()
            ->whereMonth('ended_at', now()->month)
            ->whereYear('ended_at', now()->year)
            ->sum('tokens_charged');

        // Calculate average rating
        $averageRating = Consultation::forConsultant($consultant->id)
            ->completed()
            ->whereNotNull('user_rating')
            ->avg('user_rating');

        return response()->json([
            'summary' => [
                'total_consultations' => $consultations->total_consultations ?? 0,
                'total_minutes' => $consultations->total_minutes ?? 0,
                'total_tokens_earned' => $consultations->total_tokens ?? 0,
                'monthly_tokens' => $monthlyEarnings ?? 0,
                'average_rating' => $averageRating ? round($averageRating, 1) : null,
            ],
            'recent_consultations' => $recentConsultations,
        ]);
    }

    /**
     * Get consultant dashboard statistics.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        // Pending requests count
        $pendingRequests = ConsultationRequest::where('matched_consultant_id', $consultant->id)
            ->where('status', ConsultationRequest::STATUS_MATCHED)
            ->count();

        // Active consultations
        $activeConsultations = Consultation::forConsultant($consultant->id)
            ->active()
            ->with(['user', 'consultationRequest'])
            ->get();

        // Today's scheduled consultations
        $todayConsultations = Consultation::forConsultant($consultant->id)
            ->where('status', Consultation::STATUS_SCHEDULED)
            ->whereDate('created_at', today())
            ->count();

        // This week's completed consultations
        $weeklyCompleted = Consultation::forConsultant($consultant->id)
            ->completed()
            ->where('ended_at', '>=', now()->startOfWeek())
            ->count();

        // Total earnings this month
        $monthlyEarnings = Consultation::forConsultant($consultant->id)
            ->completed()
            ->whereMonth('ended_at', now()->month)
            ->whereYear('ended_at', now()->year)
            ->sum('tokens_charged');

        // Recent reviews
        $recentReviews = Consultation::forConsultant($consultant->id)
            ->completed()
            ->whereNotNull('user_rating')
            ->with('user')
            ->orderBy('ended_at', 'desc')
            ->limit(5)
            ->get(['id', 'user_id', 'user_rating', 'user_feedback', 'ended_at']);

        return response()->json([
            'stats' => [
                'pending_requests' => $pendingRequests,
                'active_consultations' => $activeConsultations->count(),
                'today_scheduled' => $todayConsultations,
                'weekly_completed' => $weeklyCompleted,
                'monthly_earnings' => $monthlyEarnings,
            ],
            'active_consultations' => $activeConsultations,
            'recent_reviews' => $recentReviews,
            'profile' => [
                'is_available' => $consultant->is_available,
                'status' => $consultant->status,
            ],
        ]);
    }

    /**
     * Get consultant's consultation history.
     */
    public function consultationHistory(Request $request): JsonResponse
    {
        $consultant = $request->user()->consultantProfile;

        if (!$consultant) {
            return response()->json(['message' => 'Consultant profile not found'], 404);
        }

        $consultations = Consultation::forConsultant($consultant->id)
            ->with(['user', 'consultationRequest'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'consultations' => $consultations->items(),
            'pagination' => [
                'current_page' => $consultations->currentPage(),
                'last_page' => $consultations->lastPage(),
                'per_page' => $consultations->perPage(),
                'total' => $consultations->total(),
            ],
        ]);
    }
}

