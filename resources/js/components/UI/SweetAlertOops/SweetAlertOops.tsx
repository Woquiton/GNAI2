import { useEffect } from 'react';
import SweetAlertErrorIcon from '@/components/UI/SweetAlertErrorIcon/SweetAlertErrorIcon';
import '@styles/components/UI/SweetAlertOops/SweetAlertOops.css';

interface SweetAlertOopsProps {
    message: string;
    onClose: () => void;
    title?: string;
}

export default function SweetAlertOops({
    message,
    onClose,
    title = 'Ops...',
}: SweetAlertOopsProps): React.JSX.Element {
    useEffect(() => {
        document.documentElement.classList.add('stop-scrolling');
        document.body.classList.add('stop-scrolling');

        return () => {
            document.documentElement.classList.remove('stop-scrolling');
            document.body.classList.remove('stop-scrolling');
        };
    }, []);

    return (
        <div
            className="sweetAlertOops__overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sweet-alert-oops-title"
        >
            <div className="sweetAlertOops__dialog showSweetAlert visible" data-animation="pop">
                <SweetAlertErrorIcon />
                <h2 id="sweet-alert-oops-title">{title}</h2>
                <p>{message}</p>
                <button type="button" className="sweetAlertOops__confirm confirm" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}
