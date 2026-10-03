@extends('layouts.master')

@section('title', 'Estudos de Caso')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'Estudos de Caso' => null
        ]" />
    </div>

    <div class="custom-table-card shadow-sm border rounded-3 overflow-hidden gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>

        <x-table.page-header
            title="Estudos de Caso"
            subtitle="Aluno: {{ $student->person->name }}"
        >
            <div class="d-flex gap-2">
                <x-buttons.link-button :href="route('specialized-educational-support.students.show', $student)" variant="secondary">
                    <i class="fas fa-arrow-left"></i> Voltar
                </x-buttons.link-button>

                @can('case-study.create')
                <x-buttons.link-button :href="route('specialized-educational-support.case-study.create', $student->id)" variant="new" title="Novo Estudo de Caso">
                    <i class="fas fa-plus"></i>
                </x-buttons.link-button>
                @endcan
            </div>
        </x-table.page-header>

        <div class="p-3">
            @include('pages.specialized-educational-support.case-studies.partials.table')
        </div>
    </div>
@endsection
