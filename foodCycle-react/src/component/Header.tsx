function Header() {
    return (
        <>
            <nav className="w-full bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Brand Logo & Name */}
                    <a href="#landing" className="flex items-center gap-2.5 group">
                        {/* Green Bar Chart Icon */}
                        <div className="flex items-end gap-1 h-5">
                            <span className="w-1.5 h-3 bg-[#1b8d62] rounded-full"></span>
                            <span className="w-1.5 h-5 bg-[#1b8d62] rounded-full"></span>
                            <span className="w-1.5 h-2.5 bg-[#1b8d62] rounded-full"></span>
                        </div>

                        {/* Brand Text */}
                        <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            food<span className="text-[#1b8d62]">cycle</span>
          </span>
                    </a>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                        <span className="hidden sm:inline">Already have an account?</span>
                        <button
                            data-screen="login"
                            className="px-4 py-2 text-[#1b8d62] font-semibold bg-white border border-[#1b8d62]/40 rounded-lg hover:bg-[#eaf7ef] active:scale-95 transition-all shadow-sm"
                        >
                            Log in
                        </button>
                    </div>

                </div>
            </nav>
        </>
    );
}

export default Header;