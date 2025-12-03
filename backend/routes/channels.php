<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Consultation;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Private user channel for notifications
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private consultation channel for real-time messages
Broadcast::channel('consultation.{consultationId}', function ($user, $consultationId) {
    $consultation = Consultation::find($consultationId);
    
    if (!$consultation) {
        return false;
    }
    
    // Allow if user is the client
    if ($consultation->user_id === $user->id) {
        return true;
    }
    
    // Allow if user is the consultant
    if ($user->consultantProfile && $consultation->consultant_id === $user->consultantProfile->id) {
        return true;
    }
    
    // Allow admins
    if ($user->isAdmin()) {
        return true;
    }
    
    return false;
});

// Presence channel for consultation (shows who's online)
Broadcast::channel('consultation.{consultationId}.presence', function ($user, $consultationId) {
    $consultation = Consultation::find($consultationId);
    
    if (!$consultation) {
        return false;
    }
    
    // Check if user is part of the consultation
    if ($consultation->user_id === $user->id) {
        return [
            'id' => $user->id,
            'name' => $user->full_name,
            'role' => 'client',
        ];
    }
    
    if ($user->consultantProfile && $consultation->consultant_id === $user->consultantProfile->id) {
        return [
            'id' => $user->id,
            'name' => $user->full_name,
            'role' => 'consultant',
        ];
    }
    
    return false;
});

