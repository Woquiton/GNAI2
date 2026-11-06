<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\SupportRequests;

use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Application\Data\SupportRequests\UpdateSupportRequestData;
use App\Domains\Domain\Enums\SupportRequests\SupportRequestReasonType;
use App\Domains\Domain\Exceptions\SupportRequests\InvalidSupportRequest;
use App\Domains\Domain\Models\SupportRequests\SupportRequest;
use App\Domains\Infrastructure\Storage\SupportRequests\SupportRequestAttachmentStorage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

final readonly class UpdateSupportRequestAction
{
    public function __construct(
        private SupportRequestAttachmentStorage $storage,
    ) {}

    /** @throws Throwable */
    public function execute(SupportRequest $supportRequest, UpdateSupportRequestData $data): SupportRequest
    {
        $stored = $this->storage->storeMany($data->attachments, (int) $supportRequest->student_id);
        $obsolete = [];

        try {
            $saved = DB::transaction(function () use ($supportRequest, $data, $stored, &$obsolete): SupportRequest {
                Student::query()->lockForUpdate()->findOrFail($data->studentId);
                $locked = SupportRequest::query()->lockForUpdate()->findOrFail($supportRequest->getKey());
                if ((int) $locked->student_id !== $data->studentId) {
                    throw new InvalidSupportRequest('O aluno da solicitação não pode ser alterado.');
                }
                $course = $data->courseId === null
                    ? null
                    : Course::query()->lockForUpdate()->findOrFail($data->courseId);
                $profileIds = $data->reasonType === SupportRequestReasonType::PROFILE
                    ? array_map('intval', $data->reasonProfileIds)
                    : [];
                $profiles = Deficiency::query()->whereIn('id', $profileIds)
                    ->orderBy('id')->lockForUpdate()->get();
                if ($profiles->count() !== count($profileIds)) {
                    throw new InvalidSupportRequest('Um dos perfis de atendimento selecionados não está mais disponível.');
                }

                $attachments = $locked->attachments()->get();
                $removals = $attachments->whereIn('id', $data->removeAttachmentIds);
                if ($attachments->count() - $removals->count() + count($stored) > 10) {
                    throw ValidationException::withMessages(['attachments' => 'Uma solicitação pode ter no máximo 10 anexos.']);
                }

                $locked->revise($data->dto());
                $locked->assignCourse($course);
                $locked->save();
                $locked->syncReasonProfiles($profiles);
                foreach ($removals as $attachment) {
                    $obsolete[] = $attachment->file_path;
                    $attachment->delete();
                }
                $locked->attachments()->createMany($stored);

                return $locked;
            });
        } catch (Throwable $exception) {
            $this->storage->deleteManyQuietly(array_column($stored, 'file_path'));

            throw $exception;
        }

        $this->storage->deleteManyQuietly($obsolete);

        return $saved;
    }
}
