<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines\UpdatePeiDisciplineAction;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\UpdatePeiDisciplineData;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Students\StudentPdfQuery;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidStudentDocument;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use App\Domains\SpecializedEducationalSupport\Domain\Models\StudentDocument;
use App\Domains\SpecializedEducationalSupport\Infrastructure\Storage\StudentDocumentStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class TeacherPortalController
{
    public function index(Request $request): View
    {
        $teacherId = $this->teacherId($request);

        $assignments = PeiDiscipline::query()
            ->where('teacher_id', $teacherId)
            ->whereHas('pei', fn ($query) => $query->where('is_current', true))
            ->with(['discipline', 'pei.student.person', 'pei.course'])
            ->get()
            ->sortBy(fn (PeiDiscipline $item): string => $item->pei->student->person->name ?? '');

        return view('pages.teacher-portal.index', ['assignments' => $assignments]);
    }

    public function showStudent(Student $student, Request $request, StudentPdfQuery $query): View|Response
    {
        $this->ensureCanAccessStudent($student, $this->teacherId($request));

        $student = $query->execute($student);

        return view('pages.teacher-portal.student-show', ['student' => $student]);
    }

    public function editDiscipline(PeiDiscipline $peiDiscipline, Request $request): View|Response
    {
        $this->ensureOwnsDiscipline($peiDiscipline, $this->teacherId($request));

        $peiDiscipline->load(['discipline', 'pei.student.person']);

        return view('pages.teacher-portal.discipline-edit', ['peiDiscipline' => $peiDiscipline]);
    }

    /** @throws Throwable */
    public function updateDiscipline(PeiDiscipline $peiDiscipline, Request $request, UpdatePeiDisciplineAction $action): RedirectResponse|Response
    {
        $this->ensureOwnsDiscipline($peiDiscipline, $this->teacherId($request));

        $validated = $request->validate([
            'specific_objectives' => ['required', 'string'],
            'content_programmatic' => ['required', 'string'],
            'methodologies' => ['required', 'string'],
            'evaluations' => ['required', 'string'],
            'opinion' => ['nullable', 'string'],
            'complementary_records' => ['nullable', 'string'],
            'curricular_reference' => ['nullable', 'string'],
            'materials_and_assistive_technology' => ['nullable', 'string'],
            'objectives_deadline' => ['nullable', 'string', 'max:255'],
        ]);

        $data = new UpdatePeiDisciplineData(
            teacherId: $peiDiscipline->teacher_id,
            disciplineId: $peiDiscipline->discipline_id,
            specificObjectives: $validated['specific_objectives'],
            contentProgrammatic: $validated['content_programmatic'],
            methodologies: $validated['methodologies'],
            evaluations: $validated['evaluations'],
            opinion: $validated['opinion'] ?? null,
            complementaryRecords: $validated['complementary_records'] ?? null,
            curricularReference: $validated['curricular_reference'] ?? null,
            materialsAndAssistiveTechnology: $validated['materials_and_assistive_technology'] ?? null,
            objectivesDeadline: $validated['objectives_deadline'] ?? null,
        );

        $user = $request->user();
        $action->execute($peiDiscipline, $user, $data);

        return redirect()
            ->route('teacher-portal.index')
            ->with('success', 'Adaptação atualizada com sucesso.');
    }

    /** @throws InvalidStudentDocument */
    public function viewDocument(StudentDocument $document, Request $request, StudentDocumentStorage $storage): StreamedResponse
    {
        $this->ensureCanAccessStudent(Student::findOrFail($document->student_id), $this->teacherId($request));

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
