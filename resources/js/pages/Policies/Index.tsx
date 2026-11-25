import PoliciesPage from '@/components/Policies/PoliciesPage';
import type { PolicyPageProps } from '@/components/Policies/Policies.types';

export default function Index(props: PolicyPageProps): React.JSX.Element {
    return <PoliciesPage {...props} />;
}
