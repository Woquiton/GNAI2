<?php

declare(strict_types=1);

namespace App\Domains\Help\Infrastructure;

use Illuminate\Support\Str;
use League\CommonMark\Extension\HeadingPermalink\HeadingPermalinkExtension;
use League\CommonMark\Normalizer\TextNormalizerInterface;

/**
 * Converte o corpo dos artigos em HTML. O HTML escrito no Markdown é escapado, links inseguros
 * são descartados e os títulos "##"/"###" recebem id sem acento ("## Clonar um item" →
 * #clonar-um-item), para a busca e os atalhos apontarem direto para a seção.
 */
final class HelpMarkdownRenderer
{
    public function toHtml(string $markdown): string
    {
        $slug = new class implements TextNormalizerInterface
        {
            public function normalize(string $text, array $context = []): string
            {
                return Str::slug($text);
            }
        };

        return Str::markdown($markdown, [
            'html_input' => 'escape',
            'allow_unsafe_links' => false,
            'slug_normalizer' => ['instance' => $slug],
            'heading_permalink' => [
                'apply_id_to_heading' => true,
                'id_prefix' => '',
                'fragment_prefix' => '',
                'insert' => 'none',
                'min_heading_level' => 2,
                'max_heading_level' => 3,
            ],
        ], [new HeadingPermalinkExtension]);
    }
}
