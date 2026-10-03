<?php

namespace App\Http\Requests\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\AttendanceFormat;
use App\Enums\SpecializedEducationalSupport\AttendanceLocation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attendance_frequency_per_week' => ['required', 'integer', 'min:1', 'max:255'],
            'attendance_duration_minutes' => ['required', 'integer', 'min:1'],
            'attendance_format' => ['required', Rule::enum(AttendanceFormat::class)],
            'attendance_location' => ['required', Rule::enum(AttendanceLocation::class)],

            'assistive_technology_needed' => ['nullable', 'boolean'],
            'assistive_technology_notes' => ['nullable', 'string', 'required_if:assistive_technology_needed,1'],

            'support_professional_needed' => ['nullable', 'boolean'],
            'support_professional_justification' => ['nullable', 'string', 'required_if:support_professional_needed,1'],

            'school_professionals_orientation' => ['nullable', 'string'],
            'common_teachers_articulation' => ['nullable', 'string'],
            'family_articulation' => ['nullable', 'string'],
            'intersectoral_articulation' => ['nullable', 'string'],
            'training_demands' => ['nullable', 'string'],

            'objectives' => ['required', 'array', 'min:1'],
            'objectives.*.description' => ['required', 'string'],
            'objectives.*.term' => ['required', 'string'],
            'objectives.*.linked_barrier_id' => ['nullable', 'integer'],

            'resources' => ['nullable', 'array'],
            'resources.*.description' => ['required_with:resources', 'string'],
            'resources.*.acquisition_type' => ['required_with:resources', 'string'],
            'resources.*.assistive_technology_id' => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'attendance_frequency_per_week.required' => 'Informe a frequência semanal de atendimento.',
            'attendance_duration_minutes.required' => 'Informe a duração do atendimento em minutos.',
            'attendance_format.required' => 'Informe o formato do atendimento.',
            'attendance_location.required' => 'Informe o local do atendimento.',
            'assistive_technology_notes.required_if' => 'Descreva a necessidade de tecnologia assistiva.',
            'support_professional_justification.required_if' => 'Justifique a necessidade de profissional de apoio.',
            'objectives.required' => 'Cadastre ao menos um objetivo.',
            'objectives.min' => 'Cadastre ao menos um objetivo.',
        ];
    }
}
