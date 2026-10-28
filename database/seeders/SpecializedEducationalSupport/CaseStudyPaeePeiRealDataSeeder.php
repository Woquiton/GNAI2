<?php

declare(strict_types=1);

namespace Database\Seeders\SpecializedEducationalSupport;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\CompleteCaseStudyAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\CaseStudies\CreateCaseStudyAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Paees\CreatePaeeAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\PeiDisciplines\CreatePeiDisciplineAction;
use App\Domains\SpecializedEducationalSupport\Application\Actions\Peis\CreatePeiAction;
use App\Domains\SpecializedEducationalSupport\Application\Data\CaseStudies\CreateCaseStudyData;
use App\Domains\SpecializedEducationalSupport\Application\Data\Paees\CreatePaeeData;
use App\Domains\SpecializedEducationalSupport\Application\Data\PeiDisciplines\CreatePeiDisciplineData;
use App\Domains\SpecializedEducationalSupport\Domain\Models\CaseStudy;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Course;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Discipline;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Person;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Teacher;
use App\Domains\SpecializedEducationalSupport\Domain\Models\TeacherCourseDiscipline;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CaseStudyPaeePeiRealDataSeeder extends Seeder
{
    /**
     * Gera dados simulados muito detalhados de Estudo de Caso -> PAEE -> PEI
     * para 30 alunos reais importados da base de produção.
     */
    public function run(): void
    {
        $creator = User::where('email', 'admin@local')->first()
            ?? User::where('is_admin', true)->first();

        if (!$creator) {
            $this->command->error('Nenhum usuário administrador encontrado. Crie um antes de rodar este seeder.');
            return;
        }

        Auth::login($creator);

        $this->ensureAcademicSetup();

        $students = Student::query()
            ->with(['person', 'deficiencies', 'currentCourse.course'])
            ->whereHas('currentCourse')
            ->where('status', 'active')
            ->get()
            ->sortByDesc(fn (Student $s) => $s->deficiencies->count())
            ->take(30)
            ->values();

        if ($students->count() < 30) {
            $this->command->warn("Apenas {$students->count()} alunos ativos com matrícula vigente encontrados (menos de 30).");
        }

        $createCaseStudy = app(CreateCaseStudyAction::class);
        $completeCaseStudy = app(CompleteCaseStudyAction::class);
        $createPaee = app(CreatePaeeAction::class);
        $createPei = app(CreatePeiAction::class);
        $createPeiDiscipline = app(CreatePeiDisciplineAction::class);

        $count = 0;

        foreach ($students as $index => $student) {
            $name = $student->person->name;
            $firstName = explode(' ', trim($name))[0];
            $deficiency = $student->deficiencies->first();
            $deficiencyName = $deficiency?->name;
            $course = $student->currentCourse->course;

            $this->command->info("[{$index}] Gerando dados para {$name} (curso: {$course->name})...");

            try {
                DB::transaction(function () use (
                    $student, $name, $firstName, $deficiencyName, $course,
                    $createCaseStudy, $completeCaseStudy, $createPaee, $createPei, $createPeiDiscipline,
                    $creator, $index
                ) {
                    $profile = $this->profileFor($deficiencyName, $firstName);

                    // ===================== 1. ESTUDO DE CASO =====================
                    $caseStudyData = CreateCaseStudyData::from([
                        'student_id' => $student->id,
                        'demand_origin' => $profile['demand_origin'],
                        'participants_summary' => "Reunião realizada em {$this->pastDate($index, 60)} com a Assessoria Pedagógica, o professor regente de {$course->name} e a coordenação do NAPNE, seguida de observação em sala de aula ao longo de duas semanas e entrevista individual com {$firstName} e sua família.",
                        'student_observation' => $profile['student_observation'],
                        'student_family_listening' => $profile['student_family_listening'],
                        'teachers_listening' => $profile['teachers_listening'],
                        'other_info' => $profile['other_info'],
                        'care_network_notes' => $profile['care_network_notes'],
                        'favorable_aspects' => "A instituição conta com equipe do NAPNE estruturada, sala de recursos multifuncionais equipada e corpo docente receptivo às adaptações sugeridas. A família de {$firstName} é presente, participa das reuniões convocadas e demonstra disposição para seguir as orientações da equipe pedagógica. O curso de {$course->name} possui carga horária compatível com os ajustes propostos.",
                        'potentials_interests' => $profile['potentials_interests'],
                        'needed_supports' => $profile['needed_supports'],
                        'needed_supports_justification' => $profile['needed_supports_justification'],
                        'acceptance_status' => 'accepted',
                        'acceptance_date' => $this->pastDate($index, 55),
                        'barriers' => $profile['barriers'],
                        'strategies' => $profile['strategies'],
                    ]);

                    $caseStudy = $createCaseStudy->execute($student, $caseStudyData, $creator);
                    $caseStudy = $completeCaseStudy->execute($caseStudy);
                    $caseStudy->loadMissing('barriers');

                    // ===================== 2. PAEE =====================
                    $barrierIds = $caseStudy->barriers->pluck('id')->values();

                    $paeeData = CreatePaeeData::from([
                        'case_study_id' => $caseStudy->id,
                        'attendance_frequency_per_week' => $profile['attendance_frequency_per_week'],
                        'attendance_duration_minutes' => $profile['attendance_duration_minutes'],
                        'attendance_format' => $profile['attendance_format'],
                        'attendance_location' => $profile['attendance_location'],
                        'assistive_technology_needed' => $profile['assistive_technology_needed'],
                        'assistive_technology_notes' => $profile['assistive_technology_notes'],
                        'support_professional_needed' => $profile['support_professional_needed'],
                        'support_professional_justification' => $profile['support_professional_justification'],
                        'school_professionals_orientation' => "Orientação à equipe docente de {$course->name} sobre o perfil de aprendizagem de {$firstName}, estratégias de acessibilidade curricular e manejo de sala de aula, com encontro de alinhamento no início de cada semestre letivo.",
                        'common_teachers_articulation' => "Reuniões pedagógicas bimestrais com os professores do curso de {$course->name} para repactuação das adaptações curriculares, compartilhamento de evolução e ajuste de estratégias conforme o desempenho observado.",
                        'family_articulation' => "Contato quinzenal com a família de {$firstName}, via WhatsApp institucional e reuniões presenciais mensais, para troca de informações sobre o desenvolvimento escolar e orientações de apoio em casa.",
                        'intersectoral_articulation' => $profile['intersectoral_articulation'],
                        'training_demands' => $profile['training_demands'],
                        'objectives' => $profile['objectives']($barrierIds),
                        'resources' => $profile['resources'],
                    ]);

                    $paee = $createPaee->execute($paeeData, $creator);

                    // ===================== 3. PEI =====================
                    $pei = $createPei->execute($student, $creator);

                    $disciplineIds = TeacherCourseDiscipline::where('course_id', $course->id)
                        ->distinct()
                        ->pluck('discipline_id');

                    $disciplines = Discipline::whereIn('id', $disciplineIds)->get();

                    foreach ($disciplines as $discipline) {
                        $teacherId = TeacherCourseDiscipline::where('course_id', $course->id)
                            ->where('discipline_id', $discipline->id)
                            ->value('teacher_id');

                        if (!$teacherId) {
                            continue;
                        }

                        $disciplineProfile = $this->disciplineProfile($discipline->name, $firstName, $deficiencyName);

                        $peiDisciplineData = CreatePeiDisciplineData::from([
                            'teacher_id' => $teacherId,
                            'discipline_id' => $discipline->id,
                            'specific_objectives' => $disciplineProfile['specific_objectives'],
                            'content_programmatic' => $disciplineProfile['content_programmatic'],
                            'methodologies' => $disciplineProfile['methodologies'],
                            'evaluations' => $disciplineProfile['evaluations'],
                            'opinion' => $disciplineProfile['opinion'],
                            'complementary_records' => $disciplineProfile['complementary_records'],
                        ]);

                        $createPeiDiscipline->execute($pei, $creator, $peiDisciplineData);
                    }
                });

                $count++;
            } catch (\Throwable $e) {
                $this->command->warn("  Falhou para {$name}: {$e->getMessage()}");
            }
        }

        $this->command->info("Concluído: {$count} aluno(s) com Estudo de Caso, PAEE e PEI gerados com sucesso.");
    }

    /**
     * Garante disciplinas, professores e vínculos curso/disciplina/professor
     * necessários para que os PEIs gerados tenham adaptações por disciplina reais.
     */
    private function ensureAcademicSetup(): void
    {
        $disciplineNames = ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia', 'Língua Inglesa'];

        $disciplines = collect($disciplineNames)->map(
            fn (string $name) => Discipline::firstOrCreate(['name' => $name], ['is_active' => true])
        );

        $teacherNames = [
            'Carla Menezes Rios', 'Fábio Andrade Souza', 'Patrícia Lemos Vieira',
            'Renato Caldas Nunes', 'Vanessa Tavares Lima', 'Marcelo Brito Fagundes',
        ];

        $teachers = collect();
        foreach ($teacherNames as $i => $teacherName) {
            $person = Person::firstOrCreate(
                ['name' => $teacherName],
                [
                    'birth_date' => now()->subYears(30 + $i)->toDateString(),
                    'gender' => $i % 2 === 0 ? 'female' : 'male',
                    'email' => null,
                ]
            );

            $teacher = Teacher::firstOrCreate(
                ['person_id' => $person->id],
                ['registration' => 'SIM-PROF-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT)]
            );

            $teachers->push($teacher);
        }

        // Vincula um par de disciplinas a cada curso que tenha ao menos um aluno ativo,
        // e um professor responsável por cada combinação curso+disciplina.
        $courseIds = Student::query()
            ->whereHas('currentCourse')
            ->where('status', 'active')
            ->with('currentCourse')
            ->get()
            ->pluck('currentCourse.course_id')
            ->filter()
            ->unique()
            ->values();

        $teacherCursor = 0;

        foreach ($courseIds as $courseId) {
            $course = Course::find($courseId);
            if (!$course) {
                continue;
            }

            $chosenDisciplines = $disciplines->shuffle()->take(3);

            $course->disciplines()->syncWithoutDetaching($chosenDisciplines->pluck('id')->all());

            foreach ($chosenDisciplines as $discipline) {
                $teacher = $teachers[$teacherCursor % $teachers->count()];
                $teacherCursor++;

                TeacherCourseDiscipline::firstOrCreate([
                    'teacher_id' => $teacher->id,
                    'course_id' => $course->id,
                    'discipline_id' => $discipline->id,
                ]);
            }
        }
    }

    private function pastDate(int $index, int $baseDays): string
    {
        return now()->subDays($baseDays - ($index % 10))->toDateString();
    }

    /**
     * Monta um perfil textual detalhado e coerente de Estudo de Caso/PAEE
     * a partir da primeira deficiência registrada do aluno (ou um perfil
     * genérico de acompanhamento pedagógico quando não há registro).
     *
     * @return array<string, mixed>
     */
    private function profileFor(?string $deficiencyName, string $firstName): array
    {
        $key = $this->normalizeDeficiency($deficiencyName);

        $profiles = [
            'tea' => [
                'demand_origin' => 'teacher',
                'student_observation' => "{$firstName} participa das aulas com maior conforto quando a rotina é previsível e os comandos são objetivos. Demonstra dificuldade em lidar com mudanças repentinas de atividade e em ambientes com muito ruído ou movimentação, podendo se isolar ou manifestar desconforto físico (tapar os ouvidos, balançar as pernas). Interage melhor em duplas ou pequenos grupos do que em dinâmicas de turma inteira, e apresenta forte interesse por temas específicos, nos quais demonstra vocabulário técnico acima da média.",
                'student_family_listening' => "A família relata que {$firstName} recebeu diagnóstico de Transtorno do Espectro Autista (TEA) ainda na infância e realiza acompanhamento multiprofissional contínuo (psicologia e terapia ocupacional). Em casa, mantém-se mais regulado quando a rotina diária é organizada em quadros visuais. Os responsáveis destacam que mudanças de horário sem aviso prévio costumam gerar ansiedade e solicitam que a escola comunique alterações de calendário com antecedência.",
                'teachers_listening' => "Os professores relatam bom desempenho em atividades estruturadas e com instruções escritas, porém dificuldade em avaliações orais surpresa e em trabalhos em grupo com composição alterada sem aviso prévio. Observam que o uso de apoio visual (cronogramas, checklists) melhora significativamente a participação nas aulas.",
                'other_info' => "Utiliza transporte escolar próprio. Não possui restrição alimentar relatada pela família.",
                'care_network_notes' => "Acompanhamento psicológico quinzenal e terapia ocupacional semanal em clínica particular; sem necessidade de encaminhamento adicional à rede pública no momento.",
                'potentials_interests' => "Grande interesse por tecnologia, programação e temas de ciências exatas. Memória detalhada para fatos e dados técnicos. Bom desempenho em tarefas que seguem um padrão lógico definido.",
                'needed_supports' => ['communication', 'interaction', 'assistive_technology'],
                'needed_supports_justification' => "Os apoios de comunicação e interação social visam reduzir a sobrecarga sensorial em atividades coletivas; o apoio de tecnologia assistiva refere-se ao uso de fones abafadores de ruído e aplicativo de agenda visual já utilizados em outros ambientes pelo estudante.",
                'barriers' => [
                    ['type' => 'methodological', 'observed_situation' => "Atividades avaliativas aplicadas sem roteiro prévio ou com alteração de formato no último momento geram bloqueio na participação de {$firstName}.", 'participation_implication' => "Compromete a demonstração real do conhecimento adquirido, gerando desempenho abaixo do potencial em avaliações surpresa."],
                    ['type' => 'attitudinal', 'observed_situation' => "Em dinâmicas de grupo com composição alterada sem aviso, colegas por vezes demonstram impaciência com o tempo de adaptação do estudante.", 'participation_implication' => "Reduz a participação espontânea de {$firstName} em atividades coletivas e pode gerar isolamento social."],
                ],
                'strategies' => [
                    ['description' => "Antecipar por escrito o roteiro e os critérios de qualquer atividade avaliativa, evitando alterações de última hora.", 'linked_barrier_index' => 0],
                    ['description' => "Orientar a turma sobre neurodiversidade e promover atividades de sensibilização conduzidas pela equipe do NAPNE.", 'linked_barrier_index' => 1],
                ],
                'attendance_frequency_per_week' => 2,
                'attendance_duration_minutes' => 50,
                'attendance_format' => 'individual',
                'attendance_location' => 'srm',
                'assistive_technology_needed' => true,
                'assistive_technology_notes' => "Uso de fone abafador de ruído durante atividades em ambientes com alto nível sonoro e aplicativo de agenda visual em tablet pessoal para antecipação de rotina.",
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => "Troca de informações com a equipe de psicologia e terapia ocupacional externas, mediante autorização da família, para alinhamento das estratégias de regulação sensorial.",
                'training_demands' => "Formação da equipe docente sobre Transtorno do Espectro Autista, comunicação visual de apoio e estratégias de antecipação de rotina em sala de aula.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Ampliar a participação de {$firstName} em avaliações formais por meio de roteiros antecipados e critérios claros.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                    ['description' => "Fortalecer a interação social em atividades de grupo com apoio de mediação planejada.", 'term' => 'medium', 'linked_barrier_id' => $barrierIds->get(1)],
                ],
                'resources' => [
                    ['description' => "Cronograma visual semanal impresso e plastificado para uso em sala.", 'acquisition_type' => 'to_produce'],
                    ['description' => "Fone abafador de ruído para uso em atividades coletivas e eventos escolares.", 'acquisition_type' => 'to_acquire'],
                ],
            ],

            'tdah' => [
                'demand_origin' => 'teacher',
                'student_observation' => "{$firstName} demonstra dificuldade em manter atenção sustentada em atividades longas, dispersando-se com estímulos do ambiente e levantando-se frequentemente durante as aulas. Em atividades curtas, dinâmicas e práticas, apresenta bom engajamento e criatividade. Também relata esquecer prazos e materiais com frequência.",
                'student_family_listening' => "A família informa diagnóstico de Transtorno do Déficit de Atenção e Hiperatividade (TDAH), com acompanhamento psiquiátrico e uso de medicação estimulante no período escolar. Relatam dificuldade em manter {$firstName} concentrado(a) nos estudos em casa e destacam melhor rendimento em sessões curtas de estudo intercaladas com pausas.",
                'teachers_listening' => "Os professores relatam que {$firstName} apresenta bom raciocínio quando engajado(a), mas perde o fio da atividade em exposições longas. Observam melhora significativa de desempenho quando o conteúdo é fracionado em etapas curtas, com checagens de compreensão frequentes.",
                'other_info' => "Faz uso de medicação estimulante prescrita, administrada pela manhã, antes do início das aulas.",
                'care_network_notes' => "Acompanhamento psiquiátrico trimestral, sem necessidade de encaminhamento adicional no momento.",
                'potentials_interests' => "Criativo(a), comunicativo(a) e com facilidade em atividades práticas e dinâmicas. Bom desempenho em debates e trabalhos que envolvam movimento ou manipulação de materiais concretos.",
                'needed_supports' => ['pedagogical_adaptation', 'orientation_mobility'],
                'needed_supports_justification' => "Recomenda-se fracionamento de tarefas longas e pausas estruturadas para sustentação da atenção, com apoio de orientação para organização de materiais e prazos.",
                'barriers' => [
                    ['type' => 'methodological', 'observed_situation' => "Atividades expositivas longas sem pausas ou fracionamento levam {$firstName} à dispersão e à perda de informações centrais do conteúdo.", 'participation_implication' => "Reduz a retenção do conteúdo e o desempenho em avaliações cumulativas."],
                    ['type' => 'social', 'observed_situation' => "Esquecimento frequente de materiais e prazos de entrega gera atrasos recorrentes na realização de trabalhos.", 'participation_implication' => "Impacta negativamente a nota de atividades avaliativas contínuas, mesmo quando o conteúdo é dominado."],
                ],
                'strategies' => [
                    ['description' => "Fracionar atividades longas em blocos de 15 a 20 minutos, com pausas estruturadas entre eles.", 'linked_barrier_index' => 0],
                    ['description' => "Adotar checklist de materiais e prazos compartilhado com a família, revisado semanalmente pela assessoria pedagógica.", 'linked_barrier_index' => 1],
                ],
                'attendance_frequency_per_week' => 1,
                'attendance_duration_minutes' => 45,
                'attendance_format' => 'individual',
                'attendance_location' => 'common_classroom',
                'assistive_technology_needed' => false,
                'assistive_technology_notes' => null,
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => "Comunicação com o psiquiatra assistente, mediante autorização da família, para alinhamento quanto a eventuais ajustes de horário escolar em função do efeito da medicação.",
                'training_demands' => "Formação docente sobre estratégias de manejo de atenção em sala de aula e uso de recursos de organização para estudantes com TDAH.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Ampliar o tempo de concentração sustentada de {$firstName} em atividades pedagógicas por meio de fracionamento estruturado.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                    ['description' => "Reduzir a perda de prazos e materiais com o uso de checklist de acompanhamento semanal.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(1)],
                ],
                'resources' => [
                    ['description' => "Checklist semanal impresso de materiais e prazos.", 'acquisition_type' => 'to_produce'],
                    ['description' => "Timer visual para apoio na gestão do tempo em atividades fracionadas.", 'acquisition_type' => 'to_acquire'],
                ],
            ],

            'visao' => [
                'demand_origin' => 'student',
                'student_observation' => "{$firstName} apresenta baixa acuidade visual, necessitando aproximar-se do quadro e de materiais impressos para leitura. Demonstra fadiga visual após períodos prolongados de leitura e solicita, por vezes, que o conteúdo seja lido em voz alta pelo professor.",
                'student_family_listening' => "A família relata acompanhamento oftalmológico regular, com uso de óculos de grau atualizados a cada ano. Destacam que {$firstName} tem bom desempenho acadêmico quando o material é ampliado ou disponibilizado em formato digital com zoom.",
                'teachers_listening' => "Os professores relatam que {$firstName} acompanha bem as aulas quando posicionado(a) nas primeiras fileiras e quando o material é fornecido em fonte ampliada. Apresentam dificuldade apenas quando o conteúdo é exclusivamente visual e de letra pequena, como mapas e gráficos detalhados.",
                'other_info' => "Faz uso de óculos de grau em período integral nas atividades escolares.",
                'care_network_notes' => "Acompanhamento oftalmológico anual; sem necessidade de encaminhamento adicional no momento.",
                'potentials_interests' => "Excelente capacidade de compreensão auditiva e de memorização de conteúdos apresentados oralmente. Participativo(a) em debates e discussões em sala.",
                'needed_supports' => ['assistive_technology', 'pedagogical_adaptation'],
                'needed_supports_justification' => "Necessário fornecimento de material didático em fonte ampliada ou formato digital compatível com recursos de ampliação de tela, além de posicionamento preferencial em sala.",
                'barriers' => [
                    ['type' => 'communicational', 'observed_situation' => "Materiais impressos em fonte padrão e mapas/gráficos de letra pequena dificultam a leitura autônoma de {$firstName}.", 'participation_implication' => "Gera dependência de leitura por terceiros e atraso na realização de atividades individuais."],
                    ['type' => 'methodological', 'observed_situation' => "Conteúdos apresentados exclusivamente em slides projetados a distância, sem material de apoio individual.", 'participation_implication' => "Reduz o acompanhamento em tempo real da aula expositiva."],
                ],
                'strategies' => [
                    ['description' => "Disponibilizar material didático em fonte ampliada (mínimo 18pt) ou em formato digital acessível, com antecedência às aulas.", 'linked_barrier_index' => 0],
                    ['description' => "Garantir posicionamento nas primeiras fileiras e cópia prévia dos slides projetados.", 'linked_barrier_index' => 1],
                ],
                'attendance_frequency_per_week' => 1,
                'attendance_duration_minutes' => 50,
                'attendance_format' => 'individual',
                'attendance_location' => 'srm',
                'assistive_technology_needed' => true,
                'assistive_technology_notes' => "Uso de aplicativo de ampliação de tela e lupa eletrônica portátil disponibilizada pela sala de recursos multifuncionais.",
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => null,
                'training_demands' => "Orientação aos docentes sobre produção de material didático acessível (fonte ampliada, contraste adequado, descrição de imagens).",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Garantir acesso autônomo de {$firstName} a materiais didáticos por meio de formatos acessíveis.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                    ['description' => "Ampliar o acompanhamento em tempo real de aulas expositivas com apoio de material impresso prévio.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(1)],
                ],
                'resources' => [
                    ['description' => "Lupa eletrônica portátil para uso em sala de aula.", 'acquisition_type' => 'to_acquire'],
                    ['description' => "Conversão de materiais didáticos para fonte ampliada e formato digital acessível.", 'acquisition_type' => 'to_accessibilize'],
                ],
            ],

            'auditiva' => [
                'demand_origin' => 'medical_report',
                'student_observation' => "{$firstName} apresenta perda auditiva que exige leitura labial e proximidade com o interlocutor para melhor compreensão. Em ambientes ruidosos ou com múltiplas pessoas falando simultaneamente, demonstra maior dificuldade de acompanhamento da conversa.",
                'student_family_listening' => "A família relata diagnóstico de perda auditiva neurossensorial, com acompanhamento fonoaudiológico contínuo. Destaca que {$firstName} se comunica bem quando há contato visual direto e fala pausada, sem necessidade de gritos ou exagero articulatório.",
                'teachers_listening' => "Os professores relatam boa compreensão quando falam de frente para o(a) estudante e evitam dar as costas enquanto explicam o conteúdo. Observam maior dificuldade em atividades de áudio sem legenda ou em discussões com múltiplos colegas falando ao mesmo tempo.",
                'other_info' => "Não faz uso de aparelho auditivo no momento, por escolha pessoal relatada pela família.",
                'care_network_notes' => "Acompanhamento fonoaudiológico mensal; possibilidade futura de avaliação para uso de aparelho auditivo, conforme evolução clínica.",
                'potentials_interests' => "Bom desempenho em atividades visuais e escritas. Demonstra atenção redobrada em leitura labial e boa capacidade de síntese de conteúdos escritos.",
                'needed_supports' => ['communication', 'assistive_technology'],
                'needed_supports_justification' => "Necessário posicionamento estratégico em sala, uso de recursos visuais de apoio e legendas em materiais audiovisuais para garantir plena compreensão do conteúdo.",
                'barriers' => [
                    ['type' => 'communicational', 'observed_situation' => "Vídeos e áudios utilizados em sala sem legenda ou transcrição dificultam o acompanhamento integral do conteúdo por {$firstName}.", 'participation_implication' => "Gera lacunas de compreensão em conteúdos audiovisuais sem suporte visual complementar."],
                    ['type' => 'methodological', 'observed_situation' => "Explicações realizadas de costas para a turma (ex: enquanto escreve no quadro) impedem a leitura labial.", 'participation_implication' => "Compromete o acompanhamento simultâneo da explicação oral do conteúdo."],
                ],
                'strategies' => [
                    ['description' => "Priorizar vídeos e áudios com legenda ou fornecer transcrição escrita do conteúdo sonoro utilizado em aula.", 'linked_barrier_index' => 0],
                    ['description' => "Orientar os docentes a manterem-se de frente para a turma durante explicações orais, pausando a escrita no quadro quando necessário.", 'linked_barrier_index' => 1],
                ],
                'attendance_frequency_per_week' => 1,
                'attendance_duration_minutes' => 50,
                'attendance_format' => 'individual',
                'attendance_location' => 'srm',
                'assistive_technology_needed' => false,
                'assistive_technology_notes' => null,
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => "Comunicação com a fonoaudióloga assistente, mediante autorização da família, para alinhamento de estratégias comunicativas em sala de aula.",
                'training_demands' => "Formação docente sobre comunicação acessível para estudantes com deficiência auditiva, incluindo boas práticas de leitura labial e uso de legendas.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Garantir acesso integral de {$firstName} a conteúdos audiovisuais por meio de legendagem ou transcrição.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                    ['description' => "Assegurar leitura labial eficaz nas explicações orais em sala de aula.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(1)],
                ],
                'resources' => [
                    ['description' => "Transcrição escrita de conteúdos em áudio utilizados nas aulas.", 'acquisition_type' => 'to_accessibilize'],
                    ['description' => "Material de apoio visual complementar às explicações orais.", 'acquisition_type' => 'to_produce'],
                ],
            ],

            'fisica' => [
                'demand_origin' => 'family',
                'student_observation' => "{$firstName} apresenta mobilidade reduzida, com necessidade de apoio para deslocamentos mais longos e maior tempo para trocas de sala entre as aulas. Participa ativamente das atividades quando o espaço físico é adequado e acessível.",
                'student_family_listening' => "A família relata limitação de longo prazo na mobilidade, com acompanhamento em fisioterapia regular. Destacam a importância de rotas acessíveis e tempo adicional para deslocamento entre ambientes da instituição.",
                'teachers_listening' => "Os professores relatam boa participação de {$firstName} nas aulas, com necessidade pontual de adaptação de atividades que envolvam deslocamento físico amplo, como trabalhos de campo ou dinâmicas em espaços externos.",
                'other_info' => "Utiliza transporte escolar adaptado.",
                'care_network_notes' => "Acompanhamento fisioterapêutico semanal; sem necessidade de encaminhamento adicional no momento.",
                'potentials_interests' => "Participativo(a), organizado(a) e com bom desempenho acadêmico geral. Interesse por atividades de pesquisa e trabalhos escritos.",
                'needed_supports' => ['locomotion'],
                'needed_supports_justification' => "Necessário tempo adicional para deslocamento entre salas e adequação de atividades práticas que exijam mobilidade ampla.",
                'barriers' => [
                    ['type' => 'architectural', 'observed_situation' => "Trocas de sala entre blocos distantes, em intervalos curtos, dificultam a chegada pontual de {$firstName} às aulas seguintes.", 'participation_implication' => "Gera atrasos recorrentes e perda do início de conteúdos nas aulas seguintes."],
                    ['type' => 'methodological', 'observed_situation' => "Atividades práticas de campo realizadas em terrenos irregulares sem rota alternativa acessível.", 'participation_implication' => "Impede a participação plena em parte das atividades práticas do curso."],
                ],
                'strategies' => [
                    ['description' => "Organizar o horário de {$firstName} priorizando salas próximas entre si e conceder tolerância de alguns minutos para deslocamento entre blocos distantes.", 'linked_barrier_index' => 0],
                    ['description' => "Planejar rota alternativa acessível ou atividade equivalente para trabalhos de campo em terrenos irregulares.", 'linked_barrier_index' => 1],
                ],
                'attendance_frequency_per_week' => 1,
                'attendance_duration_minutes' => 45,
                'attendance_format' => 'individual',
                'attendance_location' => 'accessibility_center',
                'assistive_technology_needed' => false,
                'assistive_technology_notes' => null,
                'support_professional_needed' => true,
                'support_professional_justification' => "Apoio pontual em deslocamentos entre blocos distantes e em atividades práticas realizadas fora da sala de aula.",
                'intersectoral_articulation' => "Articulação com a gestão de infraestrutura do campus para avaliação de rotas acessíveis entre os blocos utilizados pelo curso.",
                'training_demands' => "Sensibilização da equipe docente sobre planejamento de atividades práticas acessíveis para estudantes com mobilidade reduzida.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Reduzir atrasos de {$firstName} nas trocas de sala por meio de reorganização de horário e tolerância de deslocamento.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                    ['description' => "Garantir participação plena em atividades práticas de campo por meio de rotas e alternativas acessíveis.", 'term' => 'medium', 'linked_barrier_id' => $barrierIds->get(1)],
                ],
                'resources' => [
                    ['description' => "Mapeamento de rotas acessíveis entre os blocos utilizados pelo curso.", 'acquisition_type' => 'to_produce'],
                ],
            ],

            'intelectual' => [
                'demand_origin' => 'teacher',
                'student_observation' => "{$firstName} apresenta ritmo de aprendizagem mais lento em relação à média da turma, necessitando de repetição e exemplificação concreta dos conteúdos. Demonstra bom vínculo com os colegas e participa das atividades quando adaptadas ao seu nível de compreensão.",
                'student_family_listening' => "A família relata diagnóstico de deficiência intelectual leve, com acompanhamento psicopedagógico. Destacam que {$firstName} aprende melhor por meio de exemplos práticos e repetição, e que avanços graduais devem ser valorizados.",
                'teachers_listening' => "Os professores relatam necessidade de simplificação de enunciados e de tempo adicional para realização de atividades. Observam que {$firstName} se engaja bem em tarefas com instruções passo a passo e apoio visual.",
                'other_info' => "Sem restrições alimentares ou de transporte relatadas.",
                'care_network_notes' => "Acompanhamento psicopedagógico quinzenal; sem necessidade de encaminhamento adicional no momento.",
                'potentials_interests' => "Sociável, colaborativo(a) e com boa disposição para tarefas práticas e manuais. Demonstra progresso consistente quando as expectativas são adequadas ao seu ritmo.",
                'needed_supports' => ['pedagogical_adaptation', 'communication'],
                'needed_supports_justification' => "Necessária adaptação curricular com simplificação de linguagem, exemplos concretos e tempo adicional para realização de atividades avaliativas.",
                'barriers' => [
                    ['type' => 'methodological', 'observed_situation' => "Enunciados de atividades e avaliações com linguagem complexa e múltiplos comandos simultâneos dificultam a compreensão de {$firstName}.", 'participation_implication' => "Reduz o desempenho em avaliações mesmo quando o conteúdo de base é compreendido."],
                    ['type' => 'social', 'observed_situation' => "Tempo padrão de realização de provas é insuficiente para o ritmo de processamento do estudante.", 'participation_implication' => "Gera entregas incompletas e avaliação aquém do conhecimento real demonstrado."],
                ],
                'strategies' => [
                    ['description' => "Simplificar a linguagem de enunciados, apresentando um comando por vez com apoio de exemplos concretos.", 'linked_barrier_index' => 0],
                    ['description' => "Conceder tempo adicional (até 50%) para realização de atividades avaliativas.", 'linked_barrier_index' => 1],
                ],
                'attendance_frequency_per_week' => 2,
                'attendance_duration_minutes' => 50,
                'attendance_format' => 'individual',
                'attendance_location' => 'srm',
                'assistive_technology_needed' => false,
                'assistive_technology_notes' => null,
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => null,
                'training_demands' => "Formação docente sobre adaptação curricular significativa e elaboração de material didático simplificado.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Melhorar a compreensão de enunciados de {$firstName} por meio de simplificação de linguagem e exemplos concretos.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                    ['description' => "Garantir avaliação condizente com o conhecimento real do estudante por meio de tempo adicional.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(1)],
                ],
                'resources' => [
                    ['description' => "Banco de atividades e avaliações com linguagem simplificada por disciplina.", 'acquisition_type' => 'to_produce'],
                ],
            ],

            'altas_habilidades' => [
                'demand_origin' => 'teacher',
                'student_observation' => "{$firstName} demonstra desempenho acima da média em diversas disciplinas, concluindo atividades propostas rapidamente e demonstrando interesse por desafios adicionais. Em alguns momentos, apresenta sinais de desmotivação diante de tarefas repetitivas ou abaixo do seu nível de domínio.",
                'student_family_listening' => "A família relata identificação de altas habilidades/superdotação, com interesse em projetos de enriquecimento curricular. Destacam que {$firstName} se frustra com atividades repetitivas e se beneficia de desafios complementares.",
                'teachers_listening' => "Os professores relatam que {$firstName} termina as atividades rapidamente e, por vezes, demonstra tédio ou dispersão quando não há desafio adicional disponível. Observam potencial para liderança em projetos de pesquisa e aprofundamento de conteúdo.",
                'other_info' => "Sem restrições de transporte ou alimentação relatadas.",
                'care_network_notes' => "Sem acompanhamento clínico em andamento; identificação realizada pela escola em articulação com a família.",
                'potentials_interests' => "Alto desempenho acadêmico, criatividade e interesse por projetos de pesquisa e aprofundamento em temas específicos do curso de {$firstName}.",
                'needed_supports' => ['none'],
                'needed_supports_justification' => "Não há apoio de acessibilidade necessário; recomenda-se enriquecimento curricular e projetos de aprofundamento como estratégia pedagógica.",
                'barriers' => [
                    ['type' => 'methodological', 'observed_situation' => "Ausência de atividades de aprofundamento ou desafio adicional após a conclusão antecipada das tarefas propostas.", 'participation_implication' => "Gera desmotivação e dispersão em sala de aula após a conclusão das atividades regulares."],
                ],
                'strategies' => [
                    ['description' => "Oferecer atividades de aprofundamento e projetos de enriquecimento curricular alinhados aos interesses do estudante.", 'linked_barrier_index' => 0],
                ],
                'attendance_frequency_per_week' => 1,
                'attendance_duration_minutes' => 50,
                'attendance_format' => 'individual',
                'attendance_location' => 'accessibility_center',
                'assistive_technology_needed' => false,
                'assistive_technology_notes' => null,
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => null,
                'training_demands' => "Formação docente sobre identificação e atendimento de estudantes com altas habilidades/superdotação e elaboração de projetos de enriquecimento curricular.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Ampliar o engajamento de {$firstName} por meio de projetos de enriquecimento curricular alinhados a seus interesses.", 'term' => 'medium', 'linked_barrier_id' => $barrierIds->get(0)],
                ],
                'resources' => [
                    ['description' => "Banco de projetos de aprofundamento e desafios complementares por disciplina.", 'acquisition_type' => 'to_produce'],
                ],
            ],

            'default' => [
                'demand_origin' => 'teacher',
                'student_observation' => "{$firstName} participa das atividades escolares de forma regular, mas a equipe pedagógica identificou a necessidade de um acompanhamento mais próximo para compreender melhor seu perfil de aprendizagem e eventuais dificuldades ainda não formalmente diagnosticadas.",
                'student_family_listening' => "A família relata não possuir diagnóstico fechado até o momento, mas observa, em casa, sinais de dificuldade em manter a concentração em tarefas longas e solicita apoio da escola para melhor compreensão do caso.",
                'teachers_listening' => "Os professores relatam desempenho irregular, com bons resultados em algumas disciplinas e dificuldades pontuais em outras, sem um padrão claro identificado até o momento, o que motivou o encaminhamento ao NAPNE para investigação pedagógica mais aprofundada.",
                'other_info' => "Sem informações adicionais relevantes registradas pela família até o momento.",
                'care_network_notes' => "Sem acompanhamento clínico externo relatado; caso em fase de investigação pedagógica pela equipe do NAPNE.",
                'potentials_interests' => "Demonstra interesse pelas disciplinas práticas do curso e bom relacionamento interpessoal com os colegas de turma.",
                'needed_supports' => ['pedagogical_adaptation'],
                'needed_supports_justification' => "Apoio pedagógico recomendado enquanto o processo de investigação do perfil de aprendizagem do estudante está em andamento.",
                'barriers' => [
                    ['type' => 'methodological', 'observed_situation' => "Dificuldade de manutenção de foco em atividades expositivas longas, sem causa pedagógica ou clínica ainda esclarecida.", 'participation_implication' => "Compromete parcialmente o acompanhamento de conteúdos apresentados de forma extensa e contínua."],
                ],
                'strategies' => [
                    ['description' => "Monitorar o desempenho do estudante por período determinado, com checagens periódicas de compreensão durante as aulas.", 'linked_barrier_index' => 0],
                ],
                'attendance_frequency_per_week' => 1,
                'attendance_duration_minutes' => 45,
                'attendance_format' => 'individual',
                'attendance_location' => 'srm',
                'assistive_technology_needed' => false,
                'assistive_technology_notes' => null,
                'support_professional_needed' => false,
                'support_professional_justification' => null,
                'intersectoral_articulation' => null,
                'training_demands' => "Acompanhamento conjunto com a equipe pedagógica para investigação do perfil de aprendizagem do estudante.",
                'objectives' => fn ($barrierIds) => [
                    ['description' => "Identificar com maior precisão o perfil de aprendizagem de {$firstName} por meio de observação sistemática.", 'term' => 'short', 'linked_barrier_id' => $barrierIds->get(0)],
                ],
                'resources' => [
                    ['description' => "Ficha de observação pedagógica periódica preenchida pelos professores do curso.", 'acquisition_type' => 'to_produce'],
                ],
            ],
        ];

        return $profiles[$key] ?? $profiles['default'];
    }

    private function normalizeDeficiency(?string $name): string
    {
        if ($name === null) {
            return 'default';
        }

        $name = mb_strtolower($name);

        return match (true) {
            str_contains($name, 'tea') || str_contains($name, 'autis') => 'tea',
            str_contains($name, 'tdah') || str_contains($name, 'atenção') => 'tdah',
            str_contains($name, 'vis') || str_contains($name, 'cegueira') => 'visao',
            str_contains($name, 'audit') || str_contains($name, 'surdez') => 'auditiva',
            str_contains($name, 'física') || str_contains($name, 'fisica') => 'fisica',
            str_contains($name, 'intelectual') => 'intelectual',
            str_contains($name, 'altas habilidades') => 'altas_habilidades',
            default => 'default',
        };
    }

    /**
     * Gera o conteúdo detalhado de uma adaptação de PEI por disciplina,
     * variando o texto conforme a disciplina e o perfil do estudante.
     *
     * @return array<string, string|null>
     */
    private function disciplineProfile(string $disciplineName, string $firstName, ?string $deficiencyName): array
    {
        $deficiencyLabel = $deficiencyName ?? 'necessidades pedagógicas específicas em investigação';

        return [
            'specific_objectives' => "Adaptar os objetivos de {$disciplineName} para que {$firstName} desenvolva as competências essenciais do componente curricular, considerando seu perfil de aprendizagem relacionado a {$deficiencyLabel}, com foco na compreensão prática dos conteúdos antes do avanço para níveis de maior abstração.",
            'content_programmatic' => "Seleção dos conteúdos prioritários de {$disciplineName} para o período letivo, organizados em unidades menores e sequenciais, com retomada de pré-requisitos sempre que necessário e apresentação de exemplos contextualizados à realidade do estudante.",
            'methodologies' => "- Uso de recursos visuais, esquemas e mapas conceituais como apoio às explicações de {$disciplineName};\n- Divisão das atividades em etapas menores, com checagem de compreensão a cada etapa;\n- Tempo adicional para realização de atividades em sala e para avaliações formais;\n- Mediação individualizada do professor durante exercícios práticos, quando necessário.",
            'evaluations' => "- Avaliação processual e contínua, considerando a evolução ao longo do semestre;\n- Possibilidade de avaliação oral ou com apoio de material de consulta, quando pertinente ao conteúdo de {$disciplineName};\n- Enunciados revisados para clareza e objetividade, evitando ambiguidades;\n- Tempo adicional de até 50% em provas formais.",
            'opinion' => "{$firstName} vem demonstrando evolução gradual em {$disciplineName} desde a implementação das adaptações descritas, com maior engajamento em atividades práticas e progressiva autonomia na realização de exercícios. Recomenda-se manter o acompanhamento próximo e revisar as estratégias ao final do semestre letivo, em articulação com o PAEE vigente.",
            'complementary_records' => "Registros de acompanhamento serão atualizados a cada bimestre pelo professor responsável, com cópia à Assessoria Pedagógica do NAPNE para fins de monitoramento do Plano de Atendimento Educacional Especializado.",
        ];
    }
}
