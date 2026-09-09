/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { dummyUser } from "../assets/assets";
import type { MenuItem } from "../data/menuData";

export interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin" | "owner";
}

export interface CartItem {
    item: MenuItem;
    quantity: number;
    specialNotes?: string;
}

export interface PlacedOrder {
    id: string;
    items: CartItem[];
    orderType: "dine-in" | "takeout" | "delivery";
    tableOrAddress: string;
    restaurantName: string;
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
    status: "Confirmed" | "Preparing" | "Ready" | "Completed";
    estimatedTime: string;
    createdAt: string;
}

interface AppContextType {
    user: UserType | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    authModalMode: "login" | "signup";
    setAuthModalOpen: (open: boolean) => void;
    openAuthModal: (mode?: "login" | "signup") => void;
    login: (email: string, password?: string, roleOverride?: "user" | "admin" | "owner") => Promise<boolean>;
    register: (name: string, email: string, password?: string, phone?: string, role?: string) => Promise<boolean>;
    logout: () => void;
    // Ordering & Cart
    cart: CartItem[];
    addToOrder: (item: MenuItem, quantity?: number, specialNotes?: string) => void;
    updateOrderQuantity: (itemId: string, delta: number) => void;
    removeFromOrder: (itemId: string) => void;
    clearOrder: () => void;
    orders: PlacedOrder[];
    placeOrder: (orderDetails: {
        orderType: "dine-in" | "takeout" | "delivery";
        tableOrAddress: string;
        tip: number;
        restaurantName: string;
    }) => Promise<PlacedOrder>;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
    const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

    // Cart state with localStorage backup
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem("qd_cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Orders state with localStorage backup
    const [orders, setOrders] = useState<PlacedOrder[]>(() => {
        try {
            const saved = localStorage.getItem("qd_orders");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("qd_cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("qd_orders", JSON.stringify(orders));
    }, [orders]);

    const openAuthModal = (mode: "login" | "signup" = "login") => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };

    const login = async (email: string, _password?: string, roleOverride?: "user" | "admin" | "owner"): Promise<boolean> => {
        const targetRole = roleOverride || (email.includes("admin") ? "admin" : email.includes("owner") ? "owner" : "user");
        const formattedName = email.includes("@") 
            ? email.split("@")[0].split(".")[0].replace(/^./, (c) => c.toUpperCase())
            : "Valued Diner";

        const loggedInUser: UserType = {
            _id: "usr_" + Math.random().toString(36).substring(2, 9),
            name: targetRole === "owner" ? "Alex Mercer (Owner)" : targetRole === "admin" ? "Sarah Chen (Admin)" : formattedName,
            email: email,
            phone: "+1 (555) 234-8890",
            role: targetRole,
        };

        const newToken = "tok_" + Date.now();
        setUser(loggedInUser);
        setToken(newToken);
        localStorage.setItem("token", newToken);
        localStorage.setItem("qd_user", JSON.stringify(loggedInUser));
        toast.success(`Welcome back, ${loggedInUser.name}!`);
        return true;
    };

    const register = async (name: string, email: string, _password?: string, phone?: string, role?: string): Promise<boolean> => {
        const newUser: UserType = {
            _id: "usr_" + Math.random().toString(36).substring(2, 9),
            name: name.trim() || "New Diner",
            email: email.trim(),
            phone: phone || "+1 (555) 019-9000",
            role: (role as any) || "user",
        };

        const newToken = "tok_" + Date.now();
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem("token", newToken);
        localStorage.setItem("qd_user", JSON.stringify(newUser));
        toast.success(`Account created! Welcome to QuickDine, ${newUser.name}!`);
        return true;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("qd_user");
        setToken(null);
        setUser(null);
        toast.success("Signed out successfully");
    };

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const saved = localStorage.getItem("qd_user");
                    if (saved) {
                        setUser(JSON.parse(saved));
                    } else {
                        setUser(dummyUser as any);
                    }
                } catch {
                    setUser(dummyUser as any);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    // Cart Management
    const addToOrder = (item: MenuItem, quantity: number = 1, specialNotes?: string) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex((c) => c.item.id === item.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                if (specialNotes) {
                    updated[existingIndex].specialNotes = specialNotes;
                }
                return updated;
            }
            return [...prev, { item, quantity, specialNotes }];
        });
        toast.success(`Added ${item.name} to order!`);
    };

    const updateOrderQuantity = (itemId: string, delta: number) => {
        setCart((prev) => {
            return prev
                .map((entry) => {
                    if (entry.item.id === itemId) {
                        const newQty = entry.quantity + delta;
                        return newQty > 0 ? { ...entry, quantity: newQty } : null;
                    }
                    return entry;
                })
                .filter(Boolean) as CartItem[];
        });
    };

    const removeFromOrder = (itemId: string) => {
        setCart((prev) => prev.filter((entry) => entry.item.id !== itemId));
        toast.success("Item removed from order");
    };

    const clearOrder = () => {
        setCart([]);
    };

    const placeOrder = async (orderDetails: {
        orderType: "dine-in" | "takeout" | "delivery";
        tableOrAddress: string;
        tip: number;
        restaurantName: string;
    }): Promise<PlacedOrder> => {
        const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
        const tax = Number((subtotal * 0.08875).toFixed(2));
        const total = Number((subtotal + tax + orderDetails.tip).toFixed(2));

        const newOrder: PlacedOrder = {
            id: "QD-ORD-" + Math.floor(100000 + Math.random() * 900000),
            items: [...cart],
            orderType: orderDetails.orderType,
            tableOrAddress: orderDetails.tableOrAddress,
            restaurantName: orderDetails.restaurantName || "QuickDine Kitchen",
            subtotal,
            tax,
            tip: orderDetails.tip,
            total,
            status: "Confirmed",
            estimatedTime: orderDetails.orderType === "dine-in" ? "15-20 min" : "30-40 min",
            createdAt: new Date().toISOString(),
        };

        setOrders((prev) => [newOrder, ...prev]);
        clearOrder();
        toast.success(`Order placed successfully! (#${newOrder.id})`);
        return newOrder;
    };

    const value: AppContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        setAuthModalOpen,
        openAuthModal,
        login,
        register,
        logout,
        cart,
        addToOrder,
        updateOrderQuantity,
        removeFromOrder,
        clearOrder,
        orders,
        placeOrder,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};
