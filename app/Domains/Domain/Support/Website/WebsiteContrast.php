<?php

declare(strict_types=1);

namespace App\Domains\Domain\Support\Website;

/** Cálculo sRGB de luminância relativa e contraste da WCAG, sem arredondar o resultado. */
final class WebsiteContrast
{
    public static function ratio(string $foreground, string $background): float
    {
        $first = self::luminance($foreground);
        $second = self::luminance($background);

        return (max($first, $second) + 0.05) / (min($first, $second) + 0.05);
    }

    /** O pior contraste ao longo de todo o degradê sRGB, não só nas extremidades. */
    public static function gradientRatio(string $foreground, string $start, string $end): float
    {
        $luminanceAt = static function (float $position) use ($start, $end): float {
            $channels = [];
            foreach ([1, 3, 5] as $offset) {
                $channels[] = (
                    hexdec(substr($start, $offset, 2)) * (1 - $position)
                    + hexdec(substr($end, $offset, 2)) * $position
                ) / 255;
            }

            return self::channelLuminance($channels);
        };

        // A luminância é convexa na interpolação sRGB; o máximo fica numa extremidade.
        $left = 0.0;
        $right = 1.0;
        for ($iteration = 0; $iteration < 80; $iteration++) {
            $first = $left + ($right - $left) / 3;
            $second = $right - ($right - $left) / 3;
            if ($luminanceAt($first) < $luminanceAt($second)) {
                $right = $second;
            } else {
                $left = $first;
            }
        }
        $minimum = min($luminanceAt(0), $luminanceAt(1), $luminanceAt(($left + $right) / 2));
        $maximum = max($luminanceAt(0), $luminanceAt(1));
        $text = self::luminance($foreground);
        $nearest = max($minimum, min($maximum, $text));

        return (max($text, $nearest) + 0.05) / (min($text, $nearest) + 0.05);
    }

    public static function mix(string $first, string $second, float $weight): string
    {
        $channels = [];
        foreach ([1, 3, 5] as $offset) {
            $channels[] = (int) round(
                hexdec(substr($first, $offset, 2)) * $weight
                + hexdec(substr($second, $offset, 2)) * (1 - $weight)
            );
        }

        return sprintf('#%02x%02x%02x', ...$channels);
    }

    private static function luminance(string $color): float
    {
        $channels = [];
        foreach ([1, 3, 5] as $offset) {
            $channels[] = hexdec(substr($color, $offset, 2)) / 255;
        }

        return self::channelLuminance($channels);
    }

    private static function channelLuminance(array $channels): float
    {
        $linear = array_map(
            static fn (float $value): float => $value <= 0.04045
                ? $value / 12.92 : (($value + 0.055) / 1.055) ** 2.4,
            $channels
        );

        return $linear[0] * 0.2126 + $linear[1] * 0.7152 + $linear[2] * 0.0722;
    }
}
