'use client';

import ChatHistory from '@/components/AdminDashboard/ChatHistory';
import AdminAuthCheck from '@/components/AdminDashboard/AdminAuthCheck';
import Sidebar from '@/components/Sidebar/Sidebar';
import NewsBanner from '@/components/NewsBanner/NewsBanner';
import { MessageSquare } from 'lucide-react';

export default function ChatsPage() {

  const gradientTextStyle = "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 text-transparent bg-clip-text";
  const iconStyle = {
    className: "w-16 h-16 mb-2",
    strokeWidth: 1.5,
    style: { stroke: "url(#blue-pink-gradient)" },
  };



  return (
    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <main className="flex-1 ml-20 2xl:ml-[10%] xl:ml-24 p-8">
        <AdminAuthCheck>
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center space-x-4">
              <MessageSquare {...iconStyle} />
              <h1 className={`text-5xl font-bold ${gradientTextStyle}`}>
                Chat History
              </h1>
              <svg width="0" height="0">
                <defs>
                  <linearGradient
                    id="blue-pink-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#0ff" />
                    <stop offset="100%" stopColor="#f0f" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="bg-black rounded-[20px] p-6 shadow-[0_0_10px_#0ff,0_0_20px_#f0f] group hover:bg-black/90 transition-all">
              <ChatHistory />
            </div>
          </div>
        </AdminAuthCheck>
        <NewsBanner />
      </main>
    </div>
  );
} 