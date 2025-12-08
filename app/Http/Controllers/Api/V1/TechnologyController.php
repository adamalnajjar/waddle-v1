<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TechnologyController extends Controller
{
    /**
     * List all active technologies.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->input('per_page', 50), 100);
        
        $technologies = Technology::active()
            ->ordered()
            ->paginate($perPage);

        return response()->json([
            'technologies' => $technologies->items(),
            'pagination' => [
                'current_page' => $technologies->currentPage(),
                'last_page' => $technologies->lastPage(),
                'per_page' => $technologies->perPage(),
                'total' => $technologies->total(),
            ],
        ]);
    }

    /**
     * Search technologies by name.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        
        $technologies = Technology::active()
            ->where('name', 'like', "%{$query}%")
            ->ordered()
            ->limit(20)
            ->get();

        return response()->json([
            'technologies' => $technologies,
        ]);
    }
}

