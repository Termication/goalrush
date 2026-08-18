'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'outline' | 'destructive' | 'ghost' | 'default' | 'secondary';
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export default function LogoutButton({
  variant = 'destructive',
  className = '',
  showIcon = true,
  label = 'Log Out',
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`transition-all hover:scale-105 ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {isLoggingOut ? 'Signing out...' : label}
    </Button>
  );
}