'use client';

import { useAuthModal } from '../context/AuthModalContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

export default function AuthModals() {
  const { isOpen, modalType } = useAuthModal();

  if (!isOpen) return null;

  return (
    <>
      {modalType === 'login' && <LoginModal />}
      {modalType === 'signup' && <SignupModal />}
    </>
  );
}
// push it to github

