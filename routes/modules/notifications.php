<?php

use App\Domains\Notifications\UI\Controllers\EmailDeliveryController;
use Illuminate\Support\Facades\Route;

Route::middleware('can:email.view')->prefix('emails')->name('emails.')->group(function (): void {
    Route::get('/', [EmailDeliveryController::class, 'index'])->name('index');
    Route::get('/{emailDelivery}/visualizar', [EmailDeliveryController::class, 'show'])
        ->whereUuid('emailDelivery')->name('show');
});
