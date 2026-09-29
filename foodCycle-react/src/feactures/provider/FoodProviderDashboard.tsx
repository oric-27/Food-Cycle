import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ChartNoAxesCombined,
    ClipboardList,
    Clock3,
    FileText,
    HandPlatter,
    Home,
    LayoutDashboard,
    Leaf,
    LogOut,
    MapPin,
    Phone,
    Search,
    ShieldCheck,
    Store,
} from "lucide-react";
import {
    providerApi,
    type CreateListingPayload,
    type FoodCategory,
    type FoodClaim,
    type FoodListing,
    type OperatingHour,
    type ProviderProfile,
    type ProviderReport,
} from "./providerApi";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const dayLabels: Record<string, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
};
const tabs = ["Overview", "Listings", "Pickup requests", "Reports", "Business profile"] as const;
type Tab = (typeof tabs)[number] | "Create listing";
const navigation = [
    { label: "Overview" as const, icon: LayoutDashboard },
    { label: "Listings" as const, icon: ClipboardList },
    { label: "Pickup requests" as const, icon: HandPlatter },
    { label: "Reports" as const, icon: ChartNoAxesCombined },
    { label: "Business profile" as const, icon: Store },
];

const emptyProfile = (): ProviderProfile => ({
    businessName: "",
    address: "",
    contactNumber: "",
    providerType: "RESTAURANT",
    licenseDocumentUrl: "",
    registrationNumber: "",
    verificationStatus: "PENDING",
    operatingHours: days.map((day) => ({
        dayOfWeek: day,
        openingTime: "08:00:00",
        closingTime: "20:00:00",
        donationStartTime: "17:00:00",
        donationEndTime: "19:00:00",
    })),
});

function localDateTime(hoursFromNow: number): string {
    const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return offsetDate.toISOString().slice(0, 16);
}

function dateInputValue(value?: string): string {
    return value ? value.slice(0, 16) : "";
}

function displayDate(value?: string): string {
    if (!value) return "Not set";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function money(value: number): string {
    return `${Number(value || 0).toLocaleString()} MMK`;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <section className={`rounded-[26px] border border-[#dfece3] bg-white p-5 shadow-sm shadow-[#163325]/5 ${className}`}>{children}</section>;
}

function Field({
                   label,
                   children,
               }: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block text-sm font-semibold text-[#32463e]">
            {label}
            {children}
        </label>
    );
}

const inputClass =
    "mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 text-sm text-[#172d27] outline-none transition placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10";
const buttonClass =
    "rounded-xl bg-[#1b8d62] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#13674c] disabled:cursor-not-allowed disabled:opacity-60";

function statusBadgeClass(status: string): string {
    switch (status.toUpperCase()) {
        case "REQUESTED":
            return "bg-blue-100 text-blue-800";
        case "RESERVED":
            return "bg-amber-100 text-amber-800";
        case "EXPIRED":
        case "REJECTED":
        case "CANCELLED":
            return "bg-red-100 text-red-800";
        case "COMPLETED":
        case "AVAILABLE":
        case "ACTIVE":
        case "DELIVERED":
            return "bg-emerald-100 text-emerald-800";
        case "CONFIRMED":
            return "bg-sky-100 text-sky-800";
        case "PREPARING":
            return "bg-violet-100 text-violet-800";
        case "READY_FOR_PICKUP":
            return "bg-orange-100 text-orange-800";
        case "PICKED_UP":
            return "bg-slate-100 text-slate-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusBadgeClass(status)}`}>
      {status.replaceAll("_", " ")}
    </span>
    );
}

export default function FoodProviderDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const [profile, setProfile] = useState<ProviderProfile>(emptyProfile);
    const [listings, setListings] = useState<FoodListing[]>([]);
    const [editingListing, setEditingListing] = useState<FoodListing | null>(null);
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [claims, setClaims] = useState<FoodClaim[]>([]);
    const [report, setReport] = useState<ProviderReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [pickupOtp, setPickupOtp] = useState<Record<number, string>>({});
    const [accessDenied, setAccessDenied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        const results = await Promise.allSettled([
            providerApi.getProfile(),
            providerApi.getListings(),
            providerApi.getCategories(),
            providerApi.getClaims(),
            providerApi.getReport(),
        ]);
        const failures: string[] = [];
        const failureMessages: string[] = [];
        const [profileResult, listingResult, categoryResult, claimsResult, reportResult] = results;

        if (profileResult.status === "fulfilled") {
            const loadedProfile = profileResult.value;
            const loadedHours = new Map(loadedProfile.operatingHours.map((hour) => [hour.dayOfWeek, hour]));
            setProfile({
                ...loadedProfile,
                operatingHours: days.map((day) => loadedHours.get(day) ?? {
                    dayOfWeek: day,
                    openingTime: "08:00:00",
                    closingTime: "20:00:00",
                    donationStartTime: "",
                    donationEndTime: "",
                }),
            });
        }
        else {
            failures.push(`Profile: ${profileResult.reason instanceof Error ? profileResult.reason.message : "Could not load"}`);
            if (profileResult.reason instanceof Error) failureMessages.push(profileResult.reason.message);
        }
        if (listingResult.status === "fulfilled") setListings(listingResult.value);
        else {
            failures.push(`Listings: ${listingResult.reason instanceof Error ? listingResult.reason.message : "Could not load"}`);
            if (listingResult.reason instanceof Error) failureMessages.push(listingResult.reason.message);
        }
        if (categoryResult.status === "fulfilled") setCategories(categoryResult.value);
        else {
            failures.push(`Categories: ${categoryResult.reason instanceof Error ? categoryResult.reason.message : "Could not load"}`);
            if (categoryResult.reason instanceof Error) failureMessages.push(categoryResult.reason.message);
        }
        if (claimsResult.status === "fulfilled") setClaims(claimsResult.value);
        else {
            failures.push(`Pickup requests: ${claimsResult.reason instanceof Error ? claimsResult.reason.message : "Could not load"}`);
            if (claimsResult.reason instanceof Error) failureMessages.push(claimsResult.reason.message);
        }
        if (reportResult.status === "fulfilled") setReport(reportResult.value);
        else {
            failures.push(`Reports: ${reportResult.reason instanceof Error ? reportResult.reason.message : "Could not load"}`);
            if (reportResult.reason instanceof Error) failureMessages.push(reportResult.reason.message);
        }

        const deniedMessage = failureMessages.find((message) => message.includes("can't access this provider feature"));
        setAccessDenied(Boolean(deniedMessage));
        if (deniedMessage) setError(deniedMessage);
        else if (failures.length) setError(failures.join(" · "));
        setLoading(false);
    }, []);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            void Promise.resolve().then(loadData);
        }
    }, [loadData]);

    const runAction = async (action: () => Promise<unknown>, successMessage: string, reload = true) => {
        setBusy(true);
        setError("");
        setNotice("");
        try {
            await action();
            setNotice(successMessage);
            if (reload) await loadData();
        } catch (actionError) {
            const message = actionError instanceof Error ? actionError.message : "The request could not be completed.";
            setError(message);
            setAccessDenied(message.includes("can't access this provider feature"));
        } finally {
            setBusy(false);
        }
    };

    const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            businessName: profile.businessName.trim(),
            address: profile.address.trim(),
            contactNumber: profile.contactNumber.trim(),
            providerType: profile.providerType,
            licenseDocumentUrl: profile.licenseDocumentUrl.trim(),
            registrationNumber: profile.registrationNumber.trim(),
            operatingHours: profile.operatingHours.map((hour) => ({
                ...hour,
                donationStartTime: hour.donationStartTime || null,
                donationEndTime: hour.donationEndTime || null,
            })),
        };
        await runAction(async () => setProfile(await providerApi.updateProfile(payload)), "Business profile saved.", false);
    };

    const updateHour = (day: string, field: keyof OperatingHour, value: string) => {
        setProfile((current) => ({
            ...current,
            operatingHours: current.operatingHours.map((hour) =>
                hour.dayOfWeek === day ? { ...hour, [field]: value } : hour,
            ),
        }));
    };

    const saveListing = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const preparedTime = String(formData.get("preparedTime") ?? "");
        const offerType = String(formData.get("offerType") ?? "DONATION") as FoodListing["offerType"];
        const priceAmount = offerType === "DONATION" ? 0 : Number(formData.get("priceAmount"));
        if (offerType === "DISCOUNTED_SALE" && priceAmount <= 0) {
            setError("Discounted sale listings need a price greater than zero.");
            return;
        }
        const categoryId = Number(formData.get("categoryId")) || undefined;
        const payload: CreateListingPayload = {
            title: String(formData.get("title") ?? "").trim(),
            description: String(formData.get("description") ?? "").trim(),
            imageUrl: String(formData.get("imageUrl") ?? "").trim() || undefined,
            categoryId,
            quantityKg: Number(formData.get("quantityKg")),
            servingsEquivalent: Number(formData.get("servingsEquivalent")),
            offerType,
            priceAmount,
            preparedTime: preparedTime ? `${preparedTime}:00` : undefined,
            expiryTime: `${String(formData.get("expiryTime"))}:00`,
            pickupDeadline: `${String(formData.get("pickupDeadline"))}:00`,
        };
        await runAction(
            async () => {
                if (editingListing) await providerApi.updateListing(editingListing.id, payload);
                else await providerApi.createListing(payload);
                setEditingListing(null);
                setActiveTab("Listings");
            },
            editingListing ? "Listing updated." : "Surplus food listing created.",
        );
    };

    const deleteListing = (listing: FoodListing) => {
        if (window.confirm(`Remove "${listing.title}" from your listings?`)) {
            void runAction(() => providerApi.deleteListing(listing.id), "Listing removed.");
        }
    };

    const advanceClaim = async (claim: FoodClaim, status: FoodClaim["status"]) => {
        await runAction(() => providerApi.updateClaimStatus(claim.id, status), `Request ${claim.id} updated to ${status.replaceAll("_", " ")}.`);
    };

    const regenerateOtp = async (claim: FoodClaim) => {
        setBusy(true);
        setError("");
        setNotice("");
        try {
            const updated = await providerApi.regeneratePickupOtp(claim.id);
            if (updated.pickupOtp) {
                setPickupOtp((current) => ({ ...current, [claim.id]: updated.pickupOtp! }));
                setNotice(`Pickup OTP for request ${claim.id}: ${updated.pickupOtp}`);
            } else {
                setNotice(`OTP refreshed for request ${claim.id}. The recipient has the pickup code.`);
            }
            await loadData();
        } catch (actionError) {
            const message = actionError instanceof Error ? actionError.message : "Could not refresh pickup OTP.";
            setError(message);
            setAccessDenied(message.includes("can't access this provider feature"));
        } finally {
            setBusy(false);
        }
    };

    const verifyPickup = async (claim: FoodClaim) => {
        const otp = pickupOtp[claim.id]?.trim();
        if (!otp) {
            setError("Enter the pickup OTP provided by the recipient.");
            return;
        }
        await runAction(() => providerApi.verifyPickup(claim.id, otp), `Pickup for request ${claim.id} completed.`);
        setPickupOtp((current) => ({ ...current, [claim.id]: "" }));
    };

    const renderClaimActions = (claim: FoodClaim) => (
        <div className="mt-3 flex flex-wrap items-center gap-2">
            {claim.status === "REQUESTED" && <>
                <button type="button" disabled={busy} onClick={() => void advanceClaim(claim, "CONFIRMED")} className={buttonClass}>Accept</button>
                <button type="button" disabled={busy} onClick={() => void advanceClaim(claim, "REJECTED")} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50">Reject</button>
            </>}
            {claim.status === "CONFIRMED" && <button type="button" disabled={busy} onClick={() => void advanceClaim(claim, "PREPARING")} className={buttonClass}>Start preparing</button>}
            {claim.status === "PREPARING" && <button type="button" disabled={busy} onClick={() => void advanceClaim(claim, "READY_FOR_PICKUP")} className={buttonClass}>Mark ready</button>}
            {claim.status === "READY_FOR_PICKUP" && <>
                <button type="button" disabled={busy} onClick={() => void regenerateOtp(claim)} className="rounded-xl border border-[#b9dfc8] px-4 py-2.5 text-sm font-bold text-[#176543] hover:bg-[#eaf7ef]">Show / refresh OTP</button>
                <input aria-label={`Pickup OTP for request ${claim.id}`} value={pickupOtp[claim.id] ?? ""} onChange={(event) => setPickupOtp((current) => ({ ...current, [claim.id]: event.target.value }))} placeholder="Enter pickup OTP" inputMode="numeric" maxLength={12} className="rounded-xl border border-[#dce8df] bg-white px-3 py-2.5 text-sm" />
                <button type="button" disabled={busy} onClick={() => void verifyPickup(claim)} className={buttonClass}>Verify pickup</button>
            </>}
            {claim.status === "COMPLETED" && <p className="text-sm font-semibold text-[#1b8d62]">Pickup completed · {money(claim.totalPrice)}</p>}
            {(claim.status === "REJECTED" || claim.status === "CANCELLED") && <p className="text-sm text-[#7c8782]">This request is closed.</p>}
        </div>
    );

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("displayName");
        window.dispatchEvent(new Event("foodcycle-auth-change"));
        navigate("/");
    };

    const tokenExists = Boolean(localStorage.getItem("accessToken"));
    const impact = report?.impact;
    const openClaims = claims.filter((claim) => !["COMPLETED", "REJECTED", "CANCELLED"].includes(claim.status));
    const availableListings = listings.filter((listing) => listing.status === "AVAILABLE");
    const today = new Date();
    const nowTimestamp = today.getTime();
    const todayRevenue = report?.history
        .filter((entry) => new Date(entry.completedAt).toDateString() === today.toDateString())
        .reduce((total, entry) => total + entry.totalPrice, 0) ?? 0;
    const weekRevenue = report?.history
        .filter((entry) => nowTimestamp - new Date(entry.completedAt).getTime() <= 7 * 24 * 60 * 60 * 1000)
        .reduce((total, entry) => total + entry.totalPrice, 0) ?? 0;
    const pageTitle = activeTab === "Create listing" ? (editingListing ? "Edit listing" : "Create listing") : activeTab;
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredListings = listings.filter((listing) =>
        `${listing.title} ${listing.categoryName ?? ""} ${listing.status}`.toLowerCase().includes(normalizedSearch),
    );
    const filteredClaims = claims.filter((claim) =>
        `${claim.id} ${claim.listingTitle} ${claim.status}`.toLowerCase().includes(normalizedSearch),
    );
    const filteredHistory = report?.history.filter((entry) =>
        `${entry.claimId} ${entry.listingTitle} ${entry.offerType}`.toLowerCase().includes(normalizedSearch),
    ) ?? [];

    return (
        <div className="min-h-screen bg-[#f5faf6] text-[#172d27]">
            <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 lg:px-7">
                <div className="grid gap-4 xl:grid-cols-[76px_minmax(0,1fr)_290px]">
                    <aside className="flex items-center justify-between rounded-[24px] border border-[#e6eee8] bg-white p-3 shadow-sm shadow-[#163325]/5 xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] xl:flex-col xl:justify-start">
                        <Link to="/" aria-label="FoodCycle home" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf7ef] text-sm font-black tracking-tight text-[#1b8d62]">
                            fc.
                        </Link>
                        <nav aria-label="Provider sections" className="flex min-w-0 flex-1 justify-center gap-1 overflow-x-auto px-2 xl:mt-10 xl:flex-col xl:justify-start xl:gap-3 xl:px-0">
                            {navigation.map(({ label, icon: Icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    title={label}
                                    aria-label={label}
                                    aria-current={activeTab === label ? "page" : undefined}
                                    onClick={() => setActiveTab(label)}
                                    className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-3 transition xl:w-11 xl:px-0 ${
                                        activeTab === label
                                            ? "bg-[#eaf7ef] text-[#1b8d62]"
                                            : "text-[#77837d] hover:bg-[#f3faf5] hover:text-[#1b8d62]"
                                    }`}
                                >
                                    <Icon size={19} strokeWidth={1.9} />
                                    <span className="text-xs font-semibold xl:sr-only">{label}</span>
                                </button>
                            ))}
                        </nav>
                        <div className="mt-auto hidden w-full flex-col gap-2 border-t border-[#edf2ee] pt-4 xl:flex">
                            <Link to="/" title="Go to home page" aria-label="Go to home page" className="flex h-10 w-10 items-center justify-center self-center rounded-xl text-[#77837d] transition hover:bg-[#f3faf5] hover:text-[#1b8d62]">
                                <Home size={18} />
                            </Link>
                            <button type="button" onClick={logout} title="Log out" aria-label="Log out" className="flex h-10 w-10 items-center justify-center self-center rounded-xl text-[#77837d] transition hover:bg-red-50 hover:text-red-700">
                                <LogOut size={18} />
                            </button>
                        </div>
                        <div className="flex gap-2 xl:hidden">
                            <Link to="/" title="Go to home page" aria-label="Go to home page" className="flex h-10 w-10 items-center justify-center rounded-xl text-[#77837d] transition hover:bg-[#f3faf5] hover:text-[#1b8d62]">
                                <Home size={18} />
                            </Link>
                            <button type="button" onClick={logout} title="Log out" aria-label="Log out" className="flex h-10 w-10 items-center justify-center rounded-xl text-[#77837d] transition hover:bg-red-50 hover:text-red-700">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </aside>

                    <main className="min-w-0">
                        <header className="mb-4 flex flex-col gap-4 rounded-[24px] border border-[#e6eee8] bg-white px-5 py-4 shadow-sm shadow-[#163325]/5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#809087]">FoodCycle · Provider portal</p>
                                <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{pageTitle}</h1>
                                <p className="mt-1 text-sm text-[#64716b]">{profile.businessName || "Your business"} · {profile.verificationStatus?.replaceAll("_", " ") || "Provider workspace"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="hidden items-center gap-2 rounded-xl border border-[#e6eee8] bg-[#fbfdfb] px-3 py-2.5 md:flex">
                                    <Search size={16} className="text-[#8a9790]" />
                                    <input
                                        aria-label="Search provider dashboard"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search listings or requests"
                                        className="w-48 bg-transparent text-sm outline-none placeholder:text-[#8a9790]"
                                    />
                                </label>
                                <button type="button" onClick={() => { setEditingListing(null); setActiveTab("Create listing"); }} className={buttonClass}>
                                    + Create listing
                                </button>
                            </div>
                        </header>

                        {!tokenExists && (
                            <Panel className="mb-6">
                                <p className="font-semibold">Please log in with your Food Provider account to access this dashboard.</p>
                                <Link className="mt-3 inline-block font-bold text-[#1b8d62] hover:underline" to="/login">Go to login →</Link>
                            </Panel>
                        )}

                        {tokenExists && (
                            <>
                                {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                                    <p>{error}</p>
                                    {accessDenied && <Link className="mt-2 inline-block font-bold underline" to="/login">Sign in with a verified Food Provider account</Link>}
                                    {!tokenExists && <Link className="mt-2 inline-block font-bold underline" to="/login">Sign in again</Link>}
                                </div>}
                                {notice && <div role="status" className="mb-5 rounded-2xl border border-[#c7e8d3] bg-[#eaf7ef] px-4 py-3 text-sm font-semibold text-[#176543]">{notice}</div>}

                                {loading ? (
                                    <Panel><p className="text-sm font-medium text-[#64716b]">Loading provider workspace…</p></Panel>
                                ) : activeTab === "Business profile" ? (
                                    <div className="grid items-start gap-5 lg:grid-cols-[minmax(250px,0.78fr)_minmax(0,1.7fr)]">
                                        <Panel className="overflow-hidden p-0">
                                            <div className="h-24 bg-gradient-to-r from-[#dff2e6] via-[#edf8f0] to-[#ccebd8]" />
                                            <div className="-mt-10 px-5">
                                                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border-4 border-white bg-[#172d27] text-2xl font-black uppercase text-[#9ae0ba] shadow-lg">
                                                    {profile.businessName.trim().slice(0, 2) || <Store size={28} />}
                                                </div>
                                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                                    <h2 className="text-xl font-extrabold">{profile.businessName || "Your business"}</h2>
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${profile.verificationStatus === "APPROVED" ? "bg-emerald-100 text-emerald-800" : profile.verificationStatus === "REJECTED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                        <ShieldCheck size={13} />
                                                        {profile.verificationStatus?.replaceAll("_", " ") || "PENDING"}
                      </span>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-[#64716b]">{profile.providerType.replaceAll("_", " ")}</p>
                                                <div className="mt-5 grid grid-cols-2 gap-3">
                                                    <div className="rounded-2xl bg-[#f3faf5] p-3">
                                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#809087]">Listings</p>
                                                        <p className="mt-1 text-xl font-extrabold">{listings.length}</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-[#f3faf5] p-3">
                                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#809087]">Pickups</p>
                                                        <p className="mt-1 text-xl font-extrabold">{impact?.completedOrders ?? 0}</p>
                                                    </div>
                                                </div>
                                                <div className="my-5 border-t border-[#edf2ee]" />
                                                <h3 className="text-sm font-extrabold">Business contact</h3>
                                                <div className="mt-3 space-y-3 text-sm">
                                                    <p className="flex items-start gap-2.5 text-[#58675f]"><MapPin size={16} className="mt-0.5 shrink-0 text-[#1b8d62]" /><span>{profile.address || "Business address not added"}</span></p>
                                                    <p className="flex items-center gap-2.5 text-[#58675f]"><Phone size={16} className="shrink-0 text-[#1b8d62]" /><span>{profile.contactNumber || "Contact number not added"}</span></p>
                                                    <p className="flex items-center gap-2.5 text-[#58675f]"><FileText size={16} className="shrink-0 text-[#1b8d62]" /><span>{profile.registrationNumber || "Registration number not added"}</span></p>
                                                </div>
                                                <div className="mt-5 rounded-2xl border border-[#e7efea] bg-[#fbfdfb] p-3.5">
                                                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#809087]">Business license</p>
                                                    {profile.licenseDocumentUrl ? (
                                                        <a href={profile.licenseDocumentUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 break-all text-sm font-bold text-[#1b8d62] hover:underline">
                                                            <FileText size={15} className="shrink-0" /> View submitted document
                                                        </a>
                                                    ) : <p className="mt-2 text-sm text-[#77837d]">No document submitted</p>}
                                                </div>
                                                <button type="button" onClick={() => document.getElementById("provider-profile-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="my-5 w-full rounded-xl border border-[#dce8df] px-4 py-2.5 text-sm font-bold text-[#176543] transition hover:bg-[#f3faf5]">
                                                    Edit business information
                                                </button>
                                            </div>
                                        </Panel>

                                        <form id="provider-profile-form" onSubmit={saveProfile} className="space-y-5">
                                            <Panel>
                                                <div className="mb-5 flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Business profile</p>
                                                        <h2 className="mt-1 text-xl font-extrabold">Business information</h2>
                                                        <p className="mt-1 text-sm text-[#64716b]">Keep your provider details and verification documents up to date.</p>
                                                    </div>
                                                    <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#eaf7ef] text-[#1b8d62] sm:flex"><Store size={19} /></span>
                                                </div>
                                                <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">
                                                    <Field label="Business name"><input required className={inputClass} value={profile.businessName} onChange={(event) => setProfile({ ...profile, businessName: event.target.value })} /></Field>
                                                    <Field label="Business type">
                                                        <select className={inputClass} value={profile.providerType} onChange={(event) => setProfile({ ...profile, providerType: event.target.value })}>
                                                            {["RESTAURANT", "HOTEL", "BAKERY", "SUPERMARKET", "OTHER"].map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
                                                        </select>
                                                    </Field>
                                                    <Field label="Business address"><input required className={inputClass} value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} /></Field>
                                                    <Field label="Contact number"><input required type="tel" className={inputClass} value={profile.contactNumber} onChange={(event) => setProfile({ ...profile, contactNumber: event.target.value })} /></Field>
                                                    <Field label="Registration number"><input required className={inputClass} value={profile.registrationNumber} onChange={(event) => setProfile({ ...profile, registrationNumber: event.target.value })} /></Field>
                                                    <Field label="License document URL"><input required type="url" className={inputClass} placeholder="https://…" value={profile.licenseDocumentUrl} onChange={(event) => setProfile({ ...profile, licenseDocumentUrl: event.target.value })} /></Field>
                                                </div>
                                            </Panel>

                                            <Panel>
                                                <div className="mb-5 flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Schedule</p>
                                                        <h2 className="mt-1 text-xl font-extrabold">Operating & donation hours</h2>
                                                        <p className="mt-1 text-sm text-[#64716b]">Set when your business is open and surplus food is available for pickup.</p>
                                                    </div>
                                                    <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#eaf7ef] text-[#1b8d62] sm:flex"><Clock3 size={19} /></span>
                                                </div>
                                                <div className="space-y-3">
                                                    {days.map((day) => {
                                                        const hour = profile.operatingHours.find((entry) => entry.dayOfWeek === day) ?? {
                                                            dayOfWeek: day, openingTime: "", closingTime: "", donationStartTime: "", donationEndTime: "",
                                                        };
                                                        return (
                                                            <div key={day} className="rounded-2xl border border-[#ebf1ee] bg-[#fbfdfb] p-4">
                                                                <p className="mb-3 text-sm font-extrabold">{dayLabels[day]}</p>
                                                                <div className="grid gap-3 sm:grid-cols-2">
                                                                    {([
                                                                        ["openingTime", "Business opens"],
                                                                        ["closingTime", "Business closes"],
                                                                        ["donationStartTime", "Donation starts"],
                                                                        ["donationEndTime", "Donation ends"],
                                                                    ] as const).map(([field, label]) => (
                                                                        <Field key={field} label={label}>
                                                                            <input type="time" required={field === "openingTime" || field === "closingTime"} className={inputClass} value={hour[field]?.slice(0, 5) ?? ""} onChange={(event) => updateHour(day, field, event.target.value ? `${event.target.value}:00` : "")} />
                                                                        </Field>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#edf2ee] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                                    <p className="text-xs text-[#77837d]">Your changes are saved to your FoodCycle provider profile.</p>
                                                    <button type="submit" disabled={busy} className={buttonClass}>{busy ? "Saving…" : "Save changes"}</button>
                                                </div>
                                            </Panel>
                                        </form>
                                    </div>
                                ) : activeTab === "Create listing" ? (
                                    <Panel>
                                        <div className="mb-6">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Surplus food</p>
                                            <h2 className="mt-1 text-2xl font-extrabold">{editingListing ? "Edit listing" : "Create a listing"}</h2>
                                            <p className="mt-2 text-sm text-[#64716b]">Add safe-to-collect food, servings, offer type, and pickup deadlines.</p>
                                        </div>
                                        <form onSubmit={saveListing} className="space-y-5">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <Field label="Food title"><input name="title" required maxLength={120} defaultValue={editingListing?.title} className={inputClass} placeholder="e.g. Fresh vegetable curry" /></Field>
                                                <Field label="Category">
                                                    <select name="categoryId" className={inputClass} defaultValue={editingListing?.categoryId ?? ""}>
                                                        <option value="">Choose category</option>
                                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                                    </select>
                                                </Field>
                                                <Field label="Quantity (kg)"><input name="quantityKg" type="number" min="0.01" step="0.01" required defaultValue={editingListing?.quantityKg} className={inputClass} /></Field>
                                                <Field label="Servings available"><input name="servingsEquivalent" type="number" min="1" step="1" required defaultValue={editingListing?.servingsEquivalent} className={inputClass} /></Field>
                                                <Field label="Offer type">
                                                    <select name="offerType" className={inputClass} defaultValue={editingListing?.offerType ?? "DONATION"}>
                                                        <option value="DONATION">Free donation</option>
                                                        <option value="DISCOUNTED_SALE">Discounted sale</option>
                                                    </select>
                                                </Field>
                                                <Field label="Price (MMK; 0 for donation)"><input name="priceAmount" type="number" min="0" step="1" defaultValue={editingListing?.priceAmount ?? 0} className={inputClass} /></Field>
                                                <Field label="Image URL"><input name="imageUrl" type="url" defaultValue={editingListing?.imageUrl} className={inputClass} placeholder="https://…" /></Field>
                                                <Field label="Prepared time"><input name="preparedTime" type="datetime-local" defaultValue={dateInputValue(editingListing?.preparedTime)} className={inputClass} /></Field>
                                                <Field label="Pickup deadline"><input name="pickupDeadline" type="datetime-local" required min={localDateTime(0)} defaultValue={dateInputValue(editingListing?.pickUpDeadLine) || localDateTime(2)} className={inputClass} /></Field>
                                                <Field label="Food expiry time"><input name="expiryTime" type="datetime-local" required min={localDateTime(0)} defaultValue={dateInputValue(editingListing?.expiryTime) || localDateTime(3)} className={inputClass} /></Field>
                                            </div>
                                            <Field label="Description"><textarea name="description" rows={4} maxLength={1000} defaultValue={editingListing?.description} className={inputClass} placeholder="Include ingredients, storage notes, and collection instructions." /></Field>
                                            <div className="flex flex-wrap gap-3">
                                                <button type="submit" disabled={busy || categories.length === 0} className={buttonClass}>{busy ? "Saving…" : editingListing ? "Save changes" : "Publish listing"}</button>
                                                {categories.length === 0 && <p className="self-center text-sm text-amber-800">No food categories are available yet. Contact an administrator to add categories.</p>}
                                                <button type="button" onClick={() => { setEditingListing(null); setActiveTab("Listings"); }} className="rounded-xl border border-[#dfece3] px-4 py-2.5 text-sm font-bold text-[#51615c] hover:bg-[#f5faf6]">Cancel</button>
                                            </div>
                                        </form>
                                    </Panel>
                                ) : activeTab === "Listings" ? (
                                    <Panel>
                                        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                                            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Inventory</p><h2 className="mt-1 text-2xl font-extrabold">Your listings</h2></div>
                                            <button type="button" onClick={() => setActiveTab("Create listing")} className={buttonClass}>+ Create listing</button>
                                        </div>
                                        {listings.length === 0 ? <p className="rounded-2xl bg-[#f3faf5] p-5 text-sm text-[#64716b]">No listings yet. Create one to share surplus food.</p> : (
                                            <div className="space-y-4">
                                                {filteredListings.map((listing) => (
                                                    <article key={listing.id} className="flex flex-col gap-4 rounded-2xl border border-[#ebf1ee] bg-[#fbfdfb] p-4 md:flex-row md:items-center md:justify-between">
                                                        <div className="flex min-w-0 gap-4">
                                                            {listing.imageUrl ? <img src={listing.imageUrl} alt="" className="h-20 w-20 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#eaf7ef] text-2xl">🥗</div>}
                                                            <div>
                                                                <h3 className="font-extrabold">{listing.title}</h3>
                                                                <p className="mt-1 text-sm text-[#64716b]">{listing.categoryName || "Uncategorized"} · {listing.quantityKg} kg · {listing.servingsEquivalent} servings</p>
                                                                <p className="mt-1 text-sm font-semibold text-[#1b8d62]">{listing.offerType === "DONATION" ? "Free donation" : money(listing.priceAmount)}</p>
                                                                <p className="mt-1 text-xs text-[#7c8782]">Pickup by {displayDate(listing.pickUpDeadLine)} · Expires {displayDate(listing.expiryTime)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <StatusBadge status={listing.status} />
                                                            {["AVAILABLE", "ACTIVE"].includes(listing.status) && <button type="button" onClick={() => { setEditingListing(listing); setActiveTab("Create listing"); }} className="rounded-xl border border-[#dfece3] px-3 py-2 text-sm font-bold text-[#176543] hover:bg-[#eaf7ef]">Edit</button>}
                                                            <button type="button" disabled={busy || !["AVAILABLE", "ACTIVE"].includes(listing.status)} onClick={() => deleteListing(listing)} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">Remove</button>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                                    </Panel>
                                ) : activeTab === "Pickup requests" ? (
                                    <Panel>
                                        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Order handling</p><h2 className="mt-1 text-2xl font-extrabold">Pickup requests</h2><p className="mt-2 text-sm text-[#64716b]">Confirm requests, prepare the order, and verify the recipient’s pickup OTP.</p></div>
                                        {filteredClaims.length === 0 ? <p className="rounded-2xl bg-[#f3faf5] p-5 text-sm text-[#64716b]">{normalizedSearch ? "No requests match your search." : "No pickup requests yet."}</p> : (
                                            <div className="space-y-4">
                                                {filteredClaims.map((claim) => (
                                                    <article key={claim.id} className="rounded-2xl border border-[#ebf1ee] bg-[#fbfdfb] p-4">
                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7c8782]">Request #{claim.id}</p><h3 className="mt-1 text-lg font-extrabold">{claim.listingTitle}</h3><p className="mt-1 text-sm text-[#64716b]">{claim.claimedServings} servings · Requested {displayDate(claim.createdAt)}</p></div>
                                                            <StatusBadge status={claim.status} />
                                                        </div>
                                                        {renderClaimActions(claim)}
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                                    </Panel>
                                ) : activeTab === "Reports" ? (
                                    <div className="space-y-6">
                                        <Panel>
                                            <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Impact & sales</p><h2 className="mt-1 text-2xl font-extrabold">Your food rescue report</h2></div>
                                            {!impact ? <p className="text-sm text-[#64716b]">No impact report is available yet.</p> : (
                                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                                    {[
                                                        ["Completed pickups", impact.completedOrders],
                                                        ["Servings rescued", impact.rescuedServings],
                                                        ["Food rescued", `${impact.rescuedFoodKg} kg`],
                                                        ["Donation orders", impact.donationOrders],
                                                        ["Discounted sales", impact.discountedSaleOrders],
                                                        ["Sales revenue", money(impact.salesRevenue)],
                                                    ].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-[#f3faf5] p-5"><p className="text-sm font-medium text-[#64716b]">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p></div>)}
                                                </div>
                                            )}
                                        </Panel>
                                        <Panel>
                                            <h3 className="text-xl font-extrabold">Completed order history</h3>
                                            {!filteredHistory.length ? <p className="mt-4 text-sm text-[#64716b]">Completed orders will appear here.</p> : (
                                                <div className="mt-4 overflow-x-auto">
                                                    <table className="w-full min-w-[650px] text-left text-sm">
                                                        <thead className="border-b border-[#e7efea] text-xs uppercase tracking-[0.14em] text-[#7c8782]"><tr><th className="py-3 pr-4">Food</th><th className="py-3 pr-4">Offer</th><th className="py-3 pr-4">Servings</th><th className="py-3 pr-4">Rescued</th><th className="py-3 pr-4">Total</th><th className="py-3">Completed</th></tr></thead>
                                                        <tbody>{filteredHistory.map((entry) => <tr key={entry.claimId} className="border-b border-[#eef3f0]"><td className="py-3 pr-4 font-bold">{entry.listingTitle}</td><td className="py-3 pr-4">{entry.offerType.replaceAll("_", " ")}</td><td className="py-3 pr-4">{entry.servings}</td><td className="py-3 pr-4">{entry.rescuedFoodKg} kg</td><td className="py-3 pr-4">{money(entry.totalPrice)}</td><td className="py-3">{displayDate(entry.completedAt)}</td></tr>)}</tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </Panel>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                            {[
                                                ["Food rescued", `${impact?.rescuedFoodKg ?? 0} kg`],
                                                ["Servings shared", impact?.rescuedServings ?? 0],
                                                ["Active listings", listings.filter((listing) => ["AVAILABLE", "ACTIVE"].includes(listing.status)).length],
                                                ["Pickup requests", claims.filter((claim) => ["REQUESTED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP"].includes(claim.status)).length],
                                            ].map(([label, value]) => <Panel key={String(label)}><p className="text-sm font-medium text-[#64716b]">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></Panel>)}
                                        </section>
                                        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                                            <Panel>
                                                <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Inventory</p><h2 className="mt-1 text-xl font-extrabold">Recent listings</h2></div><button type="button" onClick={() => setActiveTab("Listings")} className="text-sm font-bold text-[#1b8d62] hover:underline">View all</button></div>
                                                {filteredListings.length === 0 ? <p className="text-sm text-[#64716b]">Create a listing to share available surplus food.</p> : <div className="space-y-3">{filteredListings.slice(0, 4).map((listing) => <div key={listing.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7faf8] p-3"><div><p className="font-bold">{listing.title}</p><p className="text-sm text-[#64716b]">{listing.quantityKg} kg · {listing.offerType.replaceAll("_", " ")}</p></div><StatusBadge status={listing.status} /></div>)}</div>}
                                            </Panel>
                                            <Panel>
                                                <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a7d75]">Order handling</p><h2 className="mt-1 text-xl font-extrabold">Pickup queue</h2></div><button type="button" onClick={() => setActiveTab("Pickup requests")} className="text-sm font-bold text-[#1b8d62] hover:underline">Manage</button></div>
                                                {filteredClaims.filter((claim) => !["COMPLETED", "REJECTED", "CANCELLED"].includes(claim.status)).length === 0 ? <p className="text-sm text-[#64716b]">No open pickup requests.</p> : <div className="space-y-3">{filteredClaims.filter((claim) => !["COMPLETED", "REJECTED", "CANCELLED"].includes(claim.status)).slice(0, 4).map((claim) => <div key={claim.id} className="rounded-xl bg-[#f7faf8] p-3"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">{claim.listingTitle}</p><p className="text-sm text-[#64716b]">{claim.claimedServings} servings</p></div><StatusBadge status={claim.status} /></div>{renderClaimActions(claim)}</div>)}</div>}
                                            </Panel>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>

                    <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
                        <Panel className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#809087]">Payments</p>
                                    <h2 className="mt-1 text-lg font-extrabold">Sales overview</h2>
                                </div>
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf7ef] text-[#1b8d62]"><ChartNoAxesCombined size={18} /></span>
                            </div>
                            <div className="mt-5 border-b border-[#edf2ee] pb-5">
                                <p className="text-xs font-medium text-[#77837d]">Today’s revenue</p>
                                <p className="mt-1 text-2xl font-extrabold">{money(todayRevenue)}</p>
                                <p className="mt-1 text-xs text-[#77837d]">From completed discounted pickups</p>
                            </div>
                            <div className="py-5">
                                <p className="text-xs font-medium text-[#77837d]">Last 7 days</p>
                                <p className="mt-1 text-2xl font-extrabold">{money(weekRevenue)}</p>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf2ee]">
                                    <div className="h-full rounded-full bg-[#1b8d62]" style={{ width: `${weekRevenue > 0 ? Math.max(8, Math.min(100, (weekRevenue / Math.max(impact?.salesRevenue ?? 0, weekRevenue)) * 100)) : 0}%` }} />
                                </div>
                                <p className="mt-2 text-xs text-[#77837d]">Total recorded sales: {money(impact?.salesRevenue ?? 0)}</p>
                            </div>
                        </Panel>

                        <Panel className="p-5">
                            <div className="flex items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf7ef] text-[#1b8d62]"><Leaf size={18} /></span>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#809087]">Community impact</p>
                                    <h2 className="text-lg font-extrabold">Food rescued</h2>
                                </div>
                            </div>
                            <p className="mt-5 text-3xl font-extrabold">{impact?.rescuedFoodKg ?? 0}<span className="ml-1 text-base font-bold text-[#64716b]">kg</span></p>
                            <p className="mt-1 text-sm text-[#64716b]">Across {impact?.completedOrders ?? 0} completed pickups</p>
                            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#edf2ee] pt-4">
                                <div><p className="text-xs text-[#77837d]">Servings shared</p><p className="mt-1 font-extrabold">{impact?.rescuedServings ?? 0}</p></div>
                                <div><p className="text-xs text-[#77837d]">Donations</p><p className="mt-1 font-extrabold">{impact?.donationOrders ?? 0}</p></div>
                            </div>
                        </Panel>

                        <Panel className="p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#809087]">Today</p>
                                    <h2 className="mt-1 text-lg font-extrabold">Provider activity</h2>
                                </div>
                                <button type="button" onClick={() => setActiveTab("Pickup requests")} className="text-xs font-bold text-[#1b8d62] hover:underline">View queue</button>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between rounded-xl bg-[#f7faf8] px-3 py-3">
                                    <span className="text-sm text-[#64716b]">Available listings</span>
                                    <strong>{availableListings.length}</strong>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-[#f7faf8] px-3 py-3">
                                    <span className="text-sm text-[#64716b]">Open pickup requests</span>
                                    <strong>{openClaims.length}</strong>
                                </div>
                            </div>
                            {openClaims.length > 0 && (
                                <div className="mt-4 rounded-xl border border-[#e7efea] p-3">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#809087]">Next to handle</p>
                                    <p className="mt-2 truncate text-sm font-bold">{openClaims[0].listingTitle}</p>
                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <StatusBadge status={openClaims[0].status} />
                                        <span className="text-xs text-[#77837d]">{openClaims[0].claimedServings} servings</span>
                                    </div>
                                </div>
                            )}
                        </Panel>
                    </aside>
                </div>
            </div>
        </div>
    );
}
