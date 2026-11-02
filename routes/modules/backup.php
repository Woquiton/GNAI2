<?php

use App\Domains\Backup\UI\Controllers\BackupController;
use Illuminate\Support\Facades\Route;

//Backups

Route::get('/', [BackupController::class, 'index'])
    ->name('backups.index')->middleware('can:backup.index');

Route::post('/salvar', [BackupController::class, 'store'])
    ->name('backups.store')->middleware('can:backup.store');

Route::get('/{backup}', [BackupController::class, 'show'])
    ->name('backups.show')->middleware('can:backup.show');

Route::get('/{backup}/baixar', [BackupController::class, 'download'])
    ->name('backups.download')->middleware('can:backup.download');

Route::delete('/{backup}', [BackupController::class, 'destroy'])
    ->name('backups.destroy')->middleware('can:backup.destroy');

Route::post('/{backup}/restaurar', [BackupController::class, 'restore'])
    ->name('backups.restore')->middleware('can:backup.restore');

Route::post('/enviar', [BackupController::class, 'upload'])
    ->name('backups.upload')->middleware('can:backup.upload');
