<?php

declare(strict_types=1);

use App\Domains\Domain\Models\AeeRecords\AeeRecord;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Inspections\Inspection;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Domain\Models\PedagogicalRecords\PedagogicalRecord;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Models\Sessions\Session;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

// Read-only: validates the configured database against a manifest made during conversion.
$manifestPath = $argv[1] ?? null;
if ($manifestPath === null || ! is_file($manifestPath)) {
    fwrite(STDERR, "Usage: php scripts/backup/validate-restored-database.php manifest.json\n");
    exit(1);
}

$manifest = json_decode(file_get_contents($manifestPath), true, flags: JSON_THROW_ON_ERROR);
$db = DB::connection();
$schema = $db->getSchemaBuilder();
$failures = [];
$foreignKeys = 0;
$extraTables = array_diff($schema->getTableListing(schema: $db->getDatabaseName(), schemaQualified: false), array_keys($manifest['tables']));
foreach ($extraTables as $name) {
    $failures[] = "Unexpected legacy table: {$name}";
}

foreach ($manifest['tables'] as $name => $expected) {
    if (! $schema->hasTable($name)) {
        $failures[] = "Missing table: {$name}";

        continue;
    }

    $primary = collect($schema->getIndexes($name))->firstWhere('primary', true)['columns'] ?? [];
    $query = $db->table($name);
    foreach ($primary as $column) {
        $query->orderBy($column);
    }
    $rows = $query->get()->map(function (object $record): array {
        $row = (array) $record;
        ksort($row);

        return $row;
    })->all();
    $digest = hash('sha256', json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
    if (count($rows) !== $expected['count'] || ! hash_equals($expected['sha256'], $digest)) {
        $failures[] = "Data differs from converted backup: {$name}";
    }

    foreach ($schema->getForeignKeys($name) as $foreign) {
        $foreignKeys++;
        $query = $db->table($name.' as source')->leftJoin($foreign['foreign_table'].' as target', function ($join) use ($foreign): void {
            foreach ($foreign['columns'] as $position => $column) {
                $join->on('source.'.$column, '=', 'target.'.$foreign['foreign_columns'][$position]);
            }
        });
        foreach ($foreign['columns'] as $column) {
            $query->whereNotNull('source.'.$column);
        }
        if ($query->whereNull('target.'.$foreign['foreign_columns'][0])->exists()) {
            $failures[] = "Orphan foreign key: {$name}.{$foreign['name']}";
        }
    }
}

foreach (['loans' => 'loanable', 'waitlists' => 'waitlistable', 'inspections' => 'inspectable'] as $table => $prefix) {
    $morphs = $db->table($table)->distinct()->pluck($prefix.'_type');
    foreach ($morphs as $type) {
        $class = Relation::getMorphedModel($type) ?? $type;
        if (! is_string($class) || ! is_subclass_of($class, Model::class)) {
            $failures[] = "Unrecognized polymorphic type in {$table}";

            continue;
        }
        $target = (new $class)->getTable();
        if ($db->table($table)->where($prefix.'_type', $type)->whereNotIn($prefix.'_id', $db->table($target)->select('id'))->exists()) {
            $failures[] = "Orphan polymorphic relation: {$table}";
        }
    }
}

$expectedMigrations = array_map(fn (string $file): string => basename($file, '.php'), glob(database_path('migrations/*.php')));
$actualMigrations = $db->table('migrations')->orderBy('migration')->pluck('migration')->all();
sort($expectedMigrations);
if ($expectedMigrations !== $actualMigrations) {
    $failures[] = 'Migration ledger differs from the current migration files.';
}

foreach (['people' => ['photo', 'public'], 'student_documents' => ['file_path', 'local'], 'inspection_evidences' => ['path', 'public']] as $table => [$column, $disk]) {
    foreach ($db->table($table)->whereNotNull($column)->where($column, '!=', '')->pluck($column) as $path) {
        if (! Storage::disk($disk)->exists($path)) {
            $failures[] = "Missing attachment in {$table}";
        }
    }
}

foreach ([
    User::class,
    Person::class,
    Student::class,
    Professional::class,
    Item::class,
    Loan::class,
    Inspection::class,
    Session::class,
    AeeRecord::class,
    PedagogicalRecord::class,
    StudentDocument::class,
] as $class) {
    try {
        foreach ($class::query()->cursor() as $model) {
            $model->attributesToArray();
        }
    } catch (Throwable $exception) {
        $failures[] = 'Model hydration failed: '.$class.' ('.get_class($exception).')';
    }
}

if ($failures !== []) {
    fwrite(STDERR, implode(PHP_EOL, $failures).PHP_EOL);
    exit(1);
}

echo count($manifest['tables'])." table fingerprints verified; {$foreignKeys} foreign keys, polymorphic relations, attachments, migration ledger and model casts valid.\n";
