<?php

use App\Domains\Inclusion\UI\Controllers\AccessibilityFeatureController;
use App\Domains\Inclusion\UI\Controllers\AeeRecordController;
use App\Domains\Inclusion\UI\Controllers\BarrierCategoryController;
use App\Domains\Inclusion\UI\Controllers\BarrierController;
use App\Domains\Inclusion\UI\Controllers\CaseStudyController;
use App\Domains\Inclusion\UI\Controllers\CourseController;
use App\Domains\Inclusion\UI\Controllers\DeficiencyController;
use App\Domains\Inclusion\UI\Controllers\DisciplineController;
use App\Domains\Inclusion\UI\Controllers\GuardianController;
use App\Domains\Inclusion\UI\Controllers\InstitutionController;
use App\Domains\Inclusion\UI\Controllers\ItemController;
use App\Domains\Inclusion\UI\Controllers\LoanController;
use App\Domains\Inclusion\UI\Controllers\LocationController;
use App\Domains\Inclusion\UI\Controllers\PaeeController;
use App\Domains\Inclusion\UI\Controllers\PedagogicalRecordController;
use App\Domains\Inclusion\UI\Controllers\PeiController;
use App\Domains\Inclusion\UI\Controllers\PendencyController;
use App\Domains\Inclusion\UI\Controllers\PositionController;
use App\Domains\Inclusion\UI\Controllers\ProfessionalController;
use App\Domains\Inclusion\UI\Controllers\PublicationController;
use App\Domains\Inclusion\UI\Controllers\SemesterController;
use App\Domains\Inclusion\UI\Controllers\SessionController;
use App\Domains\Inclusion\UI\Controllers\StudentController;
use App\Domains\Inclusion\UI\Controllers\StudentCourseController;
use App\Domains\Inclusion\UI\Controllers\StudentDeficiencyController;
use App\Domains\Inclusion\UI\Controllers\StudentDocumentController;
use App\Domains\Inclusion\UI\Controllers\SupportRequestController;
use App\Domains\Inclusion\UI\Controllers\TagController;
use App\Domains\Inclusion\UI\Controllers\TeacherController;
use App\Domains\Inclusion\UI\Controllers\WaitlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Inclusão: radar inclusivo e atendimento educacional especializado
|--------------------------------------------------------------------------
| Um único domínio (App\Domains\Inclusion), com URLs em português.
| Os nomes internos das rotas permanecem estáveis para preservar permissões
| e referências existentes.
*/

Route::prefix('inclusao')->name('inclusive-radar.')->group(function (): void {
    /*
    |--------------------------------------------------------------------------
    | ADMIN – Gestão de Cadastros (somente administradores)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth', 'admin'])->prefix('administracao')->group(function () {});

    /*
    |--------------------------------------------------------------------------
    | OPERACIONAL – Recursos e Ações do Dia a Dia (autenticado + permissões)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth'])->group(function () {
        // ------------------- CATEGORIAS DAS BARREIRAS -------------------
        Route::get('/categorias-de-barreira', [BarrierCategoryController::class, 'index'])
            ->name('barrier-categories.index')->middleware('can:barrier-category.index');
        Route::get('/categorias-de-barreira/criar', [BarrierCategoryController::class, 'create'])
            ->name('barrier-categories.create')->middleware('can:barrier-category.create');
        Route::post('/categorias-de-barreira/salvar', [BarrierCategoryController::class, 'store'])
            ->name('barrier-categories.store')->middleware('can:barrier-category.store');
        Route::get('/categorias-de-barreira/{barrierCategory}', [BarrierCategoryController::class, 'show'])
            ->name('barrier-categories.show')->middleware('can:barrier-category.show');
        Route::get('/categorias-de-barreira/{barrierCategory}/editar', [BarrierCategoryController::class, 'edit'])
            ->name('barrier-categories.edit')->middleware('can:barrier-category.edit');
        Route::put('/categorias-de-barreira/{barrierCategory}', [BarrierCategoryController::class, 'update'])
            ->name('barrier-categories.update')->middleware('can:barrier-category.update');
        Route::delete('/categorias-de-barreira/{barrierCategory}', [BarrierCategoryController::class, 'destroy'])
            ->name('barrier-categories.destroy')->middleware('can:barrier-category.destroy');

        // ------------------- INSTITUIÇÕES -------------------
        Route::get('/instituicoes', [InstitutionController::class, 'index'])
            ->name('institutions.index')->middleware('can:institution.index');
        Route::get('/instituicoes/criar', [InstitutionController::class, 'create'])
            ->name('institutions.create')->middleware('can:institution.create');
        Route::post('/instituicoes/salvar', [InstitutionController::class, 'store'])
            ->name('institutions.store')->middleware('can:institution.store');
        Route::get('/instituicoes/{institution}', [InstitutionController::class, 'show'])
            ->name('institutions.show')->middleware('can:institution.show');
        Route::get('/instituicoes/{institution}/editar', [InstitutionController::class, 'edit'])
            ->name('institutions.edit')->middleware('can:institution.edit');
        Route::put('/instituicoes/{institution}', [InstitutionController::class, 'update'])
            ->name('institutions.update')->middleware('can:institution.update');
        Route::delete('/instituicoes/{institution}', [InstitutionController::class, 'destroy'])
            ->name('institutions.destroy')->middleware('can:institution.destroy');

        // ------------------- LOCALIZAÇÕES -------------------
        Route::get('/locais', [LocationController::class, 'index'])
            ->name('locations.index')->middleware('can:location.index');
        Route::get('/locais/criar', [LocationController::class, 'create'])
            ->name('locations.create')->middleware('can:location.create');
        Route::post('/locais/salvar', [LocationController::class, 'store'])
            ->name('locations.store')->middleware('can:location.store');
        Route::get('/locais/{location}', [LocationController::class, 'show'])
            ->name('locations.show')->middleware('can:location.show');
        Route::get('/locais/{location}/editar', [LocationController::class, 'edit'])
            ->name('locations.edit')->middleware('can:location.edit');
        Route::put('/locais/{location}', [LocationController::class, 'update'])
            ->name('locations.update')->middleware('can:location.update');
        Route::delete('/locais/{location}', [LocationController::class, 'destroy'])
            ->name('locations.destroy')->middleware('can:location.destroy');

        // ------------------- RECURSOS DE ACESSIBILIDADE -------------------
        Route::get('/recursos-de-acessibilidade', [AccessibilityFeatureController::class, 'index'])
            ->name('accessibility-features.index')->middleware('can:accessibility-feature.index');
        Route::get('/recursos-de-acessibilidade/criar', [AccessibilityFeatureController::class, 'create'])
            ->name('accessibility-features.create')->middleware('can:accessibility-feature.create');
        Route::post('/recursos-de-acessibilidade/salvar', [AccessibilityFeatureController::class, 'store'])
            ->name('accessibility-features.store')->middleware('can:accessibility-feature.store');
        Route::get('/recursos-de-acessibilidade/{accessibilityFeature}', [AccessibilityFeatureController::class, 'show'])
            ->name('accessibility-features.show')->middleware('can:accessibility-feature.show');
        Route::get('/recursos-de-acessibilidade/{accessibilityFeature}/editar', [AccessibilityFeatureController::class, 'edit'])
            ->name('accessibility-features.edit')->middleware('can:accessibility-feature.edit');
        Route::put('/recursos-de-acessibilidade/{accessibilityFeature}', [AccessibilityFeatureController::class, 'update'])
            ->name('accessibility-features.update')->middleware('can:accessibility-feature.update');
        Route::delete('/recursos-de-acessibilidade/{accessibilityFeature}', [AccessibilityFeatureController::class, 'destroy'])
            ->name('accessibility-features.destroy')->middleware('can:accessibility-feature.destroy');

        // ------------------- ETIQUETAS -------------------
        Route::get('/marcadores', [TagController::class, 'index'])
            ->name('tags.index')->middleware('can:tag.index');
        Route::get('/marcadores/criar', [TagController::class, 'create'])
            ->name('tags.create')->middleware('can:tag.create');
        Route::post('/marcadores/salvar', [TagController::class, 'store'])
            ->name('tags.store')->middleware('can:tag.store');
        Route::get('/marcadores/{tag}', [TagController::class, 'show'])
            ->name('tags.show')->middleware('can:tag.show');
        Route::get('/marcadores/{tag}/editar', [TagController::class, 'edit'])
            ->name('tags.edit')->middleware('can:tag.edit');
        Route::put('/marcadores/{tag}', [TagController::class, 'update'])
            ->name('tags.update')->middleware('can:tag.update');
        Route::delete('/marcadores/{tag}', [TagController::class, 'destroy'])
            ->name('tags.destroy')->middleware('can:tag.destroy');

        // ------------------- ITENS (TECNOLOGIAS ASSISTIVAS E MATERIAIS PEDAGÓGICOS) -------------------
        Route::get('/itens', [ItemController::class, 'index'])
            ->name('items.index')->middleware('can:item.index');

        Route::get('/itens/criar', [ItemController::class, 'create'])
            ->name('items.create')->middleware('can:item.create');

        Route::post('/itens/salvar', [ItemController::class, 'store'])
            ->name('items.store')->middleware('can:item.store');

        Route::get('/itens/{item}/duplicar', [ItemController::class, 'clone'])
            ->name('items.clone')->middleware('can:item.create');

        Route::get('/itens/{item}/vistoria/{inspection}', [ItemController::class, 'showInspection'])
            ->name('items.inspection.show')->middleware('can:item.inspection.show');

        Route::get('/itens/{item}', [ItemController::class, 'show'])
            ->name('items.show')->middleware('can:item.show');

        Route::get('/itens/{item}/editar', [ItemController::class, 'edit'])
            ->name('items.edit')->middleware('can:item.edit');

        Route::put('/itens/{item}', [ItemController::class, 'update'])
            ->name('items.update')->middleware('can:item.update');

        Route::delete('/itens/{item}', [ItemController::class, 'destroy'])
            ->name('items.destroy')->middleware('can:item.destroy');

        Route::get('/itens/{item}/pdf', [ItemController::class, 'generatePdf'])
            ->name('items.pdf')->middleware('can:item.pdf');

        // ------------------- BARREIRAS -------------------
        Route::get('/barreiras', [BarrierController::class, 'index'])
            ->name('barriers.index')->middleware('can:barrier.index');

        Route::get('/barreiras/criar', [BarrierController::class, 'create'])
            ->name('barriers.create')->middleware('can:barrier.create');

        Route::post('/barreiras/salvar', [BarrierController::class, 'store'])
            ->name('barriers.store')->middleware('can:barrier.store');

        Route::get('barreiras/{barrier}/vistoria/{inspection}', [BarrierController::class, 'showInspection'])
            ->name('barriers.inspection.show')->middleware('can:barrier.inspection.show');

        Route::get('/barreiras/{barrier}', [BarrierController::class, 'show'])
            ->name('barriers.show')->middleware('can:barrier.show');

        Route::get('/barreiras/{barrier}/editar', [BarrierController::class, 'edit'])
            ->name('barriers.edit')->middleware('can:barrier.edit');

        Route::put('/barreiras/{barrier}', [BarrierController::class, 'update'])
            ->name('barriers.update')->middleware('can:barrier.update');

        Route::delete('/barreiras/{barrier}', [BarrierController::class, 'destroy'])
            ->name('barriers.destroy')->middleware('can:barrier.destroy');

        Route::get('/barreiras/{barrier}/pdf', [BarrierController::class, 'generatePdf'])
            ->name('barriers.pdf')->middleware('can:barrier.pdf');

        // ------------------- PUBLICAÇÕES -------------------

        Route::get('/publicacoes', [PublicationController::class, 'index'])
            ->name('publications.index')->middleware('can:publication.index');

        Route::get('/publicacoes/criar', [PublicationController::class, 'create'])
            ->name('publications.create')->middleware('can:publication.create');

        Route::post('/publicacoes/salvar', [PublicationController::class, 'store'])
            ->name('publications.store')->middleware('can:publication.store');

        Route::get('/publicacoes/{publication}', [PublicationController::class, 'show'])
            ->name('publications.show')->middleware('can:publication.show');

        Route::get('/publicacoes/{publication}/editar', [PublicationController::class, 'edit'])
            ->name('publications.edit')->middleware('can:publication.edit');

        Route::put('/publicacoes/{publication}', [PublicationController::class, 'update'])
            ->name('publications.update')->middleware('can:publication.update');

        Route::delete('/publicacoes/{publication}', [PublicationController::class, 'destroy'])
            ->name('publications.destroy')->middleware('can:publication.destroy');

        Route::get('/publicacoes/{publication}/pdf', [PublicationController::class, 'generatePdf'])
            ->name('publications.pdf')->middleware('can:publication.pdf');

        // ------------------- EMPRÉSTIMOS -------------------
        Route::get('/emprestimos', [LoanController::class, 'index'])
            ->name('loans.index')->middleware('can:loan.index');

        Route::get('/emprestimos/criar', [LoanController::class, 'create'])
            ->name('loans.create')->middleware('can:loan.create');

        Route::post('/emprestimos/salvar', [LoanController::class, 'store'])
            ->name('loans.store')->middleware('can:loan.store');

        Route::get('/emprestimos/{loan}', [LoanController::class, 'show'])
            ->name('loans.show')->middleware('can:loan.show');

        Route::get('/emprestimos/{loan}/editar', [LoanController::class, 'edit'])
            ->name('loans.edit')->middleware('can:loan.edit');

        Route::put('/emprestimos/{loan}', [LoanController::class, 'update'])
            ->name('loans.update')->middleware('can:loan.update');

        Route::patch('/emprestimos/{loan}/devolver', [LoanController::class, 'returnItem'])
            ->name('loans.return')->middleware('can:loan.return');

        Route::delete('/emprestimos/{loan}', [LoanController::class, 'destroy'])
            ->name('loans.destroy')->middleware('can:loan.destroy');

        Route::get('/emprestimos/{loan}/pdf', [LoanController::class, 'generatePdf'])
            ->name('loans.pdf')->middleware('can:loan.pdf');

        // ------------------- FILA DE ESPERA -------------------
        Route::get('/fila-de-espera', [WaitlistController::class, 'index'])
            ->name('waitlists.index')->middleware('can:waitlist.index');

        Route::get('/fila-de-espera/criar', [WaitlistController::class, 'create'])
            ->name('waitlists.create')->middleware('can:waitlist.create');

        Route::post('/fila-de-espera/salvar', [WaitlistController::class, 'store'])
            ->name('waitlists.store')->middleware('can:waitlist.store');

        Route::get('/fila-de-espera/{waitlist}', [WaitlistController::class, 'show'])
            ->name('waitlists.show')->middleware('can:waitlist.show');

        Route::get('/fila-de-espera/{waitlist}/editar', [WaitlistController::class, 'edit'])
            ->name('waitlists.edit')->middleware('can:waitlist.edit');

        Route::put('/fila-de-espera/{waitlist}', [WaitlistController::class, 'update'])
            ->name('waitlists.update')->middleware('can:waitlist.update');

        Route::delete('/fila-de-espera/{waitlist}', [WaitlistController::class, 'destroy'])
            ->name('waitlists.destroy')->middleware('can:waitlist.destroy');

        Route::patch('/fila-de-espera/{waitlist}/cancelar', [WaitlistController::class, 'cancel'])
            ->name('waitlists.cancel')->middleware('can:waitlist.cancel');

        Route::get('/fila-de-espera/{waitlist}/pdf', [WaitlistController::class, 'generatePdf'])
            ->name('waitlists.pdf')->middleware('can:waitlist.pdf');
    });
});

Route::prefix('inclusao')->name('specialized-educational-support.')->group(function (): void {
    Route::middleware(['auth'])->group(function () {

        // Deficiencies
        Route::get('/deficiencias', [DeficiencyController::class, 'index'])->name('deficiencies.index')->middleware('can:deficiency.view');
        Route::get('/deficiencias/{deficiency}/visualizar', [DeficiencyController::class, 'show'])->name('deficiencies.show')->middleware('can:deficiency.view');
        Route::get('/deficiencias/criar', [DeficiencyController::class, 'create'])->name('deficiencies.create')->middleware('can:deficiency.create');
        Route::post('/deficiencias/salvar', [DeficiencyController::class, 'store'])->name('deficiencies.store')->middleware('can:deficiency.create');
        Route::get('/deficiencias/{deficiency}/editar', [DeficiencyController::class, 'edit'])->name('deficiencies.edit')->middleware('can:deficiency.update');
        Route::put('/deficiencias/{deficiency}', [DeficiencyController::class, 'update'])->name('deficiencies.update')->middleware('can:deficiency.update');
        Route::patch('/deficiencias/{deficiency}/desativar', [DeficiencyController::class, 'toggleActive'])->name('deficiencies.deactivate')->middleware('can:deficiency.update');
        Route::delete('/deficiencias/{deficiency}', [DeficiencyController::class, 'destroy'])->name('deficiencies.destroy')->middleware('can:deficiency.delete');

        // Positions
        Route::get('/cargos', [PositionController::class, 'index'])->name('positions.index')->middleware('can:position.view');
        Route::get('/cargos/{position}/visualizar', [PositionController::class, 'show'])->name('positions.show')->middleware('can:position.view');
        Route::get('/cargos/criar', [PositionController::class, 'create'])->name('positions.create')->middleware('can:position.create');
        Route::post('/cargos/salvar', [PositionController::class, 'store'])->name('positions.store')->middleware('can:position.create');
        Route::get('/cargos/{position}/editar', [PositionController::class, 'edit'])->name('positions.edit')->middleware('can:position.update');
        Route::put('/cargos/{position}', [PositionController::class, 'update'])->name('positions.update')->middleware('can:position.update');
        Route::patch('/cargos/{position}/desativar', [PositionController::class, 'toggleActive'])->name('positions.deactivate')->middleware('can:position.update');
        Route::delete('/cargos/{position}', [PositionController::class, 'destroy'])->name('positions.destroy')->middleware('can:position.delete');

        // Semesters
        Route::get('/semestres', [SemesterController::class, 'index'])->name('semesters.index')->middleware('can:semester.view');
        Route::get('/semestres/{semester}/visualizar', [SemesterController::class, 'show'])->name('semesters.show')->middleware('can:semester.view');
        Route::get('/semestres/criar', [SemesterController::class, 'create'])->name('semesters.create')->middleware('can:semester.create');
        Route::post('/semestres/salvar', [SemesterController::class, 'store'])->name('semesters.store')->middleware('can:semester.create');
        Route::get('/semestres/{semester}/editar', [SemesterController::class, 'edit'])->name('semesters.edit')->middleware('can:semester.update');
        Route::put('/semestres/{semester}', [SemesterController::class, 'update'])->name('semesters.update')->middleware('can:semester.update');
        Route::patch('/semestres/{semester}/definir-atual', [SemesterController::class, 'setCurrent'])->name('semesters.setCurrent')->middleware('can:semester.update');
        Route::delete('/semestres/{semester}', [SemesterController::class, 'destroy'])->name('semesters.destroy')->middleware('can:semester.delete');

        // Courses
        Route::get('/cursos', [CourseController::class, 'index'])->name('courses.index')->middleware('can:course.view');
        Route::get('/cursos/{course}/visualizar', [CourseController::class, 'show'])->name('courses.show')->middleware('can:course.view');
        Route::get('/cursos/criar', [CourseController::class, 'create'])->name('courses.create')->middleware('can:course.create');
        Route::post('/cursos/salvar', [CourseController::class, 'store'])->name('courses.store')->middleware('can:course.create');
        Route::get('/cursos/{course}/editar', [CourseController::class, 'edit'])->name('courses.edit')->middleware('can:course.update');
        Route::put('/cursos/{course}', [CourseController::class, 'update'])->name('courses.update')->middleware('can:course.update');
        Route::delete('/cursos/{course}', [CourseController::class, 'destroy'])->name('courses.destroy')->middleware('can:course.delete');
        Route::get('/cursos/{course}/virada-de-semestre', [CourseController::class, 'rollover'])->name('courses.rollover')->middleware('can:student-course.update');
        Route::post('/cursos/{course}/virada-de-semestre/salvar', [CourseController::class, 'storeRollover'])->name('courses.rollover.store')->middleware('can:student-course.update');

        // Disciplines
        Route::get('/disciplinas', [DisciplineController::class, 'index'])->name('disciplines.index')->middleware('can:discipline.view');
        Route::get('/disciplinas/{discipline}/visualizar', [DisciplineController::class, 'show'])->name('disciplines.show')->middleware('can:discipline.view');
        Route::get('/disciplinas/criar', [DisciplineController::class, 'create'])->name('disciplines.create')->middleware('can:discipline.create');
        Route::post('/disciplinas/salvar', [DisciplineController::class, 'store'])->name('disciplines.store')->middleware('can:discipline.create');
        Route::get('/disciplinas/{discipline}/editar', [DisciplineController::class, 'edit'])->name('disciplines.edit')->middleware('can:discipline.update');
        Route::put('/disciplinas/{discipline}', [DisciplineController::class, 'update'])->name('disciplines.update')->middleware('can:discipline.update');
        Route::delete('/disciplinas/{discipline}', [DisciplineController::class, 'destroy'])->name('disciplines.destroy')->middleware('can:discipline.delete');
    });

    Route::middleware(['auth'])->group(function () {

        /* 1. STUDENTS */
        Route::get('/alunos', [StudentController::class, 'index'])->name('students.index')->middleware('can:student.view');
        Route::get('/alunos/{student}/visualizar', [StudentController::class, 'show'])->name('students.show')->middleware('can:student.view');
        Route::get('/alunos/criar', [StudentController::class, 'create'])->name('students.create')->middleware('can:student.create');
        Route::post('/alunos/salvar', [StudentController::class, 'store'])->name('students.store')->middleware('can:student.create');
        Route::get('/alunos/{student}/editar', [StudentController::class, 'edit'])->name('students.edit')->middleware('can:student.update');
        Route::put('/alunos/{student}', [StudentController::class, 'update'])->name('students.update')->middleware('can:student.update');
        Route::delete('/alunos/{student}', [StudentController::class, 'destroy'])->name('students.destroy')->middleware('can:student.delete');
        Route::get('/alunos/{student}/pdf', [StudentController::class, 'pdf'])->name('students.pdf')->middleware('can:student.view');

        /* SOLICITAÇÕES DE ATENDIMENTO */
        Route::get('/solicitacoes-de-atendimento', [SupportRequestController::class, 'index'])->name('support-requests.index')->middleware('can:support-request.view');
        Route::get('/solicitacoes-de-atendimento/criar', [SupportRequestController::class, 'create'])->name('support-requests.create')->middleware(['can:support-request.create', 'can:support-request.view']);
        Route::post('/solicitacoes-de-atendimento/salvar', [SupportRequestController::class, 'store'])->name('support-requests.store')->middleware(['can:support-request.create', 'can:support-request.view']);
        Route::get('/solicitacoes-de-atendimento/{supportRequest}/visualizar', [SupportRequestController::class, 'show'])->name('support-requests.show')->middleware('can:support-request.view');
        Route::get('/solicitacoes-de-atendimento/{supportRequest}/editar', [SupportRequestController::class, 'edit'])->name('support-requests.edit')->middleware(['can:support-request.update', 'can:support-request.view']);
        Route::put('/solicitacoes-de-atendimento/{supportRequest}', [SupportRequestController::class, 'update'])->name('support-requests.update')->middleware(['can:support-request.update', 'can:support-request.view']);
        Route::delete('/solicitacoes-de-atendimento/{supportRequest}', [SupportRequestController::class, 'destroy'])->name('support-requests.destroy')->middleware(['can:support-request.delete', 'can:support-request.view']);
        Route::get('/solicitacoes-de-atendimento/{supportRequest}/pdf', [SupportRequestController::class, 'pdf'])->name('support-requests.pdf')->middleware('can:support-request.view');
        Route::get('/solicitacoes-de-atendimento/{supportRequest}/anexos/{attachment}/baixar', [SupportRequestController::class, 'attachment'])->name('support-requests.attachment')->middleware('can:support-request.view');

        /* 2. GUARDIANS */
        Route::get('/alunos/{student}/responsaveis', [GuardianController::class, 'index'])->name('guardians.index')->middleware('can:guardian.view');
        Route::get('/responsavel/{guardian}/visualizar', [GuardianController::class, 'show'])->name('guardians.show')->middleware('can:guardian.view');
        Route::get('/alunos/{student}/responsaveis/criar', [GuardianController::class, 'create'])->name('guardians.create')->middleware('can:guardian.create');
        Route::post('/alunos/{student}/responsaveis/salvar', [GuardianController::class, 'store'])->name('guardians.store')->middleware('can:guardian.create');
        Route::get('/alunos/{student}/responsaveis/{guardian}/editar', [GuardianController::class, 'edit'])->name('guardians.edit')->middleware('can:guardian.update');
        Route::put('/alunos/{student}/responsaveis/{guardian}', [GuardianController::class, 'update'])->name('guardians.update')->middleware('can:guardian.update');
        Route::delete('/alunos/{student}/responsaveis/{guardian}', [GuardianController::class, 'destroy'])->name('guardians.destroy')->middleware('can:guardian.delete');

        /* 3. PROFESSIONALS */
        Route::get('/profissionais', [ProfessionalController::class, 'index'])->name('professionals.index')->middleware('can:professional.view');
        Route::get('/profissionais/{professional}/visualizar', [ProfessionalController::class, 'show'])->name('professionals.show')->middleware('can:professional.view');
        Route::get('/profissionais/criar', [ProfessionalController::class, 'create'])->name('professionals.create')->middleware('can:professional.create');
        Route::post('/profissionais/salvar', [ProfessionalController::class, 'store'])->name('professionals.store')->middleware('can:professional.create');
        Route::get('/profissionais/{professional}/editar', [ProfessionalController::class, 'edit'])->name('professionals.edit')->middleware('can:professional.update');
        Route::put('/profissionais/{professional}', [ProfessionalController::class, 'update'])->name('professionals.update')->middleware('can:professional.update');
        Route::delete('/profissionais/{professional}', [ProfessionalController::class, 'destroy'])->name('professionals.destroy')->middleware('can:professional.delete');

        /* 4. TEACHERS */
        Route::get('/professores', [TeacherController::class, 'index'])->name('teachers.index')->middleware('can:teacher.view');
        Route::get('/professores/{teacher}/visualizar', [TeacherController::class, 'show'])->name('teachers.show')->middleware('can:teacher.view');
        Route::get('/professores/criar', [TeacherController::class, 'create'])->name('teachers.create')->middleware('can:teacher.create');
        Route::post('/professores/salvar', [TeacherController::class, 'store'])->name('teachers.store')->middleware('can:teacher.create');
        Route::get('/professores/{teacher}/editar', [TeacherController::class, 'edit'])->name('teachers.edit')->middleware('can:teacher.update');
        Route::put('/professores/{teacher}', [TeacherController::class, 'update'])->name('teachers.update')->middleware('can:teacher.update');
        Route::delete('/professores/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy')->middleware('can:teacher.delete');
        Route::get('/professores/{teacher}/disciplinas', [TeacherController::class, 'disciplines'])->name('teachers.disciplines')->middleware('can:teacher.update');
        Route::put('/professores/{teacher}/disciplinas', [TeacherController::class, 'updateDisciplines'])->name('teachers.disciplines.update')->middleware('can:teacher.update');
        Route::post('/professores/{teacher}/disciplinas/copiar', [TeacherController::class, 'copyDisciplines'])->name('teachers.disciplines.copy')->middleware('can:teacher.update');
        Route::post('/professores/vinculos/copiar', [TeacherController::class, 'copyAllDisciplines'])->name('teachers.disciplines.copy-all')->middleware('can:teacher.update');

        /* 6. STUDENT DEFICIENCIES */
        Route::get('alunos/{student}/deficiencias/criar', [StudentDeficiencyController::class, 'create'])->name('student-deficiencies.create')->middleware('can:student-deficiency.create');
        Route::post('alunos/{student}/deficiencias', [StudentDeficiencyController::class, 'store'])->name('student-deficiencies.store')->middleware('can:student-deficiency.create');
        Route::get('alunos/{student}/deficiencias/{student_deficiency}', [StudentDeficiencyController::class, 'show'])->name('student-deficiencies.show')->middleware('can:student-deficiency.view');
        Route::get('alunos/{student}/deficiencias/{student_deficiency}/editar', [StudentDeficiencyController::class, 'edit'])->name('student-deficiencies.edit')->middleware('can:student-deficiency.update');
        Route::put('alunos/{student}/deficiencias/{student_deficiency}', [StudentDeficiencyController::class, 'update'])->name('student-deficiencies.update')->middleware('can:student-deficiency.update');
        Route::delete('alunos/{student}/deficiencias/{student_deficiency}', [StudentDeficiencyController::class, 'destroy'])->name('student-deficiencies.destroy')->middleware('can:student-deficiency.delete');

        /* 7. SESSIONS */
        Route::get('agendamentos', [SessionController::class, 'index'])->name('sessions.index')->middleware('can:session.view-all');
        Route::get('agendamentos/criar', [SessionController::class, 'create'])->name('sessions.create')->middleware('can:session.create');
        Route::post('agendamentos/salvar', [SessionController::class, 'store'])->name('sessions.store')->middleware('can:session.create');
        Route::get('agendamentos/{session}/visualizar', [SessionController::class, 'show'])->name('sessions.show')->middleware('can:session.view');
        Route::get('agendamentos/{session}/editar', [SessionController::class, 'edit'])->name('sessions.edit')->middleware('can:session.update');
        Route::put('agendamentos/{session}', [SessionController::class, 'update'])->name('sessions.update')->middleware('can:session.update');
        Route::delete('agendamentos/{session}', [SessionController::class, 'destroy'])->name('sessions.destroy')->middleware('can:session.delete');
        Route::post('agendamentos/{session}/restaurar', [SessionController::class, 'restore'])->withTrashed()->name('sessions.restore')->middleware('can:session.update');
        Route::delete('agendamentos/{session}/excluir-definitivamente', [SessionController::class, 'forceDelete'])->withTrashed()->name('sessions.force-delete')->middleware('can:session.delete');
        Route::get('agendamentos/disponibilidade', [SessionController::class, 'availability'])->name('sessions.availability')->middleware('can:session.view');
        Route::post('agendamentos/{session}/cancelar', [SessionController::class, 'cancel'])->name('sessions.cancel')->middleware('can:session.update');
        Route::get('alunos/{student}/agendamentos', [SessionController::class, 'indexByStudent'])->name('students.sessions.index')->middleware('can:session.view');
        Route::get('meus-agendamentos', [SessionController::class, 'mySessions'])->name('sessions.my-sessions')->middleware('can:session.view-own');

        /* 8. AEE RECORDS */
        Route::get('atendimentos-aee', [AeeRecordController::class, 'index'])->name('aee-records.index')->middleware('can:aee-record.view-all');
        Route::get('meus-atendimentos-aee', [AeeRecordController::class, 'myRecords'])->name('aee-records.my-records')->middleware('can:aee-record.view-own');
        // Registro direto de atendimento já realizado, sem agendamento prévio (antes de `{session}/criar`).
        Route::get('atendimentos-aee/registro-direto/criar', [AeeRecordController::class, 'createDirect'])->name('aee-records.direct.create')->middleware('can:aee-record.create');
        Route::post('atendimentos-aee/registro-direto/salvar', [AeeRecordController::class, 'storeDirect'])->name('aee-records.direct.store')->middleware('can:aee-record.create');
        Route::get('atendimentos-aee/{session}/criar', [AeeRecordController::class, 'create'])->name('aee-records.create')->middleware('can:aee-record.create');
        Route::post('atendimentos-aee/salvar', [AeeRecordController::class, 'store'])->name('aee-records.store')->middleware('can:aee-record.create');
        Route::get('atendimentos-aee/{aeeRecord}/visualizar', [AeeRecordController::class, 'show'])->name('aee-records.show')->middleware('can:aee-record.view');
        Route::get('atendimentos-aee/{aeeRecord}/editar', [AeeRecordController::class, 'edit'])->name('aee-records.edit')->middleware('can:aee-record.update');
        Route::put('atendimentos-aee/{aeeRecord}', [AeeRecordController::class, 'update'])->name('aee-records.update')->middleware('can:aee-record.update');
        Route::delete('atendimentos-aee/{aeeRecord}', [AeeRecordController::class, 'destroy'])->name('aee-records.destroy')->middleware('can:aee-record.delete');
        Route::get('atendimentos-aee/{aeeRecord}/pdf', [AeeRecordController::class, 'pdf'])->name('aee-records.pdf')->middleware('can:aee-record.view');
        Route::get('alunos/{student}/atendimentos-aee', [AeeRecordController::class, 'studentIndex'])->name('students.aee-records.index')->middleware('can:aee-record.view');
        Route::get('alunos/{student}/atendimentos-aee/pdf', [AeeRecordController::class, 'studentHistoryPdf'])->name('students.aee-records.history-pdf')->middleware('can:aee-record.view');
        Route::get('alunos/{student}/atendimentos-aee/{evaluation}/visualizar', [AeeRecordController::class, 'studentShow'])->name('students.aee-records.show')->middleware('can:aee-record.view');
        Route::get('alunos/{student}/atendimentos-aee/{evaluation}/editar', [AeeRecordController::class, 'studentEdit'])->name('students.aee-records.edit')->middleware('can:aee-record.update');
        Route::put('alunos/{student}/atendimentos-aee/{evaluation}', [AeeRecordController::class, 'studentUpdate'])->name('students.aee-records.update')->middleware('can:aee-record.update');
        Route::delete('alunos/{student}/atendimentos-aee/{evaluation}', [AeeRecordController::class, 'studentDestroy'])->name('students.aee-records.destroy')->middleware('can:aee-record.delete');
        Route::get('alunos/{student}/atendimentos-aee/{evaluation}/pdf', [AeeRecordController::class, 'studentPdf'])->name('students.aee-records.pdf')->middleware('can:aee-record.view');

        /* 8.1 PEDAGOGICAL RECORDS */
        Route::get('atendimentos-pedagogicos', [PedagogicalRecordController::class, 'index'])
            ->name('pedagogical-records.index')
            ->middleware('can:pedagogical-record.view-all');
        Route::get('meus-atendimentos-pedagogicos', [PedagogicalRecordController::class, 'myRecords'])
            ->name('pedagogical-records.my-records')
            ->middleware('can:pedagogical-record.view-own');
        // Registro direto de atendimento já realizado, sem agendamento prévio (antes de `{session}/criar`).
        Route::get('atendimentos-pedagogicos/registro-direto/criar', [PedagogicalRecordController::class, 'createDirect'])
            ->name('pedagogical-records.direct.create')
            ->middleware('can:pedagogical-record.create');
        Route::post('atendimentos-pedagogicos/registro-direto/salvar', [PedagogicalRecordController::class, 'storeDirect'])
            ->name('pedagogical-records.direct.store')
            ->middleware('can:pedagogical-record.create');
        Route::get('atendimentos-pedagogicos/{session}/criar', [PedagogicalRecordController::class, 'create'])
            ->name('pedagogical-records.create')
            ->middleware('can:pedagogical-record.create');
        Route::post('atendimentos-pedagogicos/salvar', [PedagogicalRecordController::class, 'store'])
            ->name('pedagogical-records.store')
            ->middleware('can:pedagogical-record.create');
        Route::get('atendimentos-pedagogicos/{pedagogicalRecord}/visualizar', [PedagogicalRecordController::class, 'show'])
            ->name('pedagogical-records.show')
            ->middleware('can:pedagogical-record.view');
        Route::get('atendimentos-pedagogicos/{pedagogicalRecord}/editar', [PedagogicalRecordController::class, 'edit'])
            ->name('pedagogical-records.edit')
            ->middleware('can:pedagogical-record.update');
        Route::put('atendimentos-pedagogicos/{pedagogicalRecord}', [PedagogicalRecordController::class, 'update'])
            ->name('pedagogical-records.update')
            ->middleware('can:pedagogical-record.update');
        Route::delete('atendimentos-pedagogicos/{pedagogicalRecord}', [PedagogicalRecordController::class, 'destroy'])
            ->name('pedagogical-records.destroy')
            ->middleware('can:pedagogical-record.delete');
        Route::get('atendimentos-pedagogicos/{pedagogicalRecord}/pdf', [PedagogicalRecordController::class, 'pdf'])
            ->name('pedagogical-records.pdf')
            ->middleware('can:pedagogical-record.view');
        Route::get('alunos/{student}/atendimentos-pedagogicos', [PedagogicalRecordController::class, 'studentIndex'])
            ->name('students.pedagogical-records.index')
            ->middleware('can:pedagogical-record.view');
        Route::get('alunos/{student}/atendimentos-pedagogicos/pdf', [PedagogicalRecordController::class, 'studentHistoryPdf'])
            ->name('students.pedagogical-records.pdf')
            ->middleware('can:pedagogical-record.view');

        /* 8.2 CASE STUDIES (ESTUDO DE CASO) */
        Route::get('estudos-de-caso', [CaseStudyController::class, 'all'])
            ->name('case-study.all')
            ->middleware('can:case-study.view');
        Route::get('estudos-de-caso/{student}/criar', [CaseStudyController::class, 'create'])
            ->name('case-study.create')
            ->middleware('can:case-study.create');
        Route::post('estudos-de-caso/{student}/salvar', [CaseStudyController::class, 'store'])
            ->name('case-study.store')
            ->middleware('can:case-study.create');
        Route::get('estudos-de-caso/{caseStudy}/visualizar', [CaseStudyController::class, 'show'])
            ->name('case-study.show')
            ->middleware('can:case-study.view');
        Route::get('estudos-de-caso/{caseStudy}/editar', [CaseStudyController::class, 'edit'])
            ->name('case-study.edit')
            ->middleware('can:case-study.update');
        Route::put('estudos-de-caso/{caseStudy}', [CaseStudyController::class, 'update'])
            ->name('case-study.update')
            ->middleware('can:case-study.update');
        Route::delete('estudos-de-caso/{caseStudy}', [CaseStudyController::class, 'destroy'])
            ->name('case-study.destroy')
            ->middleware('can:case-study.delete');
        Route::patch('estudos-de-caso/{caseStudy}/concluir', [CaseStudyController::class, 'complete'])
            ->name('case-study.complete')
            ->middleware('can:case-study.update');
        Route::post('estudos-de-caso/{caseStudy}/contribuicoes', [CaseStudyController::class, 'addContribution'])
            ->name('case-study.contributions.store')
            ->middleware('can:case-study.update');
        Route::get('estudos-de-caso/{caseStudy}/pdf', [CaseStudyController::class, 'pdf'])
            ->name('case-study.pdf')
            ->middleware('can:case-study.view');

        /* 8.3 PAEE */
        Route::get('paees', [PaeeController::class, 'all'])
            ->name('paee.all')
            ->middleware('can:paee.view');
        Route::get('paees/{caseStudy}/criar', [PaeeController::class, 'create'])
            ->name('paee.create')
            ->middleware('can:paee.create');
        Route::post('paees/salvar', [PaeeController::class, 'store'])
            ->name('paee.store')
            ->middleware('can:paee.create');
        Route::get('paees/{paee}/visualizar', [PaeeController::class, 'show'])
            ->name('paee.show')
            ->middleware('can:paee.view');
        Route::get('paees/{paee}/editar', [PaeeController::class, 'edit'])
            ->name('paee.edit')
            ->middleware('can:paee.update');
        Route::put('paees/{paee}', [PaeeController::class, 'update'])
            ->name('paee.update')
            ->middleware('can:paee.update');
        Route::delete('paees/{paee}', [PaeeController::class, 'destroy'])
            ->name('paee.destroy')
            ->middleware('can:paee.delete');
        Route::post('paees/{paee}/revisoes', [PaeeController::class, 'addReview'])
            ->name('paee.reviews.store')
            ->middleware('can:paee.update');
        Route::get('paees/{paee}/pdf', [PaeeController::class, 'pdf'])
            ->name('paee.pdf')
            ->middleware('can:paee.view');

        /* 9. STUDENT COURSES */
        Route::get('/cursos-do-aluno/{student}/criar', [StudentCourseController::class, 'create'])->name('student-courses.create')->middleware('can:student-course.create');
        Route::post('/cursos-do-aluno/salvar/{student}', [StudentCourseController::class, 'store'])->name('student-courses.store')->middleware('can:student-course.create');
        Route::get('/alunos/{student}/historico', [StudentCourseController::class, 'index'])->name('student-courses.history')->middleware('can:student-course.view');
        Route::get('cursos-do-aluno/{studentCourse}', [StudentCourseController::class, 'show'])->name('student-courses.show')->middleware('can:student-course.view');
        Route::get('/cursos-do-aluno/{studentCourse}/editar', [StudentCourseController::class, 'edit'])->name('student-courses.edit')->middleware('can:student-course.update');
        Route::put('/cursos-do-aluno/{studentCourse}', [StudentCourseController::class, 'update'])->name('student-courses.update')->middleware('can:student-course.update');
        Route::patch('/cursos-do-aluno/{studentCourse}/definir-atual', [StudentCourseController::class, 'makeCurrent'])->name('student-courses.make-current')->middleware('can:student-course.update');
        Route::delete('/cursos-do-aluno/{studentCourse}', [StudentCourseController::class, 'destroy'])->name('student-courses.destroy')->middleware('can:student-course.delete');

        /* 10. PENDENCIES */
        Route::get('/pendencias', [PendencyController::class, 'index'])->name('pendencies.index')->middleware('can:pendency.view');
        Route::get('/pendencias/{pendency}/visualizar', [PendencyController::class, 'show'])->name('pendencies.show')->middleware('can:pendency.view');
        Route::get('/pendencias/criar', [PendencyController::class, 'create'])->name('pendencies.create')->middleware('can:pendency.create');
        Route::post('/pendencias/salvar', [PendencyController::class, 'store'])->name('pendencies.store')->middleware('can:pendency.create');
        Route::get('/pendencias/{pendency}/editar', [PendencyController::class, 'edit'])->name('pendencies.edit')->middleware('can:pendency.update');
        Route::put('/pendencias/{pendency}', [PendencyController::class, 'update'])->name('pendencies.update')->middleware('can:pendency.update');
        Route::delete('/pendencias/{pendency}', [PendencyController::class, 'destroy'])->name('pendencies.destroy')->middleware('can:pendency.delete');
        Route::get('/minhas-pendencias', [PendencyController::class, 'myPendencies'])->name('pendencies.my')->middleware('can:pendency.view');
        Route::put('/pendencias/{pendency}/concluir', [PendencyController::class, 'markAsCompleted'])->name('pendencies.complete')->middleware('can:pendency.update');

        /* 11. PEI */
        Route::get('/peis', [PeiController::class, 'all'])->name('pei.all')->middleware('can:pei.view');
        Route::get('/alunos/{student}/peis', [PeiController::class, 'index'])->name('pei.index')->middleware('can:pei.view');
        Route::get('/peis/{pei}/visualizar', [PeiController::class, 'show'])->name('pei.show')->middleware('can:pei.view');
        Route::get('/alunos/{student}/peis/criar', [PeiController::class, 'create'])->name('pei.create')->middleware('can:pei.create');
        Route::post('/peis/aluno/{student}/salvar', [PeiController::class, 'store'])->name('pei.store')->middleware('can:pei.create');
        Route::delete('/peis/{pei}', [PeiController::class, 'destroy'])->name('pei.destroy')->middleware('can:pei.delete');
        Route::patch('/peis/{pei}/finalizar', [PeiController::class, 'finish'])->name('pei.finish')->middleware('can:pei.update');
        Route::patch('/peis/{pei}/outras-informacoes', [PeiController::class, 'updateOtherInfo'])->name('pei.other-info.update')->middleware('can:pei.update');
        Route::post('peis/{student}/versao', [PeiController::class, 'createVersion'])->name('pei.version.newVersion')->middleware('can:pei.create');
        Route::get('/peis/{pei}/disciplinas/{peiDiscipline}/pdf', [PeiController::class, 'generateDisciplinePdf'])->name('pei.discipline.pdf')->middleware('can:pei.view');
        Route::get('/peis/{pei}/pdf', [PeiController::class, 'generateCompletePdf'])->name('pei.pdf')->middleware('can:pei.view');
        Route::get('/peis/{pei}/pdf-familia', [PeiController::class, 'generateFamilyPdf'])->name('pei.pdf-family')->middleware('can:pei.view');

        Route::get('/peis/{pei}/disciplinas/criar', [PeiController::class, 'createDiscipline'])->name('pei-discipline.create')->middleware('can:pei-discipline.create');
        Route::post('/peis/{pei}/disciplinas/salvar', [PeiController::class, 'storeDiscipline'])->name('pei-discipline.store')->middleware('can:pei-discipline.create');
        Route::get('/peis/{pei}/disciplinas/{peiDiscipline}/visualizar', [PeiController::class, 'showDiscipline'])->name('pei-discipline.show')->middleware('can:pei-discipline.view')->scopeBindings();
        Route::get('/peis/{pei}/disciplinas/{peiDiscipline}/editar', [PeiController::class, 'editDiscipline'])->name('pei-discipline.edit')->middleware('can:pei-discipline.update')->scopeBindings();
        Route::put('/peis/{pei}/disciplinas/{peiDiscipline}', [PeiController::class, 'updateDiscipline'])->name('pei-discipline.update')->middleware('can:pei-discipline.update')->scopeBindings();
        Route::delete('/peis/{pei}/disciplinas/{peiDiscipline}', [PeiController::class, 'destroyDiscipline'])->name('pei-discipline.destroy')->middleware('can:pei-discipline.delete')->scopeBindings();
        Route::post('/peis/{pei}/disciplinas/{peiDiscipline}/revisoes', [PeiController::class, 'addDisciplineRevision'])->name('pei-discipline.revisions.store')->middleware('can:pei-discipline.update')->scopeBindings();
        Route::get('/peis/{pei}/disciplinas-do-professor', [PeiController::class, 'teacherDisciplines'])->name('teacher-disciplines');

        /* 13. STUDENT DOCUMENTS */
        Route::get('/alunos/{student}/documentos/criar', [StudentDocumentController::class, 'create'])->name('student-documents.create')->middleware('can:student-document.create');
        Route::post('/alunos/{student}/documentos', [StudentDocumentController::class, 'store'])->name('student-documents.store')->middleware('can:student-document.create');
        Route::get('/documentos-do-aluno/{student_document}/editar', [StudentDocumentController::class, 'edit'])->name('student-documents.edit')->middleware('can:student-document.update');
        Route::put('/documentos-do-aluno/{student_document}', [StudentDocumentController::class, 'update'])->name('student-documents.update')->middleware('can:student-document.update');
        Route::delete('/documentos-do-aluno/{student_document}', [StudentDocumentController::class, 'destroy'])->name('student-documents.destroy')->middleware('can:student-document.delete');
        Route::get('/documentos-do-aluno/{student_document}/baixar', [StudentDocumentController::class, 'download'])->name('student-documents.download')->middleware('can:student-document.view');
        Route::get('/documentos-do-aluno/{student_document}/visualizar', [StudentDocumentController::class, 'show'])->name('student-documents.view')->middleware('can:student-document.view');

    });
});
