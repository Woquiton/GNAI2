<?php

declare(strict_types=1);

namespace App\Domains\Help\Infrastructure;

use App\Domains\Help\Domain\Enums\HelpCategory;
use App\Domains\Help\Domain\ValueObjects\HelpArticle;
use App\Domains\Help\Domain\ValueObjects\HelpSection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * Lê os artigos da Central de Ajuda em `resources/help/<slug>.md`. Cada arquivo começa com um
 * cabeçalho entre "---" (titulo, resumo, categoria, palavras-chave, ordem, permissoes); cada
 * título "##" do corpo é uma seção pesquisável. Veja docs/ai-conventions/content/help-articles.md.
 */
final class MarkdownHelpArticleRepository
{
    private const SLUG_PATTERN = '/^[a-z0-9-]+$/';

    /** @var list<HelpArticle>|null */
    private ?array $articles = null;

    public function __construct(private readonly ?string $directory = null) {}

    /** @return list<HelpArticle> */
    public function all(): array
    {
        if ($this->articles !== null) {
            return $this->articles;
        }

        $directory = $this->directory();

        if (! File::isDirectory($directory)) {
            return $this->articles = [];
        }

        $articles = [];
        foreach (File::files($directory) as $file) {
            $slug = $file->getBasename('.md');

            if ($file->getExtension() === 'md' && preg_match(self::SLUG_PATTERN, $slug) === 1) {
                $articles[] = $this->parse($slug, File::get($file->getPathname()));
            }
        }

        return $this->articles = $articles;
    }

    public function find(string $slug): ?HelpArticle
    {
        // O slug vira nome de arquivo: só letras minúsculas, números e hífen, nada de "../".
        if (preg_match(self::SLUG_PATTERN, $slug) !== 1) {
            return null;
        }

        foreach ($this->all() as $article) {
            if ($article->slug === $slug) {
                return $article;
            }
        }

        return null;
    }

    private function directory(): string
    {
        return $this->directory ?? resource_path('help');
    }

    private function parse(string $slug, string $contents): HelpArticle
    {
        $header = [];
        $body = $contents;

        if (preg_match('/\A\x{FEFF}?---\R(.*?)\R---\R?(.*)\z/su', $contents, $parts) === 1) {
            foreach (preg_split('/\R/', $parts[1]) ?: [] as $line) {
                if (str_contains($line, ':')) {
                    [$key, $value] = array_map('trim', explode(':', $line, 2));
                    $header[Str::lower($key)] = $value;
                }
            }
            $body = $parts[2];
        }

        [$introduction, $sections] = $this->sections($body);

        return new HelpArticle(
            slug: $slug,
            title: $header['titulo'] ?? Str::headline($slug),
            summary: $header['resumo'] ?? '',
            category: HelpCategory::fromHeader($header['categoria'] ?? null),
            keywords: $this->list($header['palavras-chave'] ?? ''),
            order: (int) ($header['ordem'] ?? 100),
            abilities: $this->list($header['permissoes'] ?? ''),
            markdown: $body,
            introduction: $introduction,
            sections: $sections,
        );
    }

    /**
     * Divide o corpo nas seções "##". Os âncoras repetem a regra do conversor de HTML
     * (`HelpMarkdownRenderer`): slug do texto do título, com sufixo -1, -2... nos repetidos,
     * contando também os títulos "###".
     *
     * @return array{0: string, 1: list<HelpSection>}
     */
    private function sections(string $body): array
    {
        $introduction = [];
        $sections = [];
        $current = null;
        $usedAnchors = [];
        $insideCode = false;

        foreach (preg_split('/\R/', $body) ?: [] as $line) {
            if (preg_match('/^\s*(```|~~~)/', $line) === 1) {
                $insideCode = ! $insideCode;
            }

            $heading = ! $insideCode && preg_match('/^(#{2,3})\s+(.+?)\s*#*\s*$/', $line, $match) === 1;

            if ($heading) {
                $title = $this->plain($match[2]);
                $anchor = $this->uniqueAnchor($title, $usedAnchors);

                if (strlen($match[1]) === 2) {
                    if ($current !== null) {
                        $sections[] = $current;
                    }
                    $current = ['anchor' => $anchor, 'title' => $title, 'lines' => []];

                    continue;
                }
            }

            if ($current === null) {
                $introduction[] = $line;
            } else {
                $current['lines'][] = $line;
            }
        }

        if ($current !== null) {
            $sections[] = $current;
        }

        return [
            $this->plain(implode("\n", $introduction)),
            array_map(
                fn (array $section): HelpSection => new HelpSection(
                    anchor: $section['anchor'],
                    title: $section['title'],
                    text: $this->plain(implode("\n", $section['lines'])),
                ),
                $sections,
            ),
        ];
    }

    /** @param  array<string, true>  $used */
    private function uniqueAnchor(string $title, array &$used): string
    {
        $anchor = Str::slug($title);

        if (isset($used[$anchor])) {
            $suffix = 0;
            do {
                $suffix++;
            } while (isset($used[$anchor.'-'.$suffix]));
            $anchor .= '-'.$suffix;
        }

        $used[$anchor] = true;

        return $anchor;
    }

    /** Texto simples do Markdown, para busca e trechos dos resultados. */
    private function plain(string $markdown): string
    {
        $text = preg_replace(
            [
                '/^\s*\|?\s*:?-{3,}.*$/m',          // separadores de tabela
                '/!?\[([^\]]*)\]\([^)]*\)/',         // links e imagens: só o texto
                '/^\s{0,3}(#{1,6}|>|[-*+]|\d+[.)])\s+/m', // títulos, citações e marcadores
                '/(\*\*|__|`|~~)/',                  // ênfases e código
                '/\\\\([\\\\`*_{}\[\]()#+\-.!|>])/', // caracteres escapados
                '/\|/',                              // colunas de tabela
            ],
            ['', '$1', '', '', '$1', ' '],
            $markdown,
        ) ?? $markdown;

        return Str::squish($text);
    }

    /** @return list<string> */
    private function list(string $value): array
    {
        return array_values(array_filter(array_map('trim', explode(',', $value)), fn (string $item) => $item !== ''));
    }
}
