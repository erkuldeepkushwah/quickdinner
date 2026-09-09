import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import {
    Mail,
    Lock,
    User,
    Phone,
    Sparkles,
    Utensils,
    Shield,
    CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, login, register } = useAppContext();

    const modeParam = searchParams.get("mode");
    const [tabOverride, setTabOverride] = useState<"login" | "signup" | null>(null);
    const isLoginTab = (tabOverride ?? (modeParam === "signup" ? "signup" : "login")) === "login";

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // If already logged in, show logged-in state with redirect option
    const handleQuickLogin = async (role: "user" | "owner" | "admin") => {
        setSubmitting(true);
        const demoEmail =
            role === "admin"
                ? "admin@quickdine.com"
                : role === "owner"
                ? "owner@quickdine.com"
                : "diner@quickdine.com";
        await login(demoEmail, "password123", role);
        setSubmitting(false);
        navigate("/dashboard");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const success = isLoginTab
            ? await login(email, password)
            : await register(name, email, password, phone, isOwner ? "owner" : "user");

        setSubmitting(false);
        if (success) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-16 md:pt-20">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 px-6">
                <div className="w-full max-w-md bg-white border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
                    {/* Header Banner */}
                    <div className="bg-primary text-white p-6 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fed488_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <span className="text-secondary text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 mb-1 relative z-10">
                            <Sparkles size={12} /> Member Access
                        </span>
                        <h1 className="font-display text-2xl font-semibold relative z-10">
                            {isLoginTab ? "Log In to QuickDine" : "Create Member Account"}
                        </h1>
                        <p className="text-white/70 text-xs mt-1 relative z-10">
                            {isLoginTab
                                ? "Access reservations, track kitchen orders & view chef specials."
                                : "Join QuickDine for priority reservations & exclusive tasting tables."}
                        </p>
                    </div>

                    {/* Tabs: Log In vs Sign Up */}
                    <div className="flex border-b border-outline-variant/20 bg-surface-container-low/40">
                        <button
                            type="button"
                            onClick={() => setTabOverride("login")}
                            className={`flex-1 py-3.5 text-center text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                isLoginTab
                                    ? "text-primary border-b-2 border-primary bg-white font-bold"
                                    : "text-black/50 hover:text-primary hover:bg-surface-container-low/80"
                            }`}
                        >
                            LOG IN
                        </button>
                        <button
                            type="button"
                            onClick={() => setTabOverride("signup")}
                            className={`flex-1 py-3.5 text-center text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                !isLoginTab
                                    ? "text-primary border-b-2 border-primary bg-white font-bold"
                                    : "text-black/50 hover:text-primary hover:bg-surface-container-low/80"
                            }`}
                        >
                            SIGN UP
                        </button>
                    </div>

                    {/* Quick 1-Click Demo Profiles */}
                    <div className="p-5 bg-gradient-to-b from-surface-container-low/40 to-transparent border-b border-outline-variant/15">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-black/50 flex items-center gap-1.5">
                                <Sparkles size={12} className="text-secondary" /> Instant Demo Access
                            </span>
                            <span className="text-[10px] text-black/40">1-click login</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("user")}
                                className="flex flex-col items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-primary/50 bg-white hover:bg-surface text-center transition-all cursor-pointer group"
                            >
                                <User size={14} className="text-black/60 group-hover:text-primary mb-0.5" />
                                <span className="font-semibold text-[11px] text-primary">Diner</span>
                                <span className="text-[9px] text-black/40">Guest</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("owner")}
                                className="flex flex-col items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-secondary bg-white hover:bg-surface text-center transition-all cursor-pointer group"
                            >
                                <Utensils size={14} className="text-secondary mb-0.5" />
                                <span className="font-semibold text-[11px] text-secondary">Owner</span>
                                <span className="text-[9px] text-black/40">Partner</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("admin")}
                                className="flex flex-col items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-primary/50 bg-white hover:bg-surface text-center transition-all cursor-pointer group"
                            >
                                <Shield size={14} className="text-black/60 group-hover:text-primary mb-0.5" />
                                <span className="font-semibold text-[11px] text-primary">Admin</span>
                                <span className="text-[9px] text-black/40">Manager</span>
                            </button>
                        </div>
                    </div>

                    {/* Already Logged In Prompt */}
                    {user && (
                        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                            <div>
                                <p className="font-semibold">Currently signed in as {user.name}</p>
                                <p className="text-[10px] text-emerald-700">{user.email}</p>
                            </div>
                            <Link
                                to="/dashboard"
                                className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800"
                            >
                                Dashboard
                            </Link>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Name (Sign Up only) */}
                        {!isLoginTab && (
                            <div className="space-y-1">
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-black/60">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/40">
                                        <User size={15} />
                                    </span>
                                    <input
                                        type="text"
                                        required={!isLoginTab}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alexandre Dumont"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-lg focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-black/60">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/40">
                                    <Mail size={15} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="member@quickdine.com"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-lg focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Phone (Sign Up only) */}
                        {!isLoginTab && (
                            <div className="space-y-1">
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-black/60">
                                    Mobile Phone (Optional)
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/40">
                                        <Phone size={15} />
                                    </span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 234-5678"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-lg focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-black/60">
                                    Password
                                </label>
                                {isLoginTab && (
                                    <span className="text-[10px] text-secondary hover:underline cursor-pointer">
                                        Forgot password?
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/40">
                                    <Lock size={15} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-lg focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Owner Checkbox (Sign Up only) */}
                        {!isLoginTab && (
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="ownerRegisterPage"
                                    checked={isOwner}
                                    onChange={(e) => setIsOwner(e.target.checked)}
                                    className="h-4 w-4 accent-secondary rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="ownerRegisterPage"
                                    className="text-xs text-black/70 select-none cursor-pointer"
                                >
                                    Register as Restaurant Owner / Manager
                                </label>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-primary hover:bg-secondary text-white rounded-lg text-xs font-semibold tracking-widest uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <span>PROCESSING...</span>
                                ) : isLoginTab ? (
                                    <>
                                        <CheckCircle2 size={15} /> LOG IN TO QUICKDINE
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={15} /> CREATE ACCOUNT & JOIN
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Dual Switch Link */}
                        <div className="text-center pt-3 border-t border-outline-variant/15 text-xs text-black/60">
                            {isLoginTab ? (
                                <p>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setTabOverride("signup")}
                                        className="font-semibold text-secondary hover:underline cursor-pointer"
                                    >
                                        Sign Up here
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setTabOverride("login")}
                                        className="font-semibold text-secondary hover:underline cursor-pointer"
                                    >
                                        Log In here
                                    </button>
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
