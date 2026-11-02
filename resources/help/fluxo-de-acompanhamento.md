---
titulo: Fluxo de acompanhamento do aluno
resumo: A ordem entre cadastro do aluno, Estudo de Caso, PAEE, PEI e atendimentos, e o que cada etapa exige da anterior.
categoria: Planos e acompanhamento
palavras-chave: fluxo, etapas, ordem, jornada do aluno, por onde começar, estudo de caso, paee, pei, plano de atendimento educacional especializado, plano educacional individualizado, atendimento, sequência, pré-requisito, depende, status do atendimento, laudo, decreto 12.686
ordem: 5
permissoes: case-study.view, paee.view, pei.view
---

O acompanhamento de um aluno no Gnai segue uma cadeia: cada documento usa as informações do anterior. Os Estudos de Caso, PAEEs e PEIs ficam no grupo **Planos e acompanhamento** da sidebar e também nas abas da visualização do aluno (**Atendimento → Alunos**).

## Qual é a ordem das etapas?

1. **Cadastro do aluno** (**Atendimento → Alunos**), com a situação ativa e a matrícula vigente em um curso (aba **Cursos do aluno**). O laudo, quando houver, é anexado na aba **Documentos** com o tipo **Laudo**.
2. **Estudo de Caso**: levanta a demanda, escuta, potencialidades, barreiras e estratégias. Depois de concluído, libera a criação do PAEE. Veja [Estudos de Caso](/ajuda/estudos-de-caso).
3. **PAEE** (Plano de Atendimento Educacional Especializado): define frequência, formato e local do atendimento, recursos, objetivos e apoios. É criado a partir de um Estudo de Caso. Veja [PAEE](/ajuda/paee).
4. **PEI** (Plano Educacional Individualizado): reúne as adaptações curriculares de cada disciplina, preenchidas pela equipe ou pelos professores. Só pode ser gerado com um PAEE vigente. Veja [PEI](/ajuda/pei).
5. **Atendimentos**: os registros de **Atendimentos Especializados** e **Atendimentos Pedagógicos** feitos dentro do semestre do PEI aparecem automaticamente na aba **Acompanhamento** do PEI e no PDF para a família.

## O que cada etapa exige?

| Etapa | Exige antes |
| --- | --- |
| Estudo de Caso | Aluno cadastrado e semestre atual cadastrado. Para criar uma nova versão, o Estudo de Caso atual precisa estar concluído. |
| PAEE | Um Estudo de Caso concluído (ou um laudo anexado ao aluno) e semestre atual cadastrado. |
| PEI | Aluno com situação ativa, matrícula vigente, PAEE vigente e semestre atual cadastrado. Para uma nova versão, o PEI atual precisa estar finalizado. |
| Adaptações do PEI | Disciplinas cadastradas no curso do aluno e professores vinculados a essas disciplinas no curso (**Gestão do núcleo → Professores**, botão **Gerenciar Disciplinas** na visualização do professor). |

## Onde vejo em que etapa o aluno está?

Na visualização do aluno, a lateral recolhível **Status do atendimento** mostra, em ordem, **Vínculo com curso**, **Laudo**, **Estudo de Caso**, **PAEE** e **PEI**. Os botões **Ver**, **Continuar** e **Iniciar** aparecem conforme a situação, os pré-requisitos e as permissões do usuário. A lateral também avisa quando o PAEE está com a revisão vencida ou quando o PAEE ativo não está apoiado por um Estudo de Caso concluído nem por um laudo anexado.

## Versões

Estudo de Caso, PAEE e PEI são versionados. Ao criar uma nova versão, a anterior deixa de ser a atual e continua disponível no histórico do aluno. Enquanto o PEI atual não estiver finalizado, ele passa a seguir automaticamente a versão mais nova do PAEE.
