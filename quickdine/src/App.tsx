import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Search from "./pages/Search.tsx";
import RestaurantDetail from "./pages/RestaurantDetail.tsx";
import BookingConfirmation from "./pages/BookingConfirmation.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import ReservationPage from "./pages/ReservationPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AuthModal from "./components/AuthModal.tsx";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster 
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1a1c1c",
                        color: "#ffffff",
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        padding: "12px 16px",
                    },
                }}
            />
            {/* Global Auth Modal for anywhere access */}
            <AuthModal />

            <Routes>
                {/* Core Navigation Routes: Home | Menu | Order | Reservation | Login */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<LoginPage />} />

                {/* Additional Discovery & Dining Routes */}
                <Route path="/search" element={<Search />} />
                <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
                <Route 
                    path="/booking/:slug" 
                    element={
                        <ProtectedRoute>
                            <BookingConfirmation />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/owner/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
