<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\StudentDocuments;

use App\Domains\Domain\Enums\StudentDocuments\StudentDocumentType;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;

final class StudentDocumentCustomTypesQuery
{
    /** @return list<string> */
    public function execute(): array
    {
        return StudentDocument::query()
            ->where('type', StudentDocumentType::OTHER->value)
            ->whereNotNull('custom_type')
            ->where('custom_type', '<>', '')
            ->distinct()
            ->orderBy('custom_type')
            ->pluck('custom_type')
            ->all();
    }

    public function canonicalName(?string $name): ?string
    {
        $name = preg_replace('/\s+/u', ' ', trim((string) $name));

        if ($name === '') {
            return null;
        }

        return StudentDocument::query()
            ->where('type', StudentDocumentType::OTHER->value)
            ->where('custom_type', $name)
            ->orderBy('id')
            ->value('custom_type') ?? $name;
    }
}
