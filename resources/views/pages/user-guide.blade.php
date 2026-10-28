<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Como usar o GNAI</title>
    <link rel="icon" type="image/png" href="{{ asset('images/favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary: #4D44B5;
            --secondary: #6c63ff;
            --text: #2b2b3c;
            --muted: #6c757d;
            --bg: #f6f6fb;
            --card: #ffffff;
            --border: #e9e9f3;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.7;
        }
        a { color: var(--primary); }

        .topbar {
            position: sticky;
            top: 0;
            z-index: 20;
            background: #fff;
            border-bottom: 1px solid var(--border);
            padding: 14px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .topbar .brand {
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            color: var(--primary);
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .topbar .back-btn {
            text-decoration: none;
            font-weight: 600;
            font-size: .9rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 8px;
            background: var(--primary);
            color: #fff;
        }

        .layout {
            display: flex;
            max-width: 1180px;
            margin: 0 auto;
            align-items: flex-start;
            gap: 32px;
            padding: 32px 24px 80px;
        }

        .toc {
            position: sticky;
            top: 80px;
            flex: 0 0 240px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 18px;
        }
        .toc h6 {
            font-size: .75rem;
            text-transform: uppercase;
            letter-spacing: .05em;
            color: var(--muted);
            margin: 0 0 10px;
        }
        .toc ol {
            list-style: none;
            margin: 0;
            padding: 0;
            counter-reset: toc;
        }
        .toc li { counter-increment: toc; margin-bottom: 4px; }
        .toc a {
            display: block;
            text-decoration: none;
            color: var(--text);
            font-size: .88rem;
            font-weight: 500;
            padding: 7px 8px;
            border-radius: 8px;
        }
        .toc a:hover { background: #f1f0ff; color: var(--primary); }
        .toc a::before {
            content: counter(toc) ". ";
            color: var(--primary);
            font-weight: 700;
        }

        .content { flex: 1; min-width: 0; }

        .hero {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: #fff;
            border-radius: 18px;
            padding: 36px 32px;
            margin-bottom: 28px;
        }
        .hero h1 {
            font-family: 'Poppins', sans-serif;
            font-size: 1.9rem;
            margin: 0 0 10px;
        }
        .hero p { margin: 0; opacity: .92; max-width: 640px; }

        section.guide-section {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 28px 30px;
            margin-bottom: 22px;
            scroll-margin-top: 90px;
        }
        section.guide-section h2 {
            font-family: 'Poppins', sans-serif;
            font-size: 1.35rem;
            margin: 0 0 6px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--primary);
        }
        section.guide-section h2 i { font-size: 1.2rem; }
        .section-subtitle {
            color: var(--muted);
            font-size: .95rem;
            margin-bottom: 18px;
        }
        section.guide-section h3 {
            font-size: 1.05rem;
            margin: 22px 0 8px;
        }
        .steps {
            list-style: none;
            counter-reset: step;
            margin: 0 0 16px;
            padding: 0;
        }
        .steps li {
            counter-increment: step;
            position: relative;
            padding: 4px 0 4px 40px;
            margin-bottom: 10px;
        }
        .steps li::before {
            content: counter(step);
            position: absolute;
            left: 0;
            top: 2px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--primary);
            color: #fff;
            font-weight: 700;
            font-size: .85rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .callout {
            background: #f1f0ff;
            border-left: 4px solid var(--primary);
            border-radius: 10px;
            padding: 14px 18px;
            margin: 14px 0;
            font-size: .93rem;
        }
        .callout.warning {
            background: #fff6e6;
            border-left-color: #ff9f43;
        }
        .callout strong { display: block; margin-bottom: 4px; }

        .badge-new {
            display: inline-block;
            background: #ff6fb1;
            color: #fff;
            font-size: .68rem;
            font-weight: 700;
            padding: 2px 9px;
            border-radius: 999px;
            margin-left: 8px;
            vertical-align: middle;
        }

        .grid-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 14px;
            margin: 16px 0;
        }
        .mini-card {
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
        }
        .mini-card i { color: var(--primary); font-size: 1.3rem; margin-bottom: 8px; display: block; }
        .mini-card h4 { font-size: .95rem; margin: 0 0 6px; }
        .mini-card p { font-size: .87rem; color: var(--muted); margin: 0; }

        .flow {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            margin: 16px 0;
        }
        .flow .flow-step {
            background: #f1f0ff;
            color: var(--primary);
            font-weight: 600;
            font-size: .88rem;
            padding: 8px 14px;
            border-radius: 999px;
        }
        .flow i { color: var(--muted); }

        footer.guide-footer {
            text-align: center;
            color: var(--muted);
            font-size: .85rem;
            margin-top: 20px;
        }

        @media (max-width: 900px) {
            .layout { flex-direction: column; }
            .toc { position: static; width: 100%; flex: unset; }
        }
    </style>
</head>
<body>

<div class="topbar">
    <span class="brand"><i class="bi bi-mortarboard-fill"></i> GNAI — Guia de Uso</span>
    <a href="{{ route('dashboard') }}" class="back-btn"><i class="bi bi-arrow-left"></i> Voltar ao sistema</a>
</div>

<div class="layout">
    <nav class="toc">
        <h6>Neste guia</h6>
        <ol>
            <li><a href="#intro">O que é o GNAI</a></li>
            <li><a href="#login">Entrando no sistema</a></li>
            <li><a href="#dashboard">O Dashboard</a></li>
            <li><a href="#alunos">Cadastro de Alunos</a></li>
            <li><a href="#estudo-de-caso">Estudo de Caso</a></li>
            <li><a href="#paee">PAEE</a></li>
            <li><a href="#pei">PEI e adaptações</a></li>
            <li><a href="#atendimentos">Atendimentos</a></li>
            <li><a href="#radar">Radar Inclusivo</a></li>
            <li><a href="#professor">Portal do Professor</a></li>
            <li><a href="#duvidas">Dúvidas comuns</a></li>
        </ol>
    </nav>

    <main class="content">
        <div class="hero">
            <h1>Como usar o GNAI</h1>
            <p>
                Este guia explica, passo a passo e em linguagem simples, para que serve cada parte do
                sistema e como usá-la no dia a dia do Núcleo de Acessibilidade e Inclusão.
            </p>
        </div>

        <section id="intro" class="guide-section">
            <h2><i class="bi bi-info-circle-fill"></i> O que é o GNAI</h2>
            <p>
                O GNAI é o sistema que organiza, em um só lugar, todo o acompanhamento dos alunos
                atendidos pelo Núcleo de Acessibilidade e Inclusão (NAI). Antes feito em papel ou
                planilhas separadas, agora cada etapa do atendimento — do primeiro levantamento sobre
                o aluno até os registros de cada sessão — fica registrada, organizada e fácil de
                encontrar depois.
            </p>
            <p>O sistema tem dois grandes módulos:</p>
            <div class="grid-cards">
                <div class="mini-card">
                    <i class="bi bi-person-lines-fill"></i>
                    <h4>Atendimento Educacional Especializado (AEE)</h4>
                    <p>Tudo relacionado ao aluno: cadastro, Estudo de Caso, PAEE, PEI e os atendimentos realizados.</p>
                </div>
                <div class="mini-card">
                    <i class="bi bi-cpu"></i>
                    <h4>Radar Inclusivo</h4>
                    <p>Controle de tecnologias assistivas, materiais acessíveis, empréstimos e barreiras de acessibilidade pelo campus.</p>
                </div>
            </div>
        </section>

        <section id="login" class="guide-section">
            <h2><i class="bi bi-box-arrow-in-right"></i> Entrando no sistema</h2>
            <p class="section-subtitle">Como acessar com seu usuário.</p>
            <ul class="steps">
                <li>Acesse o endereço do sistema no navegador (ex.: <code>gnai.guanambi.com.br</code>).</li>
                <li>Informe seu e-mail e senha cadastrados e clique em <strong>Entrar</strong>.</li>
                <li>Esqueceu a senha? Use o link <strong>"Esqueci minha senha"</strong> na tela de login — você receberá um e-mail para criar uma nova.</li>
            </ul>
            <div class="callout">
                <strong>Professor sem senha cadastrada?</strong>
                Professores não precisam de login tradicional — veja a seção <a href="#professor">Portal do Professor</a>, mais abaixo, que explica o acesso por link enviado por e-mail.
            </div>
        </section>

        <section id="dashboard" class="guide-section">
            <h2><i class="bi bi-speedometer2"></i> O Dashboard</h2>
            <p class="section-subtitle">A tela inicial depois do login — uma visão geral de tudo.</p>
            <p>
                Assim que você entra no sistema, vê o <strong>Dashboard</strong>: números gerais
                (quantos alunos, quantos PEIs finalizados, agendamentos, pendências) e gráficos
                de acompanhamento.
            </p>
            <h3>Atividades recentes <span class="badge-new">Novidade</span></h3>
            <p>
                Logo no topo do Dashboard fica a lista <strong>Atividades recentes</strong>: um
                feed mostrando, em ordem do mais novo para o mais antigo, tudo que foi criado ou
                alterado no sistema — por exemplo, <em>"Estudo de Caso de Lucas Silva alterado por
                Maria em 08/10/2026 09:12"</em>.
            </p>
            <ul class="steps">
                <li>Use os filtros no topo da lista para ver só um tipo de registro (ex.: só PAEE) ou só um período (hoje, últimos 7 ou 30 dias).</li>
                <li>Clique em qualquer linha da lista para ir direto para aquele registro — se você tiver permissão para vê-lo.</li>
                <li>Clique em <strong>"Carregar mais"</strong>, no final da lista, para ver atividades mais antigas.</li>
            </ul>
            <div class="callout">
                <strong>Por que isso é útil?</strong>
                Em vez de entrar em cada aluno para saber se algo mudou, o feed mostra tudo que
                aconteceu recentemente de uma vez só — direto na tela inicial.
            </div>
        </section>

        <section id="alunos" class="guide-section">
            <h2><i class="bi bi-people-fill"></i> Cadastro de Alunos</h2>
            <p class="section-subtitle">O ponto de partida de tudo no módulo AEE.</p>
            <p>
                Antes de registrar qualquer atendimento, o aluno precisa estar cadastrado no
                sistema, com seus dados básicos (nome, curso, semestre) e, se houver, dados de
                responsáveis.
            </p>
            <ul class="steps">
                <li>No menu lateral, acesse <strong>Alunos</strong>.</li>
                <li>Clique em <strong>Novo Aluno</strong> e preencha os dados solicitados.</li>
                <li>Salve — a partir daqui, o perfil do aluno vai reunir tudo o que for feito por ele: Estudo de Caso, PAEE, PEI e atendimentos.</li>
            </ul>
            <p>
                Para acompanhar um aluno já cadastrado, basta clicar nele na lista — a página de
                perfil mostra, organizados em seções, todos os registros daquele aluno.
            </p>
        </section>

        <section id="estudo-de-caso" class="guide-section">
            <h2><i class="bi bi-journal-medical"></i> Estudo de Caso <span class="badge-new">Novidade</span></h2>
            <p class="section-subtitle">O primeiro passo depois do cadastro do aluno — entender a situação dele.</p>
            <p>
                O <strong>Estudo de Caso</strong> é o levantamento inicial e mais completo sobre o
                aluno: por que ele chegou ao NAI, o que a família e os professores observam,
                quais são as barreiras que ele enfrenta e quais potenciais e apoios ele já tem.
                É a partir dele que a equipe decide quais apoios o aluno vai precisar.
            </p>
            <div class="callout">
                <strong>Quando fazer um Estudo de Caso?</strong>
                Sempre que um aluno novo chega ao NAI e ainda não tem um levantamento desse tipo —
                ou quando a situação dele muda bastante e o levantamento antigo não reflete mais a
                realidade.
            </div>
            <h3>Passo a passo</h3>
            <ul class="steps">
                <li>Dentro do perfil do aluno (ou pelo menu <strong>Estudos de Caso</strong>), clique em <strong>Novo Estudo de Caso</strong>.</li>
                <li>Preencha as informações: motivo do encaminhamento, o que foi observado pela família e pelos professores, barreiras identificadas e os apoios já existentes.</li>
                <li>Salve como rascunho quantas vezes precisar — só fica definitivo quando você clica em <strong>Concluir</strong>.</li>
                <li>Depois de concluído, o Estudo de Caso pode ser visualizado e impresso em PDF, mas não pode mais ser editado (isso garante que o histórico fique confiável).</li>
            </ul>
            <div class="callout warning">
                <strong>Importante</strong>
                O PAEE (próxima seção) só pode ser criado depois que existe um Estudo de Caso
                concluído para o aluno — ou, em casos específicos, um laudo técnico já anexado.
            </div>
        </section>

        <section id="paee" class="guide-section">
            <h2><i class="bi bi-clipboard2-pulse"></i> PAEE <span class="badge-new">Novidade</span></h2>
            <p class="section-subtitle">Plano de Atendimento Educacional Especializado — o "plano de ação" do aluno.</p>
            <p>
                Se o Estudo de Caso é o diagnóstico da situação, o <strong>PAEE</strong> é o plano
                prático: define a frequência dos atendimentos, o formato (individual, em grupo),
                quais tecnologias assistivas e apoios de profissionais (intérprete de Libras,
                guia-intérprete, profissional de apoio) o aluno vai receber, além dos objetivos a
                serem trabalhados.
            </p>
            <h3>Passo a passo</h3>
            <ul class="steps">
                <li>No perfil do aluno (com um Estudo de Caso já concluído), clique em <strong>Novo PAEE</strong>.</li>
                <li>Preencha frequência, duração, formato e local dos atendimentos.</li>
                <li>Indique as necessidades de Tecnologia Assistiva, Comunicação Alternativa (CAA) e apoios de profissionais, com a justificativa de cada um.</li>
                <li>Cadastre os objetivos e os recursos necessários para alcançá-los.</li>
                <li>Salve — o PAEE fica vinculado ao Estudo de Caso de origem, então dá para consultar os dois juntos a qualquer momento.</li>
            </ul>
            <h3>Revisões do PAEE</h3>
            <p>
                Sempre que o PAEE é editado (por exemplo, mudou a frequência de atendimento), o
                sistema registra automaticamente uma <strong>revisão</strong>, pedindo que você
                explique <em>o que mudou</em> e <em>por quê</em> — isso cria um histórico de como o
                plano foi evoluindo ao longo do tempo.
            </p>
        </section>

        <section id="pei" class="guide-section">
            <h2><i class="bi bi-file-earmark-check-fill"></i> PEI e adaptações por disciplina <span class="badge-new">Novidade</span></h2>
            <p class="section-subtitle">Plano Educacional Individualizado — como cada disciplina se adapta ao aluno.</p>
            <p>
                O <strong>PEI</strong> é onde entram as adaptações específicas que cada professor
                vai aplicar na sua disciplina: objetivos específicos, conteúdo programático
                adaptado, metodologias, formas de avaliação e materiais necessários.
            </p>
            <div class="flow">
                <span class="flow-step">Estudo de Caso</span>
                <i class="bi bi-arrow-right"></i>
                <span class="flow-step">PAEE</span>
                <i class="bi bi-arrow-right"></i>
                <span class="flow-step">PEI por disciplina</span>
            </div>
            <h3>Passo a passo</h3>
            <ul class="steps">
                <li>No perfil do aluno, acesse a seção <strong>PEI</strong> e clique em <strong>Adicionar disciplina</strong>.</li>
                <li>Escolha a disciplina e o professor responsável.</li>
                <li>Preencha os campos de adaptação: objetivos específicos, metodologia, avaliação, materiais e tecnologia assistiva necessária.</li>
                <li>Salve — o professor daquela disciplina vai poder ver (e, se precisar, ajustar) essa adaptação pelo <a href="#professor">Portal do Professor</a>.</li>
            </ul>
            <p>
                Assim como no PAEE, toda edição de uma adaptação gera uma <strong>revisão</strong>
                registrada automaticamente, com o que mudou e por quê.
            </p>
        </section>

        <section id="atendimentos" class="guide-section">
            <h2><i class="bi bi-calendar-check-fill"></i> Atendimentos (AEE e Pedagógico)</h2>
            <p class="section-subtitle">O registro do que aconteceu em cada sessão com o aluno.</p>
            <p>
                Depois que o PAEE e o PEI definem o <em>plano</em>, os <strong>Atendimentos</strong>
                registram o que de fato aconteceu em cada encontro: presença, estratégias usadas
                naquele dia e observações da equipe.
            </p>
            <div class="grid-cards">
                <div class="mini-card">
                    <i class="bi bi-person-badge-fill"></i>
                    <h4>Atendimento AEE</h4>
                    <p>Registrado pelo profissional do AEE (ex.: sala de recursos), por aluno.</p>
                </div>
                <div class="mini-card">
                    <i class="bi bi-easel2-fill"></i>
                    <h4>Atendimento Pedagógico</h4>
                    <p>Registrado pelo pedagogo, podendo envolver um ou mais alunos na mesma sessão.</p>
                </div>
            </div>
            <ul class="steps">
                <li>Acesse o agendamento correspondente (menu <strong>Agendamentos</strong>) ou o atalho no perfil do aluno.</li>
                <li>Abra o atendimento daquela sessão e clique em <strong>Registrar</strong>.</li>
                <li>Marque presença/ausência, descreva o que foi trabalhado e salve.</li>
            </ul>
        </section>

        <section id="radar" class="guide-section">
            <h2><i class="bi bi-geo-alt-fill"></i> Radar Inclusivo</h2>
            <p class="section-subtitle">O segundo módulo do sistema — acessibilidade física e de materiais no campus.</p>
            <p>
                Separado do acompanhamento individual dos alunos, o Radar Inclusivo cuida de
                recursos e barreiras físicas do campus:
            </p>
            <div class="grid-cards">
                <div class="mini-card">
                    <i class="bi bi-cpu"></i>
                    <h4>Tecnologias Assistivas</h4>
                    <p>Cadastro dos equipamentos disponíveis (lupas, teclados adaptados, softwares etc.).</p>
                </div>
                <div class="mini-card">
                    <i class="bi bi-book"></i>
                    <h4>Materiais Pedagógicos Acessíveis</h4>
                    <p>Livros e materiais em formatos acessíveis (braile, áudio, etc.).</p>
                </div>
                <div class="mini-card">
                    <i class="bi bi-arrow-left-right"></i>
                    <h4>Empréstimos e Fila de Espera</h4>
                    <p>Controle de quem está com qual equipamento e quem está aguardando.</p>
                </div>
                <div class="mini-card">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <h4>Barreiras de Acessibilidade</h4>
                    <p>Mapa com os pontos do campus que precisam de melhorias de acessibilidade.</p>
                </div>
            </div>
        </section>

        <section id="professor" class="guide-section">
            <h2><i class="bi bi-mortarboard-fill"></i> Portal do Professor</h2>
            <p class="section-subtitle">Como um professor acessa e edita as adaptações da sua disciplina.</p>
            <p>
                Professores não usam o sistema completo — eles têm uma área própria, mais simples,
                chamada <strong>Portal do Professor</strong>.
            </p>
            <ul class="steps">
                <li>O professor recebe um e-mail com um link de acesso (sem precisar de senha).</li>
                <li>Ao clicar no link, ele entra direto no Portal do Professor, vendo apenas os alunos com quem tem vínculo (disciplinas do PEI dele).</li>
                <li>Lá, ele pode consultar o perfil do aluno e editar a adaptação da própria disciplina (objetivos, metodologia, avaliação).</li>
            </ul>
            <div class="callout">
                <strong>Precisa reenviar o link de acesso?</strong>
                Na tela de login, existe a opção <strong>"Acesso do Professor"</strong>, onde ele
                pode solicitar um novo link usando o e-mail institucional.
            </div>
        </section>

        <section id="duvidas" class="guide-section">
            <h2><i class="bi bi-question-circle-fill"></i> Dúvidas comuns</h2>
            <h3>Não consigo criar um PAEE para um aluno</h3>
            <p>Confira se já existe um Estudo de Caso <strong>concluído</strong> para esse aluno (ou um laudo técnico cadastrado). Sem isso, o sistema não libera a criação do PAEE.</p>
            <h3>Editei algo e não aparece no feed de Atividades recentes</h3>
            <p>O feed só mostra alterações feitas por aqui, nos registros de Estudo de Caso, PAEE, PEI e Atendimentos. Espere alguns segundos e atualize a página — se ainda não aparecer, confira se você tem permissão para ver aquele tipo de registro.</p>
            <h3>Não acho um aluno ou um registro</h3>
            <p>Verifique seu perfil de acesso: professores só veem alunos com quem têm vínculo; profissionais e administradores têm acesso mais amplo.</p>
        </section>

        <footer class="guide-footer">
            GNAI — Núcleo de Acessibilidade e Inclusão · Instituto Federal Baiano, Campus Guanambi
        </footer>
    </main>
</div>

</body>
</html>
