@extends('layouts.teacher-portal')

@section('title', 'Meus Alunos')

@section('content')

    <h2 class="fw-bold mb-1" style="color:#272264;">Meus Alunos e Adaptações (PEI)</h2>
    <p class="text-muted mb-4">
        Aqui estão os alunos com PEI vinculado a você. Você pode editar a sua adaptação e consultar
        o perfil completo do aluno (em modo leitura).
    </p>

    @if($assignments->isEmpty())
        <div class="alert alert-secondary border-0">
            Nenhum aluno com adaptação vinculada a você no momento.
        </div>
    @else
        <div class="row g-3">
            @foreach($assignments as $item)
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card shadow-sm h-100 border-0">
                        <div class="card-body">
                            <h5 class="card-title fw-bold mb-1">{{ $item->pei->student->person->name }}</h5>
                            <p class="text-muted small mb-2">
                                {{ $item->discipline->name }} — {{ $item->pei->course->name ?? '—' }}
                            </p>
                            <div class="d-flex gap-2 mt-3">
                                <a href="{{ route('teacher-portal.discipline.edit', $item) }}" class="btn btn-sm btn-warning">
                                    <i class="fas fa-edit"></i> Editar Adaptação
                                </a>
                                <a href="{{ route('teacher-portal.students.show', $item->pei->student) }}" class="btn btn-sm btn-outline-secondary">
                                    <i class="fas fa-eye"></i> Ver Aluno
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif

@endsection
