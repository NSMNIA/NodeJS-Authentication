
export type Auth = {
    email?: string | null;
    uid?: number | null;
    tokens?: {
        accessToken: string | null;
    };
    status?: boolean;
}

export const defaultAuth: Auth = {
    email: null,
    uid: null,
    tokens: {
        accessToken: null
    },
    status: false
}

export default interface IAuth {
    authState: typeof defaultAuth,
    setAuthState: (a: Auth) => void
}