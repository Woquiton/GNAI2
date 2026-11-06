<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Tags;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Notifications\EmailMailboxState;
use App\Domains\Domain\Models\Publications\Publication;
use App\Domains\Domain\DTOs\Tags\CreateTagDTO;
use App\Domains\Domain\DTOs\Tags\UpdateTagDTO;
use App\Domains\Domain\Enums\Tags\TagModule;
use Database\Factories\TagFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[UseFactory(TagFactory::class)]
final class Tag extends Model implements Auditable
{
    use AuditsChanges;
    use HasFactory;

    protected $table = 'tags';

    protected $fillable = [
        'name',
        'is_active',
        'module',
        'color',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'module' => TagModule::class,
    ];

    protected $appends = ['module_label'];

    protected function moduleLabel(): Attribute
    {
        return Attribute::get(fn (): string => $this->module?->label() ?? 'Não informado');
    }

    public static function auditType(): string
    {
        return 'tag';
    }

    public static function auditLabel(): string
    {
        return 'Etiqueta';
    }

    public static function auditedFields(): array
    {
        return [
            'name' => AuditedField::text('Nome da Etiqueta'),
            'is_active' => AuditedField::boolean('Etiqueta Ativa'),
            'module' => AuditedField::enum('Módulo', TagModule::class),
            'color' => AuditedField::text('Cor'),
        ];
    }

    public function auditDescription(): string
    {
        return "a etiqueta {$this->name}";
    }

    public static function register(CreateTagDTO $data): self
    {
        return new self([
            'name' => self::normalizeName($data->name),
            'is_active' => $data->isActive,
            'module' => $data->module,
            'color' => strtolower($data->color),
        ]);
    }

    public function revise(UpdateTagDTO $data): void
    {
        $this->fill([
            'name' => self::normalizeName($data->name),
            'is_active' => $data->isActive,
            'module' => $data->module,
            'color' => strtolower($data->color),
        ]);
    }

    public function publications(): BelongsToMany
    {
        return $this->belongsToMany(
            Publication::class,
            'publication_tag',
            'tag_id',
            'publication_id',
        );
    }

    public function mailboxStates(): HasMany
    {
        return $this->hasMany(EmailMailboxState::class, 'tag_id');
    }

    private static function normalizeName(string $name): string
    {
        return trim($name);
    }
}
