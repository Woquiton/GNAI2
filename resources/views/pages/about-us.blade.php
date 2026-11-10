@php
    $featureGroups = [
        'atendimento' => 'Atendimento',
        'planos' => 'Planos e acompanhamento',
        'recursos' => 'Recursos e acessibilidade',
        'gestao' => 'Gestão do núcleo',
        'comunicacao' => 'Comunicação',
        'sistema' => 'Sistema',
    ];
    $features = [
        ['atendimento', 'Alunos', 'Cadastro, prontuário e acompanhamento dos estudantes atendidos pelo núcleo.', 'bi bi-person'],
        ['atendimento', 'Solicitações de Atendimento', 'Acolhimento das demandas, análise, encaminhamentos e acompanhamento das solicitações.', 'bi bi-file-earmark-text'],
        ['atendimento', 'Responsáveis', 'Contatos e vínculos dos responsáveis com cada aluno.', 'bi bi-person-hearts'],
        ['atendimento', 'Documentos do Aluno', 'Laudos, avaliações e outros documentos reunidos no prontuário.', 'bi bi-folder2-open'],
        ['atendimento', 'Histórico Acadêmico', 'Matrículas, cursos e acompanhamento do período do aluno por semestre.', 'bi bi-clock-history'],
        ['atendimento', 'Agendamentos', 'Agenda de atendimentos, participantes, cancelamentos e registro de presença.', 'bi bi-calendar-check'],
        ['atendimento', 'Fila de Espera', 'Acompanhamento dos estudantes e profissionais que aguardam itens para empréstimo.', 'bi bi-hourglass-split'],
        ['atendimento', 'Atendimentos Especializados', 'Registros, avaliações e histórico dos atendimentos educacionais especializados.', 'bi bi-clipboard2-check'],
        ['atendimento', 'Atendimentos Pedagógicos', 'Acompanhamentos dos alunos, presença dos responsáveis e histórico pedagógico.', 'bi bi-chat-square-text'],
        ['planos', 'Estudos de Caso', 'Observação, escuta, barreiras e estratégias para compreender as necessidades do aluno.', 'bi bi-clipboard-data'],
        ['planos', 'PAEEs', 'Planos de Atendimento Educacional Especializado, com objetivos, recursos e revisões.', 'bi bi-signpost-split'],
        ['planos', 'PEIs', 'Planos Educacionais Individualizados e adaptações por disciplina, com histórico de revisões.', 'bi bi-file-text'],
        ['recursos', 'Itens', 'Catálogo unificado de tecnologias assistivas e materiais pedagógicos acessíveis.', 'bi bi-box-seam'],
        ['recursos', 'Empréstimos', 'Disponibilidade dos itens, empréstimos, devoluções e acompanhamento dos prazos.', 'bi bi-arrow-left-right'],
        ['recursos', 'Barreiras', 'Registro e acompanhamento das barreiras de acessibilidade da instituição.', 'bi bi-slash-circle'],
        ['recursos', 'Vistorias e Evidências', 'Histórico de vistorias, fotos e arquivos relacionados a itens e barreiras.', 'bi bi-search'],
        ['gestao', 'Relatórios', 'Seleção de dados, filtros e geração de relatórios para acompanhar o trabalho do núcleo.', 'bi bi-bar-chart'],
        ['gestao', 'Equipe', 'Cadastro dos profissionais, cargos e permissões de acesso.', 'bi bi-person-badge'],
        ['gestao', 'Professores', 'Cadastro e vínculos com cursos e disciplinas por semestre.', 'bi bi-mortarboard'],
        ['gestao', 'Portal do Professor', 'Acesso dos professores aos alunos e às adaptações curriculares sob sua responsabilidade.', 'bi bi-easel'],
        ['gestao', 'Pessoas', 'Cadastro unificado de alunos, responsáveis, professores e profissionais.', 'bi bi-people'],
        ['gestao', 'Perfis de Atendimento', 'Perfis e condições associados às necessidades de acompanhamento dos alunos.', 'bi bi-heart-pulse'],
        ['gestao', 'Cargos', 'Funções da equipe e permissões de acesso aos recursos do sistema.', 'bi bi-briefcase'],
        ['gestao', 'Semestres', 'Calendário letivo e vínculos dos registros com seus períodos de referência.', 'bi bi-calendar3'],
        ['gestao', 'Cursos', 'Matriz curricular, períodos e organização dos vínculos acadêmicos.', 'bi bi-mortarboard'],
        ['gestao', 'Disciplinas', 'Componentes curriculares dos cursos e vínculos com professores.', 'bi bi-journal-bookmark'],
        ['gestao', 'Recursos de Acessibilidade', 'Classificação dos recursos de acessibilidade associados aos itens.', 'bi bi-universal-access'],
        ['gestao', 'Etiquetas', 'Organização de pessoas, publicações e mensagens com etiquetas por contexto.', 'bi bi-tags'],
        ['gestao', 'Categorias de Barreiras', 'Classificação das barreiras físicas, comunicacionais e de outras naturezas.', 'bi bi-grid'],
        ['gestao', 'Instituições', 'Cadastro das instituições e de suas informações de localização.', 'ti-home'],
        ['gestao', 'Localizações', 'Pontos de referência, salas e setores vinculados às instituições.', 'bi bi-geo-alt'],
        ['comunicacao', 'Pendências', 'Responsáveis, prioridades, prazos e acompanhamento das tarefas do núcleo.', 'bi bi-exclamation-triangle'],
        ['comunicacao', 'Publicações', 'Notícias, eventos, comunicados e outros conteúdos do site institucional.', 'bi bi-megaphone'],
        ['comunicacao', 'Personalização do Site', 'Organização das seções, identidade e informações do site público.', 'bi bi-palette'],
        ['comunicacao', 'Notificações', 'Avisos e atualizações relacionados às operações do sistema.', 'bi bi-bell'],
        ['sistema', 'Dashboard', 'Indicadores, atalhos e atividades recentes do núcleo.', 'bi bi-speedometer2'],
        ['sistema', 'Inbox', 'Consulta dos e-mails enviados, respostas recebidas e acompanhamento das entregas.', 'bi bi-envelope'],
        ['sistema', 'Configurações', 'Preferências e parâmetros de funcionamento da instalação.', 'bi bi-gear'],
        ['sistema', 'Auditoria', 'Consulta ao histórico de alterações e aos responsáveis pelas operações.', 'bi bi-shield-check'],
        ['sistema', 'Backups', 'Geração, envio, download e restauração de cópias de segurança.', 'bi bi-cloud-arrow-down'],
        ['sistema', 'Ajuda e Tutoriais', 'Orientações na Central de Ajuda e tutoriais ao vivo nas telas do sistema.', 'bi bi-question-circle'],
        ['sistema', 'Acessibilidade', 'Alto contraste, ajuste de tamanho e recursos de navegação por teclado.', 'bi bi-universal-access'],
        ['sistema', 'Acesso e Permissões', 'Autenticação, recuperação de senha e autorização por perfil e permissão.', 'bi bi-shield-lock'],
    ];
@endphp
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sobre o Sistema, GNAI</title>
    <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    @viteReactRefresh
    @vite(['resources/js/about.tsx', 'resources/css/pages/about-us.css'])
</head>
<body>
    <div id="about-content" class="siteLayout" data-site-contrast="0" data-site-alignment="0">
    <a class="about-skip" href="#conteudo">Pular para o conteúdo</a>
    <a href="{{ route('login') }}" class="access-btn" aria-label="Acessar o sistema">
        <i class="bi bi-box-arrow-in-right"></i>
        <span>Acessar o Sistema</span>
    </a>

    <main id="conteudo" class="siteLayout__main" tabindex="-1">
    <section class="hero">
        <div class="hero-bg">
            <div class="hero-orb hero-orb-1"></div>
            <div class="hero-orb hero-orb-2"></div>
        </div>

        <div class="hero-content">
            <div class="hero-badge">
                <span class="hero-badge-dot"></span>
                Instituto Federal Baiano, Campus Guanambi · 2026
            </div>

            <h1 class="hero-title">
                Sistema <span>GNAI</span>
            </h1>

            <p class="hero-sub">
                Gestor de Núcleos de Acessibilidade e Inclusão.
                Plataforma completa para apoio à gestão educacional inclusiva,
                acompanhamento de estudantes, Estudos de Caso, PAEEs, PEIs e recursos de acessibilidade.
            </p>

            <div class="hero-stats">
                <div class="hero-stat">
                    <span class="hero-stat-num">{{ count($features) }}</span>
                    <span class="hero-stat-label">Funcionalidades</span>
                </div>
                <div class="hero-stat">
                    <span class="hero-stat-num">2</span>
                    <span class="hero-stat-label">Módulos integrados</span>
                </div>
            </div>
        </div>

        <div class="hero-scroll">
            <div class="hero-scroll-line"></div>
            Explore a página
        </div>
    </section>

    <section class="features-section">
        <div class="container">
            <div class="features-header">
                <p class="section-label">Funcionalidades</p>
                <h2 class="section-title">Tudo que você precisa<br>em um só lugar</h2>
                <p class="section-desc">
                    O Gnai integra o <strong>Atendimento Educacional Especializado</strong>
                    e o <strong>Radar Inclusivo</strong>. As funcionalidades abaixo seguem os grupos atuais
                    do menu, do acolhimento ao acompanhamento e à gestão do núcleo.
                </p>
            </div>

            <div class="feature-tabs" role="group" aria-label="Filtrar funcionalidades por área">
                <button type="button" class="feature-tab active" aria-pressed="true" aria-controls="featuresGrid" onclick="filterFeatures('all', this)">Todos</button>
                @foreach ($featureGroups as $key => $label)
                    <button type="button" class="feature-tab" aria-pressed="false" aria-controls="featuresGrid" onclick="filterFeatures('{{ $key }}', this)">{{ $label }}</button>
                @endforeach
            </div>

            <div class="features-grid" id="featuresGrid">
                @foreach ($features as [$group, $name, $description, $icon])
                    <div class="feature-card" data-cat="{{ $group }}">
                        <div class="feature-icon {{ ['purple', 'violet', 'green', 'pink'][$loop->index % 4] }}" aria-hidden="true"><i class="{{ $icon }}"></i></div>
                        <div><h3 class="feature-name">{{ $name }}</h3><p class="feature-desc">{{ $description }}</p></div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <section class="sistemas-section">
        <div class="container">
            <div class="sistemas-header">
                <p class="section-label">Arquitetura</p>
                <h2 class="section-title">Dois módulos,<br>uma plataforma</h2>
                <p class="section-desc">
                    O GNAI integra o ciclo completo do atendimento inclusivo, do acompanhamento
                    individual do aluno à gestão dos recursos e acessibilidade da instituição.
                </p>
            </div>

            <div class="sistemas-grid">

                <div class="sistema-card sistema-aee">
                    <div class="sistema-card-header">
                        <div class="sistema-icon"><i class="bi bi-people-fill"></i></div>
                        <div>
                            <div class="sistema-name">Atendimento Educacional Especializado</div>
                            <div class="sistema-tagline">Foco no aluno e na equipe</div>
                        </div>
                    </div>
                    <ul class="sistema-items">
                        <li><i class="bi bi-check2"></i> Alunos, responsáveis e solicitações de atendimento</li>
                        <li><i class="bi bi-check2"></i> Equipe de profissionais</li>
                        <li><i class="bi bi-check2"></i> Professores vinculados</li>
                        <li><i class="bi bi-check2"></i> Documentos e histórico acadêmico</li>
                        <li><i class="bi bi-check2"></i> Estudos de Caso, PAEEs e PEIs</li>
                        <li><i class="bi bi-check2"></i> Atendimentos Especializados</li>
                        <li><i class="bi bi-check2"></i> Atendimentos pedagógicos</li>
                        <li><i class="bi bi-check2"></i> Controle de pendências</li>
                    </ul>
                </div>

                <div class="sistemas-divisor">
                    <div class="sistemas-divisor-line"></div>
                    <div class="sistemas-divisor-badge">
                        <i class="bi bi-link-45deg"></i>
                        integrados
                    </div>
                    <div class="sistemas-divisor-line"></div>
                </div>

                <div class="sistema-card sistema-radar">
                    <div class="sistema-card-header">
                        <div class="sistema-icon"><i class="bi bi-broadcast"></i></div>
                        <div>
                            <div class="sistema-name">Radar Inclusivo</div>
                            <div class="sistema-tagline">Foco nos recursos e na instituição</div>
                        </div>
                    </div>
                    <ul class="sistema-items">
                        <li><i class="bi bi-check2"></i> Itens: tecnologias assistivas e materiais acessíveis</li>
                        <li><i class="bi bi-check2"></i> Registro de barreiras</li>
                        <li><i class="bi bi-check2"></i> Vistorias e evidências</li>
                        <li><i class="bi bi-check2"></i> Empréstimos de recursos</li>
                        <li><i class="bi bi-check2"></i> Fila de espera</li>
                        <li><i class="bi bi-check2"></i> Perfis e recursos de acessibilidade</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section class="team-section">
        <div class="container">
            <p class="section-label">Equipe</p>
            <h2 class="section-title">Quem construiu o GNAI</h2>
            <p class="section-desc">
                Projeto desenvolvido por estudantes do curso de Análise e Desenvolvimento de Sistemas
                do IF Baiano, Campus Guanambi, com orientação docente.
            </p>

            <div class="team-grid">

                <div class="team-card">
                    <div class="team-avatar" id="avatar-djavan">
                        <img src="{{ asset('images/team/djavan.jpg') }}"
                             alt="Foto de Djavan Teixeira Lopes"
                             onerror="this.parentElement.innerHTML='DT'">
                    </div>
                    <span class="team-role-badge role-dev">Desenvolvimento</span>
                    <div class="team-name">Djavan Teixeira Lopes</div>
                    <a href="mailto:djavanlopesteixeira@gmail.com" class="team-email">
                        <i class="bi bi-envelope"></i> djavanlopesteixeira@gmail.com
                    </a>
                    <a href="https://github.com/Djavantl" target="_blank" rel="noopener noreferrer" class="team-email">
                        <i class="bi bi-github"></i> github.com/Djavantl
                    </a>
                </div>

                <div class="team-card">
                    <div class="team-avatar">
                        <img src="{{ asset('images/team/marley.jpg') }}"
                             alt="Foto de Marley Teixeira Meira"
                             onerror="this.parentElement.innerHTML='MT'">
                    </div>
                    <span class="team-role-badge role-dev">Desenvolvimento</span>
                    <div class="team-name">Marley Teixeira Meira</div>
                    <a href="mailto:mxrlrey@gmail.com" class="team-email">
                        <i class="bi bi-envelope"></i> mxrlrey@gmail.com
                    </a>
                    <a href="https://github.com/Mxrlrey" target="_blank" rel="noopener noreferrer" class="team-email">
                        <i class="bi bi-github"></i> github.com/Mxrlrey
                    </a>
                </div>

                <div class="team-card">
                    <div class="team-avatar">
                        <img src="{{ asset('images/team/woquiton.jpg') }}"
                             alt="Foto de Prof. Woquiton Fernandes"
                             onerror="this.parentElement.innerHTML='WF'">
                    </div>
                    <span class="team-role-badge role-orient">Orientação</span>
                    <div class="team-name">Prof. Woquiton Fernandes</div>
                    <a href="mailto:woquiton@gmail.com" class="team-email">
                        <i class="bi bi-envelope"></i> woquiton@gmail.com
                    </a>
                    <a href="https://github.com/Woquiton" target="_blank" rel="noopener noreferrer" class="team-email">
                        <i class="bi bi-github"></i> github.com/Woquiton
                    </a>
                </div>
            </div>
        </div>
    </section>

    </main>
    <footer class="about-footer" id="rodape">
        <div class="about-footer-logo">GNAI</div>
        <div class="about-footer-inst">Instituto Federal Baiano, Campus Guanambi</div>
        <div class="about-footer-year">ADS · 2026 · Todos os direitos reservados</div>
    </footer>
    </div>
    <div id="about-accessibility"></div>
    <script>
        function filterFeatures(cat, btn) {
            document.querySelectorAll('.feature-tab').forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            document.querySelectorAll('.feature-card').forEach(card => {
                card.hidden = cat !== 'all' && card.dataset.cat !== cat;
            });
        }

        const obs = new IntersectionObserver(entries => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    const paused = document.getElementById('about-content').dataset.sitePauseMotion === 'true';
                    setTimeout(() => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                    }, paused ? 0 : (i % 6) * 60);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        const readingMotion = new MutationObserver(() => {
            if (document.getElementById('about-content').dataset.sitePauseMotion !== 'true') return;
            document.querySelectorAll('.feature-card, .team-card').forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'none';
                obs.unobserve(card);
            });
        });
        readingMotion.observe(document.getElementById('about-content'), {
            attributes: true,
            attributeFilter: ['data-site-pause-motion'],
        });

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelectorAll('.feature-card, .team-card').forEach(c => {
            if (reduceMotion) return;
            c.style.opacity = '0';
            c.style.transform = 'translateY(16px)';
            c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            obs.observe(c);
        });
    </script>
</body>
</html>
