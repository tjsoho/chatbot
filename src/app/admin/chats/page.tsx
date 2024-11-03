'use client';

import ChatHistory from '@/components/AdminDashboard/ChatHistory';
import AdminAuthCheck from '@/components/AdminDashboard/AdminAuthCheck';

export default function ChatsPage() {
  return (
    <AdminAuthCheck>
      <ChatHistory />
    </AdminAuthCheck>
  );
} 