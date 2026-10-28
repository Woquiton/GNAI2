<section id="paees" class="mb-5 rounded shadow-sm gnai-new-section">
    <span class="tag-new">Novo módulo</span>

    <x-forms.section title="PAEE" class="m-0" />

    <div class="pb-3 ps-3 pe-3">
        <div class="table-responsive">
            <x-table.table :headers="[
                ['label' => 'Versão', 'responsive' => false],
                'Semestre',
                'Status',
                'Próxima revisão',
                ['label' => '', 'responsive' => false],
            ]">
                @forelse($paees as $paee)
                    <tr>
                        <x-table.td :responsive="false">
                            <span class="fw-bold text-purple-dark">v{{ $paee->version }}</span>
                        </x-table.td>
                        <x-table.td>{{ $paee->semester?->label ?? "—" }}</x-table.td>
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
                                    <x-buttons.link-button
                                        :href="route('specialized-educational-support.paee.show', $paee)"
                                        variant="info"
                                        class="btn-sm"
                                    >
                                        <i class="fas fa-eye"></i>
                                    </x-buttons.link-button>
                                @endcan
                            </x-table.actions>
                        </x-table.td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-muted fw-bold py-5">
                            <i class="fas fa-folder-open d-block mb-2" style="font-size: 2.5rem;"></i>
                            Nenhum PAEE encontrado.
                        </td>
                    </tr>
                @endforelse
            </x-table.table>
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mt-4 pt-3 border-top">
            <small class="text-muted">
                São exibidas até 5 versões mais recentes. Para consultar o histórico completo, clique em “Gerenciar PAEE”.
            </small>
            <div class="d-flex flex-wrap gap-2">
                <x-buttons.link-button
                    :href="route('specialized-educational-support.students.paees.index', $student)"
                    variant="warning"
                    class="btn-sm"
                >
                    <i class="fas fa-folder-open"></i> Gerenciar PAEE
                </x-buttons.link-button>
            </div>
        </div>
    </div>
</section>
