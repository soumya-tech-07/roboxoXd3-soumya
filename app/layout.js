import Footer from "./components/Footer";
import NavbarWithCustomGif from "./components/NavbarWithCustomGif";
import AuthModals from "./components/AuthModals";
import CartSidebar from "./components/CartSidebar";
import DiscountBanner from "./components/DiscountBanner";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WishlistProvider>
          <CartProvider>
            <AuthModalProvider>
            <NavbarWithCustomGif/>
            {children}
            <Footer/>
              <AuthModals />
              <CartSidebar />
              <DiscountBanner />
            </AuthModalProvider>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
