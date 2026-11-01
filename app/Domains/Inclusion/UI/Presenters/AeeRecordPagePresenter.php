<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\UI\Presenters;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Domain\Models\AeeRecord;
use App\Domains\Inclusion\Domain\Models\AeeStudentEvaluation;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

final class AeeRecordPagePresenter
{
    private const RECORD_RICH_TEXT = [
        'activities_performed',
        'strategies_used',
        'resources_used',
        'general_observations',
    ];

    private const EVALUATION_RICH_TEXT = [
        'absence_reason',
        'student_participation',
        'adaptations_made',
        'development_evaluation',
        'progress_indicators',
        'recommendations',
        'next_session_adjustments',
    ];

    /**
     * @param  array<string, mixed>  $filterOptions
     * @param  list<string>  $filterKeys
     * @return array<string, mixed>
     */
    public function listing(array $filterOptions, User $user, Request $request, array $filterKeys): array
    {
        return $filterOptions + [
            'filters' => collect($filterKeys)
                ->mapWithKeys(fn (string $key): array => [$key => (string) $request->query($key, '')])
                ->all(),
            'can' => [
                'view' => $user->can('aee-record.view'),
                'view_all' => $user->can('aee-record.view-all'),
                'view_own' => $user->can('aee-record.view-own'),
            ],
        ];
    }

    /**
     * @param  LengthAwarePaginator<int, AeeStudentEvaluation>  $aeeEvaluations
     * @param  array<string, mixed>  $filterOptions
     * @return array<string, mixed>
     */
    public function studentIndex(Student $student, LengthAwarePaginator $aeeEvaluations, array $filterOptions, User $user, Request $request): array
    {
        $professionalId = $user->professional_id;
        $aeeEvaluations->getCollection()->each(static function (AeeStudentEvaluation $evaluation) use ($professionalId): void {
            $evaluation->setAttribute(
                'can_manage',
                $professionalId !== null
                    && (int) $evaluation->aeeRecord?->attendanceSession?->professional_id === (int) $professionalId,
            );
        });

        return [
            'can' => [
                'view' => $user->can('aee-record.view'),
                'update' => $user->can('aee-record.update'),
                'delete' => $user->can('aee-record.delete'),
                'view_all' => $user->can('aee-record.view-all'),
            ],
            'student' => $student,
            'aeeEvaluations' => $aeeEvaluations,
        ] + $this->listing($filterOptions, $user, $request, ['professional_id', 'is_present']);
    }

    /**
     * Permissão da ação e autoria do profissional vinculado ao agendamento, como no legado.
     *
     * @return array{update: bool, delete: bool}
     */
    public function managementAbilities(User $user, int $sessionProfessionalId): array
    {
        $isOwner = $user->professional_id !== null && (int) $user->professional_id === $sessionProfessionalId;

        return [
            'update' => $isOwner && $user->can('aee-record.update'),
            'delete' => $isOwner && $user->can('aee-record.delete'),
        ];
    }

    /**
     * Registro completo para a visualização: os textos ricos do registro e das avaliações
     * carregadas são substituídos pelo HTML sanitizado (vazio vira `null`).
     */
    public function displayRecord(AeeRecord $aeeRecord): AeeRecord
    {
        $this->sanitizeRichText($aeeRecord, self::RECORD_RICH_TEXT);

        if ($aeeRecord->relationLoaded('studentEvaluations')) {
            $aeeRecord->studentEvaluations->each(
                fn (AeeStudentEvaluation $evaluation) => $this->sanitizeRichText($evaluation, self::EVALUATION_RICH_TEXT),
            );
        }

        return $aeeRecord;
    }

    /** Avaliação do aluno para a visualização, com os textos ricos dela e do registro sanitizados. */
    public function displayEvaluation(AeeStudentEvaluation $evaluation): AeeStudentEvaluation
    {
        $this->sanitizeRichText($evaluation, self::EVALUATION_RICH_TEXT);
        $this->sanitizeRecordContext($evaluation->aeeRecord);

        return $evaluation;
    }

    /**
     * Contexto somente leitura da edição pelo prontuário: o registro e o objetivo do agendamento
     * são sanitizados; os textos da própria avaliação permanecem crus para o editor.
     */
    public function displayEditContext(AeeStudentEvaluation $evaluation): AeeStudentEvaluation
    {
        $this->sanitizeRecordContext($evaluation->aeeRecord);

        return $evaluation;
    }

    private function sanitizeRecordContext(AeeRecord $aeeRecord): void
    {
        $this->sanitizeRichText($aeeRecord, self::RECORD_RICH_TEXT);

        if ($aeeRecord->relationLoaded('attendanceSession') && $aeeRecord->attendanceSession !== null) {
            $this->sanitizeRichText($aeeRecord->attendanceSession, ['session_objective']);
        }
    }

    /**
     * Atributos alterados apenas para a resposta; o modelo não é salvo.
     *
     * @param  list<string>  $attributes
     */
    private function sanitizeRichText(Model $model, array $attributes): void
    {
        foreach ($attributes as $attribute) {
            $html = RichTextSanitizer::sanitize((string) $model->getAttribute($attribute));
            $empty = RichTextSanitizer::toPlainText($html) === '' && ! str_contains($html, '<img');

            $model->setAttribute($attribute, $empty ? null : $html);
        }
    }
}
