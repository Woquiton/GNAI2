import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { peiProgressLabel } from '../Peis.constants';

interface PeiStatusLabelProps {
    pei: { is_finished: boolean };
}

/** Situação de preenchimento do PEI (finalizado ou em preenchimento). */
export default function PeiStatusLabel({ pei }: PeiStatusLabelProps): React.JSX.Element {
    return (
        <TableLabel tone={pei.is_finished ? 'success' : 'warning'}>
            {peiProgressLabel(pei)}
        </TableLabel>
    );
}
