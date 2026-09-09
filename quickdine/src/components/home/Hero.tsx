import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Calendar, Users, UtensilsCrossed, ShoppingBag, User } from "lucide-react";
import { assets } from "../../assets/assets";

export default function Hero() {
    const navigate = useNavigate();

    // Search input states
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState("2");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (location) params.append("location", location);
        if (date) params.append("date", date);
        if (guests) params.append("guests", guests);

        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img alt="Elegant Dining Room" className="w-full h-full object-cover brightness-70" src={assets.hero_bg_img} />
                <div className="absolute inset-0 bg-black/35"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 text-center pt-16">
                <span className="text-xs md:text-sm text-secondary-container tracking-[0.25em] uppercase block mb-4 font-semibold">
                    EXQUISITE DINING & GASTRONOMY
                </span>
                <h1 className="font-display text-4xl md:text-6xl text-white mb-8 max-w-3xl mx-auto leading-[1.15] font-medium tracking-tight drop-shadow-md">
                    Curation for the Discerning Palette
                </h1>

                {/* Direct Feature Links: Home | Menu | Order | Reservation */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/20 transition-all shadow-sm"
                    >
                        <UtensilsCrossed size={14} className="text-secondary" /> Explore Menu
                    </Link>
                    <Link
                        to="/order"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/20 transition-all shadow-sm"
                    >
                        <ShoppingBag size={14} className="text-secondary" /> Table & Online Order
                    </Link>
                    <Link
                        to="/reservation"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/20 transition-all shadow-sm"
                    >
                        <Calendar size={14} className="text-secondary" /> Book Reservation
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/20 transition-all shadow-sm"
                    >
                        <User size={14} className="text-secondary" /> Login / Sign Up
                    </Link>
                </div>

                {/* Search Bar Component */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white p-3 md:p-2.5 ambient-shadow max-w-4xl mx-auto flex flex-col md:flex-row gap-2 rounded-xl shadow-2xl"
                >
                    {/* Search Term / Cuisine */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Search className="text-outline-variant mr-3 shrink-0" size={18} />
                        <input
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-black/55"
                            placeholder="Search cuisines, restaurants..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <MapPin className="text-outline-variant mr-3 shrink-0" size={18} />
                        <input
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-black/55"
                            placeholder="Location (e.g. Manhattan)"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Date */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Calendar className="text-outline-variant mr-3 shrink-0" size={18} />
                        <input
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface placeholder:text-black/55 cursor-pointer"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Users className="text-outline-variant mr-3 shrink-0" size={18} />
                        <select
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-on-surface cursor-pointer"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="6">6 Guests</option>
                            <option value="8">8 Guests</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary text-white text-xs tracking-widest uppercase px-8 py-4 md:py-3 hover:bg-secondary hover:text-white transition-all cursor-pointer rounded-lg font-semibold shadow"
                    >
                        FIND A TABLE
                    </button>
                </form>
            </div>
        </section>
    );
}
