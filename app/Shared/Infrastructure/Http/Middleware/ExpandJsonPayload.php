<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Formulários grandes com arquivos enviam os campos num único `_payload` (JSON) e só os
 * arquivos como campos multipart, para não esbarrar no `max_input_vars` do PHP. O payload é
 * aberto antes do `SanitizeRichTextInput` e recebe o mesmo tratamento dos campos comuns
 * (TrimStrings e ConvertEmptyStringsToNull); os arquivos continuam nas mesmas posições.
 */
final class ExpandJsonPayload
{
    public const FIELD = '_payload';

    /** Campos que o TrimStrings do Laravel também não apara. */
    private const UNTRIMMED = ['current_password', 'password', 'password_confirmation'];

    public function handle(Request $request, Closure $next): Response
    {
        $raw = $request->request->get(self::FIELD);

        if (! is_string($raw) || ! in_array($request->getMethod(), ['POST', 'PUT', 'PATCH'], true)) {
            return $next($request);
        }

        $request->request->remove(self::FIELD);
        $decoded = json_decode($raw, true, 64);

        if (! is_array($decoded)) {
            throw ValidationException::withMessages([
                self::FIELD => 'Não foi possível ler os dados enviados. Recarregue a página e tente novamente.',
            ]);
        }

        $request->request->replace(array_replace_recursive(
            $this->normalize($decoded),
            $request->request->all(),
        ));

        return $next($request);
    }

    /**
     * @param  array<array-key, mixed>  $values
     * @return array<array-key, mixed>
     */
    private function normalize(array $values): array
    {
        $normalized = [];

        foreach ($values as $key => $value) {
            if (is_array($value)) {
                $normalized[$key] = $this->normalize($value);

                continue;
            }

            if (is_string($value) && ! in_array($key, self::UNTRIMMED, true)) {
                $value = trim($value);
            }

            $normalized[$key] = $value === '' ? null : $value;
        }

        return $normalized;
    }
}
