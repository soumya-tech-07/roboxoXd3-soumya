import Footer from "./components/Footer";
import NavbarWithCustomGif from "./components/NavbarWithCustomGif";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WishlistProvider>
          <CartProvider>
            <NavbarWithCustomGif/>
            {children}
            <Footer/>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
