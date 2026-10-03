<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\AcceptanceStatus;
use App\Enums\SpecializedEducationalSupport\CaseStudyStatus;
use App\Enums\SpecializedEducationalSupport\DemandOrigin;
use App\Models\Traits\Auditable;
use App\Models\Traits\Reportable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CaseStudy extends Model
{
    use HasFactory, Reportable, Auditable;

    protected $fillable = [
        'student_id',
        'creator_id',
        'semester_id',
        'version',
        'is_current',
        'status',
        'demand_origin',
        'participants_summary',
        'student_observation',
        'student_family_listening',
        'teachers_listening',
        'other_info',
        'care_network_notes',
        'favorable_aspects',
        'potentials_interests',
        'needed_supports',
        'needed_supports_justification',
        'acceptance_status',
        'acceptance_date',
        'completed_at',
    ];

    protected $casts = [
        'status' => CaseStudyStatus::class,
        'demand_origin' => DemandOrigin::class,
        'acceptance_status' => AcceptanceStatus::class,
        'needed_supports' => 'array',
        'is_current' => 'boolean',
        'acceptance_date' => 'date',
        'completed_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Reportable
    |--------------------------------------------------------------------------
    */

    public static function getReportLabel(): string
    {
        return 'Estudos de Caso';
    }

    public static function getReportColumns(): array
    {
        return [
            'id',
            'version',
            'status',
            'demand_origin',
            'acceptance_status',
            'created_at',
            'creator.name',
        ];
    }

    public static function getReportColumnLabels(): array
    {
        return [
            'id' => 'ID do Estudo de Caso',
            'version' => 'Versão',
            'status' => 'Situação',
            'demand_origin' => 'Origem da Demanda',
            'acceptance_status' => 'Aceite',
            'created_at' => 'Data de Criação',
            'creator.name' => 'Criado por',
        ];
    }

    public static function getEmbeddedRelations(): array
    {
        return ['creator'];
    }

    /*
    |--------------------------------------------------------------------------
    | Relacionamentos
    |--------------------------------------------------------------------------
    */

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function barriers(): HasMany
    {
        return $this->hasMany(CaseStudyBarrier::class);
    }

    public function strategies(): HasMany
    {
        return $this->hasMany(CaseStudyStrategy::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(CaseStudyContribution::class)->orderBy('created_at');
    }

    public function paees(): HasMany
    {
        return $this->hasMany(Paee::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeStudent($query, ?int $studentId)
    {
        if (!$studentId) {
            return $query;
        }

        return $query->where('student_id', $studentId);
    }

    public function scopeCurrent($query, bool $onlyCurrent = true)
    {
        if (!$onlyCurrent) {
            return $query;
        }

        return $query->where('is_current', true);
    }

    public function scopeStatus($query, $status)
    {
        if (!$status) {
            return $query;
        }

        return $query->where('status', $status instanceof CaseStudyStatus ? $status->value : $status);
    }

    /*
    |--------------------------------------------------------------------------
    | Guards de Domínio
    |--------------------------------------------------------------------------
    */

    public function ensureCanBeEdited(): void
    {
        if ($this->status === CaseStudyStatus::COMPLETED) {
            throw new \DomainException('Este Estudo de Caso já foi concluído e não pode mais ser editado. Gere uma nova versão para revisá-lo.');
        }
    }

    public function ensureIsOwner(): void
    {
        if ((int) $this->creator_id !== (int) auth()->id()) {
            throw new \DomainException('Acesso negado: apenas o criador deste Estudo de Caso pode realizar esta ação.');
        }
    }
}
