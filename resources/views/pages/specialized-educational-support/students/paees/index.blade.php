@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'Histórico de PAEE' => null,
        ]" />
    </div>

    <h2 class="text-title mb-3">Histórico de PAEE — {{ $student->person->name }}</h2>

    <div class="card shadow-sm gnai-new-section">
        <div class="card-body">
            <div class="table-responsive">
                <x-table.table :headers="['Versão', 'Semestre', 'Status', 'Próxima revisão', ['label' => '', 'responsive' => false]]">
                    @forelse($paees as $paee)
                        <tr>
                            <x-table.td>v{{ $paee->version }}</x-table.td>
                            <x-table.td>{{ $paee->semester?->label ?? "—" }}</x-table.td>
                            <x-table.td>{{ $paee->status }}</x-table.td>
                            <x-table.td>{{ $paee->next_review_date?->format('d/m/Y') }}</x-table.td>
                            <x-table.td :responsive="false">
                                <x-table.actions>
                                    <x-buttons.link-button :href="route('specialized-educational-support.paee.show', $paee)" variant="info" class="btn-sm">
                                        <i class="fas fa-eye"></i>
                                    </x-buttons.link-button>
                                </x-table.actions>
                            </x-table.td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="text-center text-muted py-4">Nenhum PAEE encontrado.</td></tr>
                    @endforelse
                </x-table.table>
            </div>
        </div>
    </div>
@endsection
