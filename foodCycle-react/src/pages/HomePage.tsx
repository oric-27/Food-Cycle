import { useState } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    Heart,
    Leaf,
    MapPin,
    Menu,
    Plus,
    Sparkles,
    Truck,
    Utensils,
    X,
} from "lucide-react";
import FoodCycleBrand from "@/components/FoodCycleBrand.tsx";
import { Button, Card } from "@/components/ui.tsx";

export type AuthMode = "login" | "register" | "reset";

const impactStats = [
    { value: "1,250", suffix: "kg", label: "food rescued", icon: Leaf, color: "bg-[#edf4e9] text-[#628b62]" },
    { value: "8,400", suffix: "", label: "meals served", icon: Utensils, color: "bg-[#fcf1e7] text-[#c58654]" },
    { value: "2,680", suffix: "", label: "people supported", icon: Heart, color: "bg-[#f2eef7] text-[#917bb0]" },
    { value: "315", suffix: "", label: "deliveries completed", icon: Truck, color: "bg-[#edf3f7] text-[#6888a1]" },
];

const steps = [
    { number: "01", icon: Utensils, title: "Providers share surplus", detail: "Shops and kitchens list good food before it goes to waste.", art: "provider" },
    { number: "02", icon: Heart, title: "NGOs claim what they need", detail: "Local organizations reserve fresh food for their communities.", art: "community" },
    { number: "03", icon: Truck, title: "Volunteers bring it together", detail: "Neighbors deliver each rescue with care, from pickup to handoff.", art: "delivery" },
];

export default function HomePage({ onAuth }: { onAuth: (mode: AuthMode) => void }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="min-h-screen overflow-hidden bg-[#fbfcf9] text-[#27372d]">
            <header className="relative z-10 mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-4 md:h-[78px] md:px-7">
                <a className="inline-flex text-inherit no-underline" href="#home" aria-label="FoodCycle home"><FoodCycleBrand /></a>
                <Button variant="ghost" className="size-9 p-0 md:hidden" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</Button>
                <nav className={`${menuOpen ? "flex" : "hidden"} absolute top-[60px] right-2 left-2 flex-col items-stretch gap-0 rounded-xl border border-[#e9eee7] bg-white p-3 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none`} aria-label="Main navigation">
                    <a className="border-b border-[#f0f2ef] px-1 py-3 text-[13px] font-medium text-[#727e73] no-underline hover:text-[#47764f] md:border-0 md:p-0" href="#how-it-works" onClick={closeMenu}>How it works</a>
                    <a className="border-b border-[#f0f2ef] px-1 py-3 text-[13px] font-medium text-[#727e73] no-underline hover:text-[#47764f] md:border-0 md:p-0" href="#our-impact" onClick={closeMenu}>Our impact</a>
                    <a className="border-b border-[#f0f2ef] px-1 py-3 text-[13px] font-medium text-[#727e73] no-underline hover:text-[#47764f] md:border-0 md:p-0" href="#community" onClick={closeMenu}>For communities</a>
                    <div className="mt-2 flex gap-2 md:mt-0">
                        <Button variant="ghost" className="flex-1 text-xs md:flex-none" onClick={() => onAuth("login")}>Log in</Button>
                        <Button className="flex-1 text-xs md:flex-none" onClick={() => onAuth("register")}>Join FoodCycle <ArrowRight size={15} /></Button>
                    </div>
                </nav>
            </header>

            <main id="home">
                <section className="mx-auto grid max-w-[1184px] items-center gap-2 px-5 pt-9 pb-7 md:min-h-[498px] md:grid-cols-[1fr_.96fr] md:gap-6 md:px-6 md:py-10">
                    <div className="relative z-[2]">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8eee4] bg-white py-1.5 pr-2.5 pl-1.5 text-[8px] font-bold tracking-[1px] text-[#738573]">
                            <span className="grid size-6 place-items-center rounded-full bg-[#eaf2e7] text-[#5d885f]"><Leaf size={14} /></span>
                            YANGON’S COMMUNITY FOOD NETWORK
                        </div>
                        <h1 className="mt-5 mb-4 text-[clamp(42px,8vw,64px)] leading-[1.04] font-semibold tracking-[-3px] text-[#2d3d31]">Good food deserves<br />a <em className="text-[#648c5e] not-italic">second chance.</em></h1>
                        <p className="max-w-[470px] text-[13px] leading-7 text-[#7f8b7f] md:text-[15px]">We bring local food providers, community organizations and volunteers together to get surplus food to the people who need it.</p>
                        <div className="mt-5 flex items-center gap-5">
                            <Button className="h-[43px] px-4 text-xs" onClick={() => onAuth("register")}>Be part of the change <ArrowRight size={16} /></Button>
                            <a className="text-xs font-semibold text-[#627267] no-underline" href="#how-it-works">See how it works <span className="ml-1 text-sm text-[#6b9666]">↓</span></a>
                        </div>
                        <div className="mt-5 flex items-center gap-3 md:mt-7">
                            <div className="flex items-center pl-px [&>span]:-ml-0.5 [&>span]:grid [&>span]:size-[27px] [&>span]:place-items-center [&>span]:rounded-full [&>span]:border-2 [&>span]:border-[#fbfcf9] [&>span]:bg-[#eef2e9] [&>span]:text-[11px]">
                                <span>🥗</span><span className="bg-[#f6eade]!">🧑🏽‍🍳</span><span className="bg-[#e8f0e8]!">💚</span><span className="bg-[#e6efe4]! text-[9px] font-bold text-[#638367]">+</span>
                            </div>
                            <div><strong className="block text-[11px] text-[#59685b]">87 local partners</strong><small className="text-[10px] text-[#9aa39a]">growing a more caring community</small></div>
                        </div>
                    </div>

                    <div className="relative isolate mx-[-35px] grid min-h-[350px] scale-[.78] place-items-center md:mx-0 md:min-h-[405px] md:scale-100">
                        <div className="absolute -z-10 size-[310px] rotate-[-11deg] rounded-[48%_52%_49%_51%] bg-[#edf3e9] md:size-[350px]" />
                        <div className="absolute size-[355px] rounded-full border border-[#dfe9dc] md:size-[402px]" />
                        <div className="absolute size-[400px] rounded-full border border-[#e9efe6] md:size-[454px]" />
                        <div className="absolute top-[29px] right-[70px] size-16 rounded-full bg-[#f7e7bd] shadow-[0_0_0_13px_#f7e7bd40]" />
                        <span className="absolute top-[75px] left-[69px] text-[28px] text-[#7a9b68]">✳</span>
                        <span className="absolute right-[58px] bottom-[79px] text-[23px] text-[#d79668]">✳</span>
                        <div className="relative size-[269px] rounded-full border-[9px] border-[#fdfbf4] bg-[#efe4d1] shadow-[0_19px_35px_#475c3321,inset_0_0_0_2px_#dfd3bd]">
                            <span className="absolute top-[45px] left-[45px] -rotate-[21deg] text-[71px] drop-shadow-md">🥬</span>
                            <span className="absolute top-[43px] left-[135px] rotate-[13deg] text-[60px]">🍅</span>
                            <span className="absolute top-[124px] left-[28px] rotate-[32deg] text-[61px]">🥕</span>
                            <span className="absolute top-[132px] left-[130px] -rotate-[7deg] text-[66px]">🥑</span>
                            <div className="absolute top-[117px] left-[72px] h-[18px] w-[122px] rotate-[8deg] rounded-[50%] border-4 border-[#f9f3e6]" />
                            <div className="absolute -bottom-[10px] left-[66px] -z-10 h-[30px] w-[118px] rounded-[50%] bg-[#d9cbb3]" />
                        </div>
                        <Card className="absolute top-[95px] left-0 flex-row items-center gap-2 rounded-[10px] border-[#eef1eb] bg-white px-3 py-2.5 shadow-[0_9px_29px_#43533d15]">
                            <span className="grid size-[30px] place-items-center rounded-lg bg-[#edf4e9] text-[#588358]"><Leaf size={16} /></span>
                            <span><strong className="block text-[10px] text-[#455748]">1,250 kg</strong><small className="text-[8px] text-[#929b91]">food rescued</small></span>
                            <ArrowUpRight size={16} className="text-[#67926a]" />
                        </Card>
                        <Card className="absolute right-0 bottom-[89px] flex-row items-center gap-2 rounded-[10px] border-[#eef1eb] bg-white px-3 py-2.5 shadow-[0_9px_29px_#43533d15]">
                            <span className="grid size-[30px] place-items-center rounded-lg bg-[#fbf0e6] text-[15px]">🍲</span>
                            <span><strong className="block text-[10px] text-[#455748]">8,400 meals</strong><small className="text-[8px] text-[#929b91]">shared with care</small></span>
                        </Card>
                        <span className="absolute bottom-px flex items-center gap-2 text-[7px] font-bold tracking-[1.45px] text-[#91a08e]"><i className="size-1.5 rounded-full bg-[#82a87a] shadow-[0_0_0_3px_#82a87a27]" /> GOOD FOOD. GOOD NEIGHBORS.</span>
                    </div>
                </section>

                <section className="mx-auto grid w-[calc(100%-30px)] max-w-[1134px] grid-cols-2 items-center gap-0 rounded-[13px] border border-[#e9eee7] bg-white p-4 shadow-[0_7px_25px_#485c3810] md:w-[calc(100%-52px)] md:grid-cols-[1.13fr_repeat(4,1fr)] md:gap-3 md:px-6 md:py-[17px]" id="our-impact" aria-label="FoodCycle impact at a glance">
                    <div className="col-span-2 flex flex-col gap-1 pb-3 md:col-span-1 md:pb-0"><span className="text-[8px] font-bold tracking-[1px] text-[#87a07d]">SMALL ACTS, BIG IMPACT</span><strong className="text-[14px] leading-snug text-[#435346] md:text-xs">Look what we’re doing together.</strong></div>
                    {impactStats.map(({ value, suffix, label, icon: Icon, color }) => (
                        <div className="flex items-center gap-2 border-t border-[#eff2ed] py-2.5 first:border-l-0 md:border-t-0 md:border-l md:py-0 md:pl-3" key={label}>
                            <span className={`grid size-8 shrink-0 place-items-center rounded-[10px] ${color}`}><Icon size={17} /></span>
                            <span><strong className="block whitespace-nowrap text-[14px] tracking-tight text-[#37473a] md:text-[15px]">{value} {suffix && <small className="text-[9px] text-[#738275]">{suffix}</small>}</strong><small className="whitespace-nowrap text-[8px] text-[#929b92]">{label}</small></span>
                        </div>
                    ))}
                </section>

                <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6 md:py-20" id="how-it-works">
                    <div className="text-center"><span className="text-[8px] font-bold tracking-[1px] text-[#87a07d]">A LITTLE GOOD GOES A LONG WAY</span><h2 className="mt-2 mb-2 text-2xl font-semibold tracking-tight text-[#35463a] md:text-[29px]">Three steps. <em className="text-[#648c5e] not-italic">More good for everyone.</em></h2><p className="text-[10px] text-[#8b968b]">It’s simple to share what’s extra and get it where it can make a difference.</p></div>
                    <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
                        {steps.map(({ number, icon: Icon, title, detail, art }) => (
                            <Card className="relative grid grid-cols-[120px_1fr] items-center gap-x-2 rounded-xl border-[#edf0eb] bg-white p-2 md:block md:p-[10px]" key={number}>
                                <span className="absolute top-3 right-3 z-10 text-[9px] font-bold tracking-wide text-[#799277] md:top-5 md:right-5">{number}</span>
                                <div className={`relative flex h-[105px] items-center justify-center overflow-hidden rounded-lg md:h-[145px] ${art === "provider" ? "gap-2 bg-[#eef3e9]" : art === "community" ? "bg-[#faf0e8]" : "bg-[#eef3f4]"}`}>
                                    {art === "provider" && <><span className="grid size-14 place-items-center rounded-full bg-[#f9f7ef] text-[29px] shadow-md md:size-[88px] md:text-[43px]">🥕</span><span className="grid size-14 translate-y-2 place-items-center rounded-full bg-[#f9f7ef] text-[29px] shadow-md md:size-[88px] md:text-[43px]">🥖</span><i className="absolute bottom-5 left-1/2 z-[1] grid size-6 -translate-x-1/2 place-items-center rounded-full border-[3px] border-[#eff4e9] bg-[#67946b] text-white md:bottom-8"><Plus size={14} /></i></>}
                                    {art === "community" && <><span className="relative z-[1] text-[38px] md:text-[50px]">💚</span><div className="absolute inset-x-[33px] inset-y-[18px] grid place-items-start rounded-full border border-dashed border-[#d6bca7] pt-2.5 text-[5px] tracking-widest text-[#ae8f77] md:inset-y-[22px] md:inset-x-[82px] md:pt-3 md:text-[7px]">HOPE CENTER</div></>}
                                    {art === "delivery" && <><span className="-translate-x-4 translate-y-2 text-5xl md:text-[65px]">🚲</span><span className="absolute top-[45px] left-[calc(50%+9px)] grid size-7 place-items-center rounded-md bg-white text-base shadow-md md:top-[60px] md:left-[calc(50%+15px)] md:size-[39px] md:text-[21px]">🥬</span><i className="absolute top-[17px] right-7 text-[#66896c] md:top-6 md:right-[69px]"><MapPin size={14} /></i></>}
                                </div>
                                <div className="flex items-start gap-2.5 px-1 py-2 md:pt-3.5 md:pb-2">
                                    <span className="grid size-[30px] shrink-0 place-items-center rounded-lg bg-[#edf4e9] text-[#628662]"><Icon size={17} /></span>
                                    <div><h3 className="mt-0.5 mb-1 text-[9px] font-semibold text-[#435246] md:text-[10px]">{title}</h3><p className="m-0 max-w-[175px] text-[8px] leading-relaxed text-[#929b92]">{detail}</p></div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="relative mx-[15px] mb-[30px] flex flex-wrap items-center gap-3 overflow-hidden rounded-[14px] bg-[#47764f] px-[17px] py-5 text-[#f8fbf5] md:mx-auto md:mb-[50px] md:min-h-[197px] md:max-w-[1134px] md:gap-[17px] md:px-10 md:py-7">
                    <span className="relative z-[1] grid size-[37px] shrink-0 place-items-center rounded-xl bg-white/15 text-[#ecf4e7] md:size-[43px]"><Sparkles size={19} /></span>
                    <div className="relative z-[1] w-[calc(100%-50px)] flex-1">
                        <span className="text-[8px] font-bold tracking-[1.3px] text-[#d1e3ca]">THERE’S A PLACE FOR YOU HERE</span>
                        <h2 className="mt-2 mb-1.5 text-[17px] leading-tight font-semibold tracking-tight text-white md:text-[21px]">Let’s make sure good food<br className="hidden md:block" /> finds a good home.</h2>
                        <p className="m-0 text-[8px] text-[#d4e2d0] md:text-[9px]">Whether you share, rescue, or deliver — you’re part of the good.</p>
                    </div>
                    <Button variant="secondary" className="z-[1] ml-12 h-[38px] border-[#f4f7ef] bg-[#f4f7ef] px-4 text-[#456f4a] hover:bg-white md:ml-0" onClick={() => onAuth("register")}>Join our community <ArrowRight size={16} /></Button>
                    <span className="pointer-events-none absolute right-[-5px] bottom-[-84px] text-[247px] leading-none text-white/[.05]">✳</span>
                </section>
            </main>

            <footer className="mx-auto flex min-h-[77px] max-w-[1190px] items-center justify-between gap-4 border-t border-[#edf0eb] px-4 py-4 md:px-7">
                <a className="inline-flex no-underline" href="#home"><FoodCycleBrand /></a>
                <span className="hidden items-center gap-1 text-[8px] text-[#929b91] md:flex">Made with care in Yangon <Heart size={13} className="text-[#cb8d75]" fill="currentColor" /></span>
                <small className="text-[7px] text-[#a4aba3] md:text-[8px]">© 2026 FoodCycle · Good food, going further.</small>
            </footer>
        </div>
    );
}

