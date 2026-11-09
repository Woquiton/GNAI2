<?php

declare(strict_types=1);

namespace App\Domains\Application\Rules\Tags;

use App\Domains\Domain\Enums\Tags\TagModule;
use App\Domains\Domain\Exceptions\Tags\InvalidTag;
use App\Domains\Domain\Models\Tags\Tag;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final readonly class TagModuleChangeAllowed implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $tag = request()->route('tag');
        $module = $value instanceof TagModule ? $value : (is_string($value) ? TagModule::tryFrom($value) : null);
        if (! $tag instanceof Tag || $module === null) {
            return;
        }
        try {
            $tag->ensureModuleChangeAllowed($module);
        } catch (InvalidTag $exception) {
            $fail($exception->getMessage());
        }
    }
}
