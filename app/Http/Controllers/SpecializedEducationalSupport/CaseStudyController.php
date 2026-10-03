<?php

namespace App\Http\Controllers\SpecializedEducationalSupport;

use App\Http\Controllers\Controller;
use App\Http\Requests\SpecializedEducationalSupport\CaseStudyContributionRequest;
use App\Http\Requests\SpecializedEducationalSupport\CaseStudyRequest;
use App\Models\SpecializedEducationalSupport\CaseStudy;
use App\Models\SpecializedEducationalSupport\Semester;
use App\Models\SpecializedEducationalSupport\Student;
use App\Services\SpecializedEducationalSupport\CaseStudyService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class CaseStudyController extends Controller
{
    protected CaseStudyService $service;

    public function __construct(CaseStudyService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        $caseStudies = $this->service->all($request->all());

        $students = Student::with('person')->orderBy('id')->get();

        if ($request->ajax()) {
            return view(
                'pages.specialized-educational-support.case-studies.partials.table-all',
                compact('caseStudies')
            )->render();
        }

        return view(
            'pages.specialized-educational-support.case-studies.all',
            compact('caseStudies', 'students')
        );
    }

    public function index(Student $student, Request $request)
    {
        $caseStudies = $this->service->index($student, $request->all());

        return view(
            'pages.specialized-educational-support.case-studies.index',
            compact('caseStudies', 'student')
        );
    }

    public function show(CaseStudy $caseStudy)
    {
        $caseStudy->load([
            'student.person',
            'semester',
            'creator',
            'barriers',
            'strategies.linkedBarrier',
            'contributions.author',
            'paees',
        ]);

        return view('pages.specialized-educational-support.case-studies.show', compact('caseStudy'));
    }

    public function create(Student $student)
    {
        $student->ensureIsActive();

        $semester = Semester::current();
        if (!$semester) {
            return redirect()->back()->with('error', 'O sistema não possui semestre atual configurado.');
        }

        $current = $this->service->getCurrent($student);

        return view('pages.specialized-educational-support.case-studies.create', compact('student', 'semester', 'current'));
    }

    public function store(Student $student, CaseStudyRequest $request)
    {
        $student->ensureIsActive();

        try {
            $caseStudy = $this->service->create($student, $request->validated());

            return redirect()
                ->route('specialized-educational-support.case-study.show', $caseStudy)
                ->with('success', 'Estudo de Caso criado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function edit(CaseStudy $caseStudy)
    {
        $caseStudy->load(['barriers', 'strategies']);

        return view('pages.specialized-educational-support.case-studies.edit', compact('caseStudy'));
    }

    public function update(CaseStudy $caseStudy, CaseStudyRequest $request)
    {
        try {
            $this->service->update($caseStudy, $request->validated());

            return redirect()
                ->route('specialized-educational-support.case-study.show', $caseStudy)
                ->with('success', 'Estudo de Caso atualizado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function destroy(CaseStudy $caseStudy)
    {
        try {
            $student = $caseStudy->student;
            $this->service->delete($caseStudy);

            return redirect()
                ->route('specialized-educational-support.case-study.index', $student)
                ->with('success', 'Estudo de Caso removido com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function complete(CaseStudy $caseStudy)
    {
        try {
            $this->service->complete($caseStudy);

            return redirect()
                ->route('specialized-educational-support.case-study.show', $caseStudy)
                ->with('success', 'Estudo de Caso concluído com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function addContribution(CaseStudy $caseStudy, CaseStudyContributionRequest $request)
    {
        try {
            $this->service->addContribution($caseStudy, $request->validated());

            return redirect()
                ->route('specialized-educational-support.case-study.show', $caseStudy)
                ->with('success', 'Contribuição registrada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function pdf(CaseStudy $caseStudy)
    {
        $caseStudy->load([
            'student.person',
            'semester',
            'creator',
            'barriers',
            'strategies.linkedBarrier',
            'contributions.author',
        ]);

        $pdf = Pdf::loadView('pages.specialized-educational-support.case-studies.pdf', [
            'caseStudy' => $caseStudy,
        ])->setPaper('a4', 'portrait');

        $studentName = str_replace(' ', '_', $caseStudy->student->person->name ?? 'aluno');

        return $pdf->stream("Estudo_de_Caso_{$studentName}_v{$caseStudy->version}.pdf");
    }
}
