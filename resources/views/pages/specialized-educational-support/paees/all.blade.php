@extends('layouts.master')

@section('title', 'Todos os PAEEs')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'PAEE' => null
        ]" />
    </div>

    <div class="custom-table-card shadow-sm border rounded-3 overflow-hidden gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>

        <x-table.page-header
            title="Listagem Geral de PAEEs"
            subtitle="Visualização consolidada de todos os Programas de Atendimento Educacional Especializado do campus."
        />

        <div class="px-3 pt-3">
            <x-table.filters.form
                data-dynamic-filter
                data-target="#paees-table"
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
                        'options' => ['' => 'Status (Todos)'] + \App\Enums\SpecializedEducationalSupport\PaeeStatus::options()
                    ],
                ]"
            />
        </div>

        <div id="paees-table" class="p-3">
            @include('pages.specialized-educational-support.paees.partials.table-all')
        </div>
    </div>

    @push('scripts')
        @vite('resources/js/components/dynamicFilters.js')
    @endpush
@endsection
