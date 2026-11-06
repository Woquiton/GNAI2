<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\SupportRequests;

use App\Domains\Domain\DTOs\SupportRequests\SupportRequestDTO;
use App\Domains\Domain\Enums\SupportRequests\RequestedSupport;
use App\Domains\Domain\Enums\SupportRequests\SupportDiagnosisStatus;
use App\Domains\Domain\Enums\SupportRequests\SupportRequestReasonType;
use App\Domains\Domain\Enums\SupportRequests\SupportRequestStatus;
use App\Domains\Domain\Enums\SupportRequests\SupportRequesterRole;
use App\Domains\Domain\Models\SupportRequests\SupportRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
abstract class SupportRequestData extends Data
{
    /**
     * @param  list<int|string>  $reasonProfileIds
     * @param  list<string>  $requestedSupports
     * @param  list<UploadedFile>  $attachments
     * @param  list<int|string>  $removeAttachmentIds
     */
    public function __construct(
        public int $studentId,
        public string $requestDate,
        public string $requesterName,
        public SupportRequesterRole $requesterRole,
        public ?string $reason = null,
        public ?string $requesterOther = null,
        public ?string $requesterContact = null,
        public ?string $schoolDifficulties = null,
        public SupportDiagnosisStatus $diagnosisStatus = SupportDiagnosisStatus::NOT_INFORMED,
        public ?string $diagnosisNotes = null,
        public array $requestedSupports = [],
        public ?string $otherSupport = null,
        public SupportRequestStatus $status = SupportRequestStatus::RECEIVED,
        public ?string $analysisNotes = null,
        public ?string $referrals = null,
        public array $attachments = [],
        public array $removeAttachmentIds = [],
        public ?int $courseId = null,
        public SupportRequestReasonType $reasonType = SupportRequestReasonType::OTHER,
        public array $reasonProfileIds = [],
    ) {}

    public static function rules(): array
    {
        $record = request()->route('supportRequest');
        $studentRules = ['required', 'integer', 'exists:students,id'];
        if ($record instanceof SupportRequest) {
            $studentRules[] = Rule::in([$record->student_id]);
        }

        return [
            'student_id' => $studentRules,
            'course_id' => [
                'nullable',
                'integer',
                Rule::exists('courses', 'id')->where(function ($query) use ($record): void {
                    $query->where('is_active', true);
                    if ($record instanceof SupportRequest && $record->course_id !== null) {
                        $query->orWhere('id', $record->course_id);
                    }
                }),
            ],
            'request_date' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'requester_name' => ['required', 'string', 'max:255'],
            'requester_role' => ['required', Rule::enum(SupportRequesterRole::class)],
            'requester_other' => ['nullable', 'required_if:requester_role,other', 'string', 'max:150'],
            'requester_contact' => ['nullable', 'string', 'max:255'],
            'reason_type' => ['required', Rule::enum(SupportRequestReasonType::class)],
            'reason_profile_ids' => ['exclude_unless:reason_type,profile', 'required_if:reason_type,profile', 'array', 'list', 'min:1'],
            'reason_profile_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('deficiencies', 'id')->where(function ($query) use ($record): void {
                    $query->where('is_active', true);
                    if ($record instanceof SupportRequest) {
                        $query->orWhereIn('id', $record->reasonProfiles()->pluck('deficiencies.id'));
                    }
                }),
            ],
            'reason' => ['nullable', 'required_if:reason_type,other', 'string', 'max:10000'],
            'school_difficulties' => ['nullable', 'string', 'max:10000'],
            'diagnosis_status' => ['sometimes', Rule::enum(SupportDiagnosisStatus::class)],
            'diagnosis_notes' => ['nullable', 'string', 'max:5000'],
            'requested_supports' => ['sometimes', 'array', 'list', 'max:8'],
            'requested_supports.*' => ['string', Rule::enum(RequestedSupport::class), 'distinct'],
            'other_support' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', Rule::enum(SupportRequestStatus::class)],
            'analysis_notes' => ['nullable', 'string', 'max:10000'],
            'referrals' => ['nullable', 'string', 'max:10000'],
            'attachments' => ['sometimes', 'array', 'list', 'max:10'],
            'attachments.*' => ['required', 'file', 'mimes:pdf,doc,docx,odt,jpg,jpeg,png', 'max:10240'],
            'remove_attachment_ids' => ['sometimes', 'array', 'list', 'max:10'],
            'remove_attachment_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('support_request_attachments', 'id')
                    ->where('support_request_id', $record instanceof SupportRequest ? $record->id : 0),
            ],
        ];
    }

    public static function attributes(): array
    {
        return [
            'student_id' => 'aluno',
            'request_date' => 'data da solicitação',
            'requester_name' => 'nome do solicitante', 'requester_role' => 'vínculo do solicitante',
            'requester_other' => 'outro vínculo', 'requester_contact' => 'contato do solicitante',
            'course_id' => 'curso',
            'reason_type' => 'motivo da solicitação',
            'reason_profile_ids' => 'perfis de atendimento',
            'reason_profile_ids.*' => 'perfil de atendimento',
            'reason' => 'descrição do motivo', 'school_difficulties' => 'dificuldades escolares',
            'diagnosis_status' => 'situação diagnóstica', 'diagnosis_notes' => 'observações',
            'requested_supports' => 'apoios solicitados', 'other_support' => 'outro apoio',
            'status' => 'situação', 'analysis_notes' => 'análise inicial', 'referrals' => 'encaminhamentos',
            'attachments' => 'anexos', 'remove_attachment_ids' => 'anexos para remoção',
            'requested_supports.*' => 'apoio solicitado',
        ];
    }

    public static function messages(): array
    {
        return [
            'enum' => 'Selecione uma opção válida para :attribute.',
            'array' => 'Informe uma lista válida em :attribute.',
            'list' => 'Informe uma lista válida em :attribute.',
            'request_date.date_format' => 'Informe uma data válida para a solicitação.',
            'attachments.*.file' => 'Selecione um arquivo válido.',
            'required' => 'Preencha o campo :attribute.',
            'string' => 'Informe um texto válido em :attribute.',
            'max' => 'O campo :attribute deve ter no máximo :max caracteres.',
            'student_id.exists' => 'Selecione um aluno cadastrado.',
            'course_id.exists' => 'Selecione um curso ativo cadastrado.',
            'student_id.in' => 'O aluno de uma solicitação existente não pode ser alterado.',
            'request_date.before_or_equal' => 'A data da solicitação não pode estar no futuro.',
            'requester_other.required_if' => 'Informe o vínculo do solicitante.',
            'reason.required_if' => 'Descreva brevemente o motivo da solicitação.',
            'reason_profile_ids.required_if' => 'Selecione ao menos um perfil de atendimento.',
            'reason_profile_ids.min' => 'Selecione ao menos um perfil de atendimento.',
            'reason_profile_ids.*.exists' => 'Selecione um perfil de atendimento ativo cadastrado.',
            'requested_supports.max' => 'Selecione no máximo 8 apoios.',
            'remove_attachment_ids.max' => 'Selecione no máximo 10 anexos para remover.',
            'attachments.max' => 'Envie no máximo 10 anexos.',
            'attachments.*.mimes' => 'Use PDF, DOC, DOCX, ODT, JPG ou PNG.',
            'attachments.*.max' => 'Cada anexo pode ter no máximo 10 MB.',
            'attachments.*.uploaded' => 'Não foi possível enviar o anexo. Confira o tamanho do arquivo.',
            'remove_attachment_ids.*.exists' => 'O anexo selecionado não pertence a esta solicitação.',
        ];
    }

    public function dto(): SupportRequestDTO
    {
        return new SupportRequestDTO(
            requestDate: $this->requestDate,
            requesterName: $this->requesterName,
            requesterRole: $this->requesterRole,
            requesterOther: $this->requesterOther,
            requesterContact: $this->requesterContact,
            reason: $this->reason,
            reasonType: $this->reasonType,
            schoolDifficulties: $this->schoolDifficulties,
            diagnosisStatus: $this->diagnosisStatus,
            diagnosisNotes: $this->diagnosisNotes,
            requestedSupports: $this->requestedSupports,
            otherSupport: $this->otherSupport,
            status: $this->status,
            analysisNotes: $this->analysisNotes,
            referrals: $this->referrals,
        );
    }
}
