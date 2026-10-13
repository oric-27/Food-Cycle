export type Role = "NGO" | "Provider" | "Volunteer" | "Admin";

export type FoodItem = {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    provider: string;
    location: string;
    expires: string;
    timeLeft: string;
    status: "Available" | "Claimed" | "Assigned" | "Picked Up";
    icon: string;
    tint: string;
}