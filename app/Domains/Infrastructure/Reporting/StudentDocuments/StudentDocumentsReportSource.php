<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\StudentDocuments;

use App\Domains\Application\Queries\StudentDocuments\StudentDocumentCustomTypesQuery;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;
use App\Domains\Domain\Enums\StudentDocuments\StudentDocumentType;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final class StudentDocumentsReportSource extends EloquentReportSource
{
    /** @var array<string, string>|null */
    private ?array $typeOptions = null;

    public function key(): string
    {
        return 'specialized-support.student-documents';
    }

    public function label(): string
    {
        return 'Documentos dos alunos';
    }

    protected function model(): string
    {
        return StudentDocument::class;
    }

    protected function with(): array
    {
        return ['student.person', 'semester', 'uploader'];
    }

    protected function definitions(): array
    {
        if ($this->typeOptions === null) {
            $this->typeOptions = $this->enumOptions(StudentDocumentType::class);
            foreach (app(StudentDocumentCustomTypesQuery::class)->execute() as $name) {
                $this->typeOptions['custom:'.$name] = $name;
            }
        }

        return [
            'student' => ['label' => 'Aluno', 'path' => 'student.person.name'],
            'title' => ['label' => 'Título'],
            'type' => ['label' => 'Tipo', 'type' => ReportColumnType::SELECT, 'options' => $this->typeOptions],
            'original_name' => ['label' => 'Nome do arquivo'], 'mime_type' => ['label' => 'Formato'],
            'file_size' => ['label' => 'Tamanho (bytes)'],
            'semester' => ['label' => 'Semestre', 'path' => 'semester.label'],
            'uploader' => ['label' => 'Enviado por', 'path' => 'uploader.name'],
            'created_at' => ['label' => 'Enviado em', 'type' => ReportColumnType::DATE],
        ];
    }

    protected function filterable(): array
    {
        return ['student', 'title', 'type', 'semester', 'uploader', 'created_at'];
    }

    public function applyFilter(Builder $query, string $field, string $operator, mixed $value): void
    {
        if ($field !== 'type' || ! is_string($value) || ! str_starts_with($value, 'custom:')) {
            parent::applyFilter($query, $field, $operator, $value);

            return;
        }

        $name = substr($value, strlen('custom:'));
        $typeColumn = $query->getModel()->qualifyColumn('type');
        $nameColumn = $query->getModel()->qualifyColumn('custom_type');

        if ($operator === '!=') {
            $query->where(fn (Builder $part) => $part
                ->where($typeColumn, '!=', StudentDocumentType::OTHER->value)
                ->orWhereNull($nameColumn)
                ->orWhere($nameColumn, '!=', $name));
        } else {
            $query->where($typeColumn, StudentDocumentType::OTHER->value)
                ->where($nameColumn, '=', $name);
        }
    }

    public function value(Model $model, string $column): mixed
    {
        if (
            $column === 'type' && $model instanceof StudentDocument
            && $model->type === StudentDocumentType::OTHER && filled($model->custom_type)
        ) {
            return 'custom:'.$model->custom_type;
        }

        return parent::value($model, $column);
    }
}
