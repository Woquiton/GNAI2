@props([
    'title',
    'subtitle' => null,
])

<div class="table-header" style="background: #f1f2f6;">
    <div class="table-header-overlay"></div>

    <div class="table-header-content">
        <div class="table-header-text">
            <h2>{{ $title }}</h2>
            @if($subtitle)
                <p>{{ $subtitle }}</p>
            @endif
        </div>

        @if($slot->isNotEmpty())
            <div class="table-header-action">
                {{ $slot }}
            </div>
        @endif
    </div>
</div>
