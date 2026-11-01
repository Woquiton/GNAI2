<?php

use App\Domains\Auth\UI\Controllers\ForgotPasswordController;
use App\Domains\Auth\UI\Controllers\ImpersonationController;
use App\Domains\Auth\UI\Controllers\LoginController;
use App\Domains\Auth\UI\Controllers\ProfileController;
use App\Domains\Auth\UI\Controllers\ResetPasswordController;
use App\Domains\Auth\UI\Controllers\TeacherAccessController;
use App\Domains\Dashboard\UI\Controllers\DashboardController;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
});

Route::middleware(['guest'])->group(function () {
    Route::get('/entrar', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/entrar', [LoginController::class, 'login']);
    Route::get('/esqueci-a-senha', [ForgotPasswordController::class, 'showForm'])->name('password.request');
    Route::post('/esqueci-a-senha', [ForgotPasswordController::class, 'sendLink'])->name('password.email');
    Route::get('/redefinir-senha/{token}', [ResetPasswordController::class, 'showForm'])->name('password.reset');
    Route::post('/redefinir-senha', [ResetPasswordController::class, 'reset'])->name('password.update');

    Route::get('/acesso', [TeacherAccessController::class, 'showRequestForm'])->name('teacher-access.request');
    Route::post('/acesso', [TeacherAccessController::class, 'sendLink'])->name('teacher-access.send-link');
});

// Fora do middleware "guest" de propósito: se o navegador já tiver qualquer
// sessão ativa (admin, profissional ou outro professor), o "guest" bloquearia
// a rota e redirecionaria direto para essa sessão antiga, sem nunca consumir
// o token — foi exatamente o bug relatado. Aqui o próprio controller encerra
// a sessão anterior antes de processar o token, garantindo que o link sempre
// leve à identidade correta, nunca à de quem já estava logado no aparelho.
Route::get('/acesso/{token}', [TeacherAccessController::class, 'showConfirm'])->name('teacher-access.confirm.show');
Route::post('/acesso/{token}', [TeacherAccessController::class, 'confirm'])->name('teacher-access.confirm');

Route::middleware(['auth'])->group(function () {
    Route::get('/painel', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/painel/atividades', [DashboardController::class, 'activityFeed'])->name('dashboard.activity-feed');
    Route::post('/sair', [LoginController::class, 'logout'])->name('logout');
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/perfil/conta', [ProfileController::class, 'updateAccount'])->name('profile.account.update');

    Route::post('/acessar-como/encerrar', [ImpersonationController::class, 'leave'])
        ->name('admin.impersonate.leave');

    Route::post('/acessar-como/{user}', [ImpersonationController::class, 'start'])
        ->name('admin.impersonate')
        ->middleware('admin');

});
