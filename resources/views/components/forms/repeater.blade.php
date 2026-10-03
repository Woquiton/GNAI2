@props([
    'name' => 'items',
    'title' => null,
    'addLabel' => 'Adicionar item',
])

{{--
    Componente de lista repetível (reutilizável) em JS vanilla.

    Uso:
    <x-forms.repeater name="barriers" title="Barreiras" add-label="Adicionar barreira">
        <x-slot:rows>
            @foreach($items as $index => $item)
                <div class="repeater-row gnai-new" data-repeater-row>
                    ... campos usando {{ $name }}[{{ $index }}][campo] ...
                    <button type="button" class="btn btn-sm btn-outline-danger" data-repeater-remove>Remover</button>
                </div>
            @endforeach
        </x-slot>

        <x-slot:template>
            <div class="repeater-row gnai-new" data-repeater-row>
                ... os mesmos campos, usando {{ $name }}[__INDEX__][campo] ...
                <button type="button" class="btn btn-sm btn-outline-danger" data-repeater-remove>Remover</button>
            </div>
        </x-slot>
    </x-forms.repeater>
--}}

@php
    $wrapperId = 'repeater-' . str_replace(['[', ']', '.'], '-', $name);
    $nextIndex = $attributes->get('next-index', 0);
@endphp

<div
    class="repeater-component gnai-new"
    id="{{ $wrapperId }}"
    data-repeater-name="{{ $name }}"
    data-repeater-next-index="{{ $nextIndex }}"
>
    <span class="badge gnai-new-badge">Novo</span>

    @if($title)
        <h5 class="repeater-title fw-bold text-purple-dark mb-3">{{ $title }}</h5>
    @endif

    <div class="repeater-rows" data-repeater-rows>
        {{ $rows ?? '' }}
    </div>

    <template data-repeater-template-source>{{ $template ?? '' }}</template>

    <button type="button" class="btn btn-outline-secondary btn-sm repeater-add-btn mt-2" data-repeater-add>
        <i class="bi bi-plus-circle"></i> {{ $addLabel }}
    </button>
</div>

@once
    @push('scripts')
    <script>
        document.addEventListener('click', function (event) {
            const removeBtn = event.target.closest('[data-repeater-remove]');
            if (removeBtn) {
                const row = removeBtn.closest('[data-repeater-row]');
                if (row) {
                    row.remove();
                }
            }
        });

        document.querySelectorAll('[data-repeater-add]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const wrapper = btn.closest('.repeater-component');
                const rowsContainer = wrapper.querySelector('[data-repeater-rows]');
                const index = parseInt(wrapper.getAttribute('data-repeater-next-index'), 10) || 0;

                const templateEl = wrapper.querySelector('template[data-repeater-template-source]');
                if (!templateEl) {
                    console.warn('Repeater: template não encontrado para', wrapper.id);
                    return;
                }

                const html = templateEl.innerHTML.replace(/__INDEX__/g, index);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html.trim();

                Array.from(tempDiv.childNodes).forEach(function (node) {
                    rowsContainer.appendChild(node);
                });

                wrapper.setAttribute('data-repeater-next-index', index + 1);
            });
        });
    </script>
    @endpush
@endonce
