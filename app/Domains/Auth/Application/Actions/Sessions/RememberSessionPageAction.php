<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\Sessions;

use App\Domains\Auth\Application\Services\Sessions\SessionSecurityService;
use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use App\Domains\Auth\Domain\Models\User;

final readonly class RememberSessionPageAction
{
    public function __construct(private SessionSecurityService $security) {}

    public function execute(User $user, ?string $url): SessionSecurityStateDTO
    {
        return $this->security->update($user, static function (SessionSecurityStateDTO $state) use ($url) {
            $safe = $url !== null && str_starts_with($url, '/') && ! str_starts_with($url, '//')
                && ! str_contains($url, '\\') && ! preg_match('/[\x00-\x20]/', $url)
                && ! str_starts_with($url, '/autenticacao/sessao')
                && ! str_starts_with($url, '/autenticacao/sair');

            return new SessionSecurityStateDTO(
                lastActivity: $state->lastActivity,
                locked: $state->locked,
                returnTo: $safe && ! $state->locked ? $url : $state->returnTo,
            );
        });
    }
}
