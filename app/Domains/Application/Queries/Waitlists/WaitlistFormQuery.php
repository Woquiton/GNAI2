<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Waitlists;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Enums\Items\ItemType;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use Illuminate\Support\Collection;

final class WaitlistFormQuery
{
    /**
     * @return array<string, mixed>
     */
    public function forCreation(?User $authUser = null): array
    {
        return $this->baseOptions() + [
            'itemTypes' => ItemType::options(),
            'items' => $this->waitlistableItems(),
            'authUser' => $authUser,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function forUpdate(Waitlist $waitlist, ?User $authUser = null): array
    {
        $waitlist->loadMissing([
            'waitlistable',
            'student.person',
            'professional.person',
            'user',
        ]);

        return $this->baseOptions($waitlist->student_id) + [
            'waitlist' => $waitlist,
            'statusLabel' => $waitlist->status->label(),
            'authUser' => $authUser,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function baseOptions(?int $existingStudentId = null): array
    {
        return [
            'students' => Student::query()
                ->where(function ($query) use ($existingStudentId): void {
                    $query->where('status', '!=', StudentStatus::INTAKE->value);
                    if ($existingStudentId !== null) {
                        $query->orWhere('id', $existingStudentId);
                    }
                })
                ->with('person:id,name')
                ->get(['id', 'person_id', 'registration'])
                ->sortBy('person.name')
                ->mapWithKeys(
                    static fn (Student $student): array => [
                        $student->id => trim(
                            ($student->person?->name ?? 'Sem nome')
                            .' ('.$student->registration.')',
                        ),
                    ],
                ),
            'professionals' => Professional::query()
                ->with('person:id,name')
                ->get(['id', 'person_id'])
                ->sortBy('person.name')
                ->mapWithKeys(
                    static fn (Professional $professional): array => [
                        $professional->id => $professional->person?->name ?? 'Sem nome',
                    ],
                ),
        ];
    }

    /**
     * @return Collection<int, Item>
     */
    private function waitlistableItems(): Collection
    {
        return Item::query()
            ->where('is_active', true)
            ->where('is_loanable', true)
            ->where('is_digital', false)
            ->orderBy('name')
            ->get()
            ->filter(
                static fn (Item $item): bool => (
                    $item->quantity_available <= 0 || $item->status->blocksLoan()
                ),
            )
            ->values();
    }
}
