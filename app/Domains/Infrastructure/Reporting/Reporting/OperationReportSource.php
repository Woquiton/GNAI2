<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Reporting;

use App\Domains\Domain\DTOs\Reporting\ReportFilterDefinitionDTO;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Domain\Enums\Reporting\ReportOperator;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;
use App\Domains\Application\Queries\Semesters\OperationsInSemesterQuery;
use App\Domains\Domain\Models\Semesters\Semester;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/** Semestre de origem persistido, inclusive a ausência de vínculo nos dados antigos. */
abstract class OperationReportSource extends EloquentReportSource
{
    public function filters(): array
    {
        $filters = parent::filters();
        $model = $this->model();
        if (! defined($model.'::SEMESTER_DATE') && $this->semesterPath() === 'semester_id') {
            return $filters;
        }
        $options = Semester::query()->whereNotNull('start_date')->whereNotNull('end_date')
            ->orderByDesc('year')->orderByDesc('term')->pluck('label', 'id')->all();
        $modes = ['started' => 'Início no semestre'];
        if ((new $model)->getTable() === 'publications') {
            $modes = ['started' => 'Publicação no semestre', 'scheduled' => 'Evento realizado no semestre'];
        }
        if (in_array((new $model)->getTable(), ['loans', 'waitlists', 'pendencies'], true)) {
            $modes += ['active' => 'Em andamento durante o semestre', 'ended' => 'Encerramento no semestre'];
        }
        foreach ($modes as $mode => $label) {
            $filters[] = new ReportFilterDefinitionDTO(
                key: 'period_'.$mode,
                label: $label,
                type: ReportColumnType::SELECT,
                operators: [ReportOperator::EQUALS],
                options: $options,
            );
        }

        return $filters;
    }

    public function relationFilters(string $parentModel, string $relationName): array
    {
        // Filtros cronológicos não são colunas de cada linha de uma relação expandida.
        return array_values(array_filter(parent::relationFilters($parentModel, $relationName),
            fn ($filter): bool => ! str_starts_with($filter->key, 'period_')));
    }

    protected function semesterPath(): string
    {
        return 'semester_id';
    }

    protected function semesterDefinition(): array
    {
        return [
            'label' => 'Semestre de origem',
            'path' => $this->semesterPath(),
            'type' => ReportColumnType::SELECT,
            'options' => ['unassigned' => 'Sem vínculo: revisar calendário'] + Semester::query()
                ->orderByDesc('year')->orderByDesc('term')->pluck('label', 'id')->all(),
        ];
    }

    public function applyFilter(Builder $query, string $field, string $operator, mixed $value): void
    {
        if (str_starts_with($field, 'period_')) {
            $mode = substr($field, strlen('period_'));
            $segments = explode('.', $this->semesterPath());
            array_pop($segments);
            $apply = fn (Builder $part) => app(OperationsInSemesterQuery::class)->apply($part, (string) $value, $mode);
            if ($segments === []) {
                $apply($query);
            } else {
                $query->whereHas(implode('.', $segments), $apply);
            }

            return;
        }
        if ($field !== 'origin_semester') {
            parent::applyFilter($query, $field, $operator, $value);

            return;
        }

        $segments = explode('.', $this->semesterPath());
        $column = array_pop($segments);
        $apply = static function (Builder $related) use ($column, $operator, $value): void {
            $column = $related->getModel()->qualifyColumn($column);
            if ($value === 'unassigned') {
                $related->whereNull($column, 'and', $operator === '!=');
            } elseif ($operator === '!=') {
                $related->where(fn (Builder $part) => $part->whereNull($column)->orWhere($column, '!=', $value));
            } else {
                $related->where($column, $operator, $value);
            }
        };
        if ($segments === []) {
            $apply($query);
        } else {
            $query->whereHas(implode('.', $segments), $apply);
        }
    }

    public function value(Model $model, string $column): mixed
    {
        return $column === 'origin_semester'
            ? (data_get($model, $this->semesterPath()) ?? 'unassigned')
            : parent::value($model, $column);
    }
}
