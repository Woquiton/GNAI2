<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Passwords;

use App\Domains\Application\Data\Auth\Passwords\SendPasswordResetLinkData;
use App\Domains\Domain\DTOs\Auth\Passwords\PasswordBrokerResultDTO;
use App\Domains\Domain\DTOs\Auth\Passwords\SendPasswordResetLinkDTO;
use Illuminate\Support\Facades\Password;

final readonly class SendPasswordResetLinkAction
{
    public function execute(SendPasswordResetLinkData $data): PasswordBrokerResultDTO
    {
        $dataDTO = new SendPasswordResetLinkDTO(
            email: $data->email,
        );

        return new PasswordBrokerResultDTO(
            Password::sendResetLink($dataDTO->toBrokerCredentials()),
        );
    }
}
