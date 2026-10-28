@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $caseStudy->student->person->name => route('specialized-educational-support.students.show', $caseStudy->student),
            'Editar Estudo de Caso' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between mb-3">
        <div>
            <h2 class="text-title">Editar Estudo de Caso (v{{ $caseStudy->version }})</h2>
            <p class="text-muted">Aluno: {{ $caseStudy->student->person->name }}</p>
        </div>
    </div>

    <x-forms.form-card action="{{ route('specialized-educational-support.case-study.update', $caseStudy) }}" method="PUT">
        @include('pages.specialized-educational-support.case-studies.partials.form', [
            'caseStudy' => $caseStudy,
            'student' => $caseStudy->student,
            'submitLabel' => 'Atualizar',
        ])
    </x-forms.form-card>
@endsection
