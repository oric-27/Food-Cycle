import type {LoginResponse, UserRole} from "../types/auth.ts";

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    roleName: UserRole;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/auth"

export interface loginResponse {
    token: string;
    type: string;
    email: string;
    role: string[];
}

export async function register(payload: RegisterPayload): Promise<void> {
    const  normailzedPayload = {
        username: payload.username.trim(),
        email: payload.email.trim().toLocaleLowerCase(),
        password: payload.password,
        roleName: payload.roleName,
    };

    if (!normailzedPayload.username || !normailzedPayload.email || !normailzedPayload.password) {
        throw new Error("Please complete all registration fields");
    }

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(normailzedPayload),
    });

    if (!response.ok) {
        throw new Error(await getError(response));
    }
}

export async function login(email: string, password: string):Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        throw new Error(await getError(response));
    }
    return response.json();
}

export async function getError(response: Response):Promise<string> {
    const text = await response.text();

    try {
        const body = JSON.parse(text) as {message ?: string; error?: string};
        return body.message ?? body.error ?? text;
    } catch {
        return text || response.statusText;
    }
}