"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Part, Kit, Course } from "@/lib/mock-data";

type CartItemType = "part" | "kit" | "course";

interface CartItem {
    id: string; // The specific ID of the part/kit/course
    type: CartItemType;
    quantity: number;
    itemData: Part | Kit | Course;
}

interface AppContextType {
    cart: CartItem[];
    addToCart: (item: Part | Kit | Course, type: CartItemType, qty?: number) => void;
    removeFromCart: (id: string) => void;
    cartTotal: number;
    wishlist: string[];
    toggleWishlist: (id: string) => void;
    activeAIProject: string | null;
    setActiveAIProject: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [activeAIProject, setActiveAIProject] = useState<string | null>(null);

    const addToCart = (item: Part | Kit | Course, type: CartItemType, qty = 1) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id);
            if (existing) {
                return prev.map((c) =>
                    c.id === item.id ? { ...c, quantity: c.quantity + qty } : c
                );
            }
            return [...prev, { id: item.id, type, quantity: qty, itemData: item }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((c) => c.id !== id));
    };

    const toggleWishlist = (id: string) => {
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
        );
    };

    const cartTotal = cart.reduce((acc, current) => {
        return acc + current.itemData.price * current.quantity;
    }, 0);

    return (
        <AppContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                cartTotal,
                wishlist,
                toggleWishlist,
                activeAIProject,
                setActiveAIProject,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
