'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserPlus, Trash2, ShieldCheck, Terminal, User as UserIcon } from 'lucide-react';

interface StaffUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  author?: {
    _id: string;
    name: string;
    slug: string;
    role: string;
    avatarUrl?: string;
    bio?: string;
  };
}

export default function ManageStaffPage() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;


  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [isSubmitting, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  

  // Form State containing all Author Schema fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    password: '',
    role: 'author', 
    titleRole: 'Senior Journalist',
    avatarUrl: '',
    bio: '',
  });

  // Auto-generate slug when name changes
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: slugify(name, { lower: true, strict: true })
    }));
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('/admin/users');
      const json = await res.json();
      if (json.success) setStaff(json.users);
    } catch (err) {
        console.error('Failed to fetch staff:', err);
    } finally {
      setLoadingStaff(false);
    }
  };



useEffect(() => {
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Prevent non-admin staff (e.g. authors/writers) from staying on this page
  if (status === 'authenticated') {
    if (userRole !== 'admin') {
      redirect('/admin/create-article');
    } else {
      fetchStaff();
    }
  }
}, [status, userRole]);

if (status === 'loading') {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Loading session...</p>
    </main>
  );
}

// Block rendering immediately if not an admin
if (!session || userRole !== 'admin') {
  return null;
}

  const handleCreateStaff = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const res = await fetch('/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // Read raw response text first
    const text = await res.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      // If parsing fails, it means the API route returned HTML (e.g., a server crash or 404)
      console.error('Server returned non-JSON response:', text);
      throw new Error(`Server returned status ${res.status}. Check terminal logs.`);
    }

    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create staff member');
    }

    setSuccess(`Staff account created for ${formData.name}`);
    setFormData({
      name: '',
      slug: '',
      email: '',
      password: '',
      role: 'author',
      titleRole: 'Senior Journalist',
      avatarUrl: '',
      bio: '',
    });
    fetchStaff();
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member and their author profile?')) return;

    try {
      const res = await fetch(`/admin/users/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setStaff(prev => prev.filter(user => user._id !== id));
      } else {
        alert(json.error || 'Failed to delete user');
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Staff Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Manage journalists, editors, and author profile details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CREATE STAFF FORM */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-600" /> Add New Staff Member
              </CardTitle>
              <CardDescription>Generates user credentials and Author schema entry.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStaff} className="space-y-4">
                {/* 1. Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Marcus Rash"
                    required
                  />
                </div>

                {/* 2. Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Profile Slug (/authors/[slug])</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="marcus-rash"
                    required
                  />
                </div>

                {/* 3. Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Login Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@goalrush.com"
                    required
                  />
                </div>

                {/* 4. Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* 5. Title / Role */}
                <div className="space-y-2">
                  <Label htmlFor="titleRole">Journalist Title / Role</Label>
                  <Input
                    id="titleRole"
                    value={formData.titleRole}
                    onChange={e => setFormData({ ...formData, titleRole: e.target.value })}
                    placeholder="e.g. Transfer Specialist"
                  />
                </div>

                {/* 6. Avatar URL */}
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                  <Input
                    id="avatarUrl"
                    type="url"
                    value={formData.avatarUrl}
                    onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                {/* 7. Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Author Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief bio for the author page..."
                  />
                </div>

                {success && (
                  <Alert variant="default">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Creating Profile...' : 'Register Staff Member'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ACTIVE STAFF DIRECTORY */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" /> Active Staff Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStaff ? (
                <p className="text-slate-500 text-sm">Loading staff members...</p>
              ) : staff.length === 0 ? (
                <p className="text-slate-500 text-sm">No staff members registered.</p>
              ) : (
                <div className="space-y-4">
                  {staff.map(user => (
                    <div
                      key={user._id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 border border-slate-200 shrink-0">
                          {user.author?.avatarUrl ? (
                            <img src={user.author.avatarUrl} alt={user.author.name} className="h-full w-full object-cover" />
                          ) : (
                            user.author?.name ? user.author.name.charAt(0) : <UserIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {user.author?.name || 'Unlinked User'}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold text-green-600 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded">
                              {user.author?.role || user.role}
                            </span>
                            {user.author?.slug && (
                              <span className="text-[10px] text-slate-400">
                                /authors/{user.author.slug}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStaff(user._id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}