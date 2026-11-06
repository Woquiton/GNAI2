<?php

declare(strict_types=1);

namespace App\Domains\Domain\ValueObjects\Help;

/** Seção `##` de um artigo: o âncora do título no HTML e o texto simples usado na busca. */
final readonly class HelpSection
{
    public function __construct(
        public string $anchor,
        public string $title,
        public string $text,
    ) {}
}
