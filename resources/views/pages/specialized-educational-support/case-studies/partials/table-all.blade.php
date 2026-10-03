<x-table.table :headers="[
    'Estudante',
    'Versão',
    'Status',
    'Aceite',
    ['label' => 'Ações', 'responsive' => false],
]"
:records="$caseStudies">
    @forelse($caseStudies as $caseStudy)
        <tr>
            <x-table.td><strong>{{ $caseStudy->student->person->name ?? 'N/A' }}</strong></x-table.td>
            <x-table.td>V{{ $caseStudy->version }}</x-table.td>
            <x-table.td>
                <span class="badge bg-{{ $caseStudy->status->color() }}">{{ $caseStudy->status->label() }}</span>
            </x-table.td>
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
                </x-table.actions>
            </x-table.td>
        </tr>
    @empty
        <tr>
            <td colspan="5" class="text-center text-muted py-5">Nenhum Estudo de Caso encontrado.</td>
        </tr>
    @endforelse
</x-table.table>
