<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Controllers;

use App\Domains\Auth\Application\Resolvers\AuthenticatedUserResolver;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Application\Actions\PeiDisciplineRevisions\AddPeiDisciplineRevisionAction;
use App\Domains\Inclusion\Application\Actions\PeiDisciplines\BulkAssignPeiDisciplinesAction;
use App\Domains\Inclusion\Application\Actions\PeiDisciplines\DeletePeiDisciplineAction;
use App\Domains\Inclusion\Application\Actions\PeiDisciplines\UpdatePeiDisciplineAction;
use App\Domains\Inclusion\Application\Actions\Peis\CreatePeiAction;
use App\Domains\Inclusion\Application\Actions\Peis\DeletePeiAction;
use App\Domains\Inclusion\Application\Actions\Peis\FinishPeiAction;
use App\Domains\Inclusion\Application\Data\PeiDisciplineRevisions\AddPeiDisciplineRevisionData;
use App\Domains\Inclusion\Application\Data\PeiDisciplines\BulkAssignPeiDisciplinesData;
use App\Domains\Inclusion\Application\Data\PeiDisciplines\UpdatePeiDisciplineData;
use App\Domains\Inclusion\Application\Data\Peis\ListPeisData;
use App\Domains\Inclusion\Application\Queries\PeiDisciplines\PeiDisciplineFormQuery;
use App\Domains\Inclusion\Application\Queries\PeiDisciplines\TeacherDisciplinesQuery;
use App\Domains\Inclusion\Application\Queries\Peis\ListAllPeisQuery;
use App\Domains\Inclusion\Application\Queries\Peis\ListStudentPeisQuery;
use App\Domains\Inclusion\Application\Queries\Peis\PeiAttendanceSummaryQuery;
use App\Domains\Inclusion\Application\Queries\Peis\PeiFilterOptionsQuery;
use App\Domains\Inclusion\Application\Queries\Peis\PeiFormQuery;
use App\Domains\Inclusion\Application\Queries\Peis\ShowPeiQuery;
use App\Domains\Inclusion\Application\Queries\Peis\TeacherPeiAccessQuery;
use App\Domains\Inclusion\Domain\Exceptions\InvalidStudent;
use App\Domains\Inclusion\Domain\Models\Pei;
use App\Domains\Inclusion\Domain\Models\PeiDiscipline;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\UI\Presenters\PeiPagePresenter;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class PeiController
{
    public function __construct(
        private readonly TeacherPeiAccessQuery $teacherAccess,
    ) {}

    /**
     * @throws Throwable
     */
    public function all(
        ListPeisData $filters,
        ListAllPeisQuery $query,
        PeiFilterOptionsQuery $filterOptions,
        PeiPagePresenter $presenter,
        Request $request,
    ): InertiaResponse {
        $user = $request->user();
        $peis = $query->execute($filters, $user instanceof User ? $user : null);

        return Inertia::render(
            'Inclusion/Peis/All',
            $presenter->all($peis, $filterOptions->students(), $filterOptions->semesters(), $filters, $request),
        );
    }

    /**
     * @throws Throwable
     */
    public function index(
        Student $student,
        ListPeisData $filters,
        ListStudentPeisQuery $query,
        PeiFilterOptionsQuery $filterOptions,
        PeiPagePresenter $presenter,
        Request $request,
    ): InertiaResponse {
        $user = $request->user();
        $peis = $query->execute($student, $filters, $user instanceof User ? $user : null);

        return Inertia::render(
            'Inclusion/Peis/Index',
            $presenter->index($peis, $student, $filterOptions->semesters(), $filterOptions->disciplines(), $filters, $request),
        );
    }

    public function show(
        Pei $pei,
        ShowPeiQuery $query,
        PeiAttendanceSummaryQuery $attendanceSummaryQuery,
        PeiPagePresenter $presenter,
        Request $request,
    ): InertiaResponse {
        $this->ensureCanView($pei, $request);
        $pei = $query->execute($pei);

        return Inertia::render(
            'Inclusion/Peis/Show',
            $presenter->show($pei, $request, $attendanceSummaryQuery->execute($pei)),
        );
    }

    /**
     * @throws InvalidStudent
     */
    public function create(Student $student, PeiFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Inclusion/Peis/Create',
            $form->forCreation($student),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(
        Student $student,
        CreatePeiAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($student, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'peis',
            ])
            ->with('success', 'PEI gerado com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(
        Pei $pei,
        DeletePeiAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $studentId = $action->execute($pei, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $studentId,
                'tab' => 'peis',
            ])
            ->with('success', 'PEI removido com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function finish(
        Pei $pei,
        FinishPeiAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $pei = $action->execute($pei, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $pei->student_id,
                'tab' => 'peis',
            ])
            ->with('success', 'PEI finalizado com sucesso.');
    }

    public function updateOtherInfo(Pei $pei, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'other_relevant_info' => ['nullable', 'string', 'max:100000'],
        ]);

        $pei->updateOtherRelevantInfo($validated['other_relevant_info'] ?? null);
        $pei->save();

        return redirect()
            ->route('specialized-educational-support.pei.show', $pei)
            ->with('success', 'Informações do PEI atualizadas com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function createVersion(
        Student $student,
        CreatePeiAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($student, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'peis',
            ])
            ->with('success', 'Nova versão criada com sucesso.');
    }

    public function generateDisciplinePdf(Pei $pei, PeiDiscipline $peiDiscipline, Request $request): Response
    {
        if ($peiDiscipline->pei_id !== $pei->id) {
            abort(404);
        }

        $this->ensureCanView($pei, $request);

        $pei->load([
            'student.person',
            'student.deficiencies',
            'paee',
            'course',
            'semester',
            'creator',
        ]);

        $peiDiscipline->load(['discipline', 'teacher.person', 'revisions.reviewer']);

        $pdf = Pdf::loadView('pages.inclusion.peis.pdf', [
            'pei' => $pei,
            'item' => $peiDiscipline,
        ])->setPaper('a4', 'portrait');

        $disciplineName = str_replace(' ', '_', $peiDiscipline->discipline->name);

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("PEI_{$disciplineName}.pdf");
    }

    public function generateCompletePdf(Pei $pei, Request $request): Response
    {
        $this->ensureCanView($pei, $request);

        $pei->load([
            'student.person',
            'student.deficiencies',
            'paee',
            'course',
            'semester',
            'creator',
        ]);

        $peiDisciplines = $pei->peiDisciplines()
            ->with(['discipline', 'teacher.person', 'creator', 'revisions.reviewer'])
            ->orderBy('id')
            ->get();

        $pdf = Pdf::loadView('pages.inclusion.peis.pdf-complete', [
            'pei' => $pei,
            'peiDisciplines' => $peiDisciplines,
        ])->setPaper('a4', 'portrait');

        $studentName = str_replace(' ', '_', $pei->student->person->name);

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("PEI_COMPLETO_{$studentName}_v{$pei->version}.pdf");
    }

    /** @throws Throwable */
    public function generateFamilyPdf(Pei $pei, PeiAttendanceSummaryQuery $attendanceSummaryQuery, Request $request): Response
    {
        $this->ensureCanView($pei, $request);

        $pei->load(['student.person', 'paee', 'course', 'semester']);

        $peiDisciplines = $pei->peiDisciplines()
            ->with(['discipline', 'teacher.person'])
            ->orderBy('id')
            ->get();

        $attendanceSummary = $attendanceSummaryQuery->execute($pei);

        $pdf = Pdf::loadView('pages.inclusion.peis.pdf-family', [
            'pei' => $pei,
            'peiDisciplines' => $peiDisciplines,
            'attendanceSummary' => $attendanceSummary,
        ])->setPaper('a4', 'portrait');

        $studentName = str_replace(' ', '_', $pei->student->person->name);

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("PEI_FAMILIA_{$studentName}_v{$pei->version}.pdf");
    }

    public function showDiscipline(
        Pei $pei,
        PeiDiscipline $peiDiscipline,
        PeiPagePresenter $presenter,
        Request $request,
    ): InertiaResponse {
        $this->ensureCanView($pei, $request);

        return Inertia::render(
            'Inclusion/Peis/Disciplines/Show',
            $presenter->discipline($pei, $peiDiscipline, $request),
        );
    }

    /**
     * @throws InvalidStudent
     */
    public function createDiscipline(Pei $pei, PeiDisciplineFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'Inclusion/Peis/Disciplines/Create',
            $form->forCreation($pei),
        );
    }

    /**
     * @throws Throwable
     */
    public function storeDiscipline(
        Pei $pei,
        BulkAssignPeiDisciplinesAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $assignments = collect($request->input('teacher_ids', []))
            ->filter(fn ($teacherId): bool => filled($teacherId))
            ->map(fn ($teacherId, $disciplineId): array => [
                'discipline_id' => (int) $disciplineId,
                'teacher_id' => (int) $teacherId,
            ])
            ->values()
            ->all();

        $data = new BulkAssignPeiDisciplinesData(assignments: $assignments);
        $result = $action->execute($pei, $authenticatedUser->fromRequest($request), $data);

        if ($result['created'] === 0) {
            return back()->with('error', 'Nenhuma adaptação foi criada. Selecione ao menos um professor.');
        }

        $message = "{$result['created']} adaptação(ões) criada(s) com sucesso. Preencha o conteúdo pedagógico de cada uma em seguida.";

        if ($result['skipped'] !== []) {
            $message .= ' Alguns itens foram ignorados: '.implode(' ', $result['skipped']);
        }

        return redirect()
            ->route('specialized-educational-support.pei.show', [
                'pei' => $pei,
                'tab' => 'disciplines',
            ])
            ->with('success', $message);
    }

    public function editDiscipline(
        Pei $pei,
        PeiDiscipline $peiDiscipline,
        PeiDisciplineFormQuery $form,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): InertiaResponse {
        return Inertia::render(
            'Inclusion/Peis/Disciplines/Edit',
            $form->forUpdate($pei, $peiDiscipline, $authenticatedUser->fromRequest($request)),
        );
    }

    /**
     * @throws Throwable
     */
    public function updateDiscipline(
        UpdatePeiDisciplineData $data,
        Pei $pei,
        PeiDiscipline $peiDiscipline,
        UpdatePeiDisciplineAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($peiDiscipline, $authenticatedUser->fromRequest($request), $data);

        return redirect()
            ->route('specialized-educational-support.pei.show', [
                'pei' => $pei,
                'tab' => 'disciplines',
            ])
            ->with('success', 'Adaptação de disciplina atualizada com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroyDiscipline(
        Pei $pei,
        PeiDiscipline $peiDiscipline,
        DeletePeiDisciplineAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($peiDiscipline, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.pei.show', [
                'pei' => $pei,
                'tab' => 'disciplines',
            ])
            ->with('success', 'Adaptação removida com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function addDisciplineRevision(
        Pei $pei,
        PeiDiscipline $peiDiscipline,
        AddPeiDisciplineRevisionData $data,
        AddPeiDisciplineRevisionAction $action,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): RedirectResponse {
        $action->execute($peiDiscipline, $data, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.pei-discipline.show', [$pei, $peiDiscipline])
            ->with('success', 'Revisão da adaptação registrada com sucesso.');
    }

    public function teacherDisciplines(Request $request, Pei $pei, TeacherDisciplinesQuery $query): JsonResponse
    {
        $teacherId = $request->integer('teacher_id');

        if (! $teacherId) {
            return response()->json([]);
        }

        return response()->json($query->execute($pei, $teacherId));
    }

    /** Professores só abrem os PEIs em que são responsáveis por alguma adaptação. */
    private function ensureCanView(Pei $pei, Request $request): void
    {
        $user = $request->user();

        abort_unless(
            $this->teacherAccess->canView($pei, $user instanceof User ? $user : null),
            403,
            'Este PEI não possui adaptações sob sua responsabilidade.',
        );
    }
}
