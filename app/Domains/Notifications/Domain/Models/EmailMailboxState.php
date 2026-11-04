<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\Models;

use App\Domains\Inclusion\Domain\Models\Tag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class EmailMailboxState extends Model
{
    protected $guarded = ['id'];

    protected $casts = ['starred' => 'boolean', 'is_read' => 'boolean'];

    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}
