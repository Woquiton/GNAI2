<?php

namespace App\Http\Controllers\SpecializedEducationalSupport;

use App\Http\Controllers\Controller;
use App\Http\Requests\SpecializedEducationalSupport\PaeeRequest;
use App\Http\Requests\SpecializedEducationalSupport\PaeeReviewRequest;
use App\Models\InclusiveRadar\AssistiveTechnology;
use App\Models\SpecializedEducationalSupport\CaseStudy;
use App\Models\SpecializedEducationalSupport\Paee;
use App\Models\SpecializedEducationalSupport\Student;
use App\Services\SpecializedEducationalSupport\PaeeService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PaeeController extends Controller
{
    protected PaeeService $service;

    public function __construct(PaeeService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        $paees = $this->service->all($request->all());

        $students = Student::with('person')->orderBy('id')->get();

        if ($request->ajax()) {
            return view(
                'pages.specialized-educational-support.paees.partials.table-all',
                compact('paees')
            )->render();
        }

        return view('pages.specialized-educational-support.paees.all', compact('paees', 'students'));
    }

    public function index(Student $student, Request $request)
    {
        $paees = $this->service->index($student, $request->all());

        return view('pages.specialized-educational-support.paees.index', compact('paees', 'student'));
    }

    public function show(Paee $paee)
    {
        $paee->load([
            'student.person',
            'semester',
            'creator',
            'caseStudy.barriers',
            'objectives.linkedBarrier',
            'resources.assistiveTechnology',
            'reviews.reviewer',
        ]);

        return view('pages.specialized-educational-support.paees.show', compact('paee'));
    }

    public function create(Student $student)
    {
        $student->ensureIsActive();

        $caseStudy = $student->currentCaseStudy;

        if (!$caseStudy || $caseStudy->status->value !== 'completed') {
            return redirect()->back()->with('error', 'É necessário um Estudo de Caso concluído para criar o PAEE.');
        }

        $caseStudy->load('barriers');
        $assistiveTechnologies = AssistiveTechnology::orderBy('name')->get(['id', 'name']);

        return view('pages.specialized-educational-support.paees.create', compact('student', 'caseStudy', 'assistiveTechnologies'));
    }

    public function store(Student $student, PaeeRequest $request)
    {
        $student->ensureIsActive();

        $caseStudy = $student->currentCaseStudy;

        if (!$caseStudy) {
            return redirect()->back()->with('error', 'Este aluno não possui um Estudo de Caso vigente.');
        }

        try {
            $paee = $this->service->create($caseStudy, $request->validated());

            return redirect()
                ->route('specialized-educational-support.paee.show', $paee)
                ->with('success', 'PAEE criado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function edit(Paee $paee)
    {
        $paee->load(['objectives', 'resources', 'caseStudy.barriers']);
        $assistiveTechnologies = AssistiveTechnology::orderBy('name')->get(['id', 'name']);

        return view('pages.specialized-educational-support.paees.edit', compact('paee', 'assistiveTechnologies'));
    }

    public function update(Paee $paee, PaeeRequest $request)
    {
        try {
            $this->service->update($paee, $request->validated());

            return redirect()
                ->route('specialized-educational-support.paee.show', $paee)
                ->with('success', 'PAEE atualizado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function destroy(Paee $paee)
    {
        try {
            $student = $paee->student;
            $this->service->delete($paee);

            return redirect()
                ->route('specialized-educational-support.paee.index', $student)
                ->with('success', 'PAEE removido com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function addReview(Paee $paee, PaeeReviewRequest $request)
    {
        try {
            $this->service->addReview($paee, $request->validated());

            return redirect()
                ->route('specialized-educational-support.paee.show', $paee)
                ->with('success', 'Revisão registrada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function pdf(Paee $paee)
    {
        $paee->load([
            'student.person',
            'semester',
            'creator',
            'caseStudy',
            'objectives.linkedBarrier',
            'resources.assistiveTechnology',
            'reviews.reviewer',
        ]);

        $pdf = Pdf::loadView('pages.specialized-educational-support.paees.pdf', [
            'paee' => $paee,
        ])->setPaper('a4', 'portrait');

        $studentName = str_replace(' ', '_', $paee->student->person->name ?? 'aluno');

        return $pdf->stream("PAEE_{$studentName}_v{$paee->version}.pdf");
    }
}
