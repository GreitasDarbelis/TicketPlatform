import type {UserRole} from "../../app/roles";

export type AuthUser = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
};

export type AuthResponse = {
    user: AuthUser;
};

export type LoginRequestDto = {
    email: string;
    password: string;
}

export type SignupRequestDto = {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}