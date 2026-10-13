import type { ReactNode } from "react";
import {
    Bell,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Heart,
    Leaf,
    LogOut,
    Menu,
    MoreHorizontal,
    Plus,
    Search,
    SlidersHorizontal,
    Sparkles,
    X,
} from "lucide-react";
import { Button, SelectField } from "@/components/ui";
import type {Role} from "@/types/workspace.ts";

type NavigationItem = { label: string; icon: typeof Leaf };
type NavigationGroup = { group: string; items: NavigationItem[] };
type WorkspaceUser = { name: string; org: string; initials: string };

export type WorkspaceLayoutProps = {
    role: Role;
    page: string;
    headline: string;
    subtitle: string;
    activeNav: NavigationGroup[];
    selectedRole: WorkspaceUser;
    mobileNav: boolean;
    toast: string;
    children: ReactNode;
    availableRoles: Role[];
    onRoleChange: (role: Role) => void;
    onNavigate: (page: string) => void;
    onMobileNavChange: (open: boolean) => void;
    onSignOut: () => void;
    onSearch: (value: string) => void;
    onNotify: (message: string) => void;
    onDismissToast: () => void;
};

export default function WorkspaceLayout({
                                            role,
                                            page,
                                            headline,
                                            subtitle,
                                            activeNav,
                                            selectedRole,
                                            mobileNav,
                                            toast,
                                            children,
                                            availableRoles,
                                            onRoleChange,
                                            onNavigate,
                                            onMobileNavChange,
                                            onSignOut,
                                            onSearch,
                                            onNotify,
                                            onDismissToast,
                                        }: WorkspaceLayoutProps) {
    return (
        <div className="app-shell">
            <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
                <div className="brand">
                    <div className="brand-mark">
                        <Leaf size={22} strokeWidth={2.5} />
                    </div>
                    <div className="brand-name">
                        foodcycle<span>.</span>
                        <small>GOOD FOOD, GOING FURTHER</small>
                    </div>
                    <button
                        aria-label="Close menu"
                        className="icon-button mobile-close"
                        onClick={() => onMobileNavChange(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="role-label">WORKING AS</div>
                <div className="role-switcher">
                    <div className="avatar avatar-green">{selectedRole.initials}</div>
                    <div className="switcher-copy">
                        <strong>{role} workspace</strong>
                        <small>{selectedRole.org}</small>
                    </div>
                    <ChevronDown size={16} className="muted-icon" />
                    <SelectField
                        label="Select workspace role"
                        value={role}
                        onValueChange={(value) => onRoleChange(value as Role)}
                        className="absolute inset-0 h-full w-full opacity-0"
                        options={availableRoles.map(
                            (option) => ({ value: option, label: option }),
                        )}
                    />
                </div>

                <nav className="side-nav" aria-label={`${role} navigation`}>
                    {activeNav.map((group) => (
                        <div className="nav-group" key={group.group}>
                            <div className="nav-label">{group.group}</div>
                            {group.items.map(({ label, icon: Icon }) => (
                                <button
                                    className={`nav-item ${page === label ? "nav-active" : ""}`}
                                    key={label}
                                    onClick={() => onNavigate(label)}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{label}</span>
                                    {label === "Claim requests" && (
                                        <span className="nav-count">3</span>
                                    )}
                                    {label === "Available missions" && (
                                        <span className="nav-count">4</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="impact-mini">
                        <div className="impact-mini-icon">
                            <Sparkles size={16} />
                        </div>
                        <span>Our community has rescued</span>
                        <strong>
                            1,250 kg <small>of food</small>
                        </strong>
                        <div className="mini-progress">
                            <span />
                        </div>
                        <small className="goal-copy">82% of this month’s goal</small>
                    </div>
                    <button className="nav-item logout" onClick={onSignOut}>
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                    <div className="sidebar-user">
                        <div className="avatar avatar-peach">{selectedRole.initials}</div>
                        <div className="switcher-copy">
                            <strong>{selectedRole.name}</strong>
                            <small>{role} coordinator</small>
                        </div>
                        <MoreHorizontal size={18} className="muted-icon" />
                    </div>
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="breadcrumb">
                        <button
                            className="icon-button mobile-menu"
                            aria-label="Open menu"
                            onClick={() => onMobileNavChange(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <span>Workspace</span>
                        <ChevronRight size={14} />
                        <strong>{page}</strong>
                    </div>
                    <div className="top-actions">
                        <div className="search-global">
                            <Search size={16} />
                            <input
                                aria-label="Search"
                                placeholder="Search anything..."
                                onChange={(event) => onSearch(event.target.value)}
                            />
                        </div>
                        <button
                            className="icon-button notification"
                            aria-label="Notifications"
                            onClick={() =>
                                onNotify("You’re all caught up — no new notifications.")
                            }
                        >
                            <Bell size={19} />
                            <i />
                        </button>
                        <button
                            className="top-avatar"
                            aria-label={`${selectedRole.name} profile`}
                        >
                            {selectedRole.initials}
                        </button>
                    </div>
                </header>

                <div className="page-content">
                    <div className="page-header">
                        <div>
                            <div className="eyebrow">
                                <span className="status-dot" /> THURSDAY, OCTOBER 8, 2026
                            </div>
                            <h1>{headline}</h1>
                            <p>{subtitle}</p>
                        </div>
                        <div className="header-actions">
                            {role === "Provider" && (
                                <Button onClick={() => onNavigate("Create listing")}>
                                    <Plus size={17} /> Create listing
                                </Button>
                            )}
                            {role === "NGO" && page === "Available food" && (
                                <Button
                                    variant="outline"
                                    onClick={() => onNotify("Filters are ready to use below.")}
                                >
                                    <SlidersHorizontal size={16} /> Filters
                                </Button>
                            )}
                            <button
                                className="date-pill"
                                onClick={() => onNotify("Showing impact for October 2026.")}
                            >
                                <CalendarDays size={16} />
                                <span>Last 30 days</span>
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>

                    {children}
                </div>
                <footer className="footer">
                    <span>© 2026 FoodCycle</span>
                    <span>
            Small acts. Big impact. <Heart size={13} fill="currentColor" />
          </span>
                </footer>
            </main>
            {toast && (
                <div className="toast">
                    <CheckCircle2 size={18} />
                    <span>{toast}</span>
                    <button aria-label="Dismiss" onClick={onDismissToast}>
                        <X size={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
