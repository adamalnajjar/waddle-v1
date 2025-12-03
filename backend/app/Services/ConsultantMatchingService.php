<?php

namespace App\Services;

use App\Models\Consultant;
use App\Models\ConsultationRequest;
use App\Models\ProblemSubmission;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ConsultantMatchingService
{
    /**
     * Find matching consultants for a problem submission (for admin matching interface).
     * Returns a collection of consultants with match scores.
     */
    public function findMatchingConsultants(ProblemSubmission $problem): Collection
    {
        $technologyIds = $problem->technologies->pluck('id')->toArray();
        
        // Get available consultants with their technologies
        $consultants = Consultant::where('is_available', true)
            ->with(['user', 'technologies'])
            ->get();

        if ($consultants->isEmpty()) {
            Log::info('No available consultants found for problem', [
                'problem_id' => $problem->id,
            ]);
            return collect();
        }

        // Score and filter consultants
        $scoredConsultants = $consultants->map(function ($consultant) use ($technologyIds, $problem) {
            $score = $this->calculateProblemMatchScore($consultant, $technologyIds, $problem);
            $consultant->match_score = $score;
            return $consultant;
        });

        // Filter consultants with at least some match and sort by score
        return $scoredConsultants
            ->filter(fn ($c) => $c->match_score > 0)
            ->sortByDesc('match_score')
            ->values();
    }

    /**
     * Calculate match score for problem submission matching.
     */
    private function calculateProblemMatchScore(Consultant $consultant, array $technologyIds, ProblemSubmission $problem): int
    {
        $score = 0;
        $consultantTechIds = $consultant->technologies->pluck('id')->toArray();

        // Technology match (0-60 points)
        if (!empty($technologyIds) && !empty($consultantTechIds)) {
            $matchCount = count(array_intersect($technologyIds, $consultantTechIds));
            $totalRequired = count($technologyIds);
            
            if ($totalRequired > 0) {
                $matchPercentage = ($matchCount / $totalRequired) * 100;
                $score += (int) ($matchPercentage * 0.6); // Max 60 points
            }
        }

        // Availability bonus (0-20 points)
        if ($this->isCurrentlyAvailable($consultant)) {
            $score += 20;
        }

        // Rating bonus (0-15 points)
        $avgRating = $this->getAverageRating($consultant);
        if ($avgRating) {
            $score += (int) ($avgRating * 3); // Max 15 points for 5-star rating
        }

        // Experience bonus (0-5 points)
        $completedCount = $consultant->consultations()
            ->where('status', 'completed')
            ->count();
        $score += min(5, $completedCount);

        return $score;
    }

    /**
     * Find the best matching consultant for a consultation request.
     */
    public function findMatch(ConsultationRequest $request): ?Consultant
    {
        $user = $request->user;
        $techStack = $request->tech_stack ?? [];
        $excludedConsultants = $request->excluded_consultants ?? [];

        // Get available consultants
        $consultants = Consultant::available()
            ->whereNotIn('id', $excludedConsultants)
            ->with('user', 'availability')
            ->get();

        if ($consultants->isEmpty()) {
            Log::info('No available consultants found', [
                'request_id' => $request->id,
            ]);
            return null;
        }

        // Score each consultant
        $scoredConsultants = $consultants->map(function ($consultant) use ($techStack, $user) {
            $score = $this->calculateMatchScore($consultant, $techStack, $user);
            return [
                'consultant' => $consultant,
                'score' => $score,
            ];
        });

        // Sort by score (highest first) and prioritize subscribers
        $sorted = $scoredConsultants->sortByDesc(function ($item) use ($user) {
            $priorityBonus = $user->hasActiveSubscription() ? 100 : 0;
            return $item['score'] + $priorityBonus;
        });

        $bestMatch = $sorted->first();

        if ($bestMatch && $bestMatch['score'] > 0) {
            Log::info('Consultant matched', [
                'request_id' => $request->id,
                'consultant_id' => $bestMatch['consultant']->id,
                'score' => $bestMatch['score'],
            ]);
            return $bestMatch['consultant'];
        }

        Log::info('No suitable consultant match found', [
            'request_id' => $request->id,
            'tech_stack' => $techStack,
        ]);

        return null;
    }

    /**
     * Calculate match score between consultant and request.
     */
    private function calculateMatchScore(Consultant $consultant, array $techStack, User $user): int
    {
        $score = 0;
        $specializations = $consultant->specializations ?? [];

        // Tech stack match (0-50 points)
        if (!empty($techStack) && !empty($specializations)) {
            $matchCount = count(array_intersect(
                array_map('strtolower', $techStack),
                array_map('strtolower', $specializations)
            ));
            $score += min(50, $matchCount * 10);
        }

        // Availability score (0-20 points)
        if ($this->isCurrentlyAvailable($consultant)) {
            $score += 20;
        }

        // Rating bonus (0-20 points)
        $avgRating = $this->getAverageRating($consultant);
        if ($avgRating) {
            $score += (int) ($avgRating * 4); // Max 20 points for 5-star rating
        }

        // Experience bonus (0-10 points based on completed consultations)
        $completedCount = $consultant->consultations()
            ->where('status', 'completed')
            ->count();
        $score += min(10, $completedCount);

        return $score;
    }

    /**
     * Check if consultant is currently available based on their schedule.
     */
    private function isCurrentlyAvailable(Consultant $consultant): bool
    {
        $now = now();
        $dayOfWeek = $now->dayOfWeek;
        $currentTime = $now->format('H:i:s');

        return $consultant->availability()
            ->active()
            ->forDay($dayOfWeek)
            ->where('start_time', '<=', $currentTime)
            ->where('end_time', '>=', $currentTime)
            ->exists();
    }

    /**
     * Get average rating for a consultant.
     */
    private function getAverageRating(Consultant $consultant): ?float
    {
        $avg = $consultant->consultations()
            ->whereNotNull('user_rating')
            ->avg('user_rating');

        return $avg ? round($avg, 2) : null;
    }

    /**
     * Match a consultation request and update its status.
     */
    public function matchAndUpdate(ConsultationRequest $request): bool
    {
        $request->update(['status' => ConsultationRequest::STATUS_MATCHING]);

        $consultant = $this->findMatch($request);

        if ($consultant) {
            $request->update([
                'matched_consultant_id' => $consultant->id,
                'status' => ConsultationRequest::STATUS_MATCHED,
                'matched_at' => now(),
            ]);

            // TODO: Send notification to consultant
            // TODO: Send notification to user

            return true;
        }

        // No match found, keep in matching status
        // Could implement a retry mechanism or notify user
        return false;
    }
}

