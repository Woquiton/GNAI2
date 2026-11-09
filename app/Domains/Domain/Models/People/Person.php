<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\People;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\DTOs\People\CreatePersonDTO;
use App\Domains\Domain\DTOs\People\UpdatePersonDTO;
use App\Domains\Domain\Enums\People\Gender;
use App\Domains\Domain\Enums\People\PersonRole;
use App\Domains\Domain\Exceptions\People\InvalidPerson;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\Models\Tags\Tag;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Domain\ValueObjects\People\Cpf;
use App\Domains\Domain\ValueObjects\People\Phone;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use Carbon\CarbonImmutable;
use Database\Factories\PersonFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Throwable;

#[UseFactory(PersonFactory::class)]
final class Person extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    protected $table = 'people';

    protected $fillable = [
        'name',
        'document',
        'birth_date',
        'gender',
        'email',
        'phone',
        'address',
        'photo',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'gender' => Gender::class,
    ];

    public static function auditType(): string
    {
        return 'person';
    }

    public static function auditLabel(): string
    {
        return 'Pessoa';
    }

    public static function auditedFields(): array
    {
        return [
            'name' => AuditedField::text('Nome'),
            'document' => AuditedField::text('CPF'),
            'birth_date' => AuditedField::date('Data de Nascimento'),
            'gender' => AuditedField::enum('Gênero', Gender::class),
            'email' => AuditedField::text('E-mail'),
            'phone' => AuditedField::text('Telefone'),
            'address' => AuditedField::richText('Endereço'),
            'photo' => AuditedField::file('Foto'),
        ];
    }

    public function auditDescription(): string
    {
        return 'a pessoa '.($this->name ?? "#{$this->getKey()}");
    }

    /**
     * @throws InvalidPerson
     */
    public static function register(CreatePersonDTO $data): self
    {
        return new self(self::attributesFrom($data));
    }

    /**
     * @throws InvalidPerson
     */
    public function revise(UpdatePersonDTO $data): void
    {
        $this->fill(self::attributesFrom($data));
    }

    public function getGenderLabelAttribute(): string
    {
        return $this->gender->label();
    }

    public function getPhotoUrlAttribute(): string
    {
        return $this->photo
            ? asset('storage/'.$this->photo)
            : asset('images/default-user.jpg');
    }

    public function hasRole(PersonRole $role): bool
    {
        $record = $this->{$role->relationName()};

        return $role === PersonRole::GUARDIAN ? $record->isNotEmpty() : $record !== null;
    }

    /** @return list<PersonRole> */
    public function registeredRoles(): array
    {
        return array_values(array_filter(
            PersonRole::cases(),
            fn (PersonRole $role): bool => $this->hasRole($role),
        ));
    }

    /** @param list<string> $roles */
    public function ensureRolesArePreserved(array $roles): void
    {
        foreach ($this->registeredRoles() as $role) {
            if (! in_array($role->value, $roles, true)) {
                throw new InvalidPerson('Para remover um papel, use a exclusão do respectivo cadastro, que verifica seus vínculos e históricos.');
            }
        }
    }

    /** @param list<int> $studentIds */
    public function ensureGuardianLinksArePreserved(array $studentIds): void
    {
        if ($this->guardians->pluck('student_id')->diff($studentIds)->isNotEmpty()) {
            throw new InvalidPerson('Remova vínculos de responsáveis pelo cadastro do aluno, preservando as verificações de histórico.');
        }
    }

    public function ensureHasSingleAccessAccount(int $accountCount): void
    {
        if ($accountCount > 1) {
            throw new InvalidPerson('Esta pessoa possui duas contas de acesso. Unifique os acessos antes de alterar o cadastro central.');
        }
    }

    /** @param iterable<Tag> $tags */
    public function ensureConventionalTagsCanBeAssigned(iterable $tags): void
    {
        $assignedIds = $this->tags->modelKeys();
        foreach ($tags as $tag) {
            $tag->ensureCanBeAppliedToPerson(in_array($tag->getKey(), $assignedIds, true));
        }
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'person_tag');
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class, 'person_id');
    }

    public function professional(): HasOne
    {
        return $this->hasOne(Professional::class, 'person_id');
    }

    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class, 'person_id');
    }

    public function guardians(): HasMany
    {
        return $this->hasMany(Guardian::class, 'person_id');
    }

    protected function document(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => self::formatDocument($value),
            set: fn (?string $value): ?string => Cpf::fromNullable($value)?->value(),
        );
    }

    protected function phone(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value): ?string => self::formatPhone($value),
            set: fn (?string $value): ?string => Phone::fromNullable($value)?->value(),
        );
    }

    /**
     * @return array<string, string|null>
     *
     * @throws InvalidPerson
     */
    private static function attributesFrom(CreatePersonDTO|UpdatePersonDTO $data): array
    {
        return [
            'name' => self::normalizeName($data->name),
            'document' => $data->document?->value(),
            'birth_date' => self::normalizeBirthDate($data->birthDate),
            'gender' => $data->gender->value,
            'email' => self::normalizeEmail($data->email),
            'phone' => $data->phone?->value(),
            'address' => self::normalizeNullableText($data->address),
            'photo' => self::normalizePhoto($data->photo),
        ];
    }

    /**
     * @throws InvalidPerson
     */
    private static function normalizeName(string $name): string
    {
        $name = trim($name);
        $length = mb_strlen($name);

        if ($length < 3) {
            throw new InvalidPerson('O nome deve ter ao menos 3 caracteres.');
        }

        if ($length > 255) {
            throw new InvalidPerson('O nome não pode ultrapassar 255 caracteres.');
        }

        return $name;
    }

    /**
     * @throws InvalidPerson
     */
    private static function normalizeBirthDate(string $birthDate): string
    {
        try {
            $date = CarbonImmutable::parse($birthDate)->startOfDay();
        } catch (Throwable) {
            throw new InvalidPerson('A data de nascimento deve ser válida.');
        }

        if ($date->isFuture()) {
            throw new InvalidPerson('A data de nascimento não pode estar no futuro.');
        }

        return $date->toDateString();
    }

    /**
     * @throws InvalidPerson
     */
    private static function normalizeEmail(?string $email): ?string
    {
        $email = self::normalizeNullableText($email);

        if ($email === null) {
            return null;
        }

        $email = mb_strtolower($email);

        if (mb_strlen($email) > 255 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidPerson('O e-mail deve ser válido.');
        }

        return $email;
    }

    private static function normalizeNullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private static function formatDocument(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $digits = preg_replace('/\D/', '', $value) ?? '';

        return preg_replace(
            '/(\d{3})(\d{3})(\d{3})(\d{2})/',
            '$1.$2.$3-$4',
            $digits,
        ) ?? $digits;
    }

    private static function formatPhone(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $digits = preg_replace('/\D/', '', $value) ?? '';

        if (strlen($digits) === 11) {
            return preg_replace(
                '/(\d{2})(\d{5})(\d{4})/',
                '($1) $2-$3',
                $digits,
            ) ?? $digits;
        }

        if (strlen($digits) === 10) {
            return preg_replace(
                '/(\d{2})(\d{4})(\d{4})/',
                '($1) $2-$3',
                $digits,
            ) ?? $digits;
        }

        return $digits;
    }

    /**
     * @throws InvalidPerson
     */
    private static function normalizePhoto(?string $photo): ?string
    {
        $photo = self::normalizeNullableText($photo);

        if ($photo !== null && mb_strlen($photo) > 255) {
            throw new InvalidPerson('O caminho da foto não pode ultrapassar 255 caracteres.');
        }

        return $photo;
    }
}
