/** Formatação de valores para exibição em pt-BR. Ausência de valor é representada por "---". */
const EMPTY = '---';

/** `AAAA-MM-DD` (ou data/hora ISO) para `DD/MM/AAAA`, sem conversão de fuso. */
export function dateLabel(value: string | null | undefined): string {
    if (!value) {
        return EMPTY;
    }

    const [year, month, day] = value.slice(0, 10).split('-');

    return day && month && year ? `${day}/${month}/${year}` : EMPTY;
}

/** Data e hora curtas no fuso do navegador. */
export function dateTimeLabel(value: string | null | undefined): string {
    if (!value) {
        return EMPTY;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return dateLabel(value);
    }

    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
        date,
    );
}

/** Tamanho de arquivo em MB com duas casas decimais. */
export function fileSizeLabel(bytes: number | null | undefined): string {
    if (bytes == null || Number.isNaN(bytes)) {
        return EMPTY;
    }

    const megabytes = (bytes / 1024 / 1024).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `${megabytes} MB`;
}
