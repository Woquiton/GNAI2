<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Sessions\Concerns;

/**
 * Regras do cabeçalho de um atendimento registrado sem agendamento prévio (ou corrigido na edição
 * do registro): as mesmas do agendamento, sem datas futuras, porque o atendimento já aconteceu.
 */
trait ValidatesAttendanceDetails
{
    /** @return array<string, list<string>> */
    protected static function attendanceDetailsRules(): array
    {
        return [
            'session_date' => ['required', 'date', 'before_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'location' => ['required', 'string', 'max:255'],
        ];
    }

    /** @return array<string, list<string>> */
    protected static function attendanceStudentsRules(): array
    {
        return [
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['integer', 'distinct', 'exists:students,id'],
        ];
    }

    /** @return array<string, string> */
    protected static function attendanceDetailsMessages(): array
    {
        return [
            'session_date.required' => 'A data do atendimento é obrigatória.',
            'session_date.date' => 'A data do atendimento deve ser válida.',
            'session_date.before_or_equal' => 'A data do atendimento não pode ser futura.',
            'start_time.required' => 'O horário de início é obrigatório.',
            'start_time.date_format' => 'O horário de início deve estar no formato HH:MM.',
            'end_time.date_format' => 'O horário de término deve estar no formato HH:MM.',
            'end_time.after' => 'O horário de término deve ser após o início.',
            'location.required' => 'O local do atendimento é obrigatório.',
            'location.string' => 'O local do atendimento deve ser um texto válido.',
            'location.max' => 'O local do atendimento não pode ultrapassar 255 caracteres.',
            'student_ids.required' => 'Selecione ao menos um aluno.',
            'student_ids.array' => 'Os alunos do atendimento devem ser informados em uma lista válida.',
            'student_ids.min' => 'Selecione ao menos um aluno.',
            'student_ids.*.distinct' => 'O mesmo aluno não pode aparecer mais de uma vez.',
            'student_ids.*.exists' => 'Um dos alunos informados não existe.',
        ];
    }
}
