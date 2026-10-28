@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'Estudos de Caso' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h2 class="text-title">Estudos de Caso de {{ $student->person->name }}</h2>
        </div>

        @can('case-study.create')
            <x-buttons.link-button :href="route('specialized-educational-support.case-study.create', $student)" variant="warning">
                <i class="fas fa-plus"></i> Novo Estudo de Caso
            </x-buttons.link-button>
        @endcan
    </div>

    <div class="card shadow-sm gnai-new-section">
        <div class="card-body">
            @include('pages.specialized-educational-support.case-studies.partials.table')
        </div>
    </div>
@endsection
