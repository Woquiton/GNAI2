<?php

declare(strict_types=1);

use Dotenv\Dotenv;

require '/var/www/vendor/autoload.php';

$environment = $argv[1] ?? 'prod';
$path = '/deploy/environment';
$handle = fopen($path, 'r+');

if ($handle === false || ! flock($handle, LOCK_EX)) {
    fwrite(STDERR, "Não foi possível bloquear o arquivo de ambiente para preparação.\n");
    exit(1);
}

try {
    $contents = stream_get_contents($handle);
    $values = Dotenv::parse($contents);

    foreach (['DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'MYSQL_ROOT_PASSWORD'] as $name) {
        if (trim($values[$name] ?? '') === '' || ($environment === 'prod' && ($values[$name] ?? '') === 'change_me')) {
            throw new RuntimeException("Configure {$name} no arquivo de ambiente antes do deploy.");
        }
    }

    if ($environment === 'prod' && (($values['APP_ENV'] ?? '') !== 'production' || ($values['APP_DEBUG'] ?? '') !== 'false')) {
        throw new RuntimeException('O deploy exige APP_ENV=production e APP_DEBUG=false.');
    }

    if (trim($values['APP_KEY'] ?? '') === '') {
        $key = 'base64:'.base64_encode(random_bytes(32));
        $count = 0;
        $updated = preg_replace('/^APP_KEY\h*=.*$/m', 'APP_KEY='.$key, $contents, -1, $count);

        if ($count > 1) {
            throw new RuntimeException('Há mais de uma APP_KEY no arquivo de ambiente. Mantenha apenas uma.');
        }

        if ($count === 0) {
            $updated = rtrim($contents)."\nAPP_KEY={$key}\n";
        }

        rewind($handle);
        if (fwrite($handle, $updated) !== strlen($updated) || ! ftruncate($handle, strlen($updated)) || ! fflush($handle)) {
            throw new RuntimeException('Falha ao salvar APP_KEY no arquivo de ambiente.');
        }
        echo "APP_KEY gerada e salva no arquivo de ambiente. Guarde uma cópia segura desse arquivo.\n";
    } else {
        echo "APP_KEY existente preservada.\n";
    }
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage()."\n");
    exit(1);
} finally {
    flock($handle, LOCK_UN);
    fclose($handle);
}
