<?php

declare(strict_types=1);

namespace App\Domains\Settings\Domain\ValueObjects;

use App\Domains\Notifications\Domain\Enums\EmailPurpose;

final readonly class AutomaticEmailSettings
{
    /** @param array<string, bool> $events */
    public function __construct(public array $events) {}

    /** @return array<string, bool> */
    public static function defaults(): array
    {
        return [
            EmailPurpose::SESSION_CREATED->value => false,
            EmailPurpose::SESSION_UPDATED->value => false,
            EmailPurpose::SESSION_CANCELLED->value => false,
            EmailPurpose::SESSION_DELETED->value => false,
            EmailPurpose::LOAN_CONFIRMATION->value => true,
            EmailPurpose::LOAN_RETURNED->value => true,
            EmailPurpose::WAITLIST_REGISTERED->value => true,
            EmailPurpose::WAITLIST_AVAILABLE->value => true,
        ];
    }

    public static function fromPayload(array $payload): self
    {
        $events = self::defaults();
        foreach ($events as $purpose => $default) {
            $events[$purpose] = (bool) ($payload['events'][$purpose] ?? $default);
        }

        return new self($events);
    }

    public function allows(string $purpose): bool
    {
        // Autenticação e mensagens manuais não são avisos automáticos de negócio.
        return $this->events[$purpose] ?? true;
    }
}
