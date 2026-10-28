@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $paee->student->person->name => route('specialized-educational-support.students.show', $paee->student),
            'Editar PAEE' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between mb-3">
        <div>
            <h2 class="text-title">Editar PAEE (v{{ $paee->version }})</h2>
            <p class="text-muted">Aluno: {{ $paee->student->person->name }}</p>
        </div>
    </div>

    <x-forms.form-card action="{{ route('specialized-educational-support.paee.update', $paee) }}" method="PUT">
        @include('pages.specialized-educational-support.paees.partials.form', [
            'paee' => $paee,
            'submitLabel' => 'Atualizar',
        ])
    </x-forms.form-card>
@endsection
