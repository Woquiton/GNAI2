<section id="case-studies" class="mb-5 rounded shadow-sm gnai-new-section">
    <span class="tag-new">Novo módulo</span>

    <x-forms.section title="Estudos de Caso" class="m-0" />

    <div class="pb-3 ps-3 pe-3">
        <div class="table-responsive">
            <x-table.table :headers="[
                ['label' => 'Versão', 'responsive' => false],
                'Semestre',
                'Status',
                'Criado em',
                ['label' => '', 'responsive' => false],
            ]">
                @forelse($caseStudies as $caseStudy)
                    <tr>
                        <x-table.td :responsive="false">
                            <span class="fw-bold text-purple-dark">v{{ $caseStudy->version }}</span>
                        </x-table.td>
                        <x-table.td>{{ $caseStudy->semester?->label ?? "—" }}</x-table.td>
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
                            <x-table.actions>
                                @can('case-study.view')
                                    <x-buttons.link-button
                                        :href="route('specialized-educational-support.case-study.show', $caseStudy)"
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
                            Nenhum Estudo de Caso encontrado.
                        </td>
                    </tr>
                @endforelse
            </x-table.table>
        </div>

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mt-4 pt-3 border-top">
            <small class="text-muted">
                São exibidas até 5 versões mais recentes. Para consultar o histórico completo, clique em “Ver Histórico”.
            </small>
            <div class="d-flex flex-wrap gap-2">
                <x-buttons.link-button
                    :href="route('specialized-educational-support.students.case-studies.history', $student)"
                    variant="secondary"
                    class="btn-sm"
                >
                    <i class="fas fa-history"></i> Ver Histórico
                </x-buttons.link-button>

                @can('case-study.create')
                    <x-buttons.link-button
                        :href="route('specialized-educational-support.case-study.create', $student)"
                        variant="warning"
                        class="btn-sm"
                    >
                        <i class="fas fa-plus"></i> Novo Estudo de Caso
                    </x-buttons.link-button>
                @endcan
            </div>
        </div>
    </div>
</section>
