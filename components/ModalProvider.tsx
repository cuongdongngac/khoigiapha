"use client";

import { useState, useEffect } from "react";
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsChangePasswordOpen(true);
    
    window.addEventListener('openChangePasswordModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openChangePasswordModal', handleOpenModal);
    };
  }, []);

  return (
    <>
      {children}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
