'use client';

/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminLogin from './AdminLogin';
import { useRouter } from 'next/navigation';

/*********************************************************************
                            INTERFACES
*********************************************************************/
interface AdminAuthCheckProps {
  children: React.ReactNode;
}

/*********************************************************************
                            COMPONENT
*********************************************************************/
export default function AdminAuthCheck({ children }: AdminAuthCheckProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && localStorage.getItem('adminAuth') === 'true') {
        setIsAuthed(true);
      } else {
        setIsAuthed(false);
        router.push('/admin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
} 