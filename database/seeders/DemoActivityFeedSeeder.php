<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Domain\Models\AeeStudentEvaluation;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;
use App\Shared\Domain\Models\AuditLog;
use Illuminate\Database\Seeder;

/**
 * Popula o feed de atividades com eventos retroativos simulados, só para
 * demonstração visual do dashboard. Não roda no seeder padrão do sistema
 * (DatabaseSeeder) — é disparado manualmente quando necessário.
 */
final class DemoActivityFeedSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::query()->limit(3)->get();

        if ($users->isEmpty()) {
            $this->command?->warn('Nenhum usuário encontrado — nada para simular.');

            return;
        }

        $events = [];

        foreach (CaseStudy::with('student.person')->get() as $caseStudy) {
            $events[] = ['model' => $caseStudy, 'label' => 'Estudo de Caso', 'student' => $caseStudy->student?->person?->name, 'detail' => null, 'action' => AuditLog::ACTION_CREATED, 'daysAgo' => random_int(10, 45)];
            $events[] = ['model' => $caseStudy, 'label' => 'Estudo de Caso', 'student' => $caseStudy->student?->person?->name, 'detail' => null, 'action' => AuditLog::ACTION_UPDATED, 'daysAgo' => random_int(1, 9)];
        }

        foreach (Paee::with('student.person')->get() as $paee) {
            $events[] = ['model' => $paee, 'label' => 'PAEE', 'student' => $paee->student?->person?->name, 'detail' => null, 'action' => AuditLog::ACTION_CREATED, 'daysAgo' => random_int(8, 40)];
            $events[] = ['model' => $paee, 'label' => 'PAEE', 'student' => $paee->student?->person?->name, 'detail' => null, 'action' => AuditLog::ACTION_UPDATED, 'daysAgo' => random_int(1, 7)];
        }

        foreach (PeiDiscipline::with(['pei.student.person', 'discipline'])->get() as $peiDiscipline) {
            $events[] = [
                'model' => $peiDiscipline,
                'label' => 'PEI',
                'student' => $peiDiscipline->pei?->student?->person?->name,
                'detail' => $peiDiscipline->discipline?->name,
                'action' => AuditLog::ACTION_CREATED,
                'daysAgo' => random_int(12, 50),
            ];
            $events[] = [
                'model' => $peiDiscipline,
                'label' => 'PEI',
                'student' => $peiDiscipline->pei?->student?->person?->name,
                'detail' => $peiDiscipline->discipline?->name,
                'action' => AuditLog::ACTION_UPDATED,
                'daysAgo' => random_int(1, 11),
            ];
        }

        foreach (AeeStudentEvaluation::with('student.person')->get() as $evaluation) {
            $events[] = ['model' => $evaluation, 'label' => 'Atendimento AEE', 'student' => $evaluation->student?->person?->name, 'detail' => null, 'action' => AuditLog::ACTION_CREATED, 'daysAgo' => random_int(5, 30)];
            $events[] = ['model' => $evaluation, 'label' => 'Atendimento AEE', 'student' => $evaluation->student?->person?->name, 'detail' => null, 'action' => AuditLog::ACTION_UPDATED, 'daysAgo' => random_int(1, 4)];
        }

        foreach ($events as $index => $event) {
            $createdAt = now()->subDays($event['daysAgo'])->subMinutes(random_int(0, 59))->subHours(random_int(0, 8));

            AuditLog::create([
                'user_id' => $users[$index % $users->count()]->getKey(),
                'action' => $event['action'],
                'auditable_type' => $event['model']::class,
                'auditable_id' => $event['model']->getKey(),
                'student_id' => $event['model'] instanceof PeiDiscipline ? $event['model']->pei?->student_id : $event['model']->student_id,
                'student_name' => $event['student'],
                'detail' => $event['detail'],
                'changes' => null,
                'ip_address' => '127.0.0.1',
                'created_at' => $createdAt,
            ]);
        }

        $this->command?->info(count($events).' eventos simulados criados no feed de atividades.');
    }
}
