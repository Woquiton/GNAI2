<?php

declare(strict_types=1);

namespace App\Domains\Dashboard\Application\Queries;

use App\Domains\Inclusion\Domain\Enums\Priority;
use App\Domains\Inclusion\Domain\Enums\SessionStatus;
use App\Domains\Inclusion\Domain\Models\Course;
use App\Domains\Inclusion\Domain\Models\Pei;
use App\Domains\Inclusion\Domain\Models\Pendency;
use App\Domains\Inclusion\Domain\Models\Professional;
use App\Domains\Inclusion\Domain\Models\Session;
use App\Domains\Inclusion\Domain\Models\Student;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

final readonly class SpecializedEducationalSupportDashboardQuery
{
    /**
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        return [
            'totalStudents' => $this->totalStudents(),
            'totalSessions' => $this->totalSessions(),
            'totalPeis' => $this->totalPeis(),
            'totalProfessionals' => $this->totalProfessionals(),
            'totalCourses' => $this->totalCourses(),
            'totalPeisFinished' => $this->totalFinishedPeis(),
            'totalPeisNotFinished' => $this->totalUnfinishedPeis(),
            'totalPendingPendencies' => $this->totalPendingPendencies(),
            'totalOverduePendencies' => $this->totalOverduePendencies(),
            'pendenciesByPriority' => $this->pendenciesByPriority(),
            'sessionsByStatus' => $this->sessionsByStatus(),
            'sessionsByMonth' => $this->sessionsByMonth(),
        ];
    }

    private function totalStudents(): int
    {
        return Student::count();
    }

    private function totalSessions(): int
    {
        return Session::count();
    }

    private function totalPeis(): int
    {
        return Pei::count();
    }

    private function totalProfessionals(): int
    {
        return Professional::count();
    }

    private function totalCourses(): int
    {
        return Course::count();
    }

    private function totalFinishedPeis(): int
    {
        return Pei::where('is_finished', true)->count();
    }

    private function totalUnfinishedPeis(): int
    {
        return Pei::where('is_finished', false)->count();
    }

    private function totalPendingPendencies(): int
    {
        return Pendency::query()
            ->where('is_completed', false)
            ->count();
    }

    private function totalOverduePendencies(): int
    {
        return Pendency::query()
            ->where('is_completed', false)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', today())
            ->count();
    }

    /**
     * @return Collection<int, array{label: string, color: string, count: int}>
     */
    private function pendenciesByPriority(): Collection
    {
        return collect(Priority::cases())
            ->map(fn (Priority $priority): array => [
                'label' => $priority->label(),
                'color' => $priority->color(),
                'count' => Pendency::query()
                    ->where('is_completed', false)
                    ->where('priority', $priority->value)
                    ->count(),
            ])
            ->values();
    }

    /**
     * @return Collection<int, array{label: string, color: string, count: int}>
     */
    private function sessionsByStatus(): Collection
    {
        return collect(SessionStatus::options())
            ->map(fn (string $label, string $status): array => [
                'label' => $label,
                'color' => SessionStatus::colorFor($status),
                'count' => Session::where('status', $status)->count(),
            ])
            ->values();
    }

    /**
     * Agendamentos dos últimos seis meses, incluindo o atual, por mês da data do agendamento e status.
     *
     * @return list<array{month: string, completed: int, cancelled: int, scheduled: int}>
     */
    private function sessionsByMonth(): array
    {
        $firstMonth = CarbonImmutable::today()->startOfMonth()->subMonths(5);
        $months = [];

        for ($offset = 0; $offset < 6; $offset++) {
            $month = $firstMonth->addMonths($offset)->format('Y-m');
            $months[$month] = [
                'month' => $month,
                'completed' => 0,
                'cancelled' => 0,
                'scheduled' => 0,
            ];
        }

        $sessions = Session::query()
            ->whereBetween('session_date', [$firstMonth->toDateString(), $firstMonth->addMonths(6)->subDay()->toDateString()])
            ->toBase()
            ->get(['session_date', 'status']);

        foreach ($sessions as $session) {
            $month = substr((string) $session->session_date, 0, 7);
            $status = SessionStatus::fromDatabaseValue($session->status)?->value;

            if ($status !== null && isset($months[$month])) {
                $months[$month][$status]++;
            }
        }

        return array_values($months);
    }
}
