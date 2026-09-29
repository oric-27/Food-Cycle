import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";

function Header() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState(() => localStorage.getItem("displayName") ?? "");

    useEffect(() => {
        const syncSession = () => setDisplayName(localStorage.getItem("displayName") ?? "");
        window.addEventListener("foodcycle-auth-change", syncSession);
        window.addEventListener("storage", syncSession);
        return () => {
            window.removeEventListener("foodcycle-auth-change", syncSession);
            window.removeEventListener("storage", syncSession);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("displayName");
        window.dispatchEvent(new Event("foodcycle-auth-change"));
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main navigation">
                <a href="#landing" className="flex items-center gap-2.5" aria-label="FoodCycle home">
                    <span className="flex h-6 items-end gap-1" aria-hidden="true">
                        <span className="h-3 w-1.5 rounded-full bg-[#1b8d62]" />
                        <span className="h-6 w-1.5 rounded-full bg-[#1b8d62]" />
                        <span className="h-4 w-1.5 rounded-full bg-[#1b8d62]" />
                    </span>
                    <span className="text-xl font-extrabold tracking-tight text-gray-900">
                        food<span className="text-[#1b8d62]">cycle</span>
                    </span>
                </a>

                <div className="hidden items-center gap-8 text-sm font-semibold text-gray-500 md:flex">
                    <a className="transition hover:text-[#1b8d62]" href="#how-it-works">How it works</a>
                    <a className="transition hover:text-[#1b8d62]" href="#impact">Our impact</a>
                    <a className="transition hover:text-[#1b8d62]" href="#about">About us</a>
                    <Link to="/provider" className="transition hover:text-[#1b8d62]">Food Provider Portal</Link>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {displayName ? (
                        <>
                            <Link
                                to="/provider"
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#172d27] transition hover:bg-[#eaf7ef]"
                                aria-label={`Open provider profile for ${displayName}`}
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf7ef] text-[#1b8d62]">
                                    <UserRound size={17} />
                                </span>
                                <span className="max-w-32 truncate">{displayName}</span>
                            </Link>
                            <button
                                type="button"
                                onClick={logout}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-[#64716b] transition hover:bg-red-50 hover:text-red-700"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Log out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-lg px-3 py-2 text-sm font-bold text-[#1b8d62] transition hover:bg-[#eaf7ef] sm:px-4"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="hidden rounded-lg bg-[#1b8d62] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#13674c] sm:block"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;