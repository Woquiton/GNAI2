<?php

namespace Database\Seeders\SpecializedEducationalSupport;

use App\Models\SpecializedEducationalSupport\PeiDiscipline;
use App\Models\SpecializedEducationalSupport\Semester;
use App\Models\SpecializedEducationalSupport\Student;
use App\Models\SpecializedEducationalSupport\TeacherCourseDiscipline;
use App\Models\User;
use App\Services\SpecializedEducationalSupport\CaseStudyService;
use App\Services\SpecializedEducationalSupport\PaeeService;
use App\Services\SpecializedEducationalSupport\PeiService;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Seeder;

class CaseStudyPaeePeiDemoSeeder extends Seeder
{
    /**
     * Gera dados simulados realistas de Estudo de Caso -> PAEE -> PEI
     * para todos os alunos ativos cadastrados, para fins de demonstração/teste local.
     */
    public function run(): void
    {
        $semester = Semester::where('is_current', true)->first();
        $creator = User::whereNotNull('professional_id')->first() ?? User::where('is_admin', true)->first();

        if (!$semester || !$creator) {
            $this->command->warn('É necessário ter um Semestre atual e um usuário profissional/admin cadastrado.');
            return;
        }

        Auth::login($creator);

        $caseStudyService = Container::getInstance()->make(CaseStudyService::class);
        $paeeService = Container::getInstance()->make(PaeeService::class);
        $peiService = Container::getInstance()->make(PeiService::class);

        $students = Student::where('status', 'active')
            ->with('currentCourse.course.disciplines')
            ->get();

        if ($students->isEmpty()) {
            $this->command->warn('Nenhum aluno ativo encontrado.');
            return;
        }

        $barrierTypes = ['architectural', 'urbanistic', 'communicational', 'methodological', 'technological', 'attitudinal'];
        $neededSupportsPool = ['communication', 'interaction', 'assistive_technology', 'pedagogical_adaptation', 'orientation_mobility'];
        $demandOrigins = ['teacher', 'family', 'student', 'medical_report'];

        foreach ($students as $index => $student) {
            $this->command->info("Gerando dados para o aluno #{$student->id}...");

            // ============ 1. ESTUDO DE CASO (concluído) ============
            $barrierType = $barrierTypes[$index % count($barrierTypes)];

            $caseStudyData = [
                'demand_origin' => $demandOrigins[$index % count($demandOrigins)],
                'participants_summary' => 'Reunião realizada com professor regente, coordenação pedagógica e família em ' . now()->subMonths(2)->format('d/m/Y') . ', seguida de observação em sala de aula e entrevista com a família.',
                'student_observation' => 'O(a) estudante participa das atividades em sala com apoio pontual do professor. Demonstra dificuldade de concentração em atividades prolongadas e maior engajamento em tarefas práticas e visuais. Interage bem com os colegas durante atividades em grupo, mas apresenta resistência a mudanças de rotina.',
                'student_family_listening' => 'A família relata que o(a) estudante demonstra interesse pelos estudos em casa, mas enfrenta dificuldade para manter a atenção em tarefas longas. Os responsáveis destacam boa resposta a estímulos visuais e rotina estruturada, e manifestam interesse em acompanhar de perto as estratégias adotadas pela escola.',
                'teachers_listening' => 'Os professores da sala comum relatam que o(a) estudante acompanha o conteúdo com adaptações pontuais nas atividades e tempo adicional para realização de provas. Observam melhor desempenho em atividades práticas e em grupo do que em avaliações escritas tradicionais.',
                'other_info' => 'Aluno(a) utiliza transporte escolar. Sem restrição alimentar relatada pela família.',
                'care_network_notes' => 'Acompanhamento pedagógico em andamento; sem encaminhamento à rede de saúde no momento.',
                'favorable_aspects' => 'Escola com equipe pedagógica receptiva e estrutura física acessível. Família presente e participativa no processo educacional.',
                'potentials_interests' => 'Demonstra grande interesse por atividades práticas, artísticas e tecnológicas. Bom relacionamento interpessoal com os colegas de turma.',
                'needed_supports' => array_slice($neededSupportsPool, $index % 2, 3),
                'needed_supports_justification' => 'Apoios recomendados a partir da observação em sala e da escuta da família e dos professores, visando ampliar a participação e autonomia do(a) estudante.',
                'acceptance_status' => 'accepted',
                'acceptance_date' => now()->subMonths(2)->toDateString(),
                'barriers' => [
                    [
                        'type' => $barrierType,
                        'observed_situation' => 'Identificada barreira do tipo ' . $barrierType . ' que dificulta a plena participação do(a) estudante nas atividades escolares cotidianas.',
                        'participation_implication' => 'Compromete parcialmente a autonomia e o ritmo de participação do(a) estudante nas atividades em sala de aula.',
                    ],
                    [
                        'type' => 'methodological',
                        'observed_situation' => 'Atividades avaliativas longas e exclusivamente escritas dificultam a demonstração do conhecimento adquirido.',
                        'participation_implication' => 'Gera desempenho abaixo do potencial real do(a) estudante em avaliações formais.',
                    ],
                ],
                'strategies' => [
                    [
                        'description' => 'Adotar tempo estendido e formatos diversificados de avaliação (oral, prática, com apoio visual).',
                        'linked_barrier_index' => 1,
                    ],
                    [
                        'description' => 'Utilizar recursos visuais e rotina estruturada para apoiar a organização das atividades.',
                        'linked_barrier_index' => 0,
                    ],
                ],
            ];

            $caseStudy = $caseStudyService->create($student, $caseStudyData);
            $caseStudyService->complete($caseStudy);
            $caseStudy->refresh();

            // ============ 2. PAEE (ativo) ============
            $paeeData = [
                'attendance_frequency_per_week' => [1, 2, 3][$index % 3],
                'attendance_duration_minutes' => [45, 50, 60][$index % 3],
                'attendance_format' => ['individual', 'collective', 'mixed'][$index % 3],
                'attendance_location' => ['srm', 'common_classroom', 'accessibility_center'][$index % 3],
                'assistive_technology_needed' => $index % 2 === 0,
                'assistive_technology_notes' => $index % 2 === 0
                    ? 'Uso de prancha de comunicação alternativa e aplicativo de leitura em voz alta durante as atividades pedagógicas.'
                    : null,
                'support_professional_needed' => $index % 3 === 0,
                'support_professional_justification' => $index % 3 === 0
                    ? 'Necessário apoio em atividades de locomoção e organização das rotinas escolares.'
                    : null,
                'school_professionals_orientation' => 'Orientação à equipe pedagógica sobre estratégias de acessibilidade curricular e manejo de rotina em sala de aula.',
                'common_teachers_articulation' => 'Reuniões periódicas com os professores regentes para alinhamento das adaptações curriculares e avaliativas.',
                'family_articulation' => 'Contato quinzenal com a família para troca de informações sobre o desenvolvimento do(a) estudante e orientações de apoio em casa.',
                'intersectoral_articulation' => null,
                'training_demands' => 'Formação continuada da equipe docente sobre tecnologia assistiva e comunicação alternativa.',
                'objectives' => [
                    [
                        'description' => 'Ampliar o tempo de concentração do(a) estudante em atividades pedagógicas estruturadas.',
                        'term' => 'short',
                        'linked_barrier_id' => $caseStudy->barriers->first()?->id,
                    ],
                    [
                        'description' => 'Promover maior autonomia na realização de avaliações, com uso de formatos diversificados.',
                        'term' => 'medium',
                        'linked_barrier_id' => $caseStudy->barriers->last()?->id,
                    ],
                ],
                'resources' => [
                    [
                        'description' => 'Material de apoio visual (agenda ilustrada, cartões de rotina).',
                        'acquisition_type' => 'to_produce',
                    ],
                    [
                        'description' => 'Aplicativo de leitura em voz alta para dispositivo móvel.',
                        'acquisition_type' => 'to_acquire',
                    ],
                ],
            ];

            $paee = $paeeService->create($caseStudy, $paeeData);

            // ============ 3. PEI (com disciplinas) ============
            $currentCourseRelation = $student->currentCourse;
            $course = $currentCourseRelation?->course;

            if (!$course) {
                $this->command->warn("Aluno #{$student->id} sem matrícula vigente - PEI não gerado.");
                continue;
            }

            try {
                $pei = $peiService->create($student);
            } catch (\Throwable $e) {
                $this->command->warn("Aluno #{$student->id}: não foi possível gerar o PEI ({$e->getMessage()}).");
                continue;
            }

            $disciplineIdsWithTeachers = TeacherCourseDiscipline::where('course_id', $course->id)
                ->distinct()
                ->pluck('discipline_id');

            $availableDisciplines = $course->disciplines
                ->whereIn('id', $disciplineIdsWithTeachers)
                ->values();

            if ($availableDisciplines->isEmpty()) {
                $this->command->warn("Aluno #{$student->id}: nenhuma disciplina com professor vinculado encontrada para o PEI.");
                continue;
            }

            $disciplines = $availableDisciplines->random(min(3, $availableDisciplines->count()));
            if (!$disciplines instanceof \Illuminate\Support\Collection) {
                $disciplines = collect([$disciplines]);
            }

            foreach ($disciplines as $discipline) {
                $teacherIds = TeacherCourseDiscipline::where('course_id', $course->id)
                    ->where('discipline_id', $discipline->id)
                    ->pluck('teacher_id')
                    ->unique()
                    ->values();

                if ($teacherIds->isEmpty()) {
                    continue;
                }

                $teacherId = $teacherIds->random();

                PeiDiscipline::create([
                    'pei_id' => $pei->id,
                    'teacher_id' => $teacherId,
                    'creator_id' => $creator->id,
                    'discipline_id' => $discipline->id,
                    'specific_objectives' => "Adaptar os objetivos da disciplina de {$discipline->name} para priorizar competências essenciais, respeitando o ritmo de aprendizagem do(a) estudante.",
                    'content_programmatic' => "Seleção de conteúdos prioritários de {$discipline->name}, com apresentação em etapas curtas e apoio visual.",
                    'methodologies' => "- Tempo estendido para realização de atividades;\n- Uso de recursos visuais e materiais concretos;\n- Mediação constante do professor e aprendizagem entre pares.",
                    'evaluations' => "- Avaliação processual e contínua;\n- Possibilidade de avaliação oral ou prática como alternativa à prova escrita;\n- Enunciados curtos e objetivos.",
                    'opinion' => "O(a) estudante vem demonstrando evolução gradual em {$discipline->name}, com melhor desempenho em atividades práticas. Recomenda-se manter o acompanhamento próximo e o uso dos recursos de apoio definidos no PAEE.",
                ]);
            }

            $this->command->info("Aluno #{$student->id}: Estudo de Caso v{$caseStudy->version}, PAEE v{$paee->version}, PEI v{$pei->version} com {$disciplines->count()} disciplina(s) gerados.");
        }

        $this->command->info('Dados simulados gerados com sucesso.');
    }
}
