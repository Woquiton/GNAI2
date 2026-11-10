<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Notifications\PeiDisciplines;

use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use Illuminate\Notifications\Notification;

final class PeiDisciplineNotification extends Notification
{
    public function __construct(
        private readonly PeiDiscipline $adaptation,
        private readonly string $event,
        private readonly int $days = 0,
    ) {}

    public function via(mixed $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(mixed $notifiable): array
    {
        $record = $this->adaptation->loadMissing(['discipline', 'teacher.person', 'pei.student.person']);
        $teacher = $record->teacher?->person?->name ?? 'O professor responsável';
        $discipline = $record->discipline?->name ?? 'Disciplina';
        $student = $record->pei->student->person?->name ?? 'Estudante';
        $subject = "a adaptação de {$discipline} para {$student}";

        [$title, $message] = match ($this->event) {
            'first_fill' => ['Adaptação iniciada', "{$teacher} começou a preencher {$subject}. Confira o planejamento."],
            'updated' => ['Adaptação atualizada', "{$teacher} alterou {$subject}. Confira as mudanças e o histórico de revisões."],
            'pending' => ['Adaptação aguardando preenchimento', "{$teacher} ainda não preencheu {$subject}, criada há {$this->days} dias. Combine o preenchimento com o professor ou encerre os lembretes se não forem mais necessários."],
        };

        return [
            'pei_discipline_id' => $record->getKey(),
            'pei_id' => $record->pei_id,
            'event' => $this->event,
            'days_pending' => $this->days,
            'title' => $title,
            'message' => $message,
            'url' => route('specialized-educational-support.pei-discipline.show', [$record->pei_id, $record->getKey()], absolute: false),
        ];
    }
}
