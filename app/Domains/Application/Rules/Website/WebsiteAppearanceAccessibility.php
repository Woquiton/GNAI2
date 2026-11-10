<?php

declare(strict_types=1);

namespace App\Domains\Application\Rules\Website;

use App\Domains\Domain\Support\Website\AboutAppearance;
use App\Domains\Domain\Support\Website\ContactAppearance;
use App\Domains\Domain\Support\Website\GuidanceAppearance;
use App\Domains\Domain\Support\Website\HeroAppearance;
use App\Domains\Domain\Support\Website\PillarCardAppearance;
use App\Domains\Domain\Support\Website\PillarsAppearance;
use App\Domains\Domain\Support\Website\PublicationsAppearance;
use App\Domains\Domain\Support\Website\TeamAppearance;
use App\Domains\Domain\Support\Website\WebsiteContrast;
use Illuminate\Validation\Validator;

/** Confere as cores efetivas, incluindo herança do tema e os estados de hover. */
final class WebsiteAppearanceAccessibility
{
    public static function validate(Validator $validator, array $section, string $prefix, string $primary): void
    {
        $type = $section['type'];
        $scope = match ($type) {
            'hero', 'about', 'guidance', 'publications', 'events', 'team', 'contact' => $type,
            default => 'pillars',
        };
        $class = match ($scope) {
            'hero' => HeroAppearance::class,
            'about' => AboutAppearance::class,
            'guidance' => GuidanceAppearance::class,
            'publications', 'events' => PublicationsAppearance::class,
            'team' => TeamAppearance::class,
            'contact' => ContactAppearance::class,
            default => PillarsAppearance::class,
        };
        $appearance = $class::normalize((array) ($section[$scope] ?? []));
        if ($scope === 'hero' && $appearance['mode'] === 'banners') {
            return;
        }

        $soft = WebsiteContrast::mix($primary, '#ffffff', 0.09);
        $defaultBackground = match ($type) {
            'hero' => $primary,
            'about', 'audience', 'features', 'faq', 'events' => '#ffffff',
            default => '#f6f7fb',
        };
        $background = self::color($appearance, 'background_color', $defaultBackground);
        // O texto do hero tem painel opaco: a foto e o overlay não alteram seu contraste.
        $backgrounds = $scope === 'hero'
            ? [$background]
            : self::backgrounds($appearance, $background, $soft);
        $base = "{$prefix}.{$scope}";
        self::check($validator, $base, $appearance, 'title_color', $scope === 'hero' ? '#ffffff' : $primary, $backgrounds);
        if (! empty($section['subtitle'])) {
            self::check($validator, $base, $appearance, 'subtitle_color', $scope === 'hero' ? '#ffffff' : '#5f6770', $backgrounds);
        }
        if ($scope === 'about' && ! empty($section['body'])) {
            self::check($validator, $base, $appearance, 'body_color', '#495057', $backgrounds);
        }

        $hasAction = ! empty($section['button_label'])
            || in_array($type, ['publications', 'events', 'team'], true);
        if ($hasAction) {
            $button = $scope === 'hero' || $scope === 'about' || ($appearance['action_style'] ?? 'link') === 'button';
            $buttonBackgrounds = $button
                ? [self::color($appearance, 'button_background', $scope === 'hero' ? '#ffffff' : $primary)]
                : $backgrounds;
            $buttonColor = $scope === 'hero' || ! $button ? $primary : '#ffffff';
            self::check($validator, $base, $appearance, 'button_color', $buttonColor, $buttonBackgrounds);
            if (filter_var($appearance['hover_enabled'] ?? false, FILTER_VALIDATE_BOOL)) {
                $hoverBackgrounds = ! empty($appearance['hover_background'])
                    ? [$appearance['hover_background']] : $buttonBackgrounds;
                self::check($validator, $base, $appearance, 'hover_color', self::color($appearance, 'button_color', $buttonColor), $hoverBackgrounds);
            }
        }
        if ($scope === 'hero' && $appearance['badge_visible']) {
            self::check($validator, $base, $appearance, 'badge_color', '#ffffff', [
                self::color($appearance, 'badge_background', WebsiteContrast::mix('#ffffff', $background, 0.1)),
            ]);
        }

        if (in_array($type, ['publications', 'events', 'team', 'contact'], true)) {
            $cardBackground = self::color($appearance, 'card_background', '#ffffff');
            self::check($validator, $base, $appearance, 'card_title_color', '#212529', [$cardBackground]);
            if ($type !== 'team' || ($appearance['show_role'] ?? true)) {
                self::check($validator, $base, $appearance, 'card_text_color', in_array($type, ['team', 'contact'], true) ? $primary : '#495057', [$cardBackground]);
            }
            if (in_array($type, ['publications', 'events'], true)) {
                // Links de leitura e hover dos títulos usam a cor principal.
                WebsiteAccessibility::contrast($validator, "{$base}.card_background", $primary, [$cardBackground]);
            }
            if ($type === 'contact') {
                WebsiteAccessibility::contrast($validator, "{$base}.icon_color", self::color($appearance, 'icon_color', $primary), [
                    self::color($appearance, 'icon_background', $soft),
                ], 3.0);
            }
            if ($type === 'events' && ($appearance['show_date'] ?? true)) {
                self::check($validator, $base, $appearance, 'date_badge_color', '#ffffff', [
                    self::color($appearance, 'date_badge_background', $primary),
                ]);
            }
        }

        foreach ($section['items'] ?? [] as $index => $item) {
            $card = PillarCardAppearance::normalize((array) ($item['appearance'] ?? []), $type);
            $itemBase = "{$prefix}.items.{$index}.appearance";
            $cardBackground = self::color($card, 'card_background', $type === 'guidance' ? $background : '#ffffff');
            $cardBackgrounds = $type === 'guidance' && empty($card['card_background'])
                ? $backgrounds
                : self::backgrounds($card, $cardBackground, $soft);
            if ($card['hover_enabled']) {
                $cardBackgrounds = [...$cardBackgrounds, ...self::backgrounds(
                    $card, self::color($card, 'hover_background', $cardBackground), $soft
                )];
            }
            self::check($validator, $itemBase, $card, 'title_color', $type === 'guidance' ? $primary : '#212529', $cardBackgrounds);
            if (! empty($item['text'])) {
                self::check($validator, $itemBase, $card, 'text_color', '#495057', $cardBackgrounds);
            }
            if ($type === 'resources' && ! empty($item['url'])) {
                WebsiteAccessibility::contrast($validator, "{$itemBase}.card_background", $primary, $cardBackgrounds);
            }
            if ($type === 'guidance') {
                self::check($validator, $itemBase, $card, 'icon_color', $primary, [
                    self::color($card, 'icon_background', '#ffffff'),
                ]);
            }
        }
    }

    private static function color(array $appearance, string $key, string $fallback): string
    {
        return ! empty($appearance[$key]) ? $appearance[$key] : $fallback;
    }

    private static function check(Validator $validator, string $prefix, array $appearance, string $key, string $fallback, array $backgrounds): void
    {
        WebsiteAccessibility::contrast($validator, "{$prefix}.{$key}", self::color($appearance, $key, $fallback), $backgrounds);
    }

    private static function backgrounds(array $appearance, string $background, string $soft): array
    {
        if (! ($appearance['gradient_enabled'] ?? false)) {
            return [$background];
        }
        return [[$background, self::color($appearance, 'gradient_end_color', $soft)]];
    }
}
