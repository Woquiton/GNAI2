<?php

declare(strict_types=1);

namespace App\Domains\Auth\Infrastructure\Session;

use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use Closure;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Cache;

/** Persistência e exclusão mútua do estado da sessão, compartilhado entre abas. */
final readonly class SessionSecurity
{
    public function __construct(private Session $session) {}

    public function initialized(): bool
    {
        return $this->session->has('security_started_at');
    }

    public function load(): ?SessionSecurityStateDTO
    {
        $payload = Cache::get($this->key());

        return is_array($payload) ? new SessionSecurityStateDTO(
            lastActivity: (int) $payload['last_activity'],
            locked: (bool) $payload['locked'],
            returnTo: $payload['return_to'] ?? null,
        ) : null;
    }

    public function save(SessionSecurityStateDTO $state): void
    {
        if (! $this->initialized()) {
            $this->session->put('security_started_at', time());
        }
        Cache::put($this->key(), [
            'last_activity' => $state->lastActivity,
            'locked' => $state->locked,
            'return_to' => $state->returnTo,
        ], now()->addDays(30));
    }

    public function synchronized(Closure $operation): mixed
    {
        return Cache::lock($this->key().':mutex', 5)->block(3, $operation);
    }

    private function key(): string
    {
        return 'session-security:'.hash('sha256', $this->session->getId());
    }
}
