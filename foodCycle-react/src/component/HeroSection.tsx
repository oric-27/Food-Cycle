interface HeroSectionProps {
    onRegister?: () => void;
}

export default function HeroSection({ onRegister }: HeroSectionProps) {
    return (
        <main id="landing" className="bg-[#f9fbf9]">
            <section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-14 md:py-20 lg:grid-cols-2">
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
                            type="button"
                            onClick={onRegister}
                            className="flex items-center gap-2 px-6 py-3.5 bg-[#1b8d62] text-white font-bold rounded-xl shadow-lg shadow-[#1b8d62]/20 hover:bg-[#13674c] active:scale-95 transition-all"
                        >
                            Get started <span>→</span>
                        </button>

                        <a
                            href="#how-it-works"
                            className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold text-[#1b8d62] hover:text-[#13674c] transition-colors"
                        >
                            See how it works <span className="text-xs">↓</span>
                        </a>
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
            <section id="how-it-works" className="border-t border-[#dcefe4] bg-white">
                <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#d2efe0] bg-[#eaf7ef] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1b8d62]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ec9b5d]" />
                            How FoodCycle works
                        </span>
                        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#172d27] md:text-5xl">
                            From surplus to shared.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#75817a]">
                            We make it simple for good food to move quickly from local businesses to the people and communities who need it.
                        </p>
                    </div>

                    <div className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-8">
                        <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-[#cce8d8] md:block" />
                        {[
                            {
                                number: "01",
                                icon: "🏪",
                                title: "A business lists food",
                                description: "Restaurants and shops post safe surplus food with the pickup time and quantity.",
                            },
                            {
                                number: "02",
                                icon: "📍",
                                title: "A community finds it",
                                description: "Organizations and volunteers discover nearby listings before they expire.",
                            },
                            {
                                number: "03",
                                icon: "🤝",
                                title: "Good food gets shared",
                                description: "A simple handoff turns surplus into meals, less waste, and a stronger community.",
                            },
                        ].map(({ number, icon, title, description }) => (
                            <article key={number} className="group relative z-10 rounded-3xl border border-[#dcefe4] bg-[#f9fbf9] p-6 transition-all hover:-translate-y-1 hover:border-[#9ed5b9] hover:shadow-xl hover:shadow-[#1b8d62]/10 md:p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm ring-1 ring-[#dcefe4] transition-transform group-hover:scale-105">
                                        {icon}
                                    </div>
                                    <span className="text-sm font-extrabold tracking-[0.18em] text-[#ec9b5d]">{number}</span>
                                </div>
                                <h3 className="mt-7 text-xl font-extrabold text-[#172d27]">{title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-[#75817a]">{description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl bg-[#172d27] px-6 py-7 text-white md:flex-row md:px-10">
                        <div>
                            <p className="text-lg font-extrabold">Every meal has another table.</p>
                            <p className="mt-1 text-sm text-white/65">Be part of the next food rescue in your community.</p>
                        </div>
                        <button
                            type="button"
                            onClick={onRegister}
                            className="shrink-0 rounded-xl bg-[#ccecdb] px-5 py-3 text-sm font-extrabold text-[#13674c] transition hover:bg-white"
                        >
                            Join the movement <span className="ml-1">→</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}