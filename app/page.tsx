
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user && !user.isProfileComplete) {
      router.push('/auth/complete-profile');
    } else {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text crimson-gradient mb-4">
          SorcererXStreme
        </h1>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
