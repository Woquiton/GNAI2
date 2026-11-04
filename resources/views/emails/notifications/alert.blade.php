<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $heading }} - Gnai</title>
    <style>
        @media only screen and (max-width: 640px) {
            .container { width: 100% !important; }
            .content { padding: 0 !important; }
            .content-wrap { padding: 10px !important; }
        }
    </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f6f6f6; color: #333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f6f6f6" style="width: 100%; background-color: #f6f6f6;">
        <tr>
            <td></td>
            <td class="container" width="600" style="width: 600px; max-width: 600px; vertical-align: top;">
                <div class="content" style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width: 100%; border: 1px solid #e9e9e9; border-radius: 3px; background-color: #fff;">
                        <tr>
                            <td align="center" bgcolor="#2f353f" style="padding: 20px; background-color: #2f353f; border-radius: 3px 3px 0 0; color: #fff; text-align: center;">
                                <h1 style="margin: 0; font-size: 16px; font-weight: 500; line-height: 1.6;">{{ $heading }}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td class="content-wrap" style="padding: 20px; vertical-align: top;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr><td style="padding: 0 0 20px;">{{ $greeting }}</td></tr>
                                    @foreach ($paragraphs as $paragraph)
                                        <tr><td style="padding: 0 0 20px; white-space: pre-line;">{{ $paragraph }}</td></tr>
                                    @endforeach
                                    @if (!empty($details))
                                        <tr>
                                            <td style="padding: 0 0 20px;">
                                                <table width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                                                    <caption style="padding: 0 0 10px; text-align: left; font-weight: 700;">{{ $detailsHeading ?? 'Informações' }}</caption>
                                                    @foreach ($details as $detail)
                                                        <tr>
                                                            <th scope="row" style="padding: 6px 12px 6px 0; text-align: left; vertical-align: top;">{{ $detail['label'] }}</th>
                                                            <td style="padding: 6px 0; white-space: pre-line; overflow-wrap: anywhere;">{{ $detail['value'] }}</td>
                                                        </tr>
                                                    @endforeach
                                                </table>
                                            </td>
                                        </tr>
                                    @endif
                                    @if (!empty($actionUrl) && !empty($actionLabel))
                                        <tr>
                                            <td style="padding: 0 0 20px;">
                                                <a href="{{ $actionUrl }}" style="display: inline-block; border: solid #322b75; border-width: 10px 20px; border-radius: 5px; background-color: #322b75; color: #fff; font-size: 14px; font-weight: 700; line-height: 2; text-align: center; text-decoration: none;">{{ $actionLabel }}</a>
                                            </td>
                                        </tr>
                                    @endif
                                    <tr><td style="padding: 0 0 20px; white-space: pre-line;">{{ $outro }}</td></tr>
                                    @if (!empty($actionUrl) && !empty($actionLabel))
                                        <tr>
                                            <td style="padding: 0 0 20px; font-size: 12px; overflow-wrap: anywhere; word-break: break-all;">
                                                Caso o botão não funcione, copie e cole este endereço no navegador:<br>
                                                <a href="{{ $actionUrl }}" style="color: #322b75;">{{ $actionUrl }}</a>
                                            </td>
                                        </tr>
                                    @endif
                                </table>
                            </td>
                        </tr>
                    </table>
                    <div style="padding: 20px; color: #64748b; font-size: 12px; text-align: center;">Mensagem automática enviada pelo Gnai.</div>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
</body>
</html>
