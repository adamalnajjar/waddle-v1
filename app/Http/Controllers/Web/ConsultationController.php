<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\ConsultationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    /**
     * Display a listing of the user's consultation requests and active consultations.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get consultation requests
        $requests = ConsultationRequest::where('user_id', $user->id)
            ->with(['matchedConsultant.user'])
            ->latest()
            ->get();
            
        // Get active/completed consultations
        $consultations = Consultation::where('user_id', $user->id)
            ->with(['consultant.user'])
            ->latest()
            ->get();

        return Inertia::render('Consultations', [
            'requests' => $requests,
            'consultations' => $consultations,
        ]);
    }

    /**
     * Store a new consultation request.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'problem_description' => ['required', 'string', 'min:20', 'max:5000'],
            'tech_stack' => ['required', 'array', 'min:1'],
            'tech_stack.*' => ['string'],
            'error_logs' => ['nullable', 'string', 'max:10000'],
            'questionnaire_responses' => ['nullable', 'array'],
        ]);

        $user = $request->user();

        // Check if user has tokens
        if ($user->tokens_balance < 1) {
            return back()->withErrors([
                'tokens' => 'You need tokens to request a consultation. Please purchase tokens first.',
            ]);
        }

        // Create the consultation request
        $consultationRequest = ConsultationRequest::create([
            'user_id' => $user->id,
            'problem_description' => $validated['problem_description'],
            'tech_stack' => $validated['tech_stack'],
            'error_logs' => $validated['error_logs'] ?? null,
            'questionnaire_responses' => $validated['questionnaire_responses'] ?? [],
            'status' => ConsultationRequest::STATUS_PENDING,
            'shuffle_count' => 0,
            'excluded_consultants' => [],
        ]);

        return redirect('/consultations')
            ->with('success', 'Consultation request submitted! We\'re finding the best consultant for you.');
    }

    /**
     * Display a specific consultation.
     */
    public function show(Consultation $consultation)
    {
        // Authorization check - ensure user owns this consultation
        if ($consultation->user_id !== request()->user()->id) {
            abort(403);
        }

        $consultation->load(['consultant.user', 'messages', 'files']);

        return Inertia::render('Consultation/Show', [
            'consultation' => $consultation,
        ]);
    }
}
