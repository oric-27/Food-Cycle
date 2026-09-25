import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authApi";
import type { UserRole } from "../types/auth";

interface AuthModalProps {
    initialMode: "login" | "register";
    onClose: () => void;
}

function LockIcon() {
    return (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 10V7.75a4.5 4.5 0 0 1 9 0V10m-10.5 0h12v9h-12v-9Z" />
        </svg>
    );
}

function AuthComponent({ initialMode, onClose }: AuthModalProps) {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode);
    const [registerStep, setRegisterStep] = useState<1 | 2>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole | "">("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSubmitted(false);

        if (mode === "register" && registerStep === 1) {
            setRegisterStep(2);
            return;
        }

        setIsSubmitting(true);
        try {
            if (mode === "login") {
                const response = await login(email, password);
                console.log("Login token:", response.token);
                localStorage.setItem("accessToken", response.token);
                setSubmitted(true);
            } else {
                if (!role) {
                    setError("Please choose a role.");
                    return;
                }
                await register({ username, email, password, roleName: role });
                setSubmitted(true);
                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Unable to complete your request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchMode = (nextMode: "login" | "register") => {
        setMode(nextMode);
        setRegisterStep(1);
        setSubmitted(false);
        setError("");
        navigate(nextMode === "login" ? "/login" : "/register");
    };
    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#10251e]/70 px-4 py-8 backdrop-blur-sm sm:px-6"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                aria-label={mode === "login" ? "Log in to FoodCycle" : "Create a FoodCycle account"}
                aria-modal="true"
                className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-[#10251e]/25 md:h-[620px] md:grid-cols-[0.85fr_1.15fr]"
                role="dialog"
            >
                <div className="hidden h-full flex-col justify-between bg-[#172d27] p-10 text-white md:flex">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-6 items-end gap-1" aria-hidden="true">
                                <span className="h-3 w-1.5 rounded-full bg-[#8dd5ae]" />
                                <span className="h-6 w-1.5 rounded-full bg-[#8dd5ae]" />
                                <span className="h-4 w-1.5 rounded-full bg-[#8dd5ae]" />
                            </span>
                            <span className="text-xl font-extrabold tracking-tight">food<span className="text-[#8dd5ae]">cycle</span></span>
                        </div>
                        <p className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-[#8dd5ae]">Welcome back</p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-tight">Good food is better when it is shared.</h2>
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
                            Join a community turning surplus into meaningful meals, one handoff at a time.
                        </p>
                    </div>
                    <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-extrabold">8,432</p>
                        <p className="mt-1 text-sm text-white/60">meals rescued by our community this month</p>
                    </div>
                </div>

                <div className="flex h-full flex-col justify-center overflow-y-scroll p-6 sm:p-10">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close authentication form"
                        className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
                        </svg>
                    </button>
                    <div className="md:hidden">
                        <span className="text-lg font-extrabold tracking-tight text-gray-900">food<span className="text-[#1b8d62]">cycle</span></span>
                    </div>
                    <div className="mt-8 md:mt-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#172d27]">
                            {mode === "login"
                                ? "Welcome back"
                                : registerStep === 1
                                    ? "Create your account"
                                    : "Choose your role"}
                        </h1>
                        <p className="mt-2 text-sm text-[#75817a]">
                            {mode === "login"
                                ? "Log in to continue your food rescue journey."
                                : registerStep === 1
                                    ? "Start making an impact in your community today."
                                    : "Tell us how you would like to help save good food."}
                        </p>
                    </div>

                    {mode === "register" && (
                        <div className="mt-7 flex items-center gap-3" aria-label={`Registration step ${registerStep} of 2`}>
                            {[1, 2].map((step) => (
                                <div key={step} className="flex flex-1 items-center gap-2">
                                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${registerStep >= step ? "bg-[#1b8d62] text-white" : "bg-[#eaf2ec] text-[#8b9790]"}`}>
                                        {step}
                                    </span>
                                    <span className={`text-xs font-bold ${registerStep >= step ? "text-[#1b8d62]" : "text-[#8b9790]"}`}>
                                        {step === 1 ? "Your details" : "Your role"}
                                    </span>
                                    {step === 1 && <span className="h-px flex-1 bg-[#dce8df]" />}
                                </div>
                            ))}
                        </div>
                    )}
                    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                        {mode === "register" && registerStep === 1 && (
                            <label className="block text-sm font-semibold text-[#172d27]">
                                Username
                                <input required name="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm text-[#172d27] outline-none transition placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
                            </label>
                        )}
                        {(mode === "login" || registerStep === 1) && (
                            <>
                                <label className="block text-sm font-semibold text-[#172d27]">
                                    Email address
                                    <input required name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-4 py-3 text-sm text-[#172d27] outline-none transition placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
                                </label>
                                <label className="block text-sm font-semibold text-[#172d27]">
                                    Password
                                    <span className="relative mt-2 block">
                                        <span className="pointer-events-none absolute left-4 top-3.5 text-[#8da097]"><LockIcon /></span>
                                        <input required minLength={8} name="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] py-3 pl-12 pr-20 text-sm text-[#172d27] outline-none transition placeholder:text-[#a5b0a9] focus:border-[#1b8d62] focus:ring-4 focus:ring-[#1b8d62]/10" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 rounded-lg px-2 py-1 text-xs font-bold text-[#1b8d62] hover:bg-[#eaf7ef]">
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </span>
                                </label>
                            </>
                        )}
                        {mode === "register" && registerStep === 2 && (
                            <div className="block text-sm font-semibold text-[#172d27]">
                                I want to join as
                                <span className="mt-2 grid gap-3">
                                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dce8df] p-4 transition has-[:checked]:border-[#1b8d62] has-[:checked]:bg-[#f1faf4]">
                                        <input required type="radio" name="role" value="FOOD_PROVIDER" checked={role === "FOOD_PROVIDER"} onChange={() => setRole("FOOD_PROVIDER")} className="mt-1 accent-[#1b8d62]" />
                                        <span>
                                            <span className="block text-sm font-bold text-[#172d27]">Food provider</span>
                                            <span className="mt-1 block text-xs font-normal text-[#75817a]">Share surplus food with the community.</span>
                                        </span>
                                    </label>
                                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dce8df] p-4 transition has-[:checked]:border-[#1b8d62] has-[:checked]:bg-[#f1faf4]">
                                        <input type="radio" name="role" value="ORGANIZATION" checked={role === "ORGANIZATION"} onChange={() => setRole("ORGANIZATION")} className="mt-1 accent-[#1b8d62]" />
                                        <span>
                                            <span className="block text-sm font-bold text-[#172d27]">Community organization</span>
                                            <span className="mt-1 block text-xs font-normal text-[#75817a]">Connect rescued food with people in need.</span>
                                        </span>
                                    </label>
                                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#dce8df] p-4 transition has-[:checked]:border-[#1b8d62] has-[:checked]:bg-[#f1faf4]">
                                        <input type="radio" name="role" value="VOLUNTEER" checked={role === "VOLUNTEER"} onChange={() => setRole("VOLUNTEER")} className="mt-1 accent-[#1b8d62]" />
                                        <span>
                                            <span className="block text-sm font-bold text-[#172d27]">Volunteer</span>
                                            <span className="mt-1 block text-xs font-normal text-[#75817a]">Help move good food where it is needed.</span>
                                        </span>
                                    </label>
                                </span>
                            </div>
                        )}
                        {mode === "login" && (
                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 text-[#75817a]">
                                    <input type="checkbox" className="h-4 w-4 appearance-none rounded-full border border-[#c9d9ce] bg-white accent-[#1b8d62] checked:border-[#1b8d62] checked:bg-[#1b8d62]" />
                                    Remember me
                                </label>
                                <button type="button" className="font-bold text-[#1b8d62] hover:text-[#13674c]">Forgot password?</button>
                            </div>
                        )}
                        {mode === "register" && registerStep === 2 && (
                            <button type="button" onClick={() => setRegisterStep(1)} className="w-full rounded-xl border border-[#dce8df] px-4 py-2 text-xs font-bold text-[#75817a] transition hover:border-[#1b8d62] hover:text-[#1b8d62]">
                                ← Back to your details
                            </button>
                        )}
                        <button type="submit" disabled={isSubmitting || submitted} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b8d62] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#1b8d62]/20 transition hover:bg-[#13674c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                            {submitted
                                ? (mode === "register" ? "Registration successful!" : "Login successful!")
                                : isSubmitting
                                    ? "Please wait..."
                                    : mode === "login"
                                        ? "Log in to FoodCycle"
                                        : registerStep === 1
                                            ? "Continue to role selection"
                                            : "Create my account"} {!submitted && <span aria-hidden="true">→</span>}
                        </button>
                        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700" role="alert">{error}</p>}
                    </form>
                    <p className="mt-6 text-center text-sm text-[#75817a]">
                        {mode === "login" ? "Don&apos;t have an account?" : "Already have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => switchMode(mode === "login" ? "register" : "login")}
                            className="font-bold text-[#1b8d62] transition hover:text-[#13674c]"
                        >
                            {mode === "login" ? "Create an account" : "Log in"}
                        </button>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default AuthComponent;