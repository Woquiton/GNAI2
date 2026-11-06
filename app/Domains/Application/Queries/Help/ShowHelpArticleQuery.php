<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Help;

use App\Domains\Domain\ValueObjects\Help\HelpArticle;
use App\Domains\Domain\ValueObjects\Help\HelpSection;
use App\Domains\Infrastructure\Help\HelpMarkdownRenderer;
use Illuminate\Contracts\Auth\Authenticatable;

/** Artigo convertido em HTML, com o índice das seções e os demais artigos da mesma categoria. */
final readonly class ShowHelpArticleQuery
{
    private const RELATED_LIMIT = 6;

    public function __construct(
        private ListVisibleHelpArticlesQuery $visibleArticles,
        private HelpMarkdownRenderer $renderer,
    ) {}

    /** @return array<string, mixed>|null nulo quando o artigo não existe ou não é visível ao usuário */
    public function execute(Authenticatable $user, string $slug): ?array
    {
        $articles = $this->visibleArticles->execute($user);
        $article = collect($articles)->first(fn (HelpArticle $candidate) => $candidate->slug === $slug);

        if (! $article instanceof HelpArticle) {
            return null;
        }

        $related = collect($articles)
            ->filter(fn (HelpArticle $candidate) => $candidate->category === $article->category && $candidate->slug !== $slug)
            ->take(self::RELATED_LIMIT)
            ->map(fn (HelpArticle $candidate) => [
                'slug' => $candidate->slug,
                'title' => $candidate->title,
                'summary' => $candidate->summary,
            ])
            ->values()
            ->all();

        return [
            'slug' => $article->slug,
            'title' => $article->title,
            'summary' => $article->summary,
            'category' => $article->category->value,
            'category_label' => $article->category->label(),
            'html' => $this->renderer->toHtml($article->markdown),
            'sections' => array_map(
                fn (HelpSection $section) => ['anchor' => $section->anchor, 'title' => $section->title],
                $article->sections,
            ),
            'related' => $related,
        ];
    }
}
