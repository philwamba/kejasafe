<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table): void {
            $table->timestamp('submitted_at')->nullable()->after('rejection_reason');
            $table->timestamp('reviewed_at')->nullable()->after('submitted_at');
            $table->foreignUuid('reviewed_by_user_id')
                ->nullable()
                ->after('reviewed_at')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('ownership_declared_at')->nullable()->after('reviewed_by_user_id');
            $table->timestamp('responsibility_accepted_at')->nullable()->after('ownership_declared_at');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('reviewed_by_user_id');
            $table->dropColumn([
                'submitted_at',
                'reviewed_at',
                'ownership_declared_at',
                'responsibility_accepted_at',
            ]);
        });
    }
};
