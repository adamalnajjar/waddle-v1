<?php

use App\Jobs\CreateZoomMeetingJob;
use App\Jobs\ExpireInvitationsJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule invitation expiry job to run every hour
Schedule::job(new ExpireInvitationsJob)->hourly()
    ->name('expire-invitations')
    ->withoutOverlapping()
    ->onOneServer();

// Schedule Zoom meeting creation job to run every minute
Schedule::job(new CreateZoomMeetingJob)->everyMinute()
    ->name('create-zoom-meetings')
    ->withoutOverlapping()
    ->onOneServer();

// Clean up expired drafts daily at midnight
Schedule::command('model:prune', ['--model' => 'App\\Models\\ProblemSubmission'])
    ->daily()
    ->name('cleanup-drafts')
    ->withoutOverlapping();
