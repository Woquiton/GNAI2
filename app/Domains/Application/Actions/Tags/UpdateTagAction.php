<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Tags;

use App\Domains\Application\Data\Tags\UpdateTagData;
use App\Domains\Domain\DTOs\Tags\UpdateTagDTO;
use App\Domains\Domain\Exceptions\Tags\InvalidTag;
use App\Domains\Domain\Models\Tags\Tag;

final readonly class UpdateTagAction
{
    /**
     * @throws InvalidTag
     */
    public function execute(Tag $tag, UpdateTagData $data): Tag
    {
        $tagDTO = new UpdateTagDTO(
            name: $data->name,
            isActive: $data->isActive,
            module: $data->module,
            color: $data->color,
        );

        $tag->revise($tagDTO);
        $tag->save();

        return $tag;
    }
}
