@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'Novo Estudo de Caso' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between mb-3">
        <div>
            <h2 class="text-title">Novo Estudo de Caso</h2>
            <p class="text-muted">Aluno: {{ $student->person->name }}</p>
        </div>
    </div>

    <x-forms.form-card action="{{ route('specialized-educational-support.case-study.store', $student) }}" method="POST">
        @include('pages.specialized-educational-support.case-studies.partials.form', [
            'caseStudy' => null,
            'student' => $student,
            'submitLabel' => 'Salvar',
        ])
    </x-forms.form-card>
@endsection
