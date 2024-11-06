"use client";

/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AdminLogin from "@/components/AdminDashboard/AdminLogin";
import Link from "next/link";
import SatisfactionSummary from "@/components/AdminDashboard/SatisfactionSummary";
import TotalChatsCard from "@/components/AdminDashboard/TotalChatsCard";
import PeakUsage from "@/components/AdminDashboard/MetricCards/PeakUsage";
import GenderDistribution from "@/components/AdminDashboard/MetricCards/GenderDistribution";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MessageSquare, Settings } from "lucide-react";

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

  // Style variables
  const gradientTextStyle = "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const cardTitleStyle = `text-2xl font-bold mb-2 ${gradientTextStyle}`;
  const cardContainerStyle = "bg-black rounded-[20px] p-6 group hover:bg-black/90 transition-all shadow-[0_0_10px_#0ff,0_0_20px_#f0f]";
  const iconStyle = {
    className: "w-16 h-16 mb-2",
    strokeWidth: 1.5,
    style: { stroke: 'url(#blue-pink-gradient)' }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin =
          typeof window !== "undefined"
            ? localStorage.getItem("adminAuth") === "true"
            : false;

        setUser({
          email: firebaseUser.email,
          isAdmin: isAdmin,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !user.isAdmin) {
    return <AdminLogin onLogin={() => setLoading(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-8 mb-8 items-center">
          <h1 className={`text-5xl font-bold mb-4 ${gradientTextStyle}`}>
            Admin Dashboard
          </h1>
          <p className="text-gray-200 text-lg">Welcome, {user.email}</p>
        </div>

        {/* All Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chat Management Card */}
          <div className={cardContainerStyle}>
            <Link href="/admin/chats" className="block h-full">
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <MessageSquare {...iconStyle} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="blue-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ff" />
                      <stop offset="100%" stopColor="#f0f" />
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <h2 className={cardTitleStyle}>View All Chats</h2>
                  <p className="text-gray-500">View and manage user chat history</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Chatbot Configuration Card */}
          <div className={cardContainerStyle}>
            <Link href="/admin/config" className="block h-full">
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <Settings {...iconStyle} />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="blue-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ff" />
                      <stop offset="100%" stopColor="#f0f" />
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <h2 className={cardTitleStyle}>Chatbot Training</h2>
                  <p className="text-gray-500">Configure AI chatbot settings and responses</p>
                </div>
              </div>
            </Link>
          </div>

          <TotalChatsCard />
          <SatisfactionSummary />
          <PeakUsage />
          <GenderDistribution />
        </div>
      </div>
    </div>
  );
}
