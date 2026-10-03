import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationProfileForm from "../roles/OrganizationProflleForm.tsx";
import {
    cancelFoodClaim,
    createFoodClaim,
    getAvailableFood,
    getOrganizationClaims,
    getOrganizationProfile,
    updateOrganizationProfile,
    type AvailableFood,
    type OrganizationClaim,
    type OrganizationProfile,
    type OrganizationProfileUpdate,
} from "./organizationApi.ts";

type OrganizationProfileDraft = Omit<OrganizationProfileUpdate, "dailyCapacityServings"> & {
    dailyCapacityServings: string;
};

function OrganizationDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<OrganizationProfile | null>(null);
    const [profileDraft, setProfileDraft] = useState<OrganizationProfileDraft | null>(null);
    const [food, setFood] = useState<AvailableFood[]>([]);
    const [claims, setClaims] = useState<OrganizationClaim[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [pickupOtp, setPickupOtp] = useState("");
    const [servings, setServings] = useState<Record<number, string>>({});

    const loadData = useCallback(async () => {
        setError("");
        const results = await Promise.allSettled([
            getOrganizationProfile(),
            getAvailableFood(),
            getOrganizationClaims(),
        ]);
        if (!localStorage.getItem("accessToken")) {
            navigate("/login", { replace: true });
            return;
        }
        const failures: string[] = [];
        if (results[0].status === "fulfilled") {
            const currentProfile = results[0].value;
            setProfile(currentProfile);
            setProfileDraft({
                organizationName: currentProfile.organizationName,
                address: currentProfile.address,
                contactNumber: currentProfile.contactNumber,
                registrationNumber: currentProfile.registrationNumber,
                licenseDocumentUrl: currentProfile.licenseDocumentUrl,
                dailyCapacityServings: String(currentProfile.dailyCapacityServings),
            });
        }
        else failures.push(results[0].reason instanceof Error ? results[0].reason.message : "Could not load organization profile.");
        if (results[1].status === "fulfilled") setFood(results[1].value);
        else failures.push(results[1].reason instanceof Error ? results[1].reason.message : "Could not load available food.");
        if (results[2].status === "fulfilled") setClaims(results[2].value);
        else failures.push(results[2].reason instanceof Error ? results[2].reason.message : "Could not load food requests.");
        setError(failures.join(" · "));
        setLoading(false);
    }, [navigate]);

    useEffect(() => {
        if (!localStorage.getItem("accessToken") || localStorage.getItem("userRole") !== "ORGANIZATION") {
            navigate("/login", { replace: true });
            return;
        }
        void loadData();
    }, [loadData, navigate]);

    const runAction = async (action: () => Promise<unknown>, message: string) => {
        setBusy(true);
        setError("");
        setNotice("");
        setPickupOtp("");
        try {
            const result = await action();
            if (result && typeof result === "object" && "pickupOtp" in result && typeof result.pickupOtp === "string") {
                setPickupOtp(result.pickupOtp);
            }
            setNotice(message);
            await loadData();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : "The request could not be completed.");
        } finally {
            setBusy(false);
        }
    };

    const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        if (!profile || !profileDraft) return;
        const dailyCapacityServings = Number(profileDraft.dailyCapacityServings);
        if (!Number.isInteger(dailyCapacityServings) || dailyCapacityServings < 1) {
            setError("Daily capacity must be a positive whole number.");
            return;
        }
        await runAction(async () => {
            const updated = await updateOrganizationProfile({
                organizationName: profileDraft.organizationName.trim(),
                address: profileDraft.address.trim(),
                contactNumber: profileDraft.contactNumber.trim(),
                registrationNumber: profileDraft.registrationNumber.trim(),
                licenseDocumentUrl: profileDraft.licenseDocumentUrl.trim(),
                dailyCapacityServings,
            });
            setProfile(updated);
            setProfileDraft({
                organizationName: updated.organizationName,
                address: updated.address,
                contactNumber: updated.contactNumber,
                registrationNumber: updated.registrationNumber,
                licenseDocumentUrl: updated.licenseDocumentUrl,
                dailyCapacityServings: String(updated.dailyCapacityServings),
            });
            return updated;
        }, "Organization profile saved.");
    };

    const requestFood = async (listing: AvailableFood) => {
        const count = Number(servings[listing.id] ?? "1");
        if (!Number.isInteger(count) || count < 1 || count > listing.servingsEquivalent) {
            setError(`Enter a whole number of servings between 1 and ${listing.servingsEquivalent}.`);
            return;
        }
        await runAction(() => createFoodClaim(listing.id, count), "Food request submitted. Keep the pickup code safe.");
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("displayName");
        window.dispatchEvent(new Event("foodcycle-auth-change"));
        navigate("/");
    };

    if (loading) {
        return <main className="flex min-h-screen items-center justify-center text-[#58675f]">Loading organization workspace...</main>;
    }

    return (
        <main className="min-h-screen bg-[#f5f8f5] px-4 py-8 text-[#172d27] sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1b8d62]">FoodCycle</p>
                        <h1 className="mt-1 text-3xl font-extrabold">Organization workspace</h1>
                    </div>
                    <button type="button" onClick={logout} className="rounded-xl border border-[#dce8df] bg-white px-4 py-2 text-sm font-bold hover:border-[#1b8d62]">
                        Log out
                    </button>
                </header>

                {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
                {notice && <div role="status" className="mb-5 rounded-xl border border-[#b9e2c9] bg-[#eff9f2] px-4 py-3 text-sm text-[#13674c]">{notice}</div>}
                {pickupOtp && (
                    <div role="status" className="mb-5 rounded-xl border border-[#b9e2c9] bg-white p-4">
                        <p className="text-sm font-semibold">Pickup code (shown only once)</p>
                        <p className="mt-1 font-mono text-2xl font-extrabold tracking-[0.25em]">{pickupOtp}</p>
                    </div>
                )}

                {profile && profileDraft && (
                    <>
                        <section className="mb-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <p className="text-sm text-[#75817a]">Verification</p>
                                <p className="mt-2 text-lg font-extrabold">{profile.verificationStatus}</p>
                            </div>
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <p className="text-sm text-[#75817a]">Daily capacity</p>
                                <p className="mt-2 text-lg font-extrabold">{profile.dailyCapacityServings} servings</p>
                            </div>
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <p className="text-sm text-[#75817a]">Remaining today</p>
                                <p className="mt-2 text-lg font-extrabold">{profile.remainingCapacityServings} servings</p>
                            </div>
                        </section>

                        {profile.verificationStatus !== "VERIFIED" && (
                            <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                Your account must be approved before you can request food. Keep your organization details and license document up to date.
                            </div>
                        )}

                        <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-5 text-xl font-extrabold">Organization profile</h2>
                            <form onSubmit={saveProfile} className="space-y-5">
                                <OrganizationProfileForm
                                    organizationName={profileDraft.organizationName}
                                    address={profileDraft.address}
                                    contactNumber={profileDraft.contactNumber}
                                    registrationNumber={profileDraft.registrationNumber}
                                    licenseDocumentUrl={profileDraft.licenseDocumentUrl}
                                    dailyCapacityServings={profileDraft.dailyCapacityServings}
                                    onOrganizationNameChange={(value) => setProfileDraft({ ...profileDraft, organizationName: value })}
                                    onAddressChange={(value) => setProfileDraft({ ...profileDraft, address: value })}
                                    onContactNumberChange={(value) => setProfileDraft({ ...profileDraft, contactNumber: value })}
                                    onRegistrationNumberChange={(value) => setProfileDraft({ ...profileDraft, registrationNumber: value })}
                                    onLicenseDocumentUrlChange={(value) => setProfileDraft({ ...profileDraft, licenseDocumentUrl: value })}
                                    onCapacityChange={(value) => setProfileDraft({ ...profileDraft, dailyCapacityServings: value })}
                                />
                                <button disabled={busy} className="rounded-xl bg-[#1b8d62] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#13674c] disabled:opacity-60">
                                    Save profile
                                </button>
                            </form>
                        </section>
                    </>
                )}

                <section className="mb-8">
                    <div className="mb-4 flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-extrabold">Available food</h2>
                            <p className="mt-1 text-sm text-[#75817a]">Request servings within your remaining daily capacity.</p>
                        </div>
                        <button type="button" onClick={() => void loadData()} className="rounded-lg px-3 py-2 text-sm font-bold text-[#1b8d62] hover:bg-white">Refresh</button>
                    </div>
                    {food.length === 0 ? (
                        <p className="rounded-2xl bg-white p-5 text-sm text-[#75817a]">No available food listings right now.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {food.map((listing) => (
                                <article key={listing.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                                    {listing.imageUrl && <img src={listing.imageUrl} alt="" className="h-44 w-full object-cover" />}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-lg font-extrabold">{listing.title}</h3>
                                            <span className="rounded-full bg-[#eff9f2] px-3 py-1 text-xs font-bold text-[#13674c]">{listing.offerType === "DONATION" ? "Donation" : "Discounted"}</span>
                                        </div>
                                        {listing.description && <p className="mt-2 text-sm text-[#58675f]">{listing.description}</p>}
                                        <p className="mt-3 text-sm text-[#58675f]">{listing.categoryName ?? "Food"} · {listing.quantityKg} kg · up to {listing.servingsEquivalent} servings</p>
                                        <p className="mt-1 text-xs text-[#75817a]">Pickup by {new Date(listing.pickUpDeadLine).toLocaleString()}</p>
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <input
                                                aria-label={`Servings to request for ${listing.title}`}
                                                type="number"
                                                min="1"
                                                max={listing.servingsEquivalent}
                                                step="1"
                                                value={servings[listing.id] ?? "1"}
                                                onChange={(event) => setServings({ ...servings, [listing.id]: event.target.value })}
                                                className="w-28 rounded-lg border border-[#dce8df] px-3 py-2 text-sm"
                                            />
                                            <button
                                                type="button"
                                                disabled={busy || profile?.verificationStatus !== "VERIFIED"}
                                                onClick={() => void requestFood(listing)}
                                                className="rounded-xl bg-[#1b8d62] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#13674c] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Request food
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                    <h2 className="mb-4 text-xl font-extrabold">My food requests</h2>
                    {claims.length === 0 ? (
                        <p className="text-sm text-[#75817a]">You have not requested food yet.</p>
                    ) : (
                        <div className="divide-y divide-[#edf2ee]">
                            {claims.map((claim) => (
                                <article key={claim.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <h3 className="font-bold">{claim.listingTitle}</h3>
                                        <p className="mt-1 text-sm text-[#75817a]">{claim.claimedServings} servings · {claim.status} · {new Date(claim.createdAt).toLocaleString()}</p>
                                    </div>
                                    {claim.status === "REQUESTED" && (
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => void runAction(() => cancelFoodClaim(claim.id), "Food request cancelled.")}
                                            className="rounded-lg border border-[#dce8df] px-3 py-2 text-sm font-bold text-[#58675f] hover:border-red-300 hover:text-red-700 disabled:opacity-60"
                                        >
                                            Cancel request
                                        </button>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default OrganizationDashboard;
