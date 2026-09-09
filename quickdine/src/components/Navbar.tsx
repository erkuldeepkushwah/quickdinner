import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, ShoppingBag, Calendar, UtensilsCrossed, User } from "lucide-react";

export default function Navbar() {
    const { user, logout, openAuthModal, cart } = useAppContext();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";
    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (dropdownOpen) setDropdownOpen(false);
    }

    const handleDashboardClick = () => {
        if (!user) {
            openAuthModal("login");
        } else {
            navigate("/dashboard");
        }
    };

    // Nav link styling helper
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
        if (isActive) {
            return scrolled || !isHome
                ? "text-secondary font-semibold border-b-2 border-secondary pb-1"
                : "text-white font-semibold border-b-2 border-white pb-1";
        }
        return scrolled || !isHome
            ? "text-black/70 hover:text-primary transition-colors pb-1 border-b-2 border-transparent"
            : "text-white/80 hover:text-white transition-colors pb-1 border-b-2 border-transparent";
    };

    return (
        <nav
            className={`fixed top-0 w-full z-40 transition-all duration-300 ${
                scrolled || !isHome
                    ? "bg-white/95 backdrop-blur-md h-16 shadow-sm border-b border-outline-variant/15"
                    : "bg-transparent h-20 border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-6 md:px-10">
                {/* Logo & Main Nav: Home | Menu | Order | Reservation */}
                <div className="flex items-center gap-10 lg:gap-12">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.svg"
                            alt="QuickDine"
                            className={`h-8 transition-transform duration-300 group-hover:scale-105 ${
                                !scrolled && isHome ? "invert" : ""
                            }`}
                        />
                    </Link>

                    {/* Desktop Navigation: Home | Menu | Order | Reservation */}
                    <div className="hidden md:flex gap-7 lg:gap-9 items-center text-sm">
                        <Link to="/" className={getLinkClass("/")}>
                            Home
                        </Link>
                        <Link to="/menu" className={getLinkClass("/menu")}>
                            Menu
                        </Link>
                        <Link to="/order" className={`${getLinkClass("/order")} flex items-center gap-1.5`}>
                            <span>Order</span>
                            {totalCartCount > 0 && (
                                <span className="inline-flex items-center justify-center size-5 text-[10px] font-bold bg-secondary text-white rounded-full">
                                    {totalCartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/reservation" className={getLinkClass("/reservation")}>
                            Reservation
                        </Link>
                    </div>
                </div>

                {/* Right Side: Login & User Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center gap-2.5 text-sm transition-colors cursor-pointer px-3 py-1.5 rounded-full border ${
                                    scrolled || !isHome
                                        ? "text-primary border-outline-variant/30 hover:bg-surface-container-low"
                                        : "text-white border-white/20 hover:bg-white/10"
                                }`}
                            >
                                <span className="size-7 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold uppercase">
                                    {user.name.charAt(0)}
                                </span>
                                <span className="max-w-[120px] truncate font-medium">{user.name.split(" ")[0]}</span>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant/30 ambient-shadow rounded-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-outline-variant/10">
                                        <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
                                        <p className="text-xs text-black/55 truncate">{user.email}</p>
                                        <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-secondary/15 text-secondary">
                                            {user.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleDashboardClick}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-black/70 hover:text-primary hover:bg-surface transition-colors cursor-pointer text-left"
                                    >
                                        <LayoutDashboard size={14} />
                                        My Bookings
                                    </button>
                                    <Link
                                        to="/order"
                                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-black/70 hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                                    >
                                        <ShoppingBag size={14} />
                                        My Orders
                                        {totalCartCount > 0 && (
                                            <span className="ml-auto text-[10px] bg-secondary text-white px-1.5 py-0.2 rounded-full font-bold">
                                                {totalCartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="flex items-center gap-3 px-4 py-2.5 text-xs text-black/70 hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                                        >
                                            <ShieldCheck size={14} />
                                            Admin Panel
                                        </Link>
                                    )}

                                    {user.role === "owner" && (
                                        <Link
                                            to="/owner/dashboard"
                                            className="flex items-center gap-3 px-4 py-2.5 text-xs text-black/70 hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                                        >
                                            <ShieldCheck size={14} />
                                            Owner Panel
                                        </Link>
                                    )}

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-error hover:bg-error-container/20 transition-colors border-t border-outline-variant/10 text-left cursor-pointer"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* Login Button (Opens Auth Modal on Login Tab) */}
                            <button
                                onClick={() => openAuthModal("login")}
                                className={`text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 ${
                                    scrolled || !isHome
                                        ? "text-black/80 hover:text-primary"
                                        : "text-white/90 hover:text-white"
                                }`}
                            >
                                Login
                            </button>

                            {/* Sign Up Button (Opens Auth Modal on Sign Up Tab) */}
                            <button
                                onClick={() => openAuthModal("signup")}
                                className={`text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded transition-all cursor-pointer shadow-sm ${
                                    scrolled || !isHome
                                        ? "bg-primary text-white hover:bg-secondary"
                                        : "bg-white text-primary hover:bg-secondary hover:text-white"
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button & Cart preview */}
                <div className="flex items-center gap-3 md:hidden">
                    <Link
                        to="/order"
                        className={`relative p-2 ${scrolled || !isHome ? "text-primary" : "text-white"}`}
                    >
                        <ShoppingBag size={20} />
                        {totalCartCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 text-[9px] font-bold bg-secondary text-white rounded-full flex items-center justify-center">
                                {totalCartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 transition-colors cursor-pointer ${
                            scrolled || !isHome ? "text-primary" : "text-white"
                        }`}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-outline-variant/20 py-6 px-6 z-50 ambient-shadow flex flex-col gap-4 animate-in slide-in-from-top duration-300 shadow-xl">
                    <Link
                        to="/"
                        className={`text-base font-medium flex items-center gap-3 ${
                            location.pathname === "/" ? "text-secondary font-semibold" : "text-on-surface"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/menu"
                        className={`text-base font-medium flex items-center gap-3 ${
                            location.pathname === "/menu" ? "text-secondary font-semibold" : "text-on-surface"
                        }`}
                    >
                        <UtensilsCrossed size={18} />
                        Menu
                    </Link>
                    <Link
                        to="/order"
                        className={`text-base font-medium flex items-center justify-between ${
                            location.pathname === "/order" ? "text-secondary font-semibold" : "text-on-surface"
                        }`}
                    >
                        <span className="flex items-center gap-3">
                            <ShoppingBag size={18} />
                            Order
                        </span>
                        {totalCartCount > 0 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary text-white">
                                {totalCartCount} items
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/reservation"
                        className={`text-base font-medium flex items-center gap-3 ${
                            location.pathname === "/reservation" ? "text-secondary font-semibold" : "text-on-surface"
                        }`}
                    >
                        <Calendar size={18} />
                        Reservation
                    </Link>

                    <div className="border-t border-outline-variant/15 my-2"></div>

                    {user ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                                <span className="size-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                                    {user.name.charAt(0)}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-primary">{user.name}</p>
                                    <p className="text-xs text-black/55">{user.email}</p>
                                </div>
                            </div>
                            <Link to="/dashboard" className="text-sm font-medium text-black/70 hover:text-primary">
                                My Bookings
                            </Link>
                            {user.role === "admin" && (
                                <Link to="/admin/dashboard" className="text-sm font-medium text-black/70 hover:text-primary">
                                    Admin Console
                                </Link>
                            )}
                            {user.role === "owner" && (
                                <Link to="/owner/dashboard" className="text-sm font-medium text-black/70 hover:text-primary">
                                    Owner Console
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-error text-left cursor-pointer flex items-center gap-2 mt-2"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5 pt-2">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    openAuthModal("login");
                                }}
                                className="w-full border border-outline-variant/60 text-center py-2.5 text-sm font-semibold rounded hover:border-primary cursor-pointer flex items-center justify-center gap-2"
                            >
                                <User size={16} /> Login
                            </button>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    openAuthModal("signup");
                                }}
                                className="w-full bg-primary text-white text-center py-2.5 text-xs font-semibold tracking-widest uppercase rounded hover:bg-secondary transition-colors cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
