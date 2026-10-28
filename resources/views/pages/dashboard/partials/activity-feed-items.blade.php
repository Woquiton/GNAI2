@foreach($logs as $log)
    @php
        $link = \App\Shared\Domain\Support\ActivityFeedPresenter::link($log);
        $ability = \App\Shared\Domain\Support\ActivityFeedPresenter::ability($log);
        $canOpen = $link !== null && $ability !== null && auth()->user()?->can($ability);
    @endphp
    <div class="activity-feed-item d-flex align-items-start gap-3 py-2 border-bottom">
        <div class="activity-feed-icon text-primary-custom">
            <i class="bi bi-clock-history"></i>
        </div>
        <div class="flex-grow-1">
            @if($canOpen)
                <a href="{{ route($link['name'], $link['params']) }}" class="text-decoration-none text-body">
                    {{ \App\Shared\Domain\Support\ActivityFeedPresenter::sentence($log) }}
                </a>
            @else
                {{ \App\Shared\Domain\Support\ActivityFeedPresenter::sentence($log) }}
            @endif
            <div class="small text-muted">{{ $log->created_at?->format('d/m/Y H:i') }}</div>
        </div>
    </div>
@endforeach

@if($logs->hasMorePages())
    <div class="text-center mt-3">
        <button type="button" class="btn btn-sm btn-outline-secondary" id="activity-feed-load-more" data-next-page="{{ $logs->currentPage() + 1 }}">
            Carregar mais
        </button>
    </div>
@endif

@if($logs->isEmpty() && $logs->currentPage() === 1)
    <p class="text-muted text-center mb-0 py-3">Nenhuma atividade registrada ainda.</p>
@endif
