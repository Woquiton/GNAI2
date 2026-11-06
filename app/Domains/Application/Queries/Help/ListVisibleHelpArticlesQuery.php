<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Help;

use App\Domains\Domain\ValueObjects\Help\HelpArticle;
use App\Domains\Infrastructure\Help\MarkdownHelpArticleRepository;
use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Artigos que o usuário pode ver, na ordem das abas: categoria, `ordem` e título. Um artigo com
 * `permissoes` só aparece para quem tiver ao menos uma delas.
 */
final readonly class ListVisibleHelpArticlesQuery
{
    public function __construct(
        private MarkdownHelpArticleRepository $articles,
        private Gate $gate,
    ) {}

    /** @return list<HelpArticle> */
    public function execute(Authenticatable $user): array
    {
        $gate = $this->gate->forUser($user);
        $visible = array_filter(
            $this->articles->all(),
            fn (HelpArticle $article): bool => $article->abilities === [] || $gate->any($article->abilities),
        );

        usort($visible, fn (HelpArticle $a, HelpArticle $b): int => [$a->category->position(), $a->order, $a->title]
            <=> [$b->category->position(), $b->order, $b->title]);

        return $visible;
    }
}
