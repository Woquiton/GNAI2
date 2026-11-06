<?php

declare(strict_types=1);

namespace App\UI\Controllers;

use App\Domains\Auth\Domain\Models\User;
use App\Application\Actions\PedagogicalRecords\CreateDirectPedagogicalRecordAction;
use App\Application\Actions\PedagogicalRecords\CreatePedagogicalRecordAction;
use App\Application\Actions\PedagogicalRecords\DeletePedagogicalRecordAction;
use App\Application\Actions\PedagogicalRecords\UpdatePedagogicalRecordAction;
use App\Application\Data\PedagogicalRecords\CreateDirectPedagogicalRecordData;
use App\Application\Data\PedagogicalRecords\CreatePedagogicalRecordData;
use App\Application\Data\PedagogicalRecords\ListPedagogicalRecordsData;
use App\Application\Data\PedagogicalRecords\UpdatePedagogicalRecordData;
use App\Application\Queries\AttendanceRecords\AttendanceRecordFilterOptionsQuery;
use App\Application\Queries\PedagogicalRecords\ListPedagogicalRecordsQuery;
use App\Application\Queries\PedagogicalRecords\PedagogicalRecordFormQuery;
use App\Application\Queries\PedagogicalRecords\ShowPedagogicalRecordQuery;
use App\Application\Queries\Students\StudentPedagogicalRecordsQuery;
use App\Domain\Models\PedagogicalRecord;
use App\Domain\Models\Session;
use App\Domain\Models\Student;
use App\UI\Presenters\PedagogicalRecordPagePresenter;
use App\Shared\Application\Exceptions\AccessDeniedException;
use App\Shared\Infrastructure\Pdf\PdfPageNumberer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

final class PedagogicalRecordController
{
    public function index(ListPedagogicalRecordsData $filters, ListPedagogicalRecordsQuery $query, AttendanceRecordFilterOptionsQuery $options, PedagogicalRecordPagePresenter $presenter, Request $request): InertiaResponse
    {
        $user = $this->user($request);
        $pedagogicalRecords = $query->execute($filters, $user);

        return Inertia::render('PedagogicalRecords/Index', $presenter->listing($pedagogicalRecords, $options->execute(), $user, $request));
    }

    public function myRecords(ListPedagogicalRecordsData $filters, ListPedagogicalRecordsQuery $query, AttendanceRecordFilterOptionsQuery $options, PedagogicalRecordPagePresenter $presenter, Request $request): InertiaResponse
    {
        $user = $this->user($request);
        $pedagogicalRecords = $query->execute($filters, $user, onlyOwn: true);

        return Inertia::render('PedagogicalRecords/MyRecords', $presenter->listing($pedagogicalRecords, $options->execute(), $user, $request));
    }

    public function studentIndex(Student $student, ListPedagogicalRecordsData $filters, ListPedagogicalRecordsQuery $query, AttendanceRecordFilterOptionsQuery $options, PedagogicalRecordPagePresenter $presenter, Request $request): InertiaResponse
    {
        $student->loadMissing('person');
        $user = $this->user($request);
        $pedagogicalRecords = $query->execute($filters, $user, student: $student);

        return Inertia::render(
            'Students/PedagogicalRecords/Index',
            $presenter->listing($pedagogicalRecords, $options->execute(), $user, $request) + [
                'student' => [
                    'id' => $student->getKey(),
                    'name' => $student->person?->name,
                ],
            ],
        );
    }

    public function create(Session $session, PedagogicalRecordFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render('PedagogicalRecords/Create', $form->forCreation($session, $this->professionalId($request)));
    }

    /** @throws Throwable */
    public function store(CreatePedagogicalRecordData $data, CreatePedagogicalRecordAction $action, Request $request): RedirectResponse
    {
        $record = $action->execute($data, $this->professionalId($request));

        return redirect()->route('specialized-educational-support.pedagogical-records.show', $record)->with('success', 'Atendimento pedagógico criado com sucesso.');
    }

    /** Atendimento já realizado sem agendamento prévio: o agendamento é criado junto do registro. */
    public function createDirect(PedagogicalRecordFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render('PedagogicalRecords/CreateDirect', $form->forDirectCreation($this->professionalId($request)) + [
            'backUrl' => route($this->listRoute($request)),
        ]);
    }

    /** @throws Throwable */
    public function storeDirect(CreateDirectPedagogicalRecordData $data, CreateDirectPedagogicalRecordAction $action, Request $request): RedirectResponse
    {
        $record = $action->execute($data, $this->professionalId($request), (int) $this->user($request)->getKey());

        return redirect()->route('specialized-educational-support.pedagogical-records.show', $record)->with('success', 'Atendimento pedagógico criado com sucesso.');
    }

    public function show(PedagogicalRecord $pedagogicalRecord, ShowPedagogicalRecordQuery $query, PedagogicalRecordPagePresenter $presenter, Request $request): InertiaResponse
    {
        $user = $this->user($request);
        $pedagogicalRecord = $query->execute($pedagogicalRecord, $user);

        return Inertia::render(
            'PedagogicalRecords/Show',
            $presenter->show($pedagogicalRecord, $user) + [
                'returnStudentId' => $request->integer('student_id'),
            ],
        );
    }

    public function edit(PedagogicalRecord $pedagogicalRecord, PedagogicalRecordFormQuery $form, Request $request): InertiaResponse
    {
        return Inertia::render(
            'PedagogicalRecords/Edit',
            $form->forUpdate($pedagogicalRecord, $this->professionalId($request)) + [
                'returnStudentId' => $request->integer('student_id'),
            ],
        );
    }

    /** @throws Throwable */
    public function update(UpdatePedagogicalRecordData $data, PedagogicalRecord $pedagogicalRecord, UpdatePedagogicalRecordAction $action, Request $request): RedirectResponse
    {
        $pedagogicalRecord = $action->execute($pedagogicalRecord, $data, $this->professionalId($request));
        $parameters = ['pedagogicalRecord' => $pedagogicalRecord];

        // Edição aberta pelo prontuário: a visualização mantém a origem para o Voltar.
        if ($request->integer('student_id') > 0) {
            $parameters['student_id'] = $request->integer('student_id');
        }

        return redirect()->route('specialized-educational-support.pedagogical-records.show', $parameters)->with('success', 'Atendimento pedagógico atualizado com sucesso.');
    }

    /** @throws Throwable */
    public function destroy(PedagogicalRecord $pedagogicalRecord, DeletePedagogicalRecordAction $action, Request $request): RedirectResponse
    {
        $sessionId = $action->execute($pedagogicalRecord, $this->professionalId($request));

        if ($request->integer('student_id') > 0) {
            return redirect()->route(
                'specialized-educational-support.students.show',
                [
                    'student' => $request->integer('student_id'),
                    'tab' => 'pedagogical-attendance',
                ],
            )->with('success', 'Atendimento pedagógico removido com sucesso.');
        }

        // O agendamento do registro direto é excluído junto: volta para a listagem.
        if ($sessionId === null) {
            return redirect()->route($this->listRoute($request))->with('success', 'Atendimento pedagógico removido com sucesso.');
        }

        return redirect()->route('specialized-educational-support.sessions.show', $sessionId)->with('success', 'Atendimento pedagógico removido com sucesso.');
    }

    public function pdf(PedagogicalRecord $pedagogicalRecord, ShowPedagogicalRecordQuery $query, Request $request): Response
    {
        $pedagogicalRecord = $query->execute($pedagogicalRecord, $this->user($request));
        $session = $pedagogicalRecord->attendanceSession;
        $student = $session->students->first();
        $professional = $session->professional;
        $pdf = Pdf::loadView('pages.pedagogical-records.pdf', compact('pedagogicalRecord', 'session', 'student', 'professional'))->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream("registro-pedagogico-{$session->session_date->format('d-m-Y')}.pdf");
    }

    public function studentHistoryPdf(Student $student, StudentPedagogicalRecordsQuery $query, Request $request): Response
    {
        $student->loadMissing(['person', 'currentCourse.course']);
        $pedagogicalRecords = $query->history($student, $this->user($request));
        $pdf = Pdf::loadView(
            'pages.pedagogical-records.student-history-pdf',
            compact('student', 'pedagogicalRecords'),
        )->setPaper('a4', 'portrait');
        PdfPageNumberer::apply($pdf);

        return $pdf->stream("historico-atendimentos-pedagogicos-{$student->registration}.pdf");
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        if (! $user instanceof User) {
            throw new AccessDeniedException('Usuário autenticado inválido.');
        }

        return $user;
    }

    /** Listagem geral, com `pedagogical-record.view-all`, ou a do próprio profissional. */
    private function listRoute(Request $request): string
    {
        return $this->user($request)->can('pedagogical-record.view-all')
            ? 'specialized-educational-support.pedagogical-records.index'
            : 'specialized-educational-support.pedagogical-records.my-records';
    }

    private function professionalId(Request $request): int
    {
        $professionalId = $this->user($request)->professional_id;
        if ($professionalId === null) {
            throw new AccessDeniedException('A ação exige um profissional vinculado ao usuário.');
        }

        return (int) $professionalId;
    }
}
