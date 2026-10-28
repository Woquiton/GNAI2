<div class="table-responsive">
    <x-table.table :headers="[
        'Aluno',
        'Semestre',
        ['label' => 'Versão', 'responsive' => false],
        'Status',
        'Criado em',
        ['label' => '', 'responsive' => false],
    ]">
        @forelse($caseStudies as $caseStudy)
            <tr>
                <x-table.td>{{ $caseStudy->student?->person?->name ?? '—' }}</x-table.td>
                <x-table.td>{{ $caseStudy->semester?->label ?? '—' }}</x-table.td>
                <x-table.td :responsive="false">v{{ $caseStudy->version }}</x-table.td>
                <x-table.td>
                    @if($caseStudy->status === 'completed')
                        <span class="badge bg-success">Concluído</span>
                    @elseif($caseStudy->status === 'in_progress')
                        <span class="badge bg-warning text-dark">Em andamento</span>
                    @else
                        <span class="badge bg-secondary">Rascunho</span>
                    @endif
                </x-table.td>
                <x-table.td>{{ $caseStudy->created_at?->format('d/m/Y') ?? '—' }}</x-table.td>
                <x-table.td :responsive="false">
                    <x-table.actions class="d-flex align-items-center justify-content-start gap-2 table-actions">
                        @can('case-study.view')
                            <x-buttons.link-button :href="route('specialized-educational-support.case-study.show', $caseStudy)" variant="info" class="btn-sm">
                                <i class="fas fa-eye"></i>
                            </x-buttons.link-button>
                        @endcan
                        @can('case-study.update')
                            @if($caseStudy->status !== 'completed')
                                <x-buttons.link-button :href="route('specialized-educational-support.case-study.edit', $caseStudy)" variant="warning" class="btn-sm">
                                    <i class="fas fa-edit"></i>
                                </x-buttons.link-button>
                            @endif
                        @endcan
                    </x-table.actions>
                </x-table.td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="text-center text-muted fw-bold py-5">
                    <i class="fas fa-folder-open d-block mb-2" style="font-size: 2.5rem;"></i>
                    Nenhum Estudo de Caso encontrado.
                </td>
            </tr>
        @endforelse
    </x-table.table>
</div>

{{ $caseStudies->links() }}
