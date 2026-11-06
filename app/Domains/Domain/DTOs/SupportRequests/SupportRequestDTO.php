<?php

declare(strict_types=1);

namespace App\Domains\Domain\DTOs\SupportRequests;

use App\Domains\Domain\Enums\SupportRequests\SupportDiagnosisStatus;
use App\Domains\Domain\Enums\SupportRequests\SupportRequestReasonType;
use App\Domains\Domain\Enums\SupportRequests\SupportRequestStatus;
use App\Domains\Domain\Enums\SupportRequests\SupportRequesterRole;

final readonly class SupportRequestDTO
{
    /** @param list<string> $requestedSupports */
    public function __construct(
        public string $requestDate,
        public string $requesterName,
        public SupportRequesterRole $requesterRole,
        public ?string $requesterOther,
        public ?string $requesterContact,
        public ?string $reason,
        public ?string $schoolDifficulties,
        public SupportDiagnosisStatus $diagnosisStatus,
        public ?string $diagnosisNotes,
        public array $requestedSupports,
        public ?string $otherSupport,
        public SupportRequestStatus $status,
        public ?string $analysisNotes,
        public ?string $referrals,
        public SupportRequestReasonType $reasonType = SupportRequestReasonType::OTHER,
    ) {}

    /** @return array<string, mixed> */
    public function attributes(): array
    {
        return [
            'request_date' => $this->requestDate,
            'requester_name' => $this->requesterName,
            'requester_role' => $this->requesterRole->value,
            'requester_other' => $this->requesterRole === SupportRequesterRole::OTHER ? $this->requesterOther : null,
            'requester_contact' => $this->requesterContact,
            'reason_type' => $this->reasonType->value,
            'reason' => $this->reason,
            'school_difficulties' => $this->schoolDifficulties,
            'diagnosis_status' => $this->diagnosisStatus->value,
            'diagnosis_notes' => $this->diagnosisNotes,
            'requested_supports' => $this->requestedSupports,
            'other_support' => in_array('other', $this->requestedSupports, true) ? $this->otherSupport : null,
            'status' => $this->status->value,
            'analysis_notes' => $this->analysisNotes,
            'referrals' => $this->referrals,
        ];
    }
}
