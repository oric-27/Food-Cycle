import type {LoginResponse, UserRole} from "../types/auth.ts";

const API_URL = "http://localhost:8080";

export interface RegisterPayLoad {
    username: string;
    email: string;
    password: string;
    roleName: UserRole;
}

export async function getError(response: Response):Promise<String> {
    const text = await response.text();
    try {
        const body
        return await response.json();
    }
}