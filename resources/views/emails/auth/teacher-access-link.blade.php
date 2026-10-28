<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GNAI - Seu link de acesso</title>
</head>
<body style="margin: 0; padding: 0; background: #f4f3fb; font-family: Inter, Arial, sans-serif; color: #30303d;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f4f3fb; padding: 32px 16px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 18px 45px rgba(39, 34, 100, 0.16);">
                <tr>
                    <td style="background: #272264; padding: 36px 40px; color: #ffffff;">
                        <div style="display: inline-block; padding: 10px 14px; border-radius: 16px; background: rgba(255, 255, 255, 0.1); color: #ffd700; font-size: 26px; font-weight: 700; letter-spacing: 0.04em;">
                            {{ $appName }}
                        </div>
                        <h1 style="margin: 24px 0 10px; font-family: Poppins, Arial, sans-serif; font-size: 30px; line-height: 1.15; font-weight: 700;">
                            Seu link de acesso
                        </h1>
                        <p style="margin: 0; font-size: 16px; line-height: 1.65; color: rgba(255, 255, 255, 0.88);">
                            Recebemos uma solicitação de acesso ao {{ $appName }} para este e-mail.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 40px;">
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">
                            Clique no botão abaixo para acessar sua conta de professor(a) no {{ $appName }}.
                        </p>

                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                            <tr>
                                <td>
                                    <a href="{{ $confirmUrl }}" style="display: inline-block; background: #272264; color: #ffffff; text-decoration: none; padding: 15px 24px; border-radius: 12px; font-family: Poppins, Arial, sans-serif; font-weight: 700; font-size: 15px;">
                                        Acessar o {{ $appName }}
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <div style="border-left: 4px solid #ffd700; background: #fff9db; border-radius: 12px; padding: 16px 18px; margin: 0 0 18px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #5f5300;">
                                Este link é válido por <strong>24 horas</strong> e serve para <strong>um único acesso</strong>.
                                Não compartilhe este e-mail com mais ninguém.
                            </p>
                        </div>

                        <div style="border-left: 4px solid #d0ccec; background: #f7f6fd; border-radius: 12px; padding: 16px 18px; margin: 0 0 26px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #4a4760;">
                                Se você não solicitou este acesso, apenas ignore este e-mail — nenhuma ação será feita.
                            </p>
                        </div>

                        <p style="margin: 0 0 10px; font-size: 13px; line-height: 1.6; color: #6f6f7c;">
                            Caso o botão não funcione, copie e cole este endereço no navegador:
                        </p>
                        <p style="margin: 0; word-break: break-all; font-size: 13px; line-height: 1.6;">
                            <a href="{{ $confirmUrl }}" style="color: #272264;">{{ $confirmUrl }}</a>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 22px 40px; background: #fbfbff; border-top: 1px solid #eeeeF8;">
                        <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #8a8a99;">
                            GNAI &copy; {{ date('Y') }} | Gestor de Núcleos de Acessibilidade e Inclusão
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
