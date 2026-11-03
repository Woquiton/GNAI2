<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Inclusion\Domain\Enums\RequestedSupport;
use App\Domains\Inclusion\Domain\Models\SupportRequest;
use Illuminate\Http\Request;

final class SupportRequestPresenter
{
    public function permissions(Request $request): array
    {
        return [
            'view' => $request->user()?->can('support-request.view') ?? false,
            'create' => $request->user()?->can('support-request.create') && $request->user()?->can('support-request.view'),
            'update' => $request->user()?->can('support-request.update') && $request->user()?->can('support-request.view'),
            'delete' => $request->user()?->can('support-request.delete') && $request->user()?->can('support-request.view'),
        ];
    }

    public function summary(SupportRequest $record): array
    {
        return [
            'id' => $record->id,
            'student_id' => $record->student_id,
            'student_name' => $record->student->person->name,
            'registration' => $record->student->registration,
            'request_date' => $record->request_date->toDateString(),
            'request_date_label' => $record->request_date->format('d/m/Y'),
            'requester_name' => $record->requester_name,
            'requester_role' => $record->requester_role->value,
            'requester_role_label' => $record->requester_role->label(),
            'status' => $record->status->value,
            'status_label' => $record->status->label(),
            'created_by_name' => $record->creator?->name ?? 'Usuário removido',
            'created_at_label' => $record->created_at->format('d/m/Y H:i'),
            'updated_at_label' => $record->updated_at->format('d/m/Y H:i'),
        ];
    }

    public function details(SupportRequest $record): array
    {
        return [
            ...$this->summary($record),
            'course_id' => $record->course_id,
            'course_name' => $record->course?->name ?? $record->academic_context,
            'requester_other' => $record->requester_other,
            'requester_contact' => $record->requester_contact,
            'student_status_label' => $record->student->status->label(),
            'student_status_tone' => $record->student->status->color(),
            'student_contact' => $record->student->person->phone ?: $record->student->person->email,
            'courses' => $record->student->studentCourses->map(fn ($link) => $link->course?->name)->filter()->unique()->values()->all(),
            'reason_type' => $record->reason_type->value,
            'reason_type_label' => $record->reason_type->label(),
            'reason_profile_ids' => $record->reasonProfiles->map(fn ($profile): string => (string) $profile->id)->all(),
            'reason_profiles' => $record->reasonProfiles->map(fn ($profile): array => [
                'id' => $profile->id,
                'name' => $profile->name,
            ])->all(),
            'reason' => $record->reason,
            'school_difficulties' => $record->school_difficulties,
            'diagnosis_status' => $record->diagnosis_status->value,
            'diagnosis_status_label' => $record->diagnosis_status->label(),
            'diagnosis_notes' => $record->diagnosis_notes,
            'requested_supports' => $record->requested_supports ?? [],
            'requested_support_labels' => array_map(
                fn (string $value): string => RequestedSupport::from($value)->label(), $record->requested_supports ?? [],
            ),
            'other_support' => $record->other_support,
            'analysis_notes' => $record->analysis_notes,
            'referrals' => $record->referrals,
            'attachments' => $record->attachments->map(fn ($attachment): array => [
                'id' => $attachment->id,
                'name' => $attachment->original_name,
                'url' => route('specialized-educational-support.support-requests.attachment', [$record, $attachment]),
            ])->all(),
        ];
    }
}
