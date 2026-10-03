@extends('layouts.master')

@section('title', 'Todos os Estudos de Caso')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Estudos de Caso' => null
        ]" />
    </div>

    <div class="custom-table-card shadow-sm border rounded-3 overflow-hidden gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>

        <x-table.page-header
            title="Listagem Geral de Estudos de Caso"
            subtitle="Visualização consolidada de todos os Estudos de Caso do campus."
        />

        <div class="px-3 pt-3">
            <x-table.filters.form
                data-dynamic-filter
                data-target="#case-studies-table"
                :fields="[
                    [
                        'name' => 'student_id',
                        'type' => 'select',
                        'options' => ['' => 'Estudante (Todos)'] +
                            collect($students)->mapWithKeys(fn($s) => [
                                $s->id => $s->person->name
                            ])->toArray()
                    ],
                    [
                        'name' => 'status',
                        'type' => 'select',
                        'options' => ['' => 'Status (Todos)'] + \App\Enums\SpecializedEducationalSupport\CaseStudyStatus::options()
                    ],
                ]"
            />
        </div>

        <div id="case-studies-table" class="p-3">
            @include('pages.specialized-educational-support.case-studies.partials.table-all')
        </div>
    </div>

    @push('scripts')
        @vite('resources/js/components/dynamicFilters.js')
    @endpush
@endsection
