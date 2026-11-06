<?php

use App\Domains\UI\Controllers\Audit\AuditController;
use Illuminate\Support\Facades\Route;

// Histórico de alterações do sistema inteiro.

Route::get('/', [AuditController::class, 'index'])
    ->name('index')->middleware('can:audit.index');
