
export type UserRole = "FOOD_PROVIDER" | "ORGANIZATION" | "VOLUNTEER";

export type ProviderType = "RESTAURANT" | "SUPERMARKET" | "BAKERY" | "HOTEL" | "OTHER";

export interface LoginResponse {
    token: string;
    type: string;
    email: string;
    roles: string[];
}