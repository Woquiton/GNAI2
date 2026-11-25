<?php

use App\Domains\UI\Controllers\Teachers\TeacherPortalController;
use App\Domains\UI\Controllers\Website\PublicPolicyController;
use App\Domains\UI\Controllers\Auth\TeacherProfileController;
use App\Domains\UI\Controllers\Notifications\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('web')->group(function () {
    Route::redirect('/', '/sobre-nos');

    Route::group([], base_path('routes/business.php'));
    Route::middleware('auth')->group(base_path('routes/modules/notifications.php'));

    Route::middleware(['auth'])
        ->prefix('backups')
        ->name('backup.')
        ->group(base_path('routes/modules/backup.php'));

    Route::middleware(['auth'])
        ->prefix('auditoria')
        ->name('audit.')
        ->group(base_path('routes/modules/audit.php'));

    Route::middleware(['auth'])
        ->prefix('configuracoes')
        ->name('settings.')
        ->group(base_path('routes/modules/settings.php'));

    Route::middleware(['auth'])
        ->prefix('ajuda')
        ->name('help.')
        ->group(base_path('routes/modules/help.php'));

    Route::name('website.')
        ->group(base_path('routes/modules/website.php'));

    Route::prefix('relatorios')
        ->name('reports.')
        ->group(base_path('routes/modules/reporting.php'));

    Route::prefix('autenticacao')
        ->name('')
        ->group(base_path('routes/auth.php'));

    Route::middleware(['auth'])->group(function () {
        Route::get('/notificacoes', [NotificationController::class, 'index'])->name('notifications.index');
        Route::get('/notificacoes/contagem', [NotificationController::class, 'count'])->name('notifications.count');
        Route::get('/notificacoes/lista', [NotificationController::class, 'list'])->name('notifications.list');
        Route::post('/notificacoes/{id}/ler', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notificacoes/ler-todas', [NotificationController::class, 'markAllAsRead'])
            ->name('notifications.readAll');
    });

    Route::get('/sobre-nos', function () {
        if (request()->header('X-Inertia')) {
            return Inertia::location(route('about-us'));
        }

        return view('pages.about-us');
    })->name('about-us');

    Route::get('/politica-de-privacidade', PublicPolicyController::class)
        ->defaults('policy', 'privacy')->name('privacy-policy');
    Route::get('/uso-responsavel', PublicPolicyController::class)
        ->defaults('policy', 'usage')->name('policies.usage');
    Route::get('/politica-de-cookies', PublicPolicyController::class)
        ->defaults('policy', 'cookies')->name('policies.cookies');
    Route::get('/direitos-autorais', PublicPolicyController::class)
        ->defaults('policy', 'copyright')->name('policies.copyright');
    Route::get('/politica-de-acessibilidade', PublicPolicyController::class)
        ->defaults('policy', 'accessibility')->name('policies.accessibility');

    Route::middleware('auth')->get('/acessibilidade', fn () => Inertia::render('Accessibility/Index'))
        ->name('accessibility.index');

    Route::middleware(['auth'])->get('/guia-de-uso', function () {
        if (request()->header('X-Inertia')) {
            return Inertia::location(route('user-guide'));
        }

        return view('pages.user-guide');
    })->name('user-guide');

    Route::middleware(['auth', 'teacher-portal'])
        ->prefix('professor')
        ->name('teacher-portal.')
        ->group(function () {
            Route::get('/', [TeacherPortalController::class, 'index'])->name('index');
            Route::get('/perfil', [TeacherProfileController::class, 'edit'])->name('profile.edit');
            Route::put('/perfil', [TeacherProfileController::class, 'update'])->name('profile.update');
            Route::get('/alunos/{student}', [TeacherPortalController::class, 'showStudent'])->name('students.show');
            Route::get('/documentos/{document}', [TeacherPortalController::class, 'viewDocument'])->name('documents.view');
            Route::get('/adaptacoes/{peiDiscipline}/editar', [TeacherPortalController::class, 'editDiscipline'])->name('discipline.edit');
            Route::put('/adaptacoes/{peiDiscipline}', [TeacherPortalController::class, 'updateDiscipline'])->name('discipline.update');
        });
});
