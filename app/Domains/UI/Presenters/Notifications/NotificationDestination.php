<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Notifications;

final class NotificationDestination
{
    public static function toLocalUrl(mixed $url): ?string
    {
        if (! is_string($url) || trim($url) === '') {
            return null;
        }

        $parts = parse_url(trim($url));

        if ($parts === false) {
            return null;
        }

        $path = $parts['path'] ?? '/';
        $path = '/'.ltrim($path, '/');

        // Notificações persistidas antes de as URLs deixarem o agrupamento por módulo.
        if (str_starts_with($path, '/inclusao/')) {
            $path = substr($path, strlen('/inclusao'));
        }

        if (isset($parts['query'])) {
            $path .= '?'.$parts['query'];
        }

        if (isset($parts['fragment'])) {
            $path .= '#'.$parts['fragment'];
        }

        return $path;
    }
}
