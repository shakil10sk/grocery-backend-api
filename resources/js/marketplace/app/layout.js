import { jsx as _jsx } from "react/jsx-runtime";
// Font imports removed;
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { AuthProvider } from "../context/AuthContext";
import MainLayout from "../components/layouts/MainLayout";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: [
        "latin"
    ]
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: [
        "latin"
    ]
});
export const metadata = {
    title: "GroceryMart - Fresh Groceries Delivered",
    description: "Shop fresh groceries online with GroceryMart. Fast delivery, best prices, and quality guaranteed.",
    keywords: "grocery, online shopping, fresh produce, dairy, meat, delivery",
    viewport: "width=device-width, initial-scale=1"
};
export default function RootLayout({ children }) {
    return /*#__PURE__*/ _jsx("html", {
        lang: "en",
        children: /*#__PURE__*/ _jsx("body", {
            className: `${geistSans.variable} ${geistMono.variable} antialiased`,
            children: /*#__PURE__*/ _jsx(AuthProvider, {
                children: /*#__PURE__*/ _jsx(CartProvider, {
                    children: /*#__PURE__*/ _jsx(WishlistProvider, {
                        children: /*#__PURE__*/ _jsx(MainLayout, {
                            children: children
                        })
                    })
                })
            })
        })
    });
}
