'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AdminAuthCheckProps {
  children: React.ReactNode;
}

export default function NewsBannerAuth({ children }: AdminAuthCheckProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && localStorage.getItem('adminAuth') === 'true') {
        setIsAuthed(true);
      } else {
        setIsAuthed(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !isAuthed) {
    return null;
  }

  return <>{children}</>;
} 