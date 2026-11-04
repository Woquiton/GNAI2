<?php

use App\Domains\Notifications\UI\Controllers\EmailComposeController;
use App\Domains\Notifications\UI\Controllers\EmailDeliveryController;
use App\Domains\Notifications\UI\Controllers\EmailMailboxController;
use Illuminate\Support\Facades\Route;

Route::middleware('can:email.view')->prefix('emails')->name('emails.')->group(function (): void {
    Route::get('/', [EmailDeliveryController::class, 'index'])->name('index');
    Route::get('/escrever', [EmailComposeController::class, 'create'])->middleware('can:email.send')->name('compose');
    Route::post('/salvar', [EmailComposeController::class, 'store'])->middleware('can:email.send')->name('store');
    Route::patch('/organizar', [EmailMailboxController::class, 'update'])->name('organize');
    Route::post('/sincronizar', [EmailMailboxController::class, 'sync'])->middleware('throttle:6,1')->name('sync');
    Route::get('/{emailDelivery}/anexos/{index}', [EmailDeliveryController::class, 'attachment'])
        ->whereUuid('emailDelivery')->whereNumber('index')->name('attachments.show');
    Route::get('/{emailDelivery}/visualizar', [EmailDeliveryController::class, 'show'])
        ->whereUuid('emailDelivery')->name('show');
});
