<?php

use App\Domains\UI\Controllers\Auth\ColorPaletteController;
use App\Domains\UI\Controllers\Auth\TeacherPortalViewController;
use App\Domains\UI\Controllers\Auth\ForgotPasswordController;
use App\Domains\UI\Controllers\Auth\ImpersonationController;
use App\Domains\UI\Controllers\Auth\LoginController;
use App\Domains\UI\Controllers\Auth\ProfileController;
use App\Domains\UI\Controllers\Auth\ResetPasswordController;
use App\Domains\UI\Controllers\Auth\SessionController;
use App\Domains\UI\Controllers\Auth\TablePreferenceController;
use App\Domains\UI\Controllers\Auth\TeacherAccessController;
use App\Domains\UI\Controllers\Dashboard\DashboardController;

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
    Route::get('/sessao/bloqueada', [SessionController::class, 'show'])->name('session.locked');
    Route::post('/sessao/bloquear', [SessionController::class, 'lock'])->name('session.lock');
    Route::post('/sessao/desbloquear', [SessionController::class, 'unlock'])->name('session.unlock');
    Route::get('/sessao/estado', [SessionController::class, 'status'])->name('session.status');
    Route::post('/sessao/atividade', [SessionController::class, 'activity'])->name('session.activity');

    Route::get('/painel', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/painel/atividades', [DashboardController::class, 'activityFeed'])->name('dashboard.activity-feed');
    Route::post('/sair', [LoginController::class, 'logout'])->name('logout');
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/perfil/conta', [ProfileController::class, 'updateAccount'])->name('profile.account.update');
    Route::put('/preferencias/visualizacao-do-portal', [TeacherPortalViewController::class, 'update'])
        ->name('preferences.teacher-portal-view.update');
    Route::put('/preferencias/paleta-de-cor', [ColorPaletteController::class, 'update'])
        ->name('preferences.color-palette.update');
    Route::put('/preferencias/tabelas/colunas', [TablePreferenceController::class, 'updateColumns'])
        ->name('preferences.tables.columns.update');
    Route::put('/preferencias/tabelas/visualizacao', [TablePreferenceController::class, 'updateView'])
        ->name('preferences.tables.view.update');

    Route::post('/acessar-como/encerrar', [ImpersonationController::class, 'leave'])
        ->name('admin.impersonate.leave');

    Route::post('/acessar-como/{user}', [ImpersonationController::class, 'start'])
        ->name('admin.impersonate')
        ->middleware('admin');

});
