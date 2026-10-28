<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\UI\Controllers;

use App\Domains\Auth\Application\Resolvers\AuthenticatedUserResolver;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplineRevisions\AddPeiDisciplineRevisionAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines\BulkAssignPeiDisciplinesAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines\DeletePeiDisciplineAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines\UpdatePeiDisciplineAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Peis\CreatePeiAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Peis\DeletePeiAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Peis\FinishPeiAction;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplineRevisions\AddPeiDisciplineRevisionData;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\BulkAssignPeiDisciplinesData;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\UpdatePeiDisciplineData;
use App\Domains\SpecializedEducationalSupport\Application\Data\Peis\ListPeisData;
use App\Domains\SpecializedEducationalSupport\Application\Queries\PeiDisciplines\PeiDisciplineFormQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\PeiDisciplines\TeacherDisciplinesQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\ListAllPeisQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\ListStudentPeisQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\PeiFilterOptionsQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\PeiFormQuery;
use App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\ShowPeiQuery;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidStudent;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Pei;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Throwable;

final class PeiController
{
    /**
     * @throws Throwable
     */
    public function all(
        ListPeisData $filters,
        ListAllPeisQuery $query,
        PeiFilterOptionsQuery $filterOptions,
        Request $request,
    ): View|string {
        $user = $request->user();
        $peis = $query->execute($filters, $user instanceof User ? $user : null);

        $students = $filterOptions->students();
        $semesters = $filterOptions->semesters();

        if ($request->ajax()) {
            return view(
                'pages.specialized-educational-support.peis.partials.table-all',
                compact('peis')
            )->render();
        }

        return view(
            'pages.specialized-educational-support.peis.all',
            compact('peis', 'students', 'semesters')
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
        Request $request,
    ): View|string {
        $user = $request->user();
        $peis = $query->execute($student, $filters, $user instanceof User ? $user : null);
        $semesters = $filterOptions->semesters();
        $disciplines = $filterOptions->disciplines();

        if ($request->ajax()) {
            return view(
                'pages.specialized-educational-support.peis.partials.table',
                compact('peis')
            )->render();
        }

        return view(
            'pages.specialized-educational-support.peis.index',
            compact('peis', 'student', 'semesters', 'disciplines')
        );
    }

    public function show(Pei $pei, ShowPeiQuery $query, \App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\PeiAttendanceSummaryQuery $attendanceSummaryQuery): View
    {
        $pei = $query->execute($pei);

        \App\Shared\Domain\Support\AuditLogger::logView($pei);

        $student = $pei->student;
        $paee = $pei->paee;

        $peiDisciplines = $pei->peiDisciplines()
            ->with(['discipline', 'teacher.person', 'creator'])
            ->latest()
            ->paginate(5);

        $attendanceSummary = $attendanceSummaryQuery->execute($pei);

        return view('pages.specialized-educational-support.peis.show', compact(
            'pei', 'student', 'paee', 'peiDisciplines', 'attendanceSummary'
        ));
    }

    /**
     * @throws InvalidStudent
     */
    public function create(Student $student, PeiFormQuery $form): View
    {
        return view(
            'pages.specialized-educational-support.peis.create',
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
        $pei = $action->execute($student, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.pei.show', $pei)
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
            ->route('specialized-educational-support.pei.index', $studentId)
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
            ->route('specialized-educational-support.pei.show', $pei)
            ->with('success', 'PEI finalizado com sucesso.');
    }

    public function updateOtherInfo(Pei $pei, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'other_relevant_info' => ['nullable', 'string', 'max:100000'],
        ]);

        $pei->updateOtherRelevantInfo($validated['other_relevant_info'] ?? null);
        $pei->save();

        \App\Shared\Domain\Support\AuditLogger::logUpdated($pei, ['other_relevant_info' => ['from' => null, 'to' => $pei->other_relevant_info]]);

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
        $pei = $action->execute($student, $authenticatedUser->fromRequest($request));

        return redirect()
            ->route('specialized-educational-support.pei.show', $pei)
            ->with('success', 'Nova versão criada com sucesso.');
    }

    public function generateDisciplinePdf(Pei $pei, PeiDiscipline $peiDiscipline): Response
    {
        if ($peiDiscipline->pei_id !== $pei->id) {
            abort(404);
        }

        $pei->load([
            'student.person',
            'student.deficiencies',
            'paee',
            'course',
            'semester',
        ]);

        $peiDiscipline->load(['discipline', 'teacher.person']);

        $pdf = Pdf::loadView('pages.specialized-educational-support.peis.pdf', [
            'pei' => $pei,
            'item' => $peiDiscipline,
        ])->setPaper('a4', 'portrait');

        $disciplineName = str_replace(' ', '_', $peiDiscipline->discipline->name);

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("PEI_{$disciplineName}.pdf");
    }

    public function generateCompletePdf(Pei $pei): Response
    {
        $pei->load([
            'student.person',
            'student.deficiencies',
            'paee',
            'course',
            'semester',
        ]);

        $peiDisciplines = $pei->peiDisciplines()
            ->with(['discipline', 'teacher.person', 'creator'])
            ->orderBy('id')
            ->get();

        $pdf = Pdf::loadView('pages.specialized-educational-support.peis.pdf-complete', [
            'pei' => $pei,
            'peiDisciplines' => $peiDisciplines,
        ])->setPaper('a4', 'portrait');

        $studentName = str_replace(' ', '_', $pei->student->person->name);

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("PEI_COMPLETO_{$studentName}_v{$pei->version}.pdf");
    }

    /** @throws Throwable */
    public function generateFamilyPdf(Pei $pei, \App\Domains\SpecializedEducationalSupport\Application\Queries\Peis\PeiAttendanceSummaryQuery $attendanceSummaryQuery): Response
    {
        $pei->load(['student.person', 'paee', 'course', 'semester']);

        $peiDisciplines = $pei->peiDisciplines()
            ->with(['discipline', 'teacher.person'])
            ->orderBy('id')
            ->get();

        $attendanceSummary = $attendanceSummaryQuery->execute($pei);

        $pdf = Pdf::loadView('pages.specialized-educational-support.peis.pdf-family', [
            'pei' => $pei,
            'peiDisciplines' => $peiDisciplines,
            'attendanceSummary' => $attendanceSummary,
        ])->setPaper('a4', 'portrait');

        $studentName = str_replace(' ', '_', $pei->student->person->name);

        PdfPageNumberer::apply($pdf);

        return $pdf->stream("PEI_FAMILIA_{$studentName}_v{$pei->version}.pdf");
    }

    public function showDiscipline(Pei $pei, PeiDiscipline $peiDiscipline): View
    {
        $peiDiscipline->load(['teacher.person', 'discipline', 'creator', 'revisions.reviewer']);
        $student = $pei->student->load('person');

        return view('pages.specialized-educational-support.peis.disciplines.show', compact('pei', 'peiDiscipline', 'student'));
    }

    /**
     * @throws InvalidStudent
     */
    public function createDiscipline(Pei $pei, PeiDisciplineFormQuery $form): View
    {
        return view(
            'pages.specialized-educational-support.peis.disciplines.create',
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
            ->route('specialized-educational-support.pei.show', $pei)
            ->with('success', $message);
    }

    public function editDiscipline(
        Pei $pei,
        PeiDiscipline $peiDiscipline,
        PeiDisciplineFormQuery $form,
        AuthenticatedUserResolver $authenticatedUser,
        Request $request,
    ): View {
        return view(
            'pages.specialized-educational-support.peis.disciplines.edit',
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
            ->route('specialized-educational-support.pei.show', $pei)
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
            ->route('specialized-educational-support.pei.show', $pei)
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
}
