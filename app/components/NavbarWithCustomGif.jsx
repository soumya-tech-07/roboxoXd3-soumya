// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// export default function NavbarWithCustomGif() {
//   const [currentTextIndex, setCurrentTextIndex] = useState(0);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();

//   const rotatingTexts = [
//     "NEW DROP - NOW LIVE",
//     "FREE SHIPPING ON ORDERS ABOVE ₹2999",
//     "SHOP THE LATEST COLLECTION",
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTextIndex(
//         (prevIndex) => (prevIndex + 1) % rotatingTexts.length
//       );
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [rotatingTexts.length]);

//   const navLinks = [
//     { href: "/new-in", label: "NEW IN" },
//     { href: "/apparel", label: "APPAREL" },
//     { href: "/stores", label: "STORES" },
//   ];

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-white">
//       {/* Top Banner with Rotating Text */}
//       <div className="bg-brand text-white py-1.5 sm:py-2 overflow-hidden">
//         <div className="relative h-5 sm:h-6">
//           {rotatingTexts.map((text, index) => (
//             <div
//               key={index}
//               className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
//                 index === currentTextIndex
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-full"
//               }`}
//             >
//               <p className="text-[10px] sm:text-xs tracking-widest font-light px-2 text-center">
//                 {text}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/*Navbar*/}
//       <nav className="border-b border-gray-200">
//         <div className="px-4 sm:px-6">
//           <div className="flex items-center justify-between h-14 sm:h-16">
//             {/* Logo */}
//             <Link href="/" className="shrink-0 z-10">
//               <div className="relative h-24 sm:h-28 w-auto">
//                 <Image
//                   src="/images/retro.png"
//                   alt="Retro Louve"
//                   width={150}
//                   height={40}
//                   className="h-full w-auto object-contain"
//                   priority
//                 />
//               </div>
//             </Link>

//             {/* Desktop Navigation - Centered */}
//             <div className="hidden xl:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="text-xs tracking-wide text-brand hover:text-brand/70 transition-colors whitespace-nowrap"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Right Side - Desktop */}
//             <div className="hidden xl:flex items-center space-x-6 z-10">
//               {/* Search Button */}
//               <button
//                 onClick={() => router.push("/search")}
//                 className="border-b text-start w-40 text-xs tracking-wide text-brand hover:text-brand/70 transition-colors whitespace-nowrap"
//               >
//                 SEARCH
//               </button>

//               {/* Wishlist */}
//               <Link
//                 href="/wishlist"
//                 className="text-xs tracking-wide text-brand hover:text-brand/70 transition-colors whitespace-nowrap"
//                 aria-label="Wishlist"
//               >
//                 WISHLIST
//               </Link>

//               {/* Shopping Bag */}
//               <Link
//                 href="/cart"
//                 className="text-xs tracking-wide text-brand hover:text-brand/70 transition-colors whitespace-nowrap"
//                 aria-label="Cart"
//               >
//                 SHOPPING BAG
//               </Link>

//               {/* Login Button */}
//               <Link
//                 href="/login"
//                 className="text-xs tracking-wide text-brand hover:text-brand/70 transition-colors whitespace-nowrap"
//               >
//                 LOGIN
//               </Link>
//             </div>

//             {/* Right Side - Tablet (md to xl) */}
//             <div className="hidden md:flex xl:hidden items-center space-x-3 z-10">
//               {/* Search Icon */}
//               <button
//                 onClick={() => router.push("/search")}
//                 className="text-brand border-b w-40 text-start hover:text-brand/70 transition-colors"
//                 aria-label="Search"
//               >
//                 SEARCH
//               </button>

//               {/* Wishlist Icon */}
//               <Link
//                 href="/wishlist"
//                 className="text-brand hover:text-brand/70 transition-colors"
//                 aria-label="Wishlist"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//               </Link>

//               {/* Cart Icon */}
//               <Link
//                 href="/cart"
//                 className="text-brand hover:text-brand/70 transition-colors"
//                 aria-label="Cart"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </Link>

//               {/* Login Icon */}
//               <Link
//                 href="/login"
//                 className="text-brand hover:text-brand/70 transition-colors"
//                 aria-label="Login"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden text-brand"
//               aria-label="Toggle navigation menu"
//               aria-expanded={isMenuOpen}
//               onClick={() => setIsMenuOpen((prev) => !prev)}
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 {isMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 bg-white shadow-sm">
//             <div className="px-4 py-4 space-y-4">
//               {/* Navigation Links */}
//               <div className="flex flex-col space-y-3">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className="text-sm tracking-wide text-brand hover:text-brand/70 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>

//               {/* Divider */}
//               <div className="border-t border-gray-200 pt-3">
//                 <div className="flex flex-col space-y-3">
//                   <button
//                     onClick={() => {
//                       router.push("/search");
//                       setIsMenuOpen(false);
//                     }}
//                     className="text-sm tracking-wide text-brand hover:text-brand/70 transition-colors text-left"
//                   >
//                     SEARCH
//                   </button>
//                   <Link
//                     href="/wishlist"
//                     className="text-sm tracking-wide text-brand hover:text-brand/70 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     WISHLIST
//                   </Link>
//                   <Link
//                     href="/cart"
//                     className="text-sm tracking-wide text-brand hover:text-brand/70 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     SHOPPING BAG
//                   </Link>
//                   <Link
//                     href="/login"
//                     className="text-sm tracking-wide text-brand hover:text-brand/70 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     LOGIN
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchComponent from "./SearchComponent";

export default function NavbarWithCustomGif() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const rotatingTexts = [
    "NEW DROP - NOW LIVE",
    "FREE SHIPPING ON ORDERS ABOVE ₹2999",
    "SHOP THE LATEST COLLECTION",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(
        (prevIndex) => (prevIndex + 1) % rotatingTexts.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveSubMenu(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        {/* Top Banner with Rotating Text */}
        <div className="bg-brand text-white py-1.5 sm:py-2 overflow-hidden">
          <div className="relative h-5 sm:h-6">
            {rotatingTexts.map((text, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                  index === currentTextIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full"
                }`}
              >
                <p className="text-[10px] sm:text-xs tracking-widest font-light px-2 text-center">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navbar */}
        <nav className={`${isScrolled ? "border-b border-gray-200" : ""}`}>
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Left Side - Hamburger & Search */}
              <div className="flex items-center space-x-4 sm:space-x-6">
                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={`transition-colors cursor-pointer ${
                    isScrolled ? "text-brand" : "text-white"
                  } hover:opacity-70`}
                  aria-label="Open menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Search Icon */}
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                  }}
                  className={`transition-colors cursor-pointer ${
                    isScrolled ? "text-brand" : "text-white"
                  } hover:opacity-70`}
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Center - Logo */}
              <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                <div className="relative h-28 sm:h-40 w-auto">
                  <Image
                    src="/images/retro.png"
                    alt="Retro Louve"
                    width={150}
                    height={40}
                    className="h-full w-auto object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Right Side - User & Cart Icons */}
              <div className="flex items-center space-x-4 sm:space-x-6">
                {/* User/Login Icon */}
                <Link
                  href="/login"
                  className={`transition-colors ${
                    isScrolled ? "text-brand" : "text-white"
                  } hover:opacity-70`}
                  aria-label="Login"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>

                {/* Shopping Cart Icon */}
                <Link
                  href="/cart"
                  className={`transition-colors ${
                    isScrolled ? "text-brand" : "text-white"
                  } hover:opacity-70`}
                  aria-label="Cart"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Sidebar Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-6 border-b border-gray-200">
            <button
              onClick={closeMenu}
              className="text-brand hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-6 py-8 overflow-hidden">
            {activeSubMenu === "shop" ? (
              <div className="space-y-0 animate-in slide-in-from-right duration-300">
                {/* Back Button - Improved Styling */}
                <button
                  onClick={() => setActiveSubMenu(null)}
                  className="flex items-center mb-6 pb-4 border-b border-gray-200 text-gray-700 hover:text-brand transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-brand transition-colors mr-3">
                    <svg
                      className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium tracking-wide">Back</span>
                </button>
                
                {/* Submenu Title */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold tracking-wide text-brand uppercase">
                    Shop
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Browse our collections</p>
                </div>
                
                {/* Submenu Items */}
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/shop/men"
                      className="group block py-4 px-4 rounded-lg text-sm tracking-wide text-gray-900 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer border border-gray-200 hover:border-brand"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Men</span>
                        <svg
                          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/women"
                      className="group block py-4 px-4 rounded-lg text-sm tracking-wide text-gray-900 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer border border-gray-200 hover:border-brand"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Women</span>
                        <svg
                          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <ul className="space-y-0">
                {/* Shop */}
                <li className="border-b border-gray-200">
                  <button
                    onClick={() => setActiveSubMenu("shop")}
                    className="w-full flex items-center justify-between py-4 text-left text-sm tracking-wide text-brand hover:opacity-70 transition-opacity cursor-pointer group"
                  >
                    <span className="font-medium">Shop</span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-brand transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>

                {/* About Love */}
                <li className="border-b border-gray-200">
                  <Link
                    href="/about-love"
                    className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                    onClick={closeMenu}
                  >
                    About Love
                  </Link>
                </li>

                {/* Blog */}
                <li className="border-b border-gray-200">
                  <Link
                    href="/blog"
                    className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                    onClick={closeMenu}
                  >
                    Blog
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="border-b border-gray-200">
                  <Link
                    href="/contact"
                    className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                    onClick={closeMenu}
                  >
                    Contact Us
                  </Link>
                </li>

                {/* Wishlist */}
                <li className="border-b border-gray-200">
                  <Link
                    href="/wishlist"
                    className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                    onClick={closeMenu}
                  >
                    Wishlist
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </aside>

      {/* Search Component */}
      {isSearchOpen && (
        <SearchComponent 
          key={isSearchOpen ? 'search-open' : 'search-closed'}
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}