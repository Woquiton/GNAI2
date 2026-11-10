<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Profiles;

use App\Domains\Application\Data\People\Concerns\NormalizesPersonInput;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdateTeacherProfileData extends Data
{
    use NormalizesPersonInput;

    public function __construct(
        public string $name,
        public ?UploadedFile $photo = null,
        public bool $removePhoto = false,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'remove_photo' => ['sometimes', 'boolean'],
        ];
    }

    public static function messages(): array
    {
        return UpdateProfileData::messages();
    }
}
