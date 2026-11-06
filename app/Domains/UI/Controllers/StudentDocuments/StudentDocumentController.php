<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\StudentDocuments;

use App\Domains\Application\Actions\StudentDocuments\CreateStudentDocumentAction;
use App\Domains\Application\Actions\StudentDocuments\DeleteStudentDocumentAction;
use App\Domains\Application\Actions\StudentDocuments\UpdateStudentDocumentAction;
use App\Domains\Application\Data\StudentDocuments\CreateStudentDocumentData;
use App\Domains\Application\Data\StudentDocuments\UpdateStudentDocumentData;
use App\Domains\Application\Queries\StudentDocuments\StudentDocumentFormQuery;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Infrastructure\Storage\StudentDocuments\StudentDocumentStorage;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class StudentDocumentController
{
    public function show(StudentDocument $studentDocument, StudentDocumentStorage $storage): StreamedResponse
    {
        return $storage->inline($studentDocument);
    }

    public function create(Student $student, StudentDocumentFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'StudentDocuments/Create',
            $form->forCreation($student),
        );
    }

    /**
     * @throws Throwable
     */
    public function store(CreateStudentDocumentData $data, Student $student, CreateStudentDocumentAction $action, Request $request): RedirectResponse
    {
        $action->execute(
            student: $student,
            data: $data,
            uploaderId: (int) $request->user()?->getAuthIdentifier(),
        );

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $student,
                'tab' => 'documents',
            ])
            ->with('success', 'Documento enviado com sucesso.');
    }

    public function edit(StudentDocument $studentDocument, StudentDocumentFormQuery $form): InertiaResponse
    {
        return Inertia::render(
            'StudentDocuments/Edit',
            $form->forUpdate($studentDocument),
        );
    }

    /**
     * @throws Throwable
     */
    public function update(UpdateStudentDocumentData $data, StudentDocument $studentDocument, UpdateStudentDocumentAction $action): RedirectResponse
    {
        $studentDocument = $action->execute($studentDocument, $data);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $studentDocument->student_id,
                'tab' => 'documents',
            ])
            ->with('success', 'Documento atualizado com sucesso.');
    }

    /**
     * @throws Throwable
     */
    public function destroy(StudentDocument $studentDocument, DeleteStudentDocumentAction $action): RedirectResponse
    {
        $studentId = $studentDocument->student_id;
        $action->execute($studentDocument);

        return redirect()
            ->route('specialized-educational-support.students.show', [
                'student' => $studentId,
                'tab' => 'documents',
            ])
            ->with('success', 'Documento removido com sucesso.');
    }

    public function download(StudentDocument $studentDocument, StudentDocumentStorage $storage): StreamedResponse
    {
        return $storage->download($studentDocument);
    }
}
