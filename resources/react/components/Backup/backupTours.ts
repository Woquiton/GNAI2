import { helpUrls } from '@/components/Help/Help.routes';
import type { TableListTourConfig } from '@/components/Tables/TableList/TableList';
import type { GuidedTourPageConfig } from '@/components/UI/GuidedTour/GuidedTour.types';

/** Valores de `data-tour` da listagem e dos detalhes do backup. */
export const BACKUP_TOUR_TARGETS = {
    retention: 'backup-retention',
    details: 'backup-details',
    detailsActions: 'backup-details-actions',
} as const;

const targets = BACKUP_TOUR_TARGETS;
const HELP_SLUG = 'backups';

/** Os botões que geram, importam, restauram, baixam ou excluem só são explicados, nunca acionados. */
export const backupListTour: TableListTourConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'consultar-os-backups'),
    actions: [
        'Gerar Novo faz uma cópia de segurança agora. Aguarde até o fim: os botões ficam indisponíveis enquanto a cópia é feita.',
        'Importar Backup envia um arquivo ZIP do seu computador, de até 100 MB. Alguns botões só aparecem para quem tem permissão.',
    ],
    filters: [
        'Digite parte do nome do Arquivo ZIP ou escolha o Status e o Responsável para encontrar uma cópia.',
        'A lista se atualiza sozinha enquanto você digita ou escolhe uma opção.',
    ],
    table: [
        'Cada linha é uma cópia de segurança, com o status, o tamanho, a data e o responsável. As cópias automáticas aparecem com o responsável Sistema.',
        'No fim da linha, você pode baixar o arquivo, restaurar o sistema, ver os detalhes ou excluir. Restaurar só aparece nas cópias com status Sucesso e pede a sua senha antes de começar.',
    ],
    steps: [
        {
            id: 'backup-retention',
            target: targets.retention,
            title: 'Política de Armazenamento',
            content: [
                'Este aviso mostra a pasta do servidor onde as cópias ficam guardadas.',
                'As cópias mais antigas são apagadas sozinhas. A regra que vale é a definida em Configurações, na parte de Backups.',
            ],
        },
    ],
};

export const backupShowTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'ver-os-detalhes-ou-excluir-um-backup'),
    steps: [
        {
            id: 'backup-details',
            target: targets.details,
            title: 'Informações do Backup',
            content: [
                'Aqui aparecem o nome do arquivo, o caminho no servidor, o tamanho, a data de geração, o responsável e o status da cópia.',
                'Só as cópias com status Sucesso podem ser usadas para restaurar o sistema.',
            ],
        },
        {
            id: 'backup-details-actions',
            target: targets.detailsActions,
            title: 'Ações do backup',
            content: [
                'Baixar Backup salva o arquivo ZIP no seu computador. Voltar leva para a lista de backups.',
                'Excluir apaga o arquivo e o registro depois de pedir confirmação. Alguns botões só aparecem para quem tem permissão.',
            ],
        },
    ],
};
