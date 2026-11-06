<?php

declare(strict_types=1);

namespace App\Application\Actions\Tags;

use App\Application\Data\Tags\UpdateTagData;
use App\Domain\DTOs\Tags\UpdateTagDTO;
use App\Domain\Exceptions\InvalidTag;
use App\Domain\Models\Tag;

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
