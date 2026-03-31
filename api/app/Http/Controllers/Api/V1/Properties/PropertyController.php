<?php

namespace App\Http\Controllers\Api\V1\Properties;

use App\Domain\Properties\Queries\PropertyDetailQuery;
use App\Domain\Properties\Queries\PropertyListQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\Property\ListPropertiesRequest;
use App\Http\Resources\Property\PropertyCardResource;
use App\Http\Resources\Property\PropertyDetailResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PropertyController extends Controller
{
    public function __construct(
        private readonly PropertyListQuery $propertyListQuery,
        private readonly PropertyDetailQuery $propertyDetailQuery,
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
}
