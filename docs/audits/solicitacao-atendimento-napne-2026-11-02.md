# Auditoria: solicitação inicial de atendimento ao núcleo de inclusão

Data: 02/11/2026. Base do código: commit `31577555`.

Escopo: extração do ODT fornecido, comparação com os contratos e telas existentes do Gnai e pesquisa em fontes oficiais. Nenhuma funcionalidade, regra de negócio ou banco foi alterado. Esta auditoria não homologa runtime nem substitui a aprovação do procedimento pela instituição.

## Conclusão

O formulário é um instrumento de entrada, acolhimento e encaminhamento. O Gnai cobre partes do seu conteúdo, mas não o processo documental completo. Não deve ser tratado como equivalente a Estudo de Caso, PAEE ou PEI.

Recomenda-se uma **Solicitação de atendimento** vinculada ao aluno, anterior ao estudo de caso quando este for necessário. A identificação da demanda pode resultar em orientação pedagógica, encaminhamento para AEE, psicologia ou outro apoio. Não é adequado obrigar toda solicitação a virar PAEE/PEI.

O arquivo é identificado como institucional do IF Baiano, Campus Guanambi. A prática de solicitar atendimento também existe em outros campi e instituições. Não foi localizado, nas fontes consultadas, um modelo nacional obrigatório com os mesmos oito blocos e declarações. Não foi encontrada a publicação oficial deste ODT específico, nem seu ato de aprovação ou versão institucional. O cabeçalho do arquivo não comprova, isoladamente, sua aprovação normativa.

## 1. Inventário do documento recebido

Arquivo: `/home/marley/Downloads/a-FORMULÁRIO -SOLICITAÇÃO DE ATENDIMENTO.odt`.

Título: formulário institucional de solicitação de atendimento ao NAPNE, para alunos ingressantes. O cabeçalho identifica MEC, SETEC, IF Baiano, Campus Guanambi e Distrito de Ceraíma.

| Bloco | Campos e comportamentos extraídos |
| --- | --- |
| 1. Estudante | Nome, curso/turma e contato. |
| 2. Responsável pela solicitação | Vínculo: estudante, familiar/responsável, docente, coordenação de curso, docente do AEE, psicologia, assistência estudantil ou outro, com especificação. Não há campo próprio de nome e contato do solicitante nesse bloco; há assinatura ao final. |
| 3. Motivo | Múltipla seleção e descrição livre. Lista deficiência física, mobilidade reduzida permanente ou temporária/circunstancial; auditiva com/sem prótese e surdez; visual com cegueira, baixa visão e visão monocular; altas habilidades/superdotação; deficiência intelectual, TEA, TDAH e transtornos específicos da aprendizagem, incluindo dislexia, disortografia, disgrafia, discalculia e outro. |
| 4. Diagnóstico/investigação | Diagnóstico concluído, investigação em andamento ou não; datas/observações opcionais. O próprio formulário informa que anexar laudo conclusivo não é obrigatório. |
| 5. Documentação | Indicação de relatório médico, psicológico/neuropsicológico, atestado, relato pedagógico e outros, quando disponíveis. |
| 6. Dificuldades escolares | Relato livre de dificuldades de ensino-aprendizagem ou da vivência escolar. |
| 7. Pedido ao núcleo | Múltipla seleção: orientação aos docentes, acompanhamento pela assessoria pedagógica, encaminhamento ao AEE, psicologia institucional, adaptações pedagógicas, adaptações avaliativas, adequações físicas/organizacionais e outros. |
| 8. Ciência e assinaturas | Declarações sobre os limites do NAPNE; opção de ciência; município e data; assinatura do solicitante; assinatura do estudante maior de idade; profissional responsável pelo atendimento. |

O bloco 8 inclui uma declaração de que a formalização inicia o acompanhamento, sem aplicação retroativa de adaptações ou atendimentos. Também diferencia as atribuições do núcleo, do AEE e das instâncias que avaliam e decidem a situação acadêmica.

## 2. Cobertura no Gnai

| Conteúdo do formulário | Cobertura atual | Lacuna |
| --- | --- | --- |
| Identificação do aluno e contato | Cadastro de alunos/pessoas; cursos vinculados separadamente. | Não existe fotografia desses dados no momento de uma solicitação. O cadastro completo exige mais dados que o ODT, como nascimento, gênero, e-mail e matrícula. |
| Quem solicitou e seu vínculo | Origem da demanda e resumo de participantes no Estudo de Caso. | Não há solicitante identificado, vínculo detalhado, contato e protocolo próprios da solicitação. Autor autenticado do registro não é necessariamente o solicitante. |
| Motivos e condições relatadas | Perfis de atendimento do aluno; textos de observação e escuta. | Perfil cadastrado não equivale a condição relatada no pedido. Não há múltiplos motivos preservados como relato inicial independente. |
| Situação diagnóstica | Documentos e relatos podem conter informações clínicas. | Não há, no fluxo inicial auditado, o registro estruturado equivalente às três opções do ODT. |
| Documentos anexados | Aba Documentos do aluno, com título, tipo e arquivo. | Sem vínculo próprio ao pedido inicial. ODT não é formato aceito: hoje são aceitos PDF, DOC, DOCX, JPG, JPEG e PNG, até 10 MB. |
| Dificuldades escolares | Observação, escuta e barreiras do Estudo de Caso; motivo e evolução do atendimento pedagógico. | São registros de análise ou atendimento, não a demanda original formalizada. |
| Apoio solicitado | PAEE registra apoios, recursos e articulação; atendimento pedagógico registra encaminhamentos em texto. | Pedido do estudante/família não está separado da avaliação técnica e do encaminhamento efetivamente decidido. |
| Ciência, assinaturas e recebimento | Estudo de Caso tem status e data de aceite; auditoria registra autoria. | Não registra o texto/versionamento do termo do ODT, quem tomou ciência, assinatura do solicitante/estudante ou protocolo de recebimento. Aceite do estudo não comprova ciência desse documento. |

### Por que não reutilizar diretamente os módulos existentes?

- **Estudo de Caso:** já exige observação do estudante, escutas, aspectos favoráveis, potencialidades, apoios e status de aceite. Abrir um pedido simples por esse formulário obrigaria a preencher análises que ainda podem não ter ocorrido. Também exige semestre atual e é versionado por aluno.
- **PAEE:** exige vínculo a Estudo de Caso e define atendimento, recursos e apoios. É planejamento pedagógico, não protocolo de entrada. No Gnai, PAEE significa Plano de Atendimento Educacional Especializado.
- **PEI:** trata das adaptações curriculares e depende de PAEE vigente no fluxo atual. Não substitui o pedido inicial.
- **Atendimento pedagógico:** depende de sessão de atendimento e contém motivo, presença, acompanhamento e encaminhamentos. Não representa, por si só, um pedido ainda não atendido.
- **Fila de espera:** é para recursos indisponíveis para empréstimo, com referência ao item. Não é fila de acolhimento ou triagem de estudantes.
- **Documentos:** permite arquivar uma versão assinada convertida para PDF, como tipo Outro. Isso preserva o arquivo, mas não oferece gestão, indicadores ou encaminhamentos estruturados.

### Evidências no código

- `app/Domains/Inclusion/Application/Data/Students/CreateStudentData.php` e `StudentCourses/*`: identificação e vínculos acadêmicos.
- `app/Domains/Inclusion/Application/Data/CaseStudies/CreateCaseStudyData.php`, especialmente regras a partir da linha 38: conteúdo exigido ao iniciar o estudo.
- `app/Domains/Inclusion/Application/Actions/CaseStudies/CreateCaseStudyAction.php`: semestre atual, versão e vínculo ao aluno.
- `app/Domains/Inclusion/Domain/Models/CaseStudy.php`: aceite e data; não há assinatura ou termo específico da solicitação.
- `app/Domains/Inclusion/Application/Data/Paees/CreatePaeeData.php` e `Application/Actions/Paees/CreatePaeeAction.php`: dependência do estudo e planejamento.
- `app/Domains/Inclusion/Application/Data/PedagogicalRecords/CreatePedagogicalRecordData.php`: sessão e registro de atendimento.
- `app/Domains/Inclusion/Application/Data/StudentDocuments/CreateStudentDocumentData.php` e `Domain/Enums/StudentDocumentType.php`: anexos e tipos.
- `app/Domains/Inclusion/Application/Data/Waitlists/CreateWaitlistData.php`: fila vinculada a recurso.
- `routes/modules/inclusion.php`, formulários React dos recursos e `resources/help/{fluxo-de-acompanhamento,estudos-de-caso,paee}.md`: integração e fluxo oferecido.

## 3. Fontes oficiais e alcance das conclusões

### Documentação pedagógica nacional

O Decreto 12.686/2025, no texto atualizado com as alterações do Decreto 12.773/2025, distingue identificação de demandas, estudo de caso e documentos de planejamento. O art. 11 prevê participação do estudante/família e veda condicionar o AEE a documentos clínicos. O art. 12 trata dos documentos individualizados derivados do estudo. Isso fundamenta a separação entre relato recebido e avaliação pedagógica; não demonstra obrigação de usar este ODT específico. [Texto atualizado da Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/decret/2025/decreto-12686-20-outubro-2025-798166-normaatualizada-pe.pdf).

A Portaria MEC 421/2026 detalha PAEE e PEI e aborda os núcleos de acessibilidade nas instituições federais. O cadastro no MEC informa alteração pela Portaria 550/2026; esta altera o art. 29, sobre designação de coordenadores de intersetorialidade. Não foi identificada nesses atos uma reprodução do modelo recebido. [Portaria 421/2026, MEC Normas](https://mecnormas.mec.gov.br/pesquisa/detalhar/11240), [Portaria 550/2026, MEC Normas](https://mecnormas.mec.gov.br/pesquisa/detalhar/12723).

### Solicitação e encaminhamento como prática institucional

O IF Baiano de Uruçuca publica etapas de identificação, registro, análise inicial, encaminhamento e acompanhamento. A página diferencia solicitação docente pelo SUAP/ETEP e formulário preenchido pelo estudante no núcleo. Isso confirma uma prática institucional semelhante, sem comprovar que os campi usem um formulário único. [Fluxo oficial de Uruçuca](https://www.ifbaiano.edu.br/unidades/urucuca/napne/).

A ficha de Uruçuca identifica estudante, curso, solicitante e motivo; também reserva espaço ao servidor que recebeu, data e medidas adotadas. É um exemplo público de separar demanda e providências internas. [Ficha de encaminhamento de Uruçuca](https://www.ifbaiano.edu.br/unidades/urucuca/files/2018/02/Ficha-de-encaminhamento.pdf).

O IFSP Suzano também publica solicitação de atendimento e encaminhamento por servidor, evidenciando que esse tipo de instrumento não é exclusivo de Guanambi. [Documentos de atendimento do IFSP Suzano](https://szn.ifsp.edu.br/documentos-para-atendimento-e-ouvidoria-napne). Essa página foi consultada pelo conteúdo indexado; a abertura direta retornou bloqueio.

### Assessoria pedagógica e AEE

A Resolução IF Baiano 19/2019 descreve articulação entre docente de AEE, NAPNE, docentes e setores de apoio; seu art. 6º também prevê colaboração com demandas de aprendizagem. Não autoriza concluir que solicitar assessoria pedagógica seja o mesmo que ser admitido no AEE. É uma referência institucional histórica localizada, sem confirmação de sua vigência integral ou de todas as alterações posteriores. [Regulamento institucional de AEE](https://www.ifbaiano.edu.br/unidades/lapa/files/2019/12/Resolucao-19-2019.pdf).

## 4. Pontos que não devem ser copiados mecanicamente

1. **Condições relatadas não são diagnóstico nem elegibilidade automática.** O formulário agrupa altas habilidades dentro de um bloco de deficiência e mistura motivos de encaminhamento com classificações. No sistema, registrar o relato e deixar a avaliação da equipe em etapa própria. A Lei 14.254/2021 prevê acompanhamento para dislexia, TDAH e outros transtornos de aprendizagem; isso não equivale a enquadrar automaticamente todos no público da educação especial. [Lei 14.254/2021, texto no Senado](https://normas.leg.br/?urn=urn%3Alex%3Abr%3Afederal%3Alei%3A2021-11-30%3B14254).
2. **Sem laudo obrigatório.** Receber solicitação sem anexos e sem diagnóstico. O encaminhamento não deve afirmar que o solicitante já possui uma condição clinicamente confirmada.
3. **Não retroatividade precisa de revisão institucional.** Não converter a cláusula do ODT em renúncia de direitos nem bloqueio automático de adaptações por data. A LBI assegura serviços e adaptações razoáveis; o alcance da declaração deve ser aprovado pela instituição à luz do caso concreto. [Lei 13.146/2015, Senado](https://legis.senado.gov.br/norma/584958/publicacao/34619049).
4. **Ciência não substitui todo fundamento de tratamento de dados.** Há dados de saúde e de menores. Registrar versão do texto e autoria da manifestação, controlar acesso e distinguir ciência, assinatura e eventual consentimento. A ANPD admite bases legais dos arts. 7º ou 11 da LGPD para dados de crianças/adolescentes, com prevalência do melhor interesse. [Enunciado divulgado pela ANPD](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).
5. **Não tornar a burocracia uma barreira de acesso.** Permitir preenchimento assistido e complementação. Não criar automaticamente impedimento ao atendimento por ausência de assinatura digital, formulário externo ou laudo.
6. **Não fixar Guanambi, NAPNE ou 2026 no produto.** Identificação institucional, nomenclatura do núcleo e texto aprovado precisam refletir a instalação. O cabeçalho PDF configurável já atende parte dessa apresentação.
7. **Esclarecer o sentido de avaliação.** A declaração do ODT sobre não realizar avaliações precisa distinguir atribuição de notas e decisão de aprovação/reprovação da avaliação pedagógica usada no estudo de caso e no planejamento do AEE. Não transformar essa frase em proibição das análises pedagógicas que o próprio fluxo exige.

## 5. Proposta de incorporação, ainda não implementada

Fluxo sugerido:

`Aluno → Solicitação de atendimento → Acolhimento/análise inicial → Encaminhamento`

Se houver indicação de AEE: `Estudo de Caso → PAEE → PEI, conforme a necessidade → acompanhamento`.

Se a demanda for orientação pedagógica, psicologia ou adequação organizacional: encaminhar ao setor competente, sem forçar o percurso de PAEE/PEI. Isso é uma proposta de organização do produto, não uma determinação de que toda instituição deva usar essas mesmas etapas.

### Primeira entrega recomendada

- A equipe registra a solicitação na aba do aluno e consulta uma lista geral das demandas recebidas.
- Reutiliza identificação do aluno e vínculos acadêmicos, preservando no protocolo a situação informada na data do pedido.
- Registra solicitante, vínculo, contato, motivos relatados, dificuldades, apoios pedidos e anexos opcionais.
- Separa a resposta da equipe: recebimento, responsável, análise e encaminhamentos. Permite mais de um destino.
- Usa estados simples, como rascunho, recebida, em análise, encaminhada, concluída ou cancelada, com autoria e datas. Os nomes e regras precisam de validação funcional antes da implementação.
- Mantém o pedido original e o histórico de complementações. O estudo posterior pode aproveitar as informações mediante revisão da equipe, sem marcar escutas e avaliações como realizadas automaticamente.
- Emite PDF usando o cabeçalho configurado. Assinatura manuscrita digitalizada e manifestação autenticada são evidências diferentes; não apresentar um checkbox como assinatura digital certificada.
- Mantém o acesso sob permissões próprias do núcleo. Formulário público ou portal de estudante/responsável deve ser uma decisão de escopo posterior, não uma consequência automática desta auditoria.

Se a instituição precisar receber pedidos antes do cadastro completo do aluno, será necessário definir um pré-cadastro e sua conciliação com o cadastro oficial. O fluxo atual não fornece essa entrada mínima. Para começar com menor impacto, a primeira versão pode se limitar a alunos já cadastrados.

### Alternativa imediata sem novo módulo

Preencher o documento fora do sistema, convertê-lo para PDF e anexá-lo ao prontuário como Outro. Não classificá-lo como Laudo. Essa alternativa arquiva o documento, mas não cobre protocolo, triagem, encaminhamentos e indicadores.

## 6. Achado adicional no fluxo existente

`CreatePaeeAction.php`, linhas 34 a 42, sempre recebe um Estudo de Caso, mas permite criar PAEE com estudo ainda não concluído quando existe um documento do tipo Laudo. Não exige laudo em todos os casos, porém admite esse documento como alternativa à conclusão do estudo. Esse atalho merece revisão pedagógica específica diante da exigência de fundamentação pelo estudo de caso. Não deve ser corrigido incidentalmente ao digitalizar a solicitação, nem interpretado como substituição normativa automática do estudo por laudo.

## 7. O que falta confirmar com a instituição

- Ato de aprovação, responsável e versão vigente do formulário de Guanambi.
- Se o registro é obrigatório para todo acompanhamento do núcleo ou apenas para certos encaminhamentos.
- Quem pode solicitar e quem faz a análise inicial; como funciona a assessoria pedagógica nesse campus.
- Redação aprovada das declarações, especialmente a não retroatividade.
- Forma de ciência e assinatura de menores, maiores e responsáveis, sem impedir acesso ao apoio necessário.
- Necessidade de pré-cadastro, protocolo externo ou apresentação pública do formulário.

Parecer de produto: há uma lacuna real de registro inicial. A solução mais coerente é integrar uma solicitação própria ao prontuário e aos encaminhamentos, reutilizando os dados existentes, sem substituir o estudo de caso e o planejamento pedagógico.
