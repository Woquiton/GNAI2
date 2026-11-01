<?php

declare(strict_types=1);

namespace App\Domains\Auth\UI\Console\Concerns;

use Illuminate\Contracts\Validation\Validator as ValidatorContract;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

/**
 * Regras de senha e exibição de erros compartilhadas pelos comandos do
 * administrador superior.
 */
trait HandlesAdminCredentials
{
    /**
     * Solicita a senha de forma oculta, sem registrá-la no histórico do terminal.
     */
    private function askForPassword(string $label = 'Senha'): string
    {
        do {
            $password = (string) $this->secret($label);
            $confirmation = (string) $this->secret('Confirmar senha');

            if ($password === $confirmation) {
                return $password;
            }

            $this->components->error('As senhas não conferem.');
        } while (true);
    }

    /**
     * Mostra os requisitos e pede a senha até ela ser válida, sem obrigar a
     * executar o comando de novo quando a senha for recusada.
     */
    private function askForValidPassword(string $label = 'Senha'): string
    {
        $this->components->info('A senha do administrador precisa ter:');
        $this->components->bulletList([
            'pelo menos 12 caracteres;',
            'letras maiúsculas e minúsculas;',
            'pelo menos um número;',
            'pelo menos um símbolo (ex.: ! @ # $ %);',
            'não aparecer em vazamentos de senhas conhecidos.',
        ]);

        do {
            $password = $this->askForPassword($label);

            if ($this->validatePassword($password)) {
                return $password;
            }

            $this->components->warn('Senha recusada. Tente novamente.');
        } while (true);
    }

    private function validatePassword(string $password): bool
    {
        $validator = Validator::make(
            ['password' => $password],
            [
                'password' => [
                    'required',
                    'string',
                    Password::min(12)
                        ->mixedCase()
                        ->numbers()
                        ->symbols()
                        ->uncompromised(),
                ],
            ],
            [
                'password.required' => 'Informe a senha do administrador.',
                'password.min' => 'A senha do administrador deve ter pelo menos :min caracteres.',
                'password.mixed' => 'A senha do administrador deve conter letras maiúsculas e minúsculas.',
                'password.numbers' => 'A senha do administrador deve conter pelo menos um número.',
                'password.symbols' => 'A senha do administrador deve conter pelo menos um símbolo.',
                'password.uncompromised' => 'Esta senha aparece em vazamentos conhecidos. Escolha outra senha.',
            ],
        );

        return $this->displayValidationErrors($validator);
    }

    private function displayValidationErrors(ValidatorContract $validator): bool
    {
        if ($validator->passes()) {
            return true;
        }

        foreach ($validator->errors()->all() as $error) {
            $this->components->error($error);
        }

        return false;
    }
}
