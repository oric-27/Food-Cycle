
export type UserRole = "FOOD_PROVIDER" | "ORGANIZATION" | "VOLUNTEER";

export interface LoginResponse {
    token: string;
    type: string;
    email: string;
    role: string[];
}