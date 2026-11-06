<?php

declare(strict_types=1);

namespace App\Application\Actions\Tags;

use App\Application\Data\Tags\CreateTagData;
use App\Domain\DTOs\Tags\CreateTagDTO;
use App\Domain\Exceptions\InvalidTag;
use App\Domain\Models\Tag;

final readonly class CreateTagAction
{
    /**
     * @throws InvalidTag
     */
    public function execute(CreateTagData $data): Tag
    {
        $tagDTO = new CreateTagDTO(
            name: $data->name,
            isActive: $data->isActive,
            module: $data->module,
            color: $data->color,
        );

        $tag = Tag::register($tagDTO);
        $tag->save();

        return $tag;
    }
}
