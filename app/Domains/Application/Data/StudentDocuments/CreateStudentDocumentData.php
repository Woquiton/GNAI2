<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\StudentDocuments;

use App\Domains\Domain\Enums\StudentDocuments\StudentDocumentType;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class CreateStudentDocumentData extends Data
{
    public function __construct(
        public string $title,
        public StudentDocumentType $type,
        public UploadedFile $file,
        public ?string $customType = null,
        public bool $showInTeacherPortal = false,
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        if (isset($properties['custom_type']) && is_string($properties['custom_type'])) {
            $properties['custom_type'] = preg_replace('/\s+/u', ' ', trim($properties['custom_type']));
        }

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(StudentDocumentType::class)],
            'show_in_teacher_portal' => ['sometimes', 'boolean'],
            'custom_type' => ['nullable', 'string', 'max:100', 'exclude_unless:type,other'],
            'file' => [
                'required',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
                'max:10240',
            ],
        ];
    }

    public static function messages(): array
    {
        return [
            'title.required' => 'O título do documento é obrigatório.',
            'title.string' => 'O título do documento deve ser um texto válido.',
            'title.max' => 'O título do documento não pode ultrapassar 255 caracteres.',
            'type.required' => 'O tipo do documento é obrigatório.',
            'type.enum' => 'O tipo de documento selecionado é inválido.',
            'show_in_teacher_portal.boolean' => 'Informe se o documento deve aparecer no portal do professor.',
            'file.required' => 'Selecione o arquivo do documento.',
            'custom_type.string' => 'O nome do tipo deve ser um texto válido.',
            'custom_type.max' => 'O nome do tipo não pode ultrapassar 100 caracteres.',
            'file.file' => 'O arquivo enviado é inválido.',
            'file.mimes' => 'O arquivo deve estar no formato PDF, DOC, DOCX, JPG, JPEG ou PNG.',
            'file.max' => 'O arquivo não pode ultrapassar 10 MB.',
        ];
    }
}
