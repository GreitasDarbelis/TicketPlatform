import { API_PATHS } from "../../app/api-paths";
import type {AuthUser, AuthResponse, SignupRequestDto, LoginRequestDto} from "./authTypes.ts";


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
    const response = await fetch(API_PATHS.auth.me, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    });

    if (response.status === 401 || response.status === 403) {
        return null;
    }

    const data = await readJsonResponse<AuthResponse>(response);
    return data.user;
}

export async function loginRequest(dto: LoginRequestDto): Promise<AuthUser> {
    const data = await requestJson<AuthResponse>(API_PATHS.auth.login, {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    return data.user;
}

export async function signupRequest(dto: SignupRequestDto): Promise<AuthUser> {
    const data = await requestJson<AuthResponse>(API_PATHS.auth.signup, {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    return data.user;
}

export async function logoutRequest(): Promise<void> {
    await requestVoid(API_PATHS.auth.logout, {
        method: 'POST',
    });
}