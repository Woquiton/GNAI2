<x-table.table :headers="[
    'Estudante',
    'Versão',
    'Status',
    'Próxima Revisão',
    ['label' => 'Ações', 'responsive' => false],
]"
:records="$paees">
    @forelse($paees as $paee)
        <tr>
            <x-table.td><strong>{{ $paee->student->person->name ?? 'N/A' }}</strong></x-table.td>
            <x-table.td>V{{ $paee->version }}</x-table.td>
            <x-table.td>
                <span class="badge bg-{{ $paee->status->color() }}">{{ $paee->status->label() }}</span>
            </x-table.td>
            <x-table.td>{{ optional($paee->next_review_date)->format('d/m/Y') }}</x-table.td>
            <x-table.td :responsive="false">
                <x-table.actions>
                    @can('paee.view')
                    <x-buttons.link-button :href="route('specialized-educational-support.paee.show', $paee->id)" variant="info">
                        <i class="fas fa-eye"></i> ver
                    </x-buttons.link-button>
                    @endcan
                </x-table.actions>
            </x-table.td>
        </tr>
    @empty
        <tr>
            <td colspan="5" class="text-center text-muted py-5">Nenhum PAEE encontrado.</td>
        </tr>
    @endforelse
</x-table.table>
