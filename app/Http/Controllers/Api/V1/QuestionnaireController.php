<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ConsultationRequest;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class QuestionnaireController extends Controller
{
    /**
     * Get the active questionnaire.
     */
    public function show(): JsonResponse
    {
        // In production, fetch from database via Filament CMS
        // For now, return a static questionnaire structure
        $questionnaire = [
            'id' => 1,
            'title' => 'Consultation Request',
            'description' => 'Please provide details about your technical challenge so we can match you with the right expert.',
            'questions' => [
                [
                    'id' => 'problem_description',
                    'question' => 'Describe your problem or challenge',
                    'help_text' => 'Be as specific as possible. Include what you\'re trying to achieve and what\'s blocking you.',
                    'type' => 'textarea',
                    'is_required' => true,
                    'validation_rules' => 'min:50|max:5000',
                ],
                [
                    'id' => 'tech_stack',
                    'question' => 'What technologies are you working with?',
                    'help_text' => 'Select all that apply',
                    'type' => 'multiselect',
                    'options' => [
                        'JavaScript', 'TypeScript', 'Python', 'PHP', 'Ruby', 'Java', 'C#', 'Go', 'Rust',
                        'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Django', 'Laravel', 'Rails',
                        'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
                        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
                        'Other',
                    ],
                    'is_required' => true,
                ],
                [
                    'id' => 'error_logs',
                    'question' => 'Paste any relevant error messages or logs',
                    'help_text' => 'This helps our experts understand your issue faster',
                    'type' => 'textarea',
                    'is_required' => false,
                    'validation_rules' => 'max:10000',
                ],
                [
                    'id' => 'urgency',
                    'question' => 'How urgent is this issue?',
                    'type' => 'select',
                    'options' => [
                        ['value' => 'low', 'label' => 'Low - I can wait'],
                        ['value' => 'medium', 'label' => 'Medium - Need help within a few hours'],
                        ['value' => 'high', 'label' => 'High - Need help ASAP'],
                    ],
                    'is_required' => true,
                ],
                [
                    'id' => 'previous_attempts',
                    'question' => 'What have you already tried?',
                    'help_text' => 'List any solutions you\'ve attempted',
                    'type' => 'textarea',
                    'is_required' => false,
                    'validation_rules' => 'max:2000',
                ],
            ],
        ];

        return response()->json([
            'questionnaire' => $questionnaire,
        ]);
    }

    /**
     * Submit questionnaire and create consultation request.
     */
    public function submit(Request $request): JsonResponse
    {
        $request->validate([
            'problem_description' => 'required|string|min:50|max:5000',
            'tech_stack' => 'required|array|min:1',
            'tech_stack.*' => 'string',
            'error_logs' => 'nullable|string|max:10000',
            'urgency' => 'required|in:low,medium,high',
            'previous_attempts' => 'nullable|string|max:2000',
        ]);

        $user = $request->user();

        // Check if user has sufficient tokens
        if ($user->tokens_balance < 10) {
            return response()->json([
                'message' => 'Insufficient tokens. Please purchase more tokens to start a consultation.',
                'tokens_balance' => $user->tokens_balance,
                'minimum_required' => 10,
            ], 400);
        }

        // Check if user already has an active consultation request
        $existingRequest = ConsultationRequest::where('user_id', $user->id)
            ->active()
            ->first();

        if ($existingRequest) {
            return response()->json([
                'message' => 'You already have an active consultation request',
                'consultation_request_id' => $existingRequest->id,
            ], 400);
        }

        try {
            DB::beginTransaction();

            $consultationRequest = ConsultationRequest::create([
                'user_id' => $user->id,
                'problem_description' => $request->problem_description,
                'tech_stack' => $request->tech_stack,
                'error_logs' => $request->error_logs,
                'questionnaire_responses' => [
                    'urgency' => $request->urgency,
                    'previous_attempts' => $request->previous_attempts,
                ],
                'status' => ConsultationRequest::STATUS_PENDING,
            ]);

            AuditLog::log(
                'consultation_request_created',
                $user->id,
                ConsultationRequest::class,
                $consultationRequest->id,
                null,
                [
                    'tech_stack' => $request->tech_stack,
                    'urgency' => $request->urgency,
                ]
            );

            DB::commit();

            // In production, dispatch job to find matching consultants
            // MatchConsultantJob::dispatch($consultationRequest);

            return response()->json([
                'message' => 'Consultation request submitted successfully. We\'re finding the best expert for you.',
                'consultation_request' => [
                    'id' => $consultationRequest->id,
                    'status' => $consultationRequest->status,
                    'created_at' => $consultationRequest->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to submit consultation request. Please try again.',
            ], 500);
        }
    }
}

