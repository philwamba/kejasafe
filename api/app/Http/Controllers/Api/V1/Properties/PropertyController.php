<?php

namespace App\Http\Controllers\Api\V1\Properties;

use App\Domain\Properties\Actions\ModeratePropertyAction;
use App\Domain\Properties\Actions\StorePropertyAction;
use App\Domain\Properties\Queries\PropertyDetailQuery;
use App\Domain\Properties\Queries\PropertyListQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\Property\ListPropertiesRequest;
use App\Http\Requests\Property\StorePropertyRequest;
use App\Http\Resources\Property\PropertyCardResource;
use App\Http\Resources\Property\PropertyDetailResource;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class PropertyController extends Controller
{
    public function __construct(
        private readonly PropertyListQuery $propertyListQuery,
        private readonly PropertyDetailQuery $propertyDetailQuery,
        private readonly StorePropertyAction $storePropertyAction,
        private readonly ModeratePropertyAction $moderatePropertyAction,
    ) {
    }

    public function index(ListPropertiesRequest $request): JsonResponse
    {
        $properties = $this->propertyListQuery->handle($request->filters());

        return response()->json([
            'data' => PropertyCardResource::collection($properties->getCollection())->resolve(),
            'meta' => [
                'page' => $properties->currentPage(),
                'perPage' => $properties->perPage(),
                'total' => $properties->total(),
                'totalPages' => $properties->lastPage(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $property = $this->propertyDetailQuery->handle($slug);

        if ($property === null) {
            return response()->json([
                'message' => 'Property not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => PropertyDetailResource::make($property)->resolve(),
        ]);
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $property = $this->storePropertyAction->execute(
            $request->user(),
            $request->validated(),
        );

        $detail = $this->propertyDetailQuery->handle($property->slug);

        return response()->json([
            'data' => $detail !== null
                ? PropertyDetailResource::make($detail)->resolve()
                : ['id' => $property->id, 'slug' => $property->slug],
        ], Response::HTTP_CREATED);
    }

    public function moderationQueue(Request $request): JsonResponse
    {
        $request->user()->can('approve_listings') || abort(403);

        $properties = Property::query()
            ->where('moderation_status', 'pending_review')
            ->orderBy('submitted_at', 'asc')
            ->with(['county', 'city', 'neighborhood', 'images'])
            ->paginate(20);

        return response()->json([
            'data' => $properties->items(),
            'meta' => [
                'page' => $properties->currentPage(),
                'perPage' => $properties->perPage(),
                'total' => $properties->total(),
                'totalPages' => $properties->lastPage(),
            ],
        ]);
    }

    public function approve(Request $request, string $id): JsonResponse
    {
        $request->user()->can('approve_listings') || abort(403);

        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $property = Property::query()->findOrFail($id);

        $updated = $this->moderatePropertyAction->approve(
            $request->user(),
            $property,
            $validated['notes'] ?? null,
        );

        return response()->json([
            'data' => $updated,
        ]);
    }

    public function reject(Request $request, string $id): JsonResponse
    {
        $request->user()->can('approve_listings') || abort(403);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $property = Property::query()->findOrFail($id);

        $updated = $this->moderatePropertyAction->reject(
            $request->user(),
            $property,
            $validated['reason'],
            $validated['notes'] ?? null,
        );

        return response()->json([
            'data' => $updated,
        ]);
    }
}
