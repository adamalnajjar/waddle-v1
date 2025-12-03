<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Consultation;

class ConsultationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Consultation $consultation;
    public string $action;

    /**
     * Create a new event instance.
     */
    public function __construct(Consultation $consultation, string $action)
    {
        $this->consultation = $consultation;
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
            new PrivateChannel('consultation.' . $this->consultation->id),
            new PrivateChannel('user.' . $this->consultation->user_id),
        ];

        // Also notify the consultant
        if ($this->consultation->consultant) {
            $channels[] = new PrivateChannel('user.' . $this->consultation->consultant->user_id);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'consultation.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'consultation_id' => $this->consultation->id,
            'status' => $this->consultation->status,
            'action' => $this->action,
            'started_at' => $this->consultation->started_at?->toISOString(),
            'ended_at' => $this->consultation->ended_at?->toISOString(),
        ];
    }
}

