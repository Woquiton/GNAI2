@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Estudos de Caso' => null,
        ]" />
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h2 class="text-title">
                Estudos de Caso
                <span class="tag-new">Novo módulo</span>
            </h2>
            <p class="text-muted">Primeira etapa da cadeia Estudo de Caso &rarr; PAEE &rarr; PEI (Decreto 12.686/2025).</p>
        </div>
    </div>

    <div class="card shadow-sm gnai-new-section">
        <div class="card-body">
            @include('pages.specialized-educational-support.case-studies.partials.table')
        </div>
    </div>
@endsection
