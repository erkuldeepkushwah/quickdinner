import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { menuItems, menuCategories, categoryMetadata, type MenuItem } from "../data/menuData";
import { useAppContext } from "../context/AppContext";
import {
    Search,
    Plus,
    Check,
    Utensils,
    Sparkles,
    Clock,
    Flame,
    Calendar,
    ShoppingBag,
    Globe,
} from "lucide-react";

export default function MenuPage() {
    const { addToOrder, cart } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();

    // Support query param ?category= or ?cuisine=
    const initialCategory = searchParams.get("category") || searchParams.get("cuisine") || "All";
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [selectedDiet, setSelectedDiet] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const dietaryOptions = ["All", "Chef's Special", "Vegetarian", "Gluten-Free", "Spicy"];

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        const newParams = new URLSearchParams(searchParams);
        if (cat === "All") {
            newParams.delete("category");
            newParams.delete("cuisine");
        } else {
            newParams.set("category", cat);
        }
        setSearchParams(newParams, { replace: true });
    };

    const filteredItems = useMemo(() => {
        return menuItems.filter((item) => {
            // Category filter: match exact cuisine or category, handling "Chinese" / "Chines"
            const matchesCategory =
                selectedCategory === "All"
                    ? true
                    : selectedCategory === "Chinese" || selectedCategory === "Chines"
                    ? item.cuisine.toLowerCase().startsWith("chine") || item.category.toLowerCase().startsWith("chine")
                    : item.category.toLowerCase() === selectedCategory.toLowerCase() ||
                      item.cuisine.toLowerCase() === selectedCategory.toLowerCase();

            // Search filter
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.cuisine.toLowerCase().includes(q) ||
                item.restaurantName.toLowerCase().includes(q) ||
                item.tags.some((tag) => tag.toLowerCase().includes(q));

            // Dietary filter
            let matchesDiet = true;
            if (selectedDiet === "Chef's Special") matchesDiet = !!item.chefSpecial;
            else if (selectedDiet === "Vegetarian") matchesDiet = !!item.vegetarian;
            else if (selectedDiet === "Gluten-Free") matchesDiet = !!item.glutenFree;
            else if (selectedDiet === "Spicy") matchesDiet = !!item.spicy;

            return matchesCategory && matchesSearch && matchesDiet;
        });
    }, [selectedCategory, selectedDiet, searchQuery]);

    const getItemQuantityInCart = (id: string) => {
        const found = cart.find((c) => c.item.id === id);
        return found ? found.quantity : 0;
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-16 md:pt-20">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Hero / Header Section */}
                <div className="bg-primary text-white py-14 px-6 md:px-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fed488_1px,transparent_1px)] [background-size:24px_24px]"></div>
                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary-container font-semibold px-3 py-1 rounded-full bg-white/10 mb-4">
                            <Sparkles size={14} className="text-secondary" /> Curated Culinary Collection
                        </span>
                        <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-3">
                            Premier International Gastronomy
                        </h1>
                        <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Discover masterfully prepared world-class dishes from celebrated international traditions.
                            Order directly to your table or reserve a tasting seating.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-8 max-w-xl mx-auto relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/45" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes (e.g. Beef Bourguignon, Tagliatelle, Omakase, Paella)..."
                                className="w-full pl-12 pr-16 py-3.5 bg-white text-primary rounded-full text-sm placeholder:text-black/45 shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-black/50 hover:text-black cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Best Premium Categories Section */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 mt-8">
                    <div className="bg-white border border-outline-variant/30 rounded-2xl p-5 md:p-6 shadow-sm mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-outline-variant/15">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                                    <Globe size={13} /> Best Premium Categories
                                </span>
                                <h2 className="text-sm md:text-base font-display font-semibold text-primary">
                                    Filter by Global Culinary Heritage
                                </h2>
                            </div>
                            <span className="text-xs text-black/50">
                                Showing 12 iconic signature courses
                            </span>
                        </div>

                        {/* Category Buttons with Flag Badges */}
                        <div className="flex flex-wrap gap-2">
                            {menuCategories.map((cat) => {
                                const meta = categoryMetadata[cat] || { flag: "🍽️", label: cat };
                                const isSelected =
                                    selectedCategory === cat ||
                                    (cat === "Chinese" && selectedCategory === "Chines");

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                            isSelected
                                                ? "bg-primary text-white shadow-md ring-2 ring-secondary/50 scale-[1.02]"
                                                : "bg-surface-container-low/70 text-black/80 hover:bg-surface-container-low hover:text-primary border border-outline-variant/25"
                                        }`}
                                    >
                                        <span className="text-sm leading-none">{meta.flag}</span>
                                        <span>{meta.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dietary Filter Buttons Bar */}
                        <div className="mt-5 pt-4 border-t border-outline-variant/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-black/50 shrink-0">
                                    Dietary:
                                </span>
                                {dietaryOptions.map((diet) => (
                                    <button
                                        key={diet}
                                        onClick={() => setSelectedDiet(diet)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                                            selectedDiet === diet
                                                ? "bg-secondary text-white font-semibold shadow-xs"
                                                : "bg-surface-container-low/60 text-black/70 hover:bg-surface-container-low"
                                        }`}
                                    >
                                        {diet}
                                    </button>
                                ))}
                            </div>

                            <div className="text-xs text-black/60 shrink-0">
                                <span className="font-semibold text-primary">{filteredItems.length}</span>{" "}
                                {filteredItems.length === 1 ? "dish" : "dishes"} available
                            </div>
                        </div>
                    </div>

                    {/* Results Banner & Quick Jump to Live Order */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-display text-lg font-semibold text-primary">
                                {selectedCategory === "All"
                                    ? "Full Tasting Selection"
                                    : `${categoryMetadata[selectedCategory]?.label || selectedCategory} Specialities`}
                            </h3>
                            <p className="text-xs text-black/55">
                                Real-time kitchen pricing & chef preparation
                            </p>
                        </div>

                        <Link
                            to="/order"
                            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-all shadow-xs group"
                        >
                            <ShoppingBag size={14} />
                            <span>View Active Order ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Menu Grid */}
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-outline-variant/20 p-8 shadow-sm">
                            <Utensils size={44} className="mx-auto text-black/25 mb-3" />
                            <h3 className="font-display text-lg font-semibold text-primary mb-1">
                                No dishes found
                            </h3>
                            <p className="text-xs text-black/60 max-w-sm mx-auto mb-6">
                                We couldn't find any dishes matching your current filter selections. Try selecting
                                a different cuisine or resetting your filters.
                            </p>
                            <button
                                onClick={() => {
                                    handleCategoryChange("All");
                                    setSelectedDiet("All");
                                    setSearchQuery("");
                                }}
                                className="px-5 py-2.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                            >
                                Reset to All Cuisines
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                            {filteredItems.map((item: MenuItem) => {
                                const inCartQty = getItemQuantityInCart(item.id);

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-0.5"
                                    >
                                        {/* Image Box */}
                                        <div className="relative h-52 w-full overflow-hidden bg-surface-container-low">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // Smooth fallback to local asset if external image fails
                                                    (e.target as HTMLImageElement).src = "/restaurant_5.png";
                                                }}
                                            />

                                            {/* Flag & Cuisine Badge */}
                                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                                                <span className="px-3 py-1 text-xs font-bold tracking-wide bg-black/75 backdrop-blur-md text-white rounded-full flex items-center gap-1.5 shadow-md border border-white/20">
                                                    <span className="text-sm">{item.flag}</span>
                                                    <span>{item.cuisine}</span>
                                                </span>
                                                {item.chefSpecial && (
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-white rounded-full flex items-center gap-1 shadow-md">
                                                        <Sparkles size={11} /> Chef's Pick
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price Tag Badge */}
                                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full shadow-lg border border-black/5 text-primary font-display font-bold text-base flex items-center gap-0.5">
                                                <span className="text-xs text-secondary font-sans font-normal mr-0.5">$</span>
                                                <span>{item.price}</span>
                                            </div>
                                        </div>

                                        {/* Content Box */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-secondary font-semibold">
                                                    <span>{item.restaurantName}</span>
                                                    <span className="text-black/45 flex items-center gap-1 font-medium">
                                                        <Clock size={12} /> {item.prepTime}
                                                    </span>
                                                </div>

                                                <h3 className="font-display text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                                                    {item.name}
                                                </h3>

                                                <p className="text-xs text-black/70 line-clamp-2 leading-relaxed mb-4">
                                                    {item.description}
                                                </p>

                                                {/* Tags & Calories */}
                                                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                                    {item.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] font-semibold bg-surface-container-low text-black/65 px-2.5 py-0.5 rounded-full border border-outline-variant/20"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {item.calories && (
                                                        <span className="text-[10px] font-medium text-black/50 px-1 py-0.5 flex items-center gap-0.5 ml-auto">
                                                            <Flame size={11} className="text-amber-500" /> {item.calories}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="pt-3 border-t border-outline-variant/15 flex items-center gap-2">
                                                <button
                                                    onClick={() => addToOrder(item, 1)}
                                                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                                                        inCartQty > 0
                                                            ? "bg-secondary text-white ring-2 ring-secondary/40"
                                                            : "bg-primary text-white hover:bg-secondary"
                                                    }`}
                                                >
                                                    {inCartQty > 0 ? (
                                                        <>
                                                            <Check size={14} /> In Order ({inCartQty})
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={14} /> Add to Order — ${item.price}
                                                        </>
                                                    )}
                                                </button>

                                                <Link
                                                    to={`/reservation?restaurant=${item.restaurantSlug}`}
                                                    className="p-2.5 rounded-xl border border-outline-variant/35 hover:border-primary text-black/60 hover:text-primary transition-colors cursor-pointer bg-surface-container-low/50"
                                                    title={`Book table at ${item.restaurantName}`}
                                                >
                                                    <Calendar size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Feature Banner */}
                    <div className="mt-16 bg-gradient-to-r from-primary via-primary-container to-secondary text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="max-w-xl text-center md:text-left">
                            <span className="text-xs uppercase tracking-widest text-secondary-container font-semibold block mb-1">
                                Haute Cuisine Concierge
                            </span>
                            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                                Planning a Private Dining Tasting?
                            </h2>
                            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                                Reserve an intimate table with curated wine pairings, chef tastings, and private
                                sommelier service from our partner dining chambers.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/reservation"
                                className="bg-white text-primary hover:bg-secondary-container hover:text-primary font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md"
                            >
                                Book a Table
                            </Link>
                            <Link
                                to="/order"
                                className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all border border-white/25"
                            >
                                Live Order Desk
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
