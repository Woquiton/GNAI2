<?php

declare(strict_types=1);

namespace App\Application\Queries\Students;

use App\Domain\Models\Loan;
use App\Domain\Models\Student;
use Illuminate\Database\Eloquent\Collection;

/** Empréstimos de itens do Radar em que o aluno é o beneficiário, do mais recente ao mais antigo. */
final class StudentLoansQuery
{
    /** @return Collection<int, Loan> */
    public function execute(Student $student): Collection
    {
        return Loan::query()
            ->with([
                'loanable',
                'student:id,person_id,registration',
                'student.person:id,name',
                // O LoanPresenter também lê o profissional; carregá-lo aqui evita uma consulta por linha.
                'professional:id,person_id,registration',
                'professional.person:id,name',
                'user:id,name',
            ])
            ->where('student_id', $student->getKey())
            ->orderByDesc('loan_date')
            ->orderByDesc('id')
            ->get();
    }
}
