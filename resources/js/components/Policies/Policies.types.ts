export interface PolicyContact {
    controllerName: string | null;
    officerName: string | null;
    contactEmail: string | null;
    contactUrl: string | null;
}

export type PolicyKey = 'privacy' | 'usage' | 'cookies' | 'copyright' | 'accessibility';

export interface PolicyPageProps extends PolicyContact {
    policyKey: PolicyKey;
}
