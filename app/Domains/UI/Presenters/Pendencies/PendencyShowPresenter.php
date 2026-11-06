<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Pendencies;

use App\Domains\Domain\Models\Pendencies\Pendency;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Http\Request;

final class PendencyShowPresenter
{
    /**
     * @return array<string, mixed>
     */
    public function present(Pendency $pendency, Request $request): array
    {
        $user = $request->user();
        $canUpdate = $user?->can('pendency.update') ?? false;

        return [
            'pendency' => [
                'id' => $pendency->id,
                'title' => $pendency->title,
                'description' => $pendency->description,
                'description_html' => RichTextSanitizer::sanitize((string) ($pendency->description ?: 'Não informado')),
                'priority_label' => $pendency->priority?->label(),
                'priority_color' => $pendency->priority?->color(),
                'due_date' => $pendency->due_date_formatted,
                'is_completed' => (bool) $pendency->is_completed,
                'assigned_name' => $pendency->assignedProfessional?->person?->name ?? ('#'.$pendency->assigned_to),
                'creator_name' => $pendency->creator?->name ?? ('#'.$pendency->created_by),
                'created_at' => $pendency->created_at_formatted,
                'updated_at' => $pendency->updated_at_formatted,
            ],
            'can' => [
                'edit' => $canUpdate,
                'complete' => $canUpdate && $pendency->canBeCompletedByCurrentUser(),
                'delete' => $user?->can('pendency.delete') ?? false,
            ],
        ];
    }
}
