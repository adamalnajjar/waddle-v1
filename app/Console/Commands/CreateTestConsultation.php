<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Consultant;
use App\Models\ProblemSubmission;
use App\Models\ConsultationRequest;
use App\Models\Consultation;
use App\Services\ZoomService;
use Illuminate\Console\Command;

class CreateTestConsultation extends Command
{
    protected $signature = 'test:create-consultation {email? : User email address}';
    protected $description = 'Create a test consultation with Zoom meeting';

    public function handle(ZoomService $zoomService)
    {
        $email = $this->argument('email') ?? 'user@waddle.com';
        $user = User::where('email', $email)->first();
        $consultant = Consultant::first();
        
        if (!$user) {
            $this->error('User not found');
            return 1;
        }
        
        if (!$consultant) {
            $this->error('Consultant not found');
            return 1;
        }

        // Create or get problem submission
        $problem = ProblemSubmission::where('user_id', $user->id)->first();
        if (!$problem) {
            $problem = ProblemSubmission::create([
                'user_id' => $user->id,
                'problem_statement' => 'Need help with Zoom integration testing',
                'error_description' => 'Testing the Zoom SDK integration',
                'status' => 'submitted',
                'submission_cost' => 1,
            ]);
        }

        // Create consultation request
        $consultationRequest = ConsultationRequest::create([
            'user_id' => $user->id,
            'problem_description' => 'Need help with Zoom integration testing',
            'tech_stack' => ['React', 'Laravel', 'Zoom SDK'],
            'status' => ConsultationRequest::STATUS_MATCHED,
            'matched_consultant_id' => $consultant->id,
            'matched_at' => now(),
        ]);

        // Create consultation first (without Zoom details)
        $consultation = Consultation::create([
            'consultation_request_id' => $consultationRequest->id,
            'user_id' => $user->id,
            'consultant_id' => $consultant->id,
            'scheduled_at' => now()->addMinutes(5),
            'duration_minutes' => 60,
            'status' => Consultation::STATUS_SCHEDULED,
        ]);

        // Create Zoom meeting
        $this->info('Creating Zoom meeting...');
        $meeting = $zoomService->createMeeting($consultation);

        // Update consultation with Zoom details
        $consultation->update([
            'zoom_meeting_id' => $meeting['meeting_id'],
            'zoom_join_url' => $meeting['join_url'],
            'zoom_password' => $meeting['password'] ?? null,
        ]);

        $this->info('✅ Created Consultation ID: ' . $consultation->id);
        $this->info('📹 Zoom Meeting ID: ' . $meeting['meeting_id']);
        if (!empty($meeting['password'])) {
            $this->info('🔐 Meeting Password: ' . $meeting['password']);
        } else {
            $this->info('🔐 No password set');
        }
        $this->info('🔗 Meeting URL: http://waddle.test/consultations/' . $consultation->id . '/meeting');

        return 0;
    }
}
