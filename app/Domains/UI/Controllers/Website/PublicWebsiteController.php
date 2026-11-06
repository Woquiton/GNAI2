<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Website;

use App\Domains\Domain\Enums\Publications\PublicationType;
use App\Domains\Domain\Models\Publications\Publication;
use App\Domains\Application\Data\Website\ListPublicPublicationsData;
use App\Domains\Application\Queries\Website\PublicPublicationsQuery;
use App\Domains\Application\Queries\Website\WebsiteContentQuery;
use App\Domains\Domain\Models\Website\WebsiteSetting;
use App\Domains\UI\Presenters\Website\WebsitePresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Site público white label, sem autenticação.
 */
final readonly class PublicWebsiteController
{
    public function __construct(private WebsitePresenter $presenter) {}

    public function home(WebsiteContentQuery $content): InertiaResponse
    {
        $setting = WebsiteSetting::current();
        $site = $this->presenter->site($setting);

        return Inertia::render('Website/Public/Home', [
            'site' => $site,
            'sections' => $this->presenter->sections($setting),
            'content' => $content->execute(),
            'seo' => [
                'title' => $site['name'],
                'description' => $site['tagline'],
            ],
        ]);
    }

    public function team(WebsiteContentQuery $content): InertiaResponse
    {
        $site = $this->presenter->site(WebsiteSetting::current());

        return Inertia::render('Website/Public/Team', [
            'site' => $site,
            'members' => $content->team(),
            'seo' => [
                'title' => "Equipe - {$site['name']}",
                'description' => "Conheça a equipe do {$site['name']}.",
            ],
        ]);
    }

    public function publications(
        Request $request,
        ListPublicPublicationsData $filters,
        PublicPublicationsQuery $query,
    ): InertiaResponse {
        $site = $this->presenter->site(WebsiteSetting::current());

        return Inertia::render('Website/Public/Publications', [
            'site' => $site,
            'publications' => $query->execute($filters)->through(
                fn (Publication $publication): array => $this->presenter->publicationCard($publication),
            ),
            'filters' => $request->only(['q', 'type', 'tag']),
            'types' => PublicationType::options(),
            'tags' => $query->tags(),
            'seo' => [
                'title' => "Publicações - {$site['name']}",
                'description' => "Notícias, eventos e comunicados do {$site['name']}.",
            ],
        ]);
    }

    public function publication(string $slug, PublicPublicationsQuery $query): InertiaResponse
    {
        $publication = $query->findVisible($slug);
        $site = $this->presenter->site(WebsiteSetting::current());
        $detail = $this->presenter->publicationDetail($publication);
        $related = $query->related($publication)
            ->map(fn (Publication $item): array => $this->presenter->publicationCard($item))
            ->all();

        return Inertia::render('Website/Public/PublicationShow', [
            'site' => $site,
            'publication' => $detail,
            'related' => $related,
            'seo' => [
                'title' => "{$detail['seo_title']} - {$site['name']}",
                'description' => $detail['seo_description'] ?: $detail['summary'],
                'image' => $detail['cover_url'],
            ],
        ]);
    }
}
