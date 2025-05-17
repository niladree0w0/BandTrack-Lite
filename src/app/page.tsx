
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  // Optional: Render a loading state or null while checking auth status
  if (isLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading application...</p>
        </div>
    );
  }

  return null; // Or a loading spinner
}
