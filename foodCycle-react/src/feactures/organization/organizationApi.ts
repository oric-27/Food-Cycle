import { getError } from "../auth/authApi.ts";

const API_ROOT = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/auth")
    .replace(/\/api\/auth\/?$/, "")
    .replace(/\/$/, "");

export interface OrganizationProfile {
    organizationName: string;
    address: string;
    contactNumber: string;
    registrationNumber: string;
    licenseDocumentUrl: string;
    dailyCapacityServings: number;
    remainingCapacityServings: number;
    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
    active: boolean;
}

interface OrganizationProfileResponse extends Omit<OrganizationProfile, "contactNumber"> {
    contentNumber: string;
}

export interface OrganizationProfileUpdate {
    organizationName: string;
    address: string;
    contactNumber: string;
    registrationNumber: string;
    licenseDocumentUrl: string;
    dailyCapacityServings: number;
}

export interface AvailableFood {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string;
    categoryName?: string;
    quantityKg: number;
    servingsEquivalent: number;
    offerType: "DONATION" | "DISCOUNTED_SALE";
    priceAmount: number;
    expiryTime: string;
    pickUpDeadLine: string;
    status: string;
}

export interface OrganizationClaim {
    id: number;
    listingId: number;
    listingTitle: string;
    claimedServings: number;
    totalPrice: number;
    status: "REQUESTED" | "CONFIRMED" | "PREPARING" | "READY_FOR_PICKUP" | "COMPLETED" | "REJECTED" | "CANCELLED";
    createdAt: string;
    pickupOtp?: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_ROOT}${path}`, {
        ...init,
        headers: {
            ...(init.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
        },
    });
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userRole");
        }
        throw new Error(await getError(response));
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

export function getOrganizationProfile(): Promise<OrganizationProfile> {
    return request<OrganizationProfileResponse>("/api/organizations/profile")
        .then(({ contentNumber, ...profile }) => ({ ...profile, contactNumber: contentNumber }));
}

export function updateOrganizationProfile(payload: OrganizationProfileUpdate): Promise<OrganizationProfile> {
    return request<OrganizationProfileResponse>("/api/organizations/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
    }).then(({ contentNumber, ...profile }) => ({ ...profile, contactNumber: contentNumber }));
}

export function getAvailableFood(): Promise<AvailableFood[]> {
    return request<AvailableFood[]>("/api/food-providers/listings/available");
}

export function getOrganizationClaims(): Promise<OrganizationClaim[]> {
    return request<OrganizationClaim[]>("/api/food-claims");
}

export function createFoodClaim(listingId: number, claimedServings: number): Promise<OrganizationClaim> {
    return request<OrganizationClaim>("/api/food-claims", {
        method: "POST",
        body: JSON.stringify({ listingId, claimedServings }),
    });
}

export function cancelFoodClaim(claimId: number): Promise<void> {
    return request<void>(`/api/food-claims/${claimId}/cancel`, { method: "POST" });
}
