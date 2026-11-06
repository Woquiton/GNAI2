<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Website;

use App\Domains\Application\Actions\Website\UpdateWebsiteAction;
use App\Domains\Application\Data\Website\UpdateWebsiteData;
use App\Domains\Application\Queries\Website\WebsiteContentQuery;
use App\Domains\Domain\Enums\Website\WebsiteSectionType;
use App\Domains\Domain\Exceptions\Website\InvalidWebsite;
use App\Domains\Domain\Models\Website\WebsiteSetting;
use App\Domains\Domain\Support\Website\WebsiteDefaults;
use App\Domains\Domain\Support\Website\PillarCardAppearance;
use App\Domains\UI\Presenters\Website\WebsitePresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Throwable;

/**
 * Construtor da página inicial do site com prévia em tempo real.
 */
final readonly class WebsiteBuilderController
{
    public function __construct(private WebsitePresenter $presenter) {}

    public function edit(Request $request, WebsiteContentQuery $content): InertiaResponse
    {
        $setting = WebsiteSetting::current();

        return Inertia::render('Website/Builder/Edit', [
            'settings' => $this->presenter->settings($setting),
            'sections' => $this->presenter->sections($setting),
            'site' => $this->presenter->site($setting),
            'content' => $content->execute(),
            'sectionTypes' => WebsiteSectionType::options(),
            'pillarCardTemplate' => PillarCardAppearance::defaults(),
            'guidanceStepTemplate' => PillarCardAppearance::defaults('guidance'),
            'sectionTemplates' => collect(WebsiteDefaults::sections())
                ->mapWithKeys(fn (array $section): array => [$section['type'] => [...$section, 'image_url' => null]])
                ->all(),
            'publicUrl' => route('website.home'),
            'can' => [
                'submit' => $request->user()?->can('website.update') ?? false,
            ],
        ]);
    }

    /**
     * @throws InvalidWebsite
     * @throws Throwable
     */
    public function update(UpdateWebsiteData $data, UpdateWebsiteAction $action): RedirectResponse
    {
        $action->execute($data);

        return redirect()
            ->route('website.builder.edit')
            ->with('success', 'Site atualizado com sucesso!');
    }
}
