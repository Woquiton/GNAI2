<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('tags')->whereNotNull('system_key')->update(['color' => '#b8860b']);
    }

    public function down(): void
    {
        DB::table('tags')->whereNotNull('system_key')->where('color', '#b8860b')
            ->update(['color' => '#322b75']);
    }
};
