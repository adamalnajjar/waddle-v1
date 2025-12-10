<?php

namespace App\Filament\Resources\ConsultationRequestResource\Pages;

use App\Filament\Resources\ConsultationRequestResource;
use App\Models\Consultant;
use App\Models\ConsultantInvitation;
use App\Models\ConsultationRequest;
use App\Services\ConsultantMatchingService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MatchConsultationRequest extends Page
{
    use InteractsWithRecord;

    protected static string $resource = ConsultationRequestResource::class;

    protected static string $view = 'filament.resources.consultation-request-resource.pages.match-consultation-request';

    public ?array $selectedConsultants = [];
    
    public Collection $suggestedConsultants;
    
    public Collection $allConsultants;

    public function mount(int | string $record): void
    {
        $this->record = $this->resolveRecord($record);
        
        // Load relationships
        $this->record->load(['user']);
        
        // Get algorithm-suggested consultants based on tech stack
        $matchingService = app(ConsultantMatchingService::class);
        
        // Since ConsultantMatchingService expects ProblemSubmission, we'll do manual matching
        // based on tech stack similarity
        $this->suggestedConsultants = $this->findMatchingConsultants($this->record);
        
        // Get all available consultants for manual selection
        $this->allConsultants = Consultant::with(['user', 'technologies'])
            ->where('is_available', true)
            ->where('status', 'approved')
            ->get();
    }

    protected function findMatchingConsultants(ConsultationRequest $request): Collection
    {
        if (empty($request->tech_stack)) {
            return collect();
        }

        $consultants = Consultant::with(['user', 'technologies'])
            ->where('is_available', true)
            ->where('status', 'approved')
            ->get();

        // Calculate match scores based on tech stack overlap
        $consultants = $consultants->map(function ($consultant) use ($request) {
            $consultantTechs = $consultant->technologies->pluck('name')->toArray();
            $requestTechs = $request->tech_stack;
            
            $matchingTechs = array_intersect($consultantTechs, $requestTechs);
            $matchScore = count($requestTechs) > 0 
                ? round((count($matchingTechs) / count($requestTechs)) * 100)
                : 0;
            
            $consultant->match_score = $matchScore;
            return $consultant;
        });

        // Filter and sort by match score
        return $consultants->filter(fn($c) => $c->match_score > 0)
            ->sortByDesc('match_score');
    }

    public function getTitle(): string
    {
        return 'Match Consultation Request #' . $this->record->id;
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
                $existing = ConsultantInvitation::where('consultation_request_id', $this->record->id)
                    ->where('consultant_id', $consultantId)
                    ->first();
                
                if ($existing) {
                    continue;
                }

                ConsultantInvitation::create([
                    'consultation_request_id' => $this->record->id,
                    'consultant_id' => $consultantId,
                    'invited_by' => auth()->id(),
                    'status' => 'pending',
                    'invited_at' => now(),
                    'expires_at' => now()->addHours(24),
                    'is_surge' => false,
                    'surge_multiplier' => 1.0,
                ]);
            }

            // Update consultation request status to invited
            $this->record->update(['status' => ConsultationRequest::STATUS_INVITED]);

            DB::commit();

            Notification::make()
                ->title('Invitations sent successfully')
                ->success()
                ->send();

            $this->redirect(ConsultationRequestResource::getUrl('view', ['record' => $this->record]));
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
                $existing = ConsultantInvitation::where('consultation_request_id', $this->record->id)
                    ->where('consultant_id', $consultantId)
                    ->first();
                
                if ($existing) {
                    continue;
                }

                ConsultantInvitation::create([
                    'consultation_request_id' => $this->record->id,
                    'consultant_id' => $consultantId,
                    'invited_by' => auth()->id(),
                    'status' => 'pending',
                    'invited_at' => now(),
                    'expires_at' => now()->addHours(24),
                    'is_surge' => false,
                    'surge_multiplier' => 1.0,
                ]);
            }

            // Update consultation request status to invited
            $this->record->update(['status' => ConsultationRequest::STATUS_INVITED]);

            DB::commit();

            Notification::make()
                ->title('All matching consultants invited')
                ->body(count($consultantIds) . ' invitations sent')
                ->success()
                ->send();

            $this->redirect(ConsultationRequestResource::getUrl('view', ['record' => $this->record]));
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
        $existing = ConsultantInvitation::where('consultation_request_id', $this->record->id)
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
        
        if (!$consultant->is_surge_available) {
            Notification::make()
                ->title('Consultant has not opted into surge pricing')
                ->warning()
                ->send();
            return;
        }

        DB::beginTransaction();
        try {

            ConsultantInvitation::create([
                'consultation_request_id' => $this->record->id,
                'consultant_id' => $consultantId,
                'invited_by' => auth()->id(),
                'status' => 'pending',
                'invited_at' => now(),
                'expires_at' => now()->addHours(24),
                'is_surge' => true,
                'surge_multiplier' => 1.2,
            ]);

            // Update consultation request status to invited
            $this->record->update(['status' => ConsultationRequest::STATUS_INVITED]);

            DB::commit();

            Notification::make()
                ->title('Surge pricing invitation sent')
                ->body('Consultant will receive 1.2x pay for this job')
                ->success()
                ->send();

            $this->redirect(ConsultationRequestResource::getUrl('view', ['record' => $this->record]));
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
