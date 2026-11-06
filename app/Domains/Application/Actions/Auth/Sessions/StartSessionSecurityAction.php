<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Sessions;

use App\Domains\Domain\DTOs\Auth\Sessions\SessionSecurityStateDTO;
use App\Domains\Infrastructure\Session\Auth\SessionSecurity;

final readonly class StartSessionSecurityAction
{
    public function __construct(private SessionSecurity $storage) {}

    public function execute(): void
    {
        $this->storage->synchronized(function (): void {
            $this->storage->save(new SessionSecurityStateDTO(time()));
        });
    }
}
