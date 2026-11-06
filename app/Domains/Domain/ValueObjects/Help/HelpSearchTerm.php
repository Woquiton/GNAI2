<?php

declare(strict_types=1);

namespace App\Domains\Domain\ValueObjects\Help;

use Illuminate\Support\Str;

/**
 * Termo pesquisado na Central de Ajuda. A comparação ignora acentos, maiúsculas, palavras de
 * ligação ("como", "um", "para") e plurais simples: "Como clonar itens" procura "clonar" e "item"
 * no início das palavras do texto.
 */
final readonly class HelpSearchTerm
{
    private const STOP_WORDS = [
        'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos', 'e', 'ou',
        'em', 'no', 'na', 'nos', 'nas', 'para', 'pra', 'pro', 'por', 'pelo', 'pela', 'com', 'como',
        'que', 'qual', 'quais', 'se', 'eu', 'meu', 'minha', 'ao', 'aos', 'serve', 'faco', 'fazer',
        'posso', 'onde', 'quando', 'sobre', 'ja', 'ser', 'esta', 'isso',
    ];

    /** @param  list<string>  $stems */
    private function __construct(
        public string $original,
        public array $stems,
    ) {}

    public static function from(?string $value): self
    {
        $original = Str::of((string) $value)->squish()->limit(120, '')->toString();
        $words = array_values(array_unique(self::words($original)));
        $meaningful = array_values(array_diff($words, self::STOP_WORDS));
        $stems = array_values(array_unique(array_map(self::stem(...), $meaningful !== [] ? $meaningful : $words)));

        return new self($original, $stems);
    }

    public function isEmpty(): bool
    {
        return $this->stems === [];
    }

    /**
     * Quais radicais aparecem no texto, no início de alguma palavra.
     *
     * @return list<string>
     */
    public function stemsFoundIn(string $text): array
    {
        $words = self::words($text);

        return array_values(array_filter(
            $this->stems,
            static function (string $stem) use ($words): bool {
                foreach ($words as $word) {
                    if (self::wordMatches($word, $stem)) {
                        return true;
                    }
                }

                return false;
            },
        ));
    }

    /**
     * Trecho do texto em volta da primeira ocorrência, em partes com e sem destaque.
     *
     * @return list<array{text: string, highlighted: bool}>
     */
    public function excerpt(string $text, int $length = 240): array
    {
        preg_match_all('/[\p{L}\p{N}]+/u', $text, $matches, PREG_OFFSET_CAPTURE);

        $hits = [];
        foreach ($matches[0] as [$word, $byteOffset]) {
            $normalized = self::normalize($word);
            foreach ($this->stems as $stem) {
                if (self::wordMatches($normalized, $stem)) {
                    $hits[] = [mb_strlen(substr($text, 0, $byteOffset)), mb_strlen($word)];
                    break;
                }
            }
        }

        $total = mb_strlen($text);
        $start = $hits === [] ? 0 : max(0, $hits[0][0] - intdiv($length, 3));

        if ($start > 0) {
            $space = mb_strpos($text, ' ', $start);
            $start = $space === false || $space > $hits[0][0] ? $start : $space + 1;
        }

        $end = min($total, $start + $length);
        if ($end < $total) {
            $space = mb_strrpos(mb_substr($text, 0, $end), ' ');
            $end = $space === false || $space <= $start ? $end : $space;
        }

        $parts = [];
        $cursor = $start;
        foreach ($hits as [$offset, $size]) {
            if ($offset < $start || $offset + $size > $end) {
                continue;
            }
            if ($offset > $cursor) {
                $parts[] = ['text' => mb_substr($text, $cursor, $offset - $cursor), 'highlighted' => false];
            }
            $parts[] = ['text' => mb_substr($text, $offset, $size), 'highlighted' => true];
            $cursor = $offset + $size;
        }
        if ($cursor < $end) {
            $parts[] = ['text' => mb_substr($text, $cursor, $end - $cursor), 'highlighted' => false];
        }

        if ($parts !== [] && $start > 0) {
            $parts[0]['text'] = '…'.$parts[0]['text'];
        }
        if ($parts !== [] && $end < $total) {
            $parts[array_key_last($parts)]['text'] .= '…';
        }

        return $parts;
    }

    /** "itens" atende a busca por "item"; "clonagem" não atende "clonar". */
    private static function wordMatches(string $word, string $stem): bool
    {
        return str_starts_with($word, $stem) || str_starts_with(self::stem($word), $stem);
    }

    /** @return list<string> */
    private static function words(string $text): array
    {
        $normalized = self::normalize($text);

        return $normalized === '' ? [] : explode(' ', $normalized);
    }

    private static function normalize(string $text): string
    {
        return trim((string) preg_replace('/[^a-z0-9]+/', ' ', Str::lower(Str::ascii($text))));
    }

    /** Reduz plurais comuns: "itens" → "item", "acoes" → "aca", "professores" → "professor". */
    private static function stem(string $word): string
    {
        return match (true) {
            strlen($word) > 3 && str_ends_with($word, 'ns') => substr($word, 0, -2).'m',
            strlen($word) > 4 && preg_match('/(oes|aes)$/', $word) === 1 => substr($word, 0, -3).'a',
            strlen($word) > 5 && preg_match('/(res|zes|les)$/', $word) === 1 => substr($word, 0, -2),
            strlen($word) > 3 && str_ends_with($word, 's') => substr($word, 0, -1),
            default => $word,
        };
    }
}
