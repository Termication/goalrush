// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'editoronly2025';
const SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'supersecretkey';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
      document.cookie = `admin-token=${token}; path=/; max-age=3600`;
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
