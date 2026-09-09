import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.tsx";
import { X, Mail, Lock, User, Phone, Sparkles, Utensils, Shield, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, authModalMode, login, register } = useAppContext();
    const [tabOverride, setTabOverride] = useState<"login" | "signup" | null>(null);
    const isLoginTab = (tabOverride ?? authModalMode) === "login";

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [formLoading, setFormLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setIsOwner(false);
        setTabOverride(null);
    };

    const handleClose = () => {
        resetForm();
        setAuthModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        let success: boolean;
        if (isLoginTab) {
            success = await login(email, password);
        } else {
            success = await register(name, email, password, phone, isOwner ? "owner" : "user");
        }

        setFormLoading(false);
        if (success) {
            handleClose();
        }
    };

    const handleQuickLogin = async (role: "user" | "owner" | "admin") => {
        setFormLoading(true);
        const demoEmail = role === "admin" 
            ? "admin@quickdine.com" 
            : role === "owner" 
                ? "owner@quickdine.com" 
                : "diner@quickdine.com";
        await login(demoEmail, "password123", role);
        setFormLoading(false);
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={handleClose}></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white border border-outline-variant/30 ambient-shadow rounded-xl overflow-hidden z-10 transition-soft flex flex-col shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-black/45 hover:text-primary transition-colors cursor-pointer z-20 p-1.5 rounded-full hover:bg-surface-container-low"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Top Tabs (Sign In / Sign Up) */}
                <div className="flex border-b border-outline-variant/20 bg-surface-container-low/40">
                    <button
                        type="button"
                        onClick={() => setTabOverride("login")}
                        className={`flex-1 py-4 text-center text-xs font-semibold tracking-wider transition-all cursor-pointer ${
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
                        className={`flex-1 py-4 text-center text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                            !isLoginTab
                                ? "text-primary border-b-2 border-primary bg-white font-bold"
                                : "text-black/50 hover:text-primary hover:bg-surface-container-low/80"
                        }`}
                    >
                        SIGN UP
                    </button>
                </div>

                {/* Quick 1-Click Demo Accounts Selector */}
                <div className="px-7 pt-5 pb-2 bg-gradient-to-b from-surface-container-low/30 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-black/50 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-secondary" /> Quick Demo Sign In
                        </span>
                        <span className="text-[10px] text-black/40">1-click test</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("user")}
                            className="flex flex-col items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-primary/40 bg-white hover:bg-surface transition-all text-left text-xs cursor-pointer group"
                        >
                            <User size={14} className="text-black/60 group-hover:text-primary mb-1" />
                            <span className="font-medium text-[11px] text-primary">Diner</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("owner")}
                            className="flex flex-col items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-secondary/60 bg-white hover:bg-surface transition-all text-left text-xs cursor-pointer group"
                        >
                            <Utensils size={14} className="text-secondary group-hover:text-secondary mb-1" />
                            <span className="font-medium text-[11px] text-secondary">Owner</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("admin")}
                            className="flex flex-col items-center justify-center p-2 rounded-lg border border-outline-variant/30 hover:border-primary/40 bg-white hover:bg-surface transition-all text-left text-xs cursor-pointer group"
                        >
                            <Shield size={14} className="text-black/60 group-hover:text-primary mb-1" />
                            <span className="font-medium text-[11px] text-primary">Admin</span>
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-7 pb-7 pt-3 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="text-left mb-5">
                            <h2 className="font-display text-xl font-semibold text-primary">
                                {isLoginTab ? "Welcome Back to QuickDine" : "Create Your Member Account"}
                            </h2>
                            <p className="text-xs text-black/60 mt-1">
                                {isLoginTab
                                    ? "Sign in to access table reservations, saved favorites & custom dining orders."
                                    : "Join fine diners and get priority reservations, invitations, and special privileges."}
                            </p>
                        </div>

                        <div className="space-y-3.5">
                            {/* Full Name (Sign Up only) */}
                            {!isLoginTab && (
                                <div className="space-y-1">
                                    <label className="block text-left text-[10px] font-semibold text-black/60 tracking-wider uppercase">
                                        FULL NAME
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
                                            placeholder="Jane Doe"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-md focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Address */}
                            <div className="space-y-1">
                                <label className="block text-left text-[10px] font-semibold text-black/60 tracking-wider uppercase">
                                    EMAIL ADDRESS
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
                                        placeholder="you@domain.com"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-md focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Phone (Sign Up only) */}
                            {!isLoginTab && (
                                <div className="space-y-1">
                                    <label className="block text-left text-[10px] font-semibold text-black/60 tracking-wider uppercase">
                                        PHONE NUMBER (OPTIONAL)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/40">
                                            <Phone size={15} />
                                        </span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-md focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="block text-left text-[10px] font-semibold text-black/60 tracking-wider uppercase">
                                        PASSWORD
                                    </label>
                                    {isLoginTab && (
                                        <span className="text-[11px] text-secondary hover:underline cursor-pointer">
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
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low/50 border border-outline-variant/40 rounded-md focus:border-secondary focus:bg-white focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Owner Checkbox (Sign Up only) */}
                            {!isLoginTab && (
                                <div className="flex items-center gap-2.5 pt-1">
                                    <input
                                        type="checkbox"
                                        id="isOwnerRegister"
                                        checked={isOwner}
                                        onChange={(e) => setIsOwner(e.target.checked)}
                                        className="h-4 w-4 accent-secondary rounded border-outline-variant/60 cursor-pointer"
                                    />
                                    <label htmlFor="isOwnerRegister" className="text-xs text-black/70 select-none cursor-pointer">
                                        I am a Restaurant Owner or Culinary Partner
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button & Switch Prompt */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="w-full bg-primary hover:bg-secondary text-white py-3 px-4 text-xs font-semibold tracking-widest uppercase rounded-md shadow-sm hover:shadow transition-all disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
                        >
                            {formLoading ? (
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

                        {/* Switch between Login and Sign Up */}
                        <div className="text-center mt-4 pt-3 border-t border-outline-variant/20 text-xs text-black/60">
                            {isLoginTab ? (
                                <span>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setTabOverride("signup")}
                                        className="font-semibold text-secondary hover:underline cursor-pointer"
                                    >
                                        Sign Up here
                                    </button>
                                </span>
                            ) : (
                                <span>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setTabOverride("login")}
                                        className="font-semibold text-secondary hover:underline cursor-pointer"
                                    >
                                        Log In here
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
