import { useState, type FormEvent } from "react";
import {
    ArrowRight,
    ChevronRight,
    MapPin,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { Button, Input, SelectField } from "@/components/ui";
import FoodCycleBrand from "@/components/FoodCycleBrand";
import type { AuthMode } from "@/pages/HomePage";
import type { Role } from "@/types/workspace";
import {
    getAuthErrorMessage,
    login,
    register,
    type AuthenticatedUser,
} from "@/features/auth/authApi";

type AuthPageProps = {
    mode: AuthMode;
    onModeChange: (mode: AuthMode) => void;
    onBack: () => void;
    onSuccess: (user: AuthenticatedUser, remember: boolean) => void;
};

export default function AuthPage({
                                     mode,
                                     onModeChange,
                                     onBack,
                                     onSuccess,
                                 }: AuthPageProps) {
    const [role, setRole] = useState<Role>("NGO");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ kind: "error" | "success"; message: string } | null>(null);
    const isRegister = mode === "register";
    const isReset = mode === "reset";
    const roleOptions = [
        { value: "NGO", label: "I’m an NGO / community organization" },
        { value: "Provider", label: "I’m a food provider" },
        { value: "Volunteer", label: "I’m a volunteer" },
    ];
    const changeMode = (nextMode: AuthMode) => {
        setFeedback(null);
        onModeChange(nextMode);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback(null);

        if (isReset) {
            setFeedback({
                kind: "error",
                message: "Password reset is not available yet. Please contact your FoodCycle administrator.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            if (isRegister) {
                const roleName = role === "NGO"
                    ? "ORGANIZATION"
                    : role === "Provider"
                        ? "FOOD_PROVIDER"
                        : "VOLUNTEER";
                await register({
                    username: name.trim(),
                    email: email.trim(),
                    password,
                    roleName,
                    ...(role === "NGO" ? { organizationName: organizationName.trim() } : {}),
                    ...(role === "Provider" ? { businessName: organizationName.trim() } : {}),
                });
                setPassword("");
                setFeedback({
                    kind: "success",
                    message: "Your account request was submitted. Sign in after FoodCycle approves your account.",
                });
                onModeChange("login");
            } else {
                const user = await login(email.trim(), password);
                onSuccess(user, remember);
            }
        } catch (error) {
            setFeedback({ kind: "error", message: getAuthErrorMessage(error) });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-story">
                <FoodCycleBrand light />
                <button className="auth-back" onClick={onBack}>
                    <ChevronRight size={15} /> Back to home
                </button>
                <div className="auth-story-copy">
          <span className="auth-story-kicker">
            <Sparkles size={14} /> A LITTLE GOOD GOES A LONG WAY
          </span>
                    <h1>
                        {isRegister ? (
                            <>
                                Join a community
                                <br />
                                that <em>cares.</em>
                            </>
                        ) : isReset ? (
                            <>
                                Let’s get you
                                <br />
                                back to the <em>good.</em>
                            </>
                        ) : (
                            <>
                                Welcome back
                                <br />
                                to the <em>good.</em>
                            </>
                        )}
                    </h1>
                    <p>
                        {isRegister
                            ? "Together, we can make good food go further — one neighbor, one meal, one small act at a time."
                            : isReset
                                ? "A secure reset link is the first step to getting back to your FoodCycle community."
                                : "Your community is doing good things. Sign in and pick up right where you left off."}
                    </p>
                    <div className="auth-story-impact">
                        <div>
                            <strong>
                                1,250<span> kg</span>
                            </strong>
                            <small>food rescued together</small>
                        </div>
                        <div>
                            <strong>8,400</strong>
                            <small>meals shared with care</small>
                        </div>
                    </div>
                    <div className="auth-quote">
                        <span>“</span>
                        <p>When we share what we have, there’s enough to go around.</p>
                        <small>THE FOODCYCLE COMMUNITY</small>
                    </div>
                </div>
                <div className="auth-story-foot">
                    <ShieldCheck size={15} /> A safe, local network built on trust.
                </div>
            </section>
            <section className="auth-main">
                <div className="auth-main-top">
          <span>
            {isRegister || isReset
                ? "Already part of FoodCycle?"
                : "New around here?"}
          </span>
                    <button
                        onClick={() => changeMode(isRegister || isReset ? "login" : "register")}
                    >
                        {isRegister || isReset ? "Sign in" : "Create an account"}
                    </button>
                </div>
                <div className="auth-form-wrap">
          <span className="auth-form-kicker">
            {isRegister
                ? "JOIN THE MOVEMENT"
                : isReset
                    ? "ACCOUNT SUPPORT"
                    : "WELCOME BACK"}
          </span>
                    <h2>
                        {isRegister
                            ? "Create your account"
                            : isReset
                                ? "Reset your password"
                                : "Sign in to FoodCycle"}
                    </h2>
                    <p className="auth-form-intro">
                        {isRegister
                            ? "A few details and you’ll be ready to make a difference."
                            : isReset
                                ? "Password reset is not available yet. Contact your FoodCycle administrator."
                                : "Your next good thing is just around the corner."}
                    </p>
                    {feedback && (
                        <p className={`auth-feedback auth-feedback-${feedback.kind}`} role="status">
                            {feedback.message}
                        </p>
                    )}
                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                            {isRegister && (
                                <label>
                                    Your name
                                    <Input
                                        required
                                        placeholder="e.g. Thiri Aung"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </label>
                            )}
                            <label>
                                Email address
                                <Input
                                    required
                                    type="email"
                                    placeholder="you@organization.org"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </label>
                            {!isReset && (
                                <label>
                                    Password
                                    <Input
                                        required
                                        type="password"
                                        minLength={8}
                                        placeholder={
                                            isRegister
                                                ? "At least 8 characters"
                                                : "Enter your password"
                                        }
                                        autoComplete={
                                            isRegister ? "new-password" : "current-password"
                                        }
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </label>
                            )}
                            {isRegister && (
                                <label>
                                    How will you help?
                                    <SelectField
                                        label="How will you help?"
                                        value={role}
                                        onValueChange={(value) => setRole(value as Role)}
                                        options={roleOptions}
                                    />
                                </label>
                            )}
                            {isRegister && role !== "Volunteer" && (
                                <label>
                                    {role === "NGO" ? "Organization name" : "Business name"}
                                    <Input
                                        required
                                        placeholder={
                                            role === "NGO"
                                                ? "e.g. Hope Community Center"
                                                : "e.g. Green Basket Market"
                                        }
                                        value={organizationName}
                                        onChange={(event) => setOrganizationName(event.target.value)}
                                    />
                                </label>
                            )}
                            {isRegister && (
                                <label className="auth-terms">
                                    <input type="checkbox" required />
                                    <span>
                    I agree to the community guidelines and food safety
                    standards.
                  </span>
                                </label>
                            )}
                            {!isRegister && !isReset && (
                                <div className="auth-form-options">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={remember}
                                            onChange={(event) => setRemember(event.target.checked)}
                                        /> <span>Remember me</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            changeMode("reset");
                                        }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                            <Button type="submit" className="auth-submit" disabled={isSubmitting}>
                                {isSubmitting
                                    ? "Please wait..."
                                    : isRegister
                                        ? "Create my account"
                                        : isReset
                                            ? "Send reset link"
                                            : "Sign in"}{" "}
                                {!isSubmitting && <ArrowRight size={16} />}
                            </Button>
                    </form>
                    <div className="auth-divider">
                        <span>GOOD FOOD, GOOD NEIGHBORS</span>
                    </div>
                    <div className="auth-local-note">
                        <MapPin size={14} />
                        <span>Starting in Yangon, growing together.</span>
                        <span className="local-note-heart">♥️</span>
                    </div>
                </div>
                <small className="auth-legal">
                    By continuing, you agree to use FoodCycle safely and respectfully.
                </small>
            </section>
        </main>
    );
}
