<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\Sessions;

use App\Domains\Auth\Domain\DTOs\Sessions\SessionSecurityStateDTO;
use App\Domains\Auth\Infrastructure\Session\SessionSecurity;

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
