@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'Histórico de Estudos de Caso' => null,
        ]" />
    </div>

    <h2 class="text-title mb-3">Histórico de Estudos de Caso — {{ $student->person->name }}</h2>

    <div class="card shadow-sm gnai-new-section">
        <div class="card-body">
            <div class="table-responsive">
                <x-table.table :headers="['Versão', 'Semestre', 'Status', 'Criado em', ['label' => '', 'responsive' => false]]">
                    @forelse($caseStudies as $caseStudy)
                        <tr>
                            <x-table.td>v{{ $caseStudy->version }}</x-table.td>
                            <x-table.td>{{ $caseStudy->semester?->label ?? "—" }}</x-table.td>
                            <x-table.td>{{ $caseStudy->status }}</x-table.td>
                            <x-table.td>{{ $caseStudy->created_at?->format('d/m/Y') }}</x-table.td>
                            <x-table.td :responsive="false">
                                <x-table.actions>
                                    <x-buttons.link-button :href="route('specialized-educational-support.case-study.show', $caseStudy)" variant="info" class="btn-sm">
                                        <i class="fas fa-eye"></i>
                                    </x-buttons.link-button>
                                </x-table.actions>
                            </x-table.td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="text-center text-muted py-4">Nenhum Estudo de Caso encontrado.</td></tr>
                    @endforelse
                </x-table.table>
            </div>
        </div>
    </div>
@endsection
