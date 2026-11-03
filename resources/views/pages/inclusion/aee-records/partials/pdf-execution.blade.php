{{-- Planejamento e execução comuns a todos os alunos do atendimento: espera $aeeRecord. --}}
<x-pdf.section-title title="Planejamento e Execução Geral" />

<x-pdf.text-area label="Atividades Realizadas" :value="$aeeRecord->activities_performed" empty="Não informado." />
<x-pdf.text-area label="Estratégias Utilizadas" :value="$aeeRecord->strategies_used" empty="Não informado." />
<x-pdf.text-area label="Recursos Utilizados" :value="$aeeRecord->resources_used" empty="Não informado." />
<x-pdf.text-area label="Observações Gerais" :value="$aeeRecord->general_observations" empty="Nenhuma observação geral." />
