'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ADMIN_PASSWORD = 'editoronly2025'; // Ideally from env

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (password === ADMIN_PASSWORD) {
      document.cookie = `admin=true; path=/`; // set cookie
      router.push('/admin/create-article');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">🔐 Admin Login</h1>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleLogin} className="w-full">Login</Button>
      </div>
    </main>
  );
}
