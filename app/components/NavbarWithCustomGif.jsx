"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import SearchComponent from "./SearchComponent";
import { useAuthModal } from "../context/AuthModalContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function NavbarWithCustomGif() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin, openSignup } = useAuthModal();
  const { openCart } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const { showSuccess } = useToast();

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

  // Listen for token expiration event and open login modal
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('Token expired event received, opening login modal...');
      openLogin();
    };

    window.addEventListener('auth:token-expired', handleTokenExpired);
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, [openLogin]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Close user menu when user logs out or token expires
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsUserMenuOpen(false);
    }
  }, [isAuthenticated, user]);

  // Close user menu when user logs out or token expires
  useEffect(() => {
    if (!isAuthenticated) {
      setIsUserMenuOpen(false);
    }
  }, [isAuthenticated]);

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

  const scrollToSection = (sectionId) => {
    closeMenu();
    // Check if we're on the home page
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Navigate to home page first, then scroll
      router.push('/');
      setTimeout(() => {
        const checkElement = () => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            setTimeout(checkElement, 100);
          }
        };
        checkElement();
      }, 500);
    }
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
            <div className="relative flex items-center justify-between h-16 sm:h-20">
              {/* Left Side - Hamburger & Search */}
              <div className="flex items-center space-x-4 sm:space-x-6 z-10">
                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={`transition-colors cursor-pointer flex items-center justify-center ${
                    isScrolled ? "text-black" : "text-brand"
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
                  className={`transition-colors cursor-pointer flex items-center justify-center ${
                    isScrolled ? "text-black" : "text-brand"
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
              <Link href="/" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="relative h-20 sm:h-24 w-auto flex items-center">
                  <Image
                    src={isScrolled ? "/images/4.png" : "/images/mainlog.png"}
                    alt="Retro Louve"
                    width={500}
                    height={500}
                    className="h-full w-auto object-contain transition-opacity duration-300"
                    priority
                  />
                </div>
              </Link>

              {/* Right Side - User & Cart Icons */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 z-10">
                {/* User/Login Icon with Dropdown */}
                <div className="relative flex items-center justify-center" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      if (isAuthenticated && user) {
                        setIsUserMenuOpen(!isUserMenuOpen);
                      } else {
                        setIsUserMenuOpen(false);
                        openLogin();
                      }
                    }}
                    className={`transition-colors cursor-pointer flex items-center justify-center ${
                      isScrolled ? "text-black" : "text-brand"
                    } hover:opacity-70`}
                    aria-label={isAuthenticated && user ? "User menu" : "Login"}
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
                  </button>

                  {/* User Dropdown Menu - Only show if authenticated AND user exists */}
                  {isAuthenticated && user && isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {profile?.first_name && profile?.last_name
                              ? `${profile.first_name} ${profile.last_name}`
                              : user?.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                        </div>
                        <Link
                          href="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          My Wishlist
                        </Link>
                        
                        <button
                          onClick={async () => {
                            setIsUserMenuOpen(false);
                            const { error } = await signOut();
                            if (!error) {
                              showSuccess('Logged out successfully');
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shopping Cart Icon */}
                <button
                  onClick={openCart}
                  className={`transition-colors cursor-pointer flex items-center justify-center ${
                    isScrolled ? "text-black" : "text-brand"
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
                </button>
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
        

          {/* Logo */}
          <div className="px-5 flex justify-start items-center border-b border-gray-200">
            <Link
              href="/"
              onClick={closeMenu}
              className="block"
            >
              <div className="relative h-16 w-auto">
                <Image
                  src="/images/4.png"
                  alt="Retro Louve"
                  width={200}
                  height={80}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </Link>
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
                    <button
                      onClick={() => scrollToSection('mens-section')}
                      className="group w-full block py-4 px-4 rounded-lg text-sm tracking-wide text-gray-900 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer border border-gray-200 hover:border-brand text-left"
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
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('womens-section')}
                      className="group w-full block py-4 px-4 rounded-lg text-sm tracking-wide text-gray-900 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer border border-gray-200 hover:border-brand text-left"
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
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <ul className="space-y-0">
                {/* Home */}
                {pathname !== '/' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      Home
                    </Link>
                  </li>
                )}

                {/* About Retro Louve */}
                {pathname !== '/about-love' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/about-love"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      About Retro Louve
                    </Link>
                  </li>
                )}

                {/* Blog */}
                {pathname !== '/blog' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/blog"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      Blogs
                    </Link>
                  </li>
                )}

                {/* FAQ */}
                {pathname !== '/faq' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/faq"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      FAQ
                    </Link>
                  </li>
                )}

                {/* Wishlist */}
                {pathname !== '/wishlist' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/wishlist"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      Wishlist
                    </Link>
                  </li>
                )}

                {/* My Orders - Only show if authenticated */}
                {isAuthenticated && user && pathname !== '/orders' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/orders"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      My Orders
                    </Link>
                  </li>
                )}

                {/* Contact Us */}
                {pathname !== '/contact' && (
                  <li className="border-b border-gray-200">
                    <Link
                      href="/contact"
                      className="block py-4 text-sm tracking-wide text-brand hover:opacity-70 transition-opacity font-medium"
                      onClick={closeMenu}
                    >
                      Contact Us
                    </Link>
                  </li>
                )}
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