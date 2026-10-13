import { useMemo, useState } from "react";
import {
    headlineByPage,
    initialFood,
    roleCopy,
    roleNav,
} from "@/data/workspaceData";
import HomePage, { type AuthMode } from "@/pages/HomePage";
import AdminPage from "@/pages/admin/AdminPage";
import OrganizationPage from "@/pages/organization/OrganizationPage";
import ProviderPage from "@/pages/provider/ProviderPage";
import VolunteerPage from "@/pages/volunteer/VolunteerPage";
import type { FoodItem, Role } from "@/types/workspace";
import WorkspaceLayout from "./components/WorkSpaceLayout";
import type {WorkspacePageProps} from "@/pages/share/type.ts";
import AuthPage from "@/pages/auth/AuthPage.tsx";
import {
    clearAuthenticatedUser,
    getAuthenticatedUser,
    saveAuthenticatedUser,
    type AuthenticatedUser,
} from "@/features/auth/authApi";

type PublicScreen = "home" | "auth" | "workspace";

function App() {
    const [authUser, setAuthUser] = useState<AuthenticatedUser | null>(() => getAuthenticatedUser());
    const [screen, setScreen] = useState<PublicScreen>(() =>
        authUser ? "workspace" : "home",
    );
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [role, setRole] = useState<Role>(authUser?.role ?? "NGO");
    const [page, setPage] = useState("Overview");
    const [food, setFood] = useState(initialFood);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All categories");
    const [toast, setToast] = useState("");
    const [mobileNav, setMobileNav] = useState(false);

    const displayName = authUser?.username ?? roleCopy[role].name;
    const selectedRole = {
        ...roleCopy[role],
        name: displayName,
        initials: displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    };
    const availableRoles = authUser?.roles ?? [];
    const filteredFood = useMemo(() => {
        const searchText = search.toLowerCase();

        return food.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchText) ||
                item.provider.toLowerCase().includes(searchText);
            const matchesCategory =
                category === "All categories" || item.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [category, food, search]);

    const notify = (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 2800);
    };

    const navigate = (label: string) => {
        setPage(label);
        setMobileNav(false);
    };

    const changeRole = (nextRole: Role) => {
        if (!authUser?.roles.includes(nextRole)) return;
        setRole(nextRole);
        setPage("Overview");
        setMobileNav(false);
    };

    const openAuth = (mode: AuthMode) => {
        setAuthMode(mode);
        setScreen("auth");
    };

    const finishAuth = (user: AuthenticatedUser, remember: boolean) => {
        saveAuthenticatedUser(user, remember);
        setAuthUser(user);
        setRole(user.role);
        setPage("Overview");
        setScreen("workspace");
        notify(`Welcome back, ${user.username}.`);
    };

    const signOut = () => {
        clearAuthenticatedUser();
        setAuthUser(null);
        setScreen("home");
    };

    const claimFood = (id: number) => {
        setFood((current) =>
            current.map((item) =>
                item.id === id ? { ...item, status: "Claimed" } : item,
            ),
        );
        notify("Food claimed — the provider has been notified.");
    };

    const completeDelivery = (id: number) => {
        setFood((current) =>
            current.map((item) =>
                item.id === id ? { ...item, status: "Picked Up" } : item,
            ),
        );
        notify("Delivery confirmed. Thank you for making a difference!");
    };

    const assignDelivery = (id: number) => {
        setFood((current) =>
            current.map((item) =>
                item.id === id ? { ...item, status: "Assigned" } : item,
            ),
        );
        notify("Volunteer assigned. The delivery is now scheduled.");
    };

    const publishListing = (item: FoodItem) => {
        setFood((current) => [item, ...current]);
        notify("Your food listing is live and ready to be claimed.");
        navigate("My food listings");
    };

    const pageDescription = headlineByPage[page] ?? [
        "Your FoodCycle workspace",
        "Together, we’re making good food go further.",
    ];
    const [headline, subtitle] = pageDescription;

    const pageProps: WorkspacePageProps = {
        page,
        food,
        filteredFood,
        search,
        setSearch,
        category,
        setCategory,
        onNavigate: navigate,
        onClaim: claimFood,
        onAssign: assignDelivery,
        onComplete: completeDelivery,
        onConfirm: (id: number) => {
            // TODO: Implement confirm logic
            console.log("Confirm action for item:", id);
        },
        onNotify: notify,
        onCreatedListing: publishListing,
    };

    if (screen === "home") {
        return <HomePage onAuth={openAuth} />;
    }

    if (screen === "auth") {
        return (
            <AuthPage
                mode={authMode}
                onModeChange={setAuthMode}
                onBack={() => setScreen("home")}
                onSuccess={finishAuth}
            />
        );
    }

    const RolePage = getRolePage(role);

    return (
        <WorkspaceLayout
            role={role}
            page={page}
            headline={headline}
            subtitle={subtitle}
            activeNav={roleNav[role]}
            selectedRole={selectedRole}
            mobileNav={mobileNav}
            toast={toast}
            onRoleChange={changeRole}
            availableRoles={availableRoles}
            onNavigate={navigate}
            onMobileNavChange={setMobileNav}
            onSignOut={signOut}
            onSearch={setSearch}
            onNotify={notify}
            onDismissToast={() => setToast("")}
        >
            <RolePage {...pageProps} />
        </WorkspaceLayout>
    );
}

function getRolePage(role: Role) {
    switch (role) {
        case "Admin":
            return AdminPage;
        case "NGO":
            return OrganizationPage;
        case "Provider":
            return ProviderPage;
        case "Volunteer":
            return VolunteerPage;
    }
}

export default App;
