<x-table.table :headers="[
    'Versão',
    'Status',
    'Frequência',
    'Local',
    'Próxima Revisão',
    ['label' => 'Ações', 'responsive' => false],
]"
:records="$paees">
    @forelse($paees as $paee)
        <tr>
            <x-table.td><strong>V{{ $paee->version }}</strong></x-table.td>
            <x-table.td>
                <span class="badge bg-{{ $paee->status->color() }}">{{ $paee->status->label() }}</span>
            </x-table.td>
            <x-table.td>{{ $paee->attendance_frequency_per_week }}x/semana</x-table.td>
            <x-table.td>{{ $paee->attendance_location->label() }}</x-table.td>
            <x-table.td>{{ optional($paee->next_review_date)->format('d/m/Y') }}</x-table.td>
            <x-table.td :responsive="false">
                <x-table.actions>
                    @can('paee.view')
                    <x-buttons.link-button :href="route('specialized-educational-support.paee.show', $paee->id)" variant="info">
                        <i class="fas fa-eye"></i> ver
                    </x-buttons.link-button>
                    @endcan
                    @can('paee.delete')
                    <form action="{{ route('specialized-educational-support.paee.destroy', $paee) }}" method="POST" class="d-inline">
                        <x-buttons.submit-button
                            type="button"
                            variant="danger"
                            data-bs-toggle="modal"
                            data-bs-target="#globalConfirmActionModal"
                            data-confirm-title="Excluir PAEE"
                            data-confirm-message="Deseja remover este PAEE?"
                            data-confirm-action="{{ route('specialized-educational-support.paee.destroy', $paee) }}"
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
            <td colspan="6" class="text-center text-muted py-5">
                <i class="fas fa-folder-open d-block mb-2" style="font-size: 2rem;"></i>
                Nenhum PAEE encontrado.
            </td>
        </tr>
    @endforelse
</x-table.table>
