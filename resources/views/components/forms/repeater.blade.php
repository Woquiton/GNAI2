@props([
    'name',
    'template',
    'items' => [],
    'addLabel' => 'Adicionar item',
])

@php
    $wrapperId = 'repeater-' . str_replace(['[', ']', '.'], '-', $name);
@endphp

<div class="gnai-repeater" id="{{ $wrapperId }}" data-name="{{ $name }}">
    <div class="gnai-repeater-items">
        @foreach($items as $index => $item)
            <div class="gnai-repeater-item border rounded p-3 mb-3 position-relative">
                {!! str_replace('__INDEX__', (string) $index, $template) !!}
                <button type="button" class="btn btn-sm btn-outline-danger gnai-repeater-remove position-absolute" style="top: 0.5rem; right: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        @endforeach
    </div>

    <button type="button" class="btn btn-sm btn-outline-secondary gnai-repeater-add">
        <i class="fas fa-plus"></i> {{ $addLabel }}
    </button>

    <template class="gnai-repeater-template">{!! $template !!}</template>
</div>

@once
    @push('scripts')
        <script>
        (function () {
            function nextIndex(wrapper) {
                return wrapper.querySelectorAll('.gnai-repeater-item').length;
            }

            document.querySelectorAll('.gnai-repeater').forEach(function (wrapper) {
                var itemsBox = wrapper.querySelector('.gnai-repeater-items');
                var addBtn = wrapper.querySelector('.gnai-repeater-add');
                var tpl = wrapper.querySelector('.gnai-repeater-template').innerHTML;

                addBtn.addEventListener('click', function () {
                    var index = nextIndex(wrapper);
                    var html = tpl.split('__INDEX__').join(index);
                    var div = document.createElement('div');
                    div.className = 'gnai-repeater-item border rounded p-3 mb-3 position-relative';
                    div.innerHTML = html + '<button type="button" class="btn btn-sm btn-outline-danger gnai-repeater-remove position-absolute" style="top:0.5rem;right:0.5rem;"><i class="fas fa-trash"></i></button>';
                    itemsBox.appendChild(div);
                });

                wrapper.addEventListener('click', function (event) {
                    var removeBtn = event.target.closest('.gnai-repeater-remove');
                    if (removeBtn) {
                        removeBtn.closest('.gnai-repeater-item').remove();
                    }
                });
            });
        })();
        </script>
    @endpush
@endonce
