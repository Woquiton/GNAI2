<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Portal do Professor')  - GNAI</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    @vite(['resources/css/app.css'])
</head>
<body style="background: #f5f6f8;">

<nav class="navbar navbar-expand" style="background: #272264;">
    <div class="container-fluid px-4">
        <span class="navbar-brand text-white fw-bold">
            <i class="fas fa-chalkboard-user me-2"></i> Portal do Professor — GNAI
        </span>
        <div class="d-flex align-items-center gap-3">
            <span class="text-white-50 small d-none d-md-inline">{{ auth()->user()->name }}</span>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button class="btn btn-sm btn-outline-light">
                    <i class="fas fa-right-from-bracket me-1"></i> Sair
                </button>
            </form>
        </div>
    </div>
</nav>

<div class="container-fluid py-4 px-4 px-md-5">

    @if(session('success'))
        <div class="alert alert-success border-0 shadow-sm">{{ session('success') }}</div>
    @endif

    @if(session('error'))
        <div class="alert alert-danger border-0 shadow-sm">{{ session('error') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-danger border-0 shadow-sm">
            <ul class="mb-0 ps-3">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @yield('content')
</div>

</body>
</html>
