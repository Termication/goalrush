'use client';

import { SessionProvider } from 'next-auth/react';

// This is a client-side component that wraps our app, making session data available
export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
