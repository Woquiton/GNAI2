<?php

declare(strict_types=1);

namespace App\Application\Actions\SupportRequests;

use App\Application\Data\SupportRequests\CreateSupportRequestData;
use App\Domain\Enums\SupportRequestReasonType;
use App\Domain\Exceptions\InvalidSupportRequest;
use App\Domain\Models\Course;
use App\Domain\Models\Deficiency;
use App\Domain\Models\Student;
use App\Domain\Models\SupportRequest;
use App\Infrastructure\Storage\SupportRequestAttachmentStorage;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class CreateSupportRequestAction
{
    public function __construct(
        private SupportRequestAttachmentStorage $storage,
    ) {}

    /** @throws Throwable */
    public function execute(CreateSupportRequestData $data, int $creatorId): SupportRequest
    {
        $stored = $this->storage->storeMany($data->attachments, $data->studentId);

        try {
            return DB::transaction(function () use ($data, $creatorId, $stored): SupportRequest {
                $student = Student::query()->lockForUpdate()->findOrFail($data->studentId);
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

                $supportRequest = SupportRequest::register($student, $creatorId, $data->dto());
                $supportRequest->assignCourse($course);
                $supportRequest->save();
                $supportRequest->syncReasonProfiles($profiles);
                $supportRequest->attachments()->createMany($stored);

                return $supportRequest;
            });
        } catch (Throwable $exception) {
            $this->storage->deleteManyQuietly(array_column($stored, 'file_path'));

            throw $exception;
        }
    }
}
