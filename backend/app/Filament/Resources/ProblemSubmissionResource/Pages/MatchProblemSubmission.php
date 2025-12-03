<?php

namespace App\Filament\Resources\ProblemSubmissionResource\Pages;

use App\Filament\Resources\ProblemSubmissionResource;
use App\Models\Consultant;
use App\Models\ConsultantInvitation;
use App\Models\ProblemSubmission;
use App\Services\ConsultantMatchingService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MatchProblemSubmission extends Page
{
    protected static string $resource = ProblemSubmissionResource::class;

    protected static string $view = 'filament.resources.problem-submission-resource.pages.match-problem-submission';

    public ProblemSubmission $record;
    
    public ?array $selectedConsultants = [];
    
    public Collection $suggestedConsultants;
    
    public Collection $allConsultants;

    public function mount(int | string $record): void
    {
        $this->record = ProblemSubmission::with(['user', 'technologies', 'attachments'])->findOrFail($record);
        
        // Get algorithm-suggested consultants
        $matchingService = app(ConsultantMatchingService::class);
        $this->suggestedConsultants = $matchingService->findMatchingConsultants($this->record);
        
        // Get all available consultants for manual selection
        $this->allConsultants = Consultant::with(['user', 'technologies'])
            ->where('is_available', true)
            ->get();
    }

    public function getTitle(): string
    {
        return 'Match Problem #' . $this->record->id;
    }

    public function inviteSelected(): void
    {
        if (empty($this->selectedConsultants)) {
            Notification::make()
                ->title('No consultants selected')
                ->warning()
                ->send();
            return;
        }

        DB::beginTransaction();
        try {
            foreach ($this->selectedConsultants as $consultantId) {
                // Check if invitation already exists
                $existing = ConsultantInvitation::where('problem_submission_id', $this->record->id)
                    ->where('consultant_id', $consultantId)
                    ->first();
                
                if ($existing) {
                    continue;
                }

                ConsultantInvitation::create([
                    'problem_submission_id' => $this->record->id,
                    'consultant_id' => $consultantId,
                    'invited_by' => auth()->id(),
                    'status' => 'pending',
                    'invited_at' => now(),
                    'expires_at' => now()->addHours(24),
                    'is_surge' => false,
                    'surge_multiplier' => 1.0,
                ]);
            }

            // Update problem status to matching
            $this->record->update(['status' => 'matching']);

            DB::commit();

            Notification::make()
                ->title('Invitations sent successfully')
                ->success()
                ->send();

            $this->redirect(ProblemSubmissionResource::getUrl('view', ['record' => $this->record]));
        } catch (\Exception $e) {
            DB::rollBack();
            Notification::make()
                ->title('Error sending invitations')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function inviteAll(): void
    {
        $consultantIds = $this->suggestedConsultants->pluck('id')->toArray();
        
        if (empty($consultantIds)) {
            Notification::make()
                ->title('No matching consultants found')
                ->warning()
                ->send();
            return;
        }

        DB::beginTransaction();
        try {
            foreach ($consultantIds as $consultantId) {
                // Check if invitation already exists
                $existing = ConsultantInvitation::where('problem_submission_id', $this->record->id)
                    ->where('consultant_id', $consultantId)
                    ->first();
                
                if ($existing) {
                    continue;
                }

                ConsultantInvitation::create([
                    'problem_submission_id' => $this->record->id,
                    'consultant_id' => $consultantId,
                    'invited_by' => auth()->id(),
                    'status' => 'pending',
                    'invited_at' => now(),
                    'expires_at' => now()->addHours(24),
                    'is_surge' => false,
                    'surge_multiplier' => 1.0,
                ]);
            }

            // Update problem status to matching
            $this->record->update(['status' => 'matching']);

            DB::commit();

            Notification::make()
                ->title('All matching consultants invited')
                ->body(count($consultantIds) . ' invitations sent')
                ->success()
                ->send();

            $this->redirect(ProblemSubmissionResource::getUrl('view', ['record' => $this->record]));
        } catch (\Exception $e) {
            DB::rollBack();
            Notification::make()
                ->title('Error sending invitations')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function inviteSingleWithSurge(int $consultantId): void
    {
        // Check if invitation already exists (before transaction)
        $existing = ConsultantInvitation::where('problem_submission_id', $this->record->id)
            ->where('consultant_id', $consultantId)
            ->first();
        
        if ($existing) {
            Notification::make()
                ->title('Invitation already sent to this consultant')
                ->warning()
                ->send();
            return;
        }

        $consultant = Consultant::findOrFail($consultantId);
        
        if (!$consultant->can_receive_surge_pricing) {
            Notification::make()
                ->title('Consultant has not opted into surge pricing')
                ->warning()
                ->send();
            return;
        }

        DB::beginTransaction();
        try {

            ConsultantInvitation::create([
                'problem_submission_id' => $this->record->id,
                'consultant_id' => $consultantId,
                'invited_by' => auth()->id(),
                'status' => 'pending',
                'invited_at' => now(),
                'expires_at' => now()->addHours(24),
                'is_surge' => true,
                'surge_multiplier' => 1.2,
            ]);

            // Update problem status to matching
            $this->record->update(['status' => 'matching']);

            DB::commit();

            Notification::make()
                ->title('Surge pricing invitation sent')
                ->body('Consultant will receive 1.2x pay for this job')
                ->success()
                ->send();

        } catch (\Exception $e) {
            DB::rollBack();
            Notification::make()
                ->title('Error sending invitation')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}

