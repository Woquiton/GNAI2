<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Domains\Domain\Models\Auth\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class InertiaPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_boots_react_on_initial_visits_without_the_legacy_layout(): void
    {
        $this->withoutVite();

        $response = $this->get(route('login'));

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/Login')->where('auth.user', null))
            ->assertSee('data-page="root"', false)
            ->assertSee('<div id="root"></div>', false)
            ->assertDontSee('bootstrap.min.css', false)
            ->assertDontSee('resources/js/app.js', false);
    }

    public function test_it_shares_the_authenticated_user_without_secrets(): void
    {
        $this->withoutVite();
        $user = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($user)->get(route('specialized-educational-support.students.index'));

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Students/Index')
            ->where('auth.user.id', $user->id)
            ->missing('auth.user.password')
            ->missing('auth.user.remember_token')
        );
    }

    public function test_it_shares_validation_errors_and_flash_messages_with_react(): void
    {
        $this->withoutVite();

        $this->from(route('login'))->post(route('login'), [])->assertRedirect(route('login'));

        $this->get(route('login'))->assertInertia(fn (Assert $page) => $page
            ->has('errors.email')
            ->has('errors.password')
        );

        $this->withSession(['success' => '</script><script>alert(1)</script>', 'warning' => 'Atenção'])
            ->get(route('login'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('flash.success', '</script><script>alert(1)</script>')
                ->where('flash.warning', 'Atenção')
                ->has('flash.response_id')
            )
            ->assertDontSee('</script><script>alert(1)</script>', false);
    }

    public function test_it_returns_only_the_requested_props_on_partial_reloads(): void
    {
        $this->withoutVite();
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        $url = route('inclusive-radar.barriers.index');
        $initial = $this->get($url)->assertOk();

        $response = $this->get($url.'?search=teste', [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $initial->viewData('page')['version'],
            'X-Inertia-Partial-Component' => 'Barriers/Index',
            'X-Inertia-Partial-Data' => 'barriers',
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'text/html, application/xhtml+xml',
        ]);

        $response->assertOk()
            ->assertHeader('X-Inertia', 'true')
            ->assertJsonPath('component', 'Barriers/Index')
            ->assertJsonStructure(['props' => ['barriers' => ['data', 'links']]])
            ->assertJsonMissingPath('props.auth');
    }

    public function test_it_renders_missing_pages_in_react_and_keeps_api_errors_as_json(): void
    {
        $this->withoutVite();

        $this->get('/nonexistent-screen')->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page->component('Errors/Error')->where('status', 404));

        $this->getJson('/nonexistent-screen')->assertNotFound()
            ->assertJsonStructure(['message']);
    }
}
