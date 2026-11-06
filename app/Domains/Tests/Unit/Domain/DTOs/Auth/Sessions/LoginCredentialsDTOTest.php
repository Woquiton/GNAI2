<?php

declare(strict_types=1);

namespace App\Domains\Tests\Unit\Domain\DTOs\Auth\Sessions;

use App\Domains\Domain\DTOs\Auth\Sessions\LoginCredentialsDTO;
use Tests\TestCase;

final class LoginCredentialsDTOTest extends TestCase
{
    public function test_it_exposes_laravel_auth_credentials(): void
    {
        $dto = new LoginCredentialsDTO(
            email: 'user@example.com',
            password: 'secret',
        );

        self::assertSame([
            'email' => 'user@example.com',
            'password' => 'secret',
        ], $dto->toAuthCredentials());
    }
}
