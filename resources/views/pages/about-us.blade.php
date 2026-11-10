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
        ['atendimento', 'Alunos', 'Cadastro, prontuário e acompanhamento dos estudantes atendidos pelo núcleo.', 'ti-user'],
        ['atendimento', 'Solicitações de Atendimento', 'Acolhimento das demandas, análise, encaminhamentos e acompanhamento das solicitações.', 'ti-receipt'],
        ['atendimento', 'Responsáveis', 'Contatos e vínculos dos responsáveis com cada aluno.', 'fa fa-users'],
        ['atendimento', 'Documentos do Aluno', 'Laudos, avaliações e outros documentos reunidos no prontuário.', 'fa fa-folder-open-o'],
        ['atendimento', 'Histórico Acadêmico', 'Matrículas, cursos e acompanhamento do período do aluno por semestre.', 'fa fa-graduation-cap'],
        ['atendimento', 'Agendamentos', 'Agenda de atendimentos, participantes, cancelamentos e registro de presença.', 'ti-calendar'],
        ['atendimento', 'Fila de Espera', 'Acompanhamento dos estudantes e profissionais que aguardam itens para empréstimo.', 'ti-time'],
        ['atendimento', 'Atendimentos Especializados', 'Registros, avaliações e histórico dos atendimentos educacionais especializados.', 'ti-book'],
        ['atendimento', 'Atendimentos Pedagógicos', 'Acompanhamentos dos alunos, presença dos responsáveis e histórico pedagógico.', 'ti-write'],
        ['planos', 'Estudos de Caso', 'Observação, escuta, barreiras e estratégias para compreender as necessidades do aluno.', 'ti-clipboard'],
        ['planos', 'PAEEs', 'Planos de Atendimento Educacional Especializado, com objetivos, recursos e revisões.', 'ti-direction-alt'],
        ['planos', 'PEIs', 'Planos Educacionais Individualizados e adaptações por disciplina, com histórico de revisões.', 'ti-file'],
        ['recursos', 'Itens', 'Catálogo unificado de tecnologias assistivas e materiais pedagógicos acessíveis.', 'ti-package'],
        ['recursos', 'Empréstimos', 'Disponibilidade dos itens, empréstimos, devoluções e acompanhamento dos prazos.', 'ti-exchange-vertical'],
        ['recursos', 'Barreiras', 'Registro e acompanhamento das barreiras de acessibilidade da instituição.', 'ti-na'],
        ['recursos', 'Vistorias e Evidências', 'Histórico de vistorias, fotos e arquivos relacionados a itens e barreiras.', 'fa fa-search'],
        ['gestao', 'Relatórios', 'Seleção de dados, filtros e geração de relatórios para acompanhar o trabalho do núcleo.', 'ti-bar-chart'],
        ['gestao', 'Equipe', 'Cadastro dos profissionais, cargos e permissões de acesso.', 'ti-id-badge'],
        ['gestao', 'Professores', 'Cadastro e vínculos com cursos e disciplinas por semestre.', 'ti-blackboard'],
        ['gestao', 'Portal do Professor', 'Acesso dos professores aos alunos e às adaptações curriculares sob sua responsabilidade.', 'md md-school'],
        ['gestao', 'Pessoas', 'Cadastro unificado de alunos, responsáveis, professores e profissionais.', 'fa fa-users'],
        ['gestao', 'Perfis de Atendimento', 'Perfis e condições associados às necessidades de acompanhamento dos alunos.', 'ti-heart'],
        ['gestao', 'Cargos', 'Funções da equipe e permissões de acesso aos recursos do sistema.', 'ti-briefcase'],
        ['gestao', 'Semestres', 'Calendário letivo e vínculos dos registros com seus períodos de referência.', 'ti-layout-column2'],
        ['gestao', 'Cursos', 'Matriz curricular, períodos e organização dos vínculos acadêmicos.', 'ti-medall'],
        ['gestao', 'Disciplinas', 'Componentes curriculares dos cursos e vínculos com professores.', 'ti-agenda'],
        ['gestao', 'Recursos de Acessibilidade', 'Classificação dos recursos de acessibilidade associados aos itens.', 'ti-wheelchair'],
        ['gestao', 'Etiquetas', 'Organização de pessoas, publicações e mensagens com etiquetas por contexto.', 'fa fa-tags'],
        ['gestao', 'Categorias de Barreiras', 'Classificação das barreiras físicas, comunicacionais e de outras naturezas.', 'ti-layout-grid2'],
        ['gestao', 'Instituições', 'Cadastro das instituições e de suas informações de localização.', 'ti-home'],
        ['gestao', 'Localizações', 'Pontos de referência, salas e setores vinculados às instituições.', 'ti-location-pin'],
        ['comunicacao', 'Pendências', 'Responsáveis, prioridades, prazos e acompanhamento das tarefas do núcleo.', 'ti-alert'],
        ['comunicacao', 'Publicações', 'Notícias, eventos, comunicados e outros conteúdos do site institucional.', 'ti-announcement'],
        ['comunicacao', 'Personalização do Site', 'Organização das seções, identidade e informações do site público.', 'ti-palette'],
        ['comunicacao', 'Notificações', 'Avisos e atualizações relacionados às operações do sistema.', 'ti-bell'],
        ['sistema', 'Dashboard', 'Indicadores, atalhos e atividades recentes do núcleo.', 'ti-dashboard'],
        ['sistema', 'Inbox', 'Consulta dos e-mails enviados, respostas recebidas e acompanhamento das entregas.', 'ti-email'],
        ['sistema', 'Configurações', 'Preferências e parâmetros de funcionamento da instalação.', 'ti-settings'],
        ['sistema', 'Auditoria', 'Consulta ao histórico de alterações e aos responsáveis pelas operações.', 'ti-shield'],
        ['sistema', 'Backups', 'Geração, envio, download e restauração de cópias de segurança.', 'ti-cloud-down'],
        ['sistema', 'Ajuda e Tutoriais', 'Orientações na Central de Ajuda e tutoriais ao vivo nas telas do sistema.', 'ti-help-alt'],
        ['sistema', 'Acessibilidade', 'Alto contraste, ajuste de tamanho e recursos de navegação por teclado.', 'md md-accessibility'],
        ['sistema', 'Acesso e Permissões', 'Autenticação, recuperação de senha e autorização por perfil e permissão.', 'ti-lock'],
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
    @viteReactRefresh
    @vite(['resources/js/about.tsx', 'resources/css/pages/about-us.css'])
</head>
<body>
    <div id="about-content" class="siteLayout" data-site-contrast="0" data-site-alignment="0">
    <a class="about-skip" href="#conteudo">Pular para o conteúdo</a>
    <a href="{{ route('login') }}" class="access-btn" aria-label="Acessar o sistema">
        <i class="fa fa-sign-in" aria-hidden="true"></i>
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
                        <div class="feature-icon {{ ['purple', 'violet', 'green', 'pink'][$loop->index % 4] }}" aria-hidden="true"><i class="{{ $icon }}" aria-hidden="true"></i></div>
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
                        <div class="sistema-icon"><i class="fa fa-users" aria-hidden="true"></i></div>
                        <div>
                            <div class="sistema-name">Atendimento Educacional Especializado</div>
                            <div class="sistema-tagline">Foco no aluno e na equipe</div>
                        </div>
                    </div>
                    <ul class="sistema-items">
                        <li><i class="fa fa-check" aria-hidden="true"></i> Alunos, responsáveis e solicitações de atendimento</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Equipe de profissionais</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Professores vinculados</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Documentos e histórico acadêmico</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Estudos de Caso, PAEEs e PEIs</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Atendimentos Especializados</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Atendimentos pedagógicos</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Controle de pendências</li>
                    </ul>
                </div>

                <div class="sistemas-divisor">
                    <div class="sistemas-divisor-line"></div>
                    <div class="sistemas-divisor-badge">
                        <i class="ti-link" aria-hidden="true"></i>
                        integrados
                    </div>
                    <div class="sistemas-divisor-line"></div>
                </div>

                <div class="sistema-card sistema-radar">
                    <div class="sistema-card-header">
                        <div class="sistema-icon"><i class="ti-signal" aria-hidden="true"></i></div>
                        <div>
                            <div class="sistema-name">Radar Inclusivo</div>
                            <div class="sistema-tagline">Foco nos recursos e na instituição</div>
                        </div>
                    </div>
                    <ul class="sistema-items">
                        <li><i class="fa fa-check" aria-hidden="true"></i> Itens: tecnologias assistivas e materiais acessíveis</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Registro de barreiras</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Vistorias e evidências</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Empréstimos de recursos</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Fila de espera</li>
                        <li><i class="fa fa-check" aria-hidden="true"></i> Perfis e recursos de acessibilidade</li>
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
                        <i class="ti-email" aria-hidden="true"></i> djavanlopesteixeira@gmail.com
                    </a>
                    <div class="team-socials">
                        <a href="https://github.com/Djavantl" target="_blank" rel="noopener noreferrer" class="team-email">
                            <i class="fa fa-github" aria-hidden="true"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/djavan-teixeira-lopes" target="_blank" rel="noopener noreferrer" class="team-email" aria-label="LinkedIn de Djavan Teixeira Lopes (abre em nova aba)">
                            <i class="fa fa-linkedin" aria-hidden="true"></i> LinkedIn
                        </a>
                    </div>
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
                        <i class="ti-email" aria-hidden="true"></i> mxrlrey@gmail.com
                    </a>
                    <div class="team-socials">
                        <a href="https://github.com/Mxrlrey" target="_blank" rel="noopener noreferrer" class="team-email">
                            <i class="fa fa-github" aria-hidden="true"></i> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/marley-teixeira" target="_blank" rel="noopener noreferrer" class="team-email" aria-label="LinkedIn de Marley Teixeira Meira (abre em nova aba)">
                            <i class="fa fa-linkedin" aria-hidden="true"></i> LinkedIn
                        </a>
                    </div>
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
                        <i class="ti-email" aria-hidden="true"></i> woquiton@gmail.com
                    </a>
                    <a href="https://github.com/Woquiton" target="_blank" rel="noopener noreferrer" class="team-email">
                        <i class="fa fa-github" aria-hidden="true"></i> GitHub
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
