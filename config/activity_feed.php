<?php

declare(strict_types=1);

use App\Domains\SpecializedEducationalSupport\Domain\Models\AeeStudentEvaluation;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Paee;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PedagogicalRecord;
use App\Domains\SpecializedEducationalSupport\Domain\Models\PeiDiscipline;

/**
 * Mapa de configuração do feed de atividades (dashboard). Para incluir um
 * módulo novo no feed, basta adicionar uma entrada aqui — nenhum
 * controller/service/model precisa ser alterado.
 *
 * Tem que ser só dados (sem closures): o config é cacheado em produção via
 * "artisan config:cache", que serializa o arquivo com var_export() e não
 * suporta Closure. A montagem da rota (quando precisa de ids que o log não
 * guarda, ex.: pei_id) fica em App\Shared\Domain\Support\ActivityFeedPresenter.
 *
 * - label: nome do documento exibido na frase ("Estudo de Caso", "PAEE"...).
 * - student: caminho (dot notation) até o nome do aluno a partir do model.
 * - student_id: caminho até o id do aluno (usado para filtrar por vínculo).
 * - detail: caminho opcional até um detalhe extra (ex.: nome da disciplina).
 * - verbs: sobrescreve os verbos padrão para este model, se o gênero do
 *   documento exigir (ex.: "preenchida"/"alterada" em vez de "preenchido"/"alterado").
 * - ability: permissão verificada (via @can) antes de exibir o link do item.
 * - route_name: nome da rota de exibição do registro.
 * - route_params: chaves (nessa ordem) usadas para montar os parâmetros da
 *   rota: "auditable_id" (id do próprio registro) ou "student_id".
 */
return [

    'default_verbs' => [
        'created' => 'preenchido',
        'updated' => 'alterado',
        'deleted' => 'excluído',
    ],

    'models' => [
        CaseStudy::class => [
            'label' => 'Estudo de Caso',
            'student' => 'student.person.name',
            'student_id' => 'student.id',
            'ability' => 'case-study.view',
            'route_name' => 'specialized-educational-support.case-study.show',
            'route_params' => ['auditable_id'],
        ],

        Paee::class => [
            'label' => 'PAEE',
            'student' => 'student.person.name',
            'student_id' => 'student.id',
            'ability' => 'paee.view',
            'route_name' => 'specialized-educational-support.paee.show',
            'route_params' => ['auditable_id'],
        ],

        PeiDiscipline::class => [
            'label' => 'PEI',
            'student' => 'pei.student.person.name',
            'student_id' => 'pei.student.id',
            'detail' => 'discipline.name',
            'ability' => 'pei-discipline.view',
            'route_name' => 'specialized-educational-support.pei-discipline.show',
            // precisa do pei_id, que o log não guarda — resolvido à parte no presenter.
            'route_params' => ['pei_id', 'auditable_id'],
        ],

        AeeStudentEvaluation::class => [
            'label' => 'Atendimento AEE',
            'student' => 'student.person.name',
            'student_id' => 'student.id',
            'ability' => 'aee-record.view',
            'route_name' => 'specialized-educational-support.students.aee-records.show',
            'route_params' => ['student_id', 'auditable_id'],
        ],

        PedagogicalRecord::class => [
            'label' => 'Atendimento Pedagógico',
            'student' => 'attendanceSession.students.0.person.name',
            'student_id' => 'attendanceSession.students.0.id',
            'ability' => 'pedagogical-record.view',
            'route_name' => 'specialized-educational-support.pedagogical-records.show',
            'route_params' => ['auditable_id'],
        ],
    ],

];
