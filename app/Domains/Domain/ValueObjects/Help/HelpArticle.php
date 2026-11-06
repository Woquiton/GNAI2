<?php

declare(strict_types=1);

namespace App\Domains\Domain\ValueObjects\Help;

use App\Domains\Domain\Enums\Help\HelpCategory;

/** Artigo da Central de Ajuda lido de `resources/help/<slug>.md`. */
final readonly class HelpArticle
{
    /**
     * @param  list<string>  $keywords
     * @param  list<string>  $abilities  habilidades das quais basta uma para ver o artigo; vazio = todos
     * @param  list<HelpSection>  $sections
     */
    public function __construct(
        public string $slug,
        public string $title,
        public string $summary,
        public HelpCategory $category,
        public array $keywords,
        public int $order,
        public array $abilities,
        public string $markdown,
        public string $introduction,
        public array $sections,
    ) {}
}
