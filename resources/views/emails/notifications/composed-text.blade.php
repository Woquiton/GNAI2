{!! html_entity_decode(strip_tags(preg_replace('/<\/(p|div|li|h[1-6])>|<br\s*\/?\s*>/i', "\n", $body)), ENT_QUOTES, 'UTF-8') !!}
