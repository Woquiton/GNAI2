<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso do Professor - GNAI</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    @vite(['resources/css/app.css'])
</head>
<body>

<div class="login-wrapper">
    <div class="login-split-card">

        <div class="login-brand-side">
            <div class="brand-content">
                <div class="brand-icon mb-4">
                    <i class="fas fa-chalkboard-user"></i>
                </div>
                <h1 class="welcome-title">Acesso do Professor</h1>
                <p class="brand-tagline">
                    Informe seu e-mail institucional (@ifbaiano.edu.br) e enviaremos um link de acesso
                    para que você edite o PEI dos alunos sob sua responsabilidade.
                </p>
            </div>
        </div>

        <div class="login-form-side">
            <div class="form-content">

                <h2 class="form-title mb-3">Entrar como professor(a)</h2>

                @if(session('status'))
                    <div class="alert alert-success border-0 small">
                        {{ session('status') }}
                    </div>
                @endif

                @if($errors->any())
                    <div class="alert alert-danger border-0 small">
                        <ul class="mb-0 ps-3">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('teacher-access.send-link') }}">
                    @csrf

                    <div class="mb-4">
                        <label class="form-label fw-bold">E-mail institucional</label>
                        <input type="email"
                               name="email"
                               class="form-control custom-input"
                               value="{{ old('email') }}"
                               placeholder="seu.nome@ifbaiano.edu.br"
                               required>
                    </div>

                    <button class="btn btn-login-primary w-100">
                        Enviar link de acesso <i class="fas fa-paper-plane ms-2"></i>
                    </button>
                </form>

                <div class="text-center mt-4">
                    <a href="{{ route('login') }}" class="small text-muted">
                        Sou administrador(a)/profissional — fazer login com senha
                    </a>
                </div>

            </div>
        </div>
    </div>
</div>

</body>
</html>
