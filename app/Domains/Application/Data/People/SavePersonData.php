<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\People;

use App\Domains\Application\Data\People\Concerns\NormalizesPersonInput;
use App\Domains\Application\Queries\People\PersonAccessAccountsQuery;
use App\Domains\Application\Rules\People\ValidCpf;
use App\Domains\Domain\Enums\Guardians\GuardianRelationship;
use App\Domains\Domain\Enums\People\Gender;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Enums\Professionals\ProfessionalStatus;
use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\People\Person;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class SavePersonData extends Data
{
    use NormalizesPersonInput;

    public function __construct(
        public string $name,
        public string $birthDate,
        public Gender $gender,
        public array $roles = [],
        public array $details = [],
        public array $tagIds = [],
        public ?string $document = null,
        public ?string $email = null,
        public ?string $phone = null,
        public ?string $address = null,
        public ?UploadedFile $photo = null,
        public bool $removePhoto = false,
    ) {}

    public static function messages(): array
    {
        return [
            'details.*.registration.required' => 'A matrícula é obrigatória para este papel.',
            'details.*.registration.unique' => 'Esta matrícula já está em uso neste cadastro.',
            'details.*.entry_date.after_or_equal' => 'O ingresso não pode ser anterior ao nascimento.',
            'details.student.follow_up_type.required' => 'Selecione o tipo de acompanhamento do aluno ativo.',
            'details.guardian.links.required' => 'Adicione ao menos um aluno para o responsável.',
            'details.guardian.links.*.student_id.distinct' => 'Este aluno foi selecionado mais de uma vez.',
            'details.guardian.links.*.student_id.required' => 'Selecione o aluno.',
            'details.guardian.links.*.relationship.required' => 'Selecione o parentesco ou vínculo.',
            'tag_ids.*.exists' => 'Selecione uma etiqueta convencional ativa do módulo Pessoas.',
        ];
    }

    public static function rules(): array
    {
        $person = request()->route('person');
        $person = $person instanceof Person ? $person : null;
        $roles = (array) request()->input('roles', []);
        $rules = [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'gender' => ['required', Rule::enum(Gender::class)],
            'document' => ['nullable', 'string', new ValidCpf, Rule::unique('people', 'document')->ignore($person?->id)],
            'email' => [Rule::requiredIf(count(array_intersect($roles, ['student', 'teacher', 'professional'])) > 0), 'nullable', 'email:rfc', 'max:255'],
            'phone' => [Rule::requiredIf(in_array('guardian', $roles, true)), 'nullable', 'digits_between:10,11'],
            'address' => ['nullable', 'string', 'max:500'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'remove_photo' => ['boolean'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['required', 'distinct', Rule::enum(PersonRole::class)],
            'details' => ['array'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer', 'distinct', Rule::exists('tags', 'id')->where('module', 'people')->whereNull('system_key')->where(fn ($query) => $query->where('is_active', true)->orWhereIn('id', $person?->tags()->pluck('tags.id')->all() ?? []))],
        ];
        foreach (['student' => 'students', 'teacher' => 'teachers', 'professional' => 'professionals'] as $role => $table) {
            if (! in_array($role, $roles, true)) {
                continue;
            }
            $rules["details.$role.registration"] = ['required', 'string', 'max:50', Rule::unique($table, 'registration')->ignore($person?->{$role}?->id)];
        }
        if (in_array('student', $roles, true)) {
            $rules['details.student.entry_date'] = ['nullable', 'date', 'after_or_equal:birth_date'];
            $rules['details.student.status'] = ['required', Rule::enum(StudentStatus::class)];
            $rules['details.student.follow_up_type'] = [Rule::requiredIf(request()->input('details.student.status') === 'active'), 'nullable', Rule::enum(StudentFollowUpType::class)];
        }
        if (in_array('professional', $roles, true)) {
            $rules['details.professional.position_id'] = ['required', 'integer', Rule::exists('positions', 'id')];
            $rules['details.professional.entry_date'] = ['required', 'date', 'after_or_equal:birth_date'];
            $rules['details.professional.status'] = ['required', Rule::enum(ProfessionalStatus::class)];
            $rules['details.professional.show_on_website'] = ['boolean'];
        }
        if (in_array('guardian', $roles, true)) {
            $rules['birth_date'][] = 'before:today';
            $rules['details.guardian.links'] = ['required', 'array', 'min:1'];
            $rules['details.guardian.links.*.student_id'] = ['required', 'integer', 'distinct', Rule::exists('students', 'id')];
            $rules['details.guardian.links.*.relationship'] = ['required', Rule::enum(GuardianRelationship::class)];
        }
        if (count(array_intersect($roles, ['teacher', 'professional'])) > 0) {
            $ids = $person
                ? app(PersonAccessAccountsQuery::class)->execute($person)->modelKeys()
                : [];
            $rules['email'][] = Rule::unique('people', 'email')->ignore($person?->id);
            $rules['email'][] = Rule::unique('users', 'email')->where(fn ($query) => $query->whereNotIn('id', $ids));
        }

        return $rules;
    }
}
