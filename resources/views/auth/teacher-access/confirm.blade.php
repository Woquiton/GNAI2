<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar acesso - GNAI</title>

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
                    <i class="fas fa-shield-halved"></i>
                </div>
                <h1 class="welcome-title">Confirmar acesso</h1>
                <p class="brand-tagline">
                    Por segurança, pedimos essa confirmação extra antes de liberar o acesso —
                    assim evitamos que o link seja consumido automaticamente por algum
                    aplicativo de e-mail.
                </p>
            </div>
        </div>

        <div class="login-form-side">
            <div class="form-content">

                <h2 class="form-title mb-3">Clique para confirmar seu acesso</h2>

                <p class="text-muted mb-4">
                    Este link é de uso único. Ao confirmar, você será autenticado(a) no GNAI.
                </p>

                <form method="POST" action="{{ route('teacher-access.confirm', ['token' => $token]) }}">
                    @csrf
                    <button class="btn btn-login-primary w-100">
                        Confirmar e acessar <i class="fas fa-arrow-right-to-bracket ms-2"></i>
                    </button>
                </form>

            </div>
        </div>
    </div>
</div>

</body>
</html>
