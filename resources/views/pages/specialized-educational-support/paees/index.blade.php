@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'PAEE' => null,
        ]" />
    </div>

    <h2 class="text-title mb-3">PAEE de {{ $student->person->name }}</h2>

    <div class="card shadow-sm gnai-new-section">
        <div class="card-body">
            @include('pages.specialized-educational-support.paees.partials.table')
        </div>
    </div>
@endsection
