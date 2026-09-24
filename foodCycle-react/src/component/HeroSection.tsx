export default function HeroSection() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#f9fbf9]">
            {/* Left Copy Section */}
            <div className="flex flex-col items-start gap-6 z-10">
                {/* Pill Label */}
                <span className="px-3.5 py-1.5 text-xs font-semibold bg-[#eaf7ef] text-[#1b8d62] rounded-full border border-[#d2efe0]">
          A little food can go a long way
        </span>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#172d27] tracking-tight leading-[1.1]">
                    Good food <br />
                    deserves <br />
                    <em className="not-italic text-[#1b8d62]">another table.</em>
                </h1>

                {/* Description Text */}
                <p className="text-base text-[#75817a] max-w-md leading-relaxed">
                    FoodCycle connects surplus food from local businesses with the people and communities who need it most.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                        data-screen="register"
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#1b8d62] text-white font-bold rounded-xl shadow-lg shadow-[#1b8d62]/20 hover:bg-[#13674c] active:scale-95 transition-all"
                    >
                        Get started <span>→</span>
                    </button>

                    <button
                        data-screen="tutorial"
                        className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold text-[#1b8d62] hover:text-[#13674c] transition-colors"
                    >
                        See how it works <span className="text-xs">↓</span>
                    </button>
                </div>

                {/* Social Proof Section */}
                <div className="flex items-center gap-3 pt-6 mt-2 border-t border-gray-100 w-full max-w-md">
                    <div className="flex -space-x-2">
                        <span className="w-8 h-8 rounded-full bg-[#fce0cf] text-[#8e4921] font-bold text-xs flex items-center justify-center border-2 border-white">MT</span>
                        <span className="w-8 h-8 rounded-full bg-[#d7f3e3] text-[#1e603e] font-bold text-xs flex items-center justify-center border-2 border-white">KK</span>
                        <span className="w-8 h-8 rounded-full bg-[#faedd2] text-[#865d1d] font-bold text-xs flex items-center justify-center border-2 border-white">AY</span>
                        <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold text-xs flex items-center justify-center border-2 border-white">+</span>
                    </div>
                    <p className="text-xs text-[#75817a]">
                        <strong className="text-[#172d27] font-bold">8,432 meals</strong> rescued by our community this month
                    </p>
                </div>
            </div>

            {/* Right Artwork / Cards Section */}
            <div className="relative flex items-center justify-center w-full min-h-[380px] md:min-h-[460px]">
                {/* Soft Green Organic Background Shape */}
                <div className="absolute inset-0 bg-[#e7f5ed]/60 rounded-[40px] md:rounded-[60px] transform -rotate-1"></div>
                <div className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] bg-[#ccecdb]/50 rounded-full right-8 top-6"></div>

                {/* Decorative Floating Dots */}
                <div className="absolute left-6 bottom-12 w-2.5 h-2.5 bg-[#ec9b5d] rounded-full"></div>
                <div className="absolute right-12 top-10 w-2 h-2 bg-[#1b8d62] rounded-full opacity-40"></div>

                {/* Main Card: Weight Rescued */}
                <div className="absolute left-6 md:left-10 top-12 bg-white rounded-2xl p-5 shadow-xl shadow-black/5 border border-gray-100/80 w-48 md:w-52 z-20 transition-transform hover:-translate-y-1">
                    <span className="text-[#ec9b5d] text-sm">✦</span>
                    <span className="block text-[10px] font-extrabold tracking-widest text-gray-400 mt-1 uppercase">THIS MONTH</span>
                    <strong className="block text-2xl md:text-3xl font-extrabold text-[#172d27] mt-1">
                        1,248 <small className="text-sm font-semibold text-gray-500">kg</small>
                    </strong>
                    <span className="block text-xs text-gray-400 mt-0.5">of food rescued</span>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                        <div className="w-3/4 h-full bg-[#1b8d62] rounded-full"></div>
                    </div>
                </div>

                {/* Plate Art Card */}
                <div className="absolute right-8 md:right-12 top-8 bg-[#fff6e9] rounded-2xl p-4 shadow-lg shadow-black/5 border border-orange-100/50 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center text-4xl md:text-5xl z-10">
                    <span>🍲</span>
                </div>

                {/* Mini Card: Meals Shared */}
                <div className="absolute right-10 md:right-16 bottom-10 bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100/80 w-36 z-20 transition-transform hover:-translate-y-1">
                    <span className="text-[#ec9b5d] text-sm">♧</span>
                    <strong className="block text-xl font-extrabold text-[#172d27] mt-1">8.4k</strong>
                    <small className="block text-xs text-gray-400 font-medium">meals shared</small>
                </div>
            </div>
        </section>
    );
}