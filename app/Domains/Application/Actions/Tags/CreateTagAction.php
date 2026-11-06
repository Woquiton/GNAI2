<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Tags;

use App\Domains\Application\Data\Tags\CreateTagData;
use App\Domains\Domain\DTOs\Tags\CreateTagDTO;
use App\Domains\Domain\Exceptions\Tags\InvalidTag;
use App\Domains\Domain\Models\Tags\Tag;

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
