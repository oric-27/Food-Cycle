const API_ROOT = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/auth")
    .replace(/\/api\/auth\/?$/, "")
    .replace(/\/$/, "");

export interface OperatingHour {
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
    donationStartTime: string;
    donationEndTime: string;
}

export interface ProviderProfile {
    businessName: string;
    address: string;
    contactNumber: string;
    providerType: string;
    licenseDocumentUrl: string;
    registrationNumber: string;
    verificationStatus: string;
    operatingHours: OperatingHour[];
}

export interface ProviderProfileUpdate {
    businessName: string;
    address: string;
    contactNumber: string;
    providerType: string;
    licenseDocumentUrl: string;
    registrationNumber: string;
    operatingHours: Array<Omit<OperatingHour, "donationStartTime" | "donationEndTime"> & {
        donationStartTime: string | null;
        donationEndTime: string | null;
    }>;
}

export interface FoodCategory {
    id: number;
    name: string;
    description?: string;
}

export interface FoodListing {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string;
    categoryId?: number;
    categoryName?: string;
    quantityKg: number;
    servingsEquivalent: number;
    offerType: "DONATION" | "DISCOUNTED_SALE";
    priceAmount: number;
    preparedTime?: string;
    expiryTime: string;
    pickUpDeadLine: string;
    status: string;
}

export interface CreateListingPayload {
    title: string;
    description?: string;
    imageUrl?: string;
    categoryId?: number;
    quantityKg: number;
    servingsEquivalent: number;
    offerType: "DONATION" | "DISCOUNTED_SALE";
    priceAmount: number;
    preparedTime?: string;
    expiryTime: string;
    pickupDeadline: string;
}

export interface FoodClaim {
    id: number;
    listingId: number;
    listingTitle: string;
    claimedServings: number;
    totalPrice: number;
    status: "REQUESTED" | "CONFIRMED" | "PREPARING" | "READY_FOR_PICKUP" | "COMPLETED" | "REJECTED" | "CANCELLED";
    createdAt: string;
    pickupOtp?: string;
}

export interface ProviderReport {
    impact: {
        completedOrders: number;
        rescuedServings: number;
        rescuedFoodKg: number;
        donationOrders: number;
        discountedSaleOrders: number;
        salesRevenue: number;
    };
    history: Array<{
        claimId: number;
        listingTitle: string;
        offerType: string;
        servings: number;
        rescuedFoodKg: number;
        totalPrice: number;
        completedAt: string;
    }>;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("accessToken");
    let response: Response;
    try {
        response = await fetch(`${API_ROOT}${path}`, {
        ...init,
                headers: {
            ...(init.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
            },
        });
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("We couldn't connect to FoodCycle. Check that the backend is running and try again.");
        }
        throw error;
    }
    if (!response.ok) {
        const text = await response.text();
        let serverMessage = text;
        try {
            const body = JSON.parse(text) as { message?: string; error?: string };
            serverMessage = body.message ?? body.error ?? serverMessage;
        } catch {
            // Validation endpoints may return plain text.
        }
        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userRole");
            throw new Error("Your session has expired. Please sign in again.");
        }
        if (response.status === 403) {
            throw new Error("Your account can't access this provider feature. Sign in with an approved Food Provider account, or ask an administrator to verify your provider account.");
        }
        if (response.status === 400 || response.status === 422) {
            throw new Error(serverMessage || "Some of the information is invalid. Review the form and try again.");
        }
        if (response.status >= 500) {
            throw new Error("FoodCycle is temporarily unavailable. Please try again in a moment.");
        }
        throw new Error(serverMessage || "We couldn't complete that request. Please try again.");
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

function jsonBody(body: unknown): RequestInit {
    return { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const providerApi = {
    getProfile: () => request<ProviderProfile>("/api/food-providers/profile"),
    updateProfile: (profile: ProviderProfileUpdate) =>
        request<ProviderProfile>("/api/food-providers/profile", {
            method: "PUT",
            ...jsonBody(profile),
        }),
    getCategories: () => request<FoodCategory[]>("/api/food-categories"),
    getListings: () => request<FoodListing[]>("/api/food-providers/listings"),
    createListing: (listing: CreateListingPayload) =>
        request<FoodListing>("/api/food-providers/listings", {
            method: "POST",
            ...jsonBody(listing),
        }),
    updateListing: (id: number, listing: CreateListingPayload) =>
        request<FoodListing>(`/api/food-providers/listings/${id}`, {
    method: "PUT",
...jsonBody(listing),
}),
deleteListing: (id: number) =>
    request<void>(`/api/food-providers/listings/${id}`, { method: "DELETE" }),
getClaims: () => request<FoodClaim[]>("/api/food-providers/claims"),
    updateClaimStatus: (id: number, status: FoodClaim["status"]) =>
    request<FoodClaim>(`/api/food-providers/claims/${id}/status`, {
method: "PUT",
...jsonBody({ status }),
}),
regeneratePickupOtp: (id: number) =>
    request<FoodClaim>(`/api/food-providers/claims/${id}/pickup-otp`, { method: "POST" }),
verifyPickup: (id: number, otp: string) =>
    request<FoodClaim>(`/api/food-providers/claims/${id}/verify-pickup`, {
method: "POST",
...jsonBody({ otp }),
}),
getReport: () => request<ProviderReport>("/api/food-providers/reports/impact"),
};