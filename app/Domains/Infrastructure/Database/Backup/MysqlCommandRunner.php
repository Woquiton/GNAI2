<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Database\Backup;

use Illuminate\Support\Facades\DB;
use RuntimeException;
use Symfony\Component\Process\Process;

/** Usa a conexão Laravel e um arquivo temporário privado, sem senha nos argumentos. */
final class MysqlCommandRunner
{
    /**
     * @param  list<string>  $arguments
     * @param  resource|null  $input
     * @param  resource|null  $output
     */
    public function execute(
        string $binary,
        array $arguments,
        mixed $input = null,
        mixed $output = null,
        bool $terminal = false,
    ): void {
        $config = DB::connection()->getConfig();
        if (! is_array($config) || ($config['driver'] ?? '') !== 'mysql') {
            throw new RuntimeException('Este comando exige uma conexão MySQL.');
        }

        $path = tempnam(sys_get_temp_dir(), 'gnai-mysql-');
        if ($path === false) {
            throw new RuntimeException('Não foi possível preparar as credenciais do MySQL.');
        }

        try {
            chmod($path, 0600);
            $options = "[client]\n";
            foreach (['host' => 'host', 'port' => 'port', 'user' => 'username', 'password' => 'password', 'socket' => 'unix_socket'] as $option => $key) {
                $value = (string) ($config[$key] ?? '');
                if ($value !== '') {
                    $escaped = str_replace(["\\", '"', "\n", "\r"], ["\\\\", '\\"', '\\n', '\\r'], $value);
                    $options .= $option.'="'.$escaped."\"\n";
                }
            }
            if (file_put_contents($path, $options) !== strlen($options)) {
                throw new RuntimeException('Não foi possível preparar as credenciais do MySQL.');
            }

            $process = new Process([$binary, '--defaults-extra-file='.$path, ...$arguments, '--', (string) $config['database']], base_path());
            $process->setTimeout(null);
            if ($input !== null) {
                $process->setInput($input);
            }
            if ($terminal) {
                $process->setTty(true);
            }
            $process->run(function (string $type, string $data) use ($output, $process): void {
                if ($type === Process::OUT && is_resource($output)) {
                    if (fwrite($output, $data) !== strlen($data)) {
                        throw new RuntimeException('Falha ao gravar o dump.');
                    }
                } elseif ($type === Process::ERR) {
                    fwrite(STDERR, $data);
                }
                $process->clearOutput();
                $process->clearErrorOutput();
            });
            if (! $process->isSuccessful()) {
                throw new RuntimeException('A operação MySQL falhou; confira a mensagem acima.');
            }
        } finally {
            unlink($path);
        }
    }
}
