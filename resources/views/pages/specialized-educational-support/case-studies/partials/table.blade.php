<x-table.table :headers="[
    'Versão',
    'Status',
    'Origem da Demanda',
    'Aceite',
    ['label' => 'Ações', 'responsive' => false],
]"
:records="$caseStudies">
    @forelse($caseStudies as $caseStudy)
        <tr>
            <x-table.td><strong>V{{ $caseStudy->version }}</strong></x-table.td>
            <x-table.td>
                <span class="badge bg-{{ $caseStudy->status->color() }}">{{ $caseStudy->status->label() }}</span>
            </x-table.td>
            <x-table.td>{{ $caseStudy->demand_origin->label() }}</x-table.td>
            <x-table.td>
                <span class="badge bg-{{ $caseStudy->acceptance_status->color() }}">{{ $caseStudy->acceptance_status->label() }}</span>
            </x-table.td>
            <x-table.td :responsive="false">
                <x-table.actions>
                    @can('case-study.view')
                    <x-buttons.link-button :href="route('specialized-educational-support.case-study.show', $caseStudy->id)" variant="info">
                        <i class="fas fa-eye"></i> ver
                    </x-buttons.link-button>
                    @endcan
                    @can('case-study.delete')
                    <form action="{{ route('specialized-educational-support.case-study.destroy', $caseStudy) }}" method="POST" class="d-inline">
                        <x-buttons.submit-button
                            type="button"
                            variant="danger"
                            data-bs-toggle="modal"
                            data-bs-target="#globalConfirmActionModal"
                            data-confirm-title="Excluir Estudo de Caso"
                            data-confirm-message="Deseja remover este Estudo de Caso?"
                            data-confirm-action="{{ route('specialized-educational-support.case-study.destroy', $caseStudy) }}"
                            data-confirm-method="DELETE"
                            data-confirm-submit-text="Confirmar Exclusao"
                            data-confirm-variant="danger"
                        >
                            <i class="fas fa-trash"></i> Excluir
                        </x-buttons.submit-button>
                    </form>
                    @endcan
                </x-table.actions>
            </x-table.td>
        </tr>
    @empty
        <tr>
            <td colspan="5" class="text-center text-muted py-5">
                <i class="fas fa-folder-open d-block mb-2" style="font-size: 2rem;"></i>
                Nenhum Estudo de Caso encontrado.
            </td>
        </tr>
    @endforelse
</x-table.table>
