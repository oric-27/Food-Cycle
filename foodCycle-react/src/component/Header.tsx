interface HeaderProps {
    onLogin?: () => void;
    onRegister?: () => void;
}

function Header({ onLogin, onRegister }: HeaderProps) {
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
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        type="button"
                        onClick={onLogin}
                        className="rounded-lg px-3 py-2 text-sm font-bold text-[#1b8d62] transition hover:bg-[#eaf7ef] sm:px-4"
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        onClick={onRegister}
                        className="hidden rounded-lg bg-[#1b8d62] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#13674c] sm:block"
                    >
                        Get started
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;