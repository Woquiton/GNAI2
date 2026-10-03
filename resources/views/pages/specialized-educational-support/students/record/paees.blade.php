{{-- PAEE - Plano de Atendimento Educacional Especializado (módulo novo) --}}
<section id="paees" class="mb-5 rounded shadow-sm gnai-new">

    <div class="d-flex align-items-center gap-2">
        <x-forms.section title="PAEE (Plano de Atendimento Educacional Especializado)" class="m-0" />
        <span class="badge gnai-new-badge">Novo módulo</span>
    </div>

    <div class="pb-3 ps-3 pe-3">

        @php
            $hasCompletedCaseStudy = $student->currentCaseStudy && $student->currentCaseStudy->status === \App\Enums\SpecializedEducationalSupport\CaseStudyStatus::COMPLETED;
        @endphp

        @unless($hasCompletedCaseStudy)
            <div class="alert alert-warning d-flex align-items-center gap-2 mb-3">
                <i class="fas fa-exclamation-triangle"></i>
                Nenhum Estudo de Caso concluído ainda. É necessário concluir um Estudo de Caso antes de criar um PAEE.
            </div>
        @endunless

        <div class="table-responsive">
            <x-table.table :headers="[
                ['label' => 'Versão', 'responsive' => false],
                'Frequência semanal',
                'Formato',
                'Status',
                ['label' => '', 'responsive' => false],
            ]">

                @forelse($student->paees as $paee)
                    <tr>
                        <x-table.td :responsive="false">
                            <span class="fw-bold text-purple-dark">
                                v{{ $paee->version }}
                            </span>
                        </x-table.td>

                        <x-table.td>
                            {{ $paee->attendance_frequency_per_week }}x/semana
                        </x-table.td>

                        <x-table.td>
                            {{ $paee->attendance_format?->label() ?? 'Não informado' }}
                        </x-table.td>

                        <x-table.td>
                            <span class="badge bg-{{ $paee->status->color() }}">
                                {{ $paee->status->label() }}
                            </span>
                        </x-table.td>

                        <x-table.td :responsive="false">
                            <x-table.actions>
                                @can('paee.view')
                                <x-buttons.link-button
                                    :href="route('specialized-educational-support.paee.show', $paee->id)"
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

        <div class="d-flex justify-content-end align-items-center gap-2 mt-4 pt-3 border-top">
            @can('paee.create')
            <x-buttons.link-button
                :href="route('specialized-educational-support.paee.create', $student)"
                variant="success"
                class="btn-sm gnai-new {{ $hasCompletedCaseStudy ? '' : 'disabled' }}">
                <i class="fas fa-plus"></i> Novo PAEE
            </x-buttons.link-button>
            @endcan
            @can('paee.view')
            <x-buttons.link-button
                :href="route('specialized-educational-support.paee.index', $student)"
                variant="warning"
                class="btn-sm">
                <i class="fas fa-folder-open"></i> Gerenciar PAEEs
            </x-buttons.link-button>
            @endcan
        </div>

    </div>
</section>
