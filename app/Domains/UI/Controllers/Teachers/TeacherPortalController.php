<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Teachers;

use App\Domains\Application\Resolvers\Auth\AuthenticatedUserResolver;
use App\Domains\Application\Data\Teachers\ListTeacherAssignmentsData;
use App\Domains\Application\Queries\Teachers\ListTeacherAssignmentsQuery;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Actions\PeiDisciplines\UpdatePeiDisciplineAction;
use App\Domains\Application\Data\PeiDisciplines\UpdatePeiDisciplineData;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Exceptions\StudentDocuments\InvalidStudentDocument;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Infrastructure\Storage\StudentDocuments\StudentDocumentStorage;
use App\Domains\Application\Queries\Students\StudentPdfQuery;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\UI\Presenters\Teachers\TeacherPortalPagePresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class TeacherPortalController
{
    public function __construct(private readonly TeacherPortalPagePresenter $presenter) {}

    public function index(
        Request $request,
        ListTeacherAssignmentsData $data,
        ListTeacherAssignmentsQuery $query,
    ): InertiaResponse {
        $assignments = $query->execute($this->teacherId($request), $data);

        return Inertia::render('TeacherPortal/Index', [
            ...$this->presenter->index($assignments),
            'filters' => [
                'student' => $data->student ?? '',
                'discipline' => $data->discipline ?? '',
                'course' => $data->course ?? '',
            ],
        ]);
    }

    public function showStudent(Student $student, Request $request, StudentPdfQuery $query): InertiaResponse
    {
        $teacherId = $this->teacherId($request);
        $this->ensureCanAccessStudent($student, $teacherId);

        $student = $query->execute($student);

        $tab = $request->query('tab');

        return Inertia::render('TeacherPortal/StudentShow', [
            ...$this->presenter->student($student, $teacherId),
            'initialTab' => in_array($tab, ['documents', 'case-study', 'paee', 'pei'], true)
                ? $tab : 'pei',
        ]);
    }

    public function editDiscipline(PeiDiscipline $peiDiscipline, Request $request): InertiaResponse
    {
        $this->ensureOwnsDiscipline($peiDiscipline, $this->teacherId($request));

        $peiDiscipline->load(['discipline', 'pei.student.person']);

        return Inertia::render('TeacherPortal/DisciplineEdit', $this->presenter->discipline($peiDiscipline));
    }

    /** @throws Throwable */
    public function updateDiscipline(
        UpdatePeiDisciplineData $data,
        PeiDiscipline $peiDiscipline,
        UpdatePeiDisciplineAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $this->ensureOwnsDiscipline($peiDiscipline, $this->teacherId($request));

        $action->execute($peiDiscipline, $authenticatedUser->fromRequest($request), $data);

        return redirect()
            ->route('teacher-portal.index')
            ->with('success', 'Adaptação atualizada com sucesso.');
    }

    /** @throws InvalidStudentDocument */
    public function viewDocument(StudentDocument $document, Request $request, StudentDocumentStorage $storage): StreamedResponse
    {
        $this->ensureCanAccessStudent(Student::findOrFail($document->student_id), $this->teacherId($request));

        abort_unless($document->isVisibleInTeacherPortal(), 403, 'Este documento não está disponível no portal do professor.');

        return $storage->inline($document);
    }

    private function teacherId(Request $request): int
    {
        $user = $request->user();

        abort_unless($user instanceof User && $user->teacher_id !== null, 403);

        return (int) $user->teacher_id;
    }

    private function ensureCanAccessStudent(Student $student, int $teacherId): void
    {
        $hasAccess = PeiDiscipline::query()
            ->where('teacher_id', $teacherId)
            ->whereHas('pei', fn ($query) => $query
                ->where('is_current', true)
                ->where('student_id', $student->getKey()))
            ->exists();

        abort_unless($hasAccess, 403, 'Você não tem vínculo com este aluno.');
    }

    private function ensureOwnsDiscipline(PeiDiscipline $peiDiscipline, int $teacherId): void
    {
        abort_unless((int) $peiDiscipline->teacher_id === $teacherId, 403, 'Esta adaptação não pertence a você.');

        $belongsToCurrentPei = $peiDiscipline->pei()->where('is_current', true)->exists();

        abort_unless($belongsToCurrentPei, 403, 'Esta adaptação pertence a uma versão antiga do PEI e não pode mais ser editada por aqui.');
    }
}
