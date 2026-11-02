<?php

use App\Domains\Help\UI\Controllers\HelpController;
use Illuminate\Support\Facades\Route;

// Central de Ajuda: artigos em resources/help, para todo usuário autenticado.

Route::get('/', [HelpController::class, 'index'])->name('index');

Route::get('/{article}', [HelpController::class, 'show'])
    ->where('article', '[a-z0-9-]+')
    ->name('show');
