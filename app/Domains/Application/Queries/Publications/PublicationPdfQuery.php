<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Publications;

use App\Domains\Domain\Models\Publications\Publication;

final class PublicationPdfQuery
{
    public function execute(Publication $publication): Publication
    {
        return $publication->load([
            'author',
            'media',
            'speakers.professional.person',
            'speakers.professional.position',
            'tags',
        ]);
    }
}
