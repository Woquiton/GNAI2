<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $heading }} - Gnai</title>
    <style>
        @media only screen and (max-width: 640px) {
            .container { width: 100% !important; }
            .content { padding: 10px !important; }
            .content-wrap { padding: 15px !important; }
            .message-summary { width: 100% !important; }
            .heading { font-size: 22px !important; margin-top: 20px !important; }
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
                            <td class="content-wrap" style="padding: 20px; text-align: center;">
                                <h1 class="heading" style="margin: 40px 0 20px; color: #322b75; font-size: 24px; font-weight: 400; line-height: 1.2;">{{ $heading }}</h1>
                                <p style="margin: 0 0 20px;">Olá, {{ $beneficiaryName }}.<br>{{ $intro }}</p>
                                <table class="message-summary" width="80%" cellpadding="0" cellspacing="0" style="width: 80%; margin: 30px auto; border-collapse: collapse; text-align: left;">
                                    <caption style="padding-bottom: 15px; text-align: left;">
                                        {{ $institutionName }}<br>
                                        <strong>{{ $reference }}</strong>
                                    </caption>
                                    <tbody>
                                        @foreach ($rows as $row)
                                            <tr>
                                                <th scope="row" style="padding: 8px 0; border-top: {{ !empty($row['highlight']) ? '2px solid #333' : '1px solid #eee' }}; border-bottom: {{ !empty($row['highlight']) ? '2px solid #333' : '0' }}; text-align: left; vertical-align: top; font-weight: {{ !empty($row['highlight']) ? '700' : '400' }};">{{ $row['label'] }}</th>
                                                <td style="padding: 8px 0 8px 15px; border-top: {{ !empty($row['highlight']) ? '2px solid #333' : '1px solid #eee' }}; border-bottom: {{ !empty($row['highlight']) ? '2px solid #333' : '0' }}; text-align: right; font-weight: {{ !empty($row['highlight']) ? '700' : '400' }};">{{ $row['value'] }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                                <p style="margin: 0 0 20px;">{{ $outro }}</p>
                                <p style="margin: 0 0 20px;">{{ $institutionName }}</p>
                            </td>
                        </tr>
                    </table>
                    <div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">Mensagem automática enviada pelo Gnai.</div>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
</body>
</html>
