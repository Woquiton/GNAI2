@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $caseStudy->student->person->name => route('specialized-educational-support.students.show', $caseStudy->student),
            'Novo PAEE' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between mb-3">
        <div>
            <h2 class="text-title">Novo PAEE</h2>
            <p class="text-muted">Aluno: {{ $caseStudy->student->person->name }} — a partir do Estudo de Caso v{{ $caseStudy->version }}</p>
        </div>
    </div>

    <x-forms.form-card action="{{ route('specialized-educational-support.paee.store') }}" method="POST">
        <input type="hidden" name="case_study_id" value="{{ $caseStudy->id }}">
        @include('pages.specialized-educational-support.paees.partials.form', [
            'paee' => null,
            'caseStudy' => $caseStudy,
            'submitLabel' => 'Salvar',
        ])
    </x-forms.form-card>
@endsection
