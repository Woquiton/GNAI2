@extends('layouts.teacher-portal')

@section('title', 'Editar Adaptação')

@section('content')

    <a href="{{ route('teacher-portal.index') }}" class="small text-muted d-inline-block mb-3">
        <i class="fas fa-arrow-left"></i> Voltar
    </a>

    <h2 class="fw-bold mb-1" style="color:#272264;">
        {{ $peiDiscipline->discipline->name }}
    </h2>
    <p class="text-muted mb-4">
        Aluno: <strong>{{ $peiDiscipline->pei->student->person->name }}</strong>
    </p>

    <div class="card shadow-sm border-0">
        <div class="card-body p-4">
            <form method="POST" action="{{ route('teacher-portal.discipline.update', $peiDiscipline) }}">
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label class="form-label fw-bold">Objetivos Específicos</label>
                    <textarea name="specific_objectives" rows="3" class="form-control" required>{{ old('specific_objectives', $peiDiscipline->specific_objectives) }}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Prazo das metas/objetivos</label>
                    <input type="text" name="objectives_deadline" class="form-control" value="{{ old('objectives_deadline', $peiDiscipline->objectives_deadline) }}" placeholder='Ex.: "até o fim do bimestre"'>
                    <small class="text-muted">Opcional.</small>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Conteúdo Programático</label>
                    <textarea name="content_programmatic" rows="3" class="form-control" required>{{ old('content_programmatic', $peiDiscipline->content_programmatic) }}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Referência curricular (BNCC ou ementa/unidade)</label>
                    <textarea name="curricular_reference" rows="2" class="form-control">{{ old('curricular_reference', $peiDiscipline->curricular_reference) }}</textarea>
                    <small class="text-muted">Opcional. No superior, use a ementa ou unidade curricular.</small>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Metodologias e Estratégias</label>
                    <textarea name="methodologies" rows="3" class="form-control" required>{{ old('methodologies', $peiDiscipline->methodologies) }}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Recursos didáticos e tecnologia assistiva</label>
                    <textarea name="materials_and_assistive_technology" rows="2" class="form-control">{{ old('materials_and_assistive_technology', $peiDiscipline->materials_and_assistive_technology) }}</textarea>
                    <small class="text-muted">Opcional. Preencha quando indicado para esta disciplina.</small>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Processo de Avaliação</label>
                    <textarea name="evaluations" rows="3" class="form-control" required>{{ old('evaluations', $peiDiscipline->evaluations) }}</textarea>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-bold">Parecer</label>
                    <textarea name="opinion" rows="3" class="form-control">{{ old('opinion', $peiDiscipline->opinion) }}</textarea>
                </div>

                <div class="mb-4">
                    <label class="form-label fw-bold">Registros Complementares</label>
                    <textarea name="complementary_records" rows="3" class="form-control">{{ old('complementary_records', $peiDiscipline->complementary_records) }}</textarea>
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Salvar Adaptação
                </button>
            </form>
        </div>
    </div>

@endsection
