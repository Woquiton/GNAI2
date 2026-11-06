<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Sessions;

use App\Domains\Domain\Enums\Sessions\AttendanceType;
use App\Domains\Domain\Enums\Sessions\SessionOrigin;
use App\Domains\Domain\Enums\Sessions\SessionStatus;
use App\Domains\Domain\Enums\Sessions\SessionType;
use App\Domains\Domain\Models\Sessions\Session;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Carbon\Carbon;
use Illuminate\Http\Request;

final class SessionShowPresenter
{
    /**
     * @return array<string, mixed>
     */
    public function present(Session $session, Request $request): array
    {
        $user = $request->user();
        $isScheduled = SessionStatus::isScheduledValue($session->status);
        $isCreator = $user !== null && (int) $user->getAuthIdentifier() === (int) $session->creator_id;
        $isResponsibleProfessional = $user?->professional?->id !== null
            && (int) $user->professional->id === (int) $session->professional_id;
        $dateHasArrived = $session->session_date !== null && $session->sessionDateHasArrived();
        $dateIsUpcoming = $session->session_date !== null && $session->sessionDateIsUpcoming();
        $can = fn (string $ability): bool => $user?->can($ability) ?? false;

        return [
            'session' => [
                'id' => $session->id,
                'student_names' => $session->students
                    ->map(fn ($student): string => $student->person?->name ?? 'Aluno')
                    ->values()
                    ->all(),
                'professional_name' => $session->professional?->person?->name ?? 'Profissional',
                'status_label' => SessionStatus::labelFor($session->status),
                'status_color' => SessionStatus::colorFor($session->status),
                'is_scheduled' => $isScheduled,
                'session_date' => $session->session_date?->toDateString(),
                'start_time' => $this->time($session->start_time),
                'end_time' => $this->time($session->end_time),
                'location' => $session->location,
                'attendance_type_label' => AttendanceType::labelFor($session->attendance_type),
                'type_label' => SessionType::labelFor($session->type),
                'origin_label' => ($session->origin ?? SessionOrigin::SCHEDULING)->label(),
                'session_objective' => $session->session_objective,
                'session_objective_html' => RichTextSanitizer::sanitize((string) $session->session_objective),
                'cancellation_reason' => $session->cancellation_reason,
            ],
            'record' => $this->record($session, $can, $isResponsibleProfessional && $isScheduled && $dateHasArrived
                && ! $session->students->contains(fn ($student): bool => $student->status === StudentStatus::INTAKE)),
            'can' => [
                'edit' => $can('session.update') && $isScheduled && $isCreator,
                'cancel' => $can('session.update') && $isScheduled && $dateIsUpcoming && $isCreator,
                // Somente quem criou o agendamento pode excluí-lo (DeleteSessionAction).
                'delete' => $can('session.delete') && $isCreator,
            ],
            'backUrl' => $user?->is_admin
                ? route('specialized-educational-support.sessions.index')
                : route('specialized-educational-support.sessions.my-sessions'),
        ];
    }

    /**
     * @param  callable(string): bool  $can
     * @return array{kind: string, show_url: ?string, pdf_url: ?string, create_url: ?string}|null
     */
    private function record(Session $session, callable $can, bool $canCreateForSession): ?array
    {
        if (AttendanceType::isAee($session->attendance_type)) {
            $record = $session->aeeRecord;

            return [
                'kind' => 'aee',
                'show_url' => $record && $can('aee-record.view')
                    ? route('specialized-educational-support.aee-records.show', $record->id)
                    : null,
                'pdf_url' => null,
                'create_url' => ! $record && $canCreateForSession && $can('aee-record.create')
                    ? route('specialized-educational-support.aee-records.create', $session->id)
                    : null,
            ];
        }

        if (AttendanceType::isPedagogical($session->attendance_type)) {
            $record = $session->pedagogicalRecord;
            $canView = $record && $can('pedagogical-record.view');

            return [
                'kind' => 'pedagogical',
                'show_url' => $canView
                    ? route('specialized-educational-support.pedagogical-records.show', $record)
                    : null,
                'pdf_url' => $canView
                    ? route('specialized-educational-support.pedagogical-records.pdf', $record)
                    : null,
                'create_url' => ! $record && $canCreateForSession && $can('pedagogical-record.create')
                    ? route('specialized-educational-support.pedagogical-records.create', $session)
                    : null,
            ];
        }

        return null;
    }

    private function time(mixed $value): ?string
    {
        return $value === null || $value === '' ? null : Carbon::parse($value)->format('H:i');
    }
}
