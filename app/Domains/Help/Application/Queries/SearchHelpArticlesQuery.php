<?php

declare(strict_types=1);

namespace App\Domains\Help\Application\Queries;

use App\Domains\Help\Domain\ValueObjects\HelpArticle;
use App\Domains\Help\Domain\ValueObjects\HelpSearchTerm;
use App\Domains\Help\Domain\ValueObjects\HelpSection;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Pesquisa da Central de Ajuda. Um artigo atende quando todas as palavras do termo aparecem nele;
 * sem nenhum artigo assim, vale qualquer palavra e o resultado é marcado como aproximado. Título e
 * palavras-chave pesam mais que o texto, e o resultado aponta para a seção que melhor atende.
 */
final readonly class SearchHelpArticlesQuery
{
    private const TITLE_WEIGHT = 10;

    private const KEYWORDS_WEIGHT = 8;

    private const SECTION_TITLE_WEIGHT = 6;

    private const SUMMARY_WEIGHT = 4;

    private const CATEGORY_WEIGHT = 2;

    private const TEXT_WEIGHT = 1;

    public function __construct(private ListVisibleHelpArticlesQuery $visibleArticles) {}

    /**
     * @return array{approximate: bool, results: list<array<string, mixed>>}
     */
    public function execute(Authenticatable $user, HelpSearchTerm $term): array
    {
        $articles = $this->visibleArticles->execute($user);

        if ($term->isEmpty()) {
            return [
                'approximate' => false,
                'results' => array_map(fn (HelpArticle $article) => $this->present($article, null, null), $articles),
            ];
        }

        $matches = array_values(array_filter(array_map(
            fn (HelpArticle $article) => $this->match($article, $term),
            $articles,
        )));

        $total = count($term->stems);
        $complete = array_values(array_filter($matches, fn (array $match): bool => $match['found'] === $total));
        $approximate = $complete === [];
        $selected = $approximate ? $matches : $complete;

        // Ordem estável: relevância e, no empate, a ordem das abas.
        $positions = array_flip(array_map(fn (HelpArticle $article) => $article->slug, $articles));
        usort($selected, fn (array $a, array $b): int => [$b['found'], $b['score'], $positions[$a['article']->slug]]
            <=> [$a['found'], $a['score'], $positions[$b['article']->slug]]);

        return [
            'approximate' => $approximate,
            'results' => array_map(
                fn (array $match) => $this->present($match['article'], $match['section'], $term->excerpt($match['excerpt'])),
                $selected,
            ),
        ];
    }

    /** @return array{article: HelpArticle, section: ?HelpSection, excerpt: string, found: int, score: int}|null */
    private function match(HelpArticle $article, HelpSearchTerm $term): ?array
    {
        $fields = [
            [$article->title, self::TITLE_WEIGHT],
            [implode(' ', $article->keywords), self::KEYWORDS_WEIGHT],
            [$article->summary, self::SUMMARY_WEIGHT],
            [$article->category->label(), self::CATEGORY_WEIGHT],
            [$article->introduction, self::TEXT_WEIGHT],
        ];
        foreach ($article->sections as $section) {
            $fields[] = [$section->title, self::SECTION_TITLE_WEIGHT];
            $fields[] = [$section->text, self::TEXT_WEIGHT];
        }

        $weights = [];
        foreach ($fields as [$text, $weight]) {
            foreach ($term->stemsFoundIn($text) as $stem) {
                $weights[$stem] = max($weights[$stem] ?? 0, $weight);
            }
        }

        if ($weights === []) {
            return null;
        }

        $section = $this->bestSection($article, $term);

        return [
            'article' => $article,
            'section' => $section,
            'excerpt' => $section?->text ?: ($term->stemsFoundIn($article->introduction) !== [] ? $article->introduction : $article->summary),
            'found' => count($weights),
            'score' => array_sum($weights),
        ];
    }

    private function bestSection(HelpArticle $article, HelpSearchTerm $term): ?HelpSection
    {
        $best = null;
        $bestScore = 0;

        foreach ($article->sections as $section) {
            $inTitle = $term->stemsFoundIn($section->title);
            $found = array_unique([...$inTitle, ...$term->stemsFoundIn($section->text)]);
            $score = count($found) * 10 + count($inTitle) * self::SECTION_TITLE_WEIGHT;

            if ($score > $bestScore) {
                $best = $section;
                $bestScore = $score;
            }
        }

        return $best;
    }

    /**
     * @param  list<array{text: string, highlighted: bool}>|null  $excerpt
     * @return array<string, mixed>
     */
    private function present(HelpArticle $article, ?HelpSection $section, ?array $excerpt): array
    {
        return [
            'slug' => $article->slug,
            'title' => $article->title,
            'summary' => $article->summary,
            'category' => $article->category->value,
            'category_label' => $article->category->label(),
            'section' => $section ? ['anchor' => $section->anchor, 'title' => $section->title] : null,
            'excerpt' => $excerpt ?? [],
        ];
    }
}
