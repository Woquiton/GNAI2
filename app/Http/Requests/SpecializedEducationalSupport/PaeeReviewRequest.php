<?php

namespace App\Http\Requests\SpecializedEducationalSupport;

use Illuminate\Foundation\Http\FormRequest;

class PaeeReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reviewed_at' => ['required', 'date'],
            'what_changed' => ['required', 'string'],
            'why' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'reviewed_at.required' => 'Informe a data da revisão.',
            'what_changed.required' => 'Descreva o que foi alterado.',
            'why.required' => 'Descreva o motivo da revisão.',
        ];
    }
}
