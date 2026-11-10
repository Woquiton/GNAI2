<?php

declare(strict_types=1);

namespace App\Domains\Application\Rules\Website;

use App\Domains\Domain\Support\Website\WebsiteContrast;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use DOMDocument;
use DOMElement;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;

/** Regras editoriais do site. Não confia nos caminhos de imagem enviados pelo navegador. */
final class WebsiteAccessibility
{
    public static function validate(Validator $validator, array $previousSections): void
    {
        $data = $validator->getData();
        $primary = $data['primary_color'];
        self::contrast($validator, 'primary_color', $primary, [
            '#ffffff', '#f6f7fb', WebsiteContrast::mix($primary, '#ffffff', 0.09),
        ]);

        $sections = $data['sections'] ?? [];
        $anchors = ['site-content', 'site-navigation', 'site-footer'];
        foreach ($sections as $section) {
            if (self::enabled($section)) {
                $anchors[] = $section['id'];
            }
        }

        foreach ($sections as $index => $section) {
            $prefix = "sections.{$index}";
            if (in_array($section['id'], ['site-content', 'site-navigation', 'site-footer'], true)) {
                $validator->errors()->add("{$prefix}.id", 'Esta identificação é reservada à navegação do site.');
            }
            if (! self::enabled($section)) {
                continue;
            }

            if (self::blank($section['title'] ?? '')) {
                $validator->errors()->add("{$prefix}.title", 'Informe um título que identifique esta seção.');
            }

            if ($section['type'] !== 'hero' || ($section['hero']['mode'] ?? 'text') === 'text') {
                self::action($validator, $section, $prefix, $anchors);
            }
            $previous = $previousSections[$section['id']] ?? [];
            $previous = ($previous['type'] ?? null) === $section['type'] ? $previous : [];
            $hasImage = ($section['image'] ?? null) instanceof UploadedFile
                || (! self::flag($section['remove_image'] ?? false) && ! empty($previous['image_path']));

            if ($section['type'] === 'about' && $hasImage && self::blank($section['image_alt'] ?? '')) {
                $validator->errors()->add("{$prefix}.image_alt", 'Descreva o conteúdo da imagem para quem usa leitor de tela.');
            }

            foreach ($section['items'] ?? [] as $itemIndex => $item) {
                $itemPrefix = "{$prefix}.items.{$itemIndex}";
                if (self::blank($item['title'] ?? '')) {
                    $validator->errors()->add("{$itemPrefix}.title", 'Informe um título que identifique este item.');
                }
                if ($section['type'] === 'faq' && self::blank($item['text'] ?? '')) {
                    $validator->errors()->add("{$itemPrefix}.text", 'Preencha a resposta desta pergunta.');
                }
                if ($section['type'] === 'resources' && self::blank($item['url'] ?? '')) {
                    $validator->errors()->add("{$itemPrefix}.url", 'Informe o endereço do material.');
                }
                self::anchor($validator, "{$itemPrefix}.url", $item['url'] ?? '', $anchors);
            }
            foreach ($section['slides'] ?? [] as $slideIndex => $slide) {
                if (self::blank($slide['alt'] ?? '')) {
                    $validator->errors()->add("{$prefix}.slides.{$slideIndex}.alt", 'Descreva o conteúdo desta imagem para quem usa leitor de tela.');
                }
                self::anchor($validator, "{$prefix}.slides.{$slideIndex}.url", $slide['url'] ?? '', $anchors);
            }

            if ($section['type'] === 'about' && ! self::blank($section['body'] ?? '')) {
                self::richText($validator, "{$prefix}.body", $section['body'], $anchors);
            }

            WebsiteAppearanceAccessibility::validate($validator, $section, $prefix, $primary);
        }
    }

    public static function contrast(Validator $validator, string $field, string $foreground, array $backgrounds, float $minimum = 4.5): void
    {
        foreach ($backgrounds as $background) {
            $ratio = is_array($background)
                ? WebsiteContrast::gradientRatio($foreground, $background[0], $background[1])
                : WebsiteContrast::ratio($foreground, $background);
            if ($ratio < $minimum) {
                $validator->errors()->add(
                    $field,
                    "Esta combinação de cores não atinge o contraste mínimo de {$minimum}:1. Ajuste a cor do texto ou do fundo."
                );
                return;
            }
        }
    }

    private static function action(Validator $validator, array $section, string $prefix, array $anchors): void
    {
        $label = trim((string) ($section['button_label'] ?? ''));
        $url = trim((string) ($section['button_url'] ?? ''));
        $hasDefaultAction = in_array($section['type'], ['team', 'events', 'publications'], true);
        if (! $hasDefaultAction && $url !== '' && self::blank($label)) {
            $validator->errors()->add("{$prefix}.button_label", 'Informe o texto que identifica o destino desta ação.');
        }
        if (! $hasDefaultAction && $label !== '' && $url === '') {
            $validator->errors()->add("{$prefix}.button_url", 'Informe o destino desta ação ou remova seu texto.');
        }
        self::anchor($validator, "{$prefix}.button_url", $url, $anchors);
    }

    private static function anchor(Validator $validator, string $field, string $url, array $anchors): void
    {
        $url = trim($url);
        if (str_starts_with($url, '#') && ! in_array(substr($url, 1), $anchors, true)) {
            $validator->errors()->add($field, 'Escolha uma seção habilitada como destino deste link.');
        }
        if (
            (preg_match('/^https?:/i', $url) && ! filter_var($url, FILTER_VALIDATE_URL))
            || str_starts_with($url, '//')
            || (preg_match('/^(?:mailto:|tel:)$/i', $url))
        ) {
            $validator->errors()->add($field, 'Informe um endereço completo para o destino deste link.');
        }
    }

    private static function richText(Validator $validator, string $field, string $html, array $anchors): void
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML(
            '<?xml encoding="UTF-8"><html><body>'.RichTextSanitizer::sanitize($html).'</body></html>',
            LIBXML_HTML_NODEFDTD | LIBXML_NONET
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        foreach ($document->getElementsByTagName('img') as $image) {
            if (self::blank($image->getAttribute('alt'))) {
                $validator->errors()->add($field, 'Adicione uma descrição alternativa a cada imagem inserida no texto.');
                break;
            }
        }
        foreach ($document->getElementsByTagName('a') as $link) {
            $name = $link->textContent;
            foreach ($link->getElementsByTagName('img') as $image) {
                $name .= $image->getAttribute('alt');
            }
            if (self::blank($name) || self::blank($link->getAttribute('href')) || $link->getAttribute('href') === '#') {
                $validator->errors()->add($field, 'Todos os links do texto precisam de uma descrição e de um destino.');
                break;
            }
            self::anchor($validator, $field, $link->getAttribute('href'), $anchors);
        }

        foreach ($document->getElementsByTagName('*') as $node) {
            if ($node instanceof DOMElement && (
                $node->hasAttribute('color')
                || preg_match('/(?:^|;)\s*(?:color|background(?:-color)?)\s*:/i', $node->getAttribute('style'))
            )) {
                $validator->errors()->add($field, 'Remova as cores aplicadas dentro do texto e use as cores da seção, que passam pela verificação de contraste.');
                break;
            }
        }

        $lastLevel = 2;
        foreach ($document->getElementsByTagName('*') as $node) {
            if (! $node instanceof DOMElement || ! preg_match('/^h([1-6])$/', $node->tagName, $match)) {
                continue;
            }
            $level = (int) $match[1];
            if ($level < 3 || $level > $lastLevel + 1 || self::blank($node->textContent)) {
                $validator->errors()->add($field, 'No texto, comece os subtítulos pelo nível 3 e mantenha a sequência, sem saltar níveis ou deixar títulos vazios.');
                break;
            }
            $lastLevel = $level;
        }
        foreach ($document->getElementsByTagName('table') as $table) {
            $caption = $table->getElementsByTagName('caption')->item(0);
            if ($caption === null || self::blank($caption->textContent) || $table->getElementsByTagName('th')->length === 0) {
                $validator->errors()->add($field, 'Dê um título a cada tabela e identifique suas colunas usando a primeira linha como cabeçalho.');
                break;
            }
            foreach ($table->getElementsByTagName('th') as $header) {
                if (self::blank($header->textContent) || ! in_array($header->getAttribute('scope'), ['row', 'col', 'rowgroup', 'colgroup'], true)) {
                    $validator->errors()->add($field, 'Identifique as colunas da tabela usando a primeira linha como cabeçalho.');
                    break 2;
                }
            }
        }
    }

    private static function enabled(array $section): bool
    {
        return self::flag($section['enabled'] ?? true);
    }

    private static function flag(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOL);
    }

    private static function blank(string $value): bool
    {
        return preg_match('/[^\s\p{Z}\x{200B}\x{FEFF}]/u', $value) !== 1;
    }
}
