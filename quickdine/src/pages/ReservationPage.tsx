import { useState, useId } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dummyRestaurant } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import {
    Calendar,
    Users,
    Clock,
    Sparkles,
    MapPin,
    Check,
    ArrowRight,
    Utensils,
    DollarSign,
    LayoutGrid,
    ListFilter,
    Search,
    ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

interface RestaurantItem {
    _id: string;
    name: string;
    slug: string;
    description: string;
    cuisine: string;
    priceRange: string;
    price?: string;
    guests?: string;
    minGuests?: number;
    maxGuests?: number;
    rating: number;
    reviewCount: number;
    location: string;
    address: string;
    image: string;
    chef: string;
    tags: string[];
    availableSlots: string[];
    featured?: boolean;
    exclusive?: boolean;
    owner?: string;
    status?: string;
    totalSeats?: number;
}

const restaurantsList = dummyRestaurant as unknown as RestaurantItem[];

export default function ReservationPage() {
    const searchId = useId();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, openAuthModal } = useAppContext();

    const initialRestaurantSlug = searchParams.get("restaurant") || restaurantsList[0].slug;
    const [selectedSlug, setSelectedSlug] = useState<string>(initialRestaurantSlug);
    const selectedRestaurant =
        restaurantsList.find((r) => r.slug === selectedSlug) || restaurantsList[0];

    const todayDate = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(todayDate);
    const [selectedSlot, setSelectedSlot] = useState<string>(
        selectedRestaurant.availableSlots[0] || "19:00"
    );

    // Initial guest party within bounds of selected restaurant
    const maxCapacity = selectedRestaurant.maxGuests || 8;
    const [guests, setGuests] = useState<number>(Math.min(2, maxCapacity));
    const [seatingZone, setSeatingZone] = useState<string>("Indoor Velvet Booth");
    const [occasion, setOccasion] = useState<string>("Fine Dining");
    const [specialNotes, setSpecialNotes] = useState<string>("");

    // Filtering & display mode for reservation directory
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");
    const [cuisineFilter, setCuisineFilter] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const seatingOptions = [
        "Indoor Velvet Booth",
        "Window Table (Skyline View)",
        "Chef's Counter",
        "Rooftop Terrace",
        "Private Salon",
    ];

    const occasions = [
        "Fine Dining",
        "Romantic Date",
        "Birthday Celebration",
        "Anniversary",
        "Business Dinner",
        "Culinary Tasting",
    ];

    const handleSelectRestaurant = (slug: string) => {
        setSelectedSlug(slug);
        const r = restaurantsList.find((item) => item.slug === slug);
        if (r) {
            if (r.availableSlots && r.availableSlots.length > 0) {
                setSelectedSlot(r.availableSlots[0]);
            }
            const rMax = r.maxGuests || 8;
            if (guests > rMax) {
                setGuests(rMax);
            }
        }
    };

    const handleProceedToBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) {
            toast.error("Please select a reservation time slot");
            return;
        }

        if (!user) {
            toast("Please sign in to confirm your reservation", { icon: "🔒" });
            openAuthModal("login");
            return;
        }

        // Navigate to the existing booking confirmation flow
        const bookingUrl = `/booking/${selectedSlug}?slot=${encodeURIComponent(
            selectedSlot
        )}&date=${encodeURIComponent(selectedDate)}&guests=${guests}&occasion=${encodeURIComponent(
            occasion
        )}`;
        navigate(bookingUrl);
    };

    // Filter restaurants based on user search and cuisine
    const filteredRestaurants = restaurantsList.filter((r) => {
        const matchesCuisine =
            cuisineFilter === "All" || r.cuisine.toLowerCase() === cuisineFilter.toLowerCase();
        const matchesSearch =
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCuisine && matchesSearch;
    });

    const cuisinesList = ["All", "French", "Italian", "Japanese", "Steakhouse", "Vegetarian"];

    // Dynamic party size presets
    const maxGuests = selectedRestaurant.maxGuests || 8;
    const guestPresets =
        maxGuests === 10
            ? [1, 2, 4, 6, 8, 10]
            : maxGuests === 8
            ? [1, 2, 4, 6, 8]
            : [1, 2, 3, 4, 5, 6];

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-16 md:pt-20">
            <Navbar />

            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <div className="bg-primary text-white py-14 px-6 md:px-12 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto relative z-10 text-center">
                        <span className="text-secondary text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 mb-3">
                            <Sparkles size={14} /> Priority Dining Access
                        </span>
                        <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-3">
                            Table Reservations
                        </h1>
                        <p className="text-white/75 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
                            Compare premier dining chambers, price tiers, and verified guest capacities.
                            Select your restaurant to secure your private table.
                        </p>

                        {/* Quick Stats Banner */}
                        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left md:text-center">
                            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                                <span className="block text-[10px] uppercase text-white/60 tracking-wider">Restaurants</span>
                                <span className="font-display text-base font-bold text-white">6 Top Locations</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                                <span className="block text-[10px] uppercase text-white/60 tracking-wider">Rating Range</span>
                                <span className="font-display text-base font-bold text-secondary">⭐ 4.6 – 4.9</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                                <span className="block text-[10px] uppercase text-white/60 tracking-wider">Price Range</span>
                                <span className="font-display text-base font-bold text-white">$20 – $100</span>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                                <span className="block text-[10px] uppercase text-white/60 tracking-wider">Guest Capacity</span>
                                <span className="font-display text-base font-bold text-white">1 – 10 Guests</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 mt-10">
                    {/* SECTION 1: The Requested Reservation Table / Directory */}
                    <section id="reservation-directory" className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/20">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-secondary flex items-center gap-1 mb-1">
                                    <Utensils size={13} /> Dining Room Comparison
                                </span>
                                <h2 className="font-display text-2xl font-semibold text-primary">
                                    Restaurant Reservation Table
                                </h2>
                                <p className="text-xs text-black/60 mt-1">
                                    Click any restaurant below to load its booking calendar and customize party size.
                                </p>
                            </div>

                            {/* View Switcher and Search */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-2.5 text-black/40" />
                                    <input
                                        id={`search-restaurants-${searchId}`}
                                        type="text"
                                        placeholder="Search venue..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 pr-3 py-1.5 text-xs bg-white border border-outline-variant/30 rounded-lg focus:outline-none focus:border-secondary w-40 sm:w-48"
                                    />
                                </div>

                                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("table")}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                                            viewMode === "table"
                                                ? "bg-white text-primary shadow-xs"
                                                : "text-black/60 hover:text-black"
                                        }`}
                                    >
                                        <ListFilter size={13} />
                                        <span>Table</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("cards")}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                                            viewMode === "cards"
                                                ? "bg-white text-primary shadow-xs"
                                                : "text-black/60 hover:text-black"
                                        }`}
                                    >
                                        <LayoutGrid size={13} />
                                        <span>Cards</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cuisine Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            {cuisinesList.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCuisineFilter(c)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                        cuisineFilter === c
                                            ? "bg-primary text-white shadow-xs"
                                            : "bg-white border border-outline-variant/30 text-black/70 hover:border-primary/40"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        {/* TABLE VIEW: Displays the exact columns requested (Restaurant, Rating, Price, Guests) */}
                        {viewMode === "table" ? (
                            <div className="bg-white rounded-xl border border-outline-variant/25 shadow-xs overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low/60 border-b border-outline-variant/20 text-[11px] font-bold text-black/65 uppercase tracking-wider">
                                                <th className="py-3.5 px-5">Restaurant</th>
                                                <th className="py-3.5 px-4 text-center sm:text-left">Rating</th>
                                                <th className="py-3.5 px-4">Price</th>
                                                <th className="py-3.5 px-4">Guests</th>
                                                <th className="py-3.5 px-5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/15 text-xs">
                                            {filteredRestaurants.map((r) => {
                                                const isSelected = r.slug === selectedSlug;
                                                const rPrice = r.price || r.priceRange;
                                                const rGuests = r.guests || `1–${r.maxGuests || 8}`;

                                                return (
                                                    <tr
                                                        key={r.slug}
                                                        onClick={() => handleSelectRestaurant(r.slug)}
                                                        className={`transition-colors cursor-pointer group ${
                                                            isSelected
                                                                ? "bg-secondary/10 hover:bg-secondary/15"
                                                                : "hover:bg-surface-container-low/40"
                                                        }`}
                                                    >
                                                        {/* Restaurant Column */}
                                                        <td className="py-4 px-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container-low">
                                                                    <img
                                                                        src={r.image}
                                                                        alt={r.name}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-display text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                                                                            {r.name}
                                                                        </span>
                                                                        {isSelected && (
                                                                            <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-secondary text-white rounded">
                                                                                Selected
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-[11px] text-black/55 mt-0.5">
                                                                        <span className="px-1.5 py-0.2 bg-black/5 rounded text-black/70 font-medium">
                                                                            {r.cuisine}
                                                                        </span>
                                                                        <span className="hidden sm:inline">•</span>
                                                                        <span className="hidden sm:inline truncate max-w-xs">{r.address}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Rating Column */}
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold">
                                                                <span className="text-amber-500">⭐</span>
                                                                <span>{r.rating.toFixed(1)}</span>
                                                                <span className="text-[10px] text-black/40 font-normal">
                                                                    ({r.reviewCount})
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* Price Column */}
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <div className="font-semibold text-primary flex items-center gap-1">
                                                                <span className="text-secondary font-bold">{rPrice}</span>
                                                                <span className="text-[10px] text-black/45 font-normal">/ person</span>
                                                            </div>
                                                        </td>

                                                        {/* Guests Column */}
                                                        <td className="py-4 px-4 whitespace-nowrap">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low text-black/80 font-medium border border-outline-variant/20">
                                                                <Users size={13} className="text-secondary" />
                                                                <span>{rGuests}</span>
                                                            </div>
                                                        </td>

                                                        {/* Action Column */}
                                                        <td className="py-4 px-5 text-right whitespace-nowrap">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectRestaurant(r.slug);
                                                                    const bookingSection = document.getElementById("booking-form-section");
                                                                    if (bookingSection) {
                                                                        bookingSection.scrollIntoView({ behavior: "smooth" });
                                                                    }
                                                                }}
                                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                                                    isSelected
                                                                        ? "bg-secondary text-white shadow-xs"
                                                                        : "bg-primary text-white hover:bg-primary/90"
                                                                }`}
                                                            >
                                                                {isSelected ? (
                                                                    <>
                                                                        <Check size={13} />
                                                                        <span>Book Table</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Select</span>
                                                                        <ArrowRight size={13} />
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* CARDS VIEW */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredRestaurants.map((r) => {
                                    const isSelected = r.slug === selectedSlug;
                                    const rPrice = r.price || r.priceRange;
                                    const rGuests = r.guests || `1–${r.maxGuests || 8}`;

                                    return (
                                        <div
                                            key={r.slug}
                                            onClick={() => handleSelectRestaurant(r.slug)}
                                            className={`bg-white rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                                                isSelected
                                                    ? "border-secondary ring-2 ring-secondary/30 shadow-md"
                                                    : "border-outline-variant/30 hover:border-primary/40 hover:shadow-sm"
                                            }`}
                                        >
                                            <div className="relative h-40 w-full overflow-hidden bg-surface-container-low">
                                                <img
                                                    src={r.image}
                                                    alt={r.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-white">
                                                        {r.cuisine}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 text-xs font-bold text-primary flex items-center gap-1 shadow-xs">
                                                    <span className="text-amber-500">⭐</span>
                                                    <span>{r.rating.toFixed(1)}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-display text-base font-semibold text-primary">
                                                            {r.name}
                                                        </h3>
                                                        {isSelected && (
                                                            <span className="text-[10px] font-semibold text-secondary px-2 py-0.5 bg-secondary/10 rounded">
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-black/55 flex items-center gap-1 mb-3">
                                                        <MapPin size={12} /> {r.location}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-surface-container-low/50 rounded-lg text-xs mb-3">
                                                        <div>
                                                            <span className="text-[10px] text-black/50 uppercase block font-semibold">Price</span>
                                                            <span className="font-bold text-primary">{rPrice}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] text-black/50 uppercase block font-semibold">Guests</span>
                                                            <span className="font-bold text-primary">{rGuests}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                                        isSelected
                                                            ? "bg-secondary text-white"
                                                            : "bg-surface-container-low text-primary hover:bg-primary hover:text-white"
                                                    }`}
                                                >
                                                    {isSelected ? "Selected Table ✓" : "Select Restaurant"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* SECTION 2: Dynamic Reservation Form & Venue Booking Studio */}
                    <div id="booking-form-section" className="pt-4 border-t border-outline-variant/20">
                        <div className="mb-6">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-secondary flex items-center gap-1 mb-1">
                                <Calendar size={13} /> Complete Your Seating Order
                            </span>
                            <h2 className="font-display text-2xl font-semibold text-primary">
                                Reserve at {selectedRestaurant.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200/50">
                                    ⭐ {selectedRestaurant.rating.toFixed(1)} Rating
                                </span>
                                <span className="inline-flex items-center gap-1 text-primary bg-surface-container-low px-2 py-0.5 rounded font-semibold border border-outline-variant/25">
                                    <DollarSign size={13} className="text-secondary" />
                                    {selectedRestaurant.price || selectedRestaurant.priceRange}
                                </span>
                                <span className="inline-flex items-center gap-1 text-primary bg-surface-container-low px-2 py-0.5 rounded font-semibold border border-outline-variant/25">
                                    <Users size={13} className="text-secondary" />
                                    {selectedRestaurant.guests || `1–${maxGuests}`} Guests Allowed
                                </span>
                            </div>
                        </div>

                        {/* Booking Interface Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Column: Booking Form (7 cols) */}
                            <form
                                onSubmit={handleProceedToBooking}
                                className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-outline-variant/25 shadow-xs space-y-6"
                            >
                                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/15">
                                    <h3 className="font-display text-lg font-semibold text-primary">
                                        Reservation Parameters
                                    </h3>
                                    <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                                        {selectedRestaurant.name}
                                    </span>
                                </div>

                                {/* Date & Party Size Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5 flex items-center gap-1.5">
                                            <Calendar size={13} className="text-secondary" /> Dining Date
                                        </label>
                                        <input
                                            type="date"
                                            min={todayDate}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-surface-container-low/50 border border-outline-variant/40 rounded-lg text-xs font-medium focus:outline-none focus:border-secondary transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                                                <Users size={13} className="text-secondary" /> Party Size
                                            </label>
                                            <span className="text-[10px] text-black/50 font-medium">
                                                Max {maxGuests} guests
                                            </span>
                                        </div>

                                        {/* Stepper + Preset Buttons */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center border border-outline-variant/40 rounded-lg bg-surface-container-low/50 overflow-hidden shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                                                    className="px-2.5 py-2 text-xs font-bold text-black/70 hover:bg-black/10 transition-colors"
                                                    disabled={guests <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-2 text-xs font-bold text-primary min-w-[28px] text-center">
                                                    {guests}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setGuests((prev) => Math.min(maxGuests, prev + 1))}
                                                    className="px-2.5 py-2 text-xs font-bold text-black/70 hover:bg-black/10 transition-colors"
                                                    disabled={guests >= maxGuests}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Quick Pick Buttons */}
                                            <div className="flex flex-1 gap-1 overflow-x-auto">
                                                {guestPresets.map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setGuests(num)}
                                                        className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                            guests === num
                                                                ? "bg-primary text-white shadow-xs"
                                                                : "bg-surface-container-low text-black/70 hover:bg-surface-container-low/80"
                                                        }`}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Available Seating Time Slots */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-2 flex items-center gap-1.5">
                                        <Clock size={13} className="text-secondary" /> Available Seating Times
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRestaurant.availableSlots.map((slot: string) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                                    selectedSlot === slot
                                                        ? "bg-secondary text-white shadow-xs"
                                                        : "bg-surface-container-low text-black/70 hover:bg-surface-container-low/80"
                                                }`}
                                            >
                                                {slot} PM
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Seating Area Preference */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-2">
                                        Seating Area Preference
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {seatingOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setSeatingZone(opt)}
                                                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                                                    seatingZone === opt
                                                        ? "border-primary bg-primary/5 text-primary font-semibold"
                                                        : "border-outline-variant/30 text-black/70 hover:border-primary/40"
                                                }`}
                                            >
                                                <span>{opt}</span>
                                                {seatingZone === opt && <Check size={14} className="text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Occasion */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-2">
                                        Occasion / Dining Purpose
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {occasions.map((occ) => (
                                            <button
                                                key={occ}
                                                type="button"
                                                onClick={() => setOccasion(occ)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                                    occasion === occ
                                                        ? "bg-primary text-white"
                                                        : "bg-surface-container-low text-black/70 hover:bg-surface-container-low/80"
                                                }`}
                                            >
                                                {occ}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dietary / Special Requests */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60 mb-1.5">
                                        Special Culinary or Dietary Notes (Optional)
                                    </label>
                                    <textarea
                                        value={specialNotes}
                                        onChange={(e) => setSpecialNotes(e.target.value)}
                                        rows={2}
                                        placeholder="e.g., Anniversary table requested, gluten allergy, quiet corner preferred..."
                                        className="w-full p-3 bg-surface-container-low/50 border border-outline-variant/40 rounded-lg text-xs focus:outline-none focus:border-secondary transition-colors"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-primary hover:bg-secondary text-white rounded-lg text-xs font-semibold tracking-widest uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>PROCEED TO CONFIRM RESERVATION</span>
                                    <ArrowRight size={15} />
                                </button>
                            </form>

                            {/* Right Column: Venue Showcase & Summary (5 cols) */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-white rounded-xl border border-outline-variant/25 overflow-hidden shadow-xs">
                                    <div className="relative h-48 w-full bg-surface-container-low">
                                        <img
                                            src={selectedRestaurant.image}
                                            alt={selectedRestaurant.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white rounded-full">
                                                {selectedRestaurant.cuisine}
                                            </span>
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-white rounded-full">
                                                {selectedRestaurant.price || selectedRestaurant.priceRange}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-xs">
                                            <span className="text-amber-500">⭐</span>
                                            <span>
                                                {selectedRestaurant.rating.toFixed(1)} ({selectedRestaurant.reviewCount})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="font-display text-xl font-semibold text-primary">
                                                {selectedRestaurant.name}
                                            </h3>
                                            <p className="text-xs text-black/55 flex items-center gap-1 mt-1">
                                                <MapPin size={13} /> {selectedRestaurant.address}
                                            </p>
                                        </div>

                                        <p className="text-xs text-black/65 leading-relaxed">
                                            {selectedRestaurant.description}
                                        </p>

                                        {/* Specs bar */}
                                        <div className="pt-3 border-t border-outline-variant/15 grid grid-cols-3 gap-2 text-center text-xs">
                                            <div className="p-2 bg-surface-container-low/60 rounded-md">
                                                <span className="text-[10px] font-bold uppercase text-black/50 block">
                                                    Rating
                                                </span>
                                                <span className="font-bold text-amber-600">
                                                    ⭐ {selectedRestaurant.rating.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="p-2 bg-surface-container-low/60 rounded-md">
                                                <span className="text-[10px] font-bold uppercase text-black/50 block">
                                                    Price Tier
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {selectedRestaurant.price || selectedRestaurant.priceRange}
                                                </span>
                                            </div>
                                            <div className="p-2 bg-surface-container-low/60 rounded-md">
                                                <span className="text-[10px] font-bold uppercase text-black/50 block">
                                                    Guest Limits
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {selectedRestaurant.guests || `1–${maxGuests}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Live Itinerary Summary Box */}
                                        <div className="p-4 bg-surface-container-low rounded-lg space-y-2.5 text-xs border border-outline-variant/20">
                                            <p className="font-bold text-primary text-[11px] uppercase tracking-wider flex items-center justify-between">
                                                <span>Your Reservation Summary</span>
                                                <span className="text-secondary">Ready</span>
                                            </p>
                                            <div className="flex justify-between text-black/70">
                                                <span>Date:</span>
                                                <span className="font-medium text-primary">{selectedDate}</span>
                                            </div>
                                            <div className="flex justify-between text-black/70">
                                                <span>Time Slot:</span>
                                                <span className="font-medium text-primary">{selectedSlot} PM</span>
                                            </div>
                                            <div className="flex justify-between text-black/70">
                                                <span>Party Size:</span>
                                                <span className="font-medium text-primary">{guests} Guests</span>
                                            </div>
                                            <div className="flex justify-between text-black/70">
                                                <span>Seating Zone:</span>
                                                <span className="font-medium text-primary">{seatingZone}</span>
                                            </div>
                                            <div className="flex justify-between text-black/70">
                                                <span>Occasion:</span>
                                                <span className="font-medium text-primary">{occasion}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex flex-col gap-2">
                                            <Link
                                                to={`/restaurant/${selectedRestaurant.slug}`}
                                                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 justify-center"
                                            >
                                                View Full Restaurant Profile & Reviews →
                                            </Link>
                                            <div className="flex items-center justify-center gap-1 text-[11px] text-black/50">
                                                <ShieldCheck size={13} className="text-emerald-600" />
                                                <span>Free cancellation up to 24 hours in advance</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
