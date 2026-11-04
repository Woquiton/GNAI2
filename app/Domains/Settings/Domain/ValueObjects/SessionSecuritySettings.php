<?php

declare(strict_types=1);

namespace App\Domains\Settings\Domain\ValueObjects;

final readonly class SessionSecuritySettings
{
    public function __construct(
        public int $lockAfter,
        public int $logoutAfter,
    ) {}

    public static function defaults(): self
    {
        $lockAfter = max(1, (int) config('session-security.lock_after', 15));

        return new self(
            lockAfter: $lockAfter,
            logoutAfter: max($lockAfter + 1, (int) config('session-security.logout_after', 60)),
        );
    }

    public static function fromPayload(array $payload): self
    {
        $defaults = self::defaults();
        $lockAfter = max(1, (int) ($payload['lock_after'] ?? $defaults->lockAfter));

        return new self(
            lockAfter: $lockAfter,
            logoutAfter: max($lockAfter + 1, (int) ($payload['logout_after'] ?? $defaults->logoutAfter)),
        );
    }

    public function toPayload(): array
    {
        return ['lock_after' => $this->lockAfter, 'logout_after' => $this->logoutAfter];
    }
}
