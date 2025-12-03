<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProblemSubmission;
use App\Models\ProblemAttachment;
use App\Models\Technology;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ProblemController extends Controller
{
    /**
     * List user's problem submissions.
     */
    public function index(Request $request): JsonResponse
    {
        $problems = $request->user()
            ->problemSubmissions()
            ->with(['technologies', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'problems' => $problems->items(),
            'pagination' => [
                'current_page' => $problems->currentPage(),
                'last_page' => $problems->lastPage(),
                'per_page' => $problems->perPage(),
                'total' => $problems->total(),
            ],
        ]);
    }

    /**
     * Get a specific problem submission.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $problem = $request->user()
            ->problemSubmissions()
            ->with(['technologies', 'attachments', 'invitations.consultant.user'])
            ->findOrFail($id);

        return response()->json([
            'problem' => $this->formatProblem($problem),
        ]);
    }

    /**
     * Save a problem as draft.
     */
    public function saveDraft(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'problem_statement' => 'required|string|min:20|max:5000',
            'error_description' => 'nullable|string|max:10000',
            'technologies' => 'required|json',
            'attachments.*' => 'nullable|file|max:10240', // 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            $problem = ProblemSubmission::create([
                'user_id' => $request->user()->id,
                'problem_statement' => $request->problem_statement,
                'error_description' => $request->error_description,
                'status' => ProblemSubmission::STATUS_DRAFT,
                'draft_expires_at' => Carbon::now()->addDays(ProblemSubmission::DRAFT_EXPIRY_DAYS),
            ]);

            // Attach technologies
            $this->attachTechnologies($problem, json_decode($request->technologies, true));

            // Handle file uploads
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $this->attachFile($problem, $file);
                }
            }

            DB::commit();

            AuditLog::log('problem_draft_saved', $request->user()->id, ProblemSubmission::class, $problem->id);

            return response()->json([
                'message' => 'Draft saved successfully',
                'problem' => $this->formatProblem($problem->fresh(['technologies', 'attachments'])),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to save draft',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing draft.
     */
    public function updateDraft(Request $request, int $id): JsonResponse
    {
        $problem = $request->user()
            ->problemSubmissions()
            ->where('status', ProblemSubmission::STATUS_DRAFT)
            ->findOrFail($id);

        if ($problem->isDraftExpired()) {
            return response()->json([
                'message' => 'This draft has expired',
            ], 410);
        }

        $validator = Validator::make($request->all(), [
            'problem_statement' => 'sometimes|string|min:20|max:5000',
            'error_description' => 'nullable|string|max:10000',
            'technologies' => 'sometimes|json',
            'attachments.*' => 'nullable|file|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            $problem->update([
                'problem_statement' => $request->input('problem_statement', $problem->problem_statement),
                'error_description' => $request->input('error_description', $problem->error_description),
            ]);

            // Update technologies if provided
            if ($request->has('technologies')) {
                $problem->technologies()->detach();
                $this->attachTechnologies($problem, json_decode($request->technologies, true));
            }

            // Handle new file uploads
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $this->attachFile($problem, $file);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Draft updated successfully',
                'problem' => $this->formatProblem($problem->fresh(['technologies', 'attachments'])),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update draft',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit a new problem (creates and submits in one step).
     */
    public function submit(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'problem_statement' => 'required|string|min:20|max:5000',
            'error_description' => 'nullable|string|max:10000',
            'technologies' => 'required|json',
            'attachments.*' => 'nullable|file|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        DB::beginTransaction();

        try {
            // Create the problem
            $problem = ProblemSubmission::create([
                'user_id' => $user->id,
                'problem_statement' => $request->problem_statement,
                'error_description' => $request->error_description,
                'status' => ProblemSubmission::STATUS_DRAFT,
            ]);

            // Attach technologies
            $this->attachTechnologies($problem, json_decode($request->technologies, true));

            // Handle file uploads
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $this->attachFile($problem, $file);
                }
            }

            // Calculate and set fee
            $fee = $problem->calculateSubmissionFee();
            $problem->submission_fee = $fee;

            // Check token balance
            if ($user->tokens_balance < $fee) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Insufficient tokens',
                    'required_tokens' => $fee,
                    'current_balance' => $user->tokens_balance,
                ], 402);
            }

            // Deduct tokens
            $user->decrement('tokens_balance', $fee);

            // Submit the problem
            $problem->status = ProblemSubmission::STATUS_SUBMITTED;
            $problem->submitted_at = Carbon::now();
            $problem->draft_expires_at = null;
            $problem->save();

            DB::commit();

            AuditLog::log('problem_submitted', $user->id, ProblemSubmission::class, $problem->id, null, [
                'fee' => $fee,
            ]);

            return response()->json([
                'message' => 'Problem submitted successfully',
                'problem' => $this->formatProblem($problem->fresh(['technologies', 'attachments'])),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to submit problem',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit an existing draft.
     */
    public function submitDraft(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $problem = $user->problemSubmissions()
            ->where('status', ProblemSubmission::STATUS_DRAFT)
            ->findOrFail($id);

        if ($problem->isDraftExpired()) {
            return response()->json([
                'message' => 'This draft has expired',
            ], 410);
        }

        if (!$problem->canSubmit()) {
            return response()->json([
                'message' => 'This draft cannot be submitted. Please ensure all required fields are filled.',
            ], 422);
        }

        // Calculate fee
        $fee = $problem->calculateSubmissionFee();

        // Check token balance
        if ($user->tokens_balance < $fee) {
            return response()->json([
                'message' => 'Insufficient tokens',
                'required_tokens' => $fee,
                'current_balance' => $user->tokens_balance,
            ], 402);
        }

        DB::beginTransaction();

        try {
            // Deduct tokens
            $user->decrement('tokens_balance', $fee);

            // Submit
            $problem->submission_fee = $fee;
            $problem->status = ProblemSubmission::STATUS_SUBMITTED;
            $problem->submitted_at = Carbon::now();
            $problem->draft_expires_at = null;
            $problem->save();

            DB::commit();

            AuditLog::log('problem_submitted', $user->id, ProblemSubmission::class, $problem->id, null, [
                'fee' => $fee,
            ]);

            return response()->json([
                'message' => 'Problem submitted successfully',
                'problem' => $this->formatProblem($problem->fresh(['technologies', 'attachments'])),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to submit problem',
            ], 500);
        }
    }

    /**
     * Delete a draft.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $problem = $request->user()
            ->problemSubmissions()
            ->where('status', ProblemSubmission::STATUS_DRAFT)
            ->findOrFail($id);

        $problem->delete();

        AuditLog::log('problem_draft_deleted', $request->user()->id, ProblemSubmission::class, $id);

        return response()->json([
            'message' => 'Draft deleted successfully',
        ]);
    }

    /**
     * Add attachment to a problem.
     */
    public function addAttachment(Request $request, int $id): JsonResponse
    {
        $problem = $request->user()
            ->problemSubmissions()
            ->where('status', ProblemSubmission::STATUS_DRAFT)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $attachment = $this->attachFile($problem, $request->file('file'));

        return response()->json([
            'message' => 'Attachment added',
            'attachment' => [
                'id' => $attachment->id,
                'file_name' => $attachment->file_name,
                'file_type' => $attachment->file_type,
                'file_size' => $attachment->file_size,
                'human_size' => $attachment->human_size,
                'url' => $attachment->url,
            ],
        ], 201);
    }

    /**
     * Remove attachment from a problem.
     */
    public function removeAttachment(Request $request, int $problemId, int $attachmentId): JsonResponse
    {
        $problem = $request->user()
            ->problemSubmissions()
            ->where('status', ProblemSubmission::STATUS_DRAFT)
            ->findOrFail($problemId);

        $attachment = $problem->attachments()->findOrFail($attachmentId);
        $attachment->delete();

        return response()->json([
            'message' => 'Attachment removed',
        ]);
    }

    /**
     * Attach technologies to a problem.
     */
    private function attachTechnologies(ProblemSubmission $problem, array $technologies): void
    {
        foreach ($technologies as $tech) {
            if (!empty($tech['id']) && $tech['id'] > 0) {
                // Existing technology
                $problem->technologies()->attach($tech['id'], [
                    'is_custom' => false,
                    'custom_name' => null,
                ]);
            } elseif (!empty($tech['is_custom']) && !empty($tech['custom_name'])) {
                // Custom technology - attach without technology_id
                DB::table('problem_technologies')->insert([
                    'problem_submission_id' => $problem->id,
                    'technology_id' => null,
                    'is_custom' => true,
                    'custom_name' => $tech['custom_name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Attach a file to a problem.
     */
    private function attachFile(ProblemSubmission $problem, $file): ProblemAttachment
    {
        $path = $file->store('problem-attachments', 'public');
        
        return $problem->attachments()->create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);
    }

    /**
     * Format problem for response.
     */
    private function formatProblem(ProblemSubmission $problem): array
    {
        return [
            'id' => $problem->id,
            'problem_statement' => $problem->problem_statement,
            'error_description' => $problem->error_description,
            'status' => $problem->status,
            'submission_fee' => $problem->submission_fee,
            'draft_expires_at' => $problem->draft_expires_at,
            'submitted_at' => $problem->submitted_at,
            'refunded_at' => $problem->refunded_at,
            'technologies' => $problem->technologies->map(function ($tech) {
                return [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'slug' => $tech->slug,
                    'icon_url' => $tech->icon_url,
                ];
            }),
            'attachments' => $problem->attachments->map(function ($att) {
                return [
                    'id' => $att->id,
                    'file_name' => $att->file_name,
                    'file_type' => $att->file_type,
                    'file_size' => $att->file_size,
                    'human_size' => $att->human_size,
                    'url' => $att->url,
                ];
            }),
            'created_at' => $problem->created_at,
            'updated_at' => $problem->updated_at,
        ];
    }
}

