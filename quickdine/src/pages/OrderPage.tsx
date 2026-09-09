import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext, type CartItem, type PlacedOrder } from "../context/AppContext";
import { menuItems } from "../data/menuData";
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    CheckCircle2,
    Clock,
    MapPin,
    Utensils,
    Receipt,
    Sparkles,
    ChefHat,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function OrderPage() {
    const {
        cart,
        addToOrder,
        updateOrderQuantity,
        removeFromOrder,
        clearOrder,
        orders,
        placeOrder,
        user,
        openAuthModal,
    } = useAppContext();

    const [activeTab, setActiveTab] = useState<"cart" | "history">("cart");
    const [orderType, setOrderType] = useState<"dine-in" | "takeout" | "delivery">("dine-in");
    const [tableOrAddress, setTableOrAddress] = useState<string>("Table #14");
    const [tipPercent, setTipPercent] = useState<number>(18);
    const [promoCode, setPromoCode] = useState<string>("");
    const [promoDiscount, setPromoDiscount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [lastConfirmedOrder, setLastConfirmedOrder] = useState<PlacedOrder | null>(null);

    // Calculate totals
    const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    const discountAmount = promoDiscount > 0 ? (subtotal * promoDiscount) / 100 : 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = Number((discountedSubtotal * 0.08875).toFixed(2));
    const tipAmount = Number(((discountedSubtotal * tipPercent) / 100).toFixed(2));
    const total = Number((discountedSubtotal + tax + tipAmount).toFixed(2));

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoCode.trim().toUpperCase() === "QUICKDINE" || promoCode.trim().toUpperCase() === "VIP10") {
            setPromoDiscount(10);
            toast.success("Promo code applied: 10% VIP discount!");
        } else {
            toast.error("Invalid code. Try using 'QUICKDINE' for 10% off.");
        }
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please login to place your order");
            openAuthModal("login");
            return;
        }

        if (cart.length === 0) {
            toast.error("Your order is empty!");
            return;
        }

        if (!tableOrAddress.trim()) {
            toast.error(
                orderType === "dine-in"
                    ? "Please specify your Table Number"
                    : orderType === "delivery"
                    ? "Please provide delivery address"
                    : "Please specify pickup time"
            );
            return;
        }

        setIsSubmitting(true);
        try {
            // Find restaurant name from first item or default
            const primaryRestaurant = cart[0]?.item.restaurantName || "QuickDine Fine Dining";
            const orderResult = await placeOrder({
                orderType,
                tableOrAddress,
                tip: tipAmount,
                restaurantName: primaryRestaurant,
            });
            setLastConfirmedOrder(orderResult);
            setActiveTab("history");
        } catch {
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Quick add recommendations
    const recommendations = menuItems.slice(8, 12);

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-16 md:pt-20">
            <Navbar />

            <main className="flex-1 pb-20">
                {/* Page Title Header */}
                <div className="bg-primary text-white py-12 px-6 md:px-10">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="text-secondary text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2">
                                <Sparkles size={14} /> Seamless Dining & Ordering
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-semibold">
                                Complete Your Dining Order
                            </h1>
                            <p className="text-white/70 text-xs md:text-sm mt-1">
                                High-speed table ordering, scheduled pickup, and private luxury catering.
                            </p>
                        </div>

                        {/* Top Tabs */}
                        <div className="flex bg-white/10 p-1 rounded-lg self-start md:self-auto">
                            <button
                                onClick={() => setActiveTab("cart")}
                                className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                    activeTab === "cart"
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-white/70 hover:text-white"
                                }`}
                            >
                                ACTIVE CART ({cart.reduce((a, b) => a + b.quantity, 0)})
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                    activeTab === "history"
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-white/70 hover:text-white"
                                }`}
                            >
                                ORDER HISTORY ({orders.length})
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-10 mt-8">
                    {/* CONFIRMED BANNER IF JUST PLACED */}
                    {lastConfirmedOrder && activeTab === "history" && (
                        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-4 animate-in fade-in">
                            <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-emerald-900 text-sm">
                                    Order #{lastConfirmedOrder.id} successfully received!
                                </h3>
                                <p className="text-emerald-700 text-xs mt-1">
                                    The culinary team at {lastConfirmedOrder.restaurantName} is preparing your selection. Estimated time: {lastConfirmedOrder.estimatedTime}.
                                </p>
                            </div>
                            <button
                                onClick={() => setLastConfirmedOrder(null)}
                                className="text-emerald-800 text-xs underline font-medium cursor-pointer"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {activeTab === "cart" ? (
                        cart.length === 0 ? (
                            /* Empty Cart View */
                            <div className="bg-white rounded-2xl border border-outline-variant/25 p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
                                <div className="size-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4 text-black/40">
                                    <ShoppingBag size={28} />
                                </div>
                                <h2 className="font-display text-2xl font-semibold text-primary mb-2">
                                    Your dining order is empty
                                </h2>
                                <p className="text-xs text-black/60 max-w-sm mx-auto mb-6 leading-relaxed">
                                    Explore our master culinary menu to select artisanal entrées, chef tasting plates, and fine beverage pairings.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Link
                                        to="/menu"
                                        className="px-6 py-3 bg-primary hover:bg-secondary text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer"
                                    >
                                        Explore Menu
                                    </Link>
                                    <Link
                                        to="/reservation"
                                        className="px-6 py-3 border border-outline-variant/40 hover:border-primary text-primary text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                    >
                                        Book Table
                                    </Link>
                                </div>

                                {/* Suggested Quick Adds */}
                                <div className="mt-12 pt-8 border-t border-outline-variant/15 text-left">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-4 flex items-center gap-1.5">
                                        <ChefHat size={14} className="text-secondary" /> Popular Quick Additions
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {recommendations.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3 border border-outline-variant/20 rounded-lg flex items-center justify-between gap-2 hover:border-secondary/50 transition-colors"
                                            >
                                                <div className="truncate">
                                                    <p className="font-semibold text-xs text-primary truncate flex items-center gap-1.5">
                                                        <span>{item.flag}</span>
                                                        <span>{item.name}</span>
                                                    </p>
                                                    <p className="text-[11px] text-secondary font-medium">
                                                        ${item.price} • {item.cuisine}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => addToOrder(item, 1)}
                                                    className="p-1.5 rounded-full bg-surface-container-low hover:bg-secondary hover:text-white text-primary transition-colors cursor-pointer shrink-0"
                                                    title="Add to order"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Active Cart View */
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left: Items & Delivery Details (8 cols) */}
                                <div className="lg:col-span-7 space-y-6">
                                    {/* Order Type Selector */}
                                    <div className="bg-white p-5 rounded-xl border border-outline-variant/25 shadow-sm">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-black/60 mb-3">
                                            Select Dining Mode
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOrderType("dine-in");
                                                    setTableOrAddress("Table #14");
                                                }}
                                                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                                                    orderType === "dine-in"
                                                        ? "border-primary bg-primary text-white shadow-sm font-semibold"
                                                        : "border-outline-variant/30 hover:border-primary/40 bg-surface-container-low/50 text-black/70"
                                                }`}
                                            >
                                                <Utensils size={18} className="mx-auto mb-1" />
                                                <span className="text-xs block">Dine-In Table</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOrderType("takeout");
                                                    setTableOrAddress("Pickup in 25 min");
                                                }}
                                                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                                                    orderType === "takeout"
                                                        ? "border-primary bg-primary text-white shadow-sm font-semibold"
                                                        : "border-outline-variant/30 hover:border-primary/40 bg-surface-container-low/50 text-black/70"
                                                }`}
                                            >
                                                <ShoppingBag size={18} className="mx-auto mb-1" />
                                                <span className="text-xs block">Takeout Pickup</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOrderType("delivery");
                                                    setTableOrAddress("450 Lexington Ave, Suite 12B");
                                                }}
                                                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                                                    orderType === "delivery"
                                                        ? "border-primary bg-primary text-white shadow-sm font-semibold"
                                                        : "border-outline-variant/30 hover:border-primary/40 bg-surface-container-low/50 text-black/70"
                                                }`}
                                            >
                                                <MapPin size={18} className="mx-auto mb-1" />
                                                <span className="text-xs block">Luxury Delivery</span>
                                            </button>
                                        </div>

                                        {/* Dynamic Destination Input */}
                                        <div className="mt-4 pt-3 border-t border-outline-variant/15">
                                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/60 mb-1">
                                                {orderType === "dine-in"
                                                    ? "Table Number / Reservation Name"
                                                    : orderType === "takeout"
                                                    ? "Pickup Timing & Customer Name"
                                                    : "Delivery Street Address & Apt"}
                                            </label>
                                            <input
                                                type="text"
                                                value={tableOrAddress}
                                                onChange={(e) => setTableOrAddress(e.target.value)}
                                                placeholder={
                                                    orderType === "dine-in"
                                                        ? "e.g., Table 14 or Reservation under Smith"
                                                        : orderType === "takeout"
                                                        ? "e.g., Ready at 7:30 PM"
                                                        : "e.g., 742 Evergreen Terrace, Apt 4"
                                                }
                                                className="w-full px-3.5 py-2 text-xs bg-surface-container-low/50 border border-outline-variant/40 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Cart Items List */}
                                    <div className="bg-white rounded-xl border border-outline-variant/25 overflow-hidden shadow-sm">
                                        <div className="p-4 border-b border-outline-variant/15 flex items-center justify-between">
                                            <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                                                <Receipt size={16} /> Selected Dining Items ({cart.length})
                                            </h3>
                                            <button
                                                onClick={clearOrder}
                                                className="text-xs text-error hover:underline cursor-pointer flex items-center gap-1"
                                            >
                                                <Trash2 size={13} /> Clear All
                                            </button>
                                        </div>

                                        <div className="divide-y divide-outline-variant/15">
                                            {cart.map((cartItem: CartItem) => {
                                                const { item, quantity } = cartItem;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-container-lowest transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="size-16 rounded-lg object-cover bg-surface-container-low shrink-0 border border-outline-variant/20"
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="font-semibold text-xs md:text-sm text-primary truncate flex items-center gap-1.5">
                                                                    <span>{item.flag}</span>
                                                                    <span>{item.name}</span>
                                                                </h4>
                                                                <p className="text-[11px] text-secondary font-medium mt-0.5">
                                                                    ${item.price} each • {item.restaurantName}
                                                                </p>
                                                                <span className="text-[10px] text-black/50">
                                                                    {item.cuisine} • {item.category}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Controllers & Subtotal */}
                                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                                            <div className="flex items-center border border-outline-variant/40 rounded-lg overflow-hidden bg-surface-container-low/40">
                                                                <button
                                                                    onClick={() => updateOrderQuantity(item.id, -1)}
                                                                    className="p-1.5 text-black/60 hover:text-primary hover:bg-white transition-colors cursor-pointer"
                                                                >
                                                                    <Minus size={13} />
                                                                </button>
                                                                <span className="px-3 text-xs font-bold text-primary">
                                                                    {quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateOrderQuantity(item.id, 1)}
                                                                    className="p-1.5 text-black/60 hover:text-primary hover:bg-white transition-colors cursor-pointer"
                                                                >
                                                                    <Plus size={13} />
                                                                </button>
                                                            </div>

                                                            <div className="text-right min-w-[60px]">
                                                                <span className="font-display font-semibold text-sm text-primary">
                                                                    ${(item.price * quantity).toFixed(2)}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={() => removeFromOrder(item.id)}
                                                                className="text-black/40 hover:text-error transition-colors p-1 cursor-pointer"
                                                                title="Remove item"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Link to Add More */}
                                    <div className="flex justify-between items-center px-1">
                                        <Link
                                            to="/menu"
                                            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1.5"
                                        >
                                            <Plus size={14} /> Add more dishes from menu
                                        </Link>
                                    </div>
                                </div>

                                {/* Right: Order Summary & Checkout (5 cols) */}
                                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-outline-variant/25 shadow-sm space-y-6">
                                    <h3 className="font-display text-lg font-semibold text-primary border-b border-outline-variant/15 pb-3">
                                        Payment & Billing Summary
                                    </h3>

                                    {/* Gratuity Selector */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-semibold text-black/70">
                                                Staff Gratuity / Hospitality Tip
                                            </label>
                                            <span className="text-xs font-bold text-secondary">
                                                ${tipAmount.toFixed(2)} ({tipPercent}%)
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[15, 18, 20, 25].map((pct) => (
                                                <button
                                                    key={pct}
                                                    type="button"
                                                    onClick={() => setTipPercent(pct)}
                                                    className={`py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                                                        tipPercent === pct
                                                            ? "bg-primary text-white"
                                                            : "bg-surface-container-low text-black/70 hover:bg-surface-container-low/80"
                                                    }`}
                                                >
                                                    {pct}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Promo Code Box */}
                                    <form onSubmit={handleApplyPromo} className="space-y-1">
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/60">
                                            VIP Voucher / Promo Code
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="e.g. QUICKDINE"
                                                className="flex-1 px-3 py-2 text-xs bg-surface-container-low/50 border border-outline-variant/40 rounded-md focus:outline-none focus:border-secondary uppercase"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-surface-container-low text-primary hover:bg-primary hover:text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {promoDiscount > 0 && (
                                            <p className="text-[11px] text-emerald-600 font-medium">
                                                ✓ 10% VIP discount applied!
                                            </p>
                                        )}
                                    </form>

                                    {/* Breakdown */}
                                    <div className="space-y-2 pt-4 border-t border-outline-variant/15 text-xs">
                                        <div className="flex justify-between text-black/70">
                                            <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        {promoDiscount > 0 && (
                                            <div className="flex justify-between text-emerald-600">
                                                <span>VIP Discount (10%)</span>
                                                <span>-${discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-black/70">
                                            <span>State & Local Tax (8.875%)</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-black/70">
                                            <span>Staff Gratuity</span>
                                            <span>${tipAmount.toFixed(2)}</span>
                                        </div>

                                        <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-baseline">
                                            <div>
                                                <span className="font-display text-base font-semibold text-primary block">
                                                    Grand Total
                                                </span>
                                                <span className="text-[10px] text-black/50">
                                                    Includes applicable taxes & service
                                                </span>
                                            </div>
                                            <span className="font-display text-2xl font-bold text-primary">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Auth Notice if not logged in */}
                                    {!user && (
                                        <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg flex items-center gap-2.5 text-xs text-secondary">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>
                                                Please{" "}
                                                <button
                                                    onClick={() => openAuthModal("login")}
                                                    className="underline font-bold hover:text-primary cursor-pointer"
                                                >
                                                    Login / Sign Up
                                                </button>{" "}
                                                to authorize this order.
                                            </span>
                                        </div>
                                    )}

                                    {/* Checkout / Submit Order Button */}
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-primary hover:bg-secondary text-white rounded-lg text-xs font-semibold tracking-widest uppercase shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span>TRANSMITTING ORDER...</span>
                                        ) : (
                                            <>
                                                <span>CONFIRM & TRANSMIT ORDER</span>
                                                <ArrowRight size={15} />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] text-black/50 leading-relaxed">
                                        Your order is transmitted directly to the kitchen brigade for precision preparation.
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        /* Order History View */
                        <div className="bg-white rounded-xl border border-outline-variant/25 p-6 md:p-8 shadow-sm">
                            <h2 className="font-display text-xl font-semibold text-primary mb-6">
                                Your Recent Dining Orders
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16">
                                    <Clock size={36} className="mx-auto text-black/30 mb-3" />
                                    <p className="text-sm font-medium text-black/70 mb-1">
                                        No past orders found
                                    </p>
                                    <p className="text-xs text-black/50 max-w-sm mx-auto mb-6">
                                        When you place dining or delivery orders, track their live preparation status right here.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab("cart")}
                                        className="px-5 py-2.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-secondary transition-colors cursor-pointer"
                                    >
                                        Start an Order
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="p-5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest hover:border-secondary/30 transition-all space-y-4"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/15 pb-3">
                                                <div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="font-bold text-sm text-primary">
                                                            #{order.id}
                                                        </span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-secondary font-medium mt-0.5">
                                                        {order.restaurantName} • {order.orderType.toUpperCase()} ({order.tableOrAddress})
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <span className="font-display font-semibold text-lg text-primary block">
                                                        ${order.total.toFixed(2)}
                                                    </span>
                                                    <span className="text-[10px] text-black/50">
                                                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                                                        {new Date(order.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Items List */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                                {order.items.map((cartItem, idx) => (
                                                    <div key={idx} className="flex justify-between text-black/70 py-1">
                                                        <span>
                                                            {cartItem.quantity}x {cartItem.item.name}
                                                        </span>
                                                        <span className="font-medium">
                                                            ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs text-black/60">
                                                <span className="flex items-center gap-1.5 text-secondary">
                                                    <Clock size={14} /> Est. Time: {order.estimatedTime}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        order.items.forEach((ci) => addToOrder(ci.item, ci.quantity));
                                                        setActiveTab("cart");
                                                    }}
                                                    className="font-semibold text-secondary hover:underline cursor-pointer"
                                                >
                                                    Re-order items
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
