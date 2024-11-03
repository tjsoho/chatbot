'use client';

/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminLogin from '@/components/AdminDashboard/AdminLogin';
import Link from 'next/link';
import BotConfiguration from "@/components/AdminDashboard/BotConfiguration";
import SatisfactionSummary from '@/components/AdminDashboard/SatisfactionSummary';
import TotalChatsCard from '@/components/AdminDashboard/TotalChatsCard';
import PeakUsage from '@/components/AdminDashboard/MetricCards/PeakUsage';
import GenderDistribution from '@/components/AdminDashboard/MetricCards/GenderDistribution';

/*********************************************************************
                            INTERFACES
*********************************************************************/
interface AdminUser {
  email: string | null;
  isAdmin?: boolean;
}

/*********************************************************************
                            COMPONENT
*********************************************************************/
export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && localStorage.getItem('adminAuth') === 'true') {
        setUser({
          email: firebaseUser.email,
          isAdmin: true
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (!user || !user.isAdmin) {
    return <AdminLogin onLogin={() => setLoading(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SatisfactionSummary />
          <TotalChatsCard />
          <PeakUsage />
          <GenderDistribution />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chat Management Card */}
          <Link href="/admin/chats" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Chat Management</h2>
              <p className="text-gray-600">View and manage user chat history</p>
            </div>
          </Link>

          {/* Chatbot Configuration Card */}
          <Link href="/admin/bot-config" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Chatbot Configuration</h2>
              <p className="text-gray-600">Configure AI chatbot settings and responses</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function BotConfigurationPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Bot Configuration</h1>
      <BotConfiguration />
    </main>
  );
} 