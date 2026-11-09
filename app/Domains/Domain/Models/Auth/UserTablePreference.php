<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Preferência de uma tela para um usuário: `per_page` e `view_mode` na chave da rota e
 * `columns` (id da coluna => visível) na chave `rota#tabela`.
 * A chave `appearance` guarda `primary_palette`, a paleta primária do usuário.
 */
final class UserTablePreference extends Model
{
    /** Quantidades oferecidas no rodapé das listagens. */
    public const PAGE_SIZES = [10, 12, 24, 25, 48, 50, 96, 100];

    public const DEFAULT_PAGE_SIZE = 10;

    protected $fillable = [
        'user_id',
        'table_key',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public static function isPageSize(mixed $value): bool
    {
        return in_array($value, self::PAGE_SIZES, true);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
