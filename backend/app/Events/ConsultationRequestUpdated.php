<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\ConsultationRequest;

class ConsultationRequestUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ConsultationRequest $consultationRequest;
    public string $action;

    /**
     * Create a new event instance.
     */
    public function __construct(ConsultationRequest $consultationRequest, string $action)
    {
        $this->consultationRequest = $consultationRequest;
        $this->action = $action;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('user.' . $this->consultationRequest->user_id),
        ];

        // Also notify the matched consultant if any
        if ($this->consultationRequest->matched_consultant_id) {
            $consultant = $this->consultationRequest->matchedConsultant;
            if ($consultant) {
                $channels[] = new PrivateChannel('user.' . $consultant->user_id);
            }
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'consultation-request.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'consultation_request_id' => $this->consultationRequest->id,
            'status' => $this->consultationRequest->status,
            'action' => $this->action,
            'matched_consultant_id' => $this->consultationRequest->matched_consultant_id,
        ];
    }
}

