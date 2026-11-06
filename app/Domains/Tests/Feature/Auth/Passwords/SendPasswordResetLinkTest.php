<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Auth\Passwords;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Notifications\EmailDelivery;
use App\Domains\Infrastructure\Jobs\Notifications\SendEmailDelivery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

final class SendPasswordResetLinkTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_queues_a_valid_password_reset_link_to_registered_user(): void
    {
        Bus::fake();

        $user = User::factory()->create();

        $response = $this->post(route('password.email'), [
            'email' => $user->email,
        ]);

        $response
            ->assertRedirect()
            ->assertSessionHas('status', 'Se o e-mail estiver cadastrado, enviaremos instruções.');

        $delivery = EmailDelivery::query()
            ->where('context_type', 'user')
            ->where('context_id', $user->getKey())
            ->where('purpose', 'password_reset')
            ->sole();
        self::assertSame($user->email, $delivery->recipient_email);
        Bus::assertDispatched(
            SendEmailDelivery::class,
            fn (SendEmailDelivery $job): bool => $job->deliveryId === $delivery->id,
        );

        $resetUrl = $delivery->payload['actionUrl'];
        parse_str(parse_url($resetUrl, PHP_URL_QUERY), $query);
        self::assertSame($user->email, $query['email']);
        $token = basename(parse_url($resetUrl, PHP_URL_PATH));
        $storedToken = DB::table('password_reset_tokens')->where('email', $user->email)->value('token');
        self::assertTrue(Hash::check($token, $storedToken));
        self::assertSame(route('password.reset', ['token' => $token, 'email' => $user->email]), $resetUrl);
    }
}
