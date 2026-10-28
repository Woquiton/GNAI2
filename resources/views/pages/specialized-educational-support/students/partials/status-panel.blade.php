@php
    $caseStudy = $student->currentCaseStudy;
    $paee = $student->currentPaee;
    $pei = $student->peis->firstWhere('is_current', true);

    $caseStudyOk = $caseStudy && $caseStudy->status === \App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy::STATUS_COMPLETED;
    $paeeOk = (bool) $paee;
    $peiOk = (bool) $pei;

    $boxes = [
        [
            'label' => 'Laudo',
            'ok' => $hasLaudo,
            'ok_text' => 'Anexado',
            'ko_text' => 'Não anexado',
            'icon' => 'bi-file-earmark-medical',
            'href' => route('specialized-educational-support.students.show', $student) . '#documents',
        ],
        [
            'label' => 'Estudo de Caso',
            'ok' => $caseStudyOk,
            'ok_text' => 'Concluído',
            'ko_text' => $caseStudy ? 'Em andamento' : 'Não iniciado',
            'icon' => 'bi-clipboard2-pulse',
            'href' => $caseStudy ? route('specialized-educational-support.case-study.show', $caseStudy) : route('specialized-educational-support.case-study.create', $student),
            'updated_at' => $caseStudy?->updated_at,
        ],
        [
            'label' => 'PAEE',
            'ok' => $paeeOk,
            'ok_text' => 'Ativo',
            'ko_text' => 'Não iniciado',
            'icon' => 'bi-diagram-3',
            'href' => $paee ? route('specialized-educational-support.paee.show', $paee) : null,
            'updated_at' => $paee?->updated_at,
        ],
        [
            'label' => 'PEI',
            'ok' => $peiOk,
            'ok_text' => 'Ativo',
            'ko_text' => 'Não iniciado',
            'icon' => 'bi-file-text',
            'href' => $pei ? route('specialized-educational-support.pei.show', $pei) : null,
            'updated_at' => $pei?->updated_at,
        ],
    ];
@endphp

<div class="d-flex align-items-center justify-content-center gap-2 mt-3 mb-2">
    <span class="small text-muted fw-bold text-uppercase">Status do atendimento</span>
    <span class="tag-new">Novo</span>
</div>

<ul class="doc-status mb-4" style="max-width: 720px; margin-inline: auto;">
    @foreach($boxes as $box)
        <li class="doc-item {{ $box['ok'] ? 'is-ok' : 'is-err' }}">
            <h3>
                <i class="bi {{ $box['icon'] }}" aria-hidden="true"></i>
                {{ $box['label'] }}
            </h3>
            <span class="badge-s {{ $box['ok'] ? 's-ok' : 's-err' }}">
                <i class="bi {{ $box['ok'] ? 'bi-check-circle' : 'bi-x-circle' }}" aria-hidden="true"></i>
                {{ $box['ok'] ? $box['ok_text'] : $box['ko_text'] }}
            </span>
            @if($box['href'])
                <a href="{{ $box['href'] }}" class="doc-action">
                    {{ $box['ok'] ? 'Ver' : 'Iniciar' }} <span class="sr-only">{{ $box['label'] }}</span>
                </a>
            @endif
            @isset($box['updated_at'])
                <small class="d-block text-muted mt-1">Atualizado em {{ $box['updated_at']?->format('d/m/Y') ?? '—' }}</small>
            @endisset
        </li>
    @endforeach
</ul>

@php
    $alerts = [];

    if ($paee && $paee->next_review_date && $paee->next_review_date->isPast()) {
        $alerts[] = 'O PAEE está com a revisão vencida desde ' . $paee->next_review_date->format('d/m/Y') . '.';
    }

    if ($paee && ! $caseStudyOk) {
        $alerts[] = 'O PAEE ativo não está vinculado a um Estudo de Caso concluído.';
    }
@endphp

@if(!empty($alerts))
    <div class="col-12 mb-4">
        <div style="max-width: 720px; margin-inline: auto;">
            @foreach($alerts as $alert)
                <div class="alert alert-warning py-2 px-3 small mb-2">
                    <i class="fas fa-triangle-exclamation me-1"></i> {{ $alert }}
                </div>
            @endforeach
        </div>
    </div>
@endif
