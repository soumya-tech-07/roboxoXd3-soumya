'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' or 'signup'

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const openLogin = () => {
    setModalType('login');
    setIsOpen(true);
  };

  const openSignup = () => {
    setModalType('signup');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchToSignup = () => {
    setModalType('signup');
  };

  const switchToLogin = () => {
    setModalType('login');
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        modalType,
        openLogin,
        openSignup,
        closeModal,
        switchToSignup,
        switchToLogin,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}

