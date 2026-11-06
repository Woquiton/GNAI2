<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domain\DTOs\Semesters\CreateSemesterDTO;
use App\Domain\DTOs\Semesters\UpdateSemesterDTO;
use App\Domain\Exceptions\InvalidSemester;
use Carbon\CarbonImmutable;
use Database\Factories\SemesterFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[UseFactory(SemesterFactory::class)]
final class Semester extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    protected $table = 'semesters';

    protected $fillable = [
        'year',
        'term',
        'label',
        'start_date',
        'end_date',
        'is_current',
    ];

    protected $casts = [
        'year' => 'integer',
        'term' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    public static function auditType(): string
    {
        return 'semester';
    }

    public static function auditLabel(): string
    {
        return 'Semestre';
    }

    public static function auditedFields(): array
    {
        return [
            'year' => AuditedField::text('Ano Letivo'),
            'term' => AuditedField::number('Período'),
            'start_date' => AuditedField::date('Data de Início'),
            'end_date' => AuditedField::date('Data de Término'),
            'is_current' => AuditedField::boolean('Semestre atual'),
        ];
    }

    /** O rótulo é derivado de ano e período ("2026.1"). */
    public static function unauditedFields(): array
    {
        return ['label'];
    }

    public function auditDescription(): string
    {
        return 'o semestre '.($this->label ?? "{$this->year}.{$this->term}");
    }

    /**
     * @throws InvalidSemester
     */
    public static function register(CreateSemesterDTO $data): self
    {
        return new self(self::attributesFrom($data));
    }

    /**
     * @throws InvalidSemester
     */
    public function revise(UpdateSemesterDTO $data): void
    {
        $this->fill(self::attributesFrom($data, $this->getKey()));
    }

    /** Indica se este semestre vem antes do informado, pela ordem de ano e período. */
    public function isBefore(self $other): bool
    {
        return $this->year < $other->year
            || ($this->year === $other->year && $this->term < $other->term);
    }

    public function markAsCurrent(): void
    {
        $this->is_current = true;
    }

    public function markAsHistorical(): void
    {
        $this->is_current = false;
    }

    public static function markCurrentAsHistorical(?self $except = null): void
    {
        self::query()
            ->where('is_current', true)
            ->when($except !== null, fn ($query) => $query->whereKeyNot($except->getKey()))
            ->lockForUpdate()
            ->get()
            ->each(function (self $semester): void {
                $semester->markAsHistorical();
                $semester->save();
            });
    }

    /**
     * @throws InvalidSemester
     */
    public function ensureCanBeDeleted(bool $hasLinkedRecords): void
    {
        if ($this->is_current) {
            throw new InvalidSemester(
                'Não é possível excluir o semestre atual do sistema.'
            );
        }

        if ($hasLinkedRecords) {
            throw new InvalidSemester(
                'Este semestre possui registros vinculados e não pode ser excluído.'
            );
        }
    }

    public function studentDocuments(): HasMany
    {
        return $this->hasMany(StudentDocument::class, 'semester_id');
    }

    public function peis(): HasMany
    {
        return $this->hasMany(Pei::class, 'semester_id');
    }

    /**
     * @return array<string, int|string|bool|null>
     *
     * @throws InvalidSemester
     */
    private static function attributesFrom(CreateSemesterDTO|UpdateSemesterDTO $data, ?int $exceptId = null): array
    {
        self::ensureValidPeriod(
            year: $data->year,
            term: $data->term,
            startDate: $data->startDate,
            endDate: $data->endDate,
        );

        if (self::query()
            ->when($exceptId !== null, fn ($query) => $query->whereKeyNot($exceptId))
            ->where('start_date', '<=', $data->endDate)
            ->where('end_date', '>=', $data->startDate)
            ->exists()) {
            throw new InvalidSemester('As datas deste semestre se sobrepõem às de outro semestre cadastrado.');
        }

        return [
            'year' => $data->year,
            'term' => $data->term,
            'label' => "{$data->year}.{$data->term}",
            'start_date' => self::normalizeDate($data->startDate),
            'end_date' => self::normalizeDate($data->endDate),
            'is_current' => $data->isCurrent,
        ];
    }

    /**
     * @throws InvalidSemester
     */
    private static function ensureValidPeriod(int $year, int $term, ?string $startDate, ?string $endDate): void
    {
        if ($year < 1901 || $year > 2155) {
            throw new InvalidSemester('O ano letivo deve estar entre 1901 e 2155.');
        }

        if (! in_array($term, [1, 2], true)) {
            throw new InvalidSemester('O período letivo deve ser o primeiro ou o segundo semestre.');
        }

        if ($startDate === null || $endDate === null) {
            throw new InvalidSemester('Informe as datas de início e término do semestre.');
        }

        if ($startDate !== null && CarbonImmutable::parse($endDate)->lt(CarbonImmutable::parse($startDate))) {
            throw new InvalidSemester('A data de término não pode ser anterior à data de início.');
        }
    }

    private static function normalizeDate(?string $date): ?string
    {
        return $date === null
            ? null
            : CarbonImmutable::parse($date)->toDateString();
    }
}
