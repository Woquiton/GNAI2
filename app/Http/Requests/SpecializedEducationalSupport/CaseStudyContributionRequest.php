<?php

namespace App\Http\Requests\SpecializedEducationalSupport;

use Illuminate\Foundation\Http\FormRequest;

class CaseStudyContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => 'Informe o papel/função de quem está contribuindo.',
            'content.required' => 'Escreva o conteúdo da contribuição.',
        ];
    }
}
