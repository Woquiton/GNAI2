<?php

declare(strict_types=1);

use Dotenv\Dotenv;

require '/var/www/vendor/autoload.php';

function ask(string $label, string $current, bool $secret = false): string
{
    echo $label.' ['.($secret ? ($current === '' ? 'não definida' : 'manter senha atual') : $current).']: ';

    if ($secret) {
        exec('stty -echo', $output, $status);
        if ($status !== 0) {
            throw new RuntimeException('Não foi possível ocultar a senha no terminal.');
        }
    }

    try {
        $line = fgets(STDIN);
    } finally {
        if ($secret) {
            exec('stty echo');
            echo PHP_EOL;
        }
    }

    if ($line === false) {
        throw new RuntimeException('Entrada encerrada; nenhuma configuração salva.');
    }

    $value = rtrim($line, "\r\n");

    if (preg_match('/[\x00-\x1f\x7f]/', $value)) {
        throw new RuntimeException('O valor não pode conter caracteres de controle.');
    }

    return $value === '' ? $current : $value;
}

$scope = $argv[1] ?? '';
$environment = $argv[2] ?? 'prod';
$fields = match ($scope) {
    'app' => ['APP_NAME' => 'Nome da aplicação', 'APP_URL' => 'URL pública'],
    'database' => [
        'DB_HOST' => 'Host do banco',
        'DB_PORT' => 'Porta do banco',
        'DB_DATABASE' => 'Nome do banco existente',
        'DB_USERNAME' => 'Usuário do banco',
        'DB_PASSWORD' => 'Senha do usuário do banco',
    ],
    default => [],
};

$handle = null;

try {
    if ($fields === []) {
        throw new RuntimeException('Informe app ou database.');
    }

    $handle = fopen('/deploy/environment', 'r+');
    if ($handle === false || ! flock($handle, LOCK_EX)) {
        throw new RuntimeException('Não foi possível bloquear o arquivo de ambiente para edição.');
    }

    $contents = stream_get_contents($handle);
    $values = Dotenv::parse($contents);
    // O arquivo é consumido pelo Compose: $$ em aspas duplas representa um dólar literal.
    foreach ($values as $key => $value) {
        if (preg_match('/^'.preg_quote($key, '/').'\h*=\h*"/m', $contents)) {
            $values[$key] = str_replace('$$', '$', $value);
        }
    }
    $updated = [];
    echo "Configuração de {$environment}. Enter mantém o valor atual.\n";

    foreach ($fields as $key => $label) {
        $value = ask($label, $values[$key] ?? '', $key === 'DB_PASSWORD');
        if (trim($value) === '') {
            throw new RuntimeException("{$label} não pode ficar vazio.");
        }
        $updated[$key] = $value;
    }

    if ($scope === 'app' && ! filter_var($updated['APP_URL'], FILTER_VALIDATE_URL)) {
        throw new RuntimeException('Informe uma URL pública válida.');
    }

    if ($scope === 'database') {
        if (! ctype_digit($updated['DB_PORT']) || (int) $updated['DB_PORT'] < 1 || (int) $updated['DB_PORT'] > 65535) {
            throw new RuntimeException('Porta do banco inválida.');
        }
        foreach (['DB_HOST', 'DB_DATABASE'] as $key) {
            if (str_contains($updated[$key], ';')) {
                throw new RuntimeException("Valor inválido para {$key}.");
            }
        }

        echo "Validando acesso ao banco existente...\n";
        try {
            new PDO(
                'mysql:host='.$updated['DB_HOST'].';port='.$updated['DB_PORT'].';dbname='.$updated['DB_DATABASE'].';charset=utf8mb4',
                $updated['DB_USERNAME'],
                $updated['DB_PASSWORD'],
                [PDO::ATTR_TIMEOUT => 5, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
            );
        } catch (PDOException) {
            throw new RuntimeException('Não foi possível conectar ao banco. Verifique host, nome e credenciais. Nada foi salvo.');
        }
        echo "Conexão validada. Os dados não serão transferidos; o deploy aplicará migrations pendentes no banco escolhido.\n";
    }

    echo "\nConfiguração a salvar:\n";
    foreach ($fields as $key => $label) {
        echo $label.': '.($key === 'DB_PASSWORD' ? '[oculta]' : $updated[$key]).PHP_EOL;
    }
    echo "A atualização interromperá temporariamente aplicação, fila e scheduler.\n";
    $confirmation = ask('Salvar e executar o deploy? Digite sim', 'não');
    if (mb_strtolower(trim($confirmation)) !== 'sim') {
        echo "Cancelado. Nada foi salvo e o deploy não será executado.\n";
        exit(2);
    }

    foreach ($updated as $key => $value) {
        // Aspas e escapes evitam comentários e interpolação de segredos pelo dotenv/Compose.
        $encoded = '"'.str_replace(['\\', '"', '$'], ['\\\\', '\\"', '\\$'], $value).'"';
        // Compose usa $$ para representar um dólar literal.
        $encoded = str_replace('\\$', '$$', $encoded);
        $count = 0;
        $contents = preg_replace_callback('/^'.preg_quote($key, '/').'\h*=.*$/m', fn () => $key.'='.$encoded, $contents, -1, $count);
        if ($count > 1) {
            throw new RuntimeException("Há mais de uma definição de {$key}. Nada foi salvo.");
        }
        if ($count === 0) {
            $contents = rtrim($contents)."\n{$key}={$encoded}\n";
        }
    }

    rewind($handle);
    if (fwrite($handle, $contents) !== strlen($contents) || ! ftruncate($handle, strlen($contents)) || ! fflush($handle)) {
        throw new RuntimeException('Não foi possível salvar o arquivo de ambiente. Confira o arquivo antes de publicar.');
    }
    echo "Configuração salva. Iniciando deploy...\n";
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage().PHP_EOL);
    exit(1);
} finally {
    if (is_resource($handle)) {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
