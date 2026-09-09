import { useAppContext } from "../context/AppContext.tsx";
import { ShieldAlert, LogIn, UserPlus } from "lucide-react";
import Loader from "./Loader.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("user" | "admin" | "owner")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user, loading, openAuthModal } = useAppContext();

    if (loading) {
        return <Loader text="Loading Panel Access..." />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white border border-outline-variant/20 p-8 md:p-10 shadow-xl rounded-2xl flex flex-col items-center">
                    <ShieldAlert size={42} className="text-secondary mb-4" />
                    <h2 className="font-display text-2xl text-primary mb-2">Member Authentication Required</h2>
                    <p className="text-xs text-black/60 mb-6 leading-relaxed">
                        Reservation booking, kitchen ordering, and dashboard management are reserved exclusively for registered QuickDine members.
                    </p>

                    <div className="flex flex-col gap-2.5 w-full">
                        <button
                            onClick={() => openAuthModal("login")}
                            className="w-full bg-primary hover:bg-secondary text-white py-3 px-4 text-xs font-semibold tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                            <LogIn size={15} /> LOG IN TO YOUR ACCOUNT
                        </button>
                        <button
                            onClick={() => openAuthModal("signup")}
                            className="w-full border border-outline-variant/40 hover:border-primary text-primary py-3 px-4 text-xs font-semibold tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <UserPlus size={15} /> CREATE NEW ACCOUNT (SIGN UP)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white border border-outline-variant/20 p-8 md:p-10 shadow-xl rounded-2xl flex flex-col items-center">
                    <ShieldAlert size={42} className="text-error mb-4" />
                    <h2 className="font-display text-2xl text-primary mb-2">Access Restricted</h2>
                    <p className="text-xs text-black/60 mb-4 leading-relaxed">
                        Your current account ({user.role}) does not possess the permissions required to manage this console.
                    </p>
                    <button
                        onClick={() => openAuthModal("login")}
                        className="px-5 py-2.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-secondary transition-colors cursor-pointer"
                    >
                        Switch Account
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
