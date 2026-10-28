<div class="table-responsive">
    <x-table.table :headers="[
        'Aluno',
        'Semestre',
        ['label' => 'Versão', 'responsive' => false],
        'Status',
        'Próxima revisão',
        ['label' => '', 'responsive' => false],
    ]">
        @forelse($paees as $paee)
            <tr>
                <x-table.td>{{ $paee->student?->person?->name ?? '—' }}</x-table.td>
                <x-table.td>{{ $paee->semester?->label ?? "—" }}</x-table.td>
                <x-table.td :responsive="false">v{{ $paee->version }}</x-table.td>
                <x-table.td>
                    @if($paee->status === 'active')
                        <span class="badge bg-success">Ativo</span>
                    @elseif($paee->status === 'under_review')
                        <span class="badge bg-warning text-dark">Em revisão</span>
                    @else
                        <span class="badge bg-secondary">Rascunho</span>
                    @endif
                </x-table.td>
                <x-table.td>{{ $paee->next_review_date?->format('d/m/Y') ?? '—' }}</x-table.td>
                <x-table.td :responsive="false">
                    <x-table.actions>
                        @can('paee.view')
                            <x-buttons.link-button :href="route('specialized-educational-support.paee.show', $paee)" variant="info" class="btn-sm">
                                <i class="fas fa-eye"></i>
                            </x-buttons.link-button>
                        @endcan
                        @can('paee.update')
                            <x-buttons.link-button :href="route('specialized-educational-support.paee.edit', $paee)" variant="warning" class="btn-sm">
                                <i class="fas fa-edit"></i>
                            </x-buttons.link-button>
                        @endcan
                    </x-table.actions>
                </x-table.td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="text-center text-muted fw-bold py-5">
                    <i class="fas fa-folder-open d-block mb-2" style="font-size: 2.5rem;"></i>
                    Nenhum PAEE encontrado.
                </td>
            </tr>
        @endforelse
    </x-table.table>
</div>

{{ $paees->links() }}
