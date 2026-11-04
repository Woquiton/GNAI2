export interface SessionSecurityState {
    locked: boolean;
    expired: boolean;
    canLock: boolean;
    loginHref: string;
    lockAfter: number;
    logoutAfter: number;
    lastActivity: number;
    returnTo: string;
}

export interface LockScreenProps {
    lockedUser: { name: string; photo_url: string };
}
