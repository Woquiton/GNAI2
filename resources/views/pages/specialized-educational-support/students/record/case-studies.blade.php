{{-- Estudos de Caso (módulo novo) --}}
<section id="case-studies" class="mb-5 rounded shadow-sm gnai-new">

    <div class="d-flex align-items-center gap-2">
        <x-forms.section title="Estudos de Caso" class="m-0" />
        <span class="badge gnai-new-badge">Novo módulo</span>
    </div>

    <div class="pb-3 ps-3 pe-3">

        <div class="table-responsive">
            <x-table.table :headers="[
                ['label' => 'Versão', 'responsive' => false],
                'Origem da demanda',
                'Status',
                ['label' => '', 'responsive' => false],
            ]">

                @forelse($student->caseStudies as $caseStudy)
                    <tr>
                        <x-table.td :responsive="false">
                            <span class="fw-bold text-purple-dark">
                                v{{ $caseStudy->version }}
                            </span>
                        </x-table.td>

                        <x-table.td>
                            {{ $caseStudy->demand_origin?->label() ?? 'Não informado' }}
                        </x-table.td>

                        <x-table.td>
                            <span class="badge bg-{{ $caseStudy->status->color() }}">
                                {{ $caseStudy->status->label() }}
                            </span>
                        </x-table.td>

                        <x-table.td :responsive="false">
                            <x-table.actions>
                                @can('case-study.view')
                                <x-buttons.link-button
                                    :href="route('specialized-educational-support.case-study.show', $caseStudy->id)"
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
                        <td colspan="4" class="text-center text-muted fw-bold py-5">
                            <i class="fas fa-folder-open d-block mb-2" style="font-size: 2.5rem;"></i>
                            Nenhum Estudo de Caso encontrado.
                        </td>
                    </tr>
                @endforelse

            </x-table.table>
        </div>

        <div class="d-flex justify-content-end align-items-center gap-2 mt-4 pt-3 border-top">
            @can('case-study.create')
            <x-buttons.link-button
                :href="route('specialized-educational-support.case-study.create', $student)"
                variant="success"
                class="btn-sm gnai-new">
                <i class="fas fa-plus"></i> Novo Estudo de Caso
            </x-buttons.link-button>
            @endcan
            @can('case-study.view')
            <x-buttons.link-button
                :href="route('specialized-educational-support.case-study.index', $student)"
                variant="warning"
                class="btn-sm">
                <i class="fas fa-folder-open"></i> Gerenciar Estudos de Caso
            </x-buttons.link-button>
            @endcan
        </div>

    </div>
</section>
