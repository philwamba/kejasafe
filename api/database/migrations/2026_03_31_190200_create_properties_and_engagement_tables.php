<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('owner_id')->constrained('users')->restrictOnDelete();
            $table->foreignUuid('property_type_id')->constrained('property_types')->restrictOnDelete();
            $table->foreignUuid('county_id')->constrained('counties')->restrictOnDelete();
            $table->foreignUuid('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignUuid('neighborhood_id')->nullable()->constrained('neighborhoods')->nullOnDelete();
            $table->string('owner_type');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('summary', 500);
            $table->longText('description');
            $table->string('listing_purpose');
            $table->string('listing_status')->default('draft');
            $table->string('moderation_status')->default('draft');
            $table->decimal('price', 14, 2);
            $table->decimal('deposit', 14, 2)->nullable();
            $table->decimal('service_charge', 14, 2)->nullable();
            $table->string('billing_period')->nullable();
            $table->decimal('size_value', 10, 2)->nullable();
            $table->string('size_unit')->nullable();
            $table->unsignedSmallInteger('bedrooms')->nullable();
            $table->unsignedSmallInteger('bathrooms')->nullable();
            $table->unsignedSmallInteger('toilets')->nullable();
            $table->string('furnishing_status')->nullable();
            $table->boolean('pets_allowed')->default(false);
            $table->unsignedSmallInteger('parking_slots')->nullable();
            $table->boolean('has_security_features')->default(false);
            $table->boolean('has_water_availability')->default(true);
            $table->boolean('has_internet_availability')->default(false);
            $table->boolean('negotiable')->default(false);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->text('moderation_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('featured_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('available_from')->nullable();
            $table->string('occupancy_status')->default('available');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['listing_status', 'published_at']);
            $table->index(['county_id', 'city_id', 'neighborhood_id']);
            $table->index(['property_type_id', 'listing_purpose', 'price']);
        });

        Schema::create('property_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->json('payload');
            $table->foreignUuid('changed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['property_id', 'version_number']);
        });

        Schema::create('property_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->string('storage_key');
            $table->string('url');
            $table->string('alt_text')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_cover')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['property_id', 'position']);
        });

        Schema::create('property_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('storage_key');
            $table->string('mime_type');
            $table->unsignedBigInteger('size_bytes');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('property_prices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 14, 2);
            $table->string('billing_period')->nullable();
            $table->timestamp('effective_from');
            $table->timestamp('effective_to')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['property_id', 'effective_from']);
        });

        Schema::create('property_nearby_places', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->nullable();
            $table->decimal('distance_km', 6, 2)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('property_amenity', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('amenity_id')->constrained()->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['property_id', 'amenity_id']);
        });

        Schema::create('inquiries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('sender_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->string('status')->default('new');
            $table->unsignedSmallInteger('spam_score')->default(0);
            $table->timestamps();
        });

        Schema::create('inquiry_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('inquiry_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('sender_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('message');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('viewing_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('requester_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->timestamp('requested_for');
            $table->string('status')->default('requested');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['user_id', 'property_id']);
        });

        Schema::create('comparisons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('property_id')->constrained()->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['user_id', 'property_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comparisons');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('viewing_requests');
        Schema::dropIfExists('inquiry_messages');
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('property_amenity');
        Schema::dropIfExists('property_nearby_places');
        Schema::dropIfExists('property_prices');
        Schema::dropIfExists('property_documents');
        Schema::dropIfExists('property_images');
        Schema::dropIfExists('property_versions');
        Schema::dropIfExists('properties');
    }
};
