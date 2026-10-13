import axios from "axios";
import type { Role } from "@/types/workspace";

export type AuthenticatedUser = {
    token: string;
    email: string;
    username: string;
    roles: Role[];
    role: Role;
};

type LoginResponse = {
    token: string;
    email: string;
    username: string;
    roles: string[];
};

type RegisterRequest = {
    username: string;
    email: string;
    password: string;
    roleName: "ORGANIZATION" | "FOOD_PROVIDER" | "VOLUNTEER";
    organizationName?: string;
    businessName?: string;
};

const apiClient = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api").replace(/\/+$/, ""),
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("foodcycle.auth")
        ?? window.sessionStorage.getItem("foodcycle.auth");
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
});

const roleByBackendName: Record<string, Role> = {
    ORGANIZATION: "NGO",
    FOOD_PROVIDER: "Provider",
    VOLUNTEER: "Volunteer",
    ADMIN: "Admin",
};

export async function login(email: string, password: string): Promise<AuthenticatedUser> {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    if (!data.token || !data.email || !data.username || !Array.isArray(data.roles)) {
        throw new Error("The server returned an incomplete login response.");
    }

    const roles = data.roles.map((roleName): Role => {
        const role = roleByBackendName[roleName];
        if (!role) throw new Error(`The server returned an unsupported role: ${roleName}.`);
        return role;
    });
    if (roles.length === 0) {
        throw new Error("Your account has no supported FoodCycle workspace role.");
    }

    return {
        token: data.token,
        email: data.email,
        username: data.username,
        roles,
        role: roles[0],
    };
}

export async function register(request: RegisterRequest): Promise<void> {
    await apiClient.post("/auth/register", request);
}

export function saveAuthenticatedUser(user: AuthenticatedUser, remember: boolean): void {
    clearAuthenticatedUser();
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem("foodcycle.auth", user.token);
    storage.setItem("foodcycle.user", JSON.stringify({
        email: user.email,
        username: user.username,
        roles: user.roles,
        role: user.role,
    }));
}

export function getAuthenticatedUser(): AuthenticatedUser | null {
    const storage = window.localStorage.getItem("foodcycle.user")
        ? window.localStorage
        : window.sessionStorage;
    const rawUser = storage.getItem("foodcycle.user");
    if (!rawUser) return null;

    try {
        const user: unknown = JSON.parse(rawUser);
        if (typeof user !== "object" || user === null) {
            clearAuthenticatedUser();
            return null;
        }

        const { email, username, roles, role } = user as Record<string, unknown>;
        const token = storage.getItem("foodcycle.auth");
        if (
            typeof token === "string"
            && token.length > 0
            && typeof email === "string"
            && typeof username === "string"
            && Array.isArray(roles)
            && roles.every(isWorkspaceRole)
            && isWorkspaceRole(role)
            && roles.includes(role)
        ) {
            return { token, email, username, roles, role };
        }
    } catch {
        clearAuthenticatedUser();
        return null;
    }

    clearAuthenticatedUser();
    return null;
}

function isWorkspaceRole(value: unknown): value is Role {
    return value === "NGO" || value === "Provider" || value === "Volunteer" || value === "Admin";
}

export function clearAuthenticatedUser(): void {
    window.localStorage.removeItem("foodcycle.auth");
    window.localStorage.removeItem("foodcycle.user");
    window.sessionStorage.removeItem("foodcycle.auth");
    window.sessionStorage.removeItem("foodcycle.user");
}

export function getAuthErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const response = error.response?.data;
        if (typeof response === "string" && response.trim()) return response;
        if (typeof response === "object" && response !== null) {
            const message = "message" in response ? response.message : "error" in response ? response.error : null;
            if (typeof message === "string" && message.trim()) return message;
        }
        if (error.response) return `The server could not complete the request (${error.response.status}).`;
        return "Could not reach FoodCycle. Check that the backend is running and try again.";
    }
    return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
