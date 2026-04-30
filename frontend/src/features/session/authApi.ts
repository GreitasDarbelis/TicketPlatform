import type {UserRole} from "../../app/roles";

export type AuthUser = {
    id: string;
    email: string;
    role: UserRole;
};

type AuthResponse = {
    user: AuthUser;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}.`);
    }

    return response.json() as Promise<T>;
}

async function readVoidResponse(response: Response): Promise<void> {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}.`);
    }
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...init,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...init.headers,
        },
        credentials: 'include',
    });

    return readJsonResponse<T>(response);
}

async function requestVoid(url: string, init: RequestInit): Promise<void> {
    const response = await fetch(url, {
        ...init,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...init.headers,
        },
    });

    return readVoidResponse(response);
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    });

    if (response.status === 401) {
        return null;
    }

    const data = await readJsonResponse<AuthResponse>(response);
    return data.user;
}

export async function loginRequest(email: string, password: string): Promise<AuthUser> {
    const data = await requestJson<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    return data.user;
}

export async function signupRequest(
    email: string,
    password: string,
    role: UserRole,
): Promise<AuthUser> {
    const data = await requestJson<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
    });

    return data.user;
}

export async function logoutRequest(): Promise<void> {
    await requestVoid('/api/auth/logout', {
        method: 'POST',
    });
}