<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\Items;

use App\Domains\Inclusion\Domain\Models\Item;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

final class ShowItemQuery
{
    public function execute(Item $item): Item
    {
        return $item->load([
            'deficiencies' => static function (BelongsToMany $query): void {
                $query->orderBy('name');
            },
            'accessibilityFeatures' => static function (BelongsToMany $query): void {
                $query->orderBy('name');
            },
            'inspections' => static function (MorphMany $query): void {
                $query
                    ->with('evidences')
                    ->orderByDesc('inspection_date')
                    ->orderByDesc('created_at');
            },
            // Histórico de empréstimos com os beneficiários, do mais recente ao mais antigo.
            'loans' => static function (MorphMany $query): void {
                $query
                    ->with([
                        'student:id,person_id,registration',
                        'student.person:id,name',
                        'professional:id,person_id,registration',
                        'professional.person:id,name',
                        'user:id,name',
                    ])
                    ->orderByDesc('loan_date')
                    ->orderByDesc('id');
            },
        ]);
    }
}
