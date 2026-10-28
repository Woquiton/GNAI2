@extends('layouts.app')

@section('content')

    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            'PEI' => route('specialized-educational-support.pei.show', $pei),
            'Cadastrar Adaptação' => null
        ]" />
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <div>
            <h2 class="text-title">Cadastrar Adaptação Curricular</h2>
            <p class="text-muted">
                Para cada disciplina do curso, escolha o professor responsável. As adaptações são criadas
                de uma vez; o conteúdo pedagógico (objetivos, metodologias etc.) de cada uma é preenchido
                em seguida, individualmente.
            </p>
        </div>
        <div class="ms-md-auto flex-shrink-0">
            <x-buttons.link-button href="{{ route('specialized-educational-support.pei.show', $pei) }}" variant="secondary">
                <i class="fas fa-times"></i> Cancelar
            </x-buttons.link-button>
        </div>
    </div>

    <div class="mt-3">
        <x-forms.form-card action="{{ route('specialized-educational-support.pei-discipline.store', $pei) }}" method="POST">
            @csrf

            <x-forms.section title="Identificação da Disciplina" />

            @if($disciplines->isEmpty())
                <div class="col-12 px-4 pb-4">
                    <div class="alert alert-secondary mb-0">
                        Todas as disciplinas do curso já possuem uma adaptação cadastrada neste PEI.
                    </div>
                </div>
            @else
                <div class="col-12 px-4 pb-2">
                    @foreach($disciplines as $index => $discipline)
                        @php
                            $eligibleTeachers = $teachersByDiscipline[$discipline->id] ?? collect();
                        @endphp
                        <div class="row align-items-center py-3 px-3 mb-2 rounded"
                             style="background-color: {{ $index % 2 === 0 ? '#f6f1ff' : '#ffffff' }}; border: 1px solid #e5e3f5;">
                            <div class="col-md-6">
                                <strong>{{ $discipline->name }}</strong>
                            </div>
                            <div class="col-md-6">
                                @if($eligibleTeachers->isEmpty())
                                    <span class="text-muted small">
                                        <i class="fas fa-triangle-exclamation"></i>
                                        Nenhum professor vinculado a esta disciplina na matriz curricular.
                                    </span>
                                @else
                                    <select name="teacher_ids[{{ $discipline->id }}]" class="form-select">
                                        <option value="">Selecione o professor...</option>
                                        @foreach($eligibleTeachers as $teacher)
                                            <option value="{{ $teacher->id }}">{{ $teacher->person->name }}</option>
                                        @endforeach
                                    </select>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="col-12 d-flex flex-wrap justify-content-end gap-2 border-t pt-4 px-4 pb-4">
                    <x-buttons.link-button href="{{ route('specialized-educational-support.pei.show', $pei) }}" variant="secondary">
                        <i class="fas fa-times"></i>Cancelar
                    </x-buttons.link-button>

                    <x-buttons.submit-button type="submit" class="btn-action new submit">
                        <i class="fas fa-save"></i>Salvar Adaptações
                    </x-buttons.submit-button>
                </div>
            @endif

        </x-forms.form-card>
    </div>
@endsection
