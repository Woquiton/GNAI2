<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Website;

use App\Domains\Domain\Models\Website\WebsiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PublicPolicyController
{
    public function __invoke(Request $request): Response
    {
        $policy = (string) $request->route('policy', 'privacy');
        $titles = [
            'privacy' => 'Política de privacidade',
            'usage' => 'Uso responsável',
            'cookies' => 'Política de cookies',
            'copyright' => 'Direitos autorais',
            'accessibility' => 'Acessibilidade',
        ];
        abort_unless(isset($titles[$policy]), 404);

        $privacy = WebsiteSetting::current()->privacy ?? [];

        return Inertia::render('Policies/Index', [
            'policyKey' => $policy,
            'controllerName' => $privacy['controller_name'] ?? null,
            'officerName' => $privacy['officer_name'] ?? null,
            'contactEmail' => $privacy['contact_email'] ?? null,
            'contactUrl' => $privacy['contact_url'] ?? null,
            'seo' => [
                'title' => $titles[$policy].' | Gnai',
                'description' => 'Dados, finalidades, responsabilidades e direitos no uso do Gnai.',
            ],
        ]);
    }
}
