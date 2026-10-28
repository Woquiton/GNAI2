@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'PAEEs' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h2 class="text-title">
                PAEE
                <span class="tag-new">Novo módulo</span>
            </h2>
            <p class="text-muted">Plano de Atendimento Educacional Especializado, vinculado a um Estudo de Caso concluído.</p>
        </div>
    </div>

    <div class="card shadow-sm gnai-new-section">
        <div class="card-body">
            @include('pages.specialized-educational-support.paees.partials.table')
        </div>
    </div>
@endsection
