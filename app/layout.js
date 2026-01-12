import Footer from "./components/Footer";
import NavbarWithCustomGif from "./components/NavbarWithCustomGif";
import AuthModals from "./components/AuthModals";
import CartSidebar from "./components/CartSidebar";
import DiscountBanner from "./components/DiscountBanner";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <AuthModalProvider>
              <WishlistProvider>
                <CartProvider>
                  <NavbarWithCustomGif/>
                  {children}
                  <Footer/>
                  <AuthModals />
                  <CartSidebar />
                  <DiscountBanner />
                </CartProvider>
              </WishlistProvider>
            </AuthModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
