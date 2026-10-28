<?php

use App\Domains\Notifications\UI\Controllers\NotificationController;
use App\Domains\SpecializedEducationalSupport\UI\Controllers\TeacherPortalController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::redirect('/', '/about-us');

    Route::prefix('inclusive-radar')
        ->name('inclusive-radar.')
        ->group(base_path('routes/modules/inclusive-radar.php'));

    Route::prefix('specialized-educational-support')
        ->name('specialized-educational-support.')
        ->group(base_path('routes/modules/specialized-educational-support.php'));

    Route::middleware(['auth'])
        ->prefix('backup')
        ->name('backup.')
        ->group(base_path('routes/modules/backup.php'));

    Route::prefix('reports')
        ->name('reports.')
        ->group(base_path('routes/modules/reporting.php'));

    Route::prefix('auth')
        ->name('')
        ->group(base_path('routes/auth.php'));

    Route::middleware(['auth'])->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::get('/notifications/count', [NotificationController::class, 'count'])->name('notifications.count');
        Route::get('/notifications/list', [NotificationController::class, 'list'])->name('notifications.list');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
            ->name('notifications.readAll');
    });

    Route::get('/about-us', fn () => view('pages.about-us'))->name('about-us');

    Route::middleware(['auth'])->get('/guia-de-uso', fn () => view('pages.user-guide'))->name('user-guide');

    Route::middleware(['auth', 'teacher-portal'])
        ->prefix('professor')
        ->name('teacher-portal.')
        ->group(function () {
            Route::get('/', [TeacherPortalController::class, 'index'])->name('index');
            Route::get('/alunos/{student}', [TeacherPortalController::class, 'showStudent'])->name('students.show');
            Route::get('/documentos/{document}', [TeacherPortalController::class, 'viewDocument'])->name('documents.view');
            Route::get('/adaptacoes/{peiDiscipline}/edit', [TeacherPortalController::class, 'editDiscipline'])->name('discipline.edit');
            Route::put('/adaptacoes/{peiDiscipline}', [TeacherPortalController::class, 'updateDiscipline'])->name('discipline.update');
        });
});
